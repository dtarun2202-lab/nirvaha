# Netflix-Inspired Wellness OTT - Integration & Setup Guide

## 🎯 Quick Start

The new Wellness OTT platform is now fully integrated into your Nirvaha application. Here's what you need to know:

## 📍 Access Points

### Main OTT Homepage
```
URL: http://localhost:5173/wellness-ott
```
This displays the cinematic hero banner with all series organized in Netflix-style rows.

### Series Details Page
```
URL: http://localhost:5173/wellness-ott/series/:seriesId
```
Shows all episodes for a specific series with play buttons.

### Audio Player
```
URL: http://localhost:5173/wellness-ott/player/:seriesId/:episodeId
```
Immersive fullscreen audio player with all controls.

## 🔧 Configuration

### 1. Update Series Data

Edit `src/data/wellnessSessions.ts` to ensure:

```typescript
// Make sure audioUrl points to your audio files
{
  id: "1",
  title: "Morning Calm",
  // ... other properties
  seasons: [
    {
      seasonNumber: 1,
      episodes: [
        {
          id: "1",
          title: "Morning Awakening",
          duration: "15 min",
          thumbnail: "image-url",
          description: "...",
          videoUrl: "path-to-audio.mp3" // ← IMPORTANT: Use audio URLs
        }
      ]
    }
  ]
}
```

### 2. Audio File Locations

Audio files can be:
- **Local**: `/audio/meditation.mp3` (in public folder)
- **Cloud**: `https://storage.example.com/audio.mp3`
- **Stream**: Any valid audio stream URL with CORS headers

### 3. Image Assets

Required images:
- `thumbnail`: Episode card image (recommended: 1280x720px)
- `banner`: Hero section image (recommended: 1920x1080px or 16:9 aspect ratio)

## 📝 File Structure

New files created:
```
frontend/src/
├── components/wellness-ott/
│   ├── HeroBanner.tsx              (Hero section)
│   ├── SeriesRow.tsx               (Scrollable rows)
│   ├── ContinueListeningSection.tsx (Resume card)
│   ├── AudioWaveform.tsx           (Visualizer)
│   ├── WellnessOTTAudioPlayer.tsx  (Player)
│   └── README.md                   (Component docs)
├── pages/
│   ├── WellnessOTTHome.tsx         (Homepage)
│   └── WellnessOTTSeriesDetails.tsx (Details page)
```

## 🎬 Component Usage Examples

### Displaying OTT in Dashboard

If you want to add the OTT player to another page:

```tsx
import WellnessOTTAudioPlayer from '../components/wellness-ott/WellnessOTTAudioPlayer';

export function SomeComponent() {
  return (
    <WellnessOTTAudioPlayer />
  );
}
```

### Linking to OTT

```tsx
import { useNavigate } from 'react-router-dom';

function MyComponent() {
  const navigate = useNavigate();
  
  const playEpisode = (seriesId, episodeId) => {
    navigate(`/wellness-ott/player/${seriesId}/${episodeId}`);
  };
  
  return (
    <button onClick={() => playEpisode('1', '1')}>
      Play Episode
    </button>
  );
}
```

## 💾 LocalStorage Keys

The app uses localStorage to save listening progress:

```javascript
// Key: 'continueListening'
// Value: JSON array of listening items
[
  {
    seriesId: '1',
    episodeId: '1',
    progress: 45, // percentage (0-100)
    timestamp: 1702570000000,
    seriesTitle: 'Morning Calm',
    episodeTitle: 'Morning Awakening',
    thumbnail: 'image-url'
  }
]
```

Access it programmatically:

```javascript
// Get all continue listening items
const items = JSON.parse(localStorage.getItem('continueListening') || '[]');

// Clear listening history
localStorage.removeItem('continueListening');
```

## 🎨 Customization

### Change Primary Color

Find all instances of `#2ed899` and replace with your color:

**Files to update:**
- `src/components/wellness-ott/HeroBanner.tsx`
- `src/components/wellness-ott/SeriesRow.tsx`
- `src/components/wellness-ott/ContinueListeningSection.tsx`
- `src/components/wellness-ott/WellnessOTTAudioPlayer.tsx`

### Change Hero Background Gradient

In `HeroBanner.tsx`:

```typescript
<div className="absolute inset-0 bg-gradient-to-r from-black via-black/50 to-transparent z-10" />
```

### Adjust Animations

Modify transition durations in any component:

```typescript
// Change from 0.6s to 0.3s
transition={{ duration: 0.3, ease: 'easeOut' }}
```

## 🚀 Performance Tips

1. **Optimize Images**
   - Use WebP format when possible
   - Compress thumbnails to under 500KB
   - Use responsive image sizes

2. **Audio Optimization**
   - Use compressed audio formats (MP3, OGG)
   - Serve from CDN for faster delivery
   - Implement progressive loading

3. **Code Splitting**
   - OTT routes are already in separate chunks
   - Load only when user navigates to `/wellness-ott`

4. **Lazy Loading**
   - Images load on scroll
   - Episodes load as series is selected

## 🔐 Security Considerations

1. **Audio URLs**
   - Use HTTPS for all URLs
   - Implement CORS headers if serving from different domain
   - Consider authentication if premium content

2. **Data Storage**
   - LocalStorage is not secure for sensitive data
   - Use encrypted storage or backend for user data
   - Clear sensitive data on logout

## 🐛 Troubleshooting

### Audio Not Playing
```
✓ Check console for errors (F12 → Console)
✓ Verify URL is valid and accessible
✓ Test URL directly in browser
✓ Check CORS headers if cross-origin
✓ Ensure audio format is supported
```

### Scrolling Issues
```
✓ Check CSS for hide-scrollbar class
✓ Verify overflow-x-auto is applied
✓ Test in different browsers
```

### Animations Not Smooth
```
✓ Reduce number of animated elements
✓ Use simpler animations on mobile
✓ Check GPU acceleration enabled
✓ Profile with DevTools Performance tab
```

### Route Not Found
```
✓ Verify App.tsx has correct imports
✓ Check route paths in App.tsx
✓ Clear browser cache
✓ Restart dev server
```

## 🔄 Backend Integration (Future)

When ready to integrate with backend:

```typescript
// Replace static data with API calls
const fetchSeries = async () => {
  const response = await fetch('/api/wellness-series');
  return response.json();
};

// Save listening progress to backend
const saveListeningProgress = async (data) => {
  await fetch('/api/listening-progress', {
    method: 'POST',
    body: JSON.stringify(data)
  });
};
```

## 📊 Analytics Integration

To track user listening:

```typescript
const trackPlayback = (seriesId, episodeId, duration) => {
  // Send to analytics service
  analytics.track('episode_played', {
    seriesId,
    episodeId,
    duration
  });
};
```

## 🎓 Learning Resources

- [Framer Motion Docs](https://www.framer.com/motion/)
- [Tailwind CSS](https://tailwindcss.com/)
- [React Router](https://reactrouter.com/)
- [HTML5 Audio API](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/audio)

## ✅ Pre-Launch Checklist

- [ ] All audio URLs configured and tested
- [ ] All series and episodes added to data
- [ ] Images optimized and compressed
- [ ] Colors customized to brand
- [ ] Routes tested and working
- [ ] Audio playback tested on all browsers
- [ ] Responsive design tested on mobile
- [ ] LocalStorage clearing on logout
- [ ] Analytics setup (if needed)
- [ ] Error handling tested
- [ ] Performance optimized
- [ ] Accessibility tested

## 📞 Support

For issues or questions:
1. Check the [Component README](./src/components/wellness-ott/README.md)
2. Review component source code for inline comments
3. Test in browser console for errors
4. Check network tab for failed requests

---

**Last Updated**: May 21, 2026
**Status**: Ready for Integration
