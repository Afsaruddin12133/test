import React from "react";
import { AiFillStar } from "react-icons/ai";
import { Link } from "react-router-dom";

const Reviews = ({
  reviews,
  currentUser,
  ratingFilter,
  setRatingFilter,
  reviewOpen,
  setReviewOpen,
  reviewText,
  setReviewText,
  reviewRating,
  setReviewRating,
  reviewsLoading,
  reviewsError,
  submitReview,
  fetchReviews,
  courseId,
  resolveImageURL,
  isOwner = false,
  hasPurchased = false,
  hasGivenFeedback = false,
}) => {
  // Show button only if:
  // 1. NOT the owner
  // 2. Student has purchased the course
  // 3. Student hasn't given feedback yet
  const canWriteReview = !isOwner && hasPurchased && !hasGivenFeedback;

  return (
    <>
      <div className="mt-4">
        <h3 className="text-lg font-semibold text-gray-900 mb-3">
          Student feedback
        </h3>

        {/* Filter buttons */}
        <div className="mb-4 flex flex-wrap gap-2">
          <button
            onClick={() => setRatingFilter(null)}
            className={`px-3 py-1.5 rounded-xl text-sm font-semibold border ${
              ratingFilter === null
                ? "bg-purple-600 text-white border-purple-600"
                : "bg-white text-gray-800 border border-gray-300 hover:bg-gray-50"
            }`}
          >
            All Reviews
          </button>
          {[5, 4, 3, 2, 1].map((s) => (
            <button
              key={s}
              onClick={() => setRatingFilter(s)}
              className={`px-3 py-1.5 rounded-xl text-sm font-semibold border ${
                ratingFilter === s
                  ? "bg-purple-600 text-white border-purple-600"
                  : "bg-white text-gray-800 border border-gray-300 hover:bg-gray-50"
              }`}
              title={`Show ${s}-star reviews`}
            >
              {s} ★
            </button>
          ))}
        </div>

        {reviewsLoading ? (
          <div className="rounded-2xl border border-gray-200 bg-white p-6 text-center text-gray-600">
            Loading reviews...
          </div>
        ) : reviewsError ? (
          <div className="rounded-2xl border border-red-200 bg-red-50 p-6 text-red-600">
            {reviewsError}
          </div>
        ) : (() => {
          const visible = reviews.filter((r) =>
            ratingFilter ? Number(r?.rating) === Number(ratingFilter) : true
          );

          if (visible.length === 0) {
            return (
              <div className="rounded-2xl border border-gray-200 bg-white p-6 text-gray-600">
                No reviews found{ratingFilter ? ` for ${ratingFilter}★` : ""}.
              </div>
            );
          }

          return (
            <div className="flex flex-col gap-3">
              {visible.map((r, i) => {
                const displayTime = r?.update_at
                  ? new Date(r.update_at).toLocaleDateString()
                  : "";
                const comment = r?.title; // API returns 'title' as the comment

                return (
                  <div
                    key={r.id || i}
                    className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        {r?.picture ? (
                          <img
                            src={resolveImageURL(r.picture)}
                            alt={r.full_name || "User"}
                            className="w-10 h-10 rounded-full object-cover"
                          />
                        ) : (
                          <div className="w-10 h-10 rounded-full bg-gray-300 flex items-center justify-center">
                            <span className="text-gray-600 font-semibold text-sm">
                              {(r?.full_name || "A").charAt(0).toUpperCase()}
                            </span>
                          </div>
                        )}
                        <div>
                          <Link 
                            to={`/user-profile/${r?.student_id}`}
                            className="font-semibold text-gray-900 hover:text-blue-600 hover:underline transition-colors"
                          >
                            {r?.full_name || "Anonymous"}
                          </Link>
                          <div className="text-gray-500 text-sm">{displayTime}</div>
                        </div>
                      </div>
                      <div className="flex items-center gap-1 text-yellow-500">
                        {Array.from({ length: 5 }).map((_, j) => (
                          <AiFillStar
                            key={j}
                            className={
                              j < Number(r?.rating || 0) ? "opacity-100" : "opacity-25"
                            }
                          />
                        ))}
                        <span className="text-gray-600 text-sm ml-1">
                          ({r?.rating || 0})
                        </span>
                      </div>
                    </div>

                    {comment && <p className="text-gray-700 mt-3">{comment}</p>}
                  </div>
                );
              })}
            </div>
          );
        })()}

        {/* Show write review button only if user is not owner, has purchased, and hasn't given feedback */}
        {canWriteReview && (
          <div className="mt-4">
            <button
              onClick={() => setReviewOpen(true)}
              className="inline-flex items-center gap-2 rounded-2xl bg-purple-800 px-4 py-2 text-white font-semibold shadow-sm hover:brightness-105"
            >
              + Write a review
            </button>
          </div>
        )}
      </div>

      {/* Review modal */}
      {reviewOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/50" onClick={() => setReviewOpen(false)} />
          <div className="relative z-10 w-full max-w-lg rounded-2xl bg-white p-6">
            <div className="flex items-start justify-between">
              <div>
                <div className="font-semibold text-gray-900">{currentUser}</div>
                <p className="text-sm text-gray-500">
                  Reviews are public and include your account info.
                </p>
              </div>
              <button
                onClick={() => setReviewOpen(false)}
                className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-red-500 text-white"
                aria-label="Close review"
              >
                ✕
              </button>
            </div>

            <div className="mt-4">
              <div className="text-sm font-semibold text-gray-900 mb-1">Your Ratings</div>
              <div className="flex items-center gap-1">
                {Array.from({ length: 5 }).map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setReviewRating(i + 1)}
                    className="p-1"
                    title={`${i + 1} star${i ? "s" : ""}`}
                  >
                    <AiFillStar
                      className={i < reviewRating ? "text-yellow-500" : "text-gray-300"}
                      size={22}
                    />
                  </button>
                ))}
              </div>
            </div>

            <textarea
              placeholder="Describe your experience (optional)"
              className="mt-4 w-full rounded-xl border border-gray-300 p-3 focus:outline-none focus:ring-2 focus:ring-blue-600"
              rows={4}
              value={reviewText}
              onChange={(e) => setReviewText(e.target.value)}
            />

            <div className="mt-4 text-right">
              <button
                onClick={async () => {
                  if (!reviewRating) return;

                  try {
                    await submitReview(
                      courseId,
                      reviewText.trim(),
                      reviewRating
                    );
                    // Refresh reviews after successful submission
                    await fetchReviews(courseId, ratingFilter);
                    setReviewOpen(false);
                    setReviewText("");
                    setReviewRating(0);
                  } catch (err) {
                    alert("Failed to submit review: " + err.message);
                  }
                }}
                className="px-6 py-2 rounded-2xl bg-purple-800 text-white font-semibold shadow-sm hover:brightness-105"
              >
                Submit
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Reviews;
