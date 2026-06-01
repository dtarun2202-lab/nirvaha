# 🧘 Nirvaha - Premium Spiritual Wellness Platform

> A full-stack wellness platform connecting users with meditation, sound healing, spiritual sessions, and wellness companions. Built with modern web technologies for a seamless user experience.

![Status](https://img.shields.io/badge/Status-Production%20Ready-brightgreen)
![Frontend](https://img.shields.io/badge/Frontend-React%2018%20%2B%20TypeScript-blue)
![Backend](https://img.shields.io/badge/Backend-Node.js%20%2B%20Express-green)
![Database](https://img.shields.io/badge/Database-MongoDB%20Atlas-green)

---

## ✨ Features

### 🎯 Core Functionality
- **User Authentication** - Secure JWT-based login with bcrypt password hashing
- **Admin Dashboard** - Comprehensive management interface for content and marketplace requests
- **Meditation Library** - Browse and play curated meditation sessions
- **Sound Healing** - Audio playback with real-time progress tracking
- **Marketplace** - Real-time submission and approval system for sessions, retreats, and products
- **Companion System** - Connect with wellness facilitators and mentors
- **Community Section** - User testimonials and spiritual community features
- **Gaming Hub** - Gamified wellness experiences
- **Real-time Sync** - Socket.IO for instant dashboard updates

### 🎨 UI/UX
- **Responsive Design** - Mobile, tablet, and desktop optimization
- **Tailwind CSS** - Utility-first styling framework
- **Framer Motion** - Smooth animations and transitions
- **Dark/Light Theme Support** - User preference persistence
- **Accessibility** - WCAG 2.1 AA compliance

### 🔧 Admin Features
- Content management (Meditations, Sound Healing)
- Marketplace request review and approval
- User companion application management
- Real-time dashboard refresh
- Bulk operations support

### 💳 Payment Integration
- INR (₹) currency support
- Flexible pricing for sessions and products
- Paid/free tier differentiation

---

## 🏗️ Tech Stack

### Frontend
```
React 18.2+           - UI framework
TypeScript5+          - Type safety
Vite                  - Lightning-fast build tool
Tailwind CSS          - Utility styling
Framer Motion         - Animations
Socket.IO Client      - Real-time communication
React Router          - Client-side routing
Lucide React          - Icon library
TailwindCSS Forms     - Form components
```

### Backend
```
Node.js 18+           - JavaScript runtime
Express 4+            - Web framework
MongoDB Atlas         - Cloud database
Mongoose 7+           - ODM for MongoDB
JWT                   - Authentication tokens
Bcryptjs              - Password hashing
Socket.IO             - Real-time updates
Multer                - File upload handling
CORS                  - Cross-origin requests
```

### Database
```
MongoDB Atlas         - Managed MongoDB service
Collections:
  - Users             - Authentication & profiles
  - Meditations       - Meditation content
  - Sounds            - Sound healing library
  - CompanionApps     - Companion applications
  - MarketplaceRequests - User submissions
  - Content           - Page content & settings
```

---

## 📦 Project Structure

```
nirvaha/
├── frontend/                          # React frontend application
│   ├── src/
│   │   ├── components/
│   │   │   ├── landing/              # Landing page components
│   │   │   ├── marketplace/          # Marketplace & forms
│   │   │   ├── dashboard/            # User dashboard
│   │   │   ├── common/               # Reusable components
│   │   │   └── ui/                   # UI components
│   │   ├── admin/
│   │   │   ├── components/           # Admin-specific components
│   │   │   ├── pages/                # Admin management pages
│   │   │   └── layout/               # Admin wrapper layout
│   │   ├── pages/                    # Page components
│   │   ├── contexts/                 # React contexts (Auth, Socket, etc.)
│   │   ├── hooks/                    # Custom React hooks
│   │   ├── lib/                      # Utilities & API functions
│   │   ├── config/                   # Configuration files
│   │   ├── styles/                   # Global styles
│   │   ├── App.tsx                   # Main app component
│   │   └── main.tsx                  # React entry point
│   ├── public/                        # Static assets
│   ├── build/                         # Production build output
│   ├── package.json                   # Dependencies
│   ├── tailwind.config.js             # Tailwind configuration
│   ├── vite.config.ts                 # Vite configuration
│   └── tsconfig.json                  # TypeScript configuration
│
├── backend/                           # Node.js/Express backend
│   ├── server.js                      # Main server file (1300+ lines)
│   ├── package.json                   # Dependencies
│   ├── uploads/                       # User file uploads
│   ├── data/                          # Data utilities
│   └── scripts/                       # Utility scripts
│
├── .env.example                       # Environment variables template
├── .gitignore                         # Git ignore rules
├── README.md                          # This file
├── QUICK_START.md                     # Quick setup guide
├── MARKETPLACE_SYNC_IMPLEMENTATION.md # Marketplace feature details
└── start-app.bat                      # Windows startup script

```

---

## 🚀 Getting Started

### Prerequisites
- **Node.js** 18.x or higher
- **npm** 9.x or higher
- **MongoDB Atlas** account (free tier available)
- **Git** for version control

### Installation

#### 1️⃣ Clone the Repository
```bash
git clone https://github.com/PreethamAnand/Nirvaha.git
cd Nirvaha
```

#### 2️⃣ Environment Setup
Create a `.env` file in the root directory:
```env
# Backend
PORT=5000
MONGODB_URI=your_mongodb_atlas_connection_string
JWT_SECRET=your_jwt_secret_key_change_this_in_production
NODE_ENV=development

# Frontend
VITE_API_URL=http://localhost:5000
```

#### 3️⃣ Install Dependencies

**Backend:**
```bash
cd backend
npm install
cd ..
```

**Frontend:**
```bash
cd frontend
npm install
cd ..
```

#### 4️⃣ Start the Application

**Using start script (Recommended):**
```bash
./start-app.bat  # Windows
# or
npm run start    # All platforms
```

**Or manually start both servers:**

Terminal 1 (Backend):
```bash
cd backend
npm start
# Server runs on http://localhost:5000
```

Terminal 2 (Frontend):
```bash
cd frontend
npm run dev
# Frontend runs on http://localhost:5173 or http://localhost:3000
```

### 🔐 Default Admin Credentials

For testing the admin panel:
- **Email:** `admin@nirvaha.com`
- **Password:** `N1rv@h@Adm!n#2025@Secure`

> ⚠️ **Security Note:** Change these credentials in production!

---

## 📚 API Endpoints

### Authentication
```
POST   /api/auth/register          - User registration
POST   /api/auth/login             - User login
```

### Content Management
```
GET    /api/meditations            - Fetch all meditations
POST   /api/meditations            - Create meditation (admin)
PUT    /api/meditations/:id        - Update meditation (admin)
DELETE /api/meditations/:id        - Delete meditation (admin)

GET    /api/sounds                 - Fetch all sound healing content
POST   /api/sounds                 - Create sound content (admin)
PUT    /api/sounds/:id             - Update sound content (admin)
DELETE /api/sounds/:id             - Delete sound content (admin)
```

### Companion System
```
GET    /api/companions             - Fetch all companions
GET    /api/companion-applications - Fetch applications
POST   /api/companion-applications - Submit companion application
GET    /api/companion-applications/:id - Get application details
PUT    /api/companion-applications/:id - Update application (admin)
DELETE /api/companion-applications/:id - Delete application
```

### Marketplace (Real-time Sync)
```
GET    /api/marketplace/requests             - Fetch all requests
GET    /api/marketplace/requests/:id         - Get single request
POST   /api/marketplace/requests             - Submit new item
PUT    /api/marketplace/requests/:id/approve - Approve item (admin)
DELETE /api/marketplace/requests/:id        - Delete request (admin)
```

### Content & Settings
```
GET    /api/content                - Fetch all page content
GET    /api/content/:key           - Get specific content
PUT    /api/content/:key           - Update content (admin)
POST   /api/content/upload         - Upload content image (admin)
```

### File Upload
```
POST   /api/upload                 - Upload file with multer
```

### Health Check
```
GET    /api/health                 - Server health status
```

---

## 🎯 Key Features Implementation

### 🔄 Real-time Marketplace Sync
Users submit marketplace items (sessions, retreats, products) which instantly appear in the admin dashboard:

```
User Form → MongoDB → Socket.IO Event → Admin Dashboard (Real-time Update)
         ↓
      localStorage (Fallback)
```

**Flow:**
1. User fills marketplace form and submits
2. Data POSTs to `/api/marketplace/requests`
3. Backend creates document in MongoDB with status="pending"
4. Socket.IO emits `marketplace-new-request` event
5. Admin dashboard receives event and refreshes
6. Admin clicks "Accept" → status changes to "approved"

### 🎵 Audio Playback
HTML5 audio element with:
- Real-time progress tracking using `currentTime`
- Clickable progress bar for seeking
- Volume control integration
- Duration display in MM:SS format
- Play/pause state synchronization

### 🔐 Authentication & Authorization
- JWT token stored in localStorage
- Bcrypt hashing (12 salt rounds) for passwords
- Role-based access (user/admin)
- Protected routes and endpoints

### 📱 Responsive Design
- Mobile-first approach
- Tailwind CSS breakpoints
- Flexible grid layouts
- Touch-friendly buttons and inputs

---

## 🧪 Testing the Features

### Test Marketplace Workflow
1. Navigate to Marketplace → "Add Item"
2. Select item type (Session/Retreat/Product)
3. Fill in all required fields
4. Click "Publish [Item]"
5. Go to Admin Dashboard → Marketplace Management
6. Verify item appears with "pending" status
7. Click "Accept" to approve
8. Watch status change to "approved"

### Test Real-time Updates
1. Open Admin Dashboard in Chrome Tab
2. Open Marketplace in Firefox Tab
3. Submit new item in Firefox
4. Chrome tab auto-updates (via Socket.IO)

### Test Offline Resilience
1. Stop backend server
2. Submit marketplace item (saves to localStorage)
3. Restart backend
4. Dashboard syncs MongoDB with localStorage data

---

## 📊 Database Schema

### User
```javascript
{
  id: String (UUID),
  name: String,
  email: String,
  password: String (hashed),
  role: "user" | "admin",
  profile: {
    mobile: String,
    age: String,
    gender: String,
    address: String,
    education: String,
    healthCondition: String
  },
  createdAt: Date,
  updatedAt: Date
}
```

### MarketplaceRequest
```javascript
{
  id: String (UUID),
  type: "session" | "retreat" | "product",
  status: "pending" | "approved",
  userId: String,
  data: Object (form data),
  approvedAt: Date,
  approvedBy: String,
  createdAt: Date,
  updatedAt: Date
}
```

### Meditation
```javascript
{
  id: String (UUID),
  title: String,
  duration: Number,
  level: String,
  category: String,
  description: String,
  status: String,
  thumbnailUrl: String,
  audioUrl: String,
  createdAt: Date,
  updatedAt: Date
}
```

---

## 🔧 Configuration

### Tailwind CSS
Custom color scheme configured in `tailwind.config.js`:
- Primary: `#1a5d47` (Teal/Green)
- Secondary: `#0f131a` (Dark)
- Accent: Various vibrant colors

### Socket.IO
Real-time events:
```javascript
// Server emits:
io.emit("marketplace-new-request", request)
io.emit("marketplace-request-approved", request)
io.emit("marketplace-request-deleted", {id})
io.emit("content-updated", {key, value})
```

### Multer Upload
- Max file size: 50MB
- Allowed types: Audio & Image files
- Storage location: `/backend/uploads`

---

## 🐛 Troubleshooting

### Issue: "Cannot connect to MongoDB"
**Solution:** 
- Verify `MONGODB_URI` in `.env` is correct
- Whitelist your IP in MongoDB Atlas
- Check internet connection

### Issue: "Port 5000 already in use"
**Solution:**
```bash
# Kill processes on port 5000
lsof -ti:5000 | xargs kill -9  # macOS/Linux
Get-Process -Id (Get-NetTCPConnection -LocalPort 5000).OwningProcess | Stop-Process  # Windows
```

### Issue: "Socket.IO connection refused"
**Solution:**
- Ensure backend is running on port 5000
- Check CORS settings in `server.js`
- Clear browser cache and hard refresh

### Issue: "Marketplace items not appearing"
**Solution:**
- Check browser console for errors
- Verify API endpoint in network tab
- Clear localStorage: `localStorage.clear()`
- Restart both frontend and backend

---

## 📈 Performance Optimization

### Frontend
- ✅ Code splitting with React.lazy()
- ✅ Image optimization with responsive formats
- ✅ Vite for fast dev server and optimized build
- ✅ Tree-shaking for unused code removal

### Backend
- ✅ Database indexing on frequently queried fields
- ✅ Pagination for large datasets
- ✅ Gzip compression enabled
- ✅ Socket.IO namespace partitioning

---

## 🔒 Security Features

- ✅ **Bcrypt Hashing** - Passwords hashed with 12 salt rounds
- ✅ **JWT Tokens** - Stateless authentication
- ✅ **CORS Protection** - Restricted to allowed domains
- ✅ **Environment Variables** - Secrets not in code
- ✅ **Input Validation** - Form and API validation
- ✅ **File Upload Safety** - Type and size restrictions

---

## 📝 Documentation Files

- **[QUICK_START.md](QUICK_START.md)** - Fast setup guide
- **[MARKETPLACE_SYNC_IMPLEMENTATION.md](MARKETPLACE_SYNC_IMPLEMENTATION.md)** - Marketplace feature details
- **[API_DOCUMENTATION.md](API_DOCUMENTATION.md)** - Detailed API reference
- **[ADMIN_PANEL_ENHANCEMENTS.md](ADMIN_PANEL_ENHANCEMENTS.md)** - Admin features

---

## 🚢 Deployment

### Prepare for Production
1. Update environment variables
2. Set `NODE_ENV=production`
3. Run `npm run build` in frontend
4. Use a process manager like PM2 for backend
5. Set up MongoDB Atlas production cluster
6. Configure HTTPS/SSL certificate

### Deployment Platforms
- **Frontend:** Netlify, Vercel, AWS S3 + CloudFront
- **Backend:** Heroku, Railway, AWS EC2, DigitalOcean
- **Database:** MongoDB Atlas (recommended)

---

## 🤝 Contributing

1. Create a feature branch: `git checkout -b feature/your-feature`
2. Commit changes: `git commit -am 'Add feature'`
3. Push branch: `git push origin feature/your-feature`
4. Submit pull request

---

## 📄 License

This project is licensed under the MIT License - see LICENSE file for details.

---

## 💡 Future Roadmap

- [ ] Payment gateway integration (Razorpay/Stripe)
- [ ] Email notifications for approvals
- [ ] User ratings and reviews
- [ ] Advanced search and filtering
- [ ] Mobile app (React Native)
- [ ] AI-powered recommendations
- [ ] Video streaming support
- [ ] Live session hosting
- [ ] Multi-language support
- [ ] Analytics dashboard

---

## 📞 Support & Contact

For issues, questions, or suggestions:
- **GitHub Issues:** [Create an Issue](https://github.com/PreethamAnand/Nirvaha/issues)
- **Email:** support@nirvaha.com

---

## 👏 Acknowledgments

- **Design:** Figma Design System - Premium Spiritual Wellness
- **Technologies:** React, Node.js, MongoDB, Socket.IO
- **Community:** All contributors and users

---

## 📊 Project Status

✅ **Complete Features:**
- User Authentication & Authorization
- Admin Dashboard with CRUD operations
- Meditation & Sound Healing libraries
- Real-time Marketplace Sync (localStorage + MongoDB + Socket.IO)
- Companion System with applications
- Community features
- Gaming hub integration
- File upload system
- Real-time audio playback
- Currency conversion (USD → INR)

🔄 **In Progress:**
- Payment gateway integration
- Email notifications
- Advanced filtering

📋 **Planned:**
- Mobile app
- AI recommendations
- Live sessions
- Video streaming

---

**Last Updated:** February 24, 2026  
**Version:** 1.0.0 - Production Ready

Made with 🧘 for spiritual wellness
