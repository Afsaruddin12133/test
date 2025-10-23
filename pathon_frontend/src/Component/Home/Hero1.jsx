import React from "react";

const CARDS = [
  {
    id: "live",
    title1: "LIVE",
    title2: "CLASS",
    bg: "bg-purple-600", // changed
    to: "/live-classes",
    icon: (
      <svg viewBox="0 0 64 64" className="w-full h-full" aria-hidden="true">
        <rect x="6" y="8" width="52" height="34" rx="4" fill="#fff" />
        <rect x="10" y="12" width="30" height="6" rx="2" fill="#c7d2fe" />
        <rect x="10" y="22" width="40" height="4" rx="2" fill="#c7d2fe" />
        <rect x="10" y="30" width="24" height="4" rx="2" fill="#c7d2fe" />
        <circle cx="48" cy="44" r="10" fill="#bfdbfe" />
        <path d="M44 39v10l8-5-8-5z" fill="#1d4ed8" />
      </svg>
    ),
  },
  {
    id: "recorded",
    title1: "RECORDED",
    title2: "CLASS",
    bg: "bg-violet-600", // changed
    to: "/record-classes",
    icon: (
      <svg viewBox="0 0 64 64" className="w-full h-full" aria-hidden="true">
        <rect x="6" y="10" width="52" height="36" rx="4" fill="#fff" />
        <rect x="10" y="14" width="44" height="12" rx="2" fill="#bfdbfe" />
        <rect x="10" y="30" width="22" height="4" rx="2" fill="#c7d2fe" />
        <rect x="34" y="30" width="20" height="4" rx="2" fill="#c7d2fe" />
        <circle cx="22" cy="20" r="6" fill="#1d4ed8" />
        <polygon points="20,17 26,20 20,23" fill="#fff" />
      </svg>
    ),
  },
  {
    id: "problem",
    title1: "PROBLEM",
    title2: "SOLVING",
    bg: "bg-purple-500", // changed
    to: "/problem-solving",
    icon: (
      <svg viewBox="0 0 64 64" className="w-full h-full" aria-hidden="true">
        <rect x="6" y="8" width="52" height="36" rx="4" fill="#fff" />
        <rect x="12" y="36" width="8" height="8" rx="1.5" fill="#93c5fd" />
        <rect x="24" y="28" width="8" height="16" rx="1.5" fill="#60a5fa" />
        <rect x="36" y="22" width="8" height="22" rx="1.5" fill="#3b82f6" />
        <rect x="48" y="30" width="8" height="14" rx="1.5" fill="#1d4ed8" />
        <path d="M38 8l12 0 0 6" stroke="#38bdf8" strokeWidth="3" fill="none" />
        <path d="M50 20l8 8-6 6-8-8" fill="#38bdf8" />
      </svg>
    ),
  },
];

const Hero1 = () => {
  return (
    <div className="bg-gray-100">
      <section className="py-12 sm:py-12 lg:px-40 xl:px-60 mx-auto max-w-7xl">
        <h2 className="text-center text-2xl sm:text-3xl font-bold text-black/80">
          Discover The Perfect Resource For You.
        </h2>

        <div className="mt-10 grid grid-cols-3 gap-4 sm:gap-4 justify-items-center">
          {CARDS.map(({ id, to, bg, icon, title1, title2 }) => (
            <a
              key={id}
              href={to}
              className="group block rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <div
                className={`rounded-xl ${bg} text-white shadow-md hover:shadow-lg transition-shadow flex flex-col items-center justify-center
                            p-4 sm:p-6
                            w-25 h-25 sm:w-40 sm:h-40 md:w-48 md:h-48`}
              >
                <div className="mb-0 sm:mb-3 md:mb-4 w-14 h-14 sm:w-16 sm:h-16 md:w-20 md:h-20 lg:w-24 lg:h-24">
                  {icon}
                </div>
                <div className="text-center font-extrabold tracking-widest text-xs sm:text-base md:text-lg leading-tight">
                  <span className="block">{title1}</span>
                  <span className="block">{title2}</span>
                </div>
              </div>
            </a>
          ))}
        </div>
      </section>
    </div>
  );
};

export default Hero1;
