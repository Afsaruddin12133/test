// src/components/Transaction.jsx
import React, { useMemo, useState, useEffect, useCallback, useRef } from "react";
import { Link, useLocation } from "react-router-dom";
import { Base_url } from "../../Config/Api";
import { getUserId, getUserToken } from "../../Auth/auth";
import { ToastContainer, toast } from 'react-toastify';



const MONTHS = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];

const makeImageUrl = (path) => {
  if (!path) return "";
  if (/^https?:\/\//i.test(path)) return path;
  const base = (Base_url || "").replace(/\/+$/, "");
  const origin = base.replace(/\/api$/i, "");
  const normalizedPath = path.replace(/^\/+/, "");
  return origin ? `${origin}/${normalizedPath}` : normalizedPath;
};

const extractUserIdFromText = (value) => {
  if (value == null) return null;
  if (typeof value === "number" && Number.isFinite(value)) {
    return String(value);
  }
  if (typeof value !== "string") return null;

  const trimmed = value.trim();
  if (trimmed === "" || trimmed === "--") return null;
  if (/^\d+$/.test(trimmed)) return trimmed;

  const match = trimmed.match(/(?:user[_\s-]*id|id|uid|#)\s*[:#-]?\s*(\d{3,})/i);
  if (match && match[1]) {
    return match[1];
  }

  const fallbackDigits = trimmed.match(/(\d{3,})/);
  if (fallbackDigits && fallbackDigits[1]) {
    return fallbackDigits[1];
  }

  return null;
};

const Tip = ({ active, payload, label }) => {
  if (active && payload && payload.length && Number.isFinite(payload[0].value)) {
    return (
      <div className="rounded-md bg-white shadow px-2.5 py-1 text-xs font-semibold text-purple-700 border border-purple-100">
        {label}: {payload[0].value.toFixed(1)}k
      </div>
    );
  }
  return null;
};

function AmountInputModal({ title, cta, onClose, onConfirm }) {
  const [amount, setAmount] = useState("");
  const isValid = amount.trim() !== "";

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 backdrop-blur-sm p-4"
      onClick={onClose}
    >
      <div
        className="w-[92vw] max-w-md rounded-2xl bg-white shadow-xl border border-gray-100 p-5 sm:p-6 relative"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-800">{title}</h3>
          <button
            onClick={onClose}
            className="grid place-items-center w-8 h-8 rounded-full bg-red-500 text-white text-xl leading-none"
            aria-label="Close"
            type="button"
          >
            ×
          </button>
        </div>
        <div className="mt-4">
          <input
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="Enter the amount (BDT)"
            type="number"
            min="1"
            className="w-full rounded-lg border border-purple-300 focus:border-purple-500 focus:ring-2 focus:ring-purple-200 outline-none px-4 py-2.5 text-gray-800"
          />
        </div>
        <button
          type="button"
          disabled={!isValid}
          className={`mt-6 w-full rounded-md text-white font-bold tracking-wide py-3 transition
            ${isValid ? "bg-purple-600 hover:bg-purple-700" : "bg-purple-300 cursor-not-allowed"}`}
          onClick={() => isValid && onConfirm(amount.trim())}
        >
          {cta} via SSLCOMMERZ
        </button>
        <p className="mt-3 text-xs text-gray-500 text-center">
          Payment options (Bkash, Visa, Master) will be shown by SSLCOMMERZ gateway.
        </p>
      </div>
    </div>
  );
}

function WithdrawInputModal({ title, cta, onClose, onConfirm }) {
  const [amount, setAmount] = useState("");
  const [method, setMethod] = useState("");
  const [number, setNumber] = useState("");
  const isValid = amount.trim() !== "" && method.trim() !== "" && number.trim() !== "";

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 backdrop-blur-sm p-4"
      onClick={onClose}
    >
      <div
        className="w-[92vw] max-w-md rounded-2xl bg-white shadow-xl border border-gray-100 p-5 sm:p-6 relative"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-800">{title}</h3>
          <button
            onClick={onClose}
            className="grid place-items-center w-8 h-8 rounded-full bg-red-500 text-white text-xl leading-none"
            aria-label="Close"
            type="button"
          >
            ×
          </button>
        </div>
        <div className="mt-4 space-y-4">
          <input
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="Enter the amount (BDT)"
            type="number"
            min="1"
            className="w-full rounded-lg border border-purple-300 focus:border-purple-500 focus:ring-2 focus:ring-purple-200 outline-none px-4 py-2.5 text-gray-800"
          />
          <input
            value={method}
            onChange={(e) => setMethod(e.target.value)}
            placeholder="Enter the method (e.g., bkash)"
            type="text"
            className="w-full rounded-lg border border-purple-300 focus:border-purple-500 focus:ring-2 focus:ring-purple-200 outline-none px-4 py-2.5 text-gray-800"
          />
          <input
            value={number}
            onChange={(e) => setNumber(e.target.value)}
            placeholder="Enter the number"
            type="tel"
            className="w-full rounded-lg border border-purple-300 focus:border-purple-500 focus:ring-2 focus:ring-purple-200 outline-none px-4 py-2.5 text-gray-800"
          />
        </div>
        <button
          type="button"
          disabled={!isValid}
          className={`mt-6 w-full rounded-md text-white font-bold tracking-wide py-3 transition
            ${isValid ? "bg-violet-600 hover:bg-violet-700" : "bg-violet-300 cursor-not-allowed"}`}
          onClick={() => isValid && onConfirm(amount.trim(), method.trim(), number.trim())}
        >
          {cta}
        </button>
      </div>
    </div>
  );
}

const SuccessShell = ({ title, body, cta = "BACK TO HOME", onClose }) => (
  <div className="fixed inset-0 z-[110] flex items-center justify-center bg-black/40 backdrop-blur-sm p-4" onClick={onClose}>
    <div className="w-[92vw] max-w-2xl rounded-3xl bg-[#F5F8FF] shadow-xl p-6 sm:p-10 relative" onClick={(e) => e.stopPropagation()}>
      <button
        onClick={onClose}
        className="absolute right-4 top-4 sm:right-6 sm:top-6 grid place-items-center w-9 h-9 rounded-full bg-red-500 text-white text-xl"
      >
        ×
      </button>
      <div className="flex justify-center">
        <img src="/src/Images/thank-you.svg" alt="Success Illustration" className="h-36 sm:h-44 object-contain select-none pointer-events-none" />
      </div>
      <h3 className="mt-4 sm:mt-6 text-center text-[20px] sm:text-[22px] font-extrabold text-gray-900">{title}</h3>
      {body && <p className="mt-2 text-center text-gray-600 leading-relaxed max-w-xl mx-auto">{body}</p>}
      <div className="mt-6 sm:mt-8 flex justify-center">
        <button onClick={onClose} className="w-full sm:w-3/4 rounded-md bg-purple-600 hover:bg-purple-700 text-white font-extrabold tracking-wide py-3">{cta}</button>
      </div>
    </div>
  </div>
);

const Transaction = () => {
  const location = useLocation();

  const [showAdd, setShowAdd] = useState(false);
  const [showWithdraw, setShowWithdraw] = useState(false);
  const [showSuccess, setShowSuccess] = useState(null);
  const [viewMode, setViewMode] = useState('transactions');
  const [userDisplayName, setUserDisplayName] = useState("User");
  const [userAvatar, setUserAvatar] = useState("");
  const [balanceDisplay, setBalanceDisplay] = useState("--");
  const [transactions, setTransactions] = useState([]);
  const [transactionsTotal, setTransactionsTotal] = useState(null);
  const [transactionsPage, setTransactionsPage] = useState(1);
  const [transactionsHasMore, setTransactionsHasMore] = useState(true);
  const [transactionsLoading, setTransactionsLoading] = useState(false);
  const [transactionsError, setTransactionsError] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [withdraws, setWithdraws] = useState([]);
  const [withdrawsTotal, setWithdrawsTotal] = useState(null);
  const [withdrawsPage, setWithdrawsPage] = useState(1);
  const [withdrawsHasMore, setWithdrawsHasMore] = useState(true);
  const [withdrawsLoading, setWithdrawsLoading] = useState(false);
  const [withdrawsError, setWithdrawsError] = useState(null);
  const transactionRequestRef = useRef(false);
  const withdrawRequestRef = useRef(false);
  const [loggedInUserId] = useState(() => {
    const id = getUserId();
    return id != null ? String(id) : null;
  });

  // ✅ Show success/failure message only (no addBalance API call)
  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const status = urlParams.get("status");

    if (status === "success") {
      setShowSuccess("Payment Successful!");
    } else if (status === "error") {
      setShowSuccess("Payment Successful!");
    }

    if (status) {
      window.history.replaceState({}, "", window.location.pathname);
    }
  }, [location.search]);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const userId = loggedInUserId;
        if (!userId) {
          setUserDisplayName("User");
          setBalanceDisplay("--");
          return;
        }

        const token = getUserToken();
        const headers = { Accept: "application/json" };
        if (token) headers.Authorization = `Bearer ${token}`;

        const queryUrl = `${Base_url}userProfile?user_id=${encodeURIComponent(userId)}`;
        let response = await fetch(queryUrl, { method: "GET", headers });

        if (!response.ok) {
          const fallbackHeaders = { ...headers, "Content-Type": "application/json" };
          response = await fetch(`${Base_url}userProfile`, {
            method: "POST",
            headers: fallbackHeaders,
            body: JSON.stringify({ user_id: userId }),
          });
        }

    if (!response.ok) throw new Error(`Profile fetch failed (${response.status})`);

    const payload = await response.json();
    const user = payload?.user ?? {};

        const name = user.full_name || user.name || "User";
        setUserDisplayName(name);

        if (user.picture) {
          setUserAvatar(makeImageUrl(user.picture));
        } else {
          setUserAvatar("");
        }

        const fetchedBalance = Number(user.balance);
        setBalanceDisplay(Number.isFinite(fetchedBalance) ? fetchedBalance.toFixed(2) : "0");
      } catch (error) {
        console.error("Error fetching user profile:", error);
        setBalanceDisplay("--");
      }
    };

    fetchProfile();
  }, [loggedInUserId]);

  const formatDate = useCallback((timestamp) => {
    if (!timestamp) return "--";
    const normalized = `${timestamp.replace(" ", "T")}Z`;
    const date = new Date(normalized);
    if (Number.isNaN(date.getTime())) return timestamp;
    const day = String(date.getUTCDate()).padStart(2, "0");
    const monthLabel = MONTHS[date.getUTCMonth()] ?? "";
    const yearShort = String(date.getUTCFullYear()).slice(-2);
    return `${day}-${monthLabel}-${yearShort}`;
  }, []);

  const formatAmount = useCallback((value) => {
    const numeric = Number(value);
    if (!Number.isFinite(numeric)) return "0৳";
    return `${Math.abs(numeric).toLocaleString("en-US")}৳`;
  }, []);

  const loadTransactions = useCallback(async (pageToLoad = 1, query = "") => {
    if (transactionRequestRef.current) return;
    transactionRequestRef.current = true;
    setTransactionsLoading(true);
    setTransactionsError(null);

    const token = getUserToken();
    if (!token) {
      setTransactionsError("Sign in to view your transactions.");
      setTransactions([]);
      setTransactionsHasMore(false);
      setTransactionsLoading(false);
      transactionRequestRef.current = false;
      return;
    }

    try {
      const url = query.trim() ? `${Base_url}getUserFilterAllTransaction?query=${encodeURIComponent(query.trim())}&page=${pageToLoad}` : `${Base_url}getUserAllTransaction?page=${pageToLoad}`;
      const response = await fetch(url, {
        method: "GET",
        headers: {
          Accept: "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      const payload = await response.json().catch(() => ({}));
      if (!response.ok) {
        throw new Error(payload?.message || "Failed to load transactions");
      }

      const list = Array.isArray(payload?.data) ? payload.data : [];
      setTransactions((prev) => (pageToLoad === 1 ? list : [...prev, ...list]));
      setTransactionsPage(pageToLoad);
      setTransactionsTotal(Number(payload?.total ?? 0));

      const lastPage = Number(payload?.last_page ?? pageToLoad);
      const nextUrl = payload?.next_page_url;
      const hasMore = Boolean(nextUrl) || pageToLoad < lastPage;
      setTransactionsHasMore(hasMore && list.length > 0);
    } catch (error) {
      setTransactionsError(error?.message || "Unable to load transactions");
    } finally {
      setTransactionsLoading(false);
      transactionRequestRef.current = false;
    }
  }, []);

  useEffect(() => {
    loadTransactions(1, searchQuery);
  }, [loadTransactions, searchQuery]);

  const loadWithdraws = useCallback(async (pageToLoad = 1) => {
    if (withdrawRequestRef.current) return;
    withdrawRequestRef.current = true;
    setWithdrawsLoading(true);
    setWithdrawsError(null);

    const token = getUserToken();
    if (!token) {
      setWithdrawsError("Sign in to view withdraw history.");
      setWithdraws([]);
      setWithdrawsHasMore(false);
      setWithdrawsLoading(false);
      withdrawRequestRef.current = false;
      return;
    }

    try {
      const url = `https://apidocumentationpathon.pathon.app/api/userAllWithdraw?page=${pageToLoad}`;
      const response = await fetch(url, {
        method: "GET",
        headers: {
          Accept: "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      const payload = await response.json().catch(() => ({}));
      if (!response.ok) {
        throw new Error(payload?.message || "Failed to load withdraw history");
      }

      const list = Array.isArray(payload?.data) ? payload.data : [];
      setWithdraws((prev) => (pageToLoad === 1 ? list : [...prev, ...list]));
      setWithdrawsPage(pageToLoad);
      setWithdrawsTotal(Number(payload?.total ?? 0));

      const lastPage = Number(payload?.last_page ?? pageToLoad);
      const nextUrl = payload?.next_page_url;
      const hasMore = Boolean(nextUrl) || pageToLoad < lastPage;
      setWithdrawsHasMore(hasMore && list.length > 0);
    } catch (error) {
      setWithdrawsError(error?.message || "Unable to load withdraw history");
    } finally {
      setWithdrawsLoading(false);
      withdrawRequestRef.current = false;
    }
  }, []);

  const handleLoadMore = useCallback(() => {
    if (!transactionsHasMore || transactionsLoading) return;
    loadTransactions(transactionsPage + 1, searchQuery);
  }, [transactionsHasMore, transactionsLoading, transactionsPage, loadTransactions, searchQuery]);

  const handleWithdrawLoadMore = useCallback(() => {
    if (!withdrawsHasMore || withdrawsLoading) return;
    loadWithdraws(withdrawsPage + 1);
  }, [withdrawsHasMore, withdrawsLoading, withdrawsPage, loadWithdraws]);

  const getStatusLabel = (status) => {
    switch (status) {
      case 0:
        return "Pending";
      case 1:
        return "Approved";
      case 2:
        return "Rejected";
      default:
        return "Unknown";
    }
  };

  const transactionRows = useMemo(() => {
    return transactions.map((item, index) => {
      const currentCumulative = Number(item?.cumulative_balance);
      const prevCumulativeRaw = Number(transactions?.[index + 1]?.cumulative_balance);
      const prevCumulative = Number.isFinite(prevCumulativeRaw) ? prevCumulativeRaw : null;

      let delta = Number(item?.balance);
      if (Number.isFinite(currentCumulative) && prevCumulative !== null) {
        delta = currentCumulative - prevCumulative;
      }

      let inAmount = "0৳";
      let outAmount = "0৳";
      if (Number.isFinite(delta) && delta !== 0) {
        if (delta > 0) {
          inAmount = formatAmount(delta);
        } else {
          outAmount = formatAmount(Math.abs(delta));
        }
      }

      const fromToUserId = extractUserIdFromText(item?.from_to);

      const fromToLabel =
        item?.from_to != null && String(item.from_to).trim() !== ""
          ? String(item.from_to).trim()
          : "--";

      // Parse description to extract class type and ID
      const description = item?.description || "--";
      let classType = null;
      let classId = null;
      let detailsLink = null;
      let displayDescription = description;

      if (description && description !== "--") {
        // Match patterns like "Live TEE183_1", "Pre-Record PRO166_1", "Class TTT176_11"
        const liveMatch = description.match(/^Live\s+([A-Z0-9_]+)/i);
        const preRecordMatch = description.match(/^Pre-Record\s+([A-Z0-9_]+)/i);
        const classMatch = description.match(/^Class\s+([A-Z0-9_]+)/i);
        const problemMatch = description.match(/^Problem\s+([A-Z0-9_]+)/i);

        if (liveMatch && liveMatch[1]) {
          classType = "live";
          classId = liveMatch[1];
          detailsLink = `/details-live/${classId}`;
        } else if (preRecordMatch && preRecordMatch[1]) {
          classType = "record";
          classId = preRecordMatch[1];
          detailsLink = `/details-record/${classId}`;
        } else if (problemMatch && problemMatch[1]) {
          classType = "problem";
          classId = problemMatch[1];
          detailsLink = `/details-problem/${classId}`;
        } else if (classMatch && classMatch[1]) {
          // Default "Class" to record type
          classType = "record";
          classId = classMatch[1];
          detailsLink = `/details-record/${classId}`;
        }
      }

      return {
        id: item?.id != null ? `tx-${item.id}` : `tx-${index}-${item?.created_at ?? ""}`,
        date: formatDate(item?.created_at),
        description: displayDescription,
        classType,
        classId,
        detailsLink,
        fromTo: fromToLabel,
        fromToUserId,
        inAmount,
        outAmount,
        balance: formatAmount(item?.cumulative_balance ?? 0),
      };
    });
  }, [transactions, formatAmount, formatDate]);

  const withdrawRows = useMemo(() => {
    return withdraws.map((item) => ({
      id: item?.id != null ? `wd-${item.id}` : `wd-${item?.update_at ?? ""}`,
      date: formatDate(item?.update_at),
      method: item?.methods || "--",
      number: item?.number || "--",
      amount: formatAmount(item?.request_balance ?? 0),
      status: getStatusLabel(item?.status),
    }));
  }, [withdraws, formatAmount, formatDate]);

  const displayAvatar = userAvatar ;
  const noTransactions = !transactions.length && !transactionsLoading && !transactionsError;
  
  const handleConfirm = async (amount) => {
    setShowAdd(false);
    const token = getUserToken();

    try {
      if (!token) {
        throw new Error("Authentication required");
      }

      const headers = {
        Authorization: `Bearer ${token}`,
      };

      const formData = new FormData();
      formData.append("addBalance", amount);
      formData.append("isAdd", "0");

      const response = await fetch("https://apidocumentationpathon.pathon.app/api/addBalance", {
        method: "POST",
        headers,
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }

      const payload = await response.json().catch(() => ({}));
      console.log("Add balance response", payload);
      setShowSuccess("Balance added successfully!");
      loadTransactions(1);
    } catch (error) {
      console.error("Add balance failed", error);
      alert(error?.message || "Add balance failed");
    }
  };

  const handleWithdrawConfirm = async (amount, method, number) => {
    setShowWithdraw(false);
    const token = getUserToken();

    try {
      if (!token) {
        throw new Error("Authentication required");
      }

      const formData = new FormData();
      formData.append("request_balance", amount);
      formData.append("methods", method);
      formData.append("number", number);

      const response = await fetch("https://apidocumentationpathon.pathon.app/api/requestForWithdraw", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }

      const payload = await response.json().catch(() => ({}));
      console.log("Withdraw request response", payload);
      toast.success("Withdraw request submitted successfully!");
      loadTransactions(1);
    } catch (error) {
      console.error("Withdraw request failed", error);
      toast.error(error?.message || "Withdraw request failed");
    }
  };

  /*
  // Previous SSLCommerz integration retained for reference
  const tran_id = "ref" + Date.now();
  fetch("https://payment.pathon.app/init", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      amount,
      tran_id,
      frontendUrl: "http://localhost:5173/transaction",
      token,
    }),
  })
    .then((res) => res.json())
    .then((data) => {
      if (data.GatewayPageURL) {
        window.location.href = data.GatewayPageURL;
      } else {
        alert("Payment initiation failed");
      }
    })
    .catch(() => {
      alert("Payment initiation failed");
    });
  */
  return (
    <div className="bg-gray-50 pt-6">
      <div className="max-w-7xl px-4  sm:px-8 py-8 lg:py-0 xl:px-10 mx-auto">
        <div className="flex justify-center mb-6">
          <span className="inline-flex items-center rounded-lg border border-purple-600 px-5 py-1.5 text-black/80 font-bold text-2xl">
            Transaction
          </span>
        </div>

        <div className="mt-6 flex flex-col items-center">
          <div className="relative">
            <img src={displayAvatar} alt="User avatar" className="h-28 w-28 sm:h-32 sm:w-32 rounded-full object-cover ring-4 ring-white shadow" />
            <span className="absolute inset-0 rounded-full ring-2 ring-purple-200 pointer-events-none" />
          </div>
          <p className="mt-3 text-md lg:text-lg font-semibold text-gray-800">{userDisplayName}</p>
        </div>

        <div className="mt-8 grid grid-cols-1 lg:grid-cols-2 lg:gap-8">
          {/* LEFT */}
          <div className="mt-0 lg:mt-12">
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
              <div className="flex flex-col sm:flex-row items-center justify-between gap-2">
                <div className="col-span-2">
                  <p className="text-sm text-gray-500">Your Balance</p>
                  <p className="mt-1 text-2xl font-bold tracking-tight text-gray-900">BDT {balanceDisplay}</p>
                </div>
                <div className="mt-4 flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-6">
                  <button className="px-3 py-1.5 sm:py-2 rounded-md bg-purple-600 text-white text-sm font-semibold hover:bg-purple-700" onClick={()=>setShowAdd(true)}>Add Balance</button>
                  <button className="px-3 py-1.5 sm:py-2 rounded-md bg-violet-600 text-white text-sm font-semibold hover:bg-violet-700" onClick={()=>setShowWithdraw(true)}>Withdraw</button>
                </div>
              </div>
            </div>

           

          </div>
          

          {/* RIGHT */}
          {/* <div className="lg:mt-0 mt-6">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-700">Revenue</span>
              <div className="relative">
                <select value={year} onChange={(e)=>setYear(Number(e.target.value))} className="appearance-none bg-white text-sm border border-gray-200 rounded-md pl-3 pr-7 py-1.5 shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-200">
                  {years.map(y=><option key={y} value={y}>{y}</option>)}
                </select>
                <span className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 text-gray-500">▾</span>
              </div>
            </div>

            <div className="mt-3 bg-white rounded-xl shadow-sm border border-gray-100 p-3 relative">
              <div className="pointer-events-none absolute left-4 top-2 z-10">
                <span className="inline-flex items-center px-2.5 py-1 rounded-md bg-purple-600 text-white text-xs font-bold shadow">{total.toFixed(1)}k</span>
              </div>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={rows} margin={{top:36,right:24,bottom:4,left:0}}>
                    <defs>
                      <linearGradient id="strokePurple" x1="0" y1="0" x2="1" y2="0">
                        <stop offset="0%" stopColor="#8B5CF6" />
                        <stop offset="100%" stopColor="#7C3AED" />
                      </linearGradient>
                      <linearGradient id="gridFade" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#E9D5FF" stopOpacity="0.6" />
                        <stop offset="100%" stopColor="#E9D5FF" stopOpacity="0.2" />
                      </linearGradient>
                      <linearGradient id="vlineGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#7C3AED" stopOpacity="1" />
                        <stop offset="100%" stopColor="#7C3AED" stopOpacity="0" />
                      </linearGradient>
                    </defs>
                    <CartesianGrid vertical={false} stroke="url(#gridFade)" />
                    <XAxis dataKey="month" tickLine={false} axisLine={false} tick={{fontSize:12,fill:"#6B7280"}} />
                    <YAxis domain={[0,maxY]} tickLine={false} axisLine={false} tick={{fontSize:12,fill:"#9CA3AF"}} tickFormatter={v=>v+"k"} width={40} />
                    <Tooltip content={<Tip />} cursor={false} />
                    <Line type="monotone" dataKey="revenue" stroke="url(#strokePurple)" strokeWidth={3} dot={{r:3.5,stroke:"#7C3AED",strokeWidth:2,fill:"#fff"}} activeDot={{r:5,stroke:"#7C3AED",strokeWidth:2,fill:"#fff"}} connectNulls={false}/>
                    {lastPoint && <>
                      <ReferenceLine x={lastPoint.month} stroke="url(#vlineGrad)" strokeWidth={4}/>
                      <ReferenceDot x={lastPoint.month} y={lastPoint.revenue} r={5} fill="#7C3AED" stroke="#fff" strokeWidth={2}/>
                    </>}
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div> */}



        </div>

         <div className="mt-3 bg-white rounded-lg shadow-sm border border-gray-100 p-4">
              <div className="flex gap-4">
                <button
                  type="button"
                  onClick={() => setViewMode('transactions')}
                  className={`flex-1 px-4 py-2 text-sm font-medium rounded-md ${viewMode === 'transactions' ? 'bg-purple-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
                >
                  Transactions
                </button>
                <button
                  type="button"
                  onClick={() => { setViewMode('withdraws'); loadWithdraws(1); }}
                  className={`flex-1 px-4 py-2 text-sm font-medium rounded-md ${viewMode === 'withdraws' ? 'bg-purple-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
                >
                  Withdraw History
                </button>
              </div>
            </div>


        {showAdd && <AmountInputModal title="Add Balance" cta="PAY" onClose={()=>setShowAdd(false)} onConfirm={handleConfirm} />}
        {showWithdraw && <WithdrawInputModal title="Withdraw Balance" cta="WITHDRAW" onClose={()=>setShowWithdraw(false)} onConfirm={handleWithdrawConfirm}/>}
        {showSuccess && (
          <SuccessShell
            title={showSuccess}
            onClose={() => setShowSuccess(null)}
          />
        )}

        <div className="mt-10">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 px-4 sm:px-6 py-4 border-b border-gray-100">
              <div>
                <h2 className="text-lg font-semibold text-gray-800">{viewMode === 'withdraws' ? "My Withdraw History" : "My All Transactions"}</h2>
                <p className="text-xs text-gray-500">Latest {viewMode === 'withdraws' ? withdraws.length : transactions.length} records{viewMode === 'withdraws' ? (withdrawsTotal ? ` · Total ${withdrawsTotal}` : "") : (transactionsTotal ? ` · Total ${transactionsTotal}` : "")}</p>
              </div>
              {viewMode === 'transactions' && (
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    placeholder="Search transactions..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="px-3 py-1.5 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-purple-200"
                  />
                  {transactionsLoading && (
                    <span className="text-xs font-medium text-purple-600">Loading...</span>
                  )}
                </div>
              )}
              {viewMode === 'withdraws' && withdrawsLoading && (
                <span className="text-xs font-medium text-purple-600">Loading...</span>
              )}
            </div>

            <div className="overflow-x-auto">
              {viewMode === 'transactions' ? (
                <table className="min-w-full divide-y divide-gray-100 text-sm">
                  <thead className="bg-gray-50">
                    <tr className="text-left text-gray-600">
                      <th className="px-4 sm:px-6 py-3 font-semibold">Date</th>
                      <th className="px-4 sm:px-6 py-3 font-semibold">Description</th>
                      <th className="px-4 sm:px-6 py-3 font-semibold">From/To</th>
                      <th className="px-4 sm:px-6 py-3 font-semibold text-right">In</th>
                      <th className="px-4 sm:px-6 py-3 font-semibold text-right">Out</th>
                      <th className="px-4 sm:px-6 py-3 font-semibold text-right">Balance</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {transactionRows.map((row) => (
                      <tr key={row.id} className="hover:bg-gray-50">
                        <td className="px-4 sm:px-6 py-3 text-gray-700 whitespace-nowrap">{row.date}</td>
                        <td className="px-4 sm:px-6 py-3 text-gray-700">
                          {row.detailsLink ? (
                            <Link
                              to={row.detailsLink}
                              className="text-blue-600 hover:text-blue-700 hover:underline font-semibold"
                            >
                              {row.description}
                            </Link>
                          ) : (
                            row.description
                          )}
                        </td>
                        <td className="px-4 sm:px-6 py-3 text-gray-500 whitespace-nowrap">
                          {row.fromToUserId ? (
                            <Link
                              to={{
                                pathname: "/user-profile",
                                search: `?user_id=${encodeURIComponent(row.fromToUserId)}`,
                              }}
                              className="text-purple-600 hover:text-purple-700 hover:underline font-semibold"
                            >
                              {row.fromTo}
                            </Link>
                          ) : (
                            row.fromTo
                          )}
                        </td>
                        <td className="px-4 sm:px-6 py-3 text-green-600 font-semibold text-right whitespace-nowrap">{row.inAmount}</td>
                        <td className="px-4 sm:px-6 py-3 text-red-500 font-semibold text-right whitespace-nowrap">{row.outAmount}</td>
                        <td className="px-4 sm:px-6 py-3 text-gray-800 font-semibold text-right whitespace-nowrap">{row.balance}</td>
                      </tr>
                    ))}

                    {transactionsError && (
                      <tr>
                        <td colSpan={6} className="px-4 sm:px-6 py-6 text-center text-sm text-red-500">
                          {transactionsError}
                        </td>
                      </tr>
                    )}

                    {noTransactions && !transactionsError && (
                      <tr>
                        <td colSpan={6} className="px-4 sm:px-6 py-10 text-center text-sm text-gray-500">
                          No transactions found yet.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              ) : (
                <table className="min-w-full divide-y divide-gray-100 text-sm">
                  <thead className="bg-gray-50">
                    <tr className="text-left text-gray-600">
                      <th className="px-4 sm:px-6 py-3 font-semibold">Date</th>
                      <th className="px-4 sm:px-6 py-3 font-semibold">Method</th>
                      <th className="px-4 sm:px-6 py-3 font-semibold">Number</th>
                      <th className="px-4 sm:px-6 py-3 font-semibold text-right">Amount</th>
                      <th className="px-4 sm:px-6 py-3 font-semibold text-center">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {withdrawRows.map((row) => (
                      <tr key={row.id} className="hover:bg-gray-50">
                        <td className="px-4 sm:px-6 py-3 text-gray-700 whitespace-nowrap">{row.date}</td>
                        <td className="px-4 sm:px-6 py-3 text-gray-700">{row.method}</td>
                        <td className="px-4 sm:px-6 py-3 text-gray-500 whitespace-nowrap">{row.number}</td>
                        <td className="px-4 sm:px-6 py-3 text-red-500 font-semibold text-right whitespace-nowrap">{row.amount}</td>
                        <td className="px-4 sm:px-6 py-3 text-center">
                          <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                            row.status === "Pending" ? "bg-yellow-100 text-yellow-800" :
                            row.status === "Approved" ? "bg-green-100 text-green-800" :
                            row.status === "Rejected" ? "bg-red-100 text-red-800" :
                            "bg-gray-100 text-gray-800"
                          }`}>
                            {row.status}
                          </span>
                        </td>
                      </tr>
                    ))}

                    {withdrawsError && (
                      <tr>
                        <td colSpan={5} className="px-4 sm:px-6 py-6 text-center text-sm text-red-500">
                          {withdrawsError}
                        </td>
                      </tr>
                    )}

                    {(!withdraws.length && !withdrawsLoading && !withdrawsError) && (
                      <tr>
                        <td colSpan={5} className="px-4 sm:px-6 py-10 text-center text-sm text-gray-500">
                          No withdraw history found yet.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              )}
            </div>

            <div className="px-4 sm:px-6 py-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-t border-gray-100">
              <div className="text-xs text-gray-500">
                Page {viewMode === 'withdraws' ? withdrawsPage : transactionsPage}{viewMode === 'withdraws' ? (withdrawsTotal ? ` of ${Math.max(Math.ceil(withdrawsTotal / 10), 1)}` : "") : (transactionsTotal ? ` of ${Math.max(Math.ceil(transactionsTotal / 10), 1)}` : "")}
              </div>
              {viewMode === 'withdraws' ? (
                withdrawsHasMore ? (
                  <button
                    type="button"
                    onClick={handleWithdrawLoadMore}
                    disabled={withdrawsLoading}
                    className={`w-full sm:w-auto inline-flex items-center justify-center rounded-md border border-purple-500 px-4 py-2 text-sm font-semibold transition ${withdrawsLoading ? "bg-purple-200 text-purple-500 cursor-not-allowed" : "bg-purple-600 text-white hover:bg-purple-700"}`}
                  >
                    {withdrawsLoading ? "Loading..." : "Load more Data"}
                  </button>
                ) : (
                  <span className="text-xs text-gray-400">No more records to display.</span>
                )
              ) : (
                transactionsHasMore ? (
                  <button
                    type="button"
                    onClick={handleLoadMore}
                    disabled={transactionsLoading}
                    className={`w-full sm:w-auto inline-flex items-center justify-center rounded-md border border-purple-500 px-4 py-2 text-sm font-semibold transition ${transactionsLoading ? "bg-purple-200 text-purple-500 cursor-not-allowed" : "bg-purple-600 text-white hover:bg-purple-700"}`}
                  >
                    {transactionsLoading ? "Loading..." : "Load more Data"}
                  </button>
                ) : (
                  <span className="text-xs text-gray-400">No more records to display.</span>
                )
              )}
            </div>
          </div>
        </div>
      </div>
      <ToastContainer />
    </div>
  );
};

export default Transaction;
