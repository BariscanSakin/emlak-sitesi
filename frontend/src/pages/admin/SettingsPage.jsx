import { useState, useEffect } from "react";
import { getSettings, updateSettings, uploadLogo } from "../../services/api";
import { HiOutlinePhotograph } from "react-icons/hi";

export default function SettingsPage() {
  const [form, setForm] = useState({
    siteName: "",
    siteDescription: "",
    footerText: "",
  });
  const [logo, setLogo] = useState("");
  const [newLogo, setNewLogo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploadingLogo, setUploadingLogo] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    getSettings()
      .then((r) => {
        const s = r.data.settings;
        setForm({
          siteName: s.siteName || "",
          siteDescription: s.siteDescription || "",
          footerText: s.footerText || "",
        });
        setLogo(s.logo || "");
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSave = async () => {
    setSaving(true);
    setMessage("");
    try {
      await updateSettings(form);
      setMessage("Ayarlar güncellendi.");
    } catch {
      setMessage("Güncelleme başarısız.");
    } finally {
      setSaving(false);
    }
  };

  const handleLogoUpload = async () => {
    if (!newLogo) return;
    setUploadingLogo(true);
    setMessage("");
    try {
      const formData = new FormData();
      formData.append("logo", newLogo);
      const res = await uploadLogo(formData);
      setLogo(res.data.logo);
      setNewLogo(null);
      setMessage("Logo güncellendi.");
    } catch {
      setMessage("Logo yükleme başarısız.");
    } finally {
      setUploadingLogo(false);
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
        <h1 className="text-2xl font-bold text-gray-800">Ayarlar</h1>
        <p className="text-gray-500 mt-1">Site genel ayarlarını düzenleyin</p>
      </div>

      {message && (
        <div
          className={`mb-4 p-3 rounded-lg text-sm ${
            message.includes("güncellendi") || message.includes("başarı")
              ? "bg-green-50 text-green-600 border border-green-200"
              : "bg-red-50 text-red-600 border border-red-200"
          }`}
        >
          {message}
        </div>
      )}

      <div className="space-y-6">
        {/* Logo */}
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
          <h2 className="text-lg font-bold text-gray-800 mb-4">Logo</h2>
          <p className="text-sm text-gray-500 mb-4">
            SVG, PNG, JPG veya herhangi bir resim formatı yükleyebilirsiniz.
          </p>

          {(logo || newLogo) && (
            <div className="mb-4 p-4 bg-gray-50 rounded-lg inline-block">
              <img
                src={newLogo ? URL.createObjectURL(newLogo) : logo}
                alt="Logo"
                className="max-h-20 w-auto"
              />
            </div>
          )}

          <div className="flex items-center gap-4">
            <label className="flex items-center justify-center gap-2 px-6 py-3 border-2 border-dashed border-gray-300 rounded-xl hover:border-primary-400 hover:bg-primary-50 cursor-pointer transition-colors">
              <HiOutlinePhotograph className="w-5 h-5 text-gray-400" />
              <span className="text-sm text-gray-500">Logo Seçin</span>
              <input
                type="file"
                accept="image/*,.svg"
                onChange={(e) => setNewLogo(e.target.files[0])}
                className="hidden"
              />
            </label>
            {newLogo && (
              <button
                onClick={handleLogoUpload}
                disabled={uploadingLogo}
                className="btn-primary text-sm"
              >
                {uploadingLogo ? "Yükleniyor..." : "Logo Yükle"}
              </button>
            )}
          </div>
        </div>

        {/* General settings */}
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
          <h2 className="text-lg font-bold text-gray-800 mb-4">
            Genel Ayarlar
          </h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Site Adı
              </label>
              <input
                name="siteName"
                value={form.siteName}
                onChange={handleChange}
                className="input-field"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Site Açıklaması
              </label>
              <input
                name="siteDescription"
                value={form.siteDescription}
                onChange={handleChange}
                className="input-field"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Footer Metni
              </label>
              <input
                name="footerText"
                value={form.footerText}
                onChange={handleChange}
                className="input-field"
              />
            </div>
          </div>

          <button
            onClick={handleSave}
            disabled={saving}
            className="btn-primary mt-6"
          >
            {saving ? "Kaydediliyor..." : "Kaydet"}
          </button>
        </div>
      </div>
    </div>
  );
}
