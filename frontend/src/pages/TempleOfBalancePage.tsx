import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import SEOHead from '../components/common/SEOHead';
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import SEOHead from '../components/common/SEOHead';
import { TempleApp } from '../components/temple-of-balance/TempleApp';
import { QuitConfirmationModal } from '../components/common/QuitConfirmationModal';
import { GameLoaderWrapper } from '../components/common/GameLoaderWrapper';

const TempleOfBalancePage: React.FC = () => {
    const navigate = useNavigate();
    const [isQuitModalOpen, setIsQuitModalOpen] = React.useState(false);
    const [isGameOver, setIsGameOver] = React.useState(false);

    return (
        <GameLoaderWrapper title="Temple of Balance" themeColor="#B45309">
            <div className="min-h-screen relative pt-24 pb-12 font-sans overflow-hidden">
                {/* Background Image & Overlay */}
                <div 
                    className="absolute inset-0 z-0 bg-cover bg-center bg-no-repeat bg-fixed opacity-30"
                    style={{ backgroundImage: 'url("/temple of balance.png")' }}
                />
                <div className="absolute inset-0 z-0 bg-gradient-to-b from-[#3b1b03]/90 via-black/95 to-black" />
                <SEOHead 
                    title="Temple of Balance - Nirvaha" 
                    description="A strategy puzzle game to restore harmony across your life's essential pillars." 
                />
                
                <div className="container relative z-10 mx-auto px-4 max-w-6xl">
                    {/* Back Navigation */}
                    <button 
                        onClick={() => setIsQuitModalOpen(true)}
                        className="flex items-center text-gray-400 hover:text-white transition-colors mb-8 group"
                    >
                        <ArrowLeft className="w-5 h-5 mr-2 group-hover:-translate-x-1 transition-transform" />
                        Back to Arcade
                    </button>

                    <QuitConfirmationModal 
                        isOpen={isQuitModalOpen}
                        onClose={() => setIsQuitModalOpen(false)}
                        onConfirm={() => navigate('/dashboard')}
                        isGameOver={isGameOver}
                    />

                    {/* Main App Container */}
                    <TempleApp onGameOver={setIsGameOver} />
                </div>
            </div>
        </GameLoaderWrapper>
    );
};

export default TempleOfBalancePage;
