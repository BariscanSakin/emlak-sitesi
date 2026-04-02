import { Link } from "react-router-dom";
import { HiOutlineLocationMarker } from "react-icons/hi";
import { BiBed, BiArea } from "react-icons/bi";

const statusLabels = { satilik: "Satılık", kiralik: "Kiralık" };
const statusColors = { satilik: "bg-green-500", kiralik: "bg-blue-500" };

export default function ListingCard({ listing }) {
  const mainImage =
    listing.images && listing.images.length > 0
      ? listing.images[0].imageUrl
      : "/placeholder-house.svg";

  const formatPrice = (price, currency = "TL") => {
    if (!price) return "Fiyat Sorunuz";
    return new Intl.NumberFormat("tr-TR").format(price) + " " + currency;
  };

  return (
    <Link to={`/ilan/${listing.slug}`} className="card group">
      {/* Image */}
      <div className="relative aspect-[4/3] overflow-hidden">
        <img
          src={mainImage}
          alt={listing.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />
        {/* Status badge */}
        <div
          className={`absolute top-3 left-3 ${statusColors[listing.status] || "bg-gray-500"} text-white text-xs font-semibold px-3 py-1 rounded-full`}
        >
          {statusLabels[listing.status] || listing.status}
        </div>
        {listing.isFeatured && (
          <div className="absolute top-3 right-3 bg-amber-500 text-white text-xs font-semibold px-3 py-1 rounded-full">
            Öne Çıkan
          </div>
        )}
        {/* Image count */}
        {listing.images && listing.images.length > 1 && (
          <div className="absolute bottom-3 right-3 bg-black/60 text-white text-xs px-2 py-1 rounded-md flex items-center gap-1">
            <svg
              className="w-3 h-3"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
            {listing.images.length}
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-4">
        <div className="text-xl font-bold text-primary-600 mb-1">
          {formatPrice(listing.price, listing.currency)}
        </div>
        <h3 className="font-semibold text-gray-800 mb-2 line-clamp-1 group-hover:text-primary-600 transition-colors">
          {listing.title}
        </h3>

        {/* Location */}
        {(listing.city || listing.district) && (
          <div className="flex items-center gap-1 text-sm text-gray-500 mb-3">
            <HiOutlineLocationMarker className="w-4 h-4" />
            <span>
              {[listing.district, listing.city].filter(Boolean).join(", ")}
            </span>
          </div>
        )}

        {/* Features */}
        <div className="flex items-center gap-4 pt-3 border-t border-gray-100">
          {listing.rooms && (
            <div className="flex items-center gap-1 text-sm text-gray-600">
              <BiBed className="w-4 h-4" />
              <span>{listing.rooms}</span>
            </div>
          )}
          {listing.sqm && (
            <div className="flex items-center gap-1 text-sm text-gray-600">
              <BiArea className="w-4 h-4" />
              <span>{listing.sqm} m²</span>
            </div>
          )}
          {listing.type && (
            <div className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded capitalize">
              {listing.type}
            </div>
          )}
        </div>
      </div>
    </Link>
  );
}
