# 🎯 Quick Reference - Wellness OTT

## 🚀 Live URLs

| Page | URL | Purpose |
|------|-----|---------|
| Homepage | `/wellness-ott` | Hero + Series Rows |
| Series Details | `/wellness-ott/series/1` | All episodes |
| Audio Player | `/wellness-ott/player/1/1` | Play audio |
| Alternate | `/wellness-ott/home` | Homepage |

## 📂 New Files Created

```
src/components/wellness-ott/
├── HeroBanner.tsx              (335 lines) - Featured series banner
├── SeriesRow.tsx               (200 lines) - Scrollable series cards
├── ContinueListeningSection.tsx (135 lines) - Resume card
├── AudioWaveform.tsx           (25 lines) - Waveform visualizer
├── WellnessOTTAudioPlayer.tsx  (510 lines) - Main player
└── README.md                   - Component documentation

src/pages/
├── WellnessOTTHome.tsx         (80 lines) - Homepage logic
└── WellnessOTTSeriesDetails.tsx (320 lines) - Series page

Modified Files:
├── App.tsx                     - Added new imports and routes
├── src/index.css               - Added .hide-scrollbar utility

Documentation:
├── WELLNESS_OTT_INTEGRATION.md - Integration guide
├── WELLNESS_OTT_FEATURES.md    - Feature showcase
└── This file - Quick reference
```

## 🎨 Color Reference

```css
/* Primary Colors */
#2ed899  → Green (primary, buttons, accents)
#1ab87e  → Dark Green (hover, active)
#24c281  → Medium Green
#000000  → Black (background)
#ffffff  → White (text)

/* Opacity Usage */
white/5  → 5% opacity (subtle borders)
white/10 → 10% opacity (hover)
white/30 → 30% opacity (strong)
black/60 → 60% opacity (overlays)
```

## 📊 Key Interfaces

### WellnessSession
```typescript
{
  id: string;
  title: string;
  category: string;
  mood: string[];
  duration: string;
  thumbnail: string;
  banner: string;
  description: string;
  type: 'Series' | 'Film';
  seasons?: Season[];
}
```

### Episode
```typescript
{
  id: string;
  title: string;
  duration: string;
  thumbnail: string;
  description: string;
  videoUrl: string; // Audio URL
}
```

### ContinueListeningItem
```typescript
{
  seriesId: string;
  episodeId: string;
  progress: number; // 0-100
  timestamp: number;
  seriesTitle: string;
  episodeTitle: string;
  thumbnail: string;
}
```

## ⌨️ Navigation Patterns

### Link to Series
```jsx
<button onClick={() => navigate(`/wellness-ott/series/${seriesId}`)}>
  View Series
</button>
```

### Link to Player
```jsx
<button onClick={() => navigate(`/wellness-ott/player/${seriesId}/${episodeId}`)}>
  Play Episode
</button>
```

### Go Back
```jsx
<button onClick={() => navigate(-1)}>
  Back
</button>
```

## 🎬 Component Import Reference

```typescript
// Homepage with hero + rows
import WellnessOTTHome from '@/pages/WellnessOTTHome';

// Series details page
import WellnessOTTSeriesDetails from '@/pages/WellnessOTTSeriesDetails';

// Audio player
import WellnessOTTAudioPlayer from '@/components/wellness-ott/WellnessOTTAudioPlayer';

// Individual components
import HeroBanner from '@/components/wellness-ott/HeroBanner';
import SeriesRow from '@/components/wellness-ott/SeriesRow';
import ContinueListeningSection from '@/components/wellness-ott/ContinueListeningSection';
import AudioWaveform from '@/components/wellness-ott/AudioWaveform';
```

## 🎯 Tailwind Classes Used

```
Spacing:    px-6 md:px-12 lg:px-16, gap-4 md:gap-6
Size:       w-full h-screen aspect-video aspect-[2/3]
Colors:     bg-black text-white bg-[#2ed899]
Borders:    border rounded-lg border-white/10
Effects:    shadow-lg backdrop-blur-md
Display:    flex items-center justify-between
Responsive: md: lg: (768px and 1024px breakpoints)
```

## 🔊 Audio Player Controls

| Control | Icon | Action |
|---------|------|--------|
| Play/Pause | ▶️/⏸️ | Toggle playback |
| Skip Back | ⏮️ | Previous or restart |
| Skip Forward | ⏭️ | Next episode |
| Volume | 🔊 | Adjust volume |
| Mute | 🔇 | Toggle mute |
| Repeat | 🔄 | Cycle repeat modes |
| Speed | 1x | Change playback speed |
| Favorite | ❤️ | Mark as favorite |

## 💾 LocalStorage Operations

### Save Progress
```javascript
const item = {
  seriesId: '1',
  episodeId: '1',
  progress: 45,
  timestamp: Date.now(),
  seriesTitle: 'Morning Calm',
  episodeTitle: 'Morning Awakening',
  thumbnail: 'url'
};

const items = JSON.parse(localStorage.getItem('continueListening') || '[]');
items.push(item);
localStorage.setItem('continueListening', JSON.stringify(items));
```

### Load Progress
```javascript
const items = JSON.parse(localStorage.getItem('continueListening') || '[]');
const recent = items.sort((a, b) => b.timestamp - a.timestamp)[0];
```

### Clear Progress
```javascript
localStorage.removeItem('continueListening');
```

## 🎨 Customization Quick Tips

### Change Button Color
```typescript
// Find: className="bg-[#2ed899]"
// Replace: className="bg-[your-color]"
// Don't forget hover state: hover:bg-[darker-version]
```

### Add New Series Category
```typescript
// In WellnessOTTHome.tsx
const categories = [
  'Meditation',
  'Sleep Stories',
  'Stress Relief',
  'Emotional Healing',
  'Anxiety Relief',
  'Your New Category' // Add here
];
```

### Adjust Animation Speed
```typescript
// Change duration (in seconds)
transition={{ duration: 0.6 }} // 0.6s
transition={{ duration: 0.3 }} // 0.3s (faster)
transition={{ duration: 1.0 }} // 1.0s (slower)
```

### Change Grid Layout
```typescript
// In SeriesRow.tsx
className="w-[280px] md:w-[320px] lg:w-[380px]"
// Adjust width values for different card sizes
```

## 🔗 API Integration Template

When ready to connect to backend:

```typescript
// Replace static data loading
async function fetchSeries() {
  const res = await fetch('/api/wellness-series');
  return res.json();
}

// Save listening progress
async function saveProgress(progress) {
  await fetch('/api/listening-progress', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(progress)
  });
}

// Get user's continue listening
async function getContinueListening() {
  const res = await fetch('/api/continue-listening');
  return res.json();
}
```

## 📱 Mobile Optimization Checklist

- ✅ Responsive text sizes (md:, lg: breakpoints)
- ✅ Touch-friendly button sizes (44px minimum)
- ✅ Readable line heights (leading-relaxed)
- ✅ Proper spacing (gap-4 md:gap-6)
- ✅ Mobile-first approach
- ✅ No horizontal scrolling (except rows)
- ✅ Readable fonts (no smaller than sm)
- ✅ Full-width usage on mobile

## 🐛 Debugging Tips

### Check Console
```javascript
// See if component mounted
console.log('Component mounted', element);

// Check localStorage
console.log(JSON.parse(localStorage.getItem('continueListening')));

// Check audio status
console.log(audioRef.current.currentTime);
```

### React DevTools
- Inspect component props
- Check state values
- Profile performance
- Check render causes

### Browser DevTools
- Network tab: Check audio URL
- Console: Check for errors
- Performance: Check FPS
- Elements: Inspect styles

## 📚 Documentation Files

| File | Purpose |
|------|---------|
| `README.md` (in wellness-ott/) | Component API docs |
| `WELLNESS_OTT_INTEGRATION.md` | Integration guide |
| `WELLNESS_OTT_FEATURES.md` | Feature showcase |
| This file | Quick reference |

## ⚡ Performance Tips

1. **Image Optimization**
   - Use WebP format
   - Compress to < 500KB
   - Serve from CDN

2. **Audio Files**
   - Use MP3 or OGG
   - Keep file size reasonable
   - Stream from CDN

3. **Code**
   - Use React.lazy() for routes
   - Memoize expensive components
   - Avoid unnecessary renders

4. **Bundle**
   - Code splitting enabled
   - Tree shaking active
   - No unused dependencies

## 🎓 Learning Path

1. **Start**: Visit `/wellness-ott` homepage
2. **Explore**: Click different series
3. **Listen**: Play an episode
4. **Customize**: Change colors/animations
5. **Integrate**: Connect to backend
6. **Deploy**: Push to production

## 📞 Need Help?

1. Check the documentation files
2. Review component source code
3. Check browser console for errors
4. Test audio URLs manually
5. Profile with DevTools

---

**Created**: May 21, 2026
**Status**: ✅ Complete & Ready
**Version**: 1.0.0
