import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { getListing } from "../services/api";
import ImageLightbox from "../components/ImageLightbox";
import { HiOutlineLocationMarker } from "react-icons/hi";
import { BiBed, BiBath, BiArea, BiBuildings, BiCalendar } from "react-icons/bi";

const statusLabels = { satilik: "Satılık", kiralik: "Kiralık" };

export default function ListingDetail() {
  const { slug } = useParams();
  const [listing, setListing] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);

  useEffect(() => {
    setLoading(true);
    getListing(slug)
      .then((r) => setListing(r.data.listing))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [slug]);

  const formatPrice = (price, currency = "TL") => {
    if (!price) return "Fiyat Sorunuz";
    return new Intl.NumberFormat("tr-TR").format(price) + " " + currency;
  };

  if (loading) {
    return (
      <div className="page-container py-20 text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
      </div>
    );
  }

  if (!listing) {
    return (
      <div className="page-container py-20 text-center">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">
          İlan Bulunamadı
        </h2>
        <p className="text-gray-500">Bu ilan mevcut değil veya kaldırılmış.</p>
      </div>
    );
  }

  const images = listing.images || [];
  const features = listing.features || [];

  const detailItems = [
    { label: "Durum", value: statusLabels[listing.status], icon: BiBuildings },
    { label: "Tip", value: listing.type, icon: BiBuildings },
    { label: "Oda Sayısı", value: listing.rooms, icon: BiBed },
    { label: "Banyo", value: listing.bathrooms, icon: BiBath },
    {
      label: "Metrekare",
      value: listing.sqm ? `${listing.sqm} m²` : null,
      icon: BiArea,
    },
    { label: "Kat", value: listing.floor, icon: BiBuildings },
    { label: "Toplam Kat", value: listing.totalFloors, icon: BiBuildings },
    {
      label: "Bina Yaşı",
      value: listing.buildingAge != null ? `${listing.buildingAge} yıl` : null,
      icon: BiCalendar,
    },
    { label: "Isıtma", value: listing.heating, icon: BiBuildings },
    {
      label: "Eşya",
      value:
        listing.furnished === "evet"
          ? "Eşyalı"
          : listing.furnished === "hayir"
            ? "Eşyasız"
            : null,
      icon: BiBuildings,
    },
  ].filter((item) => item.value);

  return (
    <div>
      {/* Header */}
      <div className="bg-white border-b border-gray-100">
        <div className="page-container py-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
                {listing.title}
              </h1>
              {(listing.city || listing.district) && (
                <p className="flex items-center gap-1 text-gray-500 mt-1">
                  <HiOutlineLocationMarker className="w-5 h-5" />
                  {[listing.neighborhood, listing.district, listing.city]
                    .filter(Boolean)
                    .join(", ")}
                </p>
              )}
            </div>
            <div className="text-right">
              <div className="text-3xl font-bold text-primary-600">
                {formatPrice(listing.price, listing.currency)}
              </div>
              <span
                className={`inline-block mt-1 text-sm font-semibold px-3 py-1 rounded-full ${
                  listing.status === "satilik"
                    ? "bg-green-100 text-green-700"
                    : "bg-blue-100 text-blue-700"
                }`}
              >
                {statusLabels[listing.status] || listing.status}
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="page-container py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Image gallery */}
            {images.length > 0 && (
              <div>
                {/* Main image */}
                <div
                  className="aspect-[16/10] rounded-xl overflow-hidden cursor-pointer mb-3"
                  onClick={() => setLightboxOpen(true)}
                >
                  <img
                    src={images[selectedImage]?.imageUrl}
                    alt={listing.title}
                    className="w-full h-full object-contain bg-gray-100"
                  />
                </div>

                {/* Thumbnails */}
                {images.length > 1 && (
                  <div className="flex gap-2 overflow-x-auto pb-2">
                    {images.map((img, i) => (
                      <button
                        key={img.id}
                        onClick={() => setSelectedImage(i)}
                        className={`shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-colors ${
                          i === selectedImage
                            ? "border-primary-500"
                            : "border-transparent hover:border-gray-300"
                        }`}
                      >
                        <img
                          src={img.imageUrl}
                          alt=""
                          className="w-full h-full object-cover"
                        />
                      </button>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Description */}
            {listing.description && (
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                <h2 className="text-xl font-bold text-gray-800 mb-4">
                  Açıklama
                </h2>
                <div
                  className="prose max-w-none text-gray-600"
                  dangerouslySetInnerHTML={{ __html: listing.description }}
                />
              </div>
            )}

            {/* Additional features */}
            {features.length > 0 && (
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                <h2 className="text-xl font-bold text-gray-800 mb-4">
                  Ek Özellikler
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {features.map((f) => (
                    <div
                      key={f.id}
                      className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                    >
                      <span className="text-sm font-medium text-gray-700">
                        {f.featureName}
                      </span>
                      <span className="text-sm text-gray-500">
                        {f.featureValue}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Map */}
            {listing.mapCode && (
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                <h2 className="text-xl font-bold text-gray-800 mb-4">Konum</h2>
                <div
                  className="map-container rounded-lg overflow-hidden"
                  dangerouslySetInnerHTML={{ __html: listing.mapCode }}
                />
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Details card */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 sticky top-24">
              <h3 className="text-lg font-bold text-gray-800 mb-4">
                İlan Detayları
              </h3>
              <div className="space-y-3">
                {detailItems.map((item, i) => (
                  <div
                    key={i}
                    className="flex items-center justify-between py-2 border-b border-gray-50 last:border-0"
                  >
                    <div className="flex items-center gap-2">
                      <item.icon className="w-5 h-5 text-primary-500" />
                      <span className="text-sm text-gray-600">
                        {item.label}
                      </span>
                    </div>
                    <span className="text-sm font-medium text-gray-800 capitalize">
                      {item.value}
                    </span>
                  </div>
                ))}
              </div>

              {/* Address */}
              {listing.address && (
                <div className="mt-4 pt-4 border-t border-gray-100">
                  <div className="flex items-start gap-2">
                    <HiOutlineLocationMarker className="w-5 h-5 text-primary-500 shrink-0 mt-0.5" />
                    <p className="text-sm text-gray-600">{listing.address}</p>
                  </div>
                </div>
              )}

              {/* Contact CTA */}
              <div className="mt-6 space-y-3">
                <a href="/iletisim" className="btn-primary w-full">
                  İletişime Geçin
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Lightbox */}
      {lightboxOpen && (
        <ImageLightbox
          images={images}
          currentIndex={selectedImage}
          onClose={() => setLightboxOpen(false)}
          onPrev={() =>
            setSelectedImage(
              (prev) => (prev - 1 + images.length) % images.length,
            )
          }
          onNext={() => setSelectedImage((prev) => (prev + 1) % images.length)}
        />
      )}
    </div>
  );
}
