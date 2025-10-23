import React, { useState, useEffect } from "react";
import { Base_url } from "../../Config/Api";
import defaultAvatar from "../../Images/pfp.png";
import { toast } from "react-toastify";

const Solution = ({ subjectId, isOwner }) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [uploading, setUploading] = useState(false);

  // Delete file handler for owner
  const handleDeleteFile = async (fileUrl) => {
    try {
      const authData = JSON.parse(localStorage.getItem("auth") || "{}");
      const userToken = authData?.user?.token;

      if (!userToken) {
        toast.error("Authentication required to delete file.");
        return;
      }

      const url = `${Base_url}deleteSolution?subject_id=${encodeURIComponent(subjectId)}&fileUrl=${encodeURIComponent(fileUrl)}`;

      const response = await fetch(url, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${userToken}`,
        },
      });

      if (!response.ok) {
        throw new Error(`Failed to delete file. Status: ${response.status}`);
      }

      const json = await response.json().catch(() => ({}));
      toast.success(json.message || "File deleted successfully.");

      // Refresh or update state to reflect deletion
      window.location.reload();

    } catch (error) {
      toast.error(error.message || "Error deleting file.");
    }
  };

  // Student form states
  const [description, setDescription] = useState("");
  const [imageFiles, setImageFiles] = useState([]);
  const [pdfFiles, setPdfFiles] = useState([]);
  const [includeFiles, setIncludeFiles] = useState(false);

  // Owner view states
  const [solutionPersons, setSolutionPersons] = useState([]);
  const [selectedPerson, setSelectedPerson] = useState(null);
  const [individualSolution, setIndividualSolution] = useState([]);
  const [showRatingModal, setShowRatingModal] = useState(false);
  const [ratingDetails, setRatingDetails] = useState("");
  const [ratingValue, setRatingValue] = useState(0);
  const [ratingPrevious, setRatingPrevious] = useState(0);
  const [ratingLoading, setRatingLoading] = useState(false);
  const [showImageModal, setShowImageModal] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);

  const makeImageUrl = (path) => {
    if (!path) return "";
    if (/^https?:\/\//i.test(path)) return path;
    const base = (Base_url || "").replace(/\/+$/, "");
    const origin = base.replace(/\/api$/i, "");
    const normalizedPath = path.replace(/^\/+/, "");
    return origin ? `${origin}/${normalizedPath}` : normalizedPath;
  };

  const handleImageClick = (imageUrl) => {
    setSelectedImage(imageUrl);
    setShowImageModal(true);
  };

  useEffect(() => {
    if (!subjectId) return;

    if (isOwner) {
      // Fetch solution submitters
      const fetchSolutionPersons = async () => {
        try {
          setLoading(true);
          setError("");

          const authData = JSON.parse(localStorage.getItem("auth") || "{}");
          const userToken = authData?.user?.token;

          if (!userToken) {
            throw new Error("Authentication required");
          }

          const response = await fetch(`${Base_url}getProblemSolutionPersons?subject_id=${encodeURIComponent(subjectId)}`, {
            headers: {
              Accept: "application/json",
              Authorization: `Bearer ${userToken}`,
            },
          });

          if (!response.ok) {
            throw new Error("Failed to fetch solution submitters");
          }

          const data = await response.json();
          setSolutionPersons(data?.data || []);
        } catch (err) {
          console.error("Error fetching solution persons:", err);
          setError(err.message || "Failed to load solution submitters");
        } finally {
          setLoading(false);
        }
      };

      fetchSolutionPersons();
    } else {
      // Student view - no initial fetch needed
      setLoading(false);
    }
  }, [subjectId, isOwner]);

  const fetchIndividualSolution = async (ownerId) => {
    try {
      const authData = JSON.parse(localStorage.getItem("auth") || "{}");
      const userToken = authData?.user?.token;

      if (!userToken) {
        throw new Error("Authentication required");
      }

      const response = await fetch(`${Base_url}getIndividualProblemSolution?subject_id=${encodeURIComponent(subjectId)}&owner_id=${ownerId}`, {
        headers: {
          Accept: "application/json",
          Authorization: `Bearer ${userToken}`,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch individual solution");
      }

      const data = await response.json();
      return data?.data || [];
    } catch (err) {
      console.error("Error fetching individual solution:", err);
      throw err;
    }
  };

  const handlePersonClick = async (person) => {
    try {
      setSelectedPerson(person);
      const solution = await fetchIndividualSolution(person.owner_id);
      setIndividualSolution(solution);
      setShowRatingModal(true);
      setRatingDetails("");
      setRatingValue(0);
      setRatingPrevious(0); // You might want to fetch existing rating here
    } catch (err) {
      alert("Failed to load solution: " + err.message);
    }
  };

  const handleRatingSubmit = async (e) => {
    e.preventDefault();

    if (!ratingValue || !selectedPerson) return;

    try {
      setRatingLoading(true);

      const authData = JSON.parse(localStorage.getItem("auth") || "{}");
      const userToken = authData?.user?.token;

      if (!userToken) {
        throw new Error("Authentication required");
      }

      const formData = new FormData();
      formData.append("subject_id", subjectId);
      formData.append("details", ratingDetails.trim());
      formData.append("rating", ratingValue.toString());
      formData.append("ratingPrevious", ratingPrevious.toString());
      formData.append("user_id", selectedPerson.owner_id.toString());

      const response = await fetch(`${Base_url}addUpdateRating`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${userToken}`,
        },
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || "Failed to submit rating");
      }

      alert("Rating submitted successfully!");
      setShowRatingModal(false);
      setSelectedPerson(null);
      setIndividualSolution([]);
    } catch (err) {
      console.error("Error submitting rating:", err);
      alert("Failed to submit rating: " + err.message);
    } finally {
      setRatingLoading(false);
    }
  };

  // Student form handlers
  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    setImageFiles(prev => [...prev, ...files]);
  };

  const handlePdfChange = (e) => {
    const files = Array.from(e.target.files);
    setPdfFiles(prev => [...prev, ...files]);
  };

  const removeImage = (index) => {
    setImageFiles(prev => prev.filter((_, i) => i !== index));
  };

  const removePdf = (index) => {
    setPdfFiles(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!description.trim() && !includeFiles) {
      setError("Please provide a description or choose to include files");
      return;
    }

    if (includeFiles && imageFiles.length === 0 && pdfFiles.length === 0 && !description.trim()) {
      setError("Please add at least one file or description");
      return;
    }

    try {
      setUploading(true);
      setError("");

      const authData = JSON.parse(localStorage.getItem("auth") || "{}");
      const userToken = authData?.user?.token;

      if (!userToken) {
        throw new Error("Authentication required");
      }

      const formData = new FormData();
      formData.append("subject_id", subjectId);
      formData.append("hasOnlyInsertFiles", includeFiles ? "1" : "0");

      if (description.trim()) {
        formData.append("description", description.trim());
      }

      // Add image files only if includeFiles is true
      if (includeFiles) {
        imageFiles.forEach(file => {
          formData.append("imageFileList[]", file);
        });

        // Add PDF files only if includeFiles is true
        pdfFiles.forEach(file => {
          formData.append("pdfFileList[]", file);
        });
      }

      const response = await fetch(`${Base_url}insertSolution`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${userToken}`,
        },
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `HTTP ${response.status}`);
      }

      // Reset form
      setDescription("");
      setImageFiles([]);
      setPdfFiles([]);
      setIncludeFiles(false);

      // Show success message
      alert("Solution submitted successfully!");

      // Optionally refresh the page or update state
      window.location.reload();

    } catch (err) {
      console.error("Error submitting solution:", err);
      setError(err.message || "Failed to submit solution");
    } finally {
      setUploading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-4">
        <div className="text-gray-600">Loading solution...</div>
      </div>
    );
  }

  if (error && isOwner) {
    return (
      <div className="p-4 text-red-600 bg-red-50 border border-red-200 rounded-xl">
        {error}
      </div>
    );
  }

  // Owner view - show solution submitters list
  if (isOwner) {
    return (
      <div className="mt-4">
        <div className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Student Solutions</h3>

          {solutionPersons.length === 0 ? (
            <p className="text-gray-600">No students have submitted solutions yet.</p>
          ) : (
            <div className="space-y-3">
              {solutionPersons.map((person) => (
                <div
                  key={person.id}
                  className="flex items-center gap-4 p-3 border border-gray-200 rounded-xl cursor-pointer hover:bg-gray-50"
                  onClick={() => handlePersonClick(person)}
                >
                  <img
                    src={makeImageUrl(person.picture) || defaultAvatar}
                    alt={person.full_name}
                    className="w-12 h-12 rounded-full object-cover"
                    onError={(e) => { e.target.src = defaultAvatar; }}
                  />
                  <div className="flex-1">
                    <h4 className="font-semibold text-gray-900">{person.full_name}</h4>
                    <p className="text-sm text-gray-600 truncate">{person.description}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Rating Modal */}
        {showRatingModal && selectedPerson && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/50" onClick={() => setShowRatingModal(false)} />
            <div className="relative z-10 w-full max-w-4xl rounded-2xl bg-white p-6 max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">
                  Solution by {selectedPerson.full_name}
                </h3>
                <button
                  onClick={() => setShowRatingModal(false)}
                  className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-red-500 text-white"
                >
                  ✕
                </button>
              </div>

              {/* Solution Files */}
              <div className="mb-6">
                <h4 className="text-md font-semibold text-gray-900 mb-3">Submitted Files</h4>
                {individualSolution.length === 0 ? (
                  <p className="text-gray-600">No files submitted.</p>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                    {individualSolution.map((file, index) => (
                      <div key={index} className="border border-gray-200 rounded-xl p-3 relative">
                        {file.has_image === 1 ? (
                          <img
                            src={makeImageUrl(file.url)}
                            alt={`Solution file ${index + 1}`}
                            className="w-full h-32 object-cover rounded-lg cursor-pointer hover:opacity-80 transition-opacity"
                            onClick={() => handleImageClick(makeImageUrl(file.url))}
                            onError={(e) => { e.target.style.display = 'none'; }}
                          />
                        ) : (
                          <div className="w-full h-32 bg-gray-100 rounded-lg flex items-center justify-center">
                            <a
                              href={makeImageUrl(file.url)}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-blue-600 hover:text-blue-800 font-medium"
                            >
                              View PDF
                            </a>
                          </div>
                        )}
                        <p className="text-xs text-gray-500 mt-2">
                          {new Date(file.updated_at).toLocaleDateString()}
                        </p>
                        {isOwner && (
                          <button
                            type="button"
                            onClick={() => handleDeleteFile(file.url)}
                            className="absolute top-2 right-2 bg-red-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs hover:bg-red-700"
                            title="Delete File"
                          >
                            ×
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Rating Form */}
              <form onSubmit={handleRatingSubmit} className="border-t pt-6">
                <h4 className="text-md font-semibold text-gray-900 mb-4">Add Rating</h4>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Rating (1-5)
                    </label>
                    <div className="flex gap-1">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          type="button"
                          onClick={() => setRatingValue(star)}
                          className={`w-8 h-8 ${star <= ratingValue ? 'text-yellow-400' : 'text-gray-300'}`}
                        >
                          ★
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label htmlFor="ratingDetails" className="block text-sm font-medium text-gray-700 mb-2">
                      Feedback (Optional)
                    </label>
                    <textarea
                      id="ratingDetails"
                      value={ratingDetails}
                      onChange={(e) => setRatingDetails(e.target.value)}
                      rows={3}
                      className="w-full rounded-xl border border-gray-300 px-3 py-2 focus:border-purple-500 focus:ring-2 focus:ring-purple-200"
                      placeholder="Provide feedback on the solution..."
                    />
                  </div>

                  <div className="flex justify-end gap-3">
                    <button
                      type="button"
                      onClick={() => setShowRatingModal(false)}
                      className="px-4 py-2 text-gray-600 hover:text-gray-800"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={ratingLoading || !ratingValue}
                      className="px-6 py-2 bg-purple-600 text-white rounded-xl font-semibold hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {ratingLoading ? "Submitting..." : "Submit Rating"}
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Image Zoom Modal */}
        {showImageModal && selectedImage && (
          <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/80" onClick={() => setShowImageModal(false)} />
            <div className="relative z-10 max-w-4xl max-h-[90vh] p-4">
              <button
                onClick={() => setShowImageModal(false)}
                className="absolute -top-12 right-0 inline-flex h-8 w-8 items-center justify-center rounded-full bg-white text-black hover:bg-gray-200"
              >
                ✕
              </button>
              <img
                src={selectedImage}
                alt="Zoomed solution"
                className="w-full h-full object-contain rounded-lg"
                onClick={(e) => e.stopPropagation()}
              />
            </div>
          </div>
        )}
      </div>
    );
  }

  // Student view - insert solution form
  return (
    <div className="mt-4">
      <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Submit Your Solution</h3>

        {error && (
          <div className="mb-4 p-3 text-red-600 bg-red-50 border border-red-200 rounded-xl">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Description field - always shown */}
          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
              Description *
            </label>
            <textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={4}
              className="w-full rounded-xl border border-gray-300 px-3 py-2 focus:border-purple-500 focus:ring-2 focus:ring-purple-200"
              placeholder="Describe your solution approach..."
              required={!includeFiles}
            />
          </div>

          {/* Include files toggle */}
          <div className="flex items-center space-x-3">
            <input
              type="checkbox"
              id="includeFiles"
              checked={includeFiles}
              onChange={(e) => setIncludeFiles(e.target.checked)}
              className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded"
            />
            <label htmlFor="includeFiles" className="text-sm text-gray-700">
              Include files (images and PDFs)
            </label>
          </div>

          {/* File upload sections - only shown when includeFiles is true */}
          {includeFiles && (
            <>
              {/* Image upload */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Solution Images
                </label>
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={handleImageChange}
                  className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-purple-50 file:text-purple-700 hover:file:bg-purple-100"
                />

                {/* Image previews */}
                {imageFiles.length > 0 && (
                  <div className="mt-3 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                    {imageFiles.map((file, index) => (
                      <div key={index} className="relative">
                        <img
                          src={URL.createObjectURL(file)}
                          alt={`Preview ${index + 1}`}
                          className="w-full h-24 object-cover rounded-lg border"
                        />
                        <button
                          type="button"
                          onClick={() => removeImage(index)}
                          className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center text-xs hover:bg-red-600"
                        >
                          ×
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* PDF upload */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Solution Documents (PDF)
                </label>
                <input
                  type="file"
                  multiple
                  accept=".pdf"
                  onChange={handlePdfChange}
                  className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-purple-50 file:text-purple-700 hover:file:bg-purple-100"
                />

                {/* PDF list */}
                {pdfFiles.length > 0 && (
                  <div className="mt-3 space-y-2">
                    {pdfFiles.map((file, index) => (
                      <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded-lg">
                        <span className="text-sm text-gray-700 truncate">{file.name}</span>
                        <button
                          type="button"
                          onClick={() => removePdf(index)}
                          className="w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center text-xs hover:bg-red-600 ml-2"
                        >
                          ×
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </>
          )}

          {/* Submit button */}
          <div className="flex justify-end">
            <button
              type="submit"
              disabled={uploading}
              className="px-6 py-2 bg-purple-600 text-white rounded-xl font-semibold hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {uploading ? "Submitting..." : "Submit Solution"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Solution;
