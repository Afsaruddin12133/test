import React, { useMemo, useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { MdKeyboardDoubleArrowRight } from "react-icons/md";
import { Base_url } from "../../Config/Api";

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
  let authorizedUserName = "";
  try {
    const auth = JSON.parse(localStorage.getItem("auth") || "{}");
    authorizedUserName = auth?.user?.full_name || "";
  } catch {
    authorizedUserName = "";
  }

import { FiUser } from "react-icons/fi";
import { HiOutlineUsers, HiOutlineAcademicCap } from "react-icons/hi";
import { RiLiveLine } from "react-icons/ri";
import { AiFillStar } from "react-icons/ai";
import Image from "/6.jpg";
import { ShimmerThumbnail, ShimmerTitle } from "react-shimmer-effects";

const ClassMe = () => {
  const [showAll, setShowAll] = useState(false);
  const [allClass, setAllClass] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const controller = new AbortController();

    (async () => {
      try {
        const token = getToken();
        if (!token) throw new Error("Authentication required");

        const res = await fetch(
          `${Base_url}getTutorAllClass?page=1&type=1`, {
          method: "GET",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          signal: controller.signal,
        });

        console.log("🌐 ClassMe API status:", res.status);
        const json = await res.json().catch(() => ({}));
        console.log("📦 Record class API dta:", json);

        if (!res.ok) throw new Error(`HTTP ${res.status}`);

        // 🔧 Robust extraction: many APIs use { data: { data: [...] , total: n } }
        const dataBlock = json?.data ?? json;
        const items =
          Array.isArray(dataBlock?.data)
            ? dataBlock.data
            : Array.isArray(dataBlock?.items)
            ? dataBlock.items
            : Array.isArray(dataBlock)
            ? dataBlock
            : Array.isArray(json)
            ? json
            : [];

        console.log("🧾 Parsed items length:", items.length);
        setAllClass(items || []);
        setError(null);
      } catch (e) {
        if (e?.name === "AbortError") return;
        console.error("❌ Fetch classes failed:", e);
        setAllClass([]);
        setError(e?.message || "Failed to load classes");
      } finally {
        setLoading(false);
      }
    })();

    return () => controller.abort();
  }, []);

  const liveClass = useMemo(() => {
    const list = Array.isArray(allClass) ? allClass : [];

    // Since the endpoint already uses type=1, we won't filter by type.
    // But if the API does include type and it's helpful, keep results with type=1.
    const filtered =
      list.some((c) => c?.type !== undefined)
        ? list.filter((c) => String(c?.type) === "1" || c?.type === 1)
        : list;

    return filtered.map((c) => {
      const negotiableFlag =
        c?.isNegotiable ?? c?.is_negotiable ?? c?.negotiable ?? 0;
      const price = c?.price ?? c?.amount ?? 0;

      return {
        id: c?.id,
        subject_id: c?.subject_id,
        title: c?.title ?? "",
        headerImageVideo: c?.headerImageVideo ? `https://apidocumentationpathon.pathon.app/${c.headerImageVideo}` : Image,
        name: authorizedUserName,
        enroll: c?.enrollment ?? 0,
        class: c?.class ?? "",
        rating: c?.rating ?? 0,
        ratingNo: c?.rating_count ?? 0,
        amount: price,
        country: c?.country ?? "",
        negotiable: Number(negotiableFlag) === 1 ? "Negotiable" : "Non-negotiable",
        type: "Record",
      };
    });
  }, [allClass]);

  const VISIBLE_COUNT = 8;
  const visibleItems = showAll ? liveClass : liveClass.slice(0, VISIBLE_COUNT);

  return (
    <div className="bg-blue-50">
      <div className="max-w-7xl px-4 py-10 mx-auto">
        {/* Title pill */}
        <div className="flex justify-center mb-6">
          <span className="inline-flex items-center rounded-lg border border-purple-600 px-5 py-1.5 text-text-black/80 font-bold text-2xl lg:text-3xl">
            Record Classes
          </span>
        </div>

        {loading ? (
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
        ) : error ? (
          <div className="text-red-600 text-center mb-4">Error: {error}</div>
        ) : liveClass.length > 0 ? (
          <>
            <div className="grid gap-2 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {visibleItems.map((ev) => (
                <div key={ev.subject_id} className="px-3">
                  <Link
                    to={`/details-record/${ev.subject_id}`}
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
                            onClick={(e) => {
                              e.preventDefault();
                              e.stopPropagation();
                              window.location.href = `/update-record-class/${ev.subject_id}`;
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

            {liveClass.length > VISIBLE_COUNT && (
              <div className="flex justify-center mt-8">
                <button
                  onClick={() => setShowAll((s) => !s)}
                  className="inline-flex items-center gap-2 text-white bg-purple-700 font-bold px-4 py-1.5 rounded shadow transition hover:bg-purple-800 hover:scale-105 duration-200"
                >
                  {showAll ? "See less" : "See more"}
                  <span className="text-xl">
                    <MdKeyboardDoubleArrowRight />
                  </span>
                </button>
              </div>
            )}
          </>
        ) : (
          <div className="text-center py-8">
            <p className="text-gray-600 text-lg">
              {getUserId()
                ? "You haven't created any recorded classes yet."
                : "Please log in to view your recorded classes."}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ClassMe;
