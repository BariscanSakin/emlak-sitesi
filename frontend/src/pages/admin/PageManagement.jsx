import { useState, useEffect, useRef } from "react";
import { getPages, updatePage } from "../../services/api";

export default function PageManagement() {
  const [pages, setPages] = useState([]);
  const [activePage, setActivePage] = useState(null);
  const [content, setContent] = useState("");
  const [title, setTitle] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const editorRef = useRef(null);

  const defaultPages = [
    { slug: "hakkimizda", title: "Hakkımızda" },
    { slug: "gizlilik", title: "Gizlilik Politikası" },
    { slug: "kvkk", title: "KVKK Aydınlatma Metni" },
  ];

  useEffect(() => {
    loadPages();
  }, []);

  const loadPages = () => {
    setLoading(true);
    getPages()
      .then((r) => {
        const existingPages = r.data.pages;
        const allPages = defaultPages.map((dp) => {
          const existing = existingPages.find((p) => p.slug === dp.slug);
          return existing || { slug: dp.slug, title: dp.title, content: "" };
        });
        setPages(allPages);
        if (allPages.length > 0 && !activePage) {
          selectPage(allPages[0]);
        }
      })
      .catch(() => {
        setPages(defaultPages.map((dp) => ({ ...dp, content: "" })));
      })
      .finally(() => setLoading(false));
  };

  const selectPage = (page) => {
    setActivePage(page);
    setTitle(page.title);
    setContent(page.content || "");
    setMessage("");
  };

  const handleSave = async () => {
    if (!activePage) return;
    setSaving(true);
    setMessage("");

    try {
      await updatePage(activePage.slug, { title, content });
      setMessage("Sayfa başarıyla güncellendi.");
      loadPages();
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
        <h1 className="text-2xl font-bold text-gray-800">Sayfa Yönetimi</h1>
        <p className="text-gray-500 mt-1">
          Kurumsal sayfaların içeriklerini düzenleyin
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Page list */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-3">
            <div className="space-y-1">
              {pages.map((page) => (
                <button
                  key={page.slug}
                  onClick={() => selectPage(page)}
                  className={`w-full text-left px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                    activePage?.slug === page.slug
                      ? "bg-primary-50 text-primary-700"
                      : "text-gray-600 hover:bg-gray-50"
                  }`}
                >
                  {page.title}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Editor */}
        <div className="lg:col-span-3">
          {activePage ? (
            <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
              {message && (
                <div
                  className={`mb-4 p-3 rounded-lg text-sm ${
                    message.includes("başarı")
                      ? "bg-green-50 text-green-600 border border-green-200"
                      : "bg-red-50 text-red-600 border border-red-200"
                  }`}
                >
                  {message}
                </div>
              )}

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Sayfa Başlığı
                </label>
                <input
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="input-field"
                />
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  İçerik (HTML destekli)
                </label>
                <textarea
                  ref={editorRef}
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  className="input-field font-mono text-sm"
                  rows={15}
                  placeholder="<h2>Başlık</h2><p>İçerik metni...</p>"
                />
                <p className="text-xs text-gray-400 mt-1">
                  HTML etiketleri kullanabilirsiniz: &lt;h2&gt;, &lt;p&gt;,
                  &lt;strong&gt;, &lt;ul&gt;, &lt;li&gt; vb.
                </p>
              </div>

              {/* Preview */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Önizleme
                </label>
                <div
                  className="border border-gray-200 rounded-lg p-4 min-h-[100px] prose max-w-none"
                  dangerouslySetInnerHTML={{ __html: content }}
                />
              </div>

              <button
                onClick={handleSave}
                disabled={saving}
                className="btn-primary"
              >
                {saving ? "Kaydediliyor..." : "Kaydet"}
              </button>
            </div>
          ) : (
            <div className="bg-white rounded-xl border border-gray-100 p-12 text-center text-gray-400">
              Düzenlemek için bir sayfa seçin
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
