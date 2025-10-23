import React, { useState, useRef, useEffect, useMemo } from "react";
import { FiSearch, FiX, FiMenu } from "react-icons/fi";
import { Link, useNavigate } from "react-router-dom";
import { Base_url } from "../Config/Api";
import SearchPopup from "./SearchPopup"; // ← new
import defaultImage from "../Images/4.jpg";

/* 🔵 Per-tab cache for Header Avatar profile fetch */
let headerProfileData = null;          // { pictureAbsUrl, full_name, ... }  (shape kept minimal)
let headerProfilePromise = null;       // in-flight dedupe

const makeImageUrl = (path) => {
  if (!path) return "";
  if (/^https?:\/\//i.test(path)) return path;
  const base = (Base_url || "").replace(/\/+$/, "");
  const origin = base.replace(/\/api$/i, "");
  const normalizedPath = path.replace(/^\/+/, "");
  return origin ? `${origin}/${normalizedPath}` : normalizedPath;
};

const Header = () => {
  const navigate = useNavigate();
  const [searchText, setSearchText] = useState("");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false);
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);
  const [apiResults, setApiResults] = useState([]);
  const [searchLoading, setSearchLoading] = useState(false);
  const profileDropdownRef = useRef(null);
  const searchDebounceRef = useRef(null);

  // Helper to read and normalize auth token from various shapes
  const readAuth = () => {
    try {
      const raw = localStorage.getItem("auth");
      console.log("🔍 Initial/Sync auth read - raw:", raw);
      if (!raw) return null;
      const parsed = JSON.parse(raw);
      const token =
        parsed?.token ??
        parsed?.accessToken ??
        parsed?.data?.token ??
        parsed?.data?.accessToken ??
        parsed?.user?.token ??
        null;
      console.log("🔐 Normalized auth:", { hasToken: !!token });
      return token ? { ...parsed, token } : parsed;
    } catch (err) {
      console.error("❌ Error reading auth:", err);
      return null;
    }
  };

  const [authData, setAuthData] = useState(() => readAuth());

  // Robust isAuthed check
  const isAuthed = useMemo(() => {
    const token =
      authData?.token ??
      authData?.accessToken ??
      authData?.data?.token ??
      authData?.data?.accessToken ??
      authData?.user?.token ??
      null;
    const ok = Boolean(token);
    console.log("🚀 Auth state:", { isAuthed: ok, hasData: !!authData });
    return ok;
  }, [authData]);

  const mobileMenuRef = useRef(null);

  const showResults = Boolean(searchText.trim()) || searchLoading;

  useEffect(() => {
    if (!searchText.trim()) {
      setApiResults([]);
      setSearchLoading(false);
      return;
    }

    setSearchLoading(true);

    if (searchDebounceRef.current) clearTimeout(searchDebounceRef.current);

    searchDebounceRef.current = setTimeout(async () => {
      try {
        const token = authData?.token;
        const headers = { Accept: "application/json" };
        if (token) headers.Authorization = `Bearer ${token}`;

        const url = `${Base_url}searchQuery?query=${encodeURIComponent(searchText.trim())}&page=1`;
        const response = await fetch(url, { headers });

        if (!response.ok) throw new Error("Search failed");

        const data = await response.json();
        const mapped = (data?.data || []).map(item => {
          const cover = makeImageUrl(item.headerImageVideo);
          return {
            ...item,
            cover: cover || defaultImage,
            classType: item.type === 1 ? "Live" : item.type === 2 ? "Record" : "Problem",
            enrolCount: item.buyer_count,
            reviewCount: item.rating_count,
          };
        });
        setApiResults(mapped);
      } catch (error) {
        console.error("Search error:", error);
        setApiResults([]);
      } finally {
        setSearchLoading(false);
      }
    }, 300);

    return () => {
      if (searchDebounceRef.current) clearTimeout(searchDebounceRef.current);
    };
  }, [searchText, authData?.token]);

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "Escape") {
        setMobileMenuOpen(false);
        setMobileSearchOpen(false);
        setShowProfileDropdown(false);
      }
    };
    const onClickAway = (e) => {
      if (mobileMenuRef.current && !mobileMenuRef.current.contains(e.target)) {
        setMobileMenuOpen(false);
      }
      if (profileDropdownRef.current && !profileDropdownRef.current.contains(e.target)) {
        setShowProfileDropdown(false);
      }
    };
    document.addEventListener("keydown", onKey);
    document.addEventListener("mousedown", onClickAway);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.removeEventListener("mousedown", onClickAway);
    };
  }, []);

  // Keep auth in sync if localStorage changes
  useEffect(() => {
    const syncAuth = () => {
      const next = readAuth();
      setAuthData(next);
    };
    syncAuth();
    window.addEventListener("storage", syncAuth);
    window.addEventListener("focus", syncAuth);
    return () => {
      window.removeEventListener("storage", syncAuth);
      window.removeEventListener("focus", syncAuth);
    };
  }, []);

  const handleLogout = () => {
    try {
      localStorage.removeItem("auth");
      localStorage.removeItem("authMeta");
      console.log("🚪 Logged out - auth data removed");
    } catch (err) {
      console.error("❌ Error during logout:", err);
    }
    setAuthData(null);
    setMobileMenuOpen(false);
    navigate("/signin");
  };

  // ===== Avatar helper (fetch profile image from API if available) =====
  const Avatar = ({ user, size = 32 }) => {
    const [imgUrl, setImgUrl] = useState(headerProfileData?.pictureAbsUrl ?? null);
    const [imgOk, setImgOk] = useState(true);

    const fullName = user?.full_name || "";

    // derive initials
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
      return a + b;
    };
    const initials = useMemo(() => getTwoInitials(fullName), [fullName]);

    // absolutize relative URLs
    const absolutize = (maybeRelative) => {
      if (!maybeRelative) return "";
      if (/^https?:\/\//i.test(maybeRelative)) return maybeRelative;
      return `https://apidocumentationpathon.pathon.app/${maybeRelative.replace(/^\/+/, "")}`;
    };

    useEffect(() => {
      // If cache already has the profile, use it and skip fetching.
      if (headerProfileData?.pictureAbsUrl) {
        setImgUrl(headerProfileData.pictureAbsUrl);
        setImgOk(true);
        return;
      }

      // If a request is already in-flight, chain to it; otherwise start a new one.
      if (!headerProfilePromise) {
        headerProfilePromise = (async () => {
          try {
            const authRaw = localStorage.getItem("auth") || "{}";
            let parsed = {};
            let userToken = null;
            try {
              parsed = JSON.parse(authRaw);
              userToken = parsed?.user?.token ?? parsed?.token ?? null;
            } catch {
              /* ignore parse error */
            }
            const userId = parsed?.user?.id ?? null;

            if (!userId || !userToken) {
              // cache a null result to avoid repeated attempts in this tab
              headerProfileData = { pictureAbsUrl: null, full_name: parsed?.user?.full_name ?? "" };
              return headerProfileData;
            }

            const res = await fetch(
              `https://apidocumentationpathon.pathon.app/api/userProfile?user_id=${encodeURIComponent(
                userId
              )}`,
              {
                method: "GET",
                headers: {
                  Accept: "application/json",
                  "Content-Type": "application/json",
                  Authorization: `Bearer ${userToken}`,
                },
              }
            );

            if (!res.ok) {
              headerProfileData = { pictureAbsUrl: null, full_name: parsed?.user?.full_name ?? "" };
              return headerProfileData;
            }

            const payload = await res.json();
            const photo = payload?.user?.picture;
            const pictureAbsUrl = photo ? absolutize(photo) : null;

            headerProfileData = {
              pictureAbsUrl,
              full_name: payload?.user?.full_name ?? parsed?.user?.full_name ?? "",
            };
            return headerProfileData;
          } catch (err) {
            // Cache a null to prevent re-hammering endpoint in this tab
            headerProfileData = { pictureAbsUrl: null, full_name: fullName };
            throw err;
          } finally {
            headerProfilePromise = null;
          }
        })();
      }

      // Use the promise result to update local state
      headerProfilePromise
        .then((data) => {
          if (data?.pictureAbsUrl) {
            setImgUrl(data.pictureAbsUrl);
            setImgOk(true);
          }
        })
        .catch((err) => {
          console.warn("Avatar API fetch failed:", err);
        });
    }, [fullName]);

    const sizeStyle = { width: size, height: size };

    if (imgUrl && imgOk) {
      return (
        <span className="inline-block" style={sizeStyle}>
          <img
            src={imgUrl}
            alt={fullName || "Profile"}
            className="w-full h-full rounded-full object-cover"
            onError={() => setImgOk(false)}
          />
        </span>
      );
    }

    // fallback: initials in purple-950
    return (
      <span
        className="inline-flex items-center justify-center rounded-full bg-white text-purple-950 font-bold select-none"
        style={sizeStyle}
        aria-label={fullName || "Profile"}
      >
        <span className="text-lg">{initials}</span>
      </span>
    );
  };
  // ===== End Avatar helper =====

  return (
    <header className="sticky top-0 z-50 w-full bg-purple-950 text-white backdrop-blur border-b border-purple-900">
      {/* ——— Popup + full-screen blur (desktop + mobile) ——— */}
      <SearchPopup
        visible={showResults}
        results={apiResults}
        loading={searchLoading}
        onClose={() => setSearchText("")}
        onPick={() => {
          setMobileMenuOpen(false);
          setMobileSearchOpen(false);
        }}
      />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-18 items-center justify-between">
          {/* Left: Logo */}
          <div className="flex items-center gap-3">
            <Link
              to={"/"}
              className="text-white font-extrabold text-2xl sm:text-3xl tracking-tight"
            >
              pathon
            </Link>
          </div>

          {/* Center: Search (inline on sm+; icon on mobile) */}
          <div className="flex-1 px-2 sm:px-4 flex justify-center">
            <div className="hidden sm:flex items-center border border-purple-700 rounded-full px-3 py-2.5 w-full max-w-xs md:max-w-md lg:max-w-lg xl:max-w-2xl shadow-sm relative z-50 bg-purple-900">
              <input
                type="text"
                placeholder="Search for anything..."
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
                className="flex-1 outline-none text-sm md:text-base bg-transparent placeholder:text-purple-300 text-white"
                aria-label="Search"
              />
              {searchText && (
                <button
                  onClick={() => setSearchText("")}
                  className="text-purple-300 hover:text-white"
                  aria-label="Clear search"
                >
                  <FiX className="h-5 w-5" />
                </button>
              )}
              <button className="ml-2 text-purple-300 hover:text-white" aria-label="Submit search">
                <FiSearch className="h-5 w-5" />
              </button>
            </div>
          </div>

          {/* Right: Auth + Menu (DESKTOP) */}
          <div className="hidden md:flex items-center gap-2 text-sm font-semibold">
            {!isAuthed ? (
              <>
                <Link
                  to="/signin"
                  className="px-4 py-2 border border-purple-700 rounded-md hover:bg-purple-900"
                >
                  Signin
                </Link>
                <Link
                  to="/signin"
                  className="px-4 py-2 rounded-md text-purple-950 bg-white hover:bg-purple-100"
                >
                  Sign up
                </Link>
              </>
            ) : (
              <>
                <div className="relative">
                  <button
                    onClick={() => setShowProfileDropdown((prev) => !prev)}
                    className="px-4 py-0 rounded-full"
                  >
                    <Avatar user={authData?.user} size={38} />
                  </button>

                  {/* Profile Dropdown */}
                  {showProfileDropdown && (
                    <div
                      ref={profileDropdownRef}
                      className="absolute right-0 mt-2 w-48 bg-purple-900 rounded-lg shadow-lg py-1 border border-purple-800"
                    >
                      <Link
                        to="/profile"
                        className="block px-4 py-2 text-sm text-white hover:text-purple-950 hover:bg-white duration-500 rounded-md"
                        onClick={() => setShowProfileDropdown(false)}
                      >
                        Profile
                      </Link>
                      <Link
                        to="/transaction"
                        className="block px-4 py-2 text-sm text-white hover:text-purple-950 hover:bg-white duration-500 rounded-md"
                        onClick={() => setShowProfileDropdown(false)}
                      >
                        Transaction
                      </Link>
                      <button
                        onClick={() => {
                          setShowProfileDropdown(false);
                          handleLogout();
                        }}
                        className="block w-full text-left px-4 py-2 text-sm text-white hover:text-purple-950 hover:bg-white duration-500 rounded-md"
                      >
                        Logout
                      </button>
                    </div>
                  )}
                </div>
              </>
            )}
          </div>

          {/* Mobile menu button */}
          <button
            className="md:hidden inline-flex items-center justify-center p-2 rounded-md hover:bg-purple-900"
            onClick={() => setMobileMenuOpen((v) => !v)}
            aria-label="Toggle menu"
            aria-expanded={mobileMenuOpen}
            aria-controls="mobile-menu"
          >
            {mobileMenuOpen ? <FiX className="h-6 w-6" /> : <FiMenu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Search Overlay */}
      {mobileSearchOpen && (
        <div className="sm:hidden fixed inset-0 z-50 bg-purple-950/95 p-4">
          <div className="relative z-50 flex items-center gap-2 border border-purple-700 rounded-full px-3 py-2.5 shadow-sm bg-purple-900">
            <button
              onClick={() => setMobileSearchOpen(false)}
              className="p-1 -ml-1 rounded-full hover:bg-purple-800"
              aria-label="Close search"
            >
              <FiX className="h-6 w-6" />
            </button>
            <input
              autoFocus
              type="text"
              placeholder="Search for anything..."
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              className="flex-1 outline-none text-base bg-transparent placeholder:text-purple-300 text-white"
              aria-label="Search"
            />
            {searchText && (
              <button
                onClick={() => setSearchText("")}
                className="text-purple-300 hover:text-white"
                aria-label="Clear search"
              >
                <FiX className="h-5 w-5" />
              </button>
            )}
            <button className="ml-2 text-purple-300 hover:text-white" aria-label="Submit search">
              <FiSearch className="h-5 w-5" />
            </button>
          </div>
        </div>
      )}

      {/* Mobile Menu Panel */}
      <div
        id="mobile-menu"
        ref={mobileMenuRef}
        className={`md:hidden transition-all duration-200 ease-out overflow-hidden border-t border-purple-800 ${
          mobileMenuOpen ? "max-h-80" : "max-h-0"
        }`}
      >
        <div className="px-4 py-3 space-y-2">
          <div className="sm:hidden relative z-50 flex items-center border border-purple-700 rounded-full px-3 py-2.5 bg-purple-900">
            <input
              type="text"
              placeholder="Search for anything..."
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              className="flex-1 outline-none text-sm bg-transparent placeholder:text-purple-300 text-white"
              aria-label="Search"
            />
            {searchText && (
              <button
                onClick={() => setSearchText("")}
                className="text-purple-300 hover:text-white"
                aria-label="Clear search"
              >
                <FiX className="h-5 w-5" />
              </button>
            )}
            <button className="ml-2 text-purple-300 hover:text-white" aria-label="Submit search">
              <FiSearch className="h-5 w-5" />
            </button>
          </div>

          {!isAuthed ? (
            <>
              <Link
                to="/signin"
                className="block w-full text-center px-4 py-2 border border-purple-700 rounded-md hover:bg-purple-900"
                onClick={() => setMobileMenuOpen(false)}
              >
                Login
              </Link>
              <Link
                to="/signin"
                className="block w-full text-center px-4 py-2 rounded-md text-purple-950 bg-white hover:bg-purple-100"
                onClick={() => setMobileMenuOpen(false)}
              >
                Sign up
              </Link>
            </>
          ) : (
            <>
              <div className="space-y-1">
                <Link
                  to="/profile"
                  className="block w-full text-center px-4 py-2 border border-purple-700 rounded-md text-white hover:text-purple-950 hover:bg-white duration-500"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <span className="inline-flex items-center justify-center gap-2">
                    {/* <Avatar user={authData?.user} size={32} /> */}
                    <span className="">Profile</span>
                  </span>
                </Link>
                <Link
                  to="/transaction"
                  className="block w-full text-center px-4 py-2 border border-purple-700 rounded-md text-white hover:text-purple-950 hover:bg-white duration-500"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <span className="">Transaction</span>
                </Link>
                <button
                  type="button"
                  onClick={handleLogout}
                  className="block w-full text-center px-4 py-2 border border-purple-700 rounded-md text-white hover:text-purple-950 hover:bg-white duration-500"
                >
                  Logout
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
