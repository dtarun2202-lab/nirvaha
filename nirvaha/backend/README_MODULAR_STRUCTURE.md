# Nirvaha Backend - Modular Structure

## Overview
This document outlines the refactored modular Express.js structure for the Nirvaha backend, combining functionality from two different server.js files into a clean, organized architecture.

## 📁 Directory Structure

```
backend/
├── server.js                 # Main server file (clean and minimal)
├── routes/                   # Route handlers
│   ├── authRoutes.js         # Authentication endpoints
│   ├── adminRoutes.js        # Admin dashboard endpoints
│   ├── meditationRoutes.js   # Meditation CRUD operations
│   ├── soundRoutes.js        # Sound CRUD operations
│   ├── companionRoutes.js    # Companion application management
│   ├── contentRoutes.js      # Content management system
│   ├── marketplaceRoutes.js  # Marketplace functionality
│   ├── bookingRoutes.js      # Booking system
│   └── utilityRoutes.js      # Health checks, uploads, etc.
├── models/                   # Database models
│   ├── User.js              # User schema and model
│   ├── Meditation.js        # Meditation schema and model
│   ├── Sound.js             # Sound schema and model
│   ├── CompanionApplication.js # Companion application model
│   ├── Content.js           # Content management model
│   ├── MarketplaceRequest.js # Marketplace request model
│   ├── MarketplaceItem.js   # Marketplace item model
│   ├── Booking.js           # Booking model
│   ├── Post.js              # Community post model
│   └── MentorProfile.js     # Mentor profile model
└── uploads/                 # File upload directory
```

## 🚀 API Endpoints

### Authentication Routes (`/api/auth`)
- `POST /register` - Register new user
- `POST /login` - User login
- `POST /logout` - User logout
- `GET /user` - Get current user profile

### Admin Routes (`/api/admin`)
- `GET /users` - Get users list (admin)
- `GET /stats` - Admin dashboard statistics
- `POST /clear-data` - Clear all data (development)

### Meditation Routes (`/api/meditations`)
- `GET /` - Get all meditations
- `POST /` - Create new meditation
- `PUT /:id` - Update meditation
- `DELETE /:id` - Delete meditation

### Sound Routes (`/api/sounds`)
- `GET /` - Get all sounds
- `POST /` - Create new sound
- `PUT /:id` - Update sound
- `DELETE /:id` - Delete sound

### Companion Routes (`/api/companion`)
- `GET /` - Get approved companions (public)
- `GET /applications` - Get all applications (admin)
- `GET /applications/:id` - Get single application
- `POST /applications` - Create new application
- `PUT /applications/:id` - Update application
- `PATCH /applications/:id/status` - Update application status
- `DELETE /applications/:id` - Delete application

### Content Management Routes (`/api/content`)
- `GET /` - Get all content (public)
- `GET /:key` - Get content by key
- `GET /admin/all` - Get all content for admin
- `PUT /:key` - Create/update content
- `POST /upload` - Upload image content
- `DELETE /:key` - Delete content

### Marketplace Routes (`/api/marketplace`)
- `GET /requests` - Get marketplace requests (admin)
- `GET /requests/:id` - Get single request
- `POST /requests` - Create new request
- `PUT /requests/:id/approve` - Approve request
- `DELETE /requests/:id` - Delete request
- `GET /items` - Get approved items (public)
- `PUT /items/:id/complete` - Complete item

### Booking Routes (`/api/bookings`)
- `POST /` - Create new booking
- `GET /` - Get all bookings (admin)

### Utility Routes (`/api`)
- `GET /health` - Health check
- `POST /upload` - File upload

## 🔧 Key Features

### 1. Modular Architecture
- **Separation of Concerns**: Each route file handles specific functionality
- **Reusable Components**: Models can be imported across multiple routes
- **Easy Maintenance**: Changes to specific features are isolated

### 2. Database Integration
- **MongoDB Support**: Full MongoDB integration with Mongoose
- **Local Fallback**: In-memory database for development when MongoDB unavailable
- **Seeding**: Automatic seeding of initial data (admin users, community posts, mentors)

### 3. File Upload System
- **Multer Integration**: Configured for audio and image files
- **Size Limits**: 50MB file size limit
- **File Type Validation**: Only audio and image files allowed

### 4. Real-time Features
- **Socket.IO**: Real-time updates for admin notifications
- **Event Emission**: Live updates for new applications, bookings, content changes

### 5. Authentication & Security
- **JWT Tokens**: Secure authentication with JSON Web Tokens
- **Password Hashing**: bcrypt for secure password storage
- **Role-based Access**: Admin and user roles

### 6. Error Handling
- **Consistent Error Responses**: Standardized error format
- **Try-Catch Blocks**: Proper error handling throughout
- **Validation**: Input validation for all endpoints

## 🗄️ Database Models

### User Model
- Authentication data (email, password, role)
- Profile information (mobile, age, gender, etc.)
- Wellness statistics (sessions, streak, minutes, etc.)

### Content Models
- **Meditation**: Audio content with metadata
- **Sound**: Healing sounds with mood categorization
- **Content**: Dynamic content management system

### Community Models
- **Post**: Community posts with comments and likes
- **MentorProfile**: Mentor information for sidebar display

### Business Models
- **CompanionApplication**: Wellness companion applications
- **MarketplaceRequest/Item**: Marketplace functionality
- **Booking**: Session and product bookings

## 🚀 Getting Started

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (optional - falls back to local DB)
- Environment variables configured

### Environment Variables
```env
PORT=5000
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
```

### Installation & Run
```bash
cd backend
npm install
node server.js
```

### Default Credentials
- **Admin Email**: admin@nirvaha.com
- **Admin Password**: N1rv@h@Adm!n#2025@Secure
- **User Email**: gayarsathvika@gmail.com
- **User Password**: sathvika123

## 🔄 Migration Notes

### What Was Merged
1. **Frontend/Backend Base Server**: Core functionality, authentication, content management
2. **Admin Panel Backend**: Admin-specific endpoints, booking system, marketplace

### What Was Preserved
- ✅ All existing API endpoints
- ✅ Authentication system
- ✅ File upload functionality
- ✅ Socket.IO real-time features
- ✅ Database schemas and relationships
- ✅ Error handling patterns
- ✅ CORS configuration

### What Was Improved
- 🔄 Modular route structure
- 🔄 Organized model definitions
- 🔄 Cleaner main server file
- 🔄 Better separation of concerns
- 🔄 Easier maintenance and scaling

## 🧪 Testing

The server has been tested and confirmed working:
- ✅ Server starts successfully
- ✅ MongoDB connection established
- ✅ Local admin user initialization
- ✅ Socket.IO functionality
- ✅ All routes properly mounted

## 📝 Next Steps

1. **API Documentation**: Consider adding Swagger/OpenAPI documentation
2. **Testing Suite**: Add unit and integration tests
3. **Environment Config**: Separate development and production configs
4. **Rate Limiting**: Add API rate limiting for security
5. **Logging**: Implement structured logging system

## 🔍 Route Compatibility

All existing frontend code will continue to work without changes:
- Legacy `/api/upload` endpoint preserved
- Same response formats maintained
- Identical authentication flow
- Compatible Socket.IO events

This modular structure provides a solid foundation for future development while maintaining full backward compatibility.
