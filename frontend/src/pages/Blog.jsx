import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { getBlogs } from "../services/api";
import BlogCard from "../components/BlogCard";
import { HiOutlineSearch } from "react-icons/hi";

export default function Blog() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [blogs, setBlogs] = useState([]);
  const [pagination, setPagination] = useState({});
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState(searchParams.get("search") || "");

  const page = parseInt(searchParams.get("page")) || 1;

  useEffect(() => {
    setLoading(true);
    const params = { page, limit: 9 };
    if (search) params.search = search;

    getBlogs(params)
      .then((r) => {
        setBlogs(r.data.blogs);
        setPagination(r.data.pagination);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [page, search]);

  const handleSearch = (e) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (search) params.set("search", search);
    setSearchParams(params, { replace: true });
  };

  return (
    <div>
      {/* Page header */}
      <div className="bg-gradient-to-r from-primary-700 to-primary-600 text-white py-16">
        <div className="page-container">
          <h1 className="text-4xl font-bold">Blog</h1>
          <p className="text-primary-100 mt-2">
            Emlak dünyasından güncel haberler ve yazılar
          </p>
        </div>
      </div>

      <div className="page-container py-8">
        {/* Search */}
        <form onSubmit={handleSearch} className="max-w-xl mb-8">
          <div className="relative">
            <HiOutlineSearch className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Blog yazılarında ara..."
              className="input-field pl-10 pr-24"
            />
            <button
              type="submit"
              className="absolute right-1.5 top-1/2 -translate-y-1/2 btn-primary text-sm py-1.5 px-4"
            >
              Ara
            </button>
          </div>
        </form>

        {/* Results */}
        {loading ? (
          <div className="text-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
          </div>
        ) : blogs.length === 0 ? (
          <div className="text-center py-20">
            <h3 className="text-xl font-semibold text-gray-800 mb-2">
              Yazı Bulunamadı
            </h3>
            <p className="text-gray-500">
              {search
                ? "Aramanızla eşleşen yazı bulunamadı."
                : "Henüz blog yazısı eklenmemiş."}
            </p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {blogs.map((blog) => (
                <BlogCard key={blog.id} blog={blog} />
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
                    onClick={() => {
                      const params = new URLSearchParams(searchParams);
                      params.set("page", p);
                      setSearchParams(params, { replace: true });
                    }}
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
