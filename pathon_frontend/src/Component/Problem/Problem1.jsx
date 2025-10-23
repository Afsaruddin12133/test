import React, { useEffect, useState, useMemo } from "react";
import { MdLiveTv } from "react-icons/md";
import { RiBroadcastLine } from "react-icons/ri";
import { LuClipboardList } from "react-icons/lu";
import { FaShapes } from "react-icons/fa";
import { Base_url } from "../../Config/Api";

const baseCards = [
  {
    id: "problem",
    title: "MY problem",
    to: "/solve-class-me",
    count: null,
    icon: MdLiveTv,
    bg: "from-purple-600 via-violet-600 to-fuchsia-500",
  },
  {
    id: "create",
    title: "Add a Problem",
    to: "/create-solve-classes",
    count: null, // static (no badge)
    icon: RiBroadcastLine,
    bg: "from-purple-700 via-violet-700 to-indigo-900",
  },
  {
    id: "enroll",
    title: "MY ENROLLMENT",
    to: "/my-enrolment?type=3",
    count: null,
    icon: LuClipboardList,
    bg: "from-purple-600 via-indigo-600 to-sky-500",
  },
  {
    id: "negotiation",
    title: "MY NEGOTIATION",
    to: "/negotiation?type=3",
    count: null,
    icon: FaShapes,
    bg: "from-purple-500 via-fuchsia-500 to-cyan-400",
  },
];

const Problem1 = () => {
  const [counts, setCounts] = useState({});

  useEffect(() => {
    const controller = new AbortController();

    // Read token like your other components
    const authRaw = localStorage.getItem("auth") || "{}";
    let userToken = null;
    try {
      const authData = JSON.parse(authRaw);
      userToken = authData?.user?.token ?? null;
    } catch {
      // ignore parse error
    }

    if (!userToken) {
      console.log("❌ No token found for problem counts");
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

        if (!res.ok) return;

        // Save the entire payload and pick fields in useMemo
        setCounts(json || {});
      })
      .catch((err) => {
        if (err?.name !== "AbortError") {
          console.error("❌ Problem counts fetch error:", err);
        }
      });

    return () => controller.abort();
  }, []);

  // Map API fields to cards (note the pluralization in your response keys)
  const cards = useMemo(
    () =>
      baseCards.map((c) => {
        switch (c.id) {
          case "problem":
            return { ...c, count: counts.myCourseCountProblemSolving ?? null };
          case "enroll":
            return { ...c, count: counts.myEnrolledCountProblemsSolving ?? null };
          case "negotiation":
            return { ...c, count: counts.myNegationCountProblemsSolving ?? null };
          // "create" remains static
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
            Problem Solving
          </span>
        </div>

        {/* Grid */}
        <div className="mx-auto mt-8 grid max-w-4xl grid-cols-2 gap-5 sm:grid-cols-2">
          {cards.map(({ id, title, to, count, icon: Icon, bg }) => (
            <a
              key={id}
              href={to}
              className="group relative block overflow-hidden rounded-lg bg-gradient-to-r text-white shadow-md transition hover:shadow-lg"
            >
              <div
                className={`bg-gradient-to-r ${bg} flex flex-col items-center justify-center
                  h-40 sm:h-44 md:h-48 lg:h-52 xl:h-52
                  p-6 sm:p-7 md:p-8`}
              >
                <Icon className="mb-4 text-4xl sm:text-5xl md:text-6xl" aria-hidden />
                <h3 className="text-center font-extrabold tracking-widest text-base sm:text-lg md:text-xl uppercase">
                  {title}
                </h3>
              </div>

              {/* ✅ Show badge for any integer (including 0) */}
              {Number.isInteger(count) && (
                <span className="absolute right-3 top-3 rounded-md bg-white px-2 py-1 text-xs font-semibold text-purple-700">
                  {count}
                </span>
              )}
            </a>
          ))}
        </div>
      </section>
    </div>
  );
};

export default Problem1;
