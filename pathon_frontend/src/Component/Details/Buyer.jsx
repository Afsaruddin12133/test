import React, { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";

import { Base_url } from "../../Config/Api";

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

const Buyers = ({ subjectId, visible, refreshKey = 0 }) => {
  const [buyers, setBuyers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const formattedSubjectId = useMemo(() => subjectId || "", [subjectId]);

  useEffect(() => {
    if (!visible) return;
    if (!formattedSubjectId) {
      setBuyers([]);
      return;
    }

    let isMounted = true;
    const controller = new AbortController();

    const token = resolveAuthToken();
    if (!token) {
      setError("Authentication required.");
      setLoading(false);
      setBuyers([]);
      return () => {
        controller.abort();
      };
    }

    setLoading(true);
    setError("");

    (async () => {
      try {
        const url = `${Base_url}courseAllBuyers?subject_id=${encodeURIComponent(
          formattedSubjectId
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
            setBuyers([]);
          }
          return;
        }

        if (!res.ok) {
          throw new Error(`HTTP ${res.status}`);
        }

        const json = await res.json();
        const list = Array.isArray(json?.data) ? json.data : [];
        if (isMounted) {
          setBuyers(list);
        }
      } catch (err) {
        if (err.name === "AbortError") return;
        if (isMounted) {
          console.error("Failed to load buyers", err);
          setError(err.message || "Unable to load buyers.");
          setBuyers([]);
        }
      } finally {
        if (isMounted) setLoading(false);
      }
    })();

    return () => {
      isMounted = false;
      controller.abort();
    };
  }, [formattedSubjectId, visible, refreshKey]);

  if (!visible) return null;

  if (!formattedSubjectId) {
    return (
      <div className="mt-6 rounded-2xl border border-gray-200 bg-white p-6 text-gray-600">
        No subject selected.
      </div>
    );
  }

  return (
    <div className="mt-6">
      {error && (
        <p className="mb-4 rounded-2xl border border-red-100 bg-red-50 px-4 py-2 text-sm text-red-600">
          {error}
        </p>
      )}

      {loading ? (
        <div className="rounded-2xl border border-dashed border-purple-200 bg-purple-50 px-5 py-4 text-center text-purple-700">
          Loading buyers…
        </div>
      ) : buyers.length === 0 ? (
        <div className="rounded-2xl border border-gray-200 bg-white p-6 text-gray-700">
          No buyers yet.
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {buyers.map((buyer) => {
            const dateText = buyer?.created_at
              ? new Date(buyer.created_at).toLocaleString()
              : "—";

            const rawStudentId = buyer?.student_id;
            const studentId =
              rawStudentId != null && String(rawStudentId).trim() !== ""
                ? String(rawStudentId).trim()
                : "";

            return (
              <div
                key={`${buyer.id}-${buyer.student_id}`}
                className="flex items-center justify-between rounded-2xl border border-gray-200 bg-white p-4 shadow-sm"
              >
                <div className="flex flex-col">
                  <span className="font-semibold text-gray-900">
                    {buyer?.full_name || "Unknown Buyer"}
                  </span>
                  <span className="text-sm text-gray-600">
                    Student ID: {studentId ? (
                      <Link
                        to={{
                          pathname: "/user-profile",
                          search: `?user_id=${encodeURIComponent(studentId)}`,
                        }}
                        className="text-purple-600 hover:text-purple-700 hover:underline font-semibold"
                      >
                        {studentId}
                      </Link>
                    ) : (
                      "—"
                    )}
                  </span>
                  <span className="text-sm text-gray-500">{dateText}</span>
                </div>
                <div className="text-right">
                  <span className="block text-sm text-gray-500">Paid</span>
                  <span className="text-lg font-semibold text-purple-700">
                    ৳{Number(buyer?.paid || 0).toLocaleString("en-US")}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default Buyers;