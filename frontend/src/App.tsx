import Header from "./components/Header"
import {BrowserRouter, Routes, Route} from "react-router-dom"
import Dashboard from "./components/pages/Dashboard"
import Paths from "./components/pages/Paths"
import Skills from "./components/pages/Skills"
import Profile from "./components/pages/Profile"

export default function App() {
  return (
    <BrowserRouter>
      <Header />
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/paths" element={<Paths />} />
        <Route path="/skills" element={<Skills />} />
        <Route path="/profile" element={<Profile />} />
      </Routes>
    </BrowserRouter>
  )
}
