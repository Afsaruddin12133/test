import React, { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { ShimmerThumbnail, ShimmerTitle } from "react-shimmer-effects";
import { FiUser } from "react-icons/fi";
import { HiOutlineUsers, HiOutlineAcademicCap } from "react-icons/hi";
import { RiLiveLine } from "react-icons/ri";
import { MdVideoLibrary } from "react-icons/md";
import { FaQuestionCircle } from "react-icons/fa";
import { AiFillStar } from "react-icons/ai";
import Header from "../Header";
import Footer from "../Footer";
import Image from "/8.jpg";
import { Base_url } from "../../Config/Api";

const Card = ({ course, type }) => {
  const getTypeIcon = () => {
    switch (Number(type)) {
      case 1:
        return <MdVideoLibrary className="text-gray-600" />;
      case 3:
        return <FaQuestionCircle className="text-gray-600" />;
      default:
        return <RiLiveLine className="text-gray-600" />;
    }
  };

  const getTypeLabel = () => {
    switch (Number(type)) {
      case 1:
        return "Record";
      case 3:
        return "Problem";
      default:
        return "Live";
    }
  };

  const getDetailsRoute = () => {
    switch (Number(type)) {
      case 1:
        return `/details-record/${course.topic_id}`;
      case 3:
        return `/details-problem/${course.topic_id}`;
      default:
        return `/details-live/${course.topic_id}`;
    }
  };

  return (
    <Link
      to={getDetailsRoute()}
      className="block focus:outline-none focus:ring-2 focus:ring-purple-600 rounded-xl"
    >
      <div className="rounded-xl bg-white border border-gray-200 shadow-md hover:shadow-lg transition-shadow">
        <div className="overflow-hidden rounded-t-xl">
          <img
            src={course.headerImageVideo}
            alt={course.title}
            className="w-full h-40 object-cover rounded-t-xl transform transition-transform duration-700 hover:scale-115"
          />
        </div>
        <div className="p-4">
          <h2 className="text-[18px] font-semibold text-[#1a1a1a] leading-6 line-clamp-1">
            {course.title}
          </h2>

          <div className="mt-3 flex items-center justify-between text-[13px] text-gray-700">
            <span className="flex items-center gap-2">
              <FiUser className="text-gray-600" />
              <span className="truncate">{course.full_name}</span>
            </span>
            <span className="flex items-center gap-2">
              <HiOutlineUsers className="text-gray-600" />
              <span>{course.enrollment}</span>
            </span>
          </div>

          <div className="mt-2 flex items-center justify-between text-[13px] text-gray-700">
            <span className="flex items-center gap-2">
              <HiOutlineAcademicCap className="text-gray-600" />
              <span>{course.class}</span>
            </span>
            <span className="flex items-center gap-2">
              {getTypeIcon()}
              <span>{getTypeLabel()}</span>
            </span>
          </div>

          <div className="mt-2 flex items-center justify-between text-[13px] text-gray-700">
            <span className="flex items-center gap-1">
              <AiFillStar className="text-yellow-400" />
              <span className="font-medium">{course.rating}</span>
              <span className="text-gray-500">({course.rating_count})</span>
            </span>
            <span className="text-gray-700">
              {Number(course.paid) > 0
                ? course.isNegotiable === 1
                  ? "Negotiable"
                  : "Non-negotiable"
                : "Free"}
            </span>
          </div>

          <div className="mt-2 flex items-center justify-between">
            <p className="text-gray-700 font-extrabold tracking-wide">
              BDT{" "}
              {Number(course.paid || 0).toLocaleString("en-US", {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })}
            </p>
            <p>{course.country}</p>
          </div>
        </div>
      </div>
    </Link>
  );
};

const MyEnrolment = () => {
  const [searchParams] = useSearchParams();
  const type = searchParams.get("type") || "2"; // Default to Live (type 2)

  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const getPageTitle = () => {
    switch (Number(type)) {
      case 1:
        return "My Enrolled Record Classes";
      case 3:
        return "My Enrolled Problem Solving";
      default:
        return "My Enrolled Live Classes";
    }
  };

  const getBrowseLink = () => {
    switch (Number(type)) {
      case 1:
        return "/record-class";
      case 3:
        return "/solve-class";
      default:
        return "/live-class";
    }
  };

  const getBrowseText = () => {
    switch (Number(type)) {
      case 1:
        return "Browse Record Classes";
      case 3:
        return "Browse Problem Solving";
      default:
        return "Browse Live Classes";
    }
  };

  const getEmptyIcon = () => {
    switch (Number(type)) {
      case 1:
        return MdVideoLibrary;
      case 3:
        return FaQuestionCircle;
      default:
        return RiLiveLine;
    }
  };

  const fetchEnrolledCourses = async (page = 1) => {
    setLoading(true);
    setError(null);

    try {
      const authData = JSON.parse(localStorage.getItem("auth") || "{}");
      const userToken = authData?.user?.token;

      if (!userToken) {
        throw new Error("Authentication required. Please login.");
      }

      const myHeaders = new Headers();
      myHeaders.append("Content-Type", "application/json");
      myHeaders.append("Accept", "application/json");
      myHeaders.append("Authorization", `Bearer ${userToken}`);

      const response = await fetch(
        `${Base_url}getUserAllCourse?type=${type}&page=${page}`,
        {
          method: "GET",
          headers: myHeaders,
          redirect: "follow",
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: Failed to fetch courses`);
      }

      const result = await response.json();
      
      // Normalize the data
      const normalizedCourses = (result?.data || []).map((course) => ({
        ...course,
        headerImageVideo: course?.headerImageVideo
          ? `https://apidocumentationpathon.pathon.app/${course.headerImageVideo}`
          : Image,
      }));

      setCourses(normalizedCourses);
      setCurrentPage(result?.current_page || 1);
      setTotalPages(result?.last_page || 1);
    } catch (err) {
      console.error("Failed to fetch enrolled courses:", err);
      setError(err.message || "Failed to load enrolled courses.");
      setCourses([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setCurrentPage(1);
    fetchEnrolledCourses(1);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [type]);

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
      fetchEnrolledCourses(page);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const EmptyIcon = getEmptyIcon();

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <div className="flex-grow bg-purple-50 py-8 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="mb-6 px-2">
            <h3 className="text-3xl font-bold mb-0">{getPageTitle()}</h3>
            {error && (
              <div className="text-red-600 mt-2 bg-red-50 border border-red-200 rounded-xl px-4 py-3">
                Error: {error}
              </div>
            )}
            <div className="mt-1">
              <div className="h-[3px] w-28 bg-purple-400 rounded-full" />
              <div className="h-[3px] w-20 bg-purple-300 rounded-full mt-1" />
            </div>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {Array.from({ length: 8 }).map((_, idx) => (
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
          ) : courses.length > 0 ? (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {courses.map((course) => (
                  <Card key={course.id} course={course} type={type} />
                ))}
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="mt-8 flex items-center justify-center gap-2">
                  <button
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="px-4 py-2 rounded-lg bg-white border border-gray-300 text-gray-700 font-semibold hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    Previous
                  </button>
                  
                  <div className="flex gap-2">
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                      <button
                        key={page}
                        onClick={() => handlePageChange(page)}
                        className={`px-4 py-2 rounded-lg font-semibold transition-colors ${
                          currentPage === page
                            ? "bg-purple-700 text-white"
                            : "bg-white border border-gray-300 text-gray-700 hover:bg-gray-50"
                        }`}
                      >
                        {page}
                      </button>
                    ))}
                  </div>

                  <button
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className="px-4 py-2 rounded-lg bg-white border border-gray-300 text-gray-700 font-semibold hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    Next
                  </button>
                </div>
              )}
            </>
          ) : (
            <div className="text-center py-16">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-purple-100 mb-4">
                <EmptyIcon className="text-4xl text-purple-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                No Enrolled Courses Yet
              </h3>
              <p className="text-gray-600 mb-6">
                You haven't enrolled in any courses yet. Start learning today!
              </p>
              <Link
                to={getBrowseLink()}
                className="inline-flex items-center gap-2 text-white bg-purple-700 font-bold px-6 py-3 rounded-lg shadow transition hover:bg-purple-800 hover:scale-105 duration-200"
              >
                {getBrowseText()}
              </Link>
            </div>
          )}
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default MyEnrolment;
