import { lazy, Suspense } from "react"
import {BrowserRouter, Routes, Route, useLocation} from "react-router-dom"
import { AuthProvider } from './contexts/AuthContext';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import TruckLoader from "./components/TruckLoader"

// Auth Pages
const LoginPage = lazy(() => import('./pages/authPages/LoginPage'));
const RegisterPage = lazy(() => import('./pages/authPages/RegisterPage'));
const VerifyEmailPage = lazy(() => import('./pages/authPages/VerifyEmailPage'));
const ForgotPasswordPage = lazy(() => import('./pages/authPages/ForgotPasswordPage'));
const PasswordResetPage = lazy(() => import('./pages/authPages/PasswordResetPage'));
const Logout = lazy(() => import('./pages/authPages/LogoutPage'));


// App Pages
  // Profile Pages
  const ProfilePage = lazy(() => import('./pages/appPages/profilePages/ProfilePage'));
  const SkillsPage = lazy(() => import('./pages/appPages/profilePages/SkillsPage'));
  const AchievementPage = lazy(() => import('./pages/appPages/profilePages/AchievementPage'));
  const FeedbackPage = lazy(() => import('./pages/appPages/profilePages/FeedbackPage'));

  // Path Pages
  const LearningPathsPage = lazy(() => import('./pages/appPages/pathPages/LearningPathsPage'));
  const ProjectPathsPage = lazy(() => import('./pages/appPages/pathPages/ProjectPathsPage'));
  const CareerPathsPage = lazy(() => import('./pages/appPages/pathPages/CareerPathsPage'));

const DashboardPage = lazy(() => import('./pages/appPages/DashboardPage'));

// Error Pages
const NotFoundPage = lazy(() => import('./pages/errorPages/NotFoundPage'));
const ContactSupportPage = lazy(() => import('./pages/errorPages/ContactSupportPage'));

// Components
import Header from "./components/Header"
import AuthRequired from "./components/AuthRequired"

// Loading Component
// From Uiverse.io by vinodjangid07 

function AppLayout() {
  const location = useLocation();
  const authPaths = ['/login', '/register', '/verify-email', '/forgot-password', '/reset-password'];
  const isAuthPage = authPaths.some(path => location.pathname.startsWith(path));
  
  return (
    <>
      {!isAuthPage && <Header />}
      <ToastContainer />
      <Suspense fallback={<TruckLoader />}>
        <Routes>
          {/* Auth Routes */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/verify-email" element={<VerifyEmailPage />} />
          <Route path="/forgot-password" element={<ForgotPasswordPage />} />
          <Route path="/reset-password/:token" element={<PasswordResetPage />} />
          <Route path="/support" element={<ContactSupportPage />} />

          {/* Protected Routes */}
          <Route element={<AuthRequired />}>
            <Route path="/" element={<DashboardPage />} />
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="/path/learning" element={<LearningPathsPage />} />
            <Route path="/path/project" element={<ProjectPathsPage />} />
            <Route path="/path/career" element={<CareerPathsPage />} />
            <Route path="/profile" element={<ProfilePage />} />
            <Route path="/profile/skills" element={<SkillsPage />} />
            <Route path="/profile/achievements" element={<AchievementPage />} />
            <Route path="/profile/feedback" element={<FeedbackPage />} />
            <Route path="/logout" element={<Logout />} />
            <Route path="*" element={<NotFoundPage />} />
          </Route>
        </Routes>
      </Suspense>
    </>
  );
}

export default function App() {
  // Load theme immediately
  const theme = localStorage.getItem('theme');
  theme && document.getElementsByTagName("html")[0].setAttribute("data-theme", theme);

  return (
    <BrowserRouter>
      <AuthProvider>
        <AppLayout />
      </AuthProvider>
    </BrowserRouter>
  );
}