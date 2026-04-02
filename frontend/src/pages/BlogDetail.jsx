import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { getBlog } from "../services/api";

export default function BlogDetail() {
  const { slug } = useParams();
  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    getBlog(slug)
      .then((r) => setBlog(r.data.blog))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [slug]);

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString("tr-TR", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  if (loading) {
    return (
      <div className="page-container py-20 text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
      </div>
    );
  }

  if (!blog) {
    return (
      <div className="page-container py-20 text-center">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">
          Yazı Bulunamadı
        </h2>
        <p className="text-gray-500 mb-4">Bu blog yazısı mevcut değil.</p>
        <Link to="/blog" className="btn-primary">
          Blog'a Dön
        </Link>
      </div>
    );
  }

  return (
    <div>
      {/* Header */}
      <div className="bg-gradient-to-r from-primary-700 to-primary-600 text-white py-16">
        <div className="page-container">
          <Link
            to="/blog"
            className="text-primary-200 hover:text-white text-sm transition-colors mb-4 inline-block"
          >
            ← Blog'a Dön
          </Link>
          <h1 className="text-3xl md:text-4xl font-bold">{blog.title}</h1>
          <p className="text-primary-100 mt-3">{formatDate(blog.createdAt)}</p>
        </div>
      </div>

      <div className="page-container py-12">
        <article className="max-w-4xl mx-auto">
          {/* Cover image */}
          {blog.coverImage && (
            <div className="rounded-xl overflow-hidden mb-8">
              <img
                src={blog.coverImage}
                alt={blog.title}
                className="w-full h-auto max-h-[500px] object-contain bg-gray-100"
              />
            </div>
          )}

          {/* Content */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8 lg:p-12">
            <div
              className="prose prose-lg max-w-none prose-headings:text-gray-800 prose-p:text-gray-600 prose-a:text-primary-600 prose-img:rounded-lg"
              dangerouslySetInnerHTML={{ __html: blog.content }}
            />
          </div>

          {/* Share / back */}
          <div className="mt-8 flex items-center justify-between">
            <Link to="/blog" className="btn-secondary">
              ← Tüm Yazılar
            </Link>
          </div>
        </article>
      </div>
    </div>
  );
}
