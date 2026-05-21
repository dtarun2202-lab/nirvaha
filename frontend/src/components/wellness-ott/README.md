# Netflix-Inspired Wellness OTT Audio Platform

A premium, immersive audio wellness streaming platform inspired by Netflix, featuring series-based audio episodes, cinematic UI, and advanced playback controls.

## 🎬 Overview

Nirvaha Wellness OTT is a sophisticated audio streaming platform that delivers wellness content (meditation, sleep stories, anxiety relief, etc.) through a Netflix-inspired interface. The platform focuses on **audio-first experience** with cinematic design, premium animations, and intuitive controls.

## ✨ Key Features

### 1. **Cinematic Hero Banner**
- Fullscreen featured series display
- Dynamic background image with gradient overlays
- Play button and "More Info" button
- Series metadata (match %, year, rating)
- Smooth parallax animations
- Floating glow effects for immersive feel

### 2. **Netflix-Style Series Rows**
- Horizontally scrollable episode cards
- Multiple series organized by category
- Automatic fade overlays for infinite scroll effect
- Smooth scale and opacity hover animations
- Episode thumbnails with instant details

### 3. **Episode Cards**
- Thumbnail image
- Episode title and duration
- Mood tags (e.g., "Calm", "Focused")
- Play button on hover
- Responsive sizing (portrait/landscape)
- Quick access to playback

### 4. **Immersive Audio Player**
- Fullscreen player with dynamic background
- **Animated waveform visualizer** that reacts to audio
- Full playback controls:
  - Play/Pause
  - Skip Forward/Back
  - Volume control with mute
  - Seek bar with time tracking
  - Playback speed (0.75x, 1x, 1.25x, 1.5x, 2x)
  - Repeat modes (off, all, one)
  - Favorite button

### 5. **Continue Listening**
- Resume recent episodes
- Progress tracking (saved to localStorage)
- Visual progress bar
- Quick resume button

### 6. **Series Details Page**
- All episodes displayed vertically
- Season selector for multi-season series
- Expandable episode details
- Play buttons for instant access
- Series metadata and description

### 7. **Auto Episode Flow**
- Automatic countdown to next episode
- Skip or cancel overlay
- Continuous listening experience
- Repeat mode respect

## 🎨 Design System

### Colors
- **Primary Green**: `#2ed899` (Wellness accent)
- **Dark Green**: `#1ab87e` (Hover/active states)
- **Black**: `#000000` (Deep background)
- **White**: Various opacity levels for depth

### Typography
- **Bold, sans-serif** fonts for impact
- **Tracking-widest** uppercase for labels
- **Large, readable** text hierarchy
- **Clean, minimal** approach

### Effects
- **Blur overlays** for premium feel
- **Gradient layers** for depth
- **Smooth animations** (Framer Motion)
- **Glow effects** on interactive elements
- **Parallax movement** for depth

## 📁 File Structure

```
src/
├── components/wellness-ott/
│   ├── HeroBanner.tsx              # Featured series banner
│   ├── SeriesRow.tsx               # Horizontal scrollable rows
│   ├── ContinueListeningSection.tsx # Resume section
│   ├── AudioWaveform.tsx           # Animated visualizer
│   └── WellnessOTTAudioPlayer.tsx  # Main player component
├── pages/
│   ├── WellnessOTTHome.tsx         # Homepage with hero + rows
│   └── WellnessOTTSeriesDetails.tsx # Series details
└── data/
    └── wellnessSessions.ts          # Series and episode data
```

## 🗺️ Routes

```
/wellness-ott                    → Homepage (Hero + Series Rows)
/wellness-ott/home              → Same as above
/wellness-ott/series/:seriesId  → Series details page
/wellness-ott/player/:seriesId/:episodeId → Audio player
```

## 💾 Data Structure

### Series
```typescript
{
  id: string;
  title: string;
  category: string;
  mood: string[];
  tags: string[];
  duration: string;
  thumbnail: string;
  banner: string;
  description: string;
  match: string;
  year: string;
  rating: string;
  type: 'Series' | 'Film';
  isOriginal?: boolean;
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

### Continue Listening
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

## 🚀 Getting Started

### Prerequisites
- React 18.3+
- Tailwind CSS
- Framer Motion (v12+)
- Lucide React (icons)

### Installation

1. **Ensure dependencies are installed:**
```bash
npm install framer-motion lucide-react
```

2. **Update your data file** (`src/data/wellnessSessions.ts`):
   - Make sure `videoUrl` points to audio files
   - Add series with seasons and episodes
   - Include thumbnail and banner images

3. **Start the app:**
```bash
npm run dev
```

4. **Navigate to:**
   - Homepage: `http://localhost:5173/wellness-ott`
   - Series: `http://localhost:5173/wellness-ott/series/1`
   - Player: `http://localhost:5173/wellness-ott/player/1/1`

## 🎵 Audio Implementation

The platform uses HTML5 audio elements for playback:

```typescript
<audio
  ref={audioRef}
  src={audioUrl}
  onLoadedMetadata={handleLoadedMetadata}
  onTimeUpdate={handleTimeUpdate}
  onEnded={handleEnded}
/>
```

**Audio URLs Format:**
- Local: `/audio/meditation.mp3`
- Cloud: `https://example.com/audio/meditation.mp3`
- Stream: Any valid audio stream URL

## 💾 Local Storage

The app automatically saves listening progress:

```javascript
// Continue Listening items stored as JSON
localStorage.setItem('continueListening', JSON.stringify([
  {
    seriesId: '1',
    episodeId: '1',
    progress: 45, // percentage
    timestamp: 1702570000000,
    seriesTitle: 'Morning Calm',
    episodeTitle: 'Morning Awakening',
    thumbnail: 'url...'
  }
]))
```

## 🎬 Animation Details

### Framer Motion Animations
- **Entrance animations**: Fade + scale up
- **Hover animations**: Scale 1.05-1.1
- **Waveform**: Continuous height animation
- **Transitions**: 0.3-0.8s easing
- **Stagger**: Offset delays for cascade effect

### CSS Effects
- **Gradient overlays**: `bg-gradient-to-*`
- **Blur backgrounds**: `backdrop-blur-md`
- **Glow effects**: `shadow-[0_0_40px_rgba(...)]`
- **Smooth transitions**: `transition-all duration-300`

## 🔧 Customization

### Changing Colors
Update the color values in components:
```typescript
// Primary green
className="bg-[#2ed899]"

// Hover state
className="hover:bg-[#24c281]"

// Dark overlay
className="bg-gradient-to-b from-black/40 via-black/60 to-black/80"
```

### Adjusting Animations
Modify Framer Motion props:
```typescript
<motion.div
  animate={{ scale: 1.05 }}
  transition={{ duration: 0.6, ease: 'easeOut' }}
/>
```

### Responsive Breakpoints
Uses Tailwind's md/lg breakpoints:
- `md:` - Tablet (768px+)
- `lg:` - Desktop (1024px+)

## 🚨 Common Issues

### Audio Not Playing
- Check `videoUrl` points to valid audio file
- Ensure CORS headers are correct for remote URLs
- Test URL directly in browser

### Animations Laggy
- Reduce number of elements on screen
- Use `will-change: transform` in CSS
- Check GPU acceleration in browser

### LocalStorage Not Working
- Check browser privacy settings
- Ensure localStorage quota not exceeded
- Clear browser cache if needed

## 📊 Performance Optimization

- **Lazy loading**: Images load on scroll
- **Code splitting**: Components loaded on route change
- **Memoization**: useMemo for expensive calculations
- **Ref optimization**: useRef for non-state updates

## 🔮 Future Enhancements

- [ ] Backend API integration
- [ ] User authentication
- [ ] Listening analytics
- [ ] Recommendations engine
- [ ] Offline downloads
- [ ] Multiple audio quality options
- [ ] Lyrics/transcript display
- [ ] Social sharing
- [ ] Push notifications
- [ ] Advanced search/filtering

## 📝 Component Props

### HeroBanner
```typescript
interface HeroBannerProps {
  series: WellnessSession;
}
```

### SeriesRow
```typescript
interface SeriesRowProps {
  title: string;
  sessions: WellnessSession[];
  isOriginals?: boolean;
}
```

### ContinueListeningSection
```typescript
interface ContinueListeningSectionProps {
  items: ContinueListeningItem[];
}
```

## 🤝 Integration Notes

- Replace old OTT components if needed
- Existing routes are preserved for backward compatibility
- Audio URLs should be set in data file
- localStorage key: `'continueListening'`
- Theming uses Tailwind classes (no CSS modules needed)

## 📄 License

Part of Nirvaha Wellness Platform

---

**Build Date**: May 2026
**Version**: 1.0.0
**Status**: Production Ready
