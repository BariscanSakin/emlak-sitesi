import { Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
import AdminLayout from "./components/AdminLayout";
import ProtectedRoute from "./components/ProtectedRoute";

// Public pages
import Home from "./pages/Home";
import About from "./pages/About";
import Contact from "./pages/Contact";
import Listings from "./pages/Listings";
import ListingDetail from "./pages/ListingDetail";
import Blog from "./pages/Blog";
import BlogDetail from "./pages/BlogDetail";

// Admin pages
import Login from "./pages/admin/Login";
import Dashboard from "./pages/admin/Dashboard";
import ListingManagement from "./pages/admin/ListingManagement";
import ListingForm from "./pages/admin/ListingForm";
import PageManagement from "./pages/admin/PageManagement";
import ContactManagement from "./pages/admin/ContactManagement";
import BlogManagement from "./pages/admin/BlogManagement";
import BlogForm from "./pages/admin/BlogForm";
import SettingsPage from "./pages/admin/SettingsPage";

function App() {
  return (
    <Routes>
      {/* Public Routes */}
      <Route element={<Layout />}>
        <Route path="/" element={<Home />} />
        <Route path="/hakkimizda" element={<About />} />
        <Route path="/iletisim" element={<Contact />} />
        <Route path="/ilanlar" element={<Listings />} />
        <Route path="/ilan/:slug" element={<ListingDetail />} />
        <Route path="/blog" element={<Blog />} />
        <Route path="/blog/:slug" element={<BlogDetail />} />
      </Route>

      {/* Admin Routes */}
      <Route path="/admin/login" element={<Login />} />
      <Route
        path="/admin"
        element={
          <ProtectedRoute>
            <AdminLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Dashboard />} />
        <Route path="ilanlar" element={<ListingManagement />} />
        <Route path="ilanlar/yeni" element={<ListingForm />} />
        <Route path="ilanlar/:id/duzenle" element={<ListingForm />} />
        <Route path="sayfalar" element={<PageManagement />} />
        <Route path="iletisim" element={<ContactManagement />} />
        <Route path="blog" element={<BlogManagement />} />
        <Route path="blog/yeni" element={<BlogForm />} />
        <Route path="blog/:id/duzenle" element={<BlogForm />} />
        <Route path="ayarlar" element={<SettingsPage />} />
      </Route>
    </Routes>
  );
}

export default App;
