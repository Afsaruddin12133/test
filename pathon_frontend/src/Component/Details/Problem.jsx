import React, { useState, useEffect } from "react";
import { Base_url } from "../../Config/Api";
import { toast } from "react-toastify";

const resolveAuthToken = () => {
  const auth = JSON.parse(localStorage.getItem("auth") || "{}");
  return (
    auth?.token ||
    auth?.accessToken ||
    auth?.user?.token ||
    auth?.data?.token ||
    ""
  );
};

const Problem = ({ subjectId, onSolverData, isOwner }) => {
  const [problemData, setProblemData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedImage, setSelectedImage] = useState(null);

  // Handler to close problem solving (only owner)
  const handleCloseProblemSolving = async () => {
    try {
      const token = resolveAuthToken();
      if (!token) {
        toast.error("Authentication required to close problem solving.");
        return;
      }
      const url = `${Base_url}closeProblemSolving?subject_id=${encodeURIComponent(subjectId)}`;
      const res = await fetch(url, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (!res.ok) {
        throw new Error(`Failed to close problem solving. Status: ${res.status}`);
      }
      const json = await res.json().catch(() => ({}));
      toast.success(json.message || "Problem solving closed successfully.");
    } catch (error) {
      toast.error(error.message || "Error closing problem solving.");
    }
  };

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

        // Pass solver data to parent component
        if (data?.details && onSolverData) {
          onSolverData(data.details);
        }
      } catch (err) {
        console.error("Error fetching problem details:", err);
        setError(err.message || "Failed to load problem details");
      } finally {
        setLoading(false);
      }
    };

    fetchProblemDetails();
  }, [subjectId, onSolverData]);

  const openImageModal = (imageUrl) => {
    setSelectedImage(imageUrl);
  };

  const closeImageModal = () => {
    setSelectedImage(null);
  };

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

  const { problemItemsImages = [], problemItemsPdf = [], details } = problemData;

  return (
    <>
      <div className="space-y-6">
        {isOwner && (
          <div className="flex justify-end">
            <button
              type="button"
              onClick={details?.isClose === 0 ? handleCloseProblemSolving : undefined}
              disabled={details?.isClose === 1}
              className={`px-5 py-2 rounded-2xl text-sm font-semibold shadow-sm ${
                details?.isClose === 0
                  ? "bg-red-600 text-white hover:bg-red-700"
                  : "bg-gray-400 text-gray-700 cursor-not-allowed"
              }`}
            >
              {details?.isClose === 0 ? "Close Problem Solving" : "Already Closed"}
            </button>
          </div>
        )}


        {/* Problem Images */}
        {problemItemsImages.length > 0 && (
          <div>
            <h4 className="text-md font-semibold text-gray-900 mb-3">Problem Images</h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {problemItemsImages.map((item, index) => (
                <div
                  key={item.id || index}
                  className="border border-gray-200 rounded-xl overflow-hidden bg-white shadow-sm cursor-pointer hover:shadow-md transition-shadow"
                  onClick={() => openImageModal(`https://apidocumentationpathon.pathon.app/${item.url}`)}
                >
                  <img
                    src={`https://apidocumentationpathon.pathon.app/${item.url}`}
                    alt={`Problem image ${index + 1}`}
                    className="w-full h-48 object-cover"
                    onError={(e) => {
                      e.target.src = "/src/Images/placeholder.jpg"; // fallback image
                    }}
                  />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Problem PDFs */}
        {problemItemsPdf.length > 0 && (
          <div>
            <h4 className="text-md font-semibold text-gray-900 mb-3">Problem Documents</h4>
            <div className="space-y-2">
              {problemItemsPdf.map((item, index) => (
                <div key={item.id || index} className="flex items-center p-3 border border-gray-200 rounded-xl bg-white shadow-sm">
                  <div className="flex-1">
                    <div className="text-sm font-medium text-gray-900">
                      Document {index + 1}
                    </div>
                    <div className="text-xs text-gray-500">
                      {item.updated_at ? new Date(item.updated_at).toLocaleDateString() : ""}
                    </div>
                  </div>
                  <a
                    href={`https://apidocumentationpathon.pathon.app/${item.url}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center px-3 py-1 text-sm font-medium text-purple-700 bg-purple-100 rounded-lg hover:bg-purple-200 transition-colors"
                  >
                    View PDF
                  </a>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* If no images or PDFs */}
        {problemItemsImages.length === 0 && problemItemsPdf.length === 0 && (
          <div className="text-center p-6 text-gray-500">
            No problem files available.
          </div>
        )}
      </div>

      {/* Full Screen Image Modal */}
      {selectedImage && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-75"
          onClick={closeImageModal}
        >
          <div className="relative max-w-4xl max-h-full p-4">
            <button
              onClick={closeImageModal}
              className="absolute top-2 right-2 z-10 w-8 h-8 bg-white rounded-full flex items-center justify-center text-gray-800 hover:bg-gray-100 transition-colors"
              aria-label="Close"
            >
              ✕
            </button>
            <img
              src={selectedImage}
              alt="Full screen problem image"
              className="max-w-full max-h-full object-contain rounded-lg"
              onClick={(e) => e.stopPropagation()}
            />
          </div>
        </div>
      )}
    </>
  );
};

export default Problem;
