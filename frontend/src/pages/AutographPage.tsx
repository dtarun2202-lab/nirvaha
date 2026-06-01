import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import SEOHead from '../components/common/SEOHead';
import { AutographApp } from '../components/add-your-autograph/AutographApp';

const AutographPage: React.FC = () => {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen relative pt-24 pb-12 font-sans overflow-hidden bg-black">
            {/* Background Image & Overlay */}
            <div 
                className="absolute inset-0 z-0 bg-cover bg-center bg-no-repeat bg-fixed opacity-30"
                style={{ backgroundImage: 'url("/add your signature.png")' }}
            />
            <div className="absolute inset-0 z-0 bg-gradient-to-b from-black/80 via-black/95 to-black" />
            
            <SEOHead 
                title="Add Your Autograph - Nirvaha" 
                description="Personalize beautiful statement cards about ancient India with your own signature autograph." 
            />
            
            <div className="container relative z-10 mx-auto px-4 max-w-7xl">
                {/* Back Navigation */}
                <button 
                    onClick={() => navigate('/dashboard/overview')}
                    className="flex items-center text-gray-400 hover:text-white transition-colors mb-8 group"
                >
                    <ArrowLeft className="w-5 h-5 mr-2 group-hover:-translate-x-1 transition-transform" />
                    Back to Arcade
                </button>

                {/* Main App Container */}
                <AutographApp />
            </div>
        </div>
    );
};

export default AutographPage;
