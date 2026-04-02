import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { getAllListings, getAllBlogs } from "../../services/api";
import {
  HiOutlineOfficeBuilding,
  HiOutlinePencilAlt,
  HiOutlineEye,
  HiOutlinePlus,
} from "react-icons/hi";

export default function Dashboard() {
  const [stats, setStats] = useState({
    listings: 0,
    activeListings: 0,
    blogs: 0,
    publishedBlogs: 0,
  });

  useEffect(() => {
    getAllListings()
      .then((r) => {
        const all = r.data.listings;
        setStats((prev) => ({
          ...prev,
          listings: all.length,
          activeListings: all.filter((l) => l.isActive).length,
        }));
      })
      .catch(() => {});

    getAllBlogs()
      .then((r) => {
        const all = r.data.blogs;
        setStats((prev) => ({
          ...prev,
          blogs: all.length,
          publishedBlogs: all.filter((b) => b.isPublished).length,
        }));
      })
      .catch(() => {});
  }, []);

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Dashboard</h1>
        <p className="text-gray-500 mt-1">Yönetim paneline hoş geldiniz</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div className="bg-white rounded-xl p-5 border border-gray-100 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Toplam İlan</p>
              <p className="text-2xl font-bold text-gray-800 mt-1">
                {stats.listings}
              </p>
            </div>
            <div className="w-12 h-12 bg-blue-50 rounded-lg flex items-center justify-center">
              <HiOutlineOfficeBuilding className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl p-5 border border-gray-100 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Aktif İlan</p>
              <p className="text-2xl font-bold text-green-600 mt-1">
                {stats.activeListings}
              </p>
            </div>
            <div className="w-12 h-12 bg-green-50 rounded-lg flex items-center justify-center">
              <HiOutlineEye className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl p-5 border border-gray-100 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Toplam Blog</p>
              <p className="text-2xl font-bold text-gray-800 mt-1">
                {stats.blogs}
              </p>
            </div>
            <div className="w-12 h-12 bg-purple-50 rounded-lg flex items-center justify-center">
              <HiOutlinePencilAlt className="w-6 h-6 text-purple-600" />
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl p-5 border border-gray-100 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Yayında Blog</p>
              <p className="text-2xl font-bold text-green-600 mt-1">
                {stats.publishedBlogs}
              </p>
            </div>
            <div className="w-12 h-12 bg-green-50 rounded-lg flex items-center justify-center">
              <HiOutlineEye className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Quick actions */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
        <h2 className="text-lg font-bold text-gray-800 mb-4">Hızlı İşlemler</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <Link
            to="/admin/ilanlar/yeni"
            className="flex items-center gap-3 p-4 rounded-lg border border-gray-200 hover:border-primary-300 hover:bg-primary-50 transition-colors"
          >
            <HiOutlinePlus className="w-8 h-8 text-primary-600" />
            <div>
              <p className="font-medium text-gray-800">Yeni İlan Ekle</p>
              <p className="text-sm text-gray-500">Yeni emlak ilanı oluştur</p>
            </div>
          </Link>
          <Link
            to="/admin/blog/yeni"
            className="flex items-center gap-3 p-4 rounded-lg border border-gray-200 hover:border-primary-300 hover:bg-primary-50 transition-colors"
          >
            <HiOutlinePlus className="w-8 h-8 text-primary-600" />
            <div>
              <p className="font-medium text-gray-800">Yeni Blog Yazısı</p>
              <p className="text-sm text-gray-500">Blog yazısı oluştur</p>
            </div>
          </Link>
          <Link
            to="/admin/sayfalar"
            className="flex items-center gap-3 p-4 rounded-lg border border-gray-200 hover:border-primary-300 hover:bg-primary-50 transition-colors"
          >
            <HiOutlinePencilAlt className="w-8 h-8 text-primary-600" />
            <div>
              <p className="font-medium text-gray-800">Sayfa Düzenle</p>
              <p className="text-sm text-gray-500">
                Hakkımızda vb. sayfaları düzenle
              </p>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
}
