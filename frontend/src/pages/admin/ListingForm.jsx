import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  getListing,
  createListing,
  updateListing,
  uploadListingImages,
  deleteListingImage,
} from "../../services/api";
import {
  HiOutlinePlus,
  HiOutlineTrash,
  HiOutlinePhotograph,
} from "react-icons/hi";

const typeOptions = [
  { value: "daire", label: "Daire" },
  { value: "villa", label: "Villa" },
  { value: "arsa", label: "Arsa" },
  { value: "isyeri", label: "İş Yeri" },
  { value: "mustakil", label: "Müstakil Ev" },
  { value: "residence", label: "Residence" },
];

const roomOptions = ["1+0", "1+1", "2+1", "3+1", "4+1", "5+1", "6+"];

export default function ListingForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = Boolean(id);

  const [form, setForm] = useState({
    title: "",
    description: "",
    price: "",
    currency: "TL",
    status: "satilik",
    type: "daire",
    rooms: "",
    bathrooms: "",
    sqm: "",
    floor: "",
    totalFloors: "",
    buildingAge: "",
    heating: "",
    furnished: "hayir",
    city: "",
    district: "",
    neighborhood: "",
    address: "",
    mapCode: "",
    isFeatured: false,
    isActive: true,
  });

  const [features, setFeatures] = useState([]);
  const [images, setImages] = useState([]);
  const [newImages, setNewImages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (isEdit) {
      setLoading(true);
      // We need to get listing by ID - use slug from existing listing
      // First get all listings to find this one
      import("../../services/api").then((api) => {
        api
          .getAllListings()
          .then((r) => {
            const listing = r.data.listings.find((l) => l.id === parseInt(id));
            if (listing) {
              // Get full data with slug
              api
                .getListing(listing.slug)
                .then((res) => {
                  const l = res.data.listing;
                  setForm({
                    title: l.title || "",
                    description: l.description || "",
                    price: l.price || "",
                    currency: l.currency || "TL",
                    status: l.status || "satilik",
                    type: l.type || "daire",
                    rooms: l.rooms || "",
                    bathrooms: l.bathrooms || "",
                    sqm: l.sqm || "",
                    floor: l.floor || "",
                    totalFloors: l.totalFloors || "",
                    buildingAge: l.buildingAge || "",
                    heating: l.heating || "",
                    furnished: l.furnished || "hayir",
                    city: l.city || "",
                    district: l.district || "",
                    neighborhood: l.neighborhood || "",
                    address: l.address || "",
                    mapCode: l.mapCode || "",
                    isFeatured: l.isFeatured || false,
                    isActive: l.isActive !== false,
                  });
                  setFeatures(l.features || []);
                  setImages(l.images || []);
                })
                .finally(() => setLoading(false));
            } else {
              setLoading(false);
            }
          })
          .catch(() => setLoading(false));
      });
    }
  }, [id, isEdit]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const addFeature = () => {
    setFeatures([...features, { featureName: "", featureValue: "" }]);
  };

  const updateFeature = (index, field, value) => {
    const updated = [...features];
    updated[index] = { ...updated[index], [field]: value };
    setFeatures(updated);
  };

  const removeFeature = (index) => {
    setFeatures(features.filter((_, i) => i !== index));
  };

  const handleImageSelect = (e) => {
    const files = Array.from(e.target.files);
    setNewImages((prev) => [...prev, ...files]);
  };

  const removeNewImage = (index) => {
    setNewImages((prev) => prev.filter((_, i) => i !== index));
  };

  const handleDeleteExistingImage = async (imageId) => {
    if (!window.confirm("Bu resmi silmek istediğinize emin misiniz?")) return;
    try {
      await deleteListingImage(id, imageId);
      setImages((prev) => prev.filter((img) => img.id !== imageId));
    } catch {
      alert("Resim silinemedi.");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSaving(true);

    try {
      const data = {
        ...form,
        price: parseFloat(form.price) || 0,
        sqm: parseFloat(form.sqm) || null,
        bathrooms: parseInt(form.bathrooms) || null,
        totalFloors: parseInt(form.totalFloors) || null,
        buildingAge: parseInt(form.buildingAge) || null,
        features: features.filter((f) => f.featureName && f.featureValue),
      };

      let listingId;

      if (isEdit) {
        await updateListing(id, data);
        listingId = id;
      } else {
        const res = await createListing(data);
        listingId = res.data.listing.id;
      }

      // Upload new images
      if (newImages.length > 0) {
        const formData = new FormData();
        newImages.forEach((file) => formData.append("images", file));
        await uploadListingImages(listingId, formData);
      }

      navigate("/admin/ilanlar");
    } catch (err) {
      setError(err.response?.data?.error || "Kaydetme başarısız.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="text-center py-12">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary-600 mx-auto"></div>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">
          {isEdit ? "İlan Düzenle" : "Yeni İlan"}
        </h1>
      </div>

      {error && (
        <div className="bg-red-50 text-red-600 border border-red-200 rounded-lg p-3 mb-4 text-sm">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic info */}
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
          <h2 className="text-lg font-bold text-gray-800 mb-4">
            Temel Bilgiler
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                İlan Başlığı *
              </label>
              <input
                name="title"
                value={form.title}
                onChange={handleChange}
                className="input-field"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Durum *
              </label>
              <select
                name="status"
                value={form.status}
                onChange={handleChange}
                className="input-field"
              >
                <option value="satilik">Satılık</option>
                <option value="kiralik">Kiralık</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Emlak Tipi *
              </label>
              <select
                name="type"
                value={form.type}
                onChange={handleChange}
                className="input-field"
              >
                {typeOptions.map((o) => (
                  <option key={o.value} value={o.value}>
                    {o.label}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Fiyat *
              </label>
              <input
                name="price"
                type="number"
                value={form.price}
                onChange={handleChange}
                className="input-field"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Para Birimi
              </label>
              <select
                name="currency"
                value={form.currency}
                onChange={handleChange}
                className="input-field"
              >
                <option value="TL">TL</option>
                <option value="USD">USD</option>
                <option value="EUR">EUR</option>
                <option value="GBP">GBP</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Oda Sayısı
              </label>
              <select
                name="rooms"
                value={form.rooms}
                onChange={handleChange}
                className="input-field"
              >
                <option value="">Seçin</option>
                {roomOptions.map((r) => (
                  <option key={r} value={r}>
                    {r}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Banyo Sayısı
              </label>
              <input
                name="bathrooms"
                type="number"
                value={form.bathrooms}
                onChange={handleChange}
                className="input-field"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Metrekare (m²)
              </label>
              <input
                name="sqm"
                type="number"
                value={form.sqm}
                onChange={handleChange}
                className="input-field"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Bulunduğu Kat
              </label>
              <input
                name="floor"
                value={form.floor}
                onChange={handleChange}
                className="input-field"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Toplam Kat
              </label>
              <input
                name="totalFloors"
                type="number"
                value={form.totalFloors}
                onChange={handleChange}
                className="input-field"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Bina Yaşı
              </label>
              <input
                name="buildingAge"
                type="number"
                value={form.buildingAge}
                onChange={handleChange}
                className="input-field"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Isıtma
              </label>
              <input
                name="heating"
                value={form.heating}
                onChange={handleChange}
                className="input-field"
                placeholder="Doğalgaz, Kombi vb."
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Eşya Durumu
              </label>
              <select
                name="furnished"
                value={form.furnished}
                onChange={handleChange}
                className="input-field"
              >
                <option value="hayir">Eşyasız</option>
                <option value="evet">Eşyalı</option>
              </select>
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Açıklama
              </label>
              <textarea
                name="description"
                value={form.description}
                onChange={handleChange}
                className="input-field"
                rows={5}
              />
            </div>
          </div>
        </div>

        {/* Location */}
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
          <h2 className="text-lg font-bold text-gray-800 mb-4">
            Konum Bilgileri
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Şehir
              </label>
              <input
                name="city"
                value={form.city}
                onChange={handleChange}
                className="input-field"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                İlçe
              </label>
              <input
                name="district"
                value={form.district}
                onChange={handleChange}
                className="input-field"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Mahalle
              </label>
              <input
                name="neighborhood"
                value={form.neighborhood}
                onChange={handleChange}
                className="input-field"
              />
            </div>
            <div className="md:col-span-3">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Adres
              </label>
              <input
                name="address"
                value={form.address}
                onChange={handleChange}
                className="input-field"
              />
            </div>
            <div className="md:col-span-3">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Harita Kodu (Google Maps iframe)
              </label>
              <textarea
                name="mapCode"
                value={form.mapCode}
                onChange={handleChange}
                className="input-field"
                rows={3}
                placeholder='<iframe src="https://www.google.com/maps/embed?..." ...></iframe>'
              />
            </div>
          </div>
        </div>

        {/* Images */}
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
          <h2 className="text-lg font-bold text-gray-800 mb-4">Resimler</h2>

          {/* Existing images */}
          {images.length > 0 && (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 mb-4">
              {images.map((img) => (
                <div
                  key={img.id}
                  className="relative aspect-[4/3] rounded-lg overflow-hidden border border-gray-200"
                >
                  <img
                    src={img.imageUrl}
                    alt=""
                    className="w-full h-full object-cover"
                  />
                  <button
                    type="button"
                    onClick={() => handleDeleteExistingImage(img.id)}
                    className="absolute top-2 right-2 p-1 bg-red-500 hover:bg-red-600 text-white rounded-full"
                  >
                    <HiOutlineTrash className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          )}

          {/* New images preview */}
          {newImages.length > 0 && (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 mb-4">
              {newImages.map((file, i) => (
                <div
                  key={i}
                  className="relative aspect-[4/3] rounded-lg overflow-hidden border-2 border-dashed border-primary-300 bg-primary-50"
                >
                  <img
                    src={URL.createObjectURL(file)}
                    alt=""
                    className="w-full h-full object-cover"
                  />
                  <button
                    type="button"
                    onClick={() => removeNewImage(i)}
                    className="absolute top-2 right-2 p-1 bg-red-500 hover:bg-red-600 text-white rounded-full"
                  >
                    <HiOutlineTrash className="w-4 h-4" />
                  </button>
                  <div className="absolute bottom-0 left-0 right-0 bg-primary-600 text-white text-xs text-center py-1">
                    Yeni
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Upload button */}
          <label className="flex items-center justify-center gap-2 p-6 border-2 border-dashed border-gray-300 rounded-xl hover:border-primary-400 hover:bg-primary-50 cursor-pointer transition-colors">
            <HiOutlinePhotograph className="w-6 h-6 text-gray-400" />
            <span className="text-sm text-gray-500">
              Resim Seçin (Birden fazla seçebilirsiniz)
            </span>
            <input
              type="file"
              accept="image/*"
              multiple
              onChange={handleImageSelect}
              className="hidden"
            />
          </label>
        </div>

        {/* Additional features */}
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-gray-800">Ek Özellikler</h2>
            <button
              type="button"
              onClick={addFeature}
              className="btn-secondary text-sm"
            >
              <HiOutlinePlus className="w-4 h-4" /> Özellik Ekle
            </button>
          </div>
          {features.length === 0 ? (
            <p className="text-gray-400 text-sm">
              Henüz ek özellik eklenmemiş.
            </p>
          ) : (
            <div className="space-y-3">
              {features.map((f, i) => (
                <div key={i} className="flex items-center gap-3">
                  <input
                    value={f.featureName}
                    onChange={(e) =>
                      updateFeature(i, "featureName", e.target.value)
                    }
                    className="input-field flex-1"
                    placeholder="Özellik Adı (ör: Havuz)"
                  />
                  <input
                    value={f.featureValue}
                    onChange={(e) =>
                      updateFeature(i, "featureValue", e.target.value)
                    }
                    className="input-field flex-1"
                    placeholder="Değer (ör: Var)"
                  />
                  <button
                    type="button"
                    onClick={() => removeFeature(i)}
                    className="p-2 text-red-500 hover:bg-red-50 rounded-lg"
                  >
                    <HiOutlineTrash className="w-5 h-5" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Options */}
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
          <h2 className="text-lg font-bold text-gray-800 mb-4">Seçenekler</h2>
          <div className="flex flex-wrap gap-6">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                name="isFeatured"
                checked={form.isFeatured}
                onChange={handleChange}
                className="w-5 h-5 rounded text-primary-600 focus:ring-primary-500"
              />
              <span className="text-sm font-medium text-gray-700">
                Öne Çıkan İlan
              </span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                name="isActive"
                checked={form.isActive}
                onChange={handleChange}
                className="w-5 h-5 rounded text-primary-600 focus:ring-primary-500"
              />
              <span className="text-sm font-medium text-gray-700">
                Aktif (Yayında)
              </span>
            </label>
          </div>
        </div>

        {/* Submit */}
        <div className="flex items-center gap-4">
          <button
            type="submit"
            disabled={saving}
            className="btn-primary py-3 px-8"
          >
            {saving ? "Kaydediliyor..." : isEdit ? "Güncelle" : "İlan Oluştur"}
          </button>
          <button
            type="button"
            onClick={() => navigate("/admin/ilanlar")}
            className="btn-secondary py-3 px-8"
          >
            İptal
          </button>
        </div>
      </form>
    </div>
  );
}
