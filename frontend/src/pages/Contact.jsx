import { useState, useEffect } from "react";
import { getContact } from "../services/api";
import {
  HiOutlinePhone,
  HiOutlineMail,
  HiOutlineLocationMarker,
  HiOutlineClock,
} from "react-icons/hi";
import { FaWhatsapp } from "react-icons/fa";

export default function Contact() {
  const [contact, setContact] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getContact()
      .then((r) => setContact(r.data.contact))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="page-container py-20 text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
      </div>
    );
  }

  return (
    <div>
      {/* Page header */}
      <div className="bg-gradient-to-r from-primary-700 to-primary-600 text-white py-16">
        <div className="page-container">
          <h1 className="text-4xl font-bold">İletişim</h1>
          <p className="text-primary-100 mt-2">
            Bize ulaşın, size yardımcı olalım
          </p>
        </div>
      </div>

      <div className="page-container py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Contact info cards */}
          <div className="space-y-6">
            {contact?.phone && (
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 flex items-start gap-4">
                <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center shrink-0">
                  <HiOutlinePhone className="w-6 h-6 text-primary-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-800 mb-1">Telefon</h3>
                  <a
                    href={`tel:${contact.phone}`}
                    className="text-gray-600 hover:text-primary-600 transition-colors block"
                  >
                    {contact.phone}
                  </a>
                  {contact.phone2 && (
                    <a
                      href={`tel:${contact.phone2}`}
                      className="text-gray-600 hover:text-primary-600 transition-colors block"
                    >
                      {contact.phone2}
                    </a>
                  )}
                </div>
              </div>
            )}

            {contact?.email && (
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 flex items-start gap-4">
                <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center shrink-0">
                  <HiOutlineMail className="w-6 h-6 text-primary-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-800 mb-1">E-posta</h3>
                  <a
                    href={`mailto:${contact.email}`}
                    className="text-gray-600 hover:text-primary-600 transition-colors"
                  >
                    {contact.email}
                  </a>
                </div>
              </div>
            )}

            {contact?.address && (
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 flex items-start gap-4">
                <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center shrink-0">
                  <HiOutlineLocationMarker className="w-6 h-6 text-primary-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-800 mb-1">Adres</h3>
                  <p className="text-gray-600">{contact.address}</p>
                </div>
              </div>
            )}

            {contact?.workingHours && (
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 flex items-start gap-4">
                <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center shrink-0">
                  <HiOutlineClock className="w-6 h-6 text-primary-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-800 mb-1">
                    Çalışma Saatleri
                  </h3>
                  <p className="text-gray-600">{contact.workingHours}</p>
                </div>
              </div>
            )}

            {contact?.whatsapp && (
              <a
                href={`https://wa.me/${contact.whatsapp}`}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-green-500 hover:bg-green-600 text-white rounded-xl p-6 flex items-center gap-4 transition-colors"
              >
                <div className="w-12 h-12 bg-green-400 rounded-lg flex items-center justify-center shrink-0">
                  <FaWhatsapp className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-semibold mb-1">WhatsApp</h3>
                  <p className="text-green-100 text-sm">
                    Hızlı iletişim için WhatsApp'tan yazın
                  </p>
                </div>
              </a>
            )}
          </div>

          {/* Map */}
          <div>
            {contact?.mapCode ? (
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 h-full min-h-[400px]">
                <div
                  className="map-container h-full"
                  dangerouslySetInnerHTML={{ __html: contact.mapCode }}
                />
              </div>
            ) : (
              <div className="bg-gray-100 rounded-xl h-full min-h-[400px] flex items-center justify-center">
                <p className="text-gray-400">Harita bilgisi eklenmemiş</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
