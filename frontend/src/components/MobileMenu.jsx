import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  HiOutlineX,
  HiOutlineChevronDown,
  HiOutlinePhone,
  HiOutlineMail,
} from "react-icons/hi";

const listingTypes = [
  { label: "Daire", value: "daire" },
  { label: "Villa", value: "villa" },
  { label: "Arsa", value: "arsa" },
  { label: "İş Yeri", value: "isyeri" },
  { label: "Müstakil Ev", value: "mustakil" },
  { label: "Residence", value: "residence" },
];

export default function MobileMenu({ open, onClose, settings, contact }) {
  const [ilanlarOpen, setIlanlarOpen] = useState(false);
  const location = useLocation();

  const isActive = (path) => location.pathname === path;

  const menuLink = (to, label) => (
    <Link
      to={to}
      onClick={onClose}
      className={`block px-4 py-3 text-base font-medium border-b border-gray-100 transition-colors ${
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
      {/* Overlay */}
      {open && (
        <div
          className="fixed inset-0 bg-black/50 z-50 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sliding panel */}
      <div
        className={`fixed top-0 right-0 h-full w-3/4 max-w-sm bg-white z-50 transform transition-transform duration-300 ease-out shadow-2xl lg:hidden ${
          open ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <div className="flex items-center gap-2">
            {settings?.logo ? (
              <img src={settings.logo} alt="Logo" className="h-8 w-auto" />
            ) : (
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold">E</span>
                </div>
                <span className="font-bold text-gray-800">
                  {settings?.siteName || "Emlak"}
                </span>
              </div>
            )}
          </div>
          <button
            onClick={onClose}
            className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg"
            aria-label="Kapat"
          >
            <HiOutlineX className="w-6 h-6" />
          </button>
        </div>

        {/* Menu items */}
        <div className="overflow-y-auto h-[calc(100%-80px)]">
          <nav className="py-2">
            {menuLink("/", "Anasayfa")}

            {/* İlanlar dropdown */}
            <div>
              <button
                onClick={() => setIlanlarOpen(!ilanlarOpen)}
                className={`w-full flex items-center justify-between px-4 py-3 text-base font-medium border-b border-gray-100 ${
                  location.pathname.startsWith("/ilanlar")
                    ? "text-primary-600 bg-primary-50"
                    : "text-gray-700"
                }`}
              >
                İlanlar
                <HiOutlineChevronDown
                  className={`w-5 h-5 transition-transform ${ilanlarOpen ? "rotate-180" : ""}`}
                />
              </button>
              {ilanlarOpen && (
                <div className="bg-gray-50 border-b border-gray-100">
                  <div className="px-4 py-2">
                    <p className="text-xs font-semibold text-primary-600 uppercase tracking-wider py-1">
                      Satılık
                    </p>
                    {listingTypes.map((t) => (
                      <Link
                        key={`m-satilik-${t.value}`}
                        to={`/ilanlar?status=satilik&type=${t.value}`}
                        onClick={onClose}
                        className="block py-2 pl-4 text-sm text-gray-600 hover:text-primary-600"
                      >
                        Satılık {t.label}
                      </Link>
                    ))}
                    <p className="text-xs font-semibold text-primary-600 uppercase tracking-wider py-1 mt-2">
                      Kiralık
                    </p>
                    {listingTypes.map((t) => (
                      <Link
                        key={`m-kiralik-${t.value}`}
                        to={`/ilanlar?status=kiralik&type=${t.value}`}
                        onClick={onClose}
                        className="block py-2 pl-4 text-sm text-gray-600 hover:text-primary-600"
                      >
                        Kiralık {t.label}
                      </Link>
                    ))}
                    <Link
                      to="/ilanlar"
                      onClick={onClose}
                      className="block py-2 mt-2 text-sm font-medium text-primary-600"
                    >
                      Tüm İlanlar →
                    </Link>
                  </div>
                </div>
              )}
            </div>

            {menuLink("/hakkimizda", "Hakkımızda")}
            {menuLink("/blog", "Blog")}
            {menuLink("/iletisim", "İletişim")}
          </nav>

          {/* Contact info */}
          <div className="p-4 mt-4 border-t border-gray-200">
            {contact?.phone && (
              <a
                href={`tel:${contact.phone}`}
                className="flex items-center gap-2 text-sm text-gray-600 mb-3"
              >
                <HiOutlinePhone className="w-5 h-5 text-primary-600" />{" "}
                {contact.phone}
              </a>
            )}
            {contact?.email && (
              <a
                href={`mailto:${contact.email}`}
                className="flex items-center gap-2 text-sm text-gray-600 mb-3"
              >
                <HiOutlineMail className="w-5 h-5 text-primary-600" />{" "}
                {contact.email}
              </a>
            )}
            {contact?.whatsapp && (
              <a
                href={`https://wa.me/${contact.whatsapp}`}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-primary w-full text-sm mt-2"
              >
                WhatsApp ile İletişim
              </a>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
