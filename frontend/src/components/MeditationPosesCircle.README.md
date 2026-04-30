# Meditation Poses Circle Component

A beautiful, animated circular layout component for displaying meditation poses with a spiritual, calming design.

## Features

- **Circular Animation**: 8 meditation pose cards rotate smoothly around a central Om symbol
- **Responsive Design**: Adapts to mobile and desktop screens
- **Interactive**: Click on any pose card to view details in a modal
- **Spiritual Aesthetics**: Soft green, beige, and earthy tones with glowing effects
- **Smooth Animations**: Continuous rotation, floating effects, and breathing animations
- **Accessibility**: Keyboard navigation and screen reader friendly

## Usage

```tsx
import MeditationPosesCircle from './components/MeditationPosesCircle';

function App() {
  return (
    <div>
      <MeditationPosesCircle />
    </div>
  );
}
```

## Customization

### Changing Meditation Poses

Edit the `meditationPoses` array in the component:

```tsx
const meditationPoses: MeditationPose[] = [
  {
    id: 1,
    name: "Your Pose Name",
    image: "🧘‍♀️", // Emoji or image path
    description: "Description of the pose"
  },
  // Add more poses...
];
```

### Adjusting Animation Speed

Modify the rotation duration in the motion components:

```tsx
// Slower rotation (240 seconds = 4 minutes)
transition={{ duration: 240, repeat: Infinity, ease: "linear" }}

// Faster rotation (60 seconds = 1 minute)  
transition={{ duration: 60, repeat: Infinity, ease: "linear" }}
```

### Changing Colors

Update the color scheme by modifying Tailwind classes:

```tsx
// Background gradient
className="bg-gradient-to-br from-blue-50 via-purple-50 to-pink-100"

// Card colors
className="bg-gradient-to-br from-blue-200 via-white to-purple-200"
```

### Responsive Breakpoints

Adjust the responsive radius and sizes:

```tsx
const updateDimensions = () => {
  const isMobile = window.innerWidth < 768;
  const isTablet = window.innerWidth < 1024;
  
  setDimensions({
    radius: isMobile ? 100 : isTablet ? 150 : 200,
    centerSize: isMobile ? 60 : isTablet ? 90 : 120
  });
};
```

## Animation Details

- **Main Rotation**: 120 seconds for full circle (2 minutes)
- **Counter Rotation**: Cards rotate opposite to stay upright
- **Floating Effect**: Each card has a unique floating pattern
- **Breathing Center**: Om symbol gently scales and glows
- **Particle Effects**: Ambient floating particles in background

## Dependencies

- React 18+
- Framer Motion 12+
- Tailwind CSS 3+
- TypeScript (optional but recommended)

## File Structure

```
src/
├── components/
│   └── MeditationPosesCircle.tsx
├── styles/
│   └── meditation-poses.css
└── pages/
    └── MeditationDemo.tsx
```

## Routes

The component is available at:
- `/meditation-poses-demo` (public route)
- `/dashboard/meditation-poses` (authenticated route)

## Performance Notes

- Uses CSS transforms for smooth 60fps animations
- Responsive design prevents layout shifts
- Optimized for both mobile and desktop performance
- Minimal re-renders with proper React optimization

## Accessibility

- Keyboard navigation support
- Screen reader friendly labels
- High contrast ratios for text
- Focus indicators for interactive elements
- Semantic HTML structure

## Browser Support

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## License

Part of the Nirvaha project - spiritual wellness platform.