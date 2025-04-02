import { lazy, Suspense } from "react"
import {BrowserRouter, Routes, Route, useLocation} from "react-router-dom"
import { AuthProvider } from './contexts/AuthContext';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import TruckLoader from "./components/TruckLoader"
import Header from "./components/Header"
import AuthRequired from "./components/AuthRequired"
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

// Auth Pages
const LoginPage = lazy(() => import('./pages/authPages/LoginPage'));
const RegisterPage = lazy(() => import('./pages/authPages/RegisterPage'));
const VerifyEmailPage = lazy(() => import('./pages/authPages/VerifyEmailPage'));
const ForgotPasswordPage = lazy(() => import('./pages/authPages/ForgotPasswordPage'));
const PasswordResetPage = lazy(() => import('./pages/authPages/PasswordResetPage'));
const Logout = lazy(() => import('./pages/authPages/LogoutPage'));


// App Pages
const ProfilePage = lazy(() => import('./pages/appPages/ProfilePage'));
const SkillsPage = lazy(() => import('./pages/appPages/SkillsPage'));
const FeedbackPage = lazy(() => import('./pages/appPages/FeedbackPage'));
const LearningPathsPage = lazy(() => import('./pages/appPages/LearningPathsPage'));


// Error Pages
const NotFoundPage = lazy(() => import('./pages/errorPages/NotFoundPage'));
const ContactSupportPage = lazy(() => import('./pages/errorPages/ContactSupportPage'));


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
          <Route path="*" element={<NotFoundPage />} />

          {/* Protected Routes */}
          <Route element={<AuthRequired />}>
            <Route path="/" element={<ProfilePage />} />
            <Route path="/skills" element={<SkillsPage />} />
            <Route path="/learning-paths" element={<LearningPathsPage />} />
            <Route path="/feedback" element={<FeedbackPage />} />
            <Route path="/logout" element={<Logout />} />
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
    <QueryClientProvider client={new QueryClient()}>
      <BrowserRouter>
        <AuthProvider>
          <AppLayout />
        </AuthProvider>
      </BrowserRouter>
    </QueryClientProvider>
  );
}