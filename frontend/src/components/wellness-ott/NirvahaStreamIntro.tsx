import { useEffect, useRef, useCallback } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';

export default function NirvahaStreamIntro() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const seriesId = searchParams.get('seriesId');
  const videoRef = useRef<HTMLVideoElement>(null);
  const didNavigate = useRef(false);

  const goToContent = useCallback(() => {
    if (didNavigate.current) return;
    didNavigate.current = true;
    if (seriesId) {
      navigate(`/wellness-ott/series/${seriesId}`, { replace: true });
    } else {
      navigate('/wellness-ott', { replace: true });
    }
  }, [navigate, seriesId]);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    // Auto-play the video
    video.play().catch(() => {
      // Autoplay was blocked — navigate immediately as fallback
      goToContent();
    });

    // Navigate when the video naturally ends
    video.addEventListener('ended', goToContent);

    // Safety fallback — if video stalls or errors, skip after 8s
    const fallbackTimer = setTimeout(goToContent, 8000);

    return () => {
      video.removeEventListener('ended', goToContent);
      clearTimeout(fallbackTimer);
    };
  }, [goToContent]);

  return (
    <div className="fixed inset-0 z-[9999] bg-black overflow-hidden flex items-center justify-center">
      <video
        ref={videoRef}
        src="/WhatsApp Video 2026-06-10 at 11.22.33 AM.mp4"
        className="w-full h-full object-cover"
        autoPlay
        muted
        playsInline
        preload="auto"
      />
    </div>
  );
}
