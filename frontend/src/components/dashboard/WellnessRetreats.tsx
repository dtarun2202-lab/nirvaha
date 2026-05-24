import React, { useState, useEffect, useRef } from 'react';
import { ChevronLeft, ChevronRight, ArrowUpRight } from 'lucide-react';
import { motion } from 'motion/react';
import BACKEND_CONFIG from '@/config/backend';

interface Retreat {
  _id: string;
  category: string;
  title: string;
  description: string;
  image: string;
  externalLink: string;
  buttonLabel: string;
  displayOrder: number;
}

export const WellnessRetreats = () => {
  const [retreats, setRetreats] = useState<Retreat[]>([]);
  const [loading, setLoading] = useState(true);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  useEffect(() => {
    const fetchRetreats = async () => {
      try {
        const response = await fetch(`${BACKEND_CONFIG.API_BASE_URL}/api/wellness-retreats`);
        if (response.ok) {
          const data = await response.json();
          setRetreats(data.retreats || []);
        }
      } catch (error) {
        console.error('Error fetching retreats:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchRetreats();
  }, []);

  const updateScrollButtons = () => {
    const el = scrollContainerRef.current;
    if (!el) return;
    setCanScrollLeft(el.scrollLeft > 10);
    setCanScrollRight(el.scrollLeft + el.clientWidth < el.scrollWidth - 10);
  };

  useEffect(() => {
    const el = scrollContainerRef.current;
    if (!el) return;
    el.addEventListener('scroll', updateScrollButtons, { passive: true });
    updateScrollButtons();
    return () => el.removeEventListener('scroll', updateScrollButtons);
  }, [retreats]);

  const handleScroll = (direction: 'left' | 'right') => {
    if (scrollContainerRef.current) {
      const cardWidth = scrollContainerRef.current.clientWidth * 0.45;
      const offset = direction === 'left' ? -cardWidth : cardWidth;
      scrollContainerRef.current.scrollBy({ left: offset, behavior: 'smooth' });
    }
  };

  if (loading) {
    return (
      <section className="py-20 bg-[#F5F0E8] min-h-[40vh] flex items-center justify-center">
        <div className="text-center">
          <div className="w-10 h-10 border-4 border-[#1a5d47] border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-400 font-medium tracking-wide text-sm">Discovering retreats...</p>
        </div>
      </section>
    );
  }

  if (retreats.length === 0) return null;

  return (
    <section className="bg-[#F7F3EC] py-16 md:py-24 overflow-hidden relative">

      {/* Soft background texture */}
      <div className="absolute inset-0 pointer-events-none opacity-40"
        style={{
          backgroundImage: `radial-gradient(circle at 20% 50%, #d4e9d8 0%, transparent 50%),
                            radial-gradient(circle at 80% 20%, #e8f5e1 0%, transparent 40%)`
        }}
      />

      <div className="relative z-10 max-w-[1440px] mx-auto px-6 md:px-12">

        {/* ── Centered Section Header ── */}
        <motion.div
          className="text-center mb-12 md:mb-16"
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
        >
          <p className="text-[#1a5d47] text-xs font-bold uppercase tracking-[0.25em] mb-4">
            Nirvaha Escapes
          </p>
          <h2
            className="text-4xl md:text-5xl lg:text-6xl font-bold text-[#1a1a1a] tracking-tight mb-5 leading-tight"
            style={{ fontFamily: "'Cinzel', serif" }}
          >
            Find your next Retreat
          </h2>
          <p className="text-gray-500 text-base md:text-lg max-w-2xl mx-auto leading-relaxed">
            Join real people who create real connections. Experience meditation, yoga, and
            wellness in extraordinary locations worldwide.
          </p>
        </motion.div>

        {/* ── Slider Controls Row ── */}
        <div className="flex items-center justify-end mb-6 gap-3">
          <button
            onClick={() => handleScroll('left')}
            disabled={!canScrollLeft}
            className={`w-11 h-11 rounded-full border flex items-center justify-center transition-all duration-200 ${
              canScrollLeft
                ? 'border-[#1a5d47] text-[#1a5d47] hover:bg-[#1a5d47] hover:text-white'
                : 'border-gray-200 text-gray-300 cursor-not-allowed'
            }`}
            aria-label="Previous"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button
            onClick={() => handleScroll('right')}
            disabled={!canScrollRight}
            className={`w-11 h-11 rounded-full border flex items-center justify-center transition-all duration-200 ${
              canScrollRight
                ? 'border-[#1a5d47] text-[#1a5d47] hover:bg-[#1a5d47] hover:text-white'
                : 'border-gray-200 text-gray-300 cursor-not-allowed'
            }`}
            aria-label="Next"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>

        {/* ── Horizontal Card Scroller ── */}
        <div
          ref={scrollContainerRef}
          className="flex gap-5 overflow-x-auto snap-x snap-mandatory cursor-grab active:cursor-grabbing pb-4"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {retreats.map((retreat, idx) => (
            <motion.div
              key={retreat._id}
              className="flex-shrink-0 snap-start"
              style={{ width: 'clamp(280px, 42vw, 560px)' }}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ delay: idx * 0.08, duration: 0.55 }}
            >
              <a
                href={retreat.externalLink || '#'}
                target={retreat.externalLink ? '_blank' : '_self'}
                rel="noopener noreferrer"
                className="group block relative rounded-[20px] overflow-hidden bg-gray-100 shadow-md hover:shadow-2xl transition-all duration-500"
              >
                {/* Image */}
                <div className="aspect-[4/3] relative overflow-hidden">
                  <img
                    src={retreat.image}
                    alt={retreat.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                    loading="lazy"
                  />

                  {/* Dark gradient overlay — bottom half */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />

                  {/* Category label at BOTTOM of image */}
                  <div className="absolute bottom-0 left-0 right-0 px-6 py-5">
                    <span className="block text-white/70 text-[10px] font-bold uppercase tracking-[0.2em] mb-1">
                      {retreat.category}
                    </span>
                    <h3 className="text-white text-xl md:text-2xl font-bold leading-snug tracking-tight">
                      {retreat.title}
                    </h3>
                  </div>

                  {/* Arrow icon top-right on hover */}
                  <div className="absolute top-4 right-4 w-9 h-9 rounded-full bg-white/0 group-hover:bg-white/90 flex items-center justify-center transition-all duration-300 scale-75 group-hover:scale-100">
                    <ArrowUpRight className="w-4 h-4 text-[#1a5d47] opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  </div>
                </div>

                {/* Card Footer – description + CTA */}
                {(retreat.description || retreat.buttonLabel) && (
                  <div className="bg-white px-6 py-5 flex items-center justify-between gap-4">
                    {retreat.description && (
                      <p className="text-gray-500 text-sm leading-relaxed line-clamp-2 flex-1">
                        {retreat.description}
                      </p>
                    )}
                    <span className="flex-shrink-0 inline-flex items-center gap-1.5 text-[#1a5d47] font-semibold text-xs uppercase tracking-widest border border-[#1a5d47]/30 rounded-full px-4 py-2 group-hover:bg-[#1a5d47] group-hover:text-white group-hover:border-transparent transition-all duration-300 whitespace-nowrap">
                      {retreat.buttonLabel || 'Explore'}
                      <ArrowUpRight className="w-3.5 h-3.5" />
                    </span>
                  </div>
                )}
              </a>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
};
