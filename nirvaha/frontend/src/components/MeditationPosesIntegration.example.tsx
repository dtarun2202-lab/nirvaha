import React from 'react';
import MeditationPosesCircle from './MeditationPosesCircle';

/**
 * Example: Integrating MeditationPosesCircle into an existing page
 * 
 * This shows how to add the meditation poses section to any page
 * with proper spacing and context.
 */

const ExampleIntegrationPage: React.FC = () => {
  return (
    <div className="min-h-screen">
      {/* Your existing page header */}
      <header className="bg-white shadow-sm">
        <div className="container mx-auto px-4 py-6">
          <h1 className="text-3xl font-light text-stone-800">
            Meditation & Wellness
          </h1>
          <p className="text-stone-600 mt-2">
            Discover inner peace through ancient practices
          </p>
        </div>
      </header>

      {/* Your existing content */}
      <section className="py-16 bg-stone-50">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-2xl font-light text-stone-800 mb-4">
                Begin Your Journey
              </h2>
              <p className="text-stone-600 leading-relaxed">
                Meditation is a practice that has been cultivated for thousands 
                of years. Each pose serves as a gateway to deeper awareness and 
                spiritual connection.
              </p>
            </div>
            <div className="bg-white rounded-2xl p-8 shadow-lg">
              <h3 className="text-xl font-medium text-stone-800 mb-4">
                Quick Start Guide
              </h3>
              <ul className="space-y-2 text-stone-600">
                <li>• Choose a comfortable pose</li>
                <li>• Focus on your breath</li>
                <li>• Start with 5-10 minutes</li>
                <li>• Practice regularly</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Meditation Poses Circle Component */}
      <MeditationPosesCircle />

      {/* Your existing footer content */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-2xl font-light text-stone-800 mb-4">
            Continue Your Practice
          </h2>
          <p className="text-stone-600 mb-8 max-w-2xl mx-auto">
            Ready to deepen your meditation journey? Explore our guided sessions, 
            community discussions, and personalized wellness plans.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <button className="px-6 py-3 bg-green-100 text-green-800 rounded-full hover:bg-green-200 transition-colors">
              Guided Sessions
            </button>
            <button className="px-6 py-3 bg-amber-100 text-amber-800 rounded-full hover:bg-amber-200 transition-colors">
              Join Community
            </button>
            <button className="px-6 py-3 bg-stone-100 text-stone-800 rounded-full hover:bg-stone-200 transition-colors">
              Personal Plan
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ExampleIntegrationPage;
