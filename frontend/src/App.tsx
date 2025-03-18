import {BrowserRouter, Routes, Route} from "react-router-dom"
import Header from "./components/Header"
import DashboardPage from "./pages/DashboardPage"
import LearningPathsPage from "./pages/LearningPathsPage"
import NotFoundPage from "./pages/NotFoundPage"
import ProfilePage from "./pages/ProfilePage"
import SkillsPage from "./pages/SkillsPage"
import ContactSupportPage from "./pages/ContactSupportPage"

export default function App() {
  return (
    <BrowserRouter>
      <Header />
      <Routes>
        <Route path="/" element={<DashboardPage />} />
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/paths" element={<LearningPathsPage />} />
        <Route path="/skills" element={<SkillsPage />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/support" element={<ContactSupportPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </BrowserRouter>
  )
}


