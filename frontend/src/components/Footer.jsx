import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  HiOutlinePhone,
  HiOutlineMail,
  HiOutlineLocationMarker,
} from "react-icons/hi";
import { FaFacebookF, FaInstagram, FaTwitter, FaYoutube } from "react-icons/fa";
import { getSettings, getContact } from "../services/api";

export default function Footer() {
  const [settings, setSettings] = useState({});
  const [contact, setContact] = useState({});

  useEffect(() => {
    getSettings()
      .then((r) => setSettings(r.data.settings))
      .catch(() => {});
    getContact()
      .then((r) => setContact(r.data.contact))
      .catch(() => {});
  }, []);

  return (
    <footer className="bg-gray-900 text-gray-300">
      <div className="page-container py-12 lg:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="lg:col-span-1">
            <Link to="/" className="flex items-center gap-2 mb-4">
              {settings.logo ? (
                <img
                  src={settings.logo}
                  alt="Logo"
                  className="h-10 w-auto brightness-200"
                />
              ) : (
                <div className="flex items-center gap-2">
                  <div className="w-10 h-10 bg-primary-600 rounded-lg flex items-center justify-center">
                    <span className="text-white font-bold text-xl">E</span>
                  </div>
                  <span className="text-xl font-bold text-white">
                    {settings.siteName || "Emlak"}
                  </span>
                </div>
              )}
            </Link>
            <p className="text-sm text-gray-400 leading-relaxed">
              {settings.siteDescription ||
                "Gayrimenkul danışmanlık hizmetleri ile hayalinizdeki eve kavuşun."}
            </p>
            <div className="flex gap-3 mt-4">
              {contact.facebook && (
                <a
                  href={contact.facebook}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-9 h-9 bg-gray-800 rounded-lg flex items-center justify-center hover:bg-primary-600 transition-colors"
                >
                  <FaFacebookF className="w-4 h-4" />
                </a>
              )}
              {contact.instagram && (
                <a
                  href={contact.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-9 h-9 bg-gray-800 rounded-lg flex items-center justify-center hover:bg-primary-600 transition-colors"
                >
                  <FaInstagram className="w-4 h-4" />
                </a>
              )}
              {contact.twitter && (
                <a
                  href={contact.twitter}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-9 h-9 bg-gray-800 rounded-lg flex items-center justify-center hover:bg-primary-600 transition-colors"
                >
                  <FaTwitter className="w-4 h-4" />
                </a>
              )}
              {contact.youtube && (
                <a
                  href={contact.youtube}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-9 h-9 bg-gray-800 rounded-lg flex items-center justify-center hover:bg-primary-600 transition-colors"
                >
                  <FaYoutube className="w-4 h-4" />
                </a>
              )}
            </div>
          </div>

          {/* Quick links */}
          <div>
            <h4 className="text-white font-semibold mb-4">Hızlı Linkler</h4>
            <div className="space-y-2">
              <Link
                to="/"
                className="block text-sm hover:text-white transition-colors"
              >
                Anasayfa
              </Link>
              <Link
                to="/ilanlar"
                className="block text-sm hover:text-white transition-colors"
              >
                İlanlar
              </Link>
              <Link
                to="/ilanlar?status=satilik"
                className="block text-sm hover:text-white transition-colors"
              >
                Satılık İlanlar
              </Link>
              <Link
                to="/ilanlar?status=kiralik"
                className="block text-sm hover:text-white transition-colors"
              >
                Kiralık İlanlar
              </Link>
              <Link
                to="/blog"
                className="block text-sm hover:text-white transition-colors"
              >
                Blog
              </Link>
              <Link
                to="/hakkimizda"
                className="block text-sm hover:text-white transition-colors"
              >
                Hakkımızda
              </Link>
            </div>
          </div>

          {/* Property types */}
          <div>
            <h4 className="text-white font-semibold mb-4">Emlak Tipleri</h4>
            <div className="space-y-2">
              <Link
                to="/ilanlar?type=daire"
                className="block text-sm hover:text-white transition-colors"
              >
                Daire
              </Link>
              <Link
                to="/ilanlar?type=villa"
                className="block text-sm hover:text-white transition-colors"
              >
                Villa
              </Link>
              <Link
                to="/ilanlar?type=arsa"
                className="block text-sm hover:text-white transition-colors"
              >
                Arsa
              </Link>
              <Link
                to="/ilanlar?type=isyeri"
                className="block text-sm hover:text-white transition-colors"
              >
                İş Yeri
              </Link>
              <Link
                to="/ilanlar?type=mustakil"
                className="block text-sm hover:text-white transition-colors"
              >
                Müstakil Ev
              </Link>
            </div>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-white font-semibold mb-4">İletişim</h4>
            <div className="space-y-3">
              {contact.address && (
                <div className="flex items-start gap-2 text-sm">
                  <HiOutlineLocationMarker className="w-5 h-5 text-primary-400 shrink-0 mt-0.5" />
                  <span>{contact.address}</span>
                </div>
              )}
              {contact.phone && (
                <a
                  href={`tel:${contact.phone}`}
                  className="flex items-center gap-2 text-sm hover:text-white transition-colors"
                >
                  <HiOutlinePhone className="w-5 h-5 text-primary-400" />
                  {contact.phone}
                </a>
              )}
              {contact.email && (
                <a
                  href={`mailto:${contact.email}`}
                  className="flex items-center gap-2 text-sm hover:text-white transition-colors"
                >
                  <HiOutlineMail className="w-5 h-5 text-primary-400" />
                  {contact.email}
                </a>
              )}
              {contact.workingHours && (
                <p className="text-sm text-gray-400">{contact.workingHours}</p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-gray-800">
        <div className="page-container py-4 flex flex-col md:flex-row items-center justify-between gap-2">
          <p className="text-sm text-gray-500">
            {settings.footerText ||
              "© 2024 Emlak Sitesi. Tüm hakları saklıdır."}
          </p>
          <div className="flex gap-4 text-sm text-gray-500">
            <Link to="/gizlilik" className="hover:text-gray-300">
              Gizlilik Politikası
            </Link>
            <Link to="/kvkk" className="hover:text-gray-300">
              KVKK
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
