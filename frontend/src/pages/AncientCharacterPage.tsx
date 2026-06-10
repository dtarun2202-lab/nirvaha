import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import SEOHead from '../components/common/SEOHead';
import { AncientCharacterApp } from '../components/ancient-character/AncientCharacterApp';
import { QuitConfirmationModal } from '../components/common/QuitConfirmationModal';
import { GameLoaderWrapper } from '../components/common/GameLoaderWrapper';

const AncientCharacterPage: React.FC = () => {
    const navigate = useNavigate();
    const [isQuitModalOpen, setIsQuitModalOpen] = useState(false);
    const [isGameOver, setIsGameOver] = useState(false);

    return (
        <GameLoaderWrapper title="Find Your Ancient Character" themeColor="#A78BFA">
            <div className="min-h-screen relative bg-black overflow-hidden font-sans">
            {/* Background Image & Overlay */}
            <div 
                className="absolute inset-0 z-0 bg-cover bg-center bg-no-repeat bg-fixed opacity-40"
                style={{ backgroundImage: 'url("/ancient-character.png")' }}
            />
            <div className="absolute inset-0 z-0 bg-gradient-to-br from-[#1a1528]/90 to-[#0a0812]/95" />
            
            <SEOHead 
                title="Ancient Character Match | Nirvaha" 
                description="Discover which ancient Indian character resonates with your personality through scenario-based choices." 
            />
            
            <button 
                onClick={() => setIsQuitModalOpen(true)}
                className="absolute top-6 left-6 md:top-10 md:left-10 z-50 flex items-center gap-2 text-zinc-400 hover:text-[#d8b4fe] transition-colors"
            >
                <ArrowLeft className="w-5 h-5" />
                <span className="text-sm font-bold uppercase tracking-wider">Return</span>
            </button>

            <QuitConfirmationModal 
                isOpen={isQuitModalOpen}
                onClose={() => setIsQuitModalOpen(false)}
                onConfirm={() => navigate('/dashboard')}
                isGameOver={isGameOver}
            />

            <div className="relative z-10 w-full">
                <AncientCharacterApp onGameOver={setIsGameOver} />
            </div>
        </div>
        </GameLoaderWrapper>
    );
};

export default AncientCharacterPage;
