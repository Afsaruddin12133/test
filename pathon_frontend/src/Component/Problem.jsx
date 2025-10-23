import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { MdKeyboardDoubleArrowRight } from "react-icons/md";
import { ShimmerThumbnail, ShimmerTitle } from "react-shimmer-effects";

import { FiUser } from "react-icons/fi";
import { HiOutlineUsers, HiOutlineAcademicCap } from "react-icons/hi";
import { RiLiveLine } from "react-icons/ri";
import { AiFillStar } from "react-icons/ai";
import Image from '../Images/9.jpg';

import { Base_url } from "../Config/Api";

/* 🔵 Per-tab cache for problem classes */
let problemData = null;
let problemDataPromise = null;

const Card = ({ ev }) => (
  <div className="rounded-xl bg-white border border-gray-200 shadow-md hover:shadow-lg transition-shadow">
    <div className="overflow-hidden rounded-t-xl">
      <img
        src={ev.headerImageVideo}
        alt={ev.title}
        className="w-full h-40 object-cover rounded-t-xl transform transition-transform duration-700 hover:scale-115"
      />
    </div>
    <div className="p-4">
      <h2 className="text-[18px] font-semibold text-[#1a1a1a] leading-6 line-clamp-1">{ev.title}</h2>

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
          {Number(ev.amount) > 0 ? (ev.negotiable || "Negotiable") : "Free"}
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
    </div>
  </div>
);

const Problem = () => {
  // 🔵 init from cache
  const [problemClass, setProblemClass] = useState(problemData ?? []);
  const [loading, setLoading] = useState(!problemData);
  const [error, setError] = useState(null);

  useEffect(() => {
    // If cached, don’t fetch
    if (problemData) return;

    // Deduplicate in-flight requests
    if (!problemDataPromise) {
      problemDataPromise = fetch(`${Base_url}getAllClass?page=1&type=3`, {
        headers: { Accept: "application/json" },
      })
        .then((res) => {
          if (!res.ok) throw new Error(`HTTP ${res.status}`);
          return res.json();
        })
        .then((json) => {
          const raw = json?.data ?? json ?? [];
          const normalized = (Array.isArray(raw) ? raw : [])
            .filter((c) => Number(c?.type) === 3)
            .map((c) => ({
              id: c.id,
              subject_id: c.subject_id,
              title: c.title,
              headerImageVideo: c?.headerImageVideo ? `https://apidocumentationpathon.pathon.app/${c.headerImageVideo}` : Image,
              name: c.full_name,
              enroll: c.enrollment,
              class: c.class,
              rating: c.rating,
              ratingNo: c.rating_count,
              amount: c.price,
              country: c.country,
              negotiable: c.isNegotiable === 1 ? "Negotiable" : "Non-negotiable",
              type: "Problem-Solving",
            }));

          problemData = normalized; // cache for this tab
          return normalized;
        })
        .catch((err) => {
          throw err;
        })
        .finally(() => {
          problemDataPromise = null;
        });
    }

    setLoading(true);
    setError(null);

    problemDataPromise
      .then((data) => setProblemClass(data))
      .catch((err) => {
        console.error("Failed to fetch problem classes:", err);
        setError(err.message || "Failed to load classes.");
        setProblemClass([]);
      })
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="bg-blue-50 py-8 px-4">
      <div className="mb-6 px-2">
        <h3 className="text-3xl font-bold mb-0">Problem-Solving Classes</h3>
        {error && (
          <div className="text-red-600 mt-2">Error: {error}</div>
        )}
        <div className="mt-1">
          <div className="h-[3px] w-28 bg-purple-400 rounded-full" />
          <div className="h-[3px] w-20 bg-purple-300 rounded-full mt-1" />
        </div>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {Array.from({ length: 4 }).map((_, idx) => (
            <div key={idx}>
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
      ) : problemClass.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {problemClass.slice(0, 4).map((ev) => (
            <div key={ev.subject_id}>
              <Link
                to={`/details-problem/${ev.subject_id}`}
                className="block focus:outline-none focus:ring-2 focus:ring-purple-600 rounded-xl"
              >
                <Card ev={ev} />
              </Link>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-gray-600 text-center text-lg">No recorded classes available.</div>
      )}

      {problemClass.length > 4 && (
        <div className="flex justify-end mt-6">
          <Link
            to="/solve-class"
            className="inline-flex items-center gap-2 text-white bg-purple-700 font-bold px-4 py-1.5 rounded shadow transition hover:bg-purple-800 hover:scale-105 duration-200"
          >
            View all
            <span className="text-xl">
              <MdKeyboardDoubleArrowRight />
            </span>
          </Link>
        </div>
      )}
    </div>
  );
};

export default Problem;
