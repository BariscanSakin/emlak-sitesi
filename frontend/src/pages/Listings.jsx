import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { getListings, getListingFilters } from "../services/api";
import ListingCard from "../components/ListingCard";
import {
  HiOutlineSearch,
  HiOutlineAdjustments,
  HiOutlineX,
} from "react-icons/hi";

const statusOptions = [
  { value: "", label: "Tümü" },
  { value: "satilik", label: "Satılık" },
  { value: "kiralik", label: "Kiralık" },
];

const typeOptions = [
  { value: "", label: "Tümü" },
  { value: "daire", label: "Daire" },
  { value: "villa", label: "Villa" },
  { value: "arsa", label: "Arsa" },
  { value: "isyeri", label: "İş Yeri" },
  { value: "mustakil", label: "Müstakil Ev" },
  { value: "residence", label: "Residence" },
];

const sortOptions = [
  { value: "newest", label: "En Yeni" },
  { value: "oldest", label: "En Eski" },
  { value: "price_asc", label: "Fiyat (Düşük → Yüksek)" },
  { value: "price_desc", label: "Fiyat (Yüksek → Düşük)" },
];

const roomOptions = ["1+0", "1+1", "2+1", "3+1", "4+1", "5+1", "6+"];

export default function Listings() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [listings, setListings] = useState([]);
  const [pagination, setPagination] = useState({});
  const [loading, setLoading] = useState(true);
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [availableFilters, setAvailableFilters] = useState({
    cities: [],
    types: [],
    rooms: [],
  });

  const [filters, setFilters] = useState({
    search: searchParams.get("search") || "",
    status: searchParams.get("status") || "",
    type: searchParams.get("type") || "",
    city: searchParams.get("city") || "",
    rooms: searchParams.get("rooms") || "",
    minPrice: searchParams.get("minPrice") || "",
    maxPrice: searchParams.get("maxPrice") || "",
    minSqm: searchParams.get("minSqm") || "",
    maxSqm: searchParams.get("maxSqm") || "",
    sort: searchParams.get("sort") || "newest",
    page: parseInt(searchParams.get("page")) || 1,
  });

  useEffect(() => {
    getListingFilters()
      .then((r) => setAvailableFilters(r.data))
      .catch(() => {});
  }, []);

  useEffect(() => {
    setLoading(true);
    const params = {};
    Object.entries(filters).forEach(([key, val]) => {
      if (val) params[key] = val;
    });

    getListings(params)
      .then((r) => {
        setListings(r.data.listings);
        setPagination(r.data.pagination);
      })
      .catch(() => {})
      .finally(() => setLoading(false));

    // Update URL
    const newParams = new URLSearchParams();
    Object.entries(filters).forEach(([key, val]) => {
      if (val && key !== "page") newParams.set(key, val);
      if (key === "page" && val > 1) newParams.set(key, val);
    });
    setSearchParams(newParams, { replace: true });
  }, [filters]);

  const updateFilter = (key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value, page: 1 }));
  };

  const clearFilters = () => {
    setFilters({
      search: "",
      status: "",
      type: "",
      city: "",
      rooms: "",
      minPrice: "",
      maxPrice: "",
      minSqm: "",
      maxSqm: "",
      sort: "newest",
      page: 1,
    });
  };

  const hasActiveFilters =
    filters.status ||
    filters.type ||
    filters.city ||
    filters.rooms ||
    filters.minPrice ||
    filters.maxPrice ||
    filters.minSqm ||
    filters.maxSqm;

  return (
    <div>
      {/* Page header */}
      <div className="bg-gradient-to-r from-primary-700 to-primary-600 text-white py-16">
        <div className="page-container">
          <h1 className="text-4xl font-bold">İlanlar</h1>
          <p className="text-primary-100 mt-2">
            {pagination.total
              ? `${pagination.total} ilan bulundu`
              : "Emlak ilanlarını keşfedin"}
          </p>
        </div>
      </div>

      <div className="page-container py-8">
        {/* Search and filter bar */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 mb-6">
          <div className="flex flex-col md:flex-row gap-4">
            {/* Search */}
            <div className="flex-1 relative">
              <HiOutlineSearch className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                value={filters.search}
                onChange={(e) => updateFilter("search", e.target.value)}
                placeholder="Ara..."
                className="input-field pl-10"
              />
            </div>

            {/* Status */}
            <select
              value={filters.status}
              onChange={(e) => updateFilter("status", e.target.value)}
              className="input-field md:w-40"
            >
              {statusOptions.map((o) => (
                <option key={o.value} value={o.value}>
                  {o.label}
                </option>
              ))}
            </select>

            {/* Type */}
            <select
              value={filters.type}
              onChange={(e) => updateFilter("type", e.target.value)}
              className="input-field md:w-40"
            >
              {typeOptions.map((o) => (
                <option key={o.value} value={o.value}>
                  {o.label}
                </option>
              ))}
            </select>

            {/* Sort */}
            <select
              value={filters.sort}
              onChange={(e) => updateFilter("sort", e.target.value)}
              className="input-field md:w-52"
            >
              {sortOptions.map((o) => (
                <option key={o.value} value={o.value}>
                  {o.label}
                </option>
              ))}
            </select>

            {/* Filter toggle */}
            <button
              onClick={() => setFiltersOpen(!filtersOpen)}
              className={`btn-secondary ${filtersOpen ? "bg-primary-50 text-primary-600 border-primary-300" : ""}`}
            >
              <HiOutlineAdjustments className="w-5 h-5" />
              Filtre
            </button>
          </div>

          {/* Advanced filters */}
          {filtersOpen && (
            <div className="border-t border-gray-100 mt-4 pt-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Şehir
                </label>
                <select
                  value={filters.city}
                  onChange={(e) => updateFilter("city", e.target.value)}
                  className="input-field"
                >
                  <option value="">Tümü</option>
                  {availableFilters.cities.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Oda Sayısı
                </label>
                <select
                  value={filters.rooms}
                  onChange={(e) => updateFilter("rooms", e.target.value)}
                  className="input-field"
                >
                  <option value="">Tümü</option>
                  {roomOptions.map((r) => (
                    <option key={r} value={r}>
                      {r}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Min Fiyat (TL)
                </label>
                <input
                  type="number"
                  value={filters.minPrice}
                  onChange={(e) => updateFilter("minPrice", e.target.value)}
                  placeholder="0"
                  className="input-field"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Max Fiyat (TL)
                </label>
                <input
                  type="number"
                  value={filters.maxPrice}
                  onChange={(e) => updateFilter("maxPrice", e.target.value)}
                  placeholder="∞"
                  className="input-field"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Min m²
                </label>
                <input
                  type="number"
                  value={filters.minSqm}
                  onChange={(e) => updateFilter("minSqm", e.target.value)}
                  placeholder="0"
                  className="input-field"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Max m²
                </label>
                <input
                  type="number"
                  value={filters.maxSqm}
                  onChange={(e) => updateFilter("maxSqm", e.target.value)}
                  placeholder="∞"
                  className="input-field"
                />
              </div>
              <div className="md:col-span-2 flex items-end">
                {hasActiveFilters && (
                  <button
                    onClick={clearFilters}
                    className="btn-secondary text-sm"
                  >
                    <HiOutlineX className="w-4 h-4" />
                    Filtreleri Temizle
                  </button>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Results */}
        {loading ? (
          <div className="text-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
          </div>
        ) : listings.length === 0 ? (
          <div className="text-center py-20">
            <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <HiOutlineSearch className="w-10 h-10 text-gray-400" />
            </div>
            <h3 className="text-xl font-semibold text-gray-800 mb-2">
              İlan Bulunamadı
            </h3>
            <p className="text-gray-500">
              Arama kriterlerinizi değiştirerek tekrar deneyin.
            </p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {listings.map((listing) => (
                <ListingCard key={listing.id} listing={listing} />
              ))}
            </div>

            {/* Pagination */}
            {pagination.totalPages > 1 && (
              <div className="flex items-center justify-center gap-2 mt-10">
                {Array.from(
                  { length: pagination.totalPages },
                  (_, i) => i + 1,
                ).map((p) => (
                  <button
                    key={p}
                    onClick={() => setFilters((prev) => ({ ...prev, page: p }))}
                    className={`w-10 h-10 rounded-lg font-medium text-sm transition-colors ${
                      p === pagination.page
                        ? "bg-primary-600 text-white"
                        : "bg-white text-gray-600 border border-gray-200 hover:bg-gray-50"
                    }`}
                  >
                    {p}
                  </button>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
