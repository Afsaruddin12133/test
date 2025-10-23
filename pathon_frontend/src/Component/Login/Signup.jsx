import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Base_url } from "../../Config/Api";

const Signup = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const phoneFromOtp = location.state?.phone || "";
  const [fullName, setFullName] = useState("");
  const [email, setContact] = useState("");
  const [interestInput, setInterestInput] = useState("");
  const [interests, setInterests] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const addInterest = (val) => {
    const v = (val || interestInput).trim();
    if (!v) return;
    if (!interests.includes(v)) {
      setInterests((prev) => [...prev, v]);
    }
    setInterestInput("");
  };

  const removeInterest = (val) =>
    setInterests((prev) => prev.filter((x) => x !== val));

  const onInterestKeyDown = (e) => {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      addInterest();
    }
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    try {
      const formData = new FormData();
      formData.append('phone', phoneFromOtp);
      formData.append('full_name', fullName);
      formData.append('tagList', JSON.stringify(interests));
      formData.append('email', email);

      console.log("Signup form data:", {
        phone: phoneFromOtp,
        full_name: fullName,
        tagList: interests,
        email: email
      });

      const res = await fetch(
        `${Base_url}signUp`,
        {
          method: "POST",
          mode: 'cors',
          body: formData,
        }
      );

      const text = await res.text();
      let data;
      try {
        data = JSON.parse(text);
      } catch {
        console.error("Signup API error: Response was not valid JSON.");
        console.error("Raw response:", text);
        throw new Error("Signup failed: Server did not return valid JSON.");
      }

      if (!res.ok) {
        throw new Error(data.message || "Signup failed");
      }

      // Persist auth to localStorage on successful signup
      const token =
        data?.token ??
        data?.accessToken ??
        data?.data?.token ??
        data?.data?.accessToken ??
        null;
      const user =
        data?.user ??
        data?.data?.user ??
        { full_name: fullName, email, phone: phoneFromOtp };
      try {
        localStorage.setItem(
          "auth",
          JSON.stringify({
            token,
            user,
            phone: phoneFromOtp,
            ts: Date.now(),
          })
        );
        console.log("💾 Auth saved to localStorage (signup).");
      } catch (e) {
        console.warn("⚠️ Failed to persist auth:", e);
      }

  setSuccess("login success");
  console.log("Signup success:", data);
  navigate("/");
    } catch (err) {
      setError(err.message);
      console.error("Signup error:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="py-20 grid place-items-center bg-white font-sans text-neutral-900">
      <h1 className="text-center text-3xl font-bold text-purple-700 mb-2">
        Create an Account
      </h1>
      <form
        onSubmit={onSubmit}
        className="w-[400px] max-w-[60vw] flex flex-col gap-4"
      >
        <input
          type="text"
          placeholder="Full Name"
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
          required
          className="w-full h-12 rounded-lg border-2 border-slate-200 px-4 text-base outline-none focus:border-slate-300"
        />

        <input
          type="email"
          placeholder="Enter E-mail"
          value={email}
          onChange={(e) => setContact(e.target.value)}
          required
          className="w-full h-12 rounded-lg border-2 border-slate-200 px-4 text-base outline-none focus:border-slate-300"
        />

        {/* Interested Area */}
        <div className="w-full">
          <div className="relative">
            <input
              type="text"
              placeholder="Enter Your Interested Area"
              value={interestInput}
              onChange={(e) => setInterestInput(e.target.value)}
              onKeyDown={onInterestKeyDown}
              className="w-full h-12 rounded-lg border-2 border-slate-200 pr-12 px-4 text-base outline-none focus:border-slate-300"
            />
            <button
              type="button"
              aria-label="Add interest"
              onClick={() => addInterest()}
            ></button>
          </div>

          {/* Selected chips */}
          {interests.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-2">
              {interests.map((it) => (
                <span
                  key={it}
                  className="inline-flex items-center gap-1 rounded-md border border-blue-200 bg-blue-50 px-2 py-1 text-xs"
                >
                  {it}
                  <button
                    type="button"
                    title="Remove"
                    onClick={() => removeInterest(it)}
                    className="h-4 w-4 grid place-items-center rounded-sm border border-blue-300 bg-white leading-none"
                  >
                    –
                  </button>
                </span>
              ))}
            </div>
          )}
        </div>

        <button
          type="submit"
          disabled={loading}
          className="py-2 rounded-lg bg-purple-700 text-white font-bold text-md tracking-wide hover:bg-purple-800 transition-colors disabled:opacity-70"
        >
          {loading ? "Creating..." : "CREATE AN ACCOUNT"}
        </button>

        {error && (
          <p className="text-red-600 text-center text-sm">{error}</p>
        )}
        {success && (
          <p className="text-green-600 text-center text-sm">{success}</p>
        )}

        <p className="text-center text-sm text-neutral-600 leading-relaxed mt-2">
          By selecting <strong>“CREATE AN ACCOUNT”</strong> you acknowledge your
          acceptance of our{" "}
          <a href="/terms" className="text-purple-700 font-semibold">
            Terms of Use
          </a>{" "}
          and{" "}
          <a href="/privacy-policy" className="text-purple-700 font-semibold">
            Privacy Policy
          </a>
          .
        </p>
      </form>
    </div>
  );
};

export default Signup;
