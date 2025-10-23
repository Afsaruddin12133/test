import React, { useMemo, useRef, useState, useEffect } from "react";
import { FiCamera } from "react-icons/fi";
import { Base_url } from "../../Config/Api";

/* ---------------- Constants ---------------- */
const CLASS_LEVELS = ["One","Two","Three","Four","Five","Six","Seven","Eight","Nine","Ten"];
const COUNTRIES = ["Bangladesh", "India", "Pakistan"];
const VISIBILITY = ["Public", "Private"];

/* ---------------- Small Modal ---------------- */
const Modal = ({ open, onClose, children }) => {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div className="relative w-[min(92vw,520px)] rounded-xl bg-white shadow-xl border border-purple-200 p-5">
        {children}
      </div>
    </div>
  );
};

const fmtDateTime = (d) =>
  d
    ? new Intl.DateTimeFormat(undefined, {
        year: "numeric",
        month: "short",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
      }).format(d)
    : "Please Click here for DateTime*";

/** Format for API: "YYYY-MM-DD h:mma" (e.g., "2025-10-24 3:00pm") */
const fmtCreateDateForApi = (d) => {
  if (!d) return "";
  const pad = (n) => String(n).padStart(2, "0");
  const yyyy = d.getFullYear();
  const mm = pad(d.getMonth() + 1);
  const dd = pad(d.getDate());
  let h = d.getHours();
  const ampm = h >= 12 ? "pm" : "am";
  h = h % 12;
  if (h === 0) h = 12;
  const mi = pad(d.getMinutes());
  return `${yyyy}-${mm}-${dd} ${h}:${mi}${ampm}`;
};

/* ---------------- DateTime Picker ---------------- */
const DateTimeField = ({ value, onChange }) => {
  const [showDate, setShowDate] = useState(false);
  const [showTime, setShowTime] = useState(false);
  const [tempDate, setTempDate] = useState("");
  const [tempTime, setTempTime] = useState("");

  const open = () => setShowDate(true);
  const closeAll = () => {
    setShowDate(false);
    setShowTime(false);
  };

  const next = () => {
    if (!tempDate) return;
    setShowDate(false);
    setShowTime(true);
  };

  const commit = () => {
    if (!tempDate || !tempTime) return;
    const [y, m, d] = tempDate.split("-").map(Number);
    const [hh, mm] = tempTime.split(":").map(Number);
    const dt = new Date(y, (m ?? 1) - 1, d ?? 1, hh ?? 0, mm ?? 0);
    onChange?.(dt);
    closeAll();
  };

  return (
    <>
      <button
        type="button"
        onClick={open}
        className="w-full h-12 rounded-md border-2 border-blue-200 bg-blue-50 px-4 text-black/80 text-left outline-none"
      >
        {fmtDateTime(value)}
      </button>

      {/* step 1: date */}
      <Modal open={showDate} onClose={closeAll}>
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Select date</h3>
          <input
            type="date"
            className="w-full rounded-md border-2 border-purple-200 px-3 py-2"
            value={tempDate}
            onChange={(e) => setTempDate(e.target.value)}
          />
          <div className="flex justify-end gap-3">
            <button className="px-4 py-2 rounded-md border" onClick={closeAll}>
              Cancel
            </button>
            <button
              className="px-4 py-2 rounded-md bg-purple-700 text-white"
              onClick={next}
            >
              OK
            </button>
          </div>
        </div>
      </Modal>

      {/* step 2: time */}
      <Modal open={showTime} onClose={closeAll}>
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Select time</h3>
          <input
            type="time"
            className="w-full rounded-md border-2 border-purple-200 px-3 py-2"
            value={tempTime}
            onChange={(e) => setTempTime(e.target.value)}
          />
          <div className="flex justify-end gap-3">
            <button className="px-4 py-2 rounded-md border" onClick={closeAll}>
              Cancel
            </button>
            <button
              className="px-4 py-2 rounded-md bg-purple-700 text-white"
              onClick={commit}
            >
              OK
            </button>
          </div>
        </div>
      </Modal>
    </>
  );
};

/* ---------------- Helpers ---------------- */
const visibilityToIsPrivate = (v) => (v === "Private" ? 1 : 2); // 1=Private, 2=Public

/* ---------------- Main (Live) ---------------- */
const Live3 = () => {
  const [cover, setCover] = useState(null); // File
  const [title, setTitle] = useState("");
  const [desc, setDesc] = useState("");
  const [classDateTime, setClassDateTime] = useState(null);
  const [klass, setKlass] = useState(CLASS_LEVELS[0]);
  const [price, setPrice] = useState("");
  const [paymentType, setPaymentType] = useState("Negotiable");
  const [institute, setInstitute] = useState("");
  const [visibility, setVisibility] = useState(VISIBILITY[0]);
  const [country, setCountry] = useState(COUNTRIES[0]);

  const [interestInput, setInterestInput] = useState("");
  const [interests, setInterests] = useState([]);

  const inputFileRef = useRef(null);
  const coverPreview = useMemo(
    () => (cover ? URL.createObjectURL(cover) : ""),
    [cover]
  );

  useEffect(() => {
    return () => {
      if (coverPreview) URL.revokeObjectURL(coverPreview);
    };
  }, [coverPreview]);

  const onCoverChange = (e) => {
    const f = e.target.files?.[0];
    if (f) setCover(f);
  };

  const addInterest = (val) => {
    const v = (val || interestInput).trim();
    if (!v) return;
    if (!interests.includes(v)) setInterests((p) => [...p, v]);
    setInterestInput("");
  };

  const removeInterest = (val) =>
    setInterests((p) => p.filter((i) => i !== val));

  // --------------- Submit (POST) ---------------
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Required fields
    if (!title.trim()) return alert("Title is required.");
    if (!klass) return alert("Class is required.");
    if (price === "" || price === null) return alert("Price (BDT) is required.");
    if (!classDateTime) return alert("Class DateTime is required.");

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

    // Build FormData
    const buildFormData = (sendImage) => {
      const fd = new FormData();
      fd.append("title", title.trim());
      fd.append("description", desc?.trim() || "");

      if (sendImage && cover) {
        fd.append("headerImageVideo", cover);
        fd.append("hasImage", "1");
      } else {
        fd.append("hasImage", "2");
      }

      const isPrivate = visibilityToIsPrivate(visibility);
      fd.append("isPrivate", String(isPrivate));

      fd.append("price", String(price));
      if (Number(price) > 0) {
        const nego = paymentType === "Negotiable" ? 1 : 2; // 1=neg, 2=fixed
        fd.append("isNegotiable", String(nego));
      }

      // tagList as bracket-string (per your working flow)
      const tagBracket = interests.length ? `[${interests.join(", ")}]` : "[]";
      fd.append("tagList", tagBracket);

      fd.append("class", String(klass).toLowerCase());

      // Live class
      fd.append("type", "2");

      fd.append("institute", institute || "");
      fd.append("country", country || "");

      // NEW: createDate for live classes
      fd.append("createDate", fmtCreateDateForApi(classDateTime));

      return fd;
    };

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
      // Attempt with image if provided
      const first = await submitOnce(buildFormData(true));
      console.log("🌐 Create Live Class status:", first.res.status, first.payload);

      if (first.res.ok) {
        alert("Live class saved successfully!");
        resetForm();
        return;
      }

      // Retry w/o image on 500
      if (first.res.status === 500 && cover) {
        console.warn("⚠️ 500 with image; retrying without image...");
        const second = await submitOnce(buildFormData(false));
        console.log("🌐 Retry (no image) status:", second.res.status, second.payload);

        if (second.res.ok) {
          alert("Live class saved successfully!");
          resetForm();
          return;
        }
        const msg2 =
          typeof second.payload === "string"
            ? second.payload
            : second.payload?.message ||
              second.payload?.error ||
              JSON.stringify(second.payload, null, 2);
        alert(`Create Live Class failed (${second.res.status}). ${msg2 || ""}`);
        return;
      }

      const msg =
        typeof first.payload === "string"
          ? first.payload
          : first.payload?.message ||
            first.payload?.error ||
            JSON.stringify(first.payload, null, 2);
      console.warn("⚠️ Create Live Class not OK:", first.res.status, msg);
      alert(`Create Live Class failed (${first.res.status}). ${msg || ""}`);
      return;
    } catch (err) {
      if (err?.name === "AbortError") return;
      console.error("Network error:", err);
      alert("Network error while creating live class. Please try again.");
    }

    return () => controller.abort();
  };

  const resetForm = () => {
    setCover(null);
    setTitle("");
    setDesc("");
    setClassDateTime(null);
    setKlass(CLASS_LEVELS[0]);
    setPrice("");
    setPaymentType("Negotiable");
    setInstitute("");
    setVisibility(VISIBILITY[0]);
    setCountry(COUNTRIES[0]);
    setInterests([]);
    setInterestInput("");
    if (inputFileRef.current) inputFileRef.current.value = "";
  };

  return (
    <div className="max-w-3xl mx-auto p-6">
      {/* Title pill */}
      <div className="flex justify-center mb-6">
        <span className="inline-flex items-center rounded-lg border border-purple-600 px-5 py-1.5 text-purple-700 font-bold text-2xl lg:text-3xl">
          Create Live Class
        </span>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Cover */}
        <div>
          <p className="font-semibold">Select Cover Photo</p>
          <p className="text-sm text-black">
            You must select a cover photo that describe your class perfectly.
          </p>
        </div>
        <div className="relative">
          <div className="rounded-md border-2 border-gray-300 overflow-hidden bg-white h-36 sm:h-40 flex items-center justify-center">
            {coverPreview ? (
              <img src={coverPreview} alt="Cover preview" className="h-full w-full object-cover" />
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
          <label className="block font-semibold mb-2">
            Title<span className="text-red-600 font-bold text-lg">*</span>
          </label>
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

        {/* Tag List */}
        <div>
          <label className="block font-semibold mb-2">Tag List</label>
          <div className="flex gap-2 mb-2">
            <input
              type="text"
              value={interestInput}
              onChange={(e) => setInterestInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addInterest())}
              className="flex-1 rounded-md border-2 border-gray-300 px-3 py-2"
              placeholder="Add tag list..."
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

        {/* Class DateTime */}
        <div>
          <label className="block font-semibold mb-2">
            Class DateTime<span className="text-red-600 font-bold text-lg">*</span>
          </label>
          <DateTimeField value={classDateTime} onChange={setClassDateTime} />
        </div>

        {/* Class Level */}
        <div>
          <label className="block font-semibold mb-2">
            Class<span className="text-red-600 font-bold text-lg">*</span>
          </label>
          <select
            value={klass}
            required
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
            <label className="block font-semibold mb-2">
              Price (BDT)<span className="text-red-600 font-bold text-lg">*</span>
            </label>
            <input
              type="number"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              className="w-full rounded-md border-2 border-gray-300 px-3 py-2"
              required
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

export default Live3;
