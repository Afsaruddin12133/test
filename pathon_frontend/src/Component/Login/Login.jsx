import React, { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Base_url } from "../../Config/Api";


const defaultHeaders = {
  "Content-Type": "application/json",
  // "Authorization": "Bearer <YOUR_TOKEN>", // (optional)
};

/**
 * Send OTP to a phone. Return a request/session id if your API provides one.
 */
async function sendOtpToApi(phoneE164) {
  // LOG: phone & intent
  console.log("📱 Sending OTP to:", phoneE164);

  // Extract only the local number without country code
  const localNumber = phoneE164.replace(/^\+\d{2}/, '');
  console.log("📱 Local number without country code:", localNumber);

  const res = await fetch(`${Base_url}sendOtp`, {
    method: "POST",
    headers: defaultHeaders,
    body: JSON.stringify({ phone: localNumber }), // Send only local number
  });

  const data = await res.json().catch(() => ({}));

  // LOG: raw API response + any message field
  console.log("✅ sendOtp response:", data);
  if (data?.message) console.log("📝 sendOtp message:", data.message);

  if (!res.ok) {
    console.log("❌ sendOtp error:", data?.message || res.status);
    throw new Error(data?.message || "Failed to send OTP");
  }

  const requestId =
    data?.request_id ?? data?.session_id ?? data?.data?.request_id ?? null;

  if (requestId) {
    console.log("🆔 request/session id:", requestId);
  } else {
    console.log("ℹ️ No request/session id returned from API.");
  }

  return { requestId, raw: data };
}

/**
 * Verify an OTP. Returns the server payload on success (token/user/etc).
 */
async function verifyOtpWithApi({ phoneE164, code, requestId }) {
  // LOG: verification attempt (avoid logging code in prod)
  console.log("🧪 Verifying OTP for:", phoneE164, "with code:", code, "requestId:", requestId);

  // Extract only the local number without country code
  const localNumber = phoneE164.replace(/^\+\d{2}/, '');
  
  const payload = {
    phone: localNumber, // Send only the local number without country code
    code,
    ...(requestId ? { request_id: requestId } : {}),
  };

  const res = await fetch(`${Base_url}verifyOTP`, {
    method: "POST",
    headers: defaultHeaders,
    body: JSON.stringify(payload),
  });

  const data = await res.json().catch(() => ({}));

  // LOG: raw verify response + any message
  console.log("✅ verifyOTP response:", data);
  if (data?.message) console.log("📝 verifyOTP message:", data.message);

  if (!res.ok || data?.success === false) {
    console.log("❌ verifyOTP failed:", data?.message || res.status);
    throw new Error(data?.message || "Invalid OTP. Please try again.");
  }
  return data;
}

/** --- Tiny inline SVG flags --- */
const FlagBD = () => (
  <svg width="24" height="16" viewBox="0 0 24 16" aria-hidden>
    <rect width="24" height="16" fill="#006a4e" />
    <circle cx="10" cy="8" r="4.5" fill="#f42a41" />
  </svg>
);
const FlagIN = () => (
  <svg width="24" height="16" viewBox="0 0 24 16" aria-hidden>
    <rect width="24" height="16" fill="#ffffff" />
    <rect width="24" height="5.33" y="0" fill="#ff9933" />
    <rect width="24" height="5.33" y="10.67" fill="#128807" />
    <circle cx="12" cy="8" r="2.1" fill="none" stroke="#000088" strokeWidth="0.7" />
    <circle cx="12" cy="8" r="0.4" fill="#000088" />
    {[...Array(24)].map((_, i) => {
      const a = (i * Math.PI * 2) / 24;
      return (
        <line
          key={i}
          x1="12"
          y1="8"
          x2={12 + Math.cos(a) * 2.1}
          y2={8 + Math.sin(a) * 2.1}
          stroke="#000088"
          strokeWidth="0.3"
        />
      );
    })}
  </svg>
);
const FlagPK = () => (
  <svg width="24" height="16" viewBox="0 0 24 16" aria-hidden>
    <rect width="24" height="16" fill="#01411c" />
    <rect width="5" height="16" fill="#fff" />
    <path d="M15 8a4.5 4.5 0 1 1-2.5-4 3.6 3.6 0 1 0 2.5 4z" fill="#fff" />
    <circle cx="15.6" cy="6.2" r="1.1" fill="#fff" />
  </svg>
);

/** --- Country config --- */
const COUNTRIES = [
  { id: "bd", name: "Bangladesh", dial: "+880", maxLocal: 10, Flag: FlagBD, placeholder: "1XXXXXXXXX" },
  { id: "pk", name: "Pakistan", dial: "+92", maxLocal: 10, Flag: FlagPK, placeholder: "3XXXXXXXXX" },
  { id: "in", name: "India", dial: "+91", maxLocal: 10, Flag: FlagIN, placeholder: "9XXXXXXXXX" },
];

/* =========================
   Login (UI unchanged)
   ========================= */
const Login = ({ onContinue }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [country, setCountry] = useState(COUNTRIES[0]); // default BD
  const [local, setLocal] = useState("");
  const [sending, setSending] = useState(false);
  const [error, setError] = useState("");
  const wrapRef = useRef(null);

  useEffect(() => {
    const handler = (e) => {
      if (!wrapRef.current) return;
      if (!wrapRef.current.contains(e.target)) setIsOpen(false);
    };
    document.addEventListener("click", handler);
    return () => document.removeEventListener("click", handler);
  }, []);

  const fullNumber = useMemo(() => `${country.dial}${local}`, [country, local]);
  const digitsCount = local.length;

  const onLocalChange = (e) => {
    const onlyDigits = e.target.value.replace(/\D/g, "");
    setLocal(onlyDigits.slice(0, country.maxLocal));
  };
  const onSelectCountry = (c) => {
    setCountry(c);
    setLocal((prev) => prev.slice(0, c.maxLocal));
    setIsOpen(false);
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    if (local.length < country.maxLocal || sending) return;

    // LOG: user clicked continue + phone number
    console.log("🔔 CONTINUE clicked. Phone:", fullNumber);

    try {
      setSending(true);
      setError("");

      // Send OTP exactly once here
      const { requestId, raw } = await sendOtpToApi(fullNumber);

      // LOG: show any server message about sending SMS
      if (raw?.message) console.log("✉️ Sending message:", raw.message);

      onContinue?.({
        e164: fullNumber,
        display: `${local}`,
        country,
        requestId,
        otpSent: true, // tell parent we already sent
      });

      // LOG: transition to OTP screen
      console.log("➡️ Moving to OTP screen with requestId:", requestId);
    } catch (err) {
      console.log("❌ Error in Login.onSubmit:", err?.message);
      setError(err.message || "Could not send OTP");
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="min-h-[60vh] w-full flex items-start justify-center px-4 sm:px-6 pt-24">
      <form onSubmit={onSubmit} className="w-full max-w-sm">
        <label className="block text-gray-800 font-medium text-xl mb-2">
          Enter your mobile number
        </label>

        <div
          ref={wrapRef}
          className="relative group rounded-lg border-2 border-purple-500 focus-within:ring-2 focus-within:ring-purple-300 transition"
        >
          <div className="flex items-center px-3 py-2">
            <button
              type="button"
              onClick={() => setIsOpen((p) => !p)}
              className="flex items-center gap-2 px-2 py-1 rounded-md border border-purple-200 hover:bg-blue-50 focus:outline-none"
              aria-haspopup="listbox"
              aria-expanded={isOpen}
            >
              <country.Flag />
              <span className="font-semibold text-gray-900">{country.dial}</span>
              <svg className="w-4 h-4 text-gray-600" viewBox="0 0 20 20" fill="currentColor" aria-hidden>
                <path
                  fillRule="evenodd"
                  d="M5.23 7.21a.75.75 0 011.06.02L10 10.94l3.71-3.71a.75.75 0 111.06 1.06l-4.24 4.24a.75.75 0 01-1.06 0L5.21 8.29a.75.75 0 01.02-1.08z"
                  clipRule="evenodd"
                />
              </svg>
            </button>

            <input
              type="tel"
              inputMode="numeric"
              pattern="[0-9]*"
              value={local}
              onChange={onLocalChange}
              placeholder={country.placeholder}
              className="ml-3 flex-1 outline-none text-gray-900 placeholder-gray-400 text-[18px]"
              aria-label="Phone number without country code"
            />
          </div>

          <div className="absolute bottom-1 right-2 text-gray-500 text-sm">
            {digitsCount}/{country.maxLocal}
          </div>

          {isOpen && (
            <ul
              className="absolute z-50 mt-1 bg-white border border-gray-200 rounded-md shadow-lg w-72 max-h-64 overflow-auto"
              role="listbox"
            >
              {COUNTRIES.map((c) => (
                <li key={c.id}>
                  <button
                    type="button"
                    onClick={() => onSelectCountry(c)}
                    className="w-full flex items-center gap-3 px-3 py-2 hover:bg-blue-50 focus:bg-blue-50"
                    role="option"
                    aria-selected={country.id === c.id}
                  >
                    <c.Flag />
                    <div className="flex flex-col items-start">
                      <span className="text-gray-900 font-medium">{c.name}</span>
                      <span className="text-gray-600 text-sm">{c.dial}</span>
                    </div>
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>

        <button
          type="submit"
          disabled={local.length !== country.maxLocal || sending}
          className="mt-8 w-full rounded-md bg-purple-700 hover:bg-purple-800 disabled:bg-purple-300 text-white font-extrabold tracking-wide py-3 transition"
        >
          {sending ? "SENDING..." : "CONTINUE"}
        </button>

        <p className="mt-4 text-md text-gray-600">
          By tapping <span className="font-semibold">“continue”</span> you acknowledge your acceptance of our{" "}
          <a href="/terms" className="text-purple-700 font-semibold hover:underline">Terms of Use</a> and{" "}
          <a href="privacy-policy" className="text-purple-700 font-semibold hover:underline">Privacy Policy</a>.
        </p>

        {error && <p className="mt-3 text-red-600 text-sm">{error}</p>}
      </form>
    </div>
  );
};

/* =========================
   OTP Verification screen (UI unchanged)
   ========================= */
const OtpVerify = ({
  phoneMasked = "01885374041",
  onVerifySuccess,
  onResend,
  onVerify, // async (code) => void (throws on error)
  otpLength = 4,
  durationSec = 300,
}) => {
  const [values, setValues] = useState(Array(otpLength).fill(""));
  const [timeLeft, setTimeLeft] = useState(durationSec);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const inputsRef = useRef([]);

  // countdown
  useEffect(() => {
    if (timeLeft <= 0) return;
    const t = setInterval(() => setTimeLeft((s) => s - 1), 1000);
    return () => clearInterval(t);
  }, [timeLeft]);

  const mm = String(Math.floor(timeLeft / 60)).padStart(2, "0");
  const ss = String(timeLeft % 60).padStart(2, "0");

  const handleChange = (idx, v) => {
    const d = v.replace(/\D/g, "");
    if (!d) return;
    setError("");
    setValues((prev) => {
      const next = [...prev];
      next[idx] = d.slice(-1);
      return next;
    });
    if (idx < otpLength - 1) {
      inputsRef.current[idx + 1]?.focus();
    }
  };

  const handleKeyDown = (idx, e) => {
    if (e.key === "Backspace") {
      e.preventDefault();
      setValues((prev) => {
        const next = [...prev];
        if (next[idx]) {
          next[idx] = "";
        } else if (idx > 0) {
          inputsRef.current[idx - 1]?.focus();
          next[idx - 1] = "";
        }
        return next;
      });
    }
    if (e.key === "ArrowLeft" && idx > 0) inputsRef.current[idx - 1]?.focus();
    if (e.key === "ArrowRight" && idx < otpLength - 1) inputsRef.current[idx + 1]?.focus();
  };

  const filled = values.every((v) => v !== "");
  const code = values.join("");

  const verify = async (e) => {
    e.preventDefault();
    if (!filled || timeLeft <= 0 || loading) return;

    // LOG: user is attempting to verify + code
    console.log("🔐 VERIFY clicked. Code entered:", code);

    try {
      setLoading(true);
      setError("");
      await onVerify?.(code); // throws if invalid
      console.log("🎉 OTP verified successfully.");
      onVerifySuccess?.(code);
    } catch (err) {
      console.log("❌ OTP verify error:", err?.message);
      setError(err.message || "Invalid OTP. Please try again.");
      setValues(Array(otpLength).fill(""));
      setTimeout(() => inputsRef.current[0]?.focus(), 0);
    } finally {
      setLoading(false);
    }
  };

  const resend = async () => {
    setValues(Array(otpLength).fill(""));
    setError("");
    setTimeLeft(durationSec);

    // LOG: resend intent
    console.log("↻ Resending OTP...");
    await onResend?.();
    console.log("✅ Resent OTP.");

    setTimeout(() => inputsRef.current[0]?.focus(), 0);
  };

  return (
    <div className="min-h-[60vh] w-full flex items-start justify-center px-4 sm:px-6 pt-24">
      <form onSubmit={verify} className="w-full max-w-md text-center">
        <h1 className="text-2xl font-extrabold text-purple-700 tracking-wide">OTP VERIFICATION</h1>
        <p className="mt-4 text-lg text-gray-700">
          OTP has been sent to <span className="font-semibold">{phoneMasked}</span>
        </p>

        <div className="mt-3 text-2xl font-extrabold tracking-widest">
          {`00 : ${mm} : ${ss}`}
        </div>

        <div className="mt-6 flex items-center justify-center gap-4">
          {values.map((v, i) => (
            <input
              key={i}
              ref={(el) => (inputsRef.current[i] = el)}
              value={v}
              onChange={(e) => handleChange(i, e.target.value)}
              onKeyDown={(e) => handleKeyDown(i, e)}
              inputMode="numeric"
              pattern="[0-9]*"
              className={`w-12 h-12 text-center rounded-md border-2 ${
                v ? "border-purple-500" : "border-gray-300"
              } text-xl font-bold outline-none focus:border-purple-600`}
              maxLength={1}
            />
          ))}
        </div>

        {error && <p className="mt-3 text-red-600 text-sm">{error}</p>}

        {timeLeft > 0 ? (
          <button
            type="submit"
            disabled={!filled || loading}
            className="mt-6 px-6 py-2.5 rounded-md bg-purple-700 hover:bg-purple-800 disabled:bg-purple-300 text-white font-bold"
          >
            {loading ? "VERIFYING..." : "VERIFY OTP"}
          </button>
        ) : (
          <button
            type="button"
            onClick={resend}
            className="mt-6 px-6 py-2.5 rounded-md bg-purple-700 hover:bg-purple-800 text-white font-bold"
          >
            RESEND OTP
          </button>
        )}
      </form>
    </div>
  );
};

/* =========================
   Parent glue (no routing)
   ========================= */
const AuthPage = () => {
  const navigate = useNavigate();
  const [stage, setStage] = useState("phone"); // "phone" | "otp" | "done"
  const [phone, setPhone] = useState(null); // { e164, display, country }
  const [requestId, setRequestId] = useState(null); // for APIs that require it

  // Do NOT re-send here if Login already sent.
  const handleContinue = async ({
    e164,
    display,
    country,
    requestId: initialReqId,
    otpSent,
  }) => {
    let reqId = initialReqId ?? null;

    // LOG: received from Login
    console.log("➡️ handleContinue received:", { e164, display, otpSent, initialReqId });

    if (!otpSent) {
      console.log("⚠️ Login didn't send OTP, sending from parent…");
      const sent = await sendOtpToApi(e164);
      reqId = sent.requestId ?? null;
    }

    setPhone({ e164, display, country });
    setRequestId(reqId);
    setStage("otp");

    // LOG: move to OTP step
    console.log("📦 Stored phone:", { e164, display }, "requestId:", reqId, "→ stage: otp");
  };

  const handleResend = async () => {
    console.log("↻ Parent: resend requested to:", phone?.e164);
    const sent = await sendOtpToApi(phone?.e164);
    setRequestId(sent.requestId ?? null);
    console.log("✅ Parent: resend done. New requestId:", sent.requestId ?? null);
  };

  const handleVerify = async (code) => {
  console.log("🔐 Parent: verifying code:", code, "for phone:", phone?.e164);
  
  // Extract local number for all operations
  const localNumber = phone?.e164.replace(/^\+\d{2}/, '');
  console.log("📱 Using local number:", localNumber);
  
  const result = await verifyOtpWithApi({
    phoneE164: phone?.e164, // The function will extract local number
    code,
    requestId,
  });
  console.log("🎉 Parent: verification success. Message:", result?.message);
  setStage("done");
  const phoneState = { phone: phone?.e164 };
  
  if (result?.message === 'user not found') {
    navigate('/signup', { state: phoneState });
  } else if (result?.message === 'user found') {
    try {
      // Make login API call
      const loginRes = await fetch(`${Base_url}login`, {
        method: 'POST',
        headers: defaultHeaders,
        body: JSON.stringify({ phone: localNumber }) // Use local number without country code
      });

      const loginData = await loginRes.json();
      console.log("🔑 Login response:", loginData);

      if (!loginRes.ok) {
        throw new Error(loginData?.message || 'Login failed');
      }

      // Extract user and token from login response
      const token = loginData?.token ?? loginData?.accessToken ?? loginData?.data?.token ?? null;
      const user = loginData?.user ?? loginData?.data?.user ?? null;

      // Log user information if found
      if (user) {
        console.log('👤 Logged in User Details:', {
          id: user.id,
          token: user.token,
          name: user.full_name || user.name,
          email: user.email,
          phone: user.phone || phone?.e164,
          interests: user.tagList || user.interests || [],
          dob: user.dob,
          joinedAt: user.active_since,
        });
      }

      // Store in localStorage
      localStorage.setItem(
        'auth',
        JSON.stringify({
          token,
          user,
          phone: localNumber, // Store local number in localStorage
          ts: Date.now(),
        })
      );
      console.log('💾 Auth saved to localStorage.');
      
      // Navigate to dashboard after successful login
      navigate('/', { state: phoneState });
    } catch (error) {
      console.error('❌ Login error:', error);
      throw new Error('Login failed. Please try again.');
    }
  } else {
    // fallback: stay or show error
    console.log('⚠️ Unexpected message:', result?.message);
  }
};

  if (stage === "phone") return <Login onContinue={handleContinue} />;

  if (stage === "otp")
    return (
      <OtpVerify
        phoneMasked={phone?.display ? `0${phone.display}` : ""}
        durationSec={300}
        onResend={handleResend}
        onVerify={handleVerify}
        onVerifySuccess={() => {}}
      />
    );

  return null;
};

export default AuthPage;

