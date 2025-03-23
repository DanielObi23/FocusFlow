import {BrowserRouter, Routes, Route, useLocation} from "react-router-dom"
import Header from "./components/Header"
import DashboardPage from "./pages/appPages/DashboardPage"
import { AuthProvider } from './contexts/AuthContext';
import LearningPathsPage from "./pages/appPages/LearningPathsPage"
import NotFoundPage from "./pages/errorPages/NotFoundPage"
import ProfilePage from "./pages/appPages/ProfilePage"
import SkillsPage from "./pages/appPages/SkillsPage"
import ContactSupportPage from "./pages/errorPages/ContactSupportPage"
import AuthRequired from "./components/AuthRequired"
import RegisterPage from "./pages/authPages/RegisterPage" 
import VerifyEmailPage from "./pages/authPages/VerifyEmailPage" 
import LoginPage from "./pages/authPages/LoginPage"
import ForgotPasswordPage from "./pages/authPages/ForgotPasswordPage"
import PasswordResetPage from "./pages/authPages/PasswordResetPage"
import Logout from "./pages/authPages/LogoutPage"
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


function AppLayout() {
  const location = useLocation();
  const authPaths = ['/login', '/register', '/verify-email', '/forgot-password', '/reset-password'];
  const isAuthPage = authPaths.some(path => location.pathname.startsWith(path));
  
  return (
    <>
      {!isAuthPage && <Header />}
      <ToastContainer />
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/verify-email" element={<VerifyEmailPage />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
        <Route path="/reset-password/:token" element={<PasswordResetPage />} />
        <Route element={<AuthRequired />}>
          <Route path="/" element={<DashboardPage />} />
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/paths" element={<LearningPathsPage />} />
          <Route path="/skills" element={<SkillsPage />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/support" element={<ContactSupportPage />} />
          <Route path="/logout" element={<Logout />} />
          <Route path="*" element={<NotFoundPage />} />
        </Route>
      </Routes>
    </>
  );
}

export default function App() {
  // to load the theme immediately
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
