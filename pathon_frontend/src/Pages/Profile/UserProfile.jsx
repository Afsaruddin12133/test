import React, { useEffect, useState } from "react";
import { useParams, useSearchParams, Link } from "react-router-dom";
import { FiUser } from "react-icons/fi";
import { HiOutlineUsers, HiOutlineAcademicCap } from "react-icons/hi";
import { RiLiveLine } from "react-icons/ri";
import { AiFillStar } from "react-icons/ai";
import { ShimmerThumbnail,ShimmerCircularImage , ShimmerTitle, ShimmerText, ShimmerSimpleGallery } from "react-shimmer-effects";

import Header from "../../Component/Header";
import Footer from "../../Component/Footer";
import { Base_url } from "../../Config/Api";
import { getUserToken } from "../../Auth/auth";

const API_BASE = "https://apidocumentationpathon.pathon.app";
const fallbackAvatar = "/cover.jpg";

const resolveAssetUrl = (maybeRelative) => {
    if (!maybeRelative) return fallbackAvatar;
    if (/^https?:\/\//i.test(maybeRelative)) return maybeRelative;
    return `${API_BASE}/${maybeRelative.replace(/^\/+/, "")}`;
};

const formatDateTime = (value) => {
    if (!value) return "—";
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return value;
    return `${date.toLocaleDateString()} • ${date.toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
    })}`;
};

const ProfileRow = ({ label, value }) => (
    <div className="flex flex-col gap-1 rounded-2xl border border-gray-200 bg-white/80 px-4 py-3 shadow-sm">
        <span className="text-xs font-medium uppercase tracking-wide text-gray-500">
            {label}
        </span>
        <span className="text-sm font-semibold text-gray-900">{value || "—"}</span>
    </div>
);

const UserProfiles = () => {
    const { user_id: paramUserId } = useParams();
    const [searchParams] = useSearchParams();

    const [profile, setProfile] = useState(null);
    const [interests, setInterests] = useState([]);
    const [_permission, setPermission] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [courses, setCourses] = useState({
        preRecordData: [],
        liveCountData: [],
        problemSolvingData: []
    });
    const [activeTab, setActiveTab] = useState("live");

    const queryUserId = searchParams.get("user_id");
    const requestedUserIdRaw = queryUserId ?? paramUserId ?? "";
    const requestedUserId = String(requestedUserIdRaw).trim();

    useEffect(() => {
        let isMounted = true;
        const controller = new AbortController();

        const token = getUserToken();
        if (!requestedUserId) {
            setLoading(false);
            setError("No user selected.");
            return () => controller.abort();
        }
        if (!token) {
            setLoading(false);
            setError("Authentication required.");
            return () => controller.abort();
        }

        setLoading(true);
        setError("");

        (async () => {
            try {
                const res = await fetch(
                    `${Base_url}userProfile?user_id=${encodeURIComponent(requestedUserId)}`,
                    {
                        method: "GET",
                        headers: {
                            Accept: "application/json",
                            Authorization: `Bearer ${token}`,
                        },
                        signal: controller.signal,
                    }
                );

                if (!res.ok) {
                    if (res.status === 404) {
                        throw new Error("User not found.");
                    }
                    if (res.status === 401) {
                        throw new Error("Session expired. Please sign in again.");
                    }
                    throw new Error(`Failed to fetch profile (HTTP ${res.status}).`);
                }

                const data = await res.json();
                if (!isMounted) return;

                setProfile(data?.user || null);
                setInterests(Array.isArray(data?.interested) ? data.interested : []);
                setPermission(data?.permission || null);
                setCourses({
                    preRecordData: Array.isArray(data?.items?.preRecordData) ? data.items.preRecordData : [],
                    liveCountData: Array.isArray(data?.items?.liveCountData) ? data.items.liveCountData : [],
                    problemSolvingData: Array.isArray(data?.items?.problemSolvingData) ? data.items.problemSolvingData : []
                });
            } catch (err) {
                if (err.name === "AbortError") return;
                console.error("User profile fetch failed", err);
                if (isMounted) {
                    setError(err.message || "Unable to load profile.");
                    setProfile(null);
                    setInterests([]);
                    setPermission(null);
                    setCourses({
                        preRecordData: [],
                        liveCountData: [],
                        problemSolvingData: []
                    });
                }
            } finally {
                if (isMounted) setLoading(false);
            }
        })();

        return () => {
            isMounted = false;
            controller.abort();
        };
    }, [requestedUserId]);

    const interestTags = interests.map((item) => item?.title).filter(Boolean);

    // Course Card Component
    const CourseCard = ({ course, type }) => {
        const negotiableFlag = course?.isNegotiable ?? 0;
        const price = course?.price ?? 0;
        const fallbackImage = "/src/Images/cover.jpg";

        const headerImage = course?.headerImageVideo
            ? `https://apidocumentationpathon.pathon.app/${course.headerImageVideo}`
            : fallbackImage;

        const detailsLink = type === 'live'
            ? `/details-live/${course.subject_id}`
            : type === 'record'
                ? `/details-record/${course.subject_id}`
                : `/details-problem/${course.subject_id}`;

        return (
            <Link
                to={detailsLink}
                className="block focus:outline-none focus:ring-2 focus:ring-purple-600 rounded-xl"
            >
                <div className="rounded-xl bg-white border border-gray-200 shadow-md hover:shadow-lg transition-shadow h-full">
                    <div className="overflow-hidden rounded-t-xl">
                        <img
                            src={headerImage}
                            alt={course.title}
                            className="w-full h-40 object-cover rounded-t-xl transform transition-transform duration-700 hover:scale-110"
                            onError={(e) => {
                                e.currentTarget.src = fallbackImage;
                            }}
                        />
                    </div>

                    <div className="p-4">
                        <h2 className="text-[18px] font-semibold text-[#1a1a1a] leading-6 line-clamp-2 mb-3">
                            {course.title || "Untitled Course"}
                        </h2>

                        <div className="mt-3 flex items-center justify-between text-[13px] text-gray-700">
                            <span className="flex items-center gap-2">
                                <FiUser className="text-gray-600" />
                                <span className="truncate">{profile?.full_name || "Unknown"}</span>
                            </span>
                            <span className="flex items-center gap-2">
                                <HiOutlineUsers className="text-gray-600" />
                                <span>{course?.buyer_count ?? 0}</span>
                            </span>
                        </div>

                        <div className="mt-2 flex items-center justify-between text-[13px] text-gray-700">
                            <span className="flex items-center gap-2">
                                <HiOutlineAcademicCap className="text-gray-600" />
                                <span>{course?.class || "N/A"}</span>
                            </span>
                            <span className="flex items-center gap-2">
                                <RiLiveLine className="text-gray-600" />
                                <span>
                                    {type === 'live' ? 'Live' : type === 'record' ? 'Record' : 'Problem'}
                                </span>
                            </span>
                        </div>

                        <div className="mt-2 flex items-center justify-between text-[13px] text-gray-700">
                            <span className="flex items-center gap-1">
                                <AiFillStar className="text-yellow-400" />
                                <span className="font-medium">{course?.rating ?? 0}</span>
                                <span className="text-gray-500">({course?.rating_count ?? 0})</span>
                            </span>
                            <span className="text-gray-700">
                                {Number(price) > 0
                                    ? (Number(negotiableFlag) === 1 ? "Negotiable" : "Non-negotiable")
                                    : "Free"}
                            </span>
                        </div>

                        <div className="mt-2 flex items-center justify-between">
                            <p className="text-gray-700 font-extrabold tracking-wide">
                                BDT{" "}
                                {Number(price || 0).toLocaleString("en-US", {
                                    minimumFractionDigits: 2,
                                    maximumFractionDigits: 2,
                                })}
                            </p>
                            <p className="text-sm text-gray-600">{course?.country || ""}</p>
                        </div>
                    </div>
                </div>
            </Link>
        );
    };

    // Course Section Component
    const CourseSection = ({ title, courses, type }) => {
        return (
            <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {courses.length > 0 ? (
                    courses.map((course) => (
                        <CourseCard key={course.id} course={course} type={type} />
                    ))
                ) : (
                    <div className="col-span-full text-center py-12">
                        <p className="text-gray-500 text-lg">No {title.toLowerCase()} available</p>
                    </div>
                )}
            </div>
        );
    };

    // Tabs configuration
    const tabs = [
        {
            id: "live",
            label: "Live Class",
            courses: courses.liveCountData,
            type: "live"
        },
        {
            id: "record",
            label: "Recorded Class",
            courses: courses.preRecordData,
            type: "record"
        },
        {
            id: "problem",
            label: "Problem Solving",
            courses: courses.problemSolvingData,
            type: "problem"
        },
    ];

    return (
        <div className="min-h-screen bg-purple-50">
            <Header />

            <main className="mx-auto flex w-full max-w-5xl flex-1 flex-col gap-6 px-4 py-8 md:px-6">
                <div className="flex flex-wrap items-center justify-between gap-3">
                    <div>
                        <h1 className="text-2xl font-bold text-purple-900 md:text-3xl">
                            User profile
                        </h1>
                        {requestedUserId && (
                            <p className="text-sm text-gray-500">
                                User ID: <span className="font-semibold">{requestedUserId}</span>
                            </p>
                        )}
                    </div>
                </div>

                {loading ? (
                    <section className="space-y-6">
                        {/* Profile Section Shimmer */}
                        <div className="flex flex-col gap-6 rounded-3xl border border-gray-200 bg-white p-6 shadow-sm lg:flex-row">
                            <div className="flex flex-col items-center gap-4 text-center lg:w-64 lg:text-left">
                                {/* Avatar Shimmer */}
                                <ShimmerCircularImage size={150} />
                                {/* Name and contact shimmers */}
                                <div className="space-y-2 w-full">
                                    <ShimmerTitle line={1} gap={10} variant="primary" />
                                    <ShimmerText line={2} gap={10} />
                                </div>
                            </div>

                            <div className="flex-1 space-y-4">
                                {/* Profile fields shimmer */}
                                <div className="grid gap-3 md:grid-cols-2">
                                    {[...Array(6)].map((_, idx) => (
                                        <div key={idx} className="rounded-2xl border border-gray-200 bg-white/80 px-4 py-3 shadow-sm">
                                            <ShimmerText line={2} gap={8} />
                                        </div>
                                    ))}
                                </div>

                                {/* Address shimmer */}
                                <div className="rounded-2xl border border-purple-100 bg-purple-50/70 px-5 py-4">
                                    <ShimmerTitle line={1} gap={10} variant="secondary" />
                                    <div className="mt-2">
                                        <ShimmerText line={2} gap={10} />
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Interests Section Shimmer */}
                        <div className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm">
                            <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
                                <ShimmerTitle line={1} gap={10} variant="primary" />
                            </div>
                            <div className="flex flex-wrap gap-2">
                                {[...Array(5)].map((_, idx) => (
                                    <div key={idx} className="h-8 w-24 bg-gray-200 rounded-full animate-pulse" />
                                ))}
                            </div>
                        </div>

                        {/* Courses Section Shimmer */}
                        <div className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm">
                            <div className="mb-6">
                                <ShimmerTitle line={1} gap={10} variant="primary" />
                                {/* Tab buttons shimmer */}
                                <div className="flex flex-wrap gap-3 mt-4">
                                    {[...Array(3)].map((_, idx) => (
                                        <div key={idx} className="h-10 w-32 bg-gray-200 rounded-lg animate-pulse" />
                                    ))}
                                </div>
                            </div>

                            {/* Course cards shimmer */}
                            <div className="mt-6">
                                <ShimmerSimpleGallery card imageHeight={160} caption row={2} col={4} gap={20} />
                            </div>
                        </div>
                    </section>
                ) : error ? (
                    <section className="rounded-3xl border border-red-200 bg-red-50 p-6 text-center text-red-600 shadow-sm">
                        {error}
                    </section>
                ) : !profile ? (
                    <section className="rounded-3xl border border-gray-200 bg-white p-6 text-center text-gray-600 shadow-sm">
                        Profile information is unavailable.
                    </section>
                ) : (
                    <>
                        <section className="flex flex-col gap-6 rounded-3xl border border-gray-200 bg-white p-6 shadow-sm lg:flex-row">
                            <div className="flex flex-col items-center gap-4 text-center lg:w-64 lg:text-left">
                                <div className="h-32 w-32 overflow-hidden rounded-full border-4 border-purple-100 bg-purple-100 shadow-md">
                                    <img
                                        src={resolveAssetUrl(profile.picture)}
                                        alt={profile.full_name || "Profile"}
                                        className="h-full w-full object-cover"
                                        onError={(e) => {
                                            // fallback if remote image fails
                                            e.currentTarget.src = fallbackAvatar;
                                        }}
                                    />
                                </div>
                                <div className="space-y-1">
                                    <h2 className="text-xl font-semibold text-gray-900">
                                        {profile.full_name || "Unnamed user"}
                                    </h2>
                                    {profile.email ? (
                                        <a 
                                            href={`mailto:${profile.email}`}
                                            className="text-sm text-blue-600 hover:text-blue-700 hover:underline block"
                                        >
                                            {profile.email}
                                        </a>
                                    ) : (
                                        <p className="text-sm text-gray-500">No email provided</p>
                                    )}
                                    {profile.phone ? (
                                        <a 
                                            href={`tel:${profile.phone}`}
                                            className="text-sm text-blue-600 hover:text-blue-700 hover:underline block"
                                        >
                                            {profile.phone}
                                        </a>
                                    ) : (
                                        <p className="text-sm text-gray-500">No phone provided</p>
                                    )}
                                </div>
                            </div>

                            <div className="flex-1 space-y-4">
                                <div className="grid gap-3 md:grid-cols-2">
                                    <ProfileRow label="Role" value={profile.role === 1 ? "Tutor" : "Student"} />
                                    <ProfileRow label="Country" value={profile.country} />
                                    <ProfileRow label="City" value={profile.city} />
                                    <ProfileRow label="Profession" value={profile.profession} />
                                    <ProfileRow label="Company" value={profile.company} />
                                    <ProfileRow label="Designation" value={profile.designation} />
                                    {/* <ProfileRow label="Date of Birth" value={formatDateTime(profile.dob)} /> */}
                                    <ProfileRow label="Last updated" value={formatDateTime(profile.updated_at)} />
                                </div>

                                <div className="rounded-2xl border border-purple-100 bg-purple-50/70 px-5 py-4">
                                    <h3 className="text-sm font-semibold uppercase tracking-wide text-purple-700">
                                        Address
                                    </h3>
                                    <p className="mt-1 text-sm text-purple-900">
                                        {profile.address?.trim() || "No address provided."}
                                    </p>
                                </div>
                            </div>
                        </section>

                        <section className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm">
                            <div className="flex flex-wrap items-center justify-between gap-3">
                                <h3 className="text-lg font-semibold text-gray-900">Interested areas</h3>
                                <span className="text-sm text-gray-500">
                                    {interestTags.length} item{interestTags.length === 1 ? "" : "s"}
                                </span>
                            </div>
                            {interestTags.length === 0 ? (
                                <p className="mt-4 rounded-2xl border border-dashed border-gray-300 bg-gray-50 px-4 py-3 text-sm text-gray-600">
                                    No interests recorded.
                                </p>
                            ) : (
                                <div className="mt-4 flex flex-wrap gap-2">
                                    {interestTags.map((title) => (
                                        <span
                                            key={title}
                                            className="inline-flex items-center rounded-full bg-purple-100 px-3 py-1 text-sm font-semibold text-purple-700"
                                        >
                                            {title.trim()}
                                        </span>
                                    ))}
                                </div>
                            )}
                        </section>

                        {/* Courses Tabbed Section */}
                        <section className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm">
                            <div className="mb-6">
                                <h3 className="text-lg font-semibold text-gray-900 mb-4">Courses</h3>

                                {/* Tab Buttons */}
                                <div className="flex flex-wrap gap-3">
                                    {tabs.map((tab) => (
                                        <button
                                            key={tab.id}
                                            onClick={() => setActiveTab(tab.id)}
                                            className={`px-6 py-2.5 rounded-lg font-semibold text-sm transition-all duration-200 ${activeTab === tab.id
                                                    ? "bg-blue-600 text-white shadow-md"
                                                    : "bg-white text-gray-800 border border-gray-300 hover:bg-gray-50"
                                                }`}
                                        >
                                            {tab.label}
                                            <span className={`ml-2 text-xs px-2 py-0.5 rounded-full ${activeTab === tab.id
                                                    ? "bg-white/20 text-white"
                                                    : "bg-gray-200 text-gray-700"
                                                }`}>
                                                {tab.courses.length}
                                            </span>
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Tab Content */}
                            <div className="mt-6">
                                {tabs.map((tab) => (
                                    <div
                                        key={tab.id}
                                        className={activeTab === tab.id ? "block" : "hidden"}
                                    >
                                        <CourseSection
                                            title={tab.label}
                                            courses={tab.courses}
                                            type={tab.type}
                                        />
                                    </div>
                                ))}
                            </div>
                        </section>
                        {/* 
                        <section className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm">
                            <h3 className="text-lg font-semibold text-gray-900">Visibility permissions</h3>
                            <p className="text-sm text-gray-500">
                                Indicates which personal details the user allows others to view.
                            </p>
                            <div className="mt-4 grid gap-3 md:grid-cols-3">
                                {[
                                    { key: "email", label: "Email visibility" },
                                    { key: "phone", label: "Phone visibility" },
                                    { key: "picture", label: "Profile picture visibility" },
                                ].map(({ key, label }) => (
                                    <div
                                        key={key}
                                        className="flex items-center justify-between rounded-2xl border border-gray-200 bg-white px-4 py-3 shadow-sm"
                                    >
                                        <span className="text-sm font-medium text-gray-700">{label}</span>
                                        <span
                                            className={`inline-flex min-w-[70px] items-center justify-center rounded-full px-3 py-1 text-xs font-semibold ${permission?.[key] === 1
                                                ? "bg-emerald-100 text-emerald-700"
                                                : "bg-gray-100 text-gray-500"
                                            }`}
                                        >
                                            {permission?.[key] === 1 ? "Allowed" : "Hidden"}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </section> */}
                    </>
                )}
            </main>

            <Footer />
        </div>
    );
};

export default UserProfiles;