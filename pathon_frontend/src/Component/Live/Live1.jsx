import React, { useEffect, useState, useMemo } from "react";
import { MdLiveTv } from "react-icons/md";
import { RiBroadcastLine } from "react-icons/ri";
import { LuClipboardList } from "react-icons/lu";
import { FaShapes } from "react-icons/fa";
import { Link } from "react-router"; // keep as you have it
import { Base_url } from "../../Config/Api";

const baseCards = [
  {
    id: "live",
    title: "MY LIVE CLASSES",
    to: "/live-class-me",
    count: null,
    icon: MdLiveTv,
    bg: "from-purple-600 via-violet-600 to-fuchsia-500",
  },
  {
    id: "create",
    title: "CREATE A LIVE CLASS",
    to: "/create-live-class",
    count: null, // stays static (no badge)
    icon: RiBroadcastLine,
    bg: "from-purple-700 via-violet-700 to-indigo-900",
  },
  {
    id: "enroll",
    title: "MY ENROLLMENT",
    to: "/my-enrolment?type=2",
    count: null,
    icon: LuClipboardList,
    bg: "from-purple-600 via-indigo-600 to-sky-500",
  },
  {
    id: "negotiation",
    title: "MY NEGOTIATION",
    to: "/negotiation?type=2",
    count: null,
    icon: FaShapes,
    bg: "from-purple-500 via-fuchsia-500 to-cyan-400",
  },
];

const Live1 = () => {
  const [counts, setCounts] = useState({});

  useEffect(() => {
    const controller = new AbortController();

    // read token same way as before
    const authRaw = localStorage.getItem("auth") || "{}";
    let userToken = null;
    try {
      const authData = JSON.parse(authRaw);
      userToken = authData?.user?.token ?? null;
    } catch {
      // ignore parse error
    }

    if (!userToken) {
      console.log("❌ No token found at auth.user.token");
      return () => controller.abort();
    }

    fetch(
      `${Base_url}totalCourseCount`, {
      method: "GET",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: `Bearer ${userToken}`,
      },
      signal: controller.signal,
    })
      .then(async (res) => {
        console.log("🌐 totalCourseCount status:", res.status);
        const json = await res.json().catch(() => ({}));
        console.log("📦 totalCourseCount response:", json);

        if (!res.ok) {
          console.warn("⚠️ totalCourseCount not OK:", res.status, json);
          return;
        }

        // Save whole payload; we’ll pick fields per card in useMemo
        setCounts(json || {});
      })
      .catch((err) => {
        if (err?.name !== "AbortError") {
          console.error("❌ totalCourseCount fetch error:", err);
        }
      });

    return () => controller.abort();
  }, []);

  // Map counts from the new endpoint to each card
  const cards = useMemo(
    () =>
      baseCards.map((c) => {
        switch (c.id) {
          case "live":
            return { ...c, count: counts.myCourseCountLiveVideo ?? null };
          case "enroll":
            return { ...c, count: counts.myEnrolledCountLiveVideo ?? null };
          case "negotiation":
            return { ...c, count: counts.myNegationCountLiveVideo ?? null };
          // "create" stays static
          default:
            return c;
        }
      }),
    [counts]
  );

  return (
    <div className="bg-blue-50">
      <section className="px-4 sm:px-6 lg:px-8 py-10">
        {/* Title pill */}
        <div className="flex justify-center mb-6">
          <span className="inline-flex items-center rounded-lg border border-purple-600 px-5 py-1.5 text-black/80 font-bold text-2xl lg:text-3xl">
            Live Class
          </span>
        </div>

        {/* Grid */}
        <div className="mx-auto mt-8 grid max-w-4xl grid-cols-2 gap-5 sm:grid-cols-2">
          {cards.map(({ id, title, to, count, icon: Icon, bg }) => (
            <Link
              to={to}
              key={id}
              className="group relative block overflow-hidden rounded-lg bg-gradient-to-r text-white shadow-md transition hover:shadow-lg"
            >
              <div
                className={`bg-gradient-to-r ${bg} flex flex-col items-center justify-center
                  h-36 sm:h-40 md:h-44 lg:h-48 xl:h-50
                  p-6 sm:p-7 md:p-8`}
              >
                <Icon className="mb-4 text-4xl sm:text-5xl md:text-6xl" aria-hidden />
                <h3 className="text-center font-extrabold tracking-widest text-base sm:text-lg md:text-xl uppercase">
                  {title}
                </h3>
              </div>

              {/* Badge shows only when count is an integer > 0 */}
              {Number.isInteger(count) && (
                <span className="absolute right-3 top-3 rounded-md bg-white px-2 py-1 text-xs font-semibold text-purple-700">
                  {count}
                </span>
              )}
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
};

export default Live1;
