import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import SEOHead from '../components/common/SEOHead';
import { AutographApp } from '../components/add-your-autograph/AutographApp';
import { QuitConfirmationModal } from '../components/common/QuitConfirmationModal';
import { GameLoaderWrapper } from '../components/common/GameLoaderWrapper';

const AutographPage: React.FC = () => {
    const navigate = useNavigate();
    const [isQuitModalOpen, setIsQuitModalOpen] = React.useState(false);

    return (
        <GameLoaderWrapper title="Add Your Autograph" themeColor="#0f3460">
            <div className="min-h-screen relative pt-24 pb-12 font-sans overflow-hidden bg-black">
                {/* Background Image & Overlay */}
                <div 
                    className="absolute inset-0 z-0 bg-cover bg-center bg-no-repeat bg-fixed opacity-30"
                    style={{ backgroundImage: 'url("/add your signature.png")' }}
                />
                <div className="absolute inset-0 z-0 bg-gradient-to-b from-[#051121]/90 via-black/95 to-black" />
                
                <SEOHead 
                    title="Add Your Autograph - Nirvaha" 
                    description="Personalize beautiful statement cards about ancient India with your own signature autograph." 
                />
                
                <div className="container relative z-10 mx-auto px-4 max-w-7xl">
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
                    <AutographApp />
                </div>
            </div>
        </GameLoaderWrapper>
    );
};

export default AutographPage;
