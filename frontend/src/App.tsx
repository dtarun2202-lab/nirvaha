import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from './components/ui/toaster';
import LearningCatalogPage from './pages/LearningCatalogPage';
import LearningPathPage from './pages/LearningPathPage';
import CoursePlayerPage from './pages/CoursePlayerPage';
import { Toaster as Sonner } from './components/ui/sonner';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { SocketProvider } from './contexts/SocketContext';
import BreathingPage from "./pages/BreathingPage";
import LandingPage from './pages/LandingPage';
import CertificationsPage from './pages/CertificationsPage';

import Login from './pages/auth/Login';
import Signup from './pages/auth/Signup';
import StoriesPage from './pages/StoriesPage';
import SuccessStoryDetail from './pages/SuccessStoryDetail';
import WellnessOTTDetail from './pages/WellnessOTTDetail';
import WellnessOTTBrowsing from './pages/WellnessOTTBrowsing';
import WellnessOTTLibrary from './pages/WellnessOTTLibrary';
import JourneyPage from './pages/JourneyPage';
import ProtectedRoute from './components/common/ProtectedRoute';
import WellnessOTTHome from './pages/WellnessOTTHome';
import WellnessOTTSeriesDetails from './pages/WellnessOTTSeriesDetails';
import WellnessOTTAudioPlayer from './components/wellness-ott/WellnessOTTAudioPlayer';
import NirvahaStreamIntro from './components/wellness-ott/NirvahaStreamIntro';
import MeditationPage from "./components/pages/MeditationPage";
import { SoundHealingPage } from "./components/pages/SoundHealingPage";
import { CommunityPage } from "./components/pages/CommunityPage";
import { ChatbotPage } from "./components/pages/ChatbotPage";
import { MarketplacePage } from "./components/pages/MarketplacePage";
import { CompanionPage } from "./components/pages/CompanionPage";
import { ProfilePage } from "./components/ProfilePage";
import { Navigation } from "./components/Navigation";
import { DashboardPage } from "./components/pages/DashboardPage";
import AIChatbotWidget from "./components/AIChatbotWidget";
import NirvahaAcademyPage from './pages/NirvahaAcademyPage';
import LibraryDetailPage from './pages/LibraryDetailPage';
import StoryDetailPage from './pages/StoryDetailPage';
import ChakraExperiencePage from './pages/ChakraExperiencePage';
import HealingMusicPage from './pages/HealingMusicPage';
import InspirationStoryPage from './pages/InspirationStoryPage';
import LifeQuizPage from './pages/LifeQuizPage';
import AncientCharacterPage from './pages/AncientCharacterPage';
import TempleOfBalancePage from './pages/TempleOfBalancePage';
import AutographPage from './pages/AutographPage';

import { FeaturesBentoGrid } from "./components/dashboard/FeaturesBentoGrid";
import { CommonProblems } from "./components/dashboard/CommonProblems";
import { CertificationsBanner } from "./components/dashboard/CertificationsBanner";
import { WellnessOTT } from "./components/dashboard/WellnessOTT";
import { GamingHubSection } from "./components/GamingHubSection";
import { InspirationalQuotes } from "./components/dashboard/InspirationalQuotes";
import { CaseStudies } from "./components/dashboard/CaseStudies";
import { FAQSection } from "./components/dashboard/FAQSection";
import { DashboardFooter } from "./components/dashboard/DashboardFooter";
import { AdminLayout } from "./admin/layout/AdminLayout";
import { AdminDashboardPage } from "./admin/pages/AdminDashboardPage";
import { AnalyticsPage } from "./admin/pages/AnalyticsPage";
import { BookingManagementPage } from "./admin/pages/BookingManagementPage";
import { CompanionManagementPage } from "./admin/pages/CompanionManagementPage";
import { ContentManagementPage } from "./admin/pages/ContentManagementPage";
import { SettingsPage } from "./admin/pages/SettingsPage";
import { UserManagementPage } from "./admin/pages/UserManagementPage";
import { MeditationContent } from "./admin/pages/content/MeditationContent";
import { SoundHealingContent } from "./admin/pages/content/SoundHealingContent";
import { HealingFrequenciesContent } from "./admin/pages/content/HealingFrequenciesContent";
import { PosesContent } from "./admin/pages/content/PosesContent";
import YogaContent from "./admin/pages/content/YogaContent";
import { ProductsContent } from "./admin/pages/content/ProductsContent";
import { ContentUpdatePage } from "./admin/pages/ContentUpdatePage";
import { MarketplaceManagementPage } from "./admin/pages/MarketplaceManagementPage";
import { ProductManagementPage } from "./admin/pages/ProductManagementPage";
import { ContactManagementPage } from "./admin/pages/ContactManagementPage";
import { AdminDashboard } from "./pages/AdminDashboard";
import { SuccessStoriesManager } from "./components/admin/SuccessStoriesManager";
import { WellnessRetreatsManager } from "./components/admin/WellnessRetreatsManager";
import { WellnessOTTProvider } from "./contexts/WellnessOTTContext";
import { WellnessOTTManagementPage } from "./admin/pages/WellnessOTTManagementPage";
import { CommonProblemsManagementPage } from "./admin/pages/CommonProblemsManagementPage";

/**
 * Dashboard Routes Component
 */
const DashboardRoutes = () => (
  <Routes>
    <Route path="/" element={<Navigate to="overview" replace />} />
    <Route path="overview" element={<DashboardPage />} />
    <Route path="meditation" element={<><MeditationPage /><DashboardFooter /></>} />
    <Route path="sound" element={<><SoundHealingPage /><DashboardFooter /></>} />
    <Route path="community" element={<><CommunityPage /><DashboardFooter /></>} />
    <Route path="chatbot" element={<ChatbotPage />} />
    <Route path="marketplace" element={<><MarketplacePage /><DashboardFooter /></>} />
    <Route path="companion" element={<><CompanionPage /><DashboardFooter /></>} />
    <Route path="profile" element={<><ProfilePage /><DashboardFooter /></>} />
  </Routes>
);


function AppInner() {
  return (
    <div className="min-h-screen spiritual-page-bg relative overflow-hidden">

      <Routes>
        {/* Public Landing Page */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/certifications" element={<CertificationsPage />} />
        <Route path="/academy" element={<NirvahaAcademyPage />} />
        <Route path="/learn" element={<LearningCatalogPage />} />
        <Route path="/learn/:pathId" element={<LearningPathPage />} />
        <Route path="/learn/:pathId/play" element={<CoursePlayerPage />} />
        <Route path="/stories" element={<StoriesPage />} />
        <Route path="/success-story/:id" element={<SuccessStoryDetail />} />
        <Route path="/journey/:topicId" element={<JourneyPage />} />
        <Route path="/library/:id" element={<LibraryDetailPage />} />
        <Route path="/story/:id" element={<StoryDetailPage />} />
        <Route path="/chakra-experience" element={<ChakraExperiencePage />} />
        <Route path="/healing-music" element={<HealingMusicPage />} />
        <Route path="/inspiration-story/:id" element={<InspirationStoryPage />} />
        <Route path="/life-quiz" element={<LifeQuizPage />} />
        <Route path="/ancient-character" element={<AncientCharacterPage />} />
        <Route path="/temple-of-balance" element={<TempleOfBalancePage />} />
        <Route path="/add-your-autograph" element={<AutographPage />} />

        {/* Auth Routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/breathing" element={<BreathingPage />} />

        {/* Dashboard Routes - Protected */}
        <Route
          path="/dashboard/*"
          element={
            <ProtectedRoute allowedRoles={['user', 'admin', 'hr', 'doctor']}>
              <>
                <Navigation currentPage="dashboard" />
                <DashboardRoutes />
              </>
            </ProtectedRoute>
          }
        />

        {/* Admin Routes - Protected */}
        <Route
          path="/admin"
          element={
            <ProtectedRoute allowedRoles={['admin']}>
              <AdminLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<AdminDashboardPage />} />
          <Route path="analytics" element={<AnalyticsPage />} />
          <Route path="bookings" element={<BookingManagementPage />} />
          <Route path="companions" element={<CompanionManagementPage />} />
          <Route path="inquiries" element={<ContactManagementPage />} />
          <Route path="marketplace" element={<MarketplaceManagementPage />} />
          <Route path="products" element={<ProductManagementPage />} />
          <Route path="content-update" element={<ContentUpdatePage />} />
          <Route path="content" element={<ContentManagementPage />} />
          <Route path="content/meditation" element={<MeditationContent />} />
          <Route path="content/sound" element={<SoundHealingContent />} />
          <Route path="content/healing-frequencies" element={<HealingFrequenciesContent />} />
          <Route path="content/poses" element={<PosesContent />} />
          <Route path="content/yoga" element={<YogaContent />} />
          <Route path="content/products" element={<ProductsContent />} />
          <Route path="content/landing" element={<ContentManagementPage />} />
          <Route path="content/dynamic" element={<ContentManagementPage />} />
          <Route path="settings" element={<SettingsPage />} />
          <Route path="users" element={<UserManagementPage />} />
          <Route path="success-stories" element={<SuccessStoriesManager />} />
          <Route path="wellness-retreats" element={<WellnessRetreatsManager />} />
          <Route path="wellness-ott" element={<WellnessOTTManagementPage />} />
          <Route path="common-problems" element={<CommonProblemsManagementPage />} />
          <Route path="*" element={<Navigate to="/admin" replace />} />
        </Route>

        {/* Wellness OTT Routes */}
        <Route path="/wellness-ott-intro" element={<NirvahaStreamIntro />} />
        <Route path="/wellness-ott" element={<WellnessOTTHome />} />
        <Route path="/wellness-ott/home" element={<WellnessOTTHome />} />
        <Route path="/wellness-ott/series/:seriesId" element={<WellnessOTTSeriesDetails />} />
        <Route path="/wellness-ott/player/:seriesId/:episodeId" element={<WellnessOTTAudioPlayer />} />
        <Route path="/wellness-ott/library" element={<WellnessOTTLibrary />} />
        <Route path="/wellness-ott/browsing" element={<WellnessOTTBrowsing />} />
        <Route path="/watch/:seriesId/:episodeId" element={<WellnessOTTAudioPlayer />} />

        {/* Catch-all redirect to landing */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>

      {/* Global AI Chatbot Widget */}
      <AIChatbotWidget />

      {/* Global Toasters */}
      <Toaster />
      <Sonner />
      <ToastContainer position="top-right" autoClose={3000} />
    </div>
  );
}

export default function App() {
  return (
    <Router>
      <SocketProvider>
        <WellnessOTTProvider>
          <AppInner />
        </WellnessOTTProvider>
      </SocketProvider>
    </Router>
  );
}