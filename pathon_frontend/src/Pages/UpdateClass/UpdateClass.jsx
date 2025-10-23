import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Base_url } from "../../Config/Api";


const getToken = () => {
  try {
    const auth = JSON.parse(localStorage.getItem("auth") || "{}");
    return auth?.user?.token || null;
  } catch {
    return null;
  }
};

const UpdateClass = () => {
  const { subject_id } = useParams();
  const navigate = useNavigate();

  // Tab state
  const [activeTab, setActiveTab] = useState("details");

  // Loading states
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Class details form state
  const [classDetails, setClassDetails] = useState({
    title: "",
    description: "",
    isPrivate: "0",
    price: "0",
    isNegotiable: "0",
    tagList: "",
    class: "",
    institute: "",
    country: "",
    type: "2",
  });

  // Get item ID from URL parameters
  const urlParams = new URLSearchParams(window.location.search);
  const classItemId = urlParams.get('itemId') || null;
  
  // Live status state
  const [liveStatus, setLiveStatus] = useState(2); // 1 = ended/off, 2 = live/on
  const [updatingStatus, setUpdatingStatus] = useState(false);

  // Fetch item status
  const fetchItemStatus = async () => {
    if (!classItemId) return;

    try {
      const token = getToken();
      if (!token) throw new Error("Authentication required");

      const response = await fetch(`${Base_url}courseAllItemByCourseID?course_id=${subject_id}`, {
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) throw new Error(`HTTP ${response.status}`);

      const json = await response.json();
      const items = json.data || [];
      const item = items.find(i => String(i.id) === String(classItemId));

      if (item) {
        setLiveStatus(item.has_ended || 2);
      } else {
        console.warn("Item not found in course items, defaulting to live");
        setLiveStatus(2);
      }
    } catch (e) {
      console.error("Failed to fetch item status:", e);
      // Default to live if fetch fails
      setLiveStatus(2);
    }
  };

  // Initial load - fetch class details and item status
  useEffect(() => {
    const fetchClassDetails = async () => {
      try {
        const token = getToken();
        if (!token) throw new Error("Authentication required");

        const response = await fetch(`${Base_url}courseDetails?subject_id=${subject_id}`, {
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) throw new Error(`HTTP ${response.status}`);

        const json = await response.json();
        const result = json.result || {};

        setClassDetails({
          title: result.title || "",
          description: result.description || "",
          isPrivate: String(result.isPrivate || 0),
          price: String(result.price || 0),
          isNegotiable: String(result.isNegotiable || 0),
          tagList: Array.isArray(json.tagData) ? json.tagData.map(t => t.title).join(",") : "",
          class: result.class || "",
          institute: result.institute || "",
          country: result.country || "",
          type: String(result.type || 2),
        });
      } catch (e) {
        console.error("Failed to fetch class details:", e);
        setError("Failed to load class details");
      }
    };

    const loadData = async () => {
      setLoading(true);
      await fetchClassDetails();
      await fetchItemStatus();
      setLoading(false);
    };

    if (subject_id) {
      loadData();
    }
  }, [subject_id, classItemId]); // Depend on subject_id and classItemId




  // Update live status
  const handleUpdateLiveStatus = async (newStatus) => {
    if (!classItemId) {
      setError("Item ID not available. Cannot update live status.");
      return;
    }

    setUpdatingStatus(true);
    setError("");
    setSuccess("");

    try {
      const token = getToken();
      if (!token) throw new Error("Authentication required");

      const formData = new FormData();
      formData.append("id", classItemId);
      formData.append("status", String(newStatus));

      console.log("📤 UPDATE LIVE STATUS PAYLOAD:");
      console.log("🔗 URL:", `${Base_url}updateClassItemStatus`);
      console.log("🆔 Item ID:", classItemId);
      console.log("📊 Status:", newStatus === 2 ? "Live/On" : "Ended/Off");

      const response = await fetch(`${Base_url}updateClassItemStatus`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      console.log("📥 Status Response:", response.status);

      if (!response.ok) throw new Error(`HTTP ${response.status}`);

      const json = await response.json();
      console.log("✅ Status Response Data:", json);

      if (json.error) throw new Error(json.error);

      setLiveStatus(newStatus);
      setSuccess(`Class status updated to ${newStatus === 2 ? "Live" : "Ended"}!`);
    } catch (e) {
      console.error("Failed to update live status:", e);
      setError(e.message || "Failed to update live status");
    } finally {
      setUpdatingStatus(false);
    }
  };

  // Update class details
  const handleUpdateClass = async (e) => {
    e.preventDefault();
    setUpdating(true);
    setError("");
    setSuccess("");

    try {
      const token = getToken();
      if (!token) throw new Error("Authentication required");

      const formData = new FormData();
      formData.append("title", classDetails.title);
      formData.append("description", classDetails.description);
      formData.append("isPrivate", classDetails.isPrivate);
      formData.append("price", classDetails.price);
      formData.append("isNegotiable", classDetails.isNegotiable);
      formData.append("tagList", `[${classDetails.tagList}]`);
      formData.append("subject_id", subject_id);
      formData.append("class", classDetails.class);
      formData.append("institute", classDetails.institute);
      formData.append("country", classDetails.country);
      formData.append("type", classDetails.type);

      // Include the item ID if available
      if (classItemId) {
        formData.append("id", classItemId);
      }

      // 🔍 Console log the payload being sent
      console.log("📤 UPDATE CLASS PAYLOAD:");
      console.log("🔗 URL:", `${Base_url}updateCLass`);
      console.log("🎯 Subject ID:", subject_id);
      console.log("🆔 Item ID:", classItemId || "Not provided");

      // Log all FormData entries
      const payloadData = {};
      for (let [key, value] of formData.entries()) {
        payloadData[key] = value;
      }
      console.log("📋 Form Data:", payloadData);
      console.log("🔑 Token:", token ? "Present" : "Missing");

      const response = await fetch(`${Base_url}updateCLass`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,

      });
      console.log("📥 Response Status:", response.status);
      console.log("📥 Response OK:", response.ok);



      if (!response.ok) throw new Error(`HTTP ${response.status}`);

      const json = await response.json();
      console.log(json);

      if (json.error) throw new Error(json.error);

      setSuccess("Class details updated successfully!");
    } catch (e) {
      console.error("Failed to update class:", e);
      setError(e.message || "Failed to update class");
    } finally {
      setUpdating(false);
    }
  };



  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading class details...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto py-8 px-4">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => navigate(-1)}
            className="mb-4 text-purple-600 hover:text-purple-800 font-medium"
          >
            ← Back to Classes
          </button>
          
          {/* Header with Live Status Toggle */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Update Class</h1>
              <p className="text-gray-600 mt-2">Subject ID: {subject_id}</p>
            </div>
            
            {/* Live Status Toggle */}
            {classItemId && (
              <div className="flex items-center gap-4">
                <div className="text-right">
                  <p className="text-sm font-medium text-gray-700">Live Status</p>
                  <p className={`text-xs ${liveStatus === 2 ? "text-green-600" : "text-red-600"}`}>
                    {liveStatus === 2 ? "Live/On" : "Ended/Off"}
                  </p>
                </div>
                
                {/* Toggle Switch */}
                <div className="relative">
                  <button
                    onClick={() => handleUpdateLiveStatus(liveStatus === 2 ? 1 : 2)}
                    disabled={updatingStatus}
                    className={`relative inline-flex h-8 w-14 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 ${
                      liveStatus === 2 ? "bg-green-600" : "bg-red-600"
                    } ${updatingStatus ? "opacity-50 cursor-not-allowed" : ""}`}
                  >
                    <span
                      className={`inline-block h-6 w-6 transform rounded-full bg-white transition-transform ${
                        liveStatus === 2 ? "translate-x-7" : "translate-x-1"
                      }`}
                    />
                  </button>
                  
                  {updatingStatus && (
                    <div className="absolute -bottom-6 left-1/2 transform -translate-x-1/2">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-purple-600"></div>
                    </div>
                  )}
                </div>
                
                {/* Status Labels */}
                <div className="flex flex-col text-xs text-gray-500">
                  <span className={liveStatus === 1 ? "font-semibold text-red-600" : ""}>OFF</span>
                  <span className={liveStatus === 2 ? "font-semibold text-green-600" : ""}>ON</span>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Success/Error Messages */}
        {success && (
          <div className="mb-6 p-4 bg-green-100 border border-green-400 text-green-700 rounded-lg">
            {success}
          </div>
        )}
        {error && (
          <div className="mb-6 p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg">
            {error}
          </div>
        )}

        {/* Tabs */}
        <div className="mb-8">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8">
              <button
                onClick={() => setActiveTab("details")}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${activeTab === "details"
                  ? "border-purple-500 text-purple-600"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                  }`}
              >
                Class Details
              </button>

            </nav>
          </div>
        </div>

        {/* Tab Content */}
        {activeTab === "details" && (
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold mb-6">Update Class Details</h2>

            <form onSubmit={handleUpdateClass} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Title *
                  </label>
                  <input
                    type="text"
                    required
                    value={classDetails.title}
                    onChange={(e) => setClassDetails({ ...classDetails, title: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Class *
                  </label>
                  <input
                    type="text"
                    required
                    value={classDetails.class}
                    onChange={(e) => setClassDetails({ ...classDetails, class: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description
                </label>
                <textarea
                  rows={4}
                  value={classDetails.description}
                  onChange={(e) => setClassDetails({ ...classDetails, description: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Price (BDT)
                  </label>
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    value={classDetails.price}
                    onChange={(e) => setClassDetails({ ...classDetails, price: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Privacy
                  </label>
                  <select
                    value={classDetails.isPrivate}
                    onChange={(e) => setClassDetails({ ...classDetails, isPrivate: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                  >
                    <option value="0">Public</option>
                    <option value="1">Private</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Negotiable
                  </label>
                  <select
                    value={classDetails.isNegotiable}
                    onChange={(e) => setClassDetails({ ...classDetails, isNegotiable: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                  >
                    <option value="0">No</option>
                    <option value="1">Yes</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Institute
                  </label>
                  <input
                    type="text"
                    value={classDetails.institute}
                    onChange={(e) => setClassDetails({ ...classDetails, institute: e.target.value })}
                    placeholder="Institute name"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Country
                  </label>
                  <input
                    type="text"
                    value={classDetails.country}
                    onChange={(e) => setClassDetails({ ...classDetails, country: e.target.value })}
                    placeholder="Country"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Type
                  </label>
                  <select
                    value={classDetails.type}
                    onChange={(e) => setClassDetails({ ...classDetails, type: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                  >
                    <option value="1">Record</option>
                    <option value="2">Live</option>
                    <option value="3">Problem Solving</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Tags (comma-separated)
                  </label>
                  <input
                    type="text"
                    value={classDetails.tagList}
                    onChange={(e) => setClassDetails({ ...classDetails, tagList: e.target.value })}
                    placeholder="e.g. math, science, physics"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                </div>
              </div>

              <div className="flex justify-end">
                <button
                  type="submit"
                  disabled={updating}
                  className="px-6 py-2 bg-purple-600 text-white font-semibold rounded-lg hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {updating ? "Updating..." : "Update Class Details"}
                </button>
              </div>
            </form>
          </div>
        )}


      </div>
    </div>
  );
};

export default UpdateClass;