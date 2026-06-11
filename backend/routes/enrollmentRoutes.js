const express = require('express');
const router = express.Router();
const User = require('../models/User');
const { authenticateJWT } = require('../middleware/auth');

/**
 * POST /api/enrollments/enroll
 * Enroll the authenticated user in a course
 */
router.post('/enroll', authenticateJWT, async (req, res) => {
  try {
    const { courseId } = req.body;
    if (!courseId) {
      return res.status(400).json({ error: 'courseId is required' });
    }

    const userId = req.user.id;
    const user = await User.findOne({ id: userId });
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Check if already enrolled
    const alreadyEnrolled = user.enrolledCourses && user.enrolledCourses.some(e => e.courseId === courseId);
    if (alreadyEnrolled) {
      return res.json({ success: true, message: 'Already enrolled', alreadyEnrolled: true });
    }

    // Add enrollment
    await User.findOneAndUpdate(
      { id: userId },
      { $push: { enrolledCourses: { courseId, enrolledAt: new Date() } } },
      { new: true }
    );

    res.json({ success: true, message: 'Enrolled successfully', courseId });
  } catch (err) {
    console.error('Enrollment error:', err);
    res.status(500).json({ error: 'Server error during enrollment' });
  }
});

/**
 * GET /api/enrollments/my-courses
 * Returns all course IDs the authenticated user is enrolled in
 */
router.get('/my-courses', authenticateJWT, async (req, res) => {
  try {
    const userId = req.user.id;
    const user = await User.findOne({ id: userId }).select('enrolledCourses');
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const enrolledCourses = user.enrolledCourses || [];
    res.json({ success: true, enrolledCourses });
  } catch (err) {
    console.error('Get enrolled courses error:', err);
    res.status(500).json({ error: 'Server error fetching enrollments' });
  }
});

/**
 * GET /api/enrollments/status/:courseId
 * Check if the authenticated user is enrolled in a specific course
 */
router.get('/status/:courseId', authenticateJWT, async (req, res) => {
  try {
    const { courseId } = req.params;
    const userId = req.user.id;

    const user = await User.findOne({ id: userId }).select('enrolledCourses');
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const isEnrolled = (user.enrolledCourses || []).some(e => e.courseId === courseId);
    res.json({ success: true, isEnrolled, courseId });
  } catch (err) {
    console.error('Enrollment status error:', err);
    res.status(500).json({ error: 'Server error checking enrollment status' });
  }
});

module.exports = router;
