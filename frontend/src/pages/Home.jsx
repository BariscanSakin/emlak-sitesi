import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  getFeaturedListings,
  getBlogs,
  getPage,
  getContact,
} from "../services/api";
import ListingCard from "../components/ListingCard";
import BlogCard from "../components/BlogCard";
import {
  HiOutlineSearch,
  HiOutlineOfficeBuilding,
  HiOutlineShieldCheck,
  HiOutlineUserGroup,
} from "react-icons/hi";

export default function Home() {
  const [listings, setListings] = useState([]);
  const [blogs, setBlogs] = useState([]);
  const [about, setAbout] = useState(null);
  const [contact, setContact] = useState({});
  const [searchText, setSearchText] = useState("");

  useEffect(() => {
    getFeaturedListings()
      .then((r) => setListings(r.data.listings))
      .catch(() => {});
    getBlogs({ limit: 3 })
      .then((r) => setBlogs(r.data.blogs))
      .catch(() => {});
    getPage("hakkimizda")
      .then((r) => setAbout(r.data.page))
      .catch(() => {});
    getContact()
      .then((r) => setContact(r.data.contact))
      .catch(() => {});
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchText.trim()) {
      window.location.href = `/ilanlar?search=${encodeURIComponent(searchText.trim())}`;
    }
  };

  return (
    <div>
      {/* Hero */}
      <section className="relative bg-gradient-to-br from-primary-900 via-primary-800 to-primary-700 text-white">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGQ9Ik0zNiAxOGMzLjMxIDAgNiAyLjY5IDYgNnMtMi42OSA2LTYgNi02LTIuNjktNi02IDIuNjktNiA2LTZ6IiBzdHJva2U9InJnYmEoMjU1LDI1NSwyNTUsMC4wNSkiIHN0cm9rZS13aWR0aD0iMiIvPjwvZz48L3N2Zz4=')] opacity-30"></div>
        <div className="page-container relative py-20 lg:py-32">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold mb-6 leading-tight">
              Hayalinizdeki Evi
              <span className="block text-primary-300">Birlikte Bulalım</span>
            </h1>
            <p className="text-lg md:text-xl text-primary-100 mb-10 max-w-2xl mx-auto">
              Satılık ve kiralık emlak ilanları arasından size en uygun olanı
              bulun. Profesyonel ekibimiz her adımda yanınızda.
            </p>

            {/* Search bar */}
            <form onSubmit={handleSearch} className="max-w-2xl mx-auto">
              <div className="flex bg-white rounded-xl shadow-2xl overflow-hidden">
                <input
                  type="text"
                  value={searchText}
                  onChange={(e) => setSearchText(e.target.value)}
                  placeholder="Konum, ilan başlığı veya anahtar kelime..."
                  className="flex-1 px-6 py-4 text-gray-800 placeholder-gray-400 outline-none text-base"
                />
                <button
                  type="submit"
                  className="bg-primary-600 hover:bg-primary-700 text-white px-8 py-4 flex items-center gap-2 font-medium transition-colors"
                >
                  <HiOutlineSearch className="w-5 h-5" />
                  <span className="hidden sm:inline">Ara</span>
                </button>
              </div>
            </form>

            {/* Quick links */}
            <div className="flex flex-wrap justify-center gap-3 mt-8">
              <Link
                to="/ilanlar?status=satilik"
                className="bg-white/10 hover:bg-white/20 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors backdrop-blur-sm"
              >
                Satılık İlanlar
              </Link>
              <Link
                to="/ilanlar?status=kiralik"
                className="bg-white/10 hover:bg-white/20 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors backdrop-blur-sm"
              >
                Kiralık İlanlar
              </Link>
              <Link
                to="/ilanlar?type=daire"
                className="bg-white/10 hover:bg-white/20 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors backdrop-blur-sm"
              >
                Daireler
              </Link>
              <Link
                to="/ilanlar?type=villa"
                className="bg-white/10 hover:bg-white/20 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors backdrop-blur-sm"
              >
                Villalar
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-16 bg-white">
        <div className="page-container">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center p-6">
              <div className="w-14 h-14 bg-primary-100 rounded-xl flex items-center justify-center mx-auto mb-4">
                <HiOutlineOfficeBuilding className="w-7 h-7 text-primary-600" />
              </div>
              <h3 className="font-bold text-gray-800 mb-2">Geniş Portföy</h3>
              <p className="text-sm text-gray-500">
                Satılık ve kiralık binlerce emlak ilanı arasından seçim yapın.
              </p>
            </div>
            <div className="text-center p-6">
              <div className="w-14 h-14 bg-primary-100 rounded-xl flex items-center justify-center mx-auto mb-4">
                <HiOutlineShieldCheck className="w-7 h-7 text-primary-600" />
              </div>
              <h3 className="font-bold text-gray-800 mb-2">Güvenilir Hizmet</h3>
              <p className="text-sm text-gray-500">
                Tüm ilanlarımız doğrulanmış ve güvenilir kaynaklardan
                gelmektedir.
              </p>
            </div>
            <div className="text-center p-6">
              <div className="w-14 h-14 bg-primary-100 rounded-xl flex items-center justify-center mx-auto mb-4">
                <HiOutlineUserGroup className="w-7 h-7 text-primary-600" />
              </div>
              <h3 className="font-bold text-gray-800 mb-2">Uzman Kadro</h3>
              <p className="text-sm text-gray-500">
                Deneyimli emlak danışmanlarımız her adımda yanınızda.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured listings */}
      {listings.length > 0 && (
        <section className="py-16 bg-gray-50">
          <div className="page-container">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className="section-title">Öne Çıkan İlanlar</h2>
                <p className="text-gray-500 mt-2">
                  En beğenilen emlak ilanlarımız
                </p>
              </div>
              <Link
                to="/ilanlar"
                className="btn-secondary text-sm hidden md:inline-flex"
              >
                Tüm İlanlar →
              </Link>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {listings.map((listing) => (
                <ListingCard key={listing.id} listing={listing} />
              ))}
            </div>
            <div className="mt-8 text-center md:hidden">
              <Link to="/ilanlar" className="btn-secondary">
                Tüm İlanları Gör →
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* About summary */}
      {about && (
        <section className="py-16 bg-white">
          <div className="page-container">
            <div className="max-w-4xl mx-auto text-center">
              <h2 className="section-title mb-6">Hakkımızda</h2>
              <div
                className="text-gray-600 leading-relaxed prose prose-lg mx-auto line-clamp-4"
                dangerouslySetInnerHTML={{ __html: about.content }}
              />
              <Link to="/hakkimizda" className="btn-primary mt-8 inline-flex">
                Daha Fazla Bilgi
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* Blog */}
      {blogs.length > 0 && (
        <section className="py-16 bg-gray-50">
          <div className="page-container">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className="section-title">Blog</h2>
                <p className="text-gray-500 mt-2">
                  Emlak dünyasından güncel yazılar
                </p>
              </div>
              <Link
                to="/blog"
                className="btn-secondary text-sm hidden md:inline-flex"
              >
                Tüm Yazılar →
              </Link>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {blogs.map((blog) => (
                <BlogCard key={blog.id} blog={blog} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Contact CTA */}
      <section className="py-16 bg-primary-700 text-white">
        <div className="page-container text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Emlak Danışmanlığı İçin Bize Ulaşın
          </h2>
          <p className="text-primary-100 mb-8 max-w-2xl mx-auto">
            Satılık veya kiralık gayrimenkul arıyorsanız, profesyonel ekibimiz
            size yardımcı olmaktan mutluluk duyar.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              to="/iletisim"
              className="bg-white text-primary-700 hover:bg-primary-50 font-medium py-3 px-8 rounded-lg transition-colors"
            >
              İletişime Geçin
            </Link>
            {contact.whatsapp && (
              <a
                href={`https://wa.me/${contact.whatsapp}`}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-green-500 hover:bg-green-600 text-white font-medium py-3 px-8 rounded-lg transition-colors inline-flex items-center gap-2"
              >
                WhatsApp ile Yazın
              </a>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
