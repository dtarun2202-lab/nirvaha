import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import SEOHead from '../components/common/SEOHead';
import { TempleApp } from '../components/temple-of-balance/TempleApp';

const TempleOfBalancePage: React.FC = () => {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen relative pt-24 pb-12 font-sans overflow-hidden">
            {/* Background Image & Overlay */}
            <div 
                className="absolute inset-0 z-0 bg-cover bg-center bg-no-repeat bg-fixed opacity-30"
                style={{ backgroundImage: 'url("/temple of balance.png")' }}
            />
            <div className="absolute inset-0 z-0 bg-gradient-to-b from-black/80 via-black/95 to-black" />
            <SEOHead 
                title="Temple of Balance - Nirvaha" 
                description="A strategy puzzle game to restore harmony across your life's essential pillars." 
            />
            
            <div className="container relative z-10 mx-auto px-4 max-w-6xl">
                {/* Back Navigation */}
                <button 
                    onClick={() => navigate('/dashboard/overview')}
                    className="flex items-center text-gray-400 hover:text-white transition-colors mb-8 group"
                >
                    <ArrowLeft className="w-5 h-5 mr-2 group-hover:-translate-x-1 transition-transform" />
                    Back to Arcade
                </button>

                {/* Main App Container */}
                <TempleApp />
            </div>
        </div>
    );
};

export default TempleOfBalancePage;
