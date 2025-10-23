import React from "react";
import ReactDOM from "react-dom";
import { Link } from "react-router-dom";
import {
  FiUser, FiUsers, FiBookOpen, FiCast, FiStar,
} from "react-icons/fi";

const SearchPopup = ({ visible, results, loading, onClose, onPick }) => {
  if (!visible) return null;

  const getDetailPath = (item) => {
    if (item.type === 1) return `/details-record/${item.subject_id}`;
    if (item.type === 2) return `/details-live/${item.subject_id}`;
    if (item.type === 3) return `/details-problem/${item.subject_id}`;
    return `/details/${item.id}`; // fallback
  };

  return ReactDOM.createPortal(
    <>
      {/* Full-screen blur overlay */}
      <div
        className="fixed inset-0 z-40 bg-black/30 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Popup container */}
      <div
        className="
          fixed z-50 left-1/2 -translate-x-1/2
          top-[132px] sm:top-[96px]
          w-full sm:w-[min(100vw-1.5rem,1200px)]
          max-h-[80vh]
          bg-white border border-gray-200 rounded-2xl shadow-2xl p-4
          overflow-y-auto
        "
      >
        {loading ? (
          <div className="text-sm text-gray-600">Searching...</div>
        ) : (!results || results.length === 0) ? (
          <div className="text-sm text-gray-600">No results found.</div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {results.map((item) => {
              const isFree = item.price === 0;
              return (
                <Link
                  key={item.id}
                  to={getDetailPath(item)}
                  onClick={onPick}
                  className="group rounded-2xl overflow-hidden bg-white shadow-md hover:shadow-lg transition-shadow"
                >
                  <div className="relative aspect-[16/9] w-full overflow-hidden">
                    <img
                      src={item.cover}
                      alt={item.title}
                      className="w-full h-full object-cover group-hover:scale-[1.02] transition-transform"
                      loading="lazy"
                    />
                  </div>

                  <div className="p-4">
                    <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-1">
                      {item.title}
                    </h3>

                    <div className="flex items-center justify-between text-sm text-gray-700">
                      <div className="flex items-center gap-2">
                        <FiUsers className="opacity-70" />
                        <span>{item.enrolCount}</span>
                      </div>
                    </div>

                    <div className="mt-2 flex items-center justify-between text-sm text-gray-700">
                      <div className="flex items-center gap-2">
                        <FiBookOpen className="opacity-70" />
                        <span>{item.class}</span>
                      </div>
                      <div className="flex items-center gap-2 capitalize">
                        <FiCast className="opacity-70" />
                        <span>{item.classType}</span>
                      </div>
                    </div>

                    <div className="mt-2 flex items-center justify-between text-sm">
                      <div className="flex items-center gap-1 text-yellow-600">
                        <FiStar className="mt-[1px]" />
                        <span className="font-medium text-gray-900">{item.rating}</span>
                        <span className="text-gray-600">({item.reviewCount})</span>
                      </div>
                      <div className="text-gray-700">
                        {isFree ? "Free" : "Negotiable"}
                      </div>
                    </div>

                    <div className="mt-3 flex items-center justify-between">
                      <div className="font-extrabold text-gray-900">
                        BDT {Number(item.price).toFixed(2)}
                      </div>
                      <div className="text-gray-700">{item.country}</div>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </>,
    document.body // ← mounts outside header
  );
};

export default SearchPopup;
