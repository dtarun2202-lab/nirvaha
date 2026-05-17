import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { pathwaysData, Pathway } from '../data/pathwaysData';
import CinematicIntro from '../components/journey/CinematicIntro';
import JourneyDashboard from '../components/journey/JourneyDashboard';
import ImmersiveLesson from '../components/journey/ImmersiveLesson';
import CertificateReveal from '../components/journey/CertificateReveal';
import { useAuth } from '../contexts/AuthContext';
import { updatePathwayProgress } from '../lib/userApi';

type JourneyPhase = 'intro' | 'dashboard' | 'lesson' | 'certificate';

const PathwayJourney: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const location = useLocation();
    const { user, refreshProfile } = useAuth();
    
    // Check if we should start directly
    const queryParams = new URLSearchParams(location.search);
    const shouldStartDirectly = queryParams.get('start') === 'true';

    // Get progress for this pathway to determine the current lesson
    const progressData = user?.pathwayProgress?.[id || ''];
    const initialLessonIndex = progressData?.completedLessons 
        ? (progressData.completedLessons.length < (pathwaysData.find(p => p.id === id)?.timeline.length || 0)
            ? progressData.completedLessons.length 
            : 0)
        : 0;

    const [phase, setPhase] = useState<JourneyPhase>(shouldStartDirectly ? 'lesson' : 'intro');
    const [currentLessonIndex, setCurrentLessonIndex] = useState(initialLessonIndex);

    const pathway: Pathway | undefined = pathwaysData.find(p => p.id === id);

    useEffect(() => {
        // Prevent scrolling on the journey page
        document.body.style.overflow = 'hidden';
        return () => {
            document.body.style.overflow = 'auto';
        };
    }, []);

    if (!pathway) {
        return <div className="h-screen bg-black flex items-center justify-center text-white">Pathway not found.</div>;
    }

    const handleLessonComplete = async () => {
        if (user?.id && id) {
            try {
                await updatePathwayProgress(user.id, id, currentLessonIndex);
                await refreshProfile();
            } catch (error) {
                console.error("Failed to save progress:", error);
            }
        }

        // If it's the last lesson, show certificate
        if (currentLessonIndex === pathway.timeline.length - 1) {
            setPhase('certificate');
        } else {
            setPhase('dashboard');
        }
    };

    return (
        <div className="h-screen w-screen bg-[#050705] text-white overflow-hidden relative font-sans">
            <AnimatePresence mode="wait">
                {phase === 'intro' && (
                    <CinematicIntro 
                        key="intro" 
                        onComplete={() => setPhase('dashboard')} 
                    />
                )}
                
                {phase === 'dashboard' && (
                    <JourneyDashboard 
                        key="dashboard"
                        pathway={pathway}
                        onStartLesson={(index) => {
                            setCurrentLessonIndex(index);
                            setPhase('lesson');
                        }}
                        onExit={() => navigate(`/pathways/${id}`)}
                    />
                )}

                {phase === 'lesson' && (
                    <ImmersiveLesson 
                        key="lesson"
                        pathway={pathway}
                        lessonIndex={currentLessonIndex}
                        onComplete={handleLessonComplete}
                        onBack={() => setPhase('dashboard')}
                    />
                )}

                {phase === 'certificate' && (
                    <CertificateReveal 
                        key="certificate"
                        pathway={pathway}
                        onClose={() => navigate('/pathways')}
                    />
                )}
            </AnimatePresence>
        </div>
    );
};

export default PathwayJourney;
