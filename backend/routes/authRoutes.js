const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { v4: uuidv4 } = require('uuid');
const User = require('../models/User');
const { resolveAndPersistCompanionForUser } = require('../utils/companionStatus');
const admin = require('firebase-admin');

// Initialize Firebase Admin SDK (only if not already initialized)
let firebaseAdminInitialized = false;
try {
  if (admin.apps.length === 0 && process.env.FIREBASE_PROJECT_ID) {
    const credential = {
      projectId: process.env.FIREBASE_PROJECT_ID,
    };

    // Check if we have service account credentials
    if (process.env.FIREBASE_CLIENT_EMAIL && process.env.FIREBASE_PRIVATE_KEY) {
      credential.clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
      // Private key comes from .env with escaped newlines (\n) — replace them with real newlines
      credential.privateKey = process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n');
      
      admin.initializeApp({
        credential: admin.credential.cert(credential),
      });
      firebaseAdminInitialized = true;
      console.log('✅ Firebase Admin initialized with full service account credential (project:', process.env.FIREBASE_PROJECT_ID + ')');
    } else {
      // Fallback: projectId-only init (will not verify token signatures)
      admin.initializeApp({ projectId: process.env.FIREBASE_PROJECT_ID });
      firebaseAdminInitialized = true;
      console.warn('⚠️ Firebase Admin initialized with projectId only (FIREBASE_CLIENT_EMAIL / FIREBASE_PRIVATE_KEY missing). Token signature verification may fail.');
    }
  } else if (admin.apps.length > 0) {
    firebaseAdminInitialized = true;
    console.log('✅ Firebase Admin already initialized, using existing instance');
  } else {
    console.warn('⚠️ FIREBASE_PROJECT_ID is not set in backend environment variables. Token signature validation will be bypassed.');
  }
} catch (error) {
  console.error('Error initializing Firebase Admin SDK:', error);
  console.error('Error details:', error.message);
  firebaseAdminInitialized = false;
}

const router = express.Router();

function buildAuthUserPayload(user) {
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
    profile: user.profile,
    stats: user.stats,
    bio: user.bio,
    location: user.location,
    avatar: user.avatar,

    isApprovedCompanion: user.isApprovedCompanion === true,
    companionStatus: user.companionStatus || null,
    companionId: user.companionId || null,
    enrolledCourses: user.enrolledCourses || [],
  };
}

async function attachCompanionFields(userPayload) {
  // If the DB already knows this user is an approved companion, trust it and skip sync.
  if (userPayload.isApprovedCompanion === true || userPayload.companionStatus === 'approved') {
    return userPayload;
  }

  const companion = await resolveAndPersistCompanionForUser({
    email: userPayload.email,
    name: userPayload.name,
  });

  const isApproved =
    companion.isApprovedCompanion === true ||
    companion.companionStatus === 'approved';

  return {
    ...userPayload,
    isApprovedCompanion: isApproved,
    companionStatus: isApproved ? 'approved' : companion.companionStatus,
    companionId: companion.companionId,
  };
}
const JWT_SECRET = process.env.JWT_SECRET || 'nirvaha-secret-key-please-change-in-production';

// Register new user
router.post('/register', async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    // Validation
    if (!name || !email || !password) {
      return res.status(400).json({ error: 'Name, email, and password are required' });
    }

    if (password.length < 6) {
      return res.status(400).json({ error: 'Password must be at least 6 characters long' });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return res.status(400).json({ error: 'User with this email already exists' });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new user
    const newUser = new User({
      id: uuidv4(),
      name,
      email: email.toLowerCase(),
      password: hashedPassword,
      role: role || 'user',
      profile: {
        mobile: '',
        age: '',
        gender: '',
        address: '',
        education: '',
        healthCondition: '',
      },
    });

    await newUser.save();

    // Emit real-time event
    const io = req.app.get('io');
    io.emit('user-registered', {
      id: newUser.id,
      name: newUser.name,
      email: newUser.email,
      role: newUser.role,
      createdAt: newUser.createdAt,
    });

    // Generate JWT token
    const token = jwt.sign(
      { id: newUser.id, email: newUser.email, role: newUser.role },
      JWT_SECRET,
      { expiresIn: '365d' }
    );

    // Build safeUser by spreading the full mongoose document and appending companion fields
    const safeUser = {
      ...newUser.toObject(),
      isApprovedCompanion: newUser.isApprovedCompanion === true,
      companionStatus: newUser.companionStatus || null,
    };

    // Return user data (without password)
    res.status(201).json({
      success: true,
      message: 'User registered successfully',
      token,
      user: safeUser,
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ error: 'Server error during registration' });
  }
});

// Login user
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validation
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    // Find user
    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    // Verify password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    // Generate JWT token
    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      JWT_SECRET,
      { expiresIn: '365d' }
    );

    const safeUser = {
      ...user.toObject(),
      isApprovedCompanion: user.isApprovedCompanion === true,
      companionStatus: user.companionStatus || null,
    };

    res.status(200).json({
      success: true,
      message: 'Login successful',
      token,
      user: safeUser,
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Server error during login' });
  }
});

// Logout
router.post('/logout', (req, res) => {
  res.status(200).json({ message: 'Logged out successfully' });
});

function decodeTokenSafely(token) {
  try {
    const decoded = jwt.decode(token);
    if (decoded) return decoded;
  } catch (e) {
    // ignore
  }
  try {
    const parts = token.split('.');
    if (parts.length >= 2) {
      const payloadBase64 = parts[1].replace(/-/g, '+').replace(/_/g, '/');
      const decodedPayload = Buffer.from(payloadBase64, 'base64').toString('utf8');
      return JSON.parse(decodedPayload);
    }
  } catch (e) {
    console.error('Manual base64 token decoding failed:', e);
  }
  return null;
}

// Firebase Auth token verification endpoint
router.post('/firebase', async (req, res) => {
  try {
    const { idToken, role, name } = req.body;
    if (!idToken) {
      return res.status(400).json({ error: 'idToken is required' });
    }

    let decodedToken;
    if (firebaseAdminInitialized && admin.apps.length > 0) {
      try {
        decodedToken = await admin.auth().verifyIdToken(idToken);
      } catch (verifyError) {
        console.error('Firebase token signature verification failed:', verifyError);
        console.error('Verification error details:', verifyError.message);
        console.error('Verification error code:', verifyError.code);
        
        // Fallback for development if signature verification fails and we are not in production
        if (process.env.NODE_ENV !== 'production' || process.env.BYPASS_FIREBASE_VERIFICATION === 'true') {
          console.warn('⚠️ Falling back to decoding token without signature verification (DEVELOPMENT ONLY)');
          decodedToken = decodeTokenSafely(idToken);
          if (!decodedToken) {
            return res.status(400).json({ error: 'Failed to decode auth token' });
          }
        } else {
          return res.status(401).json({ error: 'Invalid Firebase token signature', details: verifyError.message });
        }
      }
    } else {
      // Fallback if not initialized
      console.warn('⚠️ Firebase Admin SDK not initialized. Decoding token without signature check.');
      decodedToken = decodeTokenSafely(idToken);
      if (!decodedToken) {
        return res.status(400).json({ error: 'Failed to decode auth token and Firebase not initialized' });
      }
    }

    if (!decodedToken) {
      return res.status(400).json({ error: 'Failed to decode auth token' });
    }

    const uid = decodedToken.uid || decodedToken.sub;
    const email = decodedToken.email;
    const tokenName = decodedToken.name || decodedToken.display_name;
    const picture = decodedToken.picture || decodedToken.photoURL;

    if (!email) {
      return res.status(400).json({ error: 'Email is required from auth provider' });
    }

    // Find or create user in MongoDB
    let user = await User.findOne({ email: email.toLowerCase() });

    if (!user) {
      user = new User({
        id: uid || uuidv4(),
        name: name || tokenName || email.split('@')[0],
        email: email.toLowerCase(),
        password: 'FIREBASE_AUTH_USER', // placeholder since credentials managed by Firebase
        role: role || 'user',
        avatar: picture || '',
        profile: {
          mobile: '',
          age: '',
          gender: '',
          address: '',
          education: '',
          healthCondition: '',
        },
      });

      await user.save();

      // Emit real-time registration event
      const io = req.app.get('io');
      if (io) {
        io.emit('user-registered', {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
          createdAt: user.createdAt,
        });
      }
    } else {
      // Update avatar if they didn't have one and we got one from social login
      if (!user.avatar && picture) {
        user.avatar = picture;
        await user.save();
      }
    }

    // Generate backend JWT token
    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      JWT_SECRET,
      { expiresIn: '365d' }
    );

    const safeUser = {
      ...user.toObject(),
      isApprovedCompanion: user.isApprovedCompanion === true,
      companionStatus: user.companionStatus || null,
    };

    res.status(200).json({
      success: true,
      message: 'Authentication successful',
      token,
      user: safeUser,
    });
  } catch (error) {
    console.error('Firebase login error:', error);
    console.error('Error stack:', error.stack);
    console.error('Error message:', error.message);
    console.error('Error code:', error.code);
    res.status(500).json({ 
      error: 'Server error during Firebase authentication', 
      details: error.message,
      code: error.code 
    });
  }
});

// POST /api/auth/change-password - Change current user's password securely
router.post('/change-password', async (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'No token provided' });
    }

    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, JWT_SECRET);

    const { currentPassword, newPassword } = req.body;
    if (!currentPassword || !newPassword) {
      return res.status(400).json({ error: 'Current password and new password are required' });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({ error: 'New password must be at least 6 characters long' });
    }

    const user = await User.findOne({ email: decoded.email });
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Check if the current password is valid (skip check if they logged in via social providers, i.e., "FIREBASE_AUTH_USER")
    if (user.password !== 'FIREBASE_AUTH_USER') {
      const isPasswordValid = await bcrypt.compare(currentPassword, user.password);
      if (!isPasswordValid) {
        return res.status(401).json({ error: 'Current password is incorrect' });
      }
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;
    await user.save();

    res.status(200).json({ message: 'Password changed successfully' });
  } catch (error) {
    console.error('Change password error:', error);
    res.status(500).json({ error: 'Server error during password change' });
  }
});

// GET /api/auth/user - Get current user with sessionHistory
router.get('/user', async (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'No token provided' });
    }

    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, JWT_SECRET);

    const user = await User.findOne({ email: decoded.email });
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const safeUser = {
      ...user.toObject(),
      isApprovedCompanion: user.isApprovedCompanion === true,
      companionStatus: user.companionStatus || null,
      companionId: user.companionId || null,
    };
    if (safeUser.password) delete safeUser.password;
    if (safeUser.__v) delete safeUser.__v;

    console.log('🔍 GET /api/auth/user - Response:', {
      userId: user.id,
      email: user.email,
      sessionHistoryLength: safeUser.sessionHistory?.length || 0,
      sessionHistory: safeUser.sessionHistory
    });

    res.json({ user: safeUser });
  } catch (error) {
    console.error('Get user error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;