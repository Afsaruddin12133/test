import React, { useMemo, useRef, useState } from "react";
import { FiCamera } from "react-icons/fi";
import { Base_url } from "../../Config/Api";

/* ---------------- Constants ---------------- */
const CLASS_LEVELS = [
  "One",
  "Two",
  "Three",
  "Four",
  "Five",
  "Six",
  "Seven",
  "Eight",
  "Nine",
  "Ten",
];

const COUNTRIES = ["Bangladesh", "India", "Pakistan"];
const VISIBILITY = ["Public", "Private"];

/* ---------------- Main Form ---------------- */
const Problem3 = () => {
  const [cover, setCover] = useState(null); // File
  const [title, setTitle] = useState("");
  const [desc, setDesc] = useState("");
  const [klass, setKlass] = useState(CLASS_LEVELS[0]);
  const [price, setPrice] = useState("");
  const [paymentType, setPaymentType] = useState("Negotiable");
  const [institute, setInstitute] = useState("");
  const [visibility, setVisibility] = useState(VISIBILITY[0]);
  const [country, setCountry] = useState(COUNTRIES[0]);

  const [interestInput, setInterestInput] = useState("");
  const [interests, setInterests] = useState([]);

  // Extra file uploads (UI separated by type)
  const [extraImages, setExtraImages] = useState([{ id: Date.now(), file: null }]);
  const [extraPDFs, setExtraPDFs] = useState([{ id: Date.now() + 1, file: null }]);

  const inputFileRef = useRef(null);
  const coverPreview = useMemo(
    () => (cover ? URL.createObjectURL(cover) : ""),
    [cover]
  );

  const onCoverChange = (e) => {
    const f = e.target.files?.[0];
    if (f) setCover(f);
  };

  const addInterest = (val) => {
    const v = (val || interestInput).trim();
    if (!v) return;
    if (!interests.includes(v)) {
      setInterests((prev) => [...prev, v]);
    }
    setInterestInput("");
  };

  const removeInterest = (val) => {
    setInterests((prev) => prev.filter((i) => i !== val));
  };

  // Extra uploads UI handlers (not changing UI)
  const handleExtraFileChange = (id, e, type) => {
    const f = e.target.files?.[0] || null;
    if (type === "image") {
      setExtraImages((prev) => prev.map((ef) => (ef.id === id ? { ...ef, file: f } : ef)));
    } else {
      setExtraPDFs((prev) => prev.map((ef) => (ef.id === id ? { ...ef, file: f } : ef)));
    }
  };

  const removeExtraFile = (id, type) => {
    if (type === "image") setExtraImages((prev) => prev.filter((ef) => ef.id !== id));
    else setExtraPDFs((prev) => prev.filter((ef) => ef.id !== id));
  };

  const addMoreFileInput = (type) => {
    if (type === "image") setExtraImages((prev) => [...prev, { id: Date.now(), file: null }]);
    else setExtraPDFs((prev) => [...prev, { id: Date.now(), file: null }]);
  };

  // ----------------- Submit (POST) -----------------
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Required checks (match your UI)
    if (!title?.trim()) {
      alert("Title is required.");
      return;
    }
    if (!desc?.trim()) {
      alert("Description is required.");
      return;
    }
    if (!klass) {
      alert("Class is required.");
      return;
    }
    if (price === "" || price === null) {
      alert("Price (BDT) is required.");
      return;
    }

    // Token
    const controller = new AbortController();
    const authRaw = localStorage.getItem("auth") || "{}";
    let userToken = null;
    try {
      const authData = JSON.parse(authRaw);
      userToken = authData?.user?.token ?? null;
    } catch {
      'error parsing auth JSON';
    }
    if (!userToken) {
      console.log("❌ No token found at auth.user.token");
      alert("You must be logged in. No token found.");
      return () => controller.abort();
    }
    console.log("✅ Token found (auth.user.token):", userToken);

    // Build FormData (reusable for retry without cover image)
    const buildFormData = (sendCover) => {
      const fd = new FormData();
      fd.append("title", title.trim());
      fd.append("description", desc.trim());

      // Cover image
      if (sendCover && cover) {
        fd.append("headerImageVideo", cover);
        fd.append("hasImage", "1");
      } else {
        fd.append("hasImage", "2");
      }

      // isPrivate: Private -> 1, Public -> 2
      const isPrivate = visibility === "Private" ? 1 : 2;
      fd.append("isPrivate", String(isPrivate));

      // price + isNegotiable (only when price > 0)
      fd.append("price", String(price));
      if (Number(price) > 0) {
        const nego = paymentType === "Negotiable" ? 1 : 2; // 1=negotiable, 2=fixed
        fd.append("isNegotiable", String(nego));
      }

      // tagList as bracket string like Postman: "[a, b, c]"
      const tagBracket = interests.length > 0 ? `[${interests.join(", ")}]` : "[]";
      fd.append("tagList", tagBracket);

      // class lowercase
      fd.append("class", String(klass).toLowerCase());

      // Problem class → type = 3 (fixed)
      fd.append("type", "3");

      fd.append("institute", institute || "");
      fd.append("country", country || "");

      /* 🆕 Attach extra images (array-style key) */
      extraImages.forEach((ef) => {
        if (ef.file) {
          fd.append("imageFileList[]", ef.file); // ← adjust key if your backend expects a different name
        }
      });

      /* 🆕 Attach extra PDFs (array-style key) */
      extraPDFs.forEach((ef) => {
        if (ef.file) {
          fd.append("pdfFileList[]", ef.file); // ← adjust key if your backend expects a different name
        }
      });

      return fd;
    };

    // Helper to POST once
    const submitOnce = async (formData) => {
      console.groupCollapsed("📤 FormData preview");
      for (const [k, v] of formData.entries()) {
        console.log(k, v instanceof File ? `File(${v.name}, ${v.type})` : v);
      }
      console.groupEnd();

      const res = await fetch(
        `${Base_url}createCLass`, {
        method: "POST",
        headers: {
          Accept: "application/json",
          Authorization: `Bearer ${userToken}`,
          // Do not set Content-Type for FormData
        },
        body: formData,
        signal: controller.signal,
      });
      const ct = res.headers.get("content-type") || "";
      const payload = ct.includes("application/json")
        ? await res.json().catch(() => ({}))
        : await res.text();
      return { res, payload };
    };

    try {
      // 1) Try with cover + attachments
      const first = await submitOnce(buildFormData(true));
      console.log("🌐 Create Problem (with files) status:", first.res.status, first.payload);

      if (first.res.ok) {
        alert("Problem class created successfully!");
        // Reset form
        setCover(null);
        setTitle("");
        setDesc("");
        setKlass(CLASS_LEVELS[0]);
        setPrice("");
        setPaymentType("Negotiable");
        setInstitute("");
        setVisibility(VISIBILITY[0]);
        setCountry(COUNTRIES[0]);
        setInterests([]);
        setInterestInput("");
        setExtraImages([{ id: Date.now(), file: null }]);
        setExtraPDFs([{ id: Date.now() + 1, file: null }]);
        if (inputFileRef.current) inputFileRef.current.value = "";
        return;
      }

      // 2) If the server 500s and a cover was sent, retry once without the cover (keep attachments)
      if (first.res.status === 500 && cover) {
        console.warn("⚠️ 500 with cover; retrying without cover (keeping attachments)...");
        const second = await submitOnce(buildFormData(false));
        console.log("🌐 Create Problem (no cover) status:", second.res.status, second.payload);

        if (second.res.ok) {
          alert("Problem class created successfully!");
          // Reset form
          setCover(null);
          setTitle("");
          setDesc("");
          setKlass(CLASS_LEVELS[0]);
          setPrice("");
          setPaymentType("Negotiable");
          setInstitute("");
          setVisibility(VISIBILITY[0]);
          setCountry(COUNTRIES[0]);
          setInterests([]);
          setInterestInput("");
          setExtraImages([{ id: Date.now(), file: null }]);
          setExtraPDFs([{ id: Date.now() + 1, file: null }]);
          if (inputFileRef.current) inputFileRef.current.value = "";
          return;
        }

        const msg2 =
          typeof second.payload === "string"
            ? second.payload
            : second.payload?.message ||
              second.payload?.error ||
              JSON.stringify(second.payload, null, 2);
        alert(`Create Problem failed (${second.res.status}). ${msg2 || ""}`);
        return;
      }

      const msg =
        typeof first.payload === "string"
          ? first.payload
          : first.payload?.message ||
            first.payload?.error ||
            JSON.stringify(first.payload, null, 2);
      console.warn("⚠️ Create Problem not OK:", first.res.status, msg);
      alert(`Create Problem failed (${first.res.status}). ${msg || ""}`);
    } catch (err) {
      if (err?.name === "AbortError") return;
      console.error("Network error:", err);
      alert("Network error while creating problem class. Please try again.");
    }

    return () => controller.abort();
  };

  return (
    <div className="max-w-3xl mx-auto p-6">
      {/* Title pill */}
      <div className="flex justify-center mb-6">
        <span className="inline-flex items-center rounded-lg border border-purple-600 px-5 py-1.5 text-purple-700 font-bold text-2xl lg:text-3xl">
          Create Problem
        </span>
      </div>
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Cover Upload */}
        <div>
          <p className="font-semibold">Select Cover Photo</p>
          <p className="text-sm text-black">
            You must select a cover photo that describe your class perfectly.
          </p>
        </div>

        <div className="relative">
          <div className="rounded-md border-2 border-gray-300 overflow-hidden bg-white h-36 sm:h-40 flex items-center justify-center">
            {coverPreview ? (
              <img
                src={coverPreview}
                alt="Cover preview"
                className="h-full w-full object-cover"
              />
            ) : (
              <span className="text-gray-500">No Image Selected</span>
            )}
          </div>

          <button
            type="button"
            onClick={() => inputFileRef.current?.click()}
            className="absolute bottom-2 right-2 grid h-7 w-7 place-items-center rounded-md border border-purple-400 bg-white text-purple-600"
            aria-label="Pick cover photo"
          >
            <FiCamera />
          </button>

          <input
            ref={inputFileRef}
            type="file"
            accept="image/*"
            onChange={onCoverChange}
            className="hidden"
          />
        </div>

        {/* Title */}
        <div>
          <label className="block font-semibold mb-2">Title<span className="text-red-600 font-bold text-lg">*</span></label>
          <input
            type="text"
            required
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full rounded-md border-2 border-gray-300 px-3 py-2"
          />
        </div>

        {/* Description */}
        <div>
          <label className="block font-semibold mb-2">Description</label>
          <textarea
            rows={3}
            value={desc}
            onChange={(e) => setDesc(e.target.value)}
            className="w-full rounded-md border-2 border-gray-300 px-3 py-2"
          />
        </div>

        {/* Interests */}
        <div>
          <label className="block font-semibold mb-2">Interests</label>
          <div className="flex gap-2 mb-2">
            <input
              type="text"
              value={interestInput}
              onChange={(e) => setInterestInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addInterest())}
              className="flex-1 rounded-md border-2 border-gray-300 px-3 py-2"
              placeholder="Add interest..."
            />
            <button
              type="button"
              onClick={() => addInterest()}
              className="px-4 py-2 bg-purple-700 text-white rounded-md"
            >
              Add
            </button>
          </div>
          <div className="flex flex-wrap gap-2">
            {interests.map((i) => (
              <span
                key={i}
                className="px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-sm flex items-center gap-2"
              >
                {i}
                <button
                  type="button"
                  onClick={() => removeInterest(i)}
                  className="text-purple-600 hover:text-purple-900"
                >
                  ✕
                </button>
              </span>
            ))}
          </div>
        </div>

        {/* Class Level */}
        <div>
          <label className="block font-semibold mb-2">Class<span className="text-red-600 font-bold text-lg">*</span></label>
          <select
            value={klass}
            onChange={(e) => setKlass(e.target.value)}
            className="w-full rounded-md border-2 border-gray-300 px-3 py-2"
          >
            {CLASS_LEVELS.map((c) => (
              <option key={c}>{c}</option>
            ))}
          </select>
        </div>

        {/* Price + Payment */}
        <div className="grid grid-cols-1 gap-4">
          <div>
            <label className="block font-semibold mb-2">Price (BDT)<span className="text-red-600 font-bold text-lg">*</span></label>
            <input
              type="number"
              value={price}
              required
              onChange={(e) => setPrice(e.target.value)}
              className="w-full rounded-md border-2 border-gray-300 px-3 py-2"
            />
          </div>

          {Number(price) > 0 && (
            <div>
              <label className="block font-semibold mb-2">Payment Type</label>
              <select
                value={paymentType}
                onChange={(e) => setPaymentType(e.target.value)}
                className="w-full rounded-md border-2 border-gray-300 px-3 py-2"
              >
                <option>Negotiable</option>
                <option>Fixed</option>
              </select>
            </div>
          )}
        </div>

        {/* Institute */}
        <div>
          <label className="block font-semibold mb-2">Institute</label>
          <input
            type="text"
            value={institute}
            onChange={(e) => setInstitute(e.target.value)}
            className="w-full rounded-md border-2 border-gray-300 px-3 py-2"
          />
        </div>

        {/* Visibility + Country */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block font-semibold mb-2">Visibility</label>
            <select
              value={visibility}
              onChange={(e) => setVisibility(e.target.value)}
              className="w-full rounded-md border-2 border-gray-300 px-3 py-2"
            >
              {VISIBILITY.map((v) => (
                <option key={v}>{v}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block font-semibold mb-2">Country</label>
            <select
              value={country}
              onChange={(e) => setCountry(e.target.value)}
              className="w-full rounded-md border-2 border-gray-300 px-3 py-2"
            >
              {COUNTRIES.map((c) => (
                <option key={c}>{c}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Additional Images (UI only) */}
        <div>
          <label className="block font-semibold mb-2">Additional Images</label>
          {extraImages.map((ef) => (
            <div key={ef.id} className="mb-2">
              <input
                type="file"
                accept="image/*"
                onChange={(e) => handleExtraFileChange(ef.id, e, "image")}
                className="w-full rounded-md border-2 border-gray-300 px-3 py-2"
              />
              {ef.file && (
                <div className="mt-1 flex items-center gap-2 text-sm">
                  <span>{ef.file.name}</span>
                  <button
                    type="button"
                    onClick={() => removeExtraFile(ef.id, "image")}
                    className="text-red-600 font-bold"
                  >
                    ✕
                  </button>
                </div>
              )}
            </div>
          ))}
          <button
            type="button"
            onClick={() => addMoreFileInput("image")}
            className="mt-2 px-4 py-2 bg-purple-100 text-purple-700 rounded-md"
          >
            + Add More
          </button>
        </div>

        {/* Additional PDFs (UI only) */}
        <div>
          <label className="block font-semibold mb-2">Additional PDFs</label>
          {extraPDFs.map((ef) => (
            <div key={ef.id} className="mb-2">
              <input
                type="file"
                accept="application/pdf"
                onChange={(e) => handleExtraFileChange(ef.id, e, "pdf")}
                className="w-full rounded-md border-2 border-gray-300 px-3 py-2"
              />
              {ef.file && (
                <div className="mt-1 flex items-center gap-2 text-sm">
                  <span>{ef.file.name}</span>
                  <button
                    type="button"
                    onClick={() => removeExtraFile(ef.id, "pdf")}
                    className="text-red-600 font-bold"
                  >
                    ✕
                  </button>
                </div>
              )}
            </div>
          ))}
          <button
            type="button"
            onClick={() => addMoreFileInput("pdf")}
            className="mt-2 px-4 py-2 bg-purple-100 text-purple-700 rounded-md"
          >
            + Add More
          </button>
        </div>

        {/* Submit */}
        <div className="pt-4">
          <button
            type="submit"
            className="w-full py-3 bg-purple-700 text-white font-semibold rounded-lg hover:bg-purple-800 transition"
          >
            Save Class
          </button>
        </div>
      </form>
    </div>
  );
};

export default Problem3;
