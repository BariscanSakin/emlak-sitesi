import { useState, useEffect, useRef } from "react";
import { Link, useLocation } from "react-router-dom";
import { HiOutlinePhone, HiOutlineMail, HiOutlineMenu } from "react-icons/hi";
import { FaFacebookF, FaInstagram, FaTwitter, FaYoutube } from "react-icons/fa";
import MobileMenu from "./MobileMenu";
import { getSettings, getContact } from "../services/api";

const listingTypes = [
  { label: "Daire", value: "daire" },
  { label: "Villa", value: "villa" },
  { label: "Arsa", value: "arsa" },
  { label: "İş Yeri", value: "isyeri" },
  { label: "Müstakil Ev", value: "mustakil" },
  { label: "Residence", value: "residence" },
];

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [megaOpen, setMegaOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [settings, setSettings] = useState({});
  const [contact, setContact] = useState({});
  const megaRef = useRef(null);
  const location = useLocation();

  useEffect(() => {
    getSettings()
      .then((r) => setSettings(r.data.settings))
      .catch(() => {});
    getContact()
      .then((r) => setContact(r.data.contact))
      .catch(() => {});
  }, []);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
    setMegaOpen(false);
  }, [location]);

  useEffect(() => {
    const handleClick = (e) => {
      if (megaRef.current && !megaRef.current.contains(e.target)) {
        setMegaOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const isActive = (path) => location.pathname === path;

  const navLink = (to, label) => (
    <Link
      to={to}
      className={`px-3 py-2 text-sm font-medium rounded-md transition-colors ${
        isActive(to)
          ? "text-primary-600 bg-primary-50"
          : "text-gray-700 hover:text-primary-600 hover:bg-gray-50"
      }`}
    >
      {label}
    </Link>
  );

  return (
    <>
      {/* Top bar */}
      <div className="bg-primary-700 text-white text-sm hidden md:block">
        <div className="page-container flex justify-between items-center py-2">
          <div className="flex items-center gap-4">
            {contact.phone && (
              <a
                href={`tel:${contact.phone}`}
                className="flex items-center gap-1 hover:text-primary-200 transition-colors"
              >
                <HiOutlinePhone className="w-4 h-4" /> {contact.phone}
              </a>
            )}
            {contact.email && (
              <a
                href={`mailto:${contact.email}`}
                className="flex items-center gap-1 hover:text-primary-200 transition-colors"
              >
                <HiOutlineMail className="w-4 h-4" /> {contact.email}
              </a>
            )}
          </div>
          <div className="flex items-center gap-3">
            {contact.facebook && (
              <a
                href={contact.facebook}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-primary-200"
              >
                <FaFacebookF />
              </a>
            )}
            {contact.instagram && (
              <a
                href={contact.instagram}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-primary-200"
              >
                <FaInstagram />
              </a>
            )}
            {contact.twitter && (
              <a
                href={contact.twitter}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-primary-200"
              >
                <FaTwitter />
              </a>
            )}
            {contact.youtube && (
              <a
                href={contact.youtube}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-primary-200"
              >
                <FaYoutube />
              </a>
            )}
          </div>
        </div>
      </div>

      {/* Main navbar */}
      <nav
        className={`sticky top-0 z-40 bg-white transition-shadow duration-300 ${scrolled ? "shadow-lg" : "shadow-sm"}`}
      >
        <div className="page-container">
          <div className="flex items-center justify-between h-16 lg:h-20">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-2 shrink-0">
              {settings.logo ? (
                <img
                  src={settings.logo}
                  alt={settings.siteName || "Logo"}
                  className="h-10 lg:h-12 w-auto"
                />
              ) : (
                <div className="flex items-center gap-2">
                  <div className="w-10 h-10 bg-primary-600 rounded-lg flex items-center justify-center">
                    <span className="text-white font-bold text-xl">E</span>
                  </div>
                  <span className="text-xl font-bold text-gray-800">
                    {settings.siteName || "Emlak"}
                  </span>
                </div>
              )}
            </Link>

            {/* Desktop nav */}
            <div className="hidden lg:flex items-center gap-1">
              {navLink("/", "Anasayfa")}

              {/* Mega menu: İlanlar */}
              <div ref={megaRef} className="relative">
                <button
                  onClick={() => setMegaOpen(!megaOpen)}
                  onMouseEnter={() => setMegaOpen(true)}
                  className={`px-3 py-2 text-sm font-medium rounded-md transition-colors flex items-center gap-1 ${
                    location.pathname.startsWith("/ilanlar")
                      ? "text-primary-600 bg-primary-50"
                      : "text-gray-700 hover:text-primary-600 hover:bg-gray-50"
                  }`}
                >
                  İlanlar
                  <svg
                    className={`w-4 h-4 transition-transform ${megaOpen ? "rotate-180" : ""}`}
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </button>

                {megaOpen && (
                  <div
                    className="absolute top-full left-1/2 -translate-x-1/2 mt-2 w-[600px] bg-white rounded-xl shadow-xl border border-gray-100 p-6 z-50"
                    onMouseLeave={() => setMegaOpen(false)}
                  >
                    <div className="grid grid-cols-2 gap-8">
                      <div>
                        <h4 className="text-xs font-semibold text-primary-600 uppercase tracking-wider mb-3">
                          Satılık
                        </h4>
                        <div className="space-y-1">
                          {listingTypes.map((t) => (
                            <Link
                              key={`satilik-${t.value}`}
                              to={`/ilanlar?status=satilik&type=${t.value}`}
                              className="block px-3 py-2 text-sm text-gray-600 hover:text-primary-600 hover:bg-primary-50 rounded-md transition-colors"
                            >
                              Satılık {t.label}
                            </Link>
                          ))}
                        </div>
                      </div>
                      <div>
                        <h4 className="text-xs font-semibold text-primary-600 uppercase tracking-wider mb-3">
                          Kiralık
                        </h4>
                        <div className="space-y-1">
                          {listingTypes.map((t) => (
                            <Link
                              key={`kiralik-${t.value}`}
                              to={`/ilanlar?status=kiralik&type=${t.value}`}
                              className="block px-3 py-2 text-sm text-gray-600 hover:text-primary-600 hover:bg-primary-50 rounded-md transition-colors"
                            >
                              Kiralık {t.label}
                            </Link>
                          ))}
                        </div>
                      </div>
                    </div>
                    <div className="border-t mt-4 pt-4">
                      <Link
                        to="/ilanlar"
                        className="text-sm font-medium text-primary-600 hover:text-primary-700 flex items-center gap-1"
                      >
                        Tüm İlanları Görüntüle →
                      </Link>
                    </div>
                  </div>
                )}
              </div>

              {navLink("/hakkimizda", "Hakkımızda")}
              {navLink("/blog", "Blog")}
              {navLink("/iletisim", "İletişim")}
            </div>

            {/* CTA + Mobile toggle */}
            <div className="flex items-center gap-3">
              {contact.whatsapp && (
                <a
                  href={`https://wa.me/${contact.whatsapp}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hidden md:inline-flex btn-primary text-sm py-2 px-4"
                >
                  <svg
                    className="w-4 h-4"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                  </svg>
                  WhatsApp
                </a>
              )}
              <button
                onClick={() => setMobileOpen(true)}
                className="lg:hidden p-2 text-gray-600 hover:text-primary-600 hover:bg-gray-100 rounded-lg transition-colors"
                aria-label="Menü"
              >
                <HiOutlineMenu className="w-6 h-6" />
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile menu */}
      <MobileMenu
        open={mobileOpen}
        onClose={() => setMobileOpen(false)}
        settings={settings}
        contact={contact}
      />
    </>
  );
}
