import React, { useMemo, useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { MdKeyboardDoubleArrowRight, MdKeyboardDoubleArrowLeft } from "react-icons/md";
import { FiUser } from "react-icons/fi";
import { HiOutlineUsers, HiOutlineAcademicCap } from "react-icons/hi";
import { RiLiveLine } from "react-icons/ri";
import { AiFillStar } from "react-icons/ai";
import { ShimmerThumbnail, ShimmerTitle } from "react-shimmer-effects";
import { Base_url } from "../../Config/Api";
import Image from "/5.jpg";

const getUserId = () => {
  try {
    const auth = JSON.parse(localStorage.getItem("auth"));
    return auth?.user?.id || null;
  } catch (error) {
    console.error("Error getting user ID:", error);
    return null;
  }
};

const getToken = () => {
  try {
    const auth = JSON.parse(localStorage.getItem("auth") || "{}");
    return auth?.user?.token || null;
  } catch {
    return null;
  }
};

// ✅ Extract authorized user full name once
const getAuthorizedUserName = () => {
  try {
    const auth = JSON.parse(localStorage.getItem("auth") || "{}");
    return auth?.user?.full_name || "";
  } catch {
    return "";
  }
};

const ClassMe = () => {
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [allClass, setAllClass] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Pagination metadata from API
  const [paginationData, setPaginationData] = useState({
    current_page: 1,
    last_page: 1,
    total: 0,
    per_page: 10,
    from: 0,
    to: 0,
    next_page_url: null,
    prev_page_url: null
  });

  // Fetch tutor's live classes for specific page
  const fetchTutorLiveClasses = async (page = 1) => {
    try {
      setLoading(true);
      setError(null);

      const token = getToken();
      if (!token) throw new Error("Authentication required");

      const response = await fetch(`${Base_url}getTutorAllClass?page=${page}&type=2`, {
        method: "GET",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }

      const json = await response.json();
      console.log("📦 Live class API response chek for class:", json);

      // Extract nested data structure: { data: { data: [...], pagination_info } }
      const dataBlock = json?.data || {};
      const items = Array.isArray(dataBlock?.data) ? dataBlock.data : [];

      setAllClass(items);
      setPaginationData({
        current_page: dataBlock.current_page || 1,
        last_page: dataBlock.last_page || 1,
        total: dataBlock.total || 0,
        per_page: dataBlock.per_page || 10,
        from: dataBlock.from || 0,
        to: dataBlock.to || 0,
        next_page_url: dataBlock.next_page_url,
        prev_page_url: dataBlock.prev_page_url
      });

    } catch (e) {
      console.error("❌ Fetch classes failed:", e);
      setError(e.message || "Failed to load classes.");
      setAllClass([]);
    } finally {
      setLoading(false);
    }
  };

  // Initial load
  useEffect(() => {
    fetchTutorLiveClasses(currentPage);
  }, [currentPage]);

  // Handle page navigation
  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= paginationData.last_page && newPage !== currentPage) {
      setCurrentPage(newPage);
      // Scroll to top when changing pages
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const liveClass = useMemo(() => {
    const list = Array.isArray(allClass) ? allClass : [];

    // Since the endpoint already uses type=2, we filter for type=2 (live classes)
    const filtered = list.filter((c) => String(c?.type) === "2");

    return filtered.map((c) => {
      const negotiableFlag = c?.isNegotiable ?? 0;
      const price = c?.price ?? 0;

      return {
        id: c?.id,
        subject_id: c?.subject_id,
        headerImageVideo: c?.headerImageVideo ? `https://apidocumentationpathon.pathon.app/${c.headerImageVideo}` : Image,
        title: c?.title ?? "",
        name: getAuthorizedUserName(),
        enroll: c?.enrollment ?? 0,
        class: c?.class ?? "",
        rating: c?.rating ?? 0,
        ratingNo: c?.rating_count ?? 0,
        amount: price,
        country: c?.country ?? "",
        negotiable: Number(negotiableFlag) === 1 ? "Negotiable" : "Non-negotiable",
        type: "Live", // since type=2
      };
    });
  }, [allClass]);

  // Generate page numbers for pagination
  const getPageNumbers = () => {
    const { current_page, last_page } = paginationData;
    const pages = [];
    const maxVisiblePages = 5;

    let startPage = Math.max(1, current_page - Math.floor(maxVisiblePages / 2));
    let endPage = Math.min(last_page, startPage + maxVisiblePages - 1);

    if (endPage - startPage + 1 < maxVisiblePages) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }

    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }

    return pages;
  };
  
  return (
    <div className="bg-blue-50">
      <div className="max-w-7xl px-4 py-10 mx-auto">
        {/* Title pill */}
        <div className="flex justify-center mb-6">
          <span className="inline-flex items-center rounded-lg border border-purple-600 px-5 py-1.5 text-text-black/80 font-bold text-2xl lg:text-3xl">
            Live Classes
          </span>
        </div>

        {/* Loading and Error States */}
        {loading && (
          <div className="mb-6 grid gap-2 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {Array.from({ length: 8 }).map((_, idx) => (
              <div key={idx} className="px-3">
                <div className="rounded-xl bg-white border border-gray-200 shadow-md">
                  <div className="overflow-hidden rounded-t-xl">
                    <ShimmerThumbnail height={160} rounded />
                  </div>
                  <div className="p-4">
                    <ShimmerTitle line={2} gap={10} />
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
        {error && <div className="text-red-600 text-center mb-4">Error: {error}</div>}

        {/* Pagination Info */}
        {!loading && !error && paginationData.total > 0 && (
          <div className="text-center mb-4 text-gray-600">
            Showing {paginationData.from} to {paginationData.to} of {paginationData.total} live classes
          </div>
        )}

        {liveClass.length > 0 ? (
          <>
            <div className="grid gap-2 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {liveClass.map((ev) => (
                <div key={ev.subject_id} className="px-3">
                  <Link
                    to={`/details-live/${ev.subject_id}`}
                    className="block focus:outline-none focus:ring-2 focus:ring-purple-600 rounded-xl"
                  >
                    <div className="rounded-xl bg-white border border-gray-200 shadow-md hover:shadow-lg transition-shadow">
                      <div className="overflow-hidden rounded-t-xl">
                        <img
                          src={ev.headerImageVideo}
                          alt={ev.title}
                          className="w-full h-40 object-cover rounded-t-xl transform transition-transform duration-700 hover:scale-115"
                        />
                      </div>

                      <div className="p-4">
                        <h2 className="text-[18px] font-semibold text-[#1a1a1a] leading-6 line-clamp-1">
                          {ev.title}
                        </h2>

                        <div className="mt-3 flex items-center justify-between text-[13px] text-gray-700">
                          <span className="flex items-center gap-2">
                            <FiUser className="text-gray-600" />
                            <span className="truncate">{ev.name}</span>
                          </span>
                          <span className="flex items-center gap-2">
                            <HiOutlineUsers className="text-gray-600" />
                            <span>{ev.enroll}</span>
                          </span>
                        </div>

                        <div className="mt-2 flex items-center justify-between text-[13px] text-gray-700">
                          <span className="flex items-center gap-2">
                            <HiOutlineAcademicCap className="text-gray-600" />
                            <span>{ev.class}</span>
                          </span>
                          <span className="flex items-center gap-2">
                            <RiLiveLine className="text-gray-600" />
                            <span>{ev.type}</span>
                          </span>
                        </div>

                        <div className="mt-2 flex items-center justify-between text-[13px] text-gray-700">
                          <span className="flex items-center gap-1">
                            <AiFillStar className="text-yellow-400" />
                            <span className="font-medium">{ev.rating}</span>
                            <span className="text-gray-500">({ev.ratingNo})</span>
                          </span>
                          <span className="text-gray-700">
                            {Number(ev.amount) > 0 ? ev.negotiable : "Free"}
                          </span>
                        </div>

                        <div className="mt-2 flex items-center justify-between">
                          <p className="text-gray-700 font-extrabold tracking-wide">
                            BDT{" "}
                            {Number(ev.amount || 0).toLocaleString("en-US", {
                              minimumFractionDigits: 2,
                              maximumFractionDigits: 2,
                            })}
                          </p>
                          <p>{ev.country}</p>
                        </div>

                        {/* Update Button */}
                        <div className="mt-3 pt-3 border-t border-gray-200">
                          <button
                            onClick={async (e) => {
                              e.preventDefault();
                              e.stopPropagation();

                              // Fetch item ID before navigating
                              try {
                                const token = getToken();
                                if (!token) throw new Error("Authentication required");

                                const response = await fetch(`${Base_url}courseAllItemByCourseID?course_id=${ev.subject_id}`, {
                                  headers: {
                                    Accept: "application/json",
                                    "Content-Type": "application/json",
                                    Authorization: `Bearer ${token}`,
                                  },
                                });

                                if (response.ok) {
                                  const json = await response.json();
                                  const items = json.data || [];
                                  const itemId = items.length > 0 ? items[0].id : null;

                                  // Navigate with item ID in state
                                  window.location.href = `/update-class/${ev.subject_id}?itemId=${itemId || ''}`;
                                } else {
                                  // Navigate without item ID if API fails
                                  window.location.href = `/update-class/${ev.subject_id}`;
                                }
                              } catch (error) {
                                console.error("Failed to fetch item ID:", error);
                                // Navigate without item ID if error occurs
                                window.location.href = `/update-class/${ev.subject_id}`;
                              }
                            }}
                            className="w-full inline-flex items-center justify-center px-4 py-2 bg-blue-600 text-white text-sm font-semibold rounded-lg hover:bg-blue-700 transition-colors"
                          >
                            Update Class
                          </button>
                        </div>
                      </div>
                    </div>
                  </Link>
                </div>
              ))}
            </div>

            {/* Backend Pagination Controls */}
            {paginationData.last_page > 1 && (
              <div className="flex flex-col items-center mt-8 space-y-4">
                {/* Page Numbers */}
                <div className="flex items-center space-x-2">
                  {/* Previous Button */}
                  <button
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={!paginationData.prev_page_url}
                    className={`flex items-center gap-1 px-3 py-2 rounded-lg font-medium transition-colors ${paginationData.prev_page_url
                      ? "bg-purple-600 text-white hover:bg-purple-700"
                      : "bg-gray-300 text-gray-500 cursor-not-allowed"
                      }`}
                  >
                    <MdKeyboardDoubleArrowLeft />
                    Previous
                  </button>

                  {/* Page Numbers */}
                  {getPageNumbers().map((pageNum) => (
                    <button
                      key={pageNum}
                      onClick={() => handlePageChange(pageNum)}
                      className={`px-4 py-2 rounded-lg font-medium transition-colors ${pageNum === currentPage
                        ? "bg-purple-700 text-white"
                        : "bg-white text-purple-700 border border-purple-600 hover:bg-purple-50"
                        }`}
                    >
                      {pageNum}
                    </button>
                  ))}

                  {/* Next Button */}
                  <button
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={!paginationData.next_page_url}
                    className={`flex items-center gap-1 px-3 py-2 rounded-lg font-medium transition-colors ${paginationData.next_page_url
                      ? "bg-purple-600 text-white hover:bg-purple-700"
                      : "bg-gray-300 text-gray-500 cursor-not-allowed"
                      }`}
                  >
                    Next
                    <MdKeyboardDoubleArrowRight />
                  </button>
                </div>

                {/* Quick Jump to First/Last */}
                {paginationData.last_page > 5 && (
                  <div className="flex items-center space-x-2 text-sm">
                    {currentPage > 3 && (
                      <button
                        onClick={() => handlePageChange(1)}
                        className="px-2 py-1 text-purple-600 hover:text-purple-800 underline"
                      >
                        Go to first page
                      </button>
                    )}
                    {currentPage < paginationData.last_page - 2 && (
                      <button
                        onClick={() => handlePageChange(paginationData.last_page)}
                        className="px-2 py-1 text-purple-600 hover:text-purple-800 underline"
                      >
                        Go to last page ({paginationData.last_page})
                      </button>
                    )}
                  </div>
                )}
              </div>
            )}
          </>
        ) : !loading && (
          <div className="text-center py-8">
            <p className="text-gray-600 text-lg">
              {getUserId()
                ? "You haven't created any live classes yet."
                : "Please log in to view your live classes."}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ClassMe;
