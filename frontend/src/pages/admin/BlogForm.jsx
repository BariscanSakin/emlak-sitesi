import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  getBlog,
  createBlog,
  updateBlog,
  getAllBlogs,
} from "../../services/api";
import { HiOutlinePhotograph } from "react-icons/hi";

export default function BlogForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = Boolean(id);

  const [form, setForm] = useState({
    title: "",
    content: "",
    excerpt: "",
    isPublished: false,
  });
  const [coverImage, setCoverImage] = useState(null);
  const [existingCover, setExistingCover] = useState("");
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (isEdit) {
      setLoading(true);
      getAllBlogs()
        .then((r) => {
          const blog = r.data.blogs.find((b) => b.id === parseInt(id));
          if (blog) {
            getBlog(blog.slug)
              .then((res) => {
                const b = res.data.blog;
                setForm({
                  title: b.title || "",
                  content: b.content || "",
                  excerpt: b.excerpt || "",
                  isPublished: b.isPublished || false,
                });
                setExistingCover(b.coverImage || "");
              })
              .finally(() => setLoading(false));
          } else {
            setLoading(false);
          }
        })
        .catch(() => setLoading(false));
    }
  }, [id, isEdit]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSaving(true);

    try {
      const formData = new FormData();
      formData.append("title", form.title);
      formData.append("content", form.content);
      formData.append("excerpt", form.excerpt);
      formData.append("isPublished", form.isPublished);
      if (coverImage) {
        formData.append("coverImage", coverImage);
      }

      if (isEdit) {
        await updateBlog(id, formData);
      } else {
        await createBlog(formData);
      }

      navigate("/admin/blog");
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
          {isEdit ? "Blog Yazısı Düzenle" : "Yeni Blog Yazısı"}
        </h1>
      </div>

      {error && (
        <div className="bg-red-50 text-red-600 border border-red-200 rounded-lg p-3 mb-4 text-sm">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Başlık *
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
                Özet
              </label>
              <textarea
                name="excerpt"
                value={form.excerpt}
                onChange={handleChange}
                className="input-field"
                rows={3}
                placeholder="Kısa açıklama (liste sayfasında görünür)"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                İçerik (HTML destekli)
              </label>
              <textarea
                name="content"
                value={form.content}
                onChange={handleChange}
                className="input-field font-mono text-sm"
                rows={15}
              />
              <p className="text-xs text-gray-400 mt-1">
                HTML etiketleri kullanabilirsiniz.
              </p>
            </div>

            {/* Preview */}
            {form.content && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Önizleme
                </label>
                <div
                  className="border border-gray-200 rounded-lg p-4 min-h-[100px] prose max-w-none"
                  dangerouslySetInnerHTML={{ __html: form.content }}
                />
              </div>
            )}
          </div>
        </div>

        {/* Cover image */}
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
          <h2 className="text-lg font-bold text-gray-800 mb-4">Kapak Resmi</h2>

          {(existingCover || coverImage) && (
            <div className="mb-4">
              <img
                src={
                  coverImage ? URL.createObjectURL(coverImage) : existingCover
                }
                alt="Kapak"
                className="max-h-64 rounded-lg object-contain"
              />
            </div>
          )}

          <label className="flex items-center justify-center gap-2 p-6 border-2 border-dashed border-gray-300 rounded-xl hover:border-primary-400 hover:bg-primary-50 cursor-pointer transition-colors">
            <HiOutlinePhotograph className="w-6 h-6 text-gray-400" />
            <span className="text-sm text-gray-500">
              {existingCover ? "Kapak resmini değiştir" : "Kapak resmi seçin"}
            </span>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setCoverImage(e.target.files[0])}
              className="hidden"
            />
          </label>
        </div>

        {/* Options */}
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              name="isPublished"
              checked={form.isPublished}
              onChange={handleChange}
              className="w-5 h-5 rounded text-primary-600 focus:ring-primary-500"
            />
            <span className="text-sm font-medium text-gray-700">Yayınla</span>
          </label>
        </div>

        {/* Submit */}
        <div className="flex items-center gap-4">
          <button
            type="submit"
            disabled={saving}
            className="btn-primary py-3 px-8"
          >
            {saving ? "Kaydediliyor..." : isEdit ? "Güncelle" : "Oluştur"}
          </button>
          <button
            type="button"
            onClick={() => navigate("/admin/blog")}
            className="btn-secondary py-3 px-8"
          >
            İptal
          </button>
        </div>
      </form>
    </div>
  );
}
