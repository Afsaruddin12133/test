import React, { useState } from "react";
import { useParams } from "react-router";

import { Base_url } from "../../Config/Api";
// ✅ helper for token
const getToken = () => {
  try {
    const auth = JSON.parse(localStorage.getItem("auth") || "{}");
    return auth?.user?.token || null;
  } catch {
    return null;
  }
};

const Episode = () => {
  const { subject_id } = useParams(); // ✅ fixed (called as function)
  // console.log("Subject ID from URL:", subject_id); // ✅ debug log

  const [formData, setFormData] = useState({
    subject_id: subject_id,
    title: "",
    description: "",
    url: "",
    duration: "",
    createDate: new Date().toISOString().slice(0, 16).replace("T", " "),
    paid: "free", // default value
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const token = getToken(); // ✅ use helper
    if (!token) {
      alert("Authorization token not found!");
      return;
    }

    // Map free/paid to API expected value
    const isPaidValue = formData.paid === "paid" ? 1 : 0;

    // Payload according to API spec
    const payload = {
      subject_id: subject_id,
      title: formData.title,
      description: formData.description,
      url: formData.url,
      timeDuration: formData.duration,
      isPaid: isPaidValue,
      createDate: new Date().toISOString().slice(0, 16).replace("T", " "),
    };

    try {
      const response = await fetch(
        // "https://apidocumentationpathon.pathon.app/api/addClassItem",
        `${Base_url}addClassItem`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
            Authorization: `Bearer ${token}`,
          },
          body: new URLSearchParams(payload),
        }
      );

      const data = await response.json();
      console.log("API Response:", data);

      if (response.ok) {
        alert("Episode created successfully!");
        // Reset form
        setFormData({
          subject_id: subject_id,
          title: "",
          description: "",
          url: "",
          duration: "",
          createDate: new Date().toISOString().slice(0, 16).replace("T", " "),
          paid: "free",
        });
      } else {
        alert(data.message || "Failed to create episode");
      }
    } catch (error) {
      console.error("Error creating episode:", error);
      alert("Something went wrong!");
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-6">
      <h2 className="text-center mb-6">
        <button className="px-4 py-2 border border-purple-300 rounded text-purple-700 font-semibold hover:bg-purple-700 hover:text-white transition">
          ADD RECORDED EPISODE
        </button>
      </h2>

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block mb-1 font-medium">Episode Title<span className="text-red-600 font-bold text-lg">*</span></label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            placeholder="write title..."
            required
            className="w-full border-2 border-purple-200 rounded px-3 py-2 outline-none focus:ring-2 focus:ring-purple-300"
          />
        </div>

        <div>
          <label className="block mb-1 font-medium">Episode Description</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder="write description..."
            className="w-full border-2 border-purple-200 rounded px-3 py-2 outline-none focus:ring-2 focus:ring-purple-300"
          ></textarea>
        </div>

        <div>
          <label className="block mb-1 font-medium">Episode Url<span className="text-red-600 font-bold text-lg">*</span></label>
          <input
            type="url"
            name="url"
            value={formData.url}
            onChange={handleChange}
            placeholder="write url..."
            required
            className="w-full border-2 border-purple-200 rounded px-3 py-2 outline-none focus:ring-2 focus:ring-purple-300"
          />
        </div>

        <div>
          <label className="block mb-1 font-medium">Time Duration<span className="text-red-600 font-bold text-lg">*</span></label>
          <input
            type="number"
            name="duration"
            value={formData.duration}
            onChange={handleChange}
            placeholder="write here..."
            required
            min="1"
            max="500"
            className="w-full border-2 border-purple-200 rounded px-3 py-2 outline-none focus:ring-2 focus:ring-purple-300"
          />
          <p className="text-red-400 text-sm mt-1">
            NOTE: Time Limit max 500 minutes and write time similar if your
            episode duration is 1 hour 10 minutes then write only 70.
          </p>
        </div>

        {/* Paid Dropdown */}
        <div>
          <label className="block mb-1 font-medium">Paid<span className="text-red-600 font-bold text-lg">*</span></label>
          <select
            name="paid"
            value={formData.paid}
            onChange={handleChange}
            className="w-full border-2 border-purple-200 rounded px-3 py-2 outline-none focus:ring-2 focus:ring-purple-300"
          >
            <option value="free">Free</option>
            <option value="paid">Paid</option>
          </select>
        </div>

        {/* Add Button */}
        <div className="mt-6">
          <button
            type="submit"
            className="w-full bg-purple-700 text-white font-semibold py-2 rounded hover:bg-purple-800 transition"
          >
            Add
          </button>
        </div>
      </form>
    </div>
  );
};

export default Episode;
