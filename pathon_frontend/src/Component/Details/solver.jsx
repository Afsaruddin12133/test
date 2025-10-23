import React, { useState, useEffect } from "react";
import { Base_url } from "../../Config/Api";

const Solver = ({ subjectId }) => {
  const [problemData, setProblemData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!subjectId) return;

    const fetchProblemDetails = async () => {
      try {
        setLoading(true);
        setError("");

        const authData = JSON.parse(localStorage.getItem("auth") || "{}");
        const userToken = authData?.user?.token;

        if (!userToken) {
          throw new Error("Authentication required");
        }

        const url = `${Base_url}getProblemDetails?subject_id=${encodeURIComponent(subjectId)}`;

        const response = await fetch(url, {
          method: "GET",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            Authorization: `Bearer ${userToken}`,
          },
        });
        console.log("Problem fetch response:", response);
        

        if (!response.ok) {
          if (response.status === 401) {
            localStorage.removeItem("auth");
            throw new Error("Session expired. Please login again.");
          }
          throw new Error(`HTTP ${response.status}`);
        }

        const data = await response.json();
        setProblemData(data);

       
      } catch (err) {
        console.error("Error fetching problem details:", err);
        setError(err.message || "Failed to load problem details");
      } finally {
        setLoading(false);
      }
    };

    fetchProblemDetails();
  }, [subjectId]);

 
  if (loading) {
    return (
      <div className="flex items-center justify-center p-4">
        <div className="text-gray-600">Loading problem details...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 text-red-600 bg-red-50 border border-red-200 rounded-xl">
        {error}
      </div>
    );
  }

  if (!problemData) {
    return (
      <div className="p-4 text-gray-600">
        No problem details available.
      </div>
    );
  }

  const { details } = problemData;

  return (
    <>
      <div className="space-y-6">
        {/* Solver Details */}
        {details && (
          <div className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm">
            <h4 className="text-lg font-semibold text-gray-900 mb-4">Solver Details</h4>
            <div className="flex flex-col md:flex-row gap-4 items-start">
              {details.picture ? (
                <img
                  src={`https://apidocumentationpathon.pathon.app/${details.picture.replace(/^\/+/, "")}`}
                  alt={details.full_name}
                  className="w-20 h-20 rounded-full object-cover"
                  onError={(e) => {
                    e.target.style.display = "none";
                  }}
                />
              ) : (
                <div className="w-20 h-20 rounded-full bg-gray-200 flex items-center justify-center text-gray-500">
                  {details.full_name ? details.full_name.charAt(0).toUpperCase() : "?"}
                </div>
              )}
              <div className="flex-1">
                <p className="text-gray-900 font-medium">{details?.full_name }</p>
                {details.rating && (
                  <div className="mt-2 flex items-center gap-1">
                    <span className="text-yellow-500">★</span>
                    <span className="text-gray-700">{details.rating}</span>
                  </div>
                )}
                {details.rating_message && (
                  <p className="mt-2 text-gray-600 text-sm italic">"{details.rating_message}"</p>
                )}
                <div className="mt-2 text-xs text-gray-500">
                  <p>Subject ID: {details.subject_id}</p>
                  <p>Status: {details.isClose === 0 ? "Open" : "Closed"}</p>
                </div>
              </div>
            </div>
          </div>
        )}

  
      </div>

    </>
  );
};

export default Solver;
