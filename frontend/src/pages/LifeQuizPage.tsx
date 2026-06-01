import React from 'react';
import { LifeQuizApp } from '../components/life-quiz/LifeQuizApp';
import SEOHead from '../components/common/SEOHead';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

const LifeQuizPage: React.FC = () => {
    const navigate = useNavigate();
    
    return (
        <div className="min-h-screen bg-[#0D1B0D] relative">
            <SEOHead 
                title="Understand Life Quiz | Nirvaha" 
                description="A premium scenario-based life assessment to evaluate judgment, integrity, and emotional balance." 
            />
            
            <button 
                onClick={() => navigate('/dashboard')}
                className="absolute top-6 left-6 md:top-10 md:left-10 z-50 flex items-center gap-2 text-zinc-400 hover:text-[#86efac] transition-colors"
            >
                <ArrowLeft className="w-5 h-5" />
                <span className="text-sm font-bold uppercase tracking-wider">Return</span>
            </button>

            <LifeQuizApp />
        </div>
    );
};

export default LifeQuizPage;
