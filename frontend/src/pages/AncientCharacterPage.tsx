import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import SEOHead from '../components/common/SEOHead';
import { AncientCharacterApp } from '../components/ancient-character/AncientCharacterApp';
import { QuitConfirmationModal } from '../components/common/QuitConfirmationModal';
import { GameLoaderWrapper } from '../components/common/GameLoaderWrapper';

const AncientCharacterPage: React.FC = () => {
    const navigate = useNavigate();
    const [isQuitModalOpen, setIsQuitModalOpen] = React.useState(false);

    return (
        <GameLoaderWrapper title="Check Your Ancient Character" themeColor="#059669">
            <div className="min-h-screen relative pt-24 pb-12 bg-black overflow-hidden font-sans">
            {/* Background Image & Overlay */}
            <div 
                className="absolute inset-0 z-0 bg-cover bg-center bg-no-repeat bg-fixed opacity-20"
                style={{ backgroundImage: 'url("/ancient character.png")' }}
            />
            <div className="absolute inset-0 z-0 bg-gradient-to-br from-[#022f21]/90 to-[#01140e]/95" />
            
            <SEOHead 
                title="Check Your Ancient Character - Nirvaha" 
                description="A reflective quiz to discover which ancient character qualities most reflect your present nature." 
            />
            
            <div className="container relative z-10 mx-auto px-4 max-w-5xl">
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
                    onConfirm={() => navigate('/dashboard/overview')}
                />

                {/* Main App Container */}
                <AncientCharacterApp />
            </div>
        </div>
        </GameLoaderWrapper>
    );
};

export default AncientCharacterPage;
