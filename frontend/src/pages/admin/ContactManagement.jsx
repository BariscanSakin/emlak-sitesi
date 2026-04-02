import { useState, useEffect } from "react";
import { getContact, updateContact } from "../../services/api";

export default function ContactManagement() {
  const [form, setForm] = useState({
    phone: "",
    phone2: "",
    email: "",
    address: "",
    mapCode: "",
    workingHours: "",
    facebook: "",
    instagram: "",
    twitter: "",
    youtube: "",
    whatsapp: "",
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    getContact()
      .then((r) => {
        const c = r.data.contact;
        setForm({
          phone: c.phone || "",
          phone2: c.phone2 || "",
          email: c.email || "",
          address: c.address || "",
          mapCode: c.mapCode || "",
          workingHours: c.workingHours || "",
          facebook: c.facebook || "",
          instagram: c.instagram || "",
          twitter: c.twitter || "",
          youtube: c.youtube || "",
          whatsapp: c.whatsapp || "",
        });
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setMessage("");
    try {
      await updateContact(form);
      setMessage("İletişim bilgileri güncellendi.");
    } catch {
      setMessage("Güncelleme başarısız oldu.");
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
        <h1 className="text-2xl font-bold text-gray-800">İletişim Bilgileri</h1>
        <p className="text-gray-500 mt-1">
          Sitede gösterilecek iletişim bilgilerini düzenleyin
        </p>
      </div>

      {message && (
        <div
          className={`mb-4 p-3 rounded-lg text-sm ${
            message.includes("güncellendi")
              ? "bg-green-50 text-green-600 border border-green-200"
              : "bg-red-50 text-red-600 border border-red-200"
          }`}
        >
          {message}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Contact details */}
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
          <h2 className="text-lg font-bold text-gray-800 mb-4">
            Temel İletişim
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Telefon 1
              </label>
              <input
                name="phone"
                value={form.phone}
                onChange={handleChange}
                className="input-field"
                placeholder="+90 (212) 555 00 00"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Telefon 2
              </label>
              <input
                name="phone2"
                value={form.phone2}
                onChange={handleChange}
                className="input-field"
                placeholder="+90 (532) 555 00 00"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                E-posta
              </label>
              <input
                name="email"
                type="email"
                value={form.email}
                onChange={handleChange}
                className="input-field"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Çalışma Saatleri
              </label>
              <input
                name="workingHours"
                value={form.workingHours}
                onChange={handleChange}
                className="input-field"
                placeholder="Pzt-Cmt: 09:00-18:00"
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Adres
              </label>
              <textarea
                name="address"
                value={form.address}
                onChange={handleChange}
                className="input-field"
                rows={2}
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Harita Kodu (Google Maps iframe)
              </label>
              <textarea
                name="mapCode"
                value={form.mapCode}
                onChange={handleChange}
                className="input-field font-mono text-sm"
                rows={4}
              />
            </div>
          </div>
        </div>

        {/* Social media */}
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
          <h2 className="text-lg font-bold text-gray-800 mb-4">Sosyal Medya</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                WhatsApp (Numara, başında ülke kodu)
              </label>
              <input
                name="whatsapp"
                value={form.whatsapp}
                onChange={handleChange}
                className="input-field"
                placeholder="905325550000"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Facebook (URL)
              </label>
              <input
                name="facebook"
                value={form.facebook}
                onChange={handleChange}
                className="input-field"
                placeholder="https://facebook.com/..."
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Instagram (URL)
              </label>
              <input
                name="instagram"
                value={form.instagram}
                onChange={handleChange}
                className="input-field"
                placeholder="https://instagram.com/..."
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Twitter / X (URL)
              </label>
              <input
                name="twitter"
                value={form.twitter}
                onChange={handleChange}
                className="input-field"
                placeholder="https://twitter.com/..."
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                YouTube (URL)
              </label>
              <input
                name="youtube"
                value={form.youtube}
                onChange={handleChange}
                className="input-field"
                placeholder="https://youtube.com/..."
              />
            </div>
          </div>
        </div>

        <button
          type="submit"
          disabled={saving}
          className="btn-primary py-3 px-8"
        >
          {saving ? "Kaydediliyor..." : "Kaydet"}
        </button>
      </form>
    </div>
  );
}
