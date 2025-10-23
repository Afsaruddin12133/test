import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { getUserToken } from "../../Auth/auth";

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

const WithdrawHistory = () => {
  const navigate = useNavigate();
  const [withdraws, setWithdraws] = useState([]);
  const [withdrawsTotal, setWithdrawsTotal] = useState(null);
  const [withdrawsPage, setWithdrawsPage] = useState(1);
  const [withdrawsHasMore, setWithdrawsHasMore] = useState(true);
  const [withdrawsLoading, setWithdrawsLoading] = useState(false);
  const [withdrawsError, setWithdrawsError] = useState(null);

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

  const loadWithdraws = useCallback(async (pageToLoad = 1) => {
    setWithdrawsLoading(true);
    setWithdrawsError(null);

    const token = getUserToken();
    if (!token) {
      setWithdrawsError("Sign in to view withdraw history.");
      setWithdraws([]);
      setWithdrawsHasMore(false);
      setWithdrawsLoading(false);
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
    }
  }, []);

  useEffect(() => {
    loadWithdraws(1);
  }, [loadWithdraws]);

  const handleLoadMore = useCallback(() => {
    if (!withdrawsHasMore || withdrawsLoading) return;
    loadWithdraws(withdrawsPage + 1);
  }, [withdrawsHasMore, withdrawsLoading, withdrawsPage, loadWithdraws]);

  const withdrawRows = withdraws.map((item) => ({
    id: item?.id != null ? `wd-${item.id}` : `wd-${item?.update_at ?? ""}`,
    date: formatDate(item?.update_at),
    method: item?.methods || "--",
    number: item?.number || "--",
    amount: formatAmount(item?.request_balance ?? 0),
    status: getStatusLabel(item?.status),
  }));

  const noWithdraws = !withdraws.length && !withdrawsLoading && !withdrawsError;

  return (
    <div className="bg-gray-50 pt-6">
      <div className="max-w-7xl px-4 sm:px-8 py-8 lg:py-0 xl:px-10 mx-auto">
        <div className="flex justify-center mb-6">
          <span className="inline-flex items-center rounded-lg border border-purple-600 px-5 py-1.5 text-black/80 font-bold text-2xl">
            Withdraw History
          </span>
        </div>

        <div className="mb-4">
          <button
            onClick={() => navigate('/transaction')}
            className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700"
          >
            Back to Transactions
          </button>
        </div>

        <div className="mt-10">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 px-4 sm:px-6 py-4 border-b border-gray-100">
              <div>
                <h2 className="text-lg font-semibold text-gray-800">My Withdraw History</h2>
                <p className="text-xs text-gray-500">Latest {withdraws.length} records{withdrawsTotal ? ` · Total ${withdrawsTotal}` : ""}</p>
              </div>
              {withdrawsLoading && (
                <span className="text-xs font-medium text-purple-600">Loading...</span>
              )}
            </div>

            <div className="overflow-x-auto">
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

                  {noWithdraws && !withdrawsError && (
                    <tr>
                      <td colSpan={5} className="px-4 sm:px-6 py-10 text-center text-sm text-gray-500">
                        No withdraw history found yet.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            <div className="px-4 sm:px-6 py-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-t border-gray-100">
              <div className="text-xs text-gray-500">
                Page {withdrawsPage}{withdrawsTotal ? ` of ${Math.max(Math.ceil(withdrawsTotal / 10), 1)}` : ""}
              </div>
              {withdrawsHasMore ? (
                <button
                  type="button"
                  onClick={handleLoadMore}
                  disabled={withdrawsLoading}
                  className={`w-full sm:w-auto inline-flex items-center justify-center rounded-md border border-purple-500 px-4 py-2 text-sm font-semibold transition ${withdrawsLoading ? "bg-purple-200 text-purple-500 cursor-not-allowed" : "bg-purple-600 text-white hover:bg-purple-700"}`}
                >
                  {withdrawsLoading ? "Loading..." : "Load more Data"}
                </button>
              ) : (
                <span className="text-xs text-gray-400">No more records to display.</span>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WithdrawHistory;
