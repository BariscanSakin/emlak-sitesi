import { useState, useEffect } from "react";
import { getPage } from "../services/api";

export default function About() {
  const [page, setPage] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getPage("hakkimizda")
      .then((r) => setPage(r.data.page))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="page-container py-20 text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
      </div>
    );
  }

  return (
    <div>
      {/* Page header */}
      <div className="bg-gradient-to-r from-primary-700 to-primary-600 text-white py-16">
        <div className="page-container">
          <h1 className="text-4xl font-bold">Hakkımızda</h1>
          <p className="text-primary-100 mt-2">Bizi daha yakından tanıyın</p>
        </div>
      </div>

      {/* Content */}
      <div className="page-container py-12">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8 lg:p-12">
            {page ? (
              <div
                className="prose prose-lg max-w-none prose-headings:text-gray-800 prose-p:text-gray-600 prose-a:text-primary-600"
                dangerouslySetInnerHTML={{ __html: page.content }}
              />
            ) : (
              <p className="text-gray-500">İçerik henüz eklenmemiştir.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
