import {BrowserRouter, Routes, Route, useLocation} from "react-router-dom"
import Header from "./components/Header"
import DashboardPage from "./pages/DashboardPage"
import LearningPathsPage from "./pages/LearningPathsPage"
import NotFoundPage from "./pages/NotFoundPage"
import ProfilePage from "./pages/ProfilePage"
import SkillsPage from "./pages/SkillsPage"
import ContactSupportPage from "./pages/ContactSupportPage"
import AuthRequired from "./AuthRequired"
import LoginPage from "./pages/LoginPage"
import RegisterPage from "./pages/RegisterPage" 
import { AuthProvider } from './contexts/AuthContext';
import Logout from "./components/Logout"

function AppLayout() {
  const location = useLocation();
  const isAuthPage = location.pathname === '/login' || location.pathname === '/register';
  
  return (
    <>
      {!isAuthPage && <Header />}
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
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
