import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { getAllBlogs, deleteBlog as deleteBlogApi } from "../../services/api";
import {
  HiOutlinePlus,
  HiOutlinePencil,
  HiOutlineTrash,
  HiOutlineEye,
} from "react-icons/hi";

export default function BlogManagement() {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const loadBlogs = () => {
    setLoading(true);
    getAllBlogs()
      .then((r) => setBlogs(r.data.blogs))
      .catch(() => {})
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadBlogs();
  }, []);

  const handleDelete = async (id, title) => {
    if (
      !window.confirm(`"${title}" yazısını silmek istediğinize emin misiniz?`)
    )
      return;
    try {
      await deleteBlogApi(id);
      loadBlogs();
    } catch {
      alert("Silme işlemi başarısız.");
    }
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString("tr-TR", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Blog Yönetimi</h1>
          <p className="text-gray-500 mt-1">{blogs.length} yazı</p>
        </div>
        <Link to="/admin/blog/yeni" className="btn-primary">
          <HiOutlinePlus className="w-5 h-5" /> Yeni Yazı
        </Link>
      </div>

      {loading ? (
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary-600 mx-auto"></div>
        </div>
      ) : blogs.length === 0 ? (
        <div className="bg-white rounded-xl border border-gray-100 p-12 text-center">
          <p className="text-gray-500 mb-4">Henüz blog yazısı eklenmemiş.</p>
          <Link to="/admin/blog/yeni" className="btn-primary">
            İlk Yazıyı Ekle
          </Link>
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-100">
                  <th className="text-left px-4 py-3 font-medium text-gray-600">
                    Kapak
                  </th>
                  <th className="text-left px-4 py-3 font-medium text-gray-600">
                    Başlık
                  </th>
                  <th className="text-left px-4 py-3 font-medium text-gray-600">
                    Durum
                  </th>
                  <th className="text-left px-4 py-3 font-medium text-gray-600">
                    Tarih
                  </th>
                  <th className="text-right px-4 py-3 font-medium text-gray-600">
                    İşlemler
                  </th>
                </tr>
              </thead>
              <tbody>
                {blogs.map((blog) => (
                  <tr
                    key={blog.id}
                    className="border-b border-gray-50 hover:bg-gray-50 transition-colors"
                  >
                    <td className="px-4 py-3">
                      <div className="w-16 h-12 rounded-lg overflow-hidden bg-gray-100">
                        {blog.coverImage ? (
                          <img
                            src={blog.coverImage}
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
                        {blog.title}
                      </div>
                      {blog.excerpt && (
                        <div className="text-xs text-gray-400 line-clamp-1">
                          {blog.excerpt}
                        </div>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`text-xs font-medium px-2 py-1 rounded-full ${
                          blog.isPublished
                            ? "bg-green-100 text-green-700"
                            : "bg-gray-100 text-gray-600"
                        }`}
                      >
                        {blog.isPublished ? "Yayında" : "Taslak"}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-gray-500">
                      {formatDate(blog.createdAt)}
                    </td>
                    <td className="px-4 py-3 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <a
                          href={`/blog/${blog.slug}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-2 text-gray-400 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-colors"
                          title="Görüntüle"
                        >
                          <HiOutlineEye className="w-5 h-5" />
                        </a>
                        <button
                          onClick={() =>
                            navigate(`/admin/blog/${blog.id}/duzenle`)
                          }
                          className="p-2 text-gray-400 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-colors"
                          title="Düzenle"
                        >
                          <HiOutlinePencil className="w-5 h-5" />
                        </button>
                        <button
                          onClick={() => handleDelete(blog.id, blog.title)}
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
