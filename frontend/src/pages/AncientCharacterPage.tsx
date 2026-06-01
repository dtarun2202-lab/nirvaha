import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import SEOHead from '../components/common/SEOHead';
import { AncientCharacterApp } from '../components/ancient-character/AncientCharacterApp';

const AncientCharacterPage: React.FC = () => {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen bg-black pt-24 pb-12">
            <SEOHead 
                title="Check Your Ancient Character - Nirvaha" 
                description="A reflective quiz to discover which ancient character qualities most reflect your present nature." 
            />
            
            <div className="container mx-auto px-4 max-w-5xl">
                {/* Back Navigation */}
                <button 
                    onClick={() => navigate('/dashboard/overview')}
                    className="flex items-center text-gray-400 hover:text-white transition-colors mb-8 group"
                >
                    <ArrowLeft className="w-5 h-5 mr-2 group-hover:-translate-x-1 transition-transform" />
                    Back to Arcade
                </button>

                {/* Main App Container */}
                <AncientCharacterApp />
            </div>
        </div>
    );
};

export default AncientCharacterPage;
