import { Link } from "react-router-dom";

export default function BlogCard({ blog }) {
  const formatDate = (date) => {
    return new Date(date).toLocaleDateString("tr-TR", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <Link to={`/blog/${blog.slug}`} className="card group">
      {/* Cover image */}
      <div className="aspect-[16/10] overflow-hidden">
        {blog.coverImage ? (
          <img
            src={blog.coverImage}
            alt={blog.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            loading="lazy"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-primary-100 to-primary-200 flex items-center justify-center">
            <svg
              className="w-12 h-12 text-primary-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z"
              />
            </svg>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-5">
        <p className="text-sm text-primary-600 font-medium mb-2">
          {formatDate(blog.createdAt)}
        </p>
        <h3 className="font-semibold text-gray-800 mb-2 line-clamp-2 group-hover:text-primary-600 transition-colors">
          {blog.title}
        </h3>
        {blog.excerpt && (
          <p className="text-sm text-gray-500 line-clamp-3">{blog.excerpt}</p>
        )}
        <span className="inline-block mt-3 text-sm font-medium text-primary-600 group-hover:underline">
          Devamını Oku →
        </span>
      </div>
    </Link>
  );
}
