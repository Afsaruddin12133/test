import React, { useRef, useState, useEffect } from "react";
import { FiCamera, FiEdit3, FiSave } from "react-icons/fi";
import { HiChevronRight } from "react-icons/hi";
import { Base_url } from "../../Config/Api";
import { toast } from "react-toastify";
import { ShimmerThumbnail, ShimmerCircularImage , ShimmerTitle, ShimmerText } from "react-shimmer-effects";

/* --- field definitions --- */
const fieldDefinitions = [
  { key: "name", label: "Name", type: "text", editable: true, apiKey: "fullName", inline: true },
  { key: "email", label: "Email", type: "email", editable: true, apiKey: "email", inline: true },
  { key: "phone", label: "Phone", type: "tel", editable: false },
  { key: "dob", label: "Date Of Birth", type: "date", editable: true, apiKey: "dob", inline: true },
  { key: "address", label: "Address", type: "text", editable: true, apiKey: "address", inline: true },
  { key: "country", label: "Country", type: "text", editable: true, apiKey: "country", inline: true },
  { key: "city", label: "City", type: "text", editable: true, apiKey: "city", inline: true },
  { key: "designation", label: "Designation", type: "text", editable: true, apiKey: "designation", inline: true },
  { key: "education", label: "Education", type: "text", editable: true, apiKey: "educational_qualification", inline: true },
  { key: "profession", label: "Profession", type: "text", editable: true, apiKey: "profession", inline: true },
  { key: "company", label: "Company", type: "text", editable: true, apiKey: "company", inline: true },
  { key: "interests", label: "Interests", type: "text", editable: true, inline: false },
];

/* helpers for DOB format conversion */
const toISO = (dmy) => {
  const m = /^(\d{2})-(\d{2})-(\d{4})$/.exec(dmy || "");
  return m ? `${m[3]}-${m[2]}-${m[1]}` : "";
};
const fromISO = (iso) => {
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(iso || "");
  return m ? `${m[3]}-${m[2]}-${m[1]}` : iso || "";
};
// be forgiving if API sends "YYYY-MM-DDTHH:mm:ssZ"
const normalizeDOBToDMY = (val) => {
  if (!val) return "";
  const m = /^(\d{4})-(\d{2})-(\d{2})/.exec(val);
  if (m) return `${m[3]}-${m[2]}-${m[1]}`;
  return val; // already DMY or unknown format → show as-is
};

/* --- tiny modal used for editing --- */
function EditModal({ open, label, type = "text", value, fieldKey, onClose, onSave }) {
  const isDOB = fieldKey === "dob";
  const [v, setV] = useState(isDOB ? toISO(value) : (value ?? ""));

  // local "today" (YYYY-MM-DD) to limit future dates
  const todayISO = new Date(Date.now() - new Date().getTimezoneOffset() * 60000)
    .toISOString()
    .slice(0, 10);

  React.useEffect(() => {
    setV(isDOB ? toISO(value) : (value ?? ""));
  }, [value, open, isDOB]);

  if (!open) return null;

  const submit = (e) => {
    e.preventDefault();
    const out = isDOB ? fromISO(v) : v;
    onSave(out);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 p-4"
      onMouseDown={onClose}
    >
      <div
        className="relative w-full max-w-md rounded-xl bg-white shadow-xl"
        onMouseDown={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-center border-b px-5 py-4">
          <h3 className="text-xl font-semibold text-gray-800">Update Your {label}</h3>
          <button
            onClick={onClose}
            aria-label="Close"
            className="absolute right-3 top-3 grid h-8 w-8 place-items-center rounded-full bg-red-500 text-white"
          >
            <svg viewBox="0 0 20 20" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M5 5l10 10M15 5L5 15" />
            </svg>
          </button>
        </div>

        {/* Body */}
        <form onSubmit={submit} className="px-5 pb-6 pt-4">
          <label className="block text-sm font-semibold text-gray-700 mb-2">{label}</label>

          {label === "About Me" ? (
            <textarea
              className="w-full rounded-md border-2 border-purple-500 px-4 py-3 outline-none focus:ring-2 focus:ring-purple-300"
              rows={4}
              value={v}
              onChange={(e) => setV(e.target.value)}
              autoFocus
            />
          ) : isDOB ? (
            <div className="relative">
              <input
                type="date"
                className="w-full h-12 rounded-md border-2 border-purple-500 px-4 pr-2 outline-none focus:ring-2 focus:ring-purple-300"
                value={v}
                onChange={(e) => setV(e.target.value)}
                max={todayISO}
                autoFocus
              />
            </div>
          ) : (
            <input
              type={type}
              className="w-full h-12 rounded-md border-2 border-purple-500 px-4 outline-none focus:ring-2 focus:ring-purple-300"
              value={v}
              onChange={(e) => setV(e.target.value)}
              autoFocus
            />
          )}

          <button
            type="submit"
            className="uppercase mt-4 w-full rounded-md bg-purple-700 py-2.5 text-center font-extrabold tracking-wide text-white hover:bg-purple-800"
          >
            {`change ${label.toUpperCase()}`}
          </button>
        </form>
      </div>
    </div>
  );
}



/* === Avatar generator: purple-950 background, always 2 initials === */
const PURPLE_950 = "#2e1065";
const getTwoInitials = (name = "") => {
  const cleaned = name.replace(/[^\p{L}\p{N}\s]/gu, " ").trim();
  if (!cleaned) return "??";
  const parts = cleaned.split(/\s+/);
  if (parts.length >= 2) {
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  }
  const first = parts[0];
  const a = (first[0] || "?").toUpperCase();
  const b = (first[1] || first[0] || "?").toUpperCase();
  return (a + b);
};

const getNameInitialsAvatar = (name) => {
  const initials = getTwoInitials(name);
  const canvas = document.createElement("canvas");
  const size = 256;
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext("2d");

  // background
  ctx.fillStyle = PURPLE_950;
  ctx.fillRect(0, 0, size, size);

  // initials
  ctx.fillStyle = "white";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.font = "bold 130px Inter, Arial, sans-serif";
  ctx.fillText(initials, size / 2, size / 2 + 6);

  return canvas.toDataURL("image/png");
};

/* === API URLs === */
const API_BASE = "https://apidocumentationpathon.pathon.app";

/* === update endpoints (need Authorization) === */
const CHANGE_INTERESTED_URL = `${Base_url}changeInterestedCourse`;
const CHANGE_PICTURE_URL = `${Base_url}changePicture`;

const absolutize = (maybeRelative) => {
  if (!maybeRelative) return "";
  if (/^https?:\/\//i.test(maybeRelative)) return maybeRelative;
  return `${API_BASE}/${maybeRelative.replace(/^\/+/, "")}`;
};

const safeGet = (obj, keys, fallback) => {
  for (const k of keys) {
    const v = k.split(".").reduce((acc, key) => (acc && acc[key] != null ? acc[key] : undefined), obj);
    if (v != null && v !== "") return v;
  }
  return fallback;
};

/* pull token from localStorage.auth the same way you read it earlier */
const getAuthToken = () => {
  try {
    const raw = localStorage.getItem("auth");
    if (!raw) return null;
    const auth = JSON.parse(raw);
    return (
      safeGet(auth, ["user.token", "data.user.token", "token"], null) || null
    );
  } catch {
    return null;
  }
};

/* small fetch helpers with nice errors */
async function apiPOSTJSON(url, body, token) {
  const res = await fetch(url, {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: JSON.stringify(body),
  });
  if (!res.ok) {
    const txt = await res.text().catch(() => "");
    throw new Error(`POST ${url} failed: ${res.status} ${txt || ""}`);
  }
  return res.json().catch(() => ({}));
}

async function apiPOSTForm(url, formData, token) {
  const res = await fetch(url, {
    method: "POST",
    headers: {
      Accept: "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: formData,
  });

  if (!res.ok) {
    let errorText = await res.text().catch(() => "");
    // Try to parse as JSON for structured error messages
    try {
      const errorJson = JSON.parse(errorText);
      errorText = errorJson.message || errorJson.error || errorText;
    } catch {
      // Not JSON, use text as is
    }
    throw new Error(`POST ${url} failed: ${res.status} ${errorText || ""}`);
  }

  return res.json().catch(() => ({}));
}



const Profile = () => {
  const [userData, setUserData] = useState(null);
  const [rows, setRows] = useState([]);
  const [editingKey, setEditingKey] = useState(null);
  const [avatar, setAvatar] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const fileRef = useRef(null);

  const current = rows.find((r) => r.key === editingKey);

  const openEditor = (key) => {
    const field = fieldDefinitions.find(f => f.key === key);
    if (field && field.editable) {
      setEditingKey(key);
    }
    // If not editable, do nothing (no modal opens)
  };

  const closeEditor = () => setEditingKey(null);

  // save handler — only "interests" posts to API; others remain local
  const saveValue = async (newVal) => {
    const key = editingKey;

    // find old value for potential revert
    const oldVal = rows.find((r) => r.key === key)?.value;

    // optimistic UI update
    setRows((prev) => prev.map((r) => (r.key === key ? { ...r, value: newVal } : r)));
    closeEditor();

    if (key === "interests") {
      try {
        const token = getAuthToken();
        if (!token) throw new Error("Missing auth token");

        const titles = String(newVal)
          .split(",")
          .map((s) => s.trim())
          .filter(Boolean);

        // Try array payload first; if backend rejects, retry with CSV string
        try {
          await apiPOSTJSON(CHANGE_INTERESTED_URL, { tagList: titles }, token);
        } catch {
          await apiPOSTJSON(CHANGE_INTERESTED_URL, { tagList: titles.join(",") }, token);
        }
        toast.success("Interests updated successfully");
      } catch (err) {
        console.error("Failed to update interests:", err);
        // revert UI
        setRows((prev) => prev.map((r) => (r.key === "interests" ? { ...r, value: oldVal } : r)));
        toast.error("Couldn't update interests. Please try again.");
      }
    }
  };

  const onPickAvatar = (e) => {
    const f = e.target.files?.[0];
    if (!f) return;

    // Store the current avatar for potential revert
    const currentAvatar = avatar;

    // Clean up any existing blob URL
    if (avatar?.startsWith?.("blob:")) {
      URL.revokeObjectURL(avatar);
    }

    // Create new blob URL for instant preview
    const blobUrl = URL.createObjectURL(f);
    
    // Instant preview with blob URL
    const img = new Image();
    img.onload = () => {
      setAvatar(blobUrl);
      
      // Upload in background after preview is shown
      (async () => {
        try {
          const token = getAuthToken();
          if (!token) throw new Error("Missing auth token");

          const form = new FormData();
          form.append("image", f); // Using "image" as field name as per your API

          console.log("Uploading profile picture...", { 
            url: CHANGE_PICTURE_URL, 
            file: { name: f.name, type: f.type, size: f.size },
            tokenPresent: !!token 
          });
          
          const json = await apiPOSTForm(CHANGE_PICTURE_URL, form, token);
          console.log("Upload response:", json);

          // Check for successful response - adjust based on your API's actual response structure
          const isSuccess = json.success === true || 
                           json.status === "success" || 
                           json.message?.toLowerCase().includes("success") ||
                           json.url || 
                           json.picture;

          if (isSuccess) {
            const maybeUrl = json?.url || json?.picture || json?.data?.url || json?.data?.picture || "";
            
            if (maybeUrl) {
              const absolute = absolutize(maybeUrl);
              const check = new Image();
              check.onload = () => {
                // Only update avatar if the new image loads successfully from server
                setAvatar(absolute);
                URL.revokeObjectURL(blobUrl); // Clean up blob URL
                console.info("Profile picture updated successfully with server URL");
              };
              check.onerror = () => {
                console.warn("Uploaded image URL failed to load, keeping blob preview");
                // Keep the blob preview since server URL doesn't work
              };
              check.src = absolute;
            } else {
              // If no URL in response but API call was successful, keep the blob preview
              console.info("Profile picture updated successfully (no URL returned, keeping blob)");
            }
          } else {
            // API returned error status
            throw new Error(json.message || json.error || "Upload failed without specific error");
          }
        } catch (err) {
          console.error("Failed to upload picture:", err);
          
          // Revert to previous avatar on error
          setAvatar(currentAvatar);
          
          // Revoke the blob URL since we're not using it anymore
          URL.revokeObjectURL(blobUrl);
          
          alert("Couldn't update profile picture. Please try again. Error: " + err.message);
        }
      })();
    };
    
    img.onerror = () => {
      console.error("Failed to load image preview");
      URL.revokeObjectURL(blobUrl);
      setAvatar(currentAvatar);
    };
    
    img.src = blobUrl;
  };

  const updateProfile = async () => {
    setIsSubmitting(true);
    try {
      const token = getAuthToken();
      if (!token) throw new Error("Missing auth token");

      const form = new FormData();
      rows.forEach(row => {
        if (row.editable && row.apiKey && row.inline) {
          let value = row.value;
          if (row.key === "dob" && value) {
            // Convert DMY to ISO if needed, but API expects YYYY-MM-DD
            value = toISO(value);
          }
          form.append(row.apiKey, value || "");
        }
      });

      const response = await apiPOSTForm(`${Base_url}updateProfile`, form, token);
      toast.success(response.message || "Profile updated successfully");
      setIsEditing(false);
    } catch (error) {
      console.error("Update profile error:", error);
      toast.error(error.message || "Failed to update profile");
    } finally {
      setIsSubmitting(false);
    }
  };

  // ===== Populate from API using ONLY user_id from localStorage.auth =====
  useEffect(() => {
    const initFromApi = async () => {
      try {
        const raw = localStorage.getItem("auth");
        if (!raw) throw new Error("auth missing");

        const auth = JSON.parse(raw);

        // pull ONLY the user id; try a few common shapes
        const userId =
          safeGet(auth, ["user.id", "data.user.id", "id", "user_id", "data.user_id"], null);

        if (!userId) throw new Error("user_id not found in localStorage.auth");

        // optional token (recommended for 500s you saw)
        const token =
          safeGet(auth, ["user.token", "data.user.token", "token"], null);

        const headers = {
          Accept: "application/json",
        };
        if (token) headers.Authorization = `Bearer ${token}`;

        // 1) Try GET with Authorization if available
        const getUrl = `${Base_url}userProfile?user_id=${encodeURIComponent(userId)}`;
        let res = await fetch(getUrl, { method: "GET", headers });

        // 2) If server returns 4xx/5xx, try POST as a fallback
        if (!res.ok) {
          console.warn("GET failed, trying POST for userProfile…", res.status);
          const postHeaders = { ...headers, "Content-Type": "application/json" };
          res = await fetch(
            `${Base_url}userProfile`, {
            method: "POST",
            headers: postHeaders,
            body: JSON.stringify({ user_id: userId }),
          });
        }

        if (!res.ok) throw new Error(`HTTP ${res.status}`);

        const payload = await res.json();

        const apiUser = payload?.user ?? {};
        const interests =
          Array.isArray(payload?.interested)
            ? payload.interested
                .map((i) => (i?.title ?? "").trim())
                .filter(Boolean)
                .join(", ")
            : "";

        setUserData(apiUser);

        const mappedData = fieldDefinitions.map((field) => {
          const value = (() => {
            switch (field.key) {
              case "name":
                return apiUser.full_name ?? apiUser.name ?? "N/A";
              case "email":
                return apiUser.email ?? "N/A";
              case "phone":
                return apiUser.phone ?? "N/A";
              case "dob":
                return normalizeDOBToDMY(apiUser.dob ?? apiUser.date_of_birth ?? "") || "N/A";
              case "address":
                return apiUser.address ?? apiUser.street ?? "N/A";
              case "city":
                return apiUser.city ?? "N/A";
              case "country":
                return apiUser.country ?? "N/A";
              case "designation":
                return apiUser.designation ?? apiUser.title ?? "N/A";
              case "education":
                return apiUser.educational_qualification ?? apiUser.education ?? apiUser.degree ?? "N/A";
              case "profession":
                return apiUser.profession ?? apiUser.occupation ?? "N/A";
              case "company":
                return apiUser.company ?? apiUser.organization ?? "N/A";
              case "interests":
                return interests || "N/A";
              default:
                return "N/A";
            }
          })();

          return { ...field, value };
        });

        setRows(mappedData);

        // image or initials fallback (purple-950)
        const name = apiUser.full_name ?? apiUser.name ?? "";
        const photo = apiUser.picture ? absolutize(apiUser.picture) : "";
        if (photo) {
          const img = new Image();
          img.onload = () => setAvatar(photo);
          img.onerror = () => setAvatar(getNameInitialsAvatar(name));
          img.src = photo;
        } else {
          setAvatar(getNameInitialsAvatar(name));
        }
        
        setIsLoading(false);
      } catch (e) {
        console.warn("Failed to load profile from API, falling back:", e);
        // graceful placeholders so UI stays stable
        setRows(fieldDefinitions.map((field) => ({ ...field, value: "N/A" })));
        setAvatar(getNameInitialsAvatar(""));
        setIsLoading(false);
      }
    };

    initFromApi();
  }, []);
  // ===========================================================

  return (
    <section className="min-h-screen bg-white px-4 py-8 sm:py-10">
      {/* Title (unchanged) */}
      <div className="flex justify-center mb-12">
        <span className="inline-flex items-center rounded-lg border border-purple-600 px-5 py-1.5 text-black/80 font-bold text-2xl">
          Personal Details (Profile)
        </span>
      </div>

      {isLoading ? (
        <div className="mx-auto max-w-lg">
          {/* Avatar Shimmer */}
          <div className="flex justify-center mb-4">
            <ShimmerCircularImage  size={150} />
          </div>

          {/* Bio Shimmer */}
          <div className="flex justify-center mb-6">
            <ShimmerTitle line={2} gap={10} variant="primary" />
          </div>

          {/* Profile Fields Shimmer */}
          <div className="space-y-4">
            {[...Array(11)].map((_, i) => (
              <div key={i} className="bg-gray-50 rounded-lg p-4">
                <ShimmerText line={1} gap={10} />
              </div>
            ))}
          </div>

          {/* Button Shimmer */}
          <div className="flex justify-center mt-6">
            <div className="w-40 h-10 bg-gray-200 rounded-md animate-pulse"></div>
          </div>
        </div>
      ) : (
        <>
          {/* Avatar (image or purple-950 initials) */}
          <div className="mt-6 sm:mt-8 flex justify-center">
            <div className="relative">
              {avatar ? (
                <img
                  src={avatar}
                  alt="Profile"
                  className="h-28 w-28 sm:h-32 sm:w-32 rounded-full object-cover ring-4 ring-white border-2 border-purple-600"
                />
              ) : (
                <div className="h-28 w-28 sm:h-32 sm:w-32 rounded-full bg-purple-900 flex items-center justify-center ring-4 ring-white border-2 border-purple-600">
                  <span className="text-2xl text-white font-bold uppercase">Loading</span>
                </div>
              )}
              <button
                type="button"
                className="absolute -bottom-1 -right-1 grid h-8 w-8 place-items-center rounded-full bg-purple-600 text-white shadow"
                aria-label="Change photo"
                onClick={() => fileRef.current?.click()}
              >
                <FiCamera className="text-[18px]" />
              </button>
              <input
                ref={fileRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={onPickAvatar}
              />
            </div>
          </div>

       

          {/* List (only editable fields will be clickable) */}
          <div className="mx-auto mt-6 max-w-lg">
            <div className="divide-y divide-gray-200 border-y border-gray-200 rounded-sm">
              {rows.map((row) => {
                const isEditable = row.editable;
                const isInline = row.inline;
                return (
                  <div
                    key={row.key}
                    className="relative grid w-full grid-cols-12 items-center bg-white px-4 py-3 text-left"
                  >
                    <div className="col-span-5 sm:col-span-4 text-md font-semibold text-gray-700">
                      {row.label}
                    </div>
                    <div className="col-span-6 sm:col-span-7">
                      {isEditing && isEditable && isInline ? (
                        row.key === "dob" ? (
                          <input
                            type="date"
                            value={toISO(row.value) || ""}
                            onChange={(e) => {
                              const newValue = fromISO(e.target.value);
                              setRows(prev => prev.map(r => r.key === row.key ? { ...r, value: newValue } : r));
                            }}
                            className="w-full text-left text-md text-gray-900 border border-gray-300 rounded px-2 py-1 focus:outline-none focus:ring-2 focus:ring-purple-500"
                          />
                        ) : (
                          <input
                            type={row.type}
                            value={row.value || ""}
                            onChange={(e) => {
                              setRows(prev => prev.map(r => r.key === row.key ? { ...r, value: e.target.value } : r));
                            }}
                            className="w-full text-left text-md text-gray-900 border border-gray-300 rounded px-2 py-1 focus:outline-none focus:ring-2 focus:ring-purple-500"
                          />
                        )
                      ) : (
                        <div className="text-right text-md text-gray-600 truncate">
                          {row.value || <span className="opacity-40">&nbsp;</span>}
                        </div>
                      )}
                    </div>
                    {isEditable ? (
                      isInline ? (
                        isEditing ? null : (
                          <HiChevronRight className="col-span-1 ml-2 justify-self-end text-gray-400" />
                        )
                      ) : (
                        <button
                          type="button"
                          onClick={() => openEditor(row.key)}
                          className="col-span-1 ml-2 justify-self-end text-gray-400 hover:text-gray-600"
                        >
                          <HiChevronRight />
                        </button>
                      )
                    ) : (
                      <div className="col-span-1 ml-2 justify-self-end"></div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Update Button */}
          <div className="mx-auto mt-6 max-w-lg flex justify-center">
            <button
              onClick={isEditing ? updateProfile : () => setIsEditing(true)}
              disabled={isSubmitting}
              className="flex items-center gap-2 px-6 py-2 bg-purple-700 text-white rounded-md hover:bg-purple-800 disabled:opacity-50"
            >
              {isSubmitting ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  Updating...
                </>
              ) : isEditing ? (
                <>
                  <FiSave className="h-4 w-4" />
                  Submit
                </>
              ) : (
                <>
                  <FiEdit3 className="h-4 w-4" />
                  Update Profile
                </>
              )}
            </button>
          </div>
        </>
      )}

      {/* Edit modal - will only open for editable fields */}
      <EditModal
        open={!!current}
        label={current?.label || ""}
        type={current?.type || "text"}
        value={current?.value || ""}
        fieldKey={current?.key}
        onClose={closeEditor}
        onSave={saveValue}
      />
    </section>
  );
};

export default Profile;