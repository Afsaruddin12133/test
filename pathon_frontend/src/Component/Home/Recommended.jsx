import React from "react";
import { Link } from "react-router-dom";
import { MdKeyboardDoubleArrowRight } from "react-icons/md";

import { FiUser } from "react-icons/fi";
import { HiOutlineUsers, HiOutlineAcademicCap } from "react-icons/hi";
import { RiLiveLine } from "react-icons/ri";
import { AiFillStar } from "react-icons/ai";

import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

// ⬇️ Pull data from your JS file (path relative to /Components/Others)
import { AllClass } from "../Data/AllClass";

/* ONE arrow only: custom Next; Prev returns null */
const NextArrow = ({ className, style, onClick }) => (
  <button
    className={`${className} !flex !items-center !justify-center !bg-black !rounded-full hover:!bg-gray-800`}
    style={{ ...style, width: "30px", height: "30px", marginRight: "20px", zIndex: 10 }}
    onClick={onClick}
    aria-label="Next"
  >
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="white"
      strokeWidth="2.5"
      className="w-5 h-5"
    >
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
    </svg>
  </button>
);

const PrevArrow = ({ className, style, onClick }) => (
  <button
    className={`${className} !flex !items-center !justify-center !bg-black !rounded-full hover:!bg-gray-800`}
    style={{ ...style, width: "30px", height: "30px", marginLeft: "20px", zIndex: 10 }}
    onClick={onClick}
    aria-label="Next"
  >
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="white"
      strokeWidth="2.5"
      className="w-5 h-5"
    >
      <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
    </svg>
  </button>
);

// Build card list from JS file (latest by id, max 10)
// Keeping UI text ("Live", "Negotiable") and all layout unchanged.
const liveClass = (AllClass || [])
  .slice() // avoid mutating original
  .sort((a, b) => (b.id || 0) - (a.id || 0))
  .slice(0, 6)
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
    type: c.classType
  }));

const Recommended = () => {
  const settings = {
    arrows: true,
    infinite: true,
    speed: 3500,
    slidesToShow: 4,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 5000,
    pauseOnHover: false,
    nextArrow: <NextArrow />,
    prevArrow: <PrevArrow />, // hidden
    responsive: [
      { breakpoint: 1280, settings: { slidesToShow: 3 } },
      { breakpoint: 1024, settings: { slidesToShow: 2 } },
      { breakpoint: 768, settings: { slidesToShow: 1 } },
    ],
  };

  return (
    <div className="bg-gray-50">
      <div className=" px-12 pb-8 xl:px-4 max-w-7xl mx-auto">
        {/* hide slick default arrow pseudo-elements (prevents duplicates) */}
        <style>{`.slick-prev:before, .slick-next:before { content: none !important; }`}</style>

        <div className="mb-6 px-2">
          <h3 className="text-3xl font-bold mb-0">Recommended Classes</h3>
          <div className="mt-1">
            <div className="h-[3px] w-28 bg-purple-400 rounded-full" />
            <div className="h-[3px] w-20 bg-purple-300 rounded-full mt-1" />
          </div>
        </div>

        {liveClass.length > 0 ? (
          <Slider {...settings}>
            {liveClass.map((ev) => (
              <div key={ev.id} className="px-3">
                {/* Added Link same as previous responses */}
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
                        <span className="text-gray-700">{Number(ev.amount) >0? ev.negotiable || 'Nagotiable' : 'Free'}</span>
                      </div>

                      <div className="mt-4 flex items-center justify-between">
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
          </Slider>
        ) : (
          <div className="text-white text-center">No events available.</div>
        )}

        {liveClass.length > 4 && (
          <div className="flex justify-end mt-6">
            <Link
              to="/for-you"
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
    </div>
  );
};

export default Recommended;
