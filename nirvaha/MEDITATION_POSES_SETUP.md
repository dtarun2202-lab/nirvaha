# Meditation Poses Circle - Setup Guide

## 🧘‍♀️ Overview

A beautiful, animated circular meditation poses component has been created for the Nirvaha platform. It features:

- **8 meditation pose cards** rotating smoothly around a central Om symbol
- **Responsive design** that works on all devices
- **Interactive modals** with pose descriptions
- **Spiritual aesthetics** with soft colors and glowing effects
- **Smooth animations** including floating particles and breathing effects

## 📁 Files Created

```
Nirvaha/frontend/src/
├── components/
│   ├── MeditationPosesCircle.tsx              # Main component
│   ├── MeditationPosesCircle.README.md        # Detailed documentation
│   └── MeditationPosesIntegration.example.tsx # Integration example
├── pages/
│   └── MeditationDemo.tsx                     # Demo page
├── styles/
│   └── meditation-poses.css                   # Custom CSS animations
└── App.tsx                                    # Updated with new routes
```

## 🚀 How to View

### Option 1: Public Demo Route
Visit: `http://localhost:5173/meditation-poses-demo`

### Option 2: Dashboard Route (Requires Login)
Visit: `http://localhost:5173/dashboard/meditation-poses`

## 🛠️ Running the Project

1. **Navigate to frontend directory:**
   ```bash
   cd Nirvaha/frontend
   ```

2. **Install dependencies (if not already done):**
   ```bash
   npm install
   ```

3. **Start the development server:**
   ```bash
   npm run dev
   ```

4. **Open your browser:**
   - Go to `http://localhost:5173/meditation-poses-demo`
   - The component will load with smooth animations

## ✨ Features Demonstrated

### 🎯 Core Animations
- **Continuous Rotation**: Cards rotate clockwise around center (120s per rotation)
- **Counter Rotation**: Cards stay upright while rotating around circle
- **Floating Effect**: Each card has unique up/down floating motion
- **Breathing Center**: Om symbol gently scales and glows
- **Particle Effects**: Ambient floating particles in background

### 🎨 Visual Design
- **Color Palette**: Soft greens, beiges, and earthy tones
- **Glowing Effects**: Subtle shadows and radial gradients
- **Sacred Geometry**: Concentric rings with different rotation speeds
- **Responsive Layout**: Adapts radius and sizes for mobile/desktop

### 🖱️ Interactions
- **Hover Effects**: Cards scale and lift on hover
- **Click to View**: Modal with pose details and descriptions
- **Smooth Transitions**: All interactions use easing curves
- **Touch Friendly**: Optimized for mobile touch interactions

## 🎛️ Customization Options

### Change Animation Speed
```tsx
// In MeditationPosesCircle.tsx, modify:
transition={{ duration: 120 }} // Current: 2 minutes per rotation
// Change to 60 for faster, 240 for slower
```

### Update Meditation Poses
```tsx
// Edit the meditationPoses array:
const meditationPoses = [
  {
    id: 1,
    name: "Your Custom Pose",
    image: "🧘‍♀️", // Use emoji or image path
    description: "Your description here"
  }
];
```

### Modify Colors
```tsx
// Update Tailwind classes:
className="bg-gradient-to-br from-blue-50 via-purple-50 to-pink-100"
```

## 📱 Responsive Behavior

- **Desktop (>768px)**: Full size with 180px radius, 120px center
- **Mobile (<768px)**: Scaled down with 120px radius, 80px center
- **Automatic Adjustment**: Listens to window resize events

## 🔧 Technical Details

### Dependencies Used
- **Framer Motion**: For smooth animations and transitions
- **React Hooks**: useState, useEffect for responsive behavior
- **Tailwind CSS**: For styling and responsive design
- **TypeScript**: For type safety and better development experience

### Performance Optimizations
- **CSS Transforms**: Hardware-accelerated animations
- **Minimal Re-renders**: Optimized state management
- **Responsive Calculations**: Cached dimension calculations
- **Efficient Event Listeners**: Proper cleanup on unmount

## 🎨 Design Philosophy

The component embodies the spiritual essence of Nirvaha:

- **Circular Motion**: Represents the cyclical nature of life and breath
- **Sacred Geometry**: Concentric circles create harmony and balance
- **Gentle Movement**: Slow, meditative animations promote calmness
- **Natural Colors**: Earth tones connect users with nature
- **Minimalist Design**: Clean interface reduces visual distractions

## 🔄 Integration with Existing Pages

The component can be easily integrated into any existing page:

```tsx
import MeditationPosesCircle from './components/MeditationPosesCircle';

// Add anywhere in your JSX:
<MeditationPosesCircle />
```

See `MeditationPosesIntegration.example.tsx` for a complete integration example.

## 🐛 Troubleshooting

### Animation Not Smooth
- Ensure hardware acceleration is enabled in browser
- Check if other heavy processes are running
- Reduce particle count if needed

### Responsive Issues
- Clear browser cache and reload
- Check console for any JavaScript errors
- Verify Tailwind CSS is properly configured

### Modal Not Opening
- Check for JavaScript errors in console
- Ensure click events are not being prevented
- Verify React state is updating correctly

## 🎯 Next Steps

Consider these enhancements:
1. **Real Images**: Replace emoji with actual meditation pose photos
2. **Sound Integration**: Add ambient sounds or meditation bells
3. **Progress Tracking**: Save user's favorite poses
4. **Guided Sessions**: Link to actual meditation content
5. **Customization**: Allow users to personalize the experience

## 📞 Support

If you encounter any issues or need customizations, the component is well-documented and modular for easy modifications.