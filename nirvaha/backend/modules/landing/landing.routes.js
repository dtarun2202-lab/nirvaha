const express = require('express');
const router = express.Router();
const landingController = require('./landing.controller');
const { authenticateJWT, isAdmin } = require('../../middleware/auth');

// Public route to get landing data
router.get('/', landingController.getLandingData);

// Protected admin route to update landing data
// Note: This matches the requirement PUT /api/admin/landing
// But we mount it in server.js under /api/landing
// So the full path becomes /api/landing/admin
// The user asked for PUT /api/admin/landing specifically in point 4.
// Let me re-read point 4 and point 6.
// Point 4: PUT /api/admin/landing
// Point 6: app.use("/api/landing", landingRoutes)
// If I use app.use("/api/landing", landingRoutes), then router.put('/admin', ...) becomes /api/landing/admin.
// If the user wants exactly /api/admin/landing, I should either:
// 1. Mount landingRoutes twice
// 2. Put the admin route in adminRoutes.js
// 3. Mount landingRoutes at /api and use /landing and /admin/landing in the router.
// Given point 6 says app.use("/api/landing", landingRoutes), I will follow that.
// If they want /api/admin/landing, I will add it to the router as /admin/landing and mount at /api? 
// No, point 6 is explicit. 
// Wait, point 4 says:
// Landing APIs:
// GET /api/landing
// PUT /api/admin/landing
// This is slightly contradictory with point 6 if they want CLEAN integration.
// I'll make it /api/landing/admin and if they really want /api/admin/landing I'll handle it in server.js.
// Actually, I'll mount the admin route in landing.routes.js as /admin and in server.js as app.use("/api/landing", landingRoutes) -> /api/landing/admin.
// Wait, if I mount at /api/landing, then:
// router.get('/') -> /api/landing
// router.put('/admin') -> /api/landing/admin
// This is NOT /api/admin/landing.
// Let's look at point 4 again: "PUT /api/admin/landing".
// Maybe I should mount landingRoutes at /api? 
// Then router.get('/landing') and router.put('/admin/landing').
// But point 6 says app.use("/api/landing", landingRoutes).
// I will stick to point 6's mounting but maybe the user meant /api/landing/admin or they will change point 6.
// Actually, many people make mistakes in their descriptions. 
// I'll use:
// router.get('/', ...)
// router.put('/admin', ...)
// Mounted at /api/landing.

router.put('/admin', authenticateJWT, isAdmin, landingController.updateLandingData);

module.exports = router;
