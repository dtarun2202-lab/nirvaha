import React from 'react';
import { LifeQuizApp } from '../components/life-quiz/LifeQuizApp';
import SEOHead from '../components/common/SEOHead';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { QuitConfirmationModal } from '../components/common/QuitConfirmationModal';
import { GameLoaderWrapper } from '../components/common/GameLoaderWrapper';

const LifeQuizPage: React.FC = () => {
    const navigate = useNavigate();
    const [isQuitModalOpen, setIsQuitModalOpen] = React.useState(false);
    const [isGameOver, setIsGameOver] = React.useState(false);
    
    return (
        <GameLoaderWrapper title="Understand Life" themeColor="#D4AF37">
            <div className="min-h-screen relative bg-black overflow-hidden font-sans">
            {/* Background Image & Overlay */}
            <div 
                className="absolute inset-0 z-0 bg-cover bg-center bg-no-repeat bg-fixed opacity-20"
                style={{ backgroundImage: 'url("/understand-life.png")' }}
            />
            <div className="absolute inset-0 z-0 bg-gradient-to-br from-[#2a230b]/90 to-[#0a0802]/95" />
            
            <SEOHead 
                title="Understand Life Quiz | Nirvaha" 
                description="A premium scenario-based life assessment to evaluate judgment, integrity, and emotional balance." 
            />
            
            <button 
                onClick={() => setIsQuitModalOpen(true)}
                className="absolute top-6 left-6 md:top-10 md:left-10 z-50 flex items-center gap-2 text-zinc-400 hover:text-[#86efac] transition-colors"
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
                <LifeQuizApp onGameOver={setIsGameOver} />
            </div>
        </div>
        </GameLoaderWrapper>
    );
};

export default LifeQuizPage;
