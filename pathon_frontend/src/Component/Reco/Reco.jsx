import React, { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { MdKeyboardDoubleArrowRight } from "react-icons/md";

import { FiUser } from "react-icons/fi";
import { HiOutlineUsers, HiOutlineAcademicCap } from "react-icons/hi";
import { RiLiveLine } from "react-icons/ri";
import { AiFillStar } from "react-icons/ai";

// ⬇️ Bring data from your JS file
import { AllClass } from "../Data/AllClass";

const Reco = () => {
  const [showAll, setShowAll] = useState(false);

  // Build the array the card expects from the JS data
  const liveClass = useMemo(() => {
    return (AllClass || [])
      .filter(
        (c) =>
          (c.visibility || "").toLowerCase() === "public"
        // &&
        // (c.classType || "").toLowerCase() === "problem-solving"
      )
      .map((c) => ({
        id: c.id,
        image: c.cover,
        title: c.title,
        name: c.author,
        enroll: c.enrolCount,
        class: c.class,
        rating: c.review,
        ratingNo: c.reviewCount,
        amount: c.price,
        country: c.country,
        negotiable: c.negotiable,
        type: c.classType,
      }));
  }, []);

  // ⬇️ Show first 8 items (≈2 rows on xl: 4 cols) until "See more"
  const VISIBLE_COUNT = 8;
  const visibleItems = showAll ? liveClass : liveClass.slice(0, VISIBLE_COUNT);

  return (
    <div className="bg-blue-50">
      <div className="max-w-7xl px-4 py-10 mx-auto">
        {/* Title pill */}
        <div className="flex justify-center mb-6">
          <span className="inline-flex items-center rounded-lg border border-purple-600 px-5 py-1.5 text-black/80 font-bold text-2xl lg:text-3xl">
            For You
          </span>
        </div>

        {liveClass.length > 0 ? (
          <>
            <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {visibleItems.map((ev) => (
                <div key={ev.id} className="px-3">
                  {/* ⬇️ Added Link — minimal change */}
                  <Link
                    to={`/details/${ev.id}`}
                    className="block focus:outline-none focus:ring-2 focus:ring-purple-600 rounded-xl"
                  >
                    <div className="rounded-xl bg-white border border-gray-200 shadow-md hover:shadow-lg transition-shadow">
                      <div className="overflow-hidden rounded-t-xl">
                        <img
                          src={ev.image}
                          alt={ev.title}
                          className="w-full h-40 object-cover rounded-t-xl transform transition-transform duration-700 hover:scale-115"
                        />
                      </div>

                      <div className="p-4">
                        <h2 className="text-[18px] font-semibold text-[#1a1a1a] leading-6 line-clamp-2">
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
                            {Number(ev.amount) > 0 ? ev.negotiable || "Negotiable" : "Free"}
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
                  </Link>
                </div>
              ))}
            </div>

            {/* ⬇️ See more / See less toggle (only if there are more than 8) */}
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
          <div className="text-white text-center">No live class available.</div>
        )}
      </div>
    </div>
  );
};

export default Reco;
