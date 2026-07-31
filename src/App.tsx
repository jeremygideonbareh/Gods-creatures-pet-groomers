import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "@/context/AuthContext";
import { SiteContentProvider } from "@/context/SiteContentContext";
import ScrollAdventure from "@/components/ui/animated-scroll";
import ProfilePage from "@/components/sections/ProfilePage";
import AdminDashboard from "@/components/sections/AdminDashboard";
import StorePage from "@/components/sections/StorePage";

export default function App() {
  return (
    <BrowserRouter>
      <SiteContentProvider>
        <AuthProvider>
          <Routes>
            <Route path="/" element={<ScrollAdventure />} />
            <Route path="/profile" element={<ProfilePage />} />
            <Route path="/admin" element={<AdminDashboard />} />
            <Route path="/store" element={<StorePage />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </AuthProvider>
      </SiteContentProvider>
    </BrowserRouter>
  );
}
