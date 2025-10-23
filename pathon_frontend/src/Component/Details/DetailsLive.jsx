import React, { useMemo, useRef, useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { AiOutlineClockCircle, AiFillStar } from "react-icons/ai";
import { BiHash } from "react-icons/bi";
import { BsPlayFill } from "react-icons/bs";
import { JitsiMeeting } from "@jitsi/react-sdk";
import { ShimmerThumbnail, ShimmerTitle } from "react-shimmer-effects";
import { toast } from "react-toastify";

import { Base_url } from "../../Config/Api";
import Buyers from "./Buyer";
import Reviews from "./Reviews";

/** -----------------------------
 * Small utilities
 * ------------------------------*/
const fmtBDT = (n) =>
  Number(n || 0).toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

const formatTotal = (mins) => {
  const h = Math.floor(mins / 60);
  const m = mins % 60;
  if (mins <= 0) return "0 min";
  if (h <= 0) return `${m} min`;
  return `${h} hr${h > 1 ? "s" : ""}${m ? ` ${m} min` : ""}`;
};


/** -----------------------------
 * API shape normalizer (result + tagData)
 * ------------------------------*/
const normalizeClass = (payload) => {
  const r = payload?.result ?? {};
  const tagData = payload?.tagData ?? [];
  const duration1 = Number(payload?.totalDuration || 0);

  return {
    id: r.subject_id,
    class: r.class || "",
    title: r.title || "",
    description: r.description || "",
    isPrivate: Number(r.isPrivate),
    price: r.price ?? 0,
    isNegotiable: Number(r.isNegotiable),
    owner_id: r.owner_id || null,
    rating: r.rating ?? 0,
    reviewCount: r.rating_count ?? 0,
    institute: r.institute || "",
    country: r.country || "",
    author: r.full_name || "Unknown",
    buyer_count: r.buyer_count || "-",
    dateTime: r.active_since || "",
    enrollment: r.enrollment || "-",
    tags: Array.isArray(tagData)
      ? tagData.map((t) => String(t?.title || "").trim()).filter(Boolean)
      : [],
    cover: r.headerImageVideo ? `https://apidocumentationpathon.pathon.app/${r.headerImageVideo}` : null,
    episodes: Array.isArray(r.episodes) ? r.episodes : [],
    code: r.subject_id,
    reviews: Array.isArray(r.reviews) ? r.reviews : [],
    duration: duration1, // total duration in minutes
    status: Number(payload?.status || 0), // 0: not bought, 1: bought
    feedbackStatus: Number(payload?.feedbackStatus || 0),
  };
};

async function fetchClassDetails(subjectId, signal) {
  const authData = JSON.parse(localStorage.getItem("auth") || "{}");
  const userToken = authData?.user?.token;

  if (!userToken) throw new Error("Authentication required");

  const url = `${Base_url}courseDetails?subject_id=${encodeURIComponent(subjectId)}`;

  const res = await fetch(url, {
    method: "GET",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      Authorization: `Bearer ${userToken}`,
    },
    
    signal,
    
  });
  
  

  if (!res.ok) {
    if (res.status === 401) {
      localStorage.removeItem("auth");
      throw new Error("Session expired. Please login again.");
    }
    throw new Error(`HTTP ${res.status} for subject_id=${subjectId}`);
  }

  const json = await res.json();
  if (json.error) throw new Error(json.error || "Failed to fetch class details");

  return normalizeClass(json);
}

async function fetchLiveClassData(courseId, signal) {
  const authData = JSON.parse(localStorage.getItem("auth") || "{}");
  const userToken = authData?.user?.token;

  if (!userToken) throw new Error("Authentication required");

  const url = `${Base_url}courseAllItemByCourseID?course_id=${encodeURIComponent(courseId)}`;

  const res = await fetch(url, {
    method: "GET",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      Authorization: `Bearer ${userToken}`,
    },
    signal,
  });
  console.log(res);
  

  if (!res.ok) {
    if (res.status === 401) {
      localStorage.removeItem("auth");
      throw new Error("Session expired. Please login again.");
    }
    throw new Error(`HTTP ${res.status} for course_id=${courseId}`);
  }

  const json = await res.json();
  if (json.error) throw new Error(json.error || "Failed to fetch live class data");

  return json.data || [];
}

const CLASS_TYPE = 2; // live class

const readAuth = () => {
  if (typeof window === "undefined") return {};
  try {
    const raw = window.localStorage?.getItem("auth");
    if (!raw) return {};
    return JSON.parse(raw);
  } catch (err) {
    console.warn("Failed to parse auth payload", err);
    return {};
  }
};

const resolveAuthToken = () => {
  const auth = readAuth();
  return (
    auth?.token ||
    auth?.accessToken ||
    auth?.user?.token ||
    auth?.data?.token ||
    ""
  );
};

const resolveAuthUserId = () => {
  const auth = readAuth();
  return (
    auth?.user?.id ??
    auth?.user_id ??
    auth?.id ??
    auth?.user?.user_id ??
    null
  );
};

/** -----------------------------
 * Component (Live-only)
 * ------------------------------*/
const DetailsLive = () => {
  const { subject_id } = useParams();
  const navigate = useNavigate();

  // UI state
  const [showMore, setShowMore] = useState(false);
  const [showBuyerList, setShowBuyerList] = useState(false);
  const [activeTab, setActiveTab] = useState("details");
  const [subTab] = useState("live"); // No setter needed since we removed sub-tab switching

  // data state
  const [classDetails, setClassDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState("");

  // Live class state
  const [liveClasses, setLiveClasses] = useState([]);
  const [loadingLiveClasses, setLoadingLiveClasses] = useState(false);
  const [showJitsiMeet, setShowJitsiMeet] = useState(false);
  const [selectedLiveClass, setSelectedLiveClass] = useState(null);
  const [negotiations, setNegotiations] = useState([]);
  const [negotiationsLoading, setNegotiationsLoading] = useState(false);
  const [negotiationsError, setNegotiationsError] = useState("");
  const [negotiationMessage, setNegotiationMessage] = useState("");
  const [negotiationVersion, setNegotiationVersion] = useState(0);
  const [negotiationActionId, setNegotiationActionId] = useState("");
  const [negotiationEdits, setNegotiationEdits] = useState({});
  const [myNegotiation, setMyNegotiation] = useState(null);

  useEffect(() => {
    let isMounted = true;
    const controller = new AbortController();

    (async () => {
      try {
        if (!subject_id) {
          setFetchError("No subject ID provided.");
          return;
        }
        setLoading(true);
        setFetchError("");

        const details = await fetchClassDetails(subject_id, controller.signal);
        if (isMounted) setClassDetails(details);
      } catch (e) {
        if (e.name === "AbortError") return;
        if (isMounted) {
          console.error("Fetch error:", e);
          // Redirect to signin if authentication is required
          if (e.message === "Authentication required" || e.message === "Session expired. Please login again.") {
            navigate("/signin");
            return;
          }
          setClassDetails(null);
          setFetchError(
            e.message === `HTTP 500 for subject_id=${subject_id}`
              ? "This class is currently unavailable. Please try again later."
              : e.message || "Failed to load class details."
          );
        }
      } finally {
        if (isMounted) setLoading(false);
      }
    })();

    return () => {
      isMounted = false;
      controller.abort();
    };
  }, [subject_id, navigate]);

  const item = useMemo(() => classDetails, [classDetails]);
  console.log(item);

  // Set default subTab based on purchase status

  

  // Check if current user is the owner
  const isOwner = useMemo(() => {
    const authData = JSON.parse(localStorage.getItem("auth") || "{}");
    const userId = authData?.user?.id;
    return userId && String(userId) === String(item?.owner_id);
  }, [item?.owner_id]);

  const buyBtnRef = useRef(null);
  const enrollBtnRef = useRef(null);

  const price = Number(item?.price || 0);
  const isFree = !price || price === 0;

  const title = item?.title;
  const creator = item?.author;
  const rating = item?.rating ?? 0;
  const reviewCount = item?.reviewCount ?? 0;

  // const episodes = useMemo(
  //   () => (Array.isArray(item?.episodes) ? item.episodes : []),
  //   [item?.episodes]
  // );

  // const totalMinutes = useMemo(
  //   () => episodes.reduce((sum, ep) => sum + getEpisodeMinutes(ep), 0),
  //   [episodes]
  // );

  // const computedDuration =
  //   totalMinutes > 0
  //     ? formatTotal(totalMinutes)
  //     : String(
  //         item?.duration ||
  //           item?.time ||
  //           item?.totalMinutes ||
  //           item?.length ||
  //           ""
  //       );

  const courseId = item?.code || item?.id;
  const subjectCode = item?.code || subject_id;
  const shortDesc = item?.description || "";

  // Fetch live classes when courseId is available
  useEffect(() => {
    if (!courseId) return;

    let isMounted = true;
    const controller = new AbortController();

    (async () => {
      try {
        setLoadingLiveClasses(true);
        const liveClassData = await fetchLiveClassData(courseId, controller.signal);
        if (isMounted) {
          setLiveClasses(liveClassData);
        }
      } catch (e) {
        if (e.name === "AbortError") return;
        if (isMounted) {
          console.error("Failed to fetch live classes:", e);
        }
      } finally {
        if (isMounted) setLoadingLiveClasses(false);
      }
    })();

    return () => {
      isMounted = false;
      controller.abort();
    };
  }, [courseId]);

  // Negotiate state
  const tutorPrice = price;
  const [myPrice, setMyPrice] = useState(0);

  useEffect(() => {
    if (isOwner) {
      setMyPrice(tutorPrice);
      return;
    }
    if (myNegotiation?.student_offer != null) {
      setMyPrice(Number(myNegotiation.student_offer));
    } else {
      setMyPrice(tutorPrice);
    }
  }, [tutorPrice, isOwner, myNegotiation?.student_offer]);

  const refreshNegotiations = () =>
    setNegotiationVersion((version) => version + 1);

  const withAuthToken = () => {
    const token = resolveAuthToken();
    if (!token) {
      throw new Error("Authentication required");
    }
    return token;
  };

  const createUrlEncodedBody = (payload) =>
    new URLSearchParams(
      Object.entries(payload).reduce((acc, [key, value]) => {
        if (value !== undefined && value !== null) {
          acc[key] = String(value);
        }
        return acc;
      }, {})
    );

  const handleTutorOfferUpdate = async (studentId) => {
    const record = negotiations.find(
      (neg) => String(neg.student_id) === String(studentId)
    );
    if (!record) return;

    const desiredOffer = Number(negotiationEdits[studentId] ?? record.tutor_offer);
    if (Number.isNaN(desiredOffer) || desiredOffer < 0) {
      setNegotiationsError("Enter a valid tutor offer.");
      return;
    }

    try {
      const token = withAuthToken();
      setNegotiationsError("");
      setNegotiationMessage("");
      setNegotiationActionId(`update:${studentId}`);

      const body = createUrlEncodedBody({
        subject_id: subjectCode,
        status: "2",
        tutor_offer: desiredOffer,
        student_offer: record.student_offer,
        user_id: record.student_id,
        type: CLASS_TYPE,
      });

      const res = await fetch(`${Base_url}courseNegotiable`, {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/x-www-form-urlencoded",
          Authorization: `Bearer ${token}`,
        },
        body,
      });

      const json = await res.json().catch(() => ({}));
      if (!res.ok || json?.error) {
        throw new Error(json?.message || json?.error || "Failed to update offer");
      }

      setNegotiationMessage("Offer sent to student.");
      refreshNegotiations();
    } catch (err) {
      setNegotiationsError(err.message || "Unable to update offer.");
    } finally {
      setNegotiationActionId("");
    }
  };

  const handleNegotiationDelete = async (studentId) => {
    try {
      const token = withAuthToken();
      setNegotiationsError("");
      setNegotiationMessage("");
      setNegotiationActionId(`delete:${studentId}`);

      const url = `${Base_url}deleteNegotiable?user_id=${encodeURIComponent(
        studentId
      )}&subject_id=${encodeURIComponent(subjectCode || "")}`;

      const res = await fetch(url, {
        method: "DELETE",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/x-www-form-urlencoded",
          Authorization: `Bearer ${token}`,
        },
        body: createUrlEncodedBody({
          subject_id: subjectCode,
          user_id: studentId,
          type: CLASS_TYPE,
        }),
      });

      const json = await res.json().catch(() => ({}));
      if (!res.ok || json?.error) {
        throw new Error(json?.message || json?.error || "Failed to delete");
      }

      setNegotiationMessage("Negotiation removed.");
      refreshNegotiations();
    } catch (err) {
      setNegotiationsError(err.message || "Unable to delete negotiation.");
    } finally {
      setNegotiationActionId("");
    }
  };

  const handleTutorAccept = async (studentId) => {
    try {
      const token = withAuthToken();
      setNegotiationsError("");
      setNegotiationMessage("");
      setNegotiationActionId(`accept:${studentId}`);

      const res = await fetch(`${Base_url}buyCourse`, {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/x-www-form-urlencoded",
          Authorization: `Bearer ${token}`,
        },
        body: createUrlEncodedBody({
          subject_id: subjectCode,
          user_id: studentId,
          status: "1",
          type: CLASS_TYPE,
        }),
      });

      const json = await res.json().catch(() => ({}));
      if (!res.ok || json?.error) {
        throw new Error(json?.message || json?.error || "Failed to enroll student");
      }

      setNegotiationMessage("Student enrolled successfully.");
      refreshNegotiations();
    } catch (err) {
      setNegotiationsError(err.message || "Unable to complete purchase.");
    } finally {
      setNegotiationActionId("");
    }
  };

  const handleStudentSubmit = async () => {
    try {
      const token = withAuthToken();
      const userId = resolveAuthUserId();
      if (!userId) throw new Error("User information missing");

      setNegotiationsError("");
      setNegotiationMessage("");
      setNegotiationActionId("student:submit");

      const offerValue = Number(myPrice);
      if (Number.isNaN(offerValue) || offerValue < 0) {
        throw new Error("Enter a valid offer amount");
      }

      const res = await fetch(`${Base_url}courseNegotiable`, {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/x-www-form-urlencoded",
          Authorization: `Bearer ${token}`,
        },
        body: createUrlEncodedBody({
          subject_id: subjectCode,
          status: "1",
          tutor_offer: myNegotiation?.tutor_offer ?? tutorPrice,
          student_offer: offerValue,
          user_id: userId,
          type: CLASS_TYPE,
        }),
      });

      const json = await res.json().catch(() => ({}));
      if (!res.ok || json?.error) {
        throw new Error(json?.message || json?.error || "Failed to submit offer");
      }

      setNegotiationMessage("Offer submitted to tutor.");
      refreshNegotiations();
    } catch (err) {
      setNegotiationsError(err.message || "Unable to submit offer.");
    } finally {
      setNegotiationActionId("");
    }
  };

  const handleStudentDelete = async () => {
    try {
      const token = withAuthToken();
      const userId = resolveAuthUserId();
      if (!userId) throw new Error("User information missing");

      setNegotiationsError("");
      setNegotiationMessage("");
      setNegotiationActionId("student:delete");

      const url = `${Base_url}deleteNegotiable?user_id=${encodeURIComponent(
        userId
      )}&subject_id=${encodeURIComponent(subjectCode || "")}`;

      const res = await fetch(url, {
        method: "DELETE",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/x-www-form-urlencoded",
          Authorization: `Bearer ${token}`,
        },
        body: createUrlEncodedBody({
          subject_id: subjectCode,
          user_id: userId,
          type: CLASS_TYPE,
        }),
      });

      const json = await res.json().catch(() => ({}));
      if (!res.ok || json?.error) {
        throw new Error(json?.message || json?.error || "Failed to delete offer");
      }

      setNegotiationMessage("Negotiation cancelled.");
      refreshNegotiations();
    } catch (err) {
      setNegotiationsError(err.message || "Unable to delete offer.");
    } finally {
      setNegotiationActionId("");
    }
  };

  const handleStudentBuy = async () => {
    try {
      const token = withAuthToken();
      const userId = resolveAuthUserId();
      if (!userId) throw new Error("User information missing");

      setNegotiationsError("");
      setNegotiationMessage("");
      setNegotiationActionId("student:buy");

      const res = await fetch(`${Base_url}buyCourse`, {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/x-www-form-urlencoded",
          Authorization: `Bearer ${token}`,
        },
        body: createUrlEncodedBody({
          subject_id: subjectCode,
          user_id: userId,
          status: "2",
          type: CLASS_TYPE,
        }),
      });

      const json = await res.json().catch(() => ({}));
      if (!res.ok || json?.error) {
        throw new Error(json?.message || json?.error || "Failed to purchase course");
      }

      setNegotiationMessage("Purchase completed. Enjoy the class!");
      refreshNegotiations();
    } catch (err) {
      setNegotiationsError(err.message || "Unable to purchase course.");
    } finally {
      setNegotiationActionId("");
    }
  };

  const handleDirectBuy = async () => {
    try {
      const token = withAuthToken();
      const userId = resolveAuthUserId();
      if (!userId) throw new Error("User information missing");

      const res = await fetch(`${Base_url}buyCourse`, {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/x-www-form-urlencoded",
          Authorization: `Bearer ${token}`,
        },
        body: createUrlEncodedBody({
          subject_id: subjectCode,
          user_id: userId,
          status: "0",
          type: CLASS_TYPE,
        }),
      });

      const json = await res.json().catch(() => ({}));
      if (!res.ok || json?.error) {
        throw new Error(json?.message || json?.error || "Failed to purchase course");
      }

      toast.success("Purchase completed successfully! Enjoy the class!");
      // Refresh the page or update state to reflect purchase
      window.location.reload();
    } catch (err) {
      toast.error(err.message || "Unable to purchase course.");
    }
  };

  useEffect(() => {
    if (!subjectCode || item?.isNegotiable !== 1) {
      setNegotiations([]);
      setMyNegotiation(null);
      return;
    }

    let isMounted = true;
    const controller = new AbortController();

    const token = resolveAuthToken();
    if (!token) {
      setNegotiationsError("Authentication required.");
      setNegotiationsLoading(false);
      return () => {
        isMounted = false;
        controller.abort();
      };
    }

  setNegotiationsLoading(true);
  setNegotiationsError("");
  setNegotiationMessage("");

    (async () => {
      try {
        if (isOwner) {
          const url = `${Base_url}tutorNegotiable?subject_id=${encodeURIComponent(
            subjectCode
          )}`;
          const res = await fetch(url, {
            method: "GET",
            headers: {
              Accept: "application/json",
              Authorization: `Bearer ${token}`,
            },
            signal: controller.signal,
          });

          if (!res.ok) {
            if (res.status === 404) {
              if (isMounted) {
                setNegotiations([]);
                setNegotiationEdits({});
              }
              return;
            }
            throw new Error(`HTTP ${res.status}`);
          }

          const json = await res.json();
          const list = Array.isArray(json?.data) ? json.data : [];
          if (isMounted) {
            setNegotiations(list);
            const mapped = list.reduce((acc, entry) => {
              acc[entry.student_id] = entry.tutor_offer ?? tutorPrice;
              return acc;
            }, {});
            setNegotiationEdits(mapped);
          }
        } else {
          const url = `${Base_url}checkStudentClassNegotiable?subject_id=${encodeURIComponent(
            subjectCode
          )}`;
          const res = await fetch(url, {
            method: "GET",
            headers: {
              Accept: "application/json",
              Authorization: `Bearer ${token}`,
            },
            signal: controller.signal,
          });

          if (res.status === 404) {
            if (isMounted) {
              setMyNegotiation(null);
            }
            return;
          }

          if (!res.ok) {
            throw new Error(`HTTP ${res.status}`);
          }

          const json = await res.json();
          if (isMounted) {
            if (json && typeof json === "object" && json.id) {
              setMyNegotiation(json);
            } else {
              setMyNegotiation(null);
            }
          }
        }
      } catch (err) {
        if (!isMounted) return;
        console.error("Negotiation fetch error", err);
        setNegotiationsError(err.message || "Unable to load negotiation data.");
      } finally {
        if (isMounted) setNegotiationsLoading(false);
      }
    })();

    return () => {
      isMounted = false;
      controller.abort();
    };
  }, [subjectCode, item?.isNegotiable, isOwner, negotiationVersion, tutorPrice]);


  // Reviews
  const [reviews, setReviews] = useState([]);
  const [reviewsLoading, setReviewsLoading] = useState(false);
  const [reviewsError, setReviewsError] = useState("");
  useEffect(() => {
    setReviews(Array.isArray(item?.reviews) ? item.reviews : []);
  }, [item]);
  // Removed unused variable currentUser to fix eslint warning
  const [ratingFilter, setRatingFilter] = useState(null);
  const [reviewOpen, setReviewOpen] = useState(false);
  const [reviewText, setReviewText] = useState("");
  const [reviewRating, setReviewRating] = useState(0);

  // API functions for reviews
  const fetchReviews = async (courseId, rating = null) => {
    const token = resolveAuthToken();
    if (!token) {
      setReviewsError("Authentication required");
      return;
    }

    setReviewsLoading(true);
    setReviewsError("");

    try {
      const url = rating
        ? `${Base_url}getFilterCourseFeedback?courseId=${encodeURIComponent(courseId)}&rating=${rating}`
        : `${Base_url}getAllCourseFeedback?courseId=${encodeURIComponent(courseId)}`;

      const res = await fetch(url, {
        method: "GET",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) {
        throw new Error(`HTTP ${res.status}`);
      }

      const json = await res.json();
      if (json.error) throw new Error(json.error || "Failed to fetch reviews");

      setReviews(Array.isArray(json.data) ? json.data : []);
    } catch (err) {
      console.error("Fetch reviews error:", err);
      setReviewsError(err.message || "Failed to load reviews");
      setReviews([]);
    } finally {
      setReviewsLoading(false);
    }
  };

  const submitReview = async (courseId, comment, rating) => {
    const token = resolveAuthToken();
    const userId = resolveAuthUserId();
    if (!token || !userId) {
      throw new Error("Authentication required");
    }

    const formData = new FormData();
    formData.append("courseId", courseId);
    formData.append("title", comment);
    formData.append("rating", rating.toString());
    formData.append("courseType", "2"); // live class
    formData.append("id", userId.toString());
    formData.append("previousRating", "0");

    const res = await fetch(`${Base_url}addReview`, {
      method: "POST",
      headers: {
        Accept: "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    });

    if (!res.ok) {
      const json = await res.json().catch(() => ({}));
      throw new Error(json.message || json.error || `HTTP ${res.status}`);
    }

    const json = await res.json();
    if (json.error) throw new Error(json.error || "Failed to submit review");

    return json;
  };

  // Fetch reviews when courseId changes
  useEffect(() => {
    if (courseId) {
      fetchReviews(courseId);
    }
  }, [courseId]);

  // Refetch reviews when rating filter changes
  useEffect(() => {
    if (courseId) {
      fetchReviews(courseId, ratingFilter);
    }
  }, [courseId, ratingFilter]);

  // Cover fallback handling
  const [coverFailed, setCoverFailed] = useState(false);
  const cover = item?.cover && !coverFailed ? item.cover : null;
  
  

  // Helper functions for live class functionality
  const handleJoinLiveClass = (liveClass) => {
    // Check if user has access (paid or free)
    if (!isFree && liveClass.isPaid === 1) {
      // For paid classes, you might want to check if user has purchased
      // For now, we'll allow access if they're on the details page
    }

    setSelectedLiveClass(liveClass);
    setShowJitsiMeet(true);
  };

  const handleLeaveMeeting = () => {
    setShowJitsiMeet(false);
    setSelectedLiveClass(null);
  };

  const getUserDisplayName = () => {
    const authData = JSON.parse(localStorage.getItem("auth") || "{}");
    return authData?.user?.name || authData?.user?.full_name || "Student";
  };

  /** -----------------------------
   * Render
   * ------------------------------*/
  if (loading) {
    return (
      <div className="bg-purple-50">
        <div className="w-full max-w-6xl mx-auto p-4 md:p-8">
          <div className="overflow-hidden bg-white rounded-xl">
            <ShimmerThumbnail height={260} rounded />
            <div className="p-4 md:p-6">
              <ShimmerTitle line={2} gap={10} />
              <div className="mt-4 flex flex-wrap items-center gap-3">
                <span className="inline-block h-8 w-24 bg-gray-200 rounded-xl" />
                <span className="inline-block h-8 w-20 bg-gray-200 rounded-xl" />
                <span className="inline-block h-8 w-28 bg-gray-200 rounded-xl" />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!item) {
    return (
      <div className="max-w-5xl mx-auto p-6">
        <div className="rounded-2xl border border-gray-200 bg-white p-8 text-center">
          <h2 className="text-xl font-semibold">Class not found</h2>
          <p className="text-gray-600 mt-2">
            We couldn’t find a class with Subject ID{" "}
            <span className="font-mono">{subject_id}</span>.
          </p>
          <Link
            to="/"
            className="inline-flex mt-6 px-5 py-2.5 rounded-xl bg-purple-600 text-white font-semibold hover:bg-purple-700"
          >
            Go Home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-purple-50">
      <div className="w-full max-w-6xl mx-auto p-4 md:p-8">
        {/* Cover */}
        <div className="overflow-hidden bg-white">
          {cover ? (
            <img
              src={cover}
              alt={title}
              loading="lazy"
              onError={() => setCoverFailed(true)}
              className="block mx-auto w/full max-w-xl h-[200px] sm:h-[220px] md:h-[260px] lg:h-[320px] object-cover object-center rounded-xl"
            />
          ) : (
            <img
              src="/5.jpg"
              alt={title}
              loading="lazy"
              className="block mx-auto w/full max-w-xl h/[200px] sm:h/[220px] md:h/[260px] lg:h/[320px] object-cover object-center rounded-xl"
            />
          )}

          {/* Buttons row (acts as tabs) */}
          <div className="flex flex-wrap items-center justify-center gap-3 mt-4 px-4 pb-6">
            {/* Only show DETAILS button if user hasn't bought the course (status !== 1) or is owner */}
            {(isOwner || item?.status !== 1) && (
              <button
                type="button"
                onClick={() => setActiveTab("details")}
                className={`px-5 py-2 rounded-2xl text-sm font-semibold text-white shadow-sm hover:brightness-105 ${activeTab === "details" ? "bg-purple-700" : "bg-black/80"
                  }`}
              >
                DETAILS
              </button>
            )}

            {isOwner ? (
              <>
                {item?.isNegotiable === 1 && (
                  <button
                    type="button"
                    onClick={() => {
                      setActiveTab("negotiate");
                      setShowBuyerList(false);
                    }}
                    className={`px-5 py-2 rounded-2xl text-sm font-semibold text-white shadow-sm hover:brightness-105 ${activeTab === "negotiate" ? "bg-purple-700" : "bg-black/80"
                      }`}
                  >
                    NEGOTIATIONS
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => {
                    setShowBuyerList(true);
                    setActiveTab("buyers");
                  }}
                  className={`px-5 py-2 rounded-2xl text-sm font-semibold text-white shadow-sm hover:brightness-105 ${activeTab === "buyers" ? "bg-purple-700" : "bg-black/80"
                    }`}
                >
                  BUYERS
                </button>
              </>
            ) : item?.status === 1 ? (
              // User has already bought - no buttons needed, details will show automatically
              null
            ) : isFree ? (
              <button
                ref={enrollBtnRef}
                type="button"
                onClick={() => setActiveTab("enrollbuy")}
                className={`px-5 py-2 rounded-2xl text-sm font-semibold text-white shadow-sm hover:brightness-105 ${activeTab === "enrollbuy" ? "bg-purple-700" : "bg-black/80"
                  }`}
              >
                ENROLL NOW
              </button>
            ) : (
              <>
                {item?.isNegotiable === 1 && (
                  <button
                    type="button"
                    onClick={() => setActiveTab("negotiate")}
                    className={`px-5 py-2 rounded-2xl text-sm font-semibold text-white shadow-sm hover:brightness-105 ${activeTab === "negotiate" ? "bg-purple-700" : "bg-black/80"
                      }`}
                  >
                    NEGOTIATE
                  </button>
                )}
                <button
                  ref={buyBtnRef}
                  type="button"
                  onClick={() => setActiveTab("enrollbuy")}
                  className={`px-5 py-2 rounded-2xl text-sm font-semibold text-white shadow-sm hover:brightness-105 ${activeTab === "enrollbuy" ? "bg-purple-700" : "bg-black/80"
                    }`}
                >
                  BUY NOW
                </button>
              </>
            )}

          </div>
        </div>

        {/* NEGOTIATE tab */}
        {activeTab === "negotiate" && item?.isNegotiable === 1 && !isFree && (
          <div className="mt-6 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
            <div className="flex items-center justify-between flex-wrap gap-3">
              <div>
                <h3 className="text-xl font-semibold text-purple-800">
                  Negotiation center
                </h3>
                <p className="text-sm text-gray-500">
                  Coordinate a price that works for both tutor and student.
                </p>
              </div>
            </div>

            {(negotiationsError || negotiationMessage) && (
              <div className="mt-4 space-y-2">
                {negotiationsError && (
                  <p className="text-sm text-red-600 bg-red-50 border border-red-100 rounded-xl px-4 py-2">
                    {negotiationsError}
                  </p>
                )}
                {negotiationMessage && (
                  <p className="text-sm text-emerald-600 bg-emerald-50 border border-emerald-100 rounded-xl px-4 py-2">
                    {negotiationMessage}
                  </p>
                )}
              </div>
            )}

            {negotiationsLoading ? (
              <div className="mt-6 rounded-2xl border border-dashed border-purple-200 bg-purple-50/70 p-6 text-center text-purple-700">
                Loading negotiation data…
              </div>
            ) : isOwner ? (
              <div className="mt-6 space-y-4">
                {negotiations.length === 0 ? (
                  <div className="rounded-2xl border border-dashed border-gray-300 bg-gray-50 px-5 py-6 text-center text-gray-600">
                    No students have requested a negotiation yet.
                  </div>
                ) : (
                  negotiations.map((neg) => {
                    const editValue = negotiationEdits[neg.student_id] ?? neg.tutor_offer ?? tutorPrice;
                    const isUpdating = negotiationActionId === `update:${neg.student_id}`;
                    const isDeleting = negotiationActionId === `delete:${neg.student_id}`;
                    const isAccepting = negotiationActionId === `accept:${neg.student_id}`;

                    return (
                      <div
                        key={neg.id ?? neg.student_id}
                        className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm"
                      >
                        <div className="flex flex-wrap items-center justify-between gap-4">
                          <div>
                            <div className="text-base font-semibold text-gray-900">
                              {neg.full_name || `Student #${neg.student_id}`}
                            </div>
                            <div className="text-sm text-gray-500">
                              Last update: {neg.updated_at || "—"}
                            </div>
                          </div>
                          <div className="flex items-center gap-3">
                            <div className="text-sm text-gray-600">
                              Student offer: <span className="font-semibold text-gray-900">৳{fmtBDT(neg.student_offer || 0)}</span>
                            </div>
                            <div className="text-sm text-gray-600">
                              Your last offer: <span className="font-semibold text-gray-900">৳{fmtBDT(neg.tutor_offer || tutorPrice)}</span>
                            </div>
                          </div>
                        </div>

                        <div className="mt-4 grid gap-4 md:grid-cols-[minmax(0,1fr)_auto]">
                          <label className="flex flex-col text-sm text-gray-600">
                            Counter offer (BDT)
                            <input
                              type="number"
                              min="0"
                              value={editValue}
                              onChange={(e) =>
                                setNegotiationEdits((prev) => ({
                                  ...prev,
                                  [neg.student_id]: e.target.value,
                                }))
                              }
                              className="mt-1 w-full rounded-xl border border-gray-300 px-3 py-2 text-base text-gray-900 focus:border-purple-500 focus:ring-2 focus:ring-purple-200"
                            />
                          </label>
                          <div className="flex flex-col md:flex-row md:items-center gap-2 md:justify-end">
                            <button
                              type="button"
                              onClick={() => handleTutorOfferUpdate(neg.student_id)}
                              disabled={isUpdating}
                              className="inline-flex items-center justify-center rounded-xl bg-purple-700 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-purple-800 disabled:cursor-not-allowed disabled:opacity-70"
                            >
                              {isUpdating ? "Sending…" : "Send counter offer"}
                            </button>
                            <button
                              type="button"
                              onClick={() => handleTutorAccept(neg.student_id)}
                              disabled={isAccepting}
                              className="inline-flex items-center justify-center rounded-xl bg-emerald-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-70"
                            >
                              {isAccepting ? "Processing…" : "Accept & enroll"}
                            </button>
                            <button
                              type="button"
                              onClick={() => handleNegotiationDelete(neg.student_id)}
                              disabled={isDeleting}
                              className="inline-flex items-center justify-center rounded-xl border border-red-200 px-4 py-2 text-sm font-semibold text-red-600 hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-70"
                            >
                              {isDeleting ? "Removing…" : "Delete"}
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            ) : (
              <div className="mt-6 space-y-4">
                <div className="rounded-2xl border border-purple-100 bg-purple-50 px-5 py-4 text-sm text-purple-700">
                  Initial course price: <strong>৳{fmtBDT(tutorPrice)}</strong>
                </div>

                <label className="block text-sm font-medium text-gray-700">
                  Your offer (BDT)
                  <input
                    type="number"
                    min="0"
                    value={myPrice}
                    onChange={(e) => setMyPrice(e.target.value)}
                    className="mt-1 w-full rounded-xl border border-gray-300 px-3 py-2 text-base text-gray-900 focus:border-purple-500 focus:ring-2 focus:ring-purple-200"
                  />
                </label>

                {myNegotiation ? (
                  <div className="rounded-2xl border border-gray-200 bg-gray-50 px-5 py-4 text-sm text-gray-700">
                    <div className="flex flex-col gap-1">
                      <span>
                        Your last offer: <strong>৳{fmtBDT(myNegotiation.student_offer || myPrice)}</strong>
                      </span>
                      <span>
                        Tutor counter offer: <strong>৳{fmtBDT(myNegotiation.tutor_offer || tutorPrice)}</strong>
                      </span>
                      <span>Last update: {myNegotiation.updated_at || "—"}</span>
                    </div>
                  </div>
                ) : (
                  <div className="rounded-2xl border border-dashed border-gray-300 bg-white px-5 py-4 text-sm text-gray-600">
                    You haven’t submitted an offer yet. Enter an amount and click
                    “Submit offer”.
                  </div>
                )}

                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
                  <div className="flex flex-wrap gap-3">
                    <button
                      type="button"
                      onClick={handleStudentSubmit}
                      disabled={negotiationActionId === "student:submit"}
                      className="inline-flex items-center justify-center rounded-xl bg-purple-700 px-5 py-2 text-sm font-semibold text-white shadow-sm hover:bg-purple-800 disabled:cursor-not-allowed disabled:opacity-70"
                    >
                      {negotiationActionId === "student:submit" ? "Submitting…" : "Submit offer"}
                    </button>
                    <button
                      type="button"
                      onClick={handleStudentDelete}
                      disabled={!myNegotiation || negotiationActionId === "student:delete"}
                      className="inline-flex items-center justify-center rounded-xl border border-red-200 px-5 py-2 text-sm font-semibold text-red-600 hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-70"
                    >
                      {negotiationActionId === "student:delete" ? "Cancelling…" : "Delete request"}
                    </button>
                  </div>

                  <button
                    type="button"
                    onClick={handleStudentBuy}
                    disabled={!myNegotiation || negotiationActionId === "student:buy"}
                    className="inline-flex items-center justify-center rounded-xl bg-emerald-600 px-5 py-2 text-sm font-semibold text-white shadow-sm hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-70"
                  >
                    {negotiationActionId === "student:buy" ? "Processing…" : "Accept tutor offer"}
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* DETAILS tab */}
        {activeTab === "details" && (
          <div className="mt-6 flex flex-col gap-4">
            <h1 className="text-2xl md:text-3xl font-semibold text-gray-900">
              {title}
            </h1>

            {shortDesc && <p className="text-gray-700">{shortDesc}</p>}

            <div className="flex flex-wrap items-center gap-3 text-sm">
              <span className="flex items-center gap-1 text-gray-700">
                <AiFillStar className="text-yellow-400" />
                <span className="font-medium">{rating}</span>
              </span>
              <span className="text-gray-500">({reviewCount} reviews)</span>
              <button
                type="button"
                onClick={() => setShowMore(true)}
                className="text-black font-bold hover:underline"
              >
                More
              </button>
            </div>

            <div className="flex flex-wrap items-center gap-2 text-sm">
              <span className="text-gray-500">Created by</span>
              <Link 
                to={`/user-profile/${item?.owner_id}`}
                className="font-semibold text-black hover:text-purple-700 hover:underline transition-colors duration-200 cursor-pointer"
              >
                {creator}
              </Link>
            </div>

            <div className="flex items-center justify-between gap-4">
              <span className="inline-flex items-center rounded-xl px-4 py-1 text-md sm:text-lg lg:text-2xl font-semibold shadow-sm text-purple-700 border border-purple-600">
                {isFree ? "Free" : `BDT ${fmtBDT(price)}`}
              </span>

              <div className="flex flex-col items-start gap-3 text-gray-600">
                <div className="flex items-center gap-2">
                  <AiOutlineClockCircle size={18} />{" "}
                  <span>{formatTotal(Number(item?.duration || 0))}</span>
                </div>
                <div className="flex items-center gap-2">
                  <BiHash size={18} /> <span>{String(courseId)}</span>
                </div>
              </div>
            </div>

            {/* Sub-tabs - Hidden since only live tab exists and reviews are removed */}
            {/* <div className="mt-4 flex items-center gap-3 justify-center">
              {(item?.status === 1 || isOwner) && (
                <button
                  type="button"
                  onClick={() => setSubTab("live")}
                  className={`uppercase px-5 py-2 rounded-2xl text-sm font-semibold shadow-sm hover:brightness-105 ${subTab === "live"
                    ? "bg-purple-800 text-white"
                    : "bg-white text-gray-800 border border-gray-300 hover:bg-gray-50"
                    }`}
                >
                  live
                </button>
              )}
            </div> */}

            {/* Content by subTab */}
            {(subTab === "live" && (item?.status === 1 || isOwner)) ? (
              <div className="mt-3 flex flex-col gap-3">
                {loadingLiveClasses ? (
                  <div className="rounded-2xl bg-white border border-gray-200 px-5 py-4 shadow-sm text-center">
                    <p className="text-gray-600">Loading live classes...</p>
                  </div>
                ) : liveClasses.length === 0 ? (
                  <div className="rounded-2xl bg-white border border-gray-200 px-5 py-4 shadow-sm text-center">
                    <p className="text-gray-600">No live classes available</p>
                  </div>
                ) : (
                  liveClasses.map((liveClass) => {

                    const formatDT = (dateStr) => {
                      if (!dateStr) return "-";
                      const [day, month, year] = dateStr.split("-");
                      return `${day}/${month}/${year}`;
                    };

                    const dateText = formatDT(liveClass.create_time);
                    const hasEnded = liveClass.has_ended === 1;
                    const isPaid = liveClass.isPaid === 1;
                    const statusText = hasEnded ? "Ended" : "Live";
                    const statusColor = hasEnded ? "text-gray-500" : "text-red-500";

                    return (
                      <div
                        key={liveClass.id}
                        className="flex items-center justify-between rounded-2xl bg-white border border-gray-200 px-5 py-4 shadow-sm hover:shadow-md transition-shadow"
                      >
                        <div className="flex items-center gap-4">
                          <span className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-[#4F46E5] shadow-sm">
                            <BsPlayFill className="text-white" size={18} />
                          </span>
                          <div className="flex flex-col">
                            <div className="text-xs text-gray-500">{dateText}</div>
                            <div className="text-gray-900 font-medium">
                              {liveClass.title || "Live Class"}
                            </div>
                            {liveClass.description && (
                              <div className="text-xs text-gray-600 mt-1">
                                {liveClass.description}
                              </div>
                            )}
                            {isPaid && (
                              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800 mt-1 w-fit">
                                Paid
                              </span>
                            )}
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <div className={`text-sm font-semibold ${statusColor}`}>
                            {statusText}
                          </div>
                          {!hasEnded && liveClass.url && (
                            <button
                              onClick={() => handleJoinLiveClass(liveClass)}
                              className="px-4 py-2 bg-green-600 text-white text-sm font-semibold rounded-lg hover:bg-green-700 transition-colors"
                            >
                              Join
                            </button>
                          )}
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            ) : null}
          </div>
        )}

        {/* ENROLL / BUY */}
        {activeTab === "enrollbuy" && (
          <div className="mt-6 rounded-2xl border border-gray-200 bg-white p-6 text-center shadow-sm">
            <h3 className="text-xl font-semibold mb-2">
              {isFree ? "Enroll to the course" : "Confirm your purchase"}
            </h3>
            <p className="text-gray-700 mb-6">
              {isFree
                ? "This course is free to join."
                : `Selected price: ৳${fmtBDT(myPrice || price)}`}
            </p>
            <button
              onClick={handleDirectBuy}
              className="px-6 py-2 rounded-2xl text-sm font-semibold text-white shadow-sm hover:brightness-105 bg-pink-600"
            >
              {isFree ? "ENROLL NOW" : "BUY NOW"}
            </button>
          </div>
        )}

        {/* Details modal */}
        {showMore && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            role="dialog"
            aria-modal="true"
          >
            <div
              className="absolute inset-0 bg-black/50"
              onClick={() => setShowMore(false)}
            />
            <div className="relative z-10 w-full max-w-4xl rounded-[28px] bg-[#ece7f0] p-6 sm:p-8">
              <h3 className="text-center text-lg font-semibold text-purple-900">
                Details
              </h3>

              <button
                onClick={() => setShowMore(false)}
                className="absolute right-4 top-4 inline-flex h-8 w-8 items-center justify-center rounded-full bg-red-500 text-white"
                aria-label="Close details"
              >
                ✕
              </button>

              <div className="mt-6 grid grid-cols-2 gap-y-4 px-2 text-gray-700">

                <div className="font-medium">Total Duration</div>
                <div className="text-black font-semibold">{formatTotal(Number(item?.duration || 0))}</div>

                <div className="font-medium">Class</div>
                <div className="text-black font-semibold">{item.class || "-"}</div>

                <div className="font-medium">Buyer Count</div>
                <div className="text-black font-semibold">
                  {item.buyer_count || "0"}
                </div>

                <div className="font-medium">Institute</div>
                <div className="text-black font-semibold">
                  {item.institute || "Not Available"}
                </div>

                <div className="font-medium">Country</div>
                <div className="text-black font-semibold">{item.country || "-"}</div>

                <div className="font-medium">Tags</div>
                <div className="flex flex-wrap gap-2">
                  {(item.tags || []).map((t, i) => (
                    <span
                      key={i}
                      className="inline-block rounded-md bg-purple-600 px-3 py-1 text-white text-sm"
                    >
                      {t}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Edit price modal */}
        {/* Buyer tab content */}
        <Buyers
          subjectId={subjectCode}
          visible={activeTab === "buyers" && showBuyerList}
          refreshKey={negotiationVersion}
        />

        {/* Jitsi Meet Modal */}
        {showJitsiMeet && selectedLiveClass && (
          <div className="fixed inset-0 z-50 bg-black">
            <div className="h-full w-full relative">
              {/* Header with controls */}
              <div className="absolute top-0 left-0 right-0 z-10 bg-black/80 text-white p-4 flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <h3 className="text-lg font-semibold">
                    {selectedLiveClass.title || "Live Class"}
                  </h3>
                  <span className="px-3 py-1 bg-red-600 text-white text-sm rounded-full">
                    LIVE
                  </span>
                </div>
                <button
                  onClick={handleLeaveMeeting}
                  className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-semibold"
                >
                  Leave Meeting
                </button>
              </div>

              {/* Jitsi Meet Component */}
              <div className="h-full pt-16">
                <JitsiMeeting
                  domain="jitsi.riot.im"
                  roomName={selectedLiveClass.url}
                  configOverwrite={{
                    startWithAudioMuted: true,
                    disableModeratorIndicator: false,
                    startScreenSharing: false,
                    enableEmailInStats: false,
                    prejoinPageEnabled: false,
                    disableInviteFunctions: true,
                    addPeopleEnabled: isOwner ? true : false,
                    androidScreenSharingEnabled: isOwner ? true : false,
                    audioMuteButtonEnabled: isOwner ? true : false,
                    closeCaptionsEnabled: isOwner ? true : false,
                    breakoutRoomsButtonEnabled: isOwner ? true : false,
                    chatEnabled: true,
                    carModeEnabled: true,
                    fullScreenEnabled: true,
                    inviteEnabled: false,
                    kickOutEnabled: isOwner ? true : false,
                    liveStreamingEnabled: isOwner ? true : false,
                    lobbyModeEnabled: isOwner ? true : false,
                    reactionsEnabled: true,
                    recordingEnabled: isOwner ? true : false,
                    resolution: 360,
                    settingsEnabled: isOwner ? true : false,
                    videoMuteButtonEnabled: true,
                    videoShareButtonEnabled: isOwner ? true : false,
                    welcomePageEnabled: false,
                  }}
                  interfaceConfigOverwrite={{
                    DISABLE_JOIN_LEAVE_NOTIFICATIONS: true,
                    SHOW_JITSI_WATERMARK: false,
                    SHOW_WATERMARK_FOR_GUESTS: false,
                    MOBILE_APP_PROMO: false,
                    TILE_VIEW_MAX_COLUMNS: 4,
                  }}
                  userInfo={{
                    displayName: getUserDisplayName(),
                  }}
                  onApiReady={(externalApi) => {
                    // Handle API ready
                    console.log("Jitsi Meet API ready");

                    // Listen for conference events
                    externalApi.addEventListeners({
                      readyToClose: handleLeaveMeeting,
                      participantLeft: (participant) => {
                        console.log("Participant left:", participant);
                      },
                      participantJoined: (participant) => {
                        console.log("Participant joined:", participant);
                      },
                    });
                  }}
                  getIFrameRef={(iframeRef) => {
                    if (iframeRef) {
                      iframeRef.style.height = "100%";
                      iframeRef.style.width = "100%";
                    }
                  }}
                />
              </div>
            </div>
          </div>
        )}




      </div>
    </div>
  );
};

export default DetailsLive;
