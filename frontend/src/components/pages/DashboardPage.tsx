import { useEffect, useState } from "react";

import heroBg from "../../assets/meditation/hero-bg1.jpg";
import heroBg1 from "../../assets/meditation/hero-bg.jpg";
import heroBg2 from "../../assets/meditation/hero-bg2.jpg";

import { FeaturesBentoGrid } from "../dashboard/FeaturesBentoGrid";
import { CommonProblems } from "../dashboard/CommonProblems";
import { WellnessOTT } from "../dashboard/WellnessOTT";
import { InspirationalQuotes } from "../dashboard/InspirationalQuotes";
import { CaseStudies } from "../dashboard/CaseStudies";
import { FAQSection } from "../dashboard/FAQSection";
import { DashboardFooter } from "../dashboard/DashboardFooter";

export function DashboardPage() {
  const slides = [
    {
      image: heroBg,
      title: "Begin Your Wellness Journey",
      desc: "Discover guided meditation, mindful healing, and inner balance through Nirvaha’s modern wellness platform.",
      button: "Explore Now",
    },
    {
      image: heroBg1,
      title: "Find Calm In Every Breath",
      desc: "Experience deep relaxation, stress relief, and peaceful living with personalized wellness sessions.",
      button: "Start Healing",
    },
    {
      image: heroBg2,
      title: "Reconnect Mind, Body & Soul",
      desc: "Transform your lifestyle with guided practices, inner peace, and daily wellness inspiration.",
      button: "Join Today",
    },
  ];

  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000);

    return () => clearInterval(timer);
  }, [slides.length]);

  return (
    <div className="w-full overflow-x-hidden bg-[#EEF6F2]">
      {/* HERO SECTION */}
      <section className="h-screen relative overflow-hidden">
        {/* Slides */}
        {slides.map((slide, index) => (
          <div
            key={index}
            className={`absolute inset-0 transition-opacity duration-1000 ${
              index === currentSlide ? "opacity-100 z-10" : "opacity-0 z-0"
            }`}
          >
            <div
              className="w-full h-full bg-cover bg-center"
              style={{
                backgroundImage: `url(${slide.image})`,
              }}
            />
            <div className="absolute inset-0 bg-teal-900/40"></div>
          </div>
        ))}

        {/* Glass Box */}
        <div className="absolute left-28 top-[56%] -translate-y-1/2 z-20 w-[620px] rounded-[32px] border border-white/20 bg-white/10 backdrop-blur-xl shadow-2xl px-12 py-14">
          <h1 className="text-white text-5xl font-bold leading-tight mb-6">
            {slides[currentSlide].title}
          </h1>

          <p className="text-white/90 text-xl leading-relaxed mb-8">
            {slides[currentSlide].desc}
          </p>

          <button className="bg-emerald-700 hover:bg-emerald-800 text-white px-8 py-4 rounded-full text-lg font-semibold transition-all duration-300">
            {slides[currentSlide].button}
          </button>

          {/* Dots */}
          <div className="flex gap-3 mt-8">
            {slides.map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrentSlide(i)}
                className={`h-3 rounded-full transition-all duration-300 ${
                  i === currentSlide ? "w-8 bg-white" : "w-3 bg-white/40"
                }`}
              />
            ))}
          </div>
        </div>
      </section>

      {/* BELOW SECTIONS */}
      <div className="bg-[#D7EDE3] py-12"></div>

      <FeaturesBentoGrid />
      <CommonProblems />
      <WellnessOTT />
      <InspirationalQuotes />
      <CaseStudies />
      <FAQSection />
      <DashboardFooter />
    </div>
  );
}