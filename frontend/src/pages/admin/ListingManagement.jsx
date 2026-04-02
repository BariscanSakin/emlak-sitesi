import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  getAllListings,
  deleteListing as deleteListingApi,
} from "../../services/api";
import {
  HiOutlinePlus,
  HiOutlinePencil,
  HiOutlineTrash,
  HiOutlineEye,
} from "react-icons/hi";

const statusLabels = { satilik: "Satılık", kiralik: "Kiralık" };

export default function ListingManagement() {
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const loadListings = () => {
    setLoading(true);
    getAllListings()
      .then((r) => setListings(r.data.listings))
      .catch(() => {})
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadListings();
  }, []);

  const handleDelete = async (id, title) => {
    if (!window.confirm(`"${title}" ilanını silmek istediğinize emin misiniz?`))
      return;
    try {
      await deleteListingApi(id);
      loadListings();
    } catch {
      alert("Silme işlemi başarısız oldu.");
    }
  };

  const formatPrice = (price) => {
    if (!price) return "-";
    return new Intl.NumberFormat("tr-TR").format(price) + " TL";
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">İlan Yönetimi</h1>
          <p className="text-gray-500 mt-1">{listings.length} ilan</p>
        </div>
        <Link to="/admin/ilanlar/yeni" className="btn-primary">
          <HiOutlinePlus className="w-5 h-5" /> Yeni İlan
        </Link>
      </div>

      {loading ? (
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary-600 mx-auto"></div>
        </div>
      ) : listings.length === 0 ? (
        <div className="bg-white rounded-xl border border-gray-100 p-12 text-center">
          <p className="text-gray-500 mb-4">Henüz ilan eklenmemiş.</p>
          <Link to="/admin/ilanlar/yeni" className="btn-primary">
            İlk İlanı Ekle
          </Link>
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-100">
                  <th className="text-left px-4 py-3 font-medium text-gray-600">
                    Resim
                  </th>
                  <th className="text-left px-4 py-3 font-medium text-gray-600">
                    Başlık
                  </th>
                  <th className="text-left px-4 py-3 font-medium text-gray-600">
                    Durum
                  </th>
                  <th className="text-left px-4 py-3 font-medium text-gray-600">
                    Fiyat
                  </th>
                  <th className="text-left px-4 py-3 font-medium text-gray-600">
                    Tip
                  </th>
                  <th className="text-left px-4 py-3 font-medium text-gray-600">
                    Aktif
                  </th>
                  <th className="text-right px-4 py-3 font-medium text-gray-600">
                    İşlemler
                  </th>
                </tr>
              </thead>
              <tbody>
                {listings.map((listing) => (
                  <tr
                    key={listing.id}
                    className="border-b border-gray-50 hover:bg-gray-50 transition-colors"
                  >
                    <td className="px-4 py-3">
                      <div className="w-16 h-12 rounded-lg overflow-hidden bg-gray-100">
                        {listing.images && listing.images[0] ? (
                          <img
                            src={listing.images[0].imageUrl}
                            alt=""
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-gray-400 text-xs">
                            Yok
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="font-medium text-gray-800">
                        {listing.title}
                      </div>
                      <div className="text-xs text-gray-400">
                        {listing.city}{" "}
                        {listing.district && `/ ${listing.district}`}
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`text-xs font-medium px-2 py-1 rounded-full ${
                          listing.status === "satilik"
                            ? "bg-green-100 text-green-700"
                            : "bg-blue-100 text-blue-700"
                        }`}
                      >
                        {statusLabels[listing.status] || listing.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 font-medium">
                      {formatPrice(listing.price)}
                    </td>
                    <td className="px-4 py-3 capitalize">{listing.type}</td>
                    <td className="px-4 py-3">
                      <span
                        className={`w-3 h-3 rounded-full inline-block ${listing.isActive ? "bg-green-500" : "bg-gray-300"}`}
                      ></span>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <a
                          href={`/ilan/${listing.slug}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-2 text-gray-400 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-colors"
                          title="Görüntüle"
                        >
                          <HiOutlineEye className="w-5 h-5" />
                        </a>
                        <button
                          onClick={() =>
                            navigate(`/admin/ilanlar/${listing.id}/duzenle`)
                          }
                          className="p-2 text-gray-400 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-colors"
                          title="Düzenle"
                        >
                          <HiOutlinePencil className="w-5 h-5" />
                        </button>
                        <button
                          onClick={() =>
                            handleDelete(listing.id, listing.title)
                          }
                          className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          title="Sil"
                        >
                          <HiOutlineTrash className="w-5 h-5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
