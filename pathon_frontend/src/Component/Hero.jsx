import React, { useEffect, useRef, useState } from "react";

import img9 from "/9.jpg";
import img6 from "/6.jpg";
import img7 from "/7.jpg";
import img8 from "/8.jpg";

const slides = [
  { src: img9, label: "Lorem ipsum dolor sit, amet consectetur" },
  { src: img6, label: "Lorem ipsum dolor sit, amet consectetur adipisicing elit" },
  { src: img7, label: "Lorem ipsum dolor sit, amet consectet" },
  { src: img8, label: "Lorem ipsum dolor sit, amet consectetur adipisicing elit" },
];

const TRANSITION_MS = 500;
const INTERVAL_MS = 4000;

const Hero = () => {
  const [index, setIndex] = useState(0);
  const timerRef = useRef(null);

  // Stop auto-slide
  const stopAuto = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  };

  // Start auto-slide
  const startAuto = () => {
    stopAuto();
    timerRef.current = setInterval(() => {
      next();
    }, INTERVAL_MS);
  };

  useEffect(() => {
    startAuto();
    return stopAuto;
  }, []);

  // Go next/prev
  const next = () => {
    setIndex((prev) => (prev + 1) % slides.length);
  };

  const prev = () => {
    setIndex((prev) => (prev - 1 + slides.length) % slides.length);
  };

  const goTo = (i) => {
    setIndex(i);
  };

  return (
    <section className="w-full bg-blue-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8">
        <div className="flex justify-center">
          <div
            className="relative mx-auto w-full max-w-5xl"
            onMouseEnter={stopAuto}
            onMouseLeave={startAuto}
          >
            {/* Slider container */}
            <div className="mx-auto w-full max-w-3xl h-64 sm:h-80 md:h-96 lg:h-[450px] overflow-hidden rounded-xl bg-gray-100 relative">
              <div
                className="flex h-full transition-transform duration-500 ease-in-out"
                style={{ transform: `translateX(-${index * 100}%)` }}
              >
                {slides.map((s, i) => (
                  <div key={i} className="w-full h-full flex-shrink-0">
                    <img
                      src={s.src}
                      alt={s.label}
                      className="w-full h-full object-cover"
                      loading="eager"
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* Label */}
            <p className="mt-4 text-lg text-center font-semibold">
              {slides[index].label}
            </p>

            {/* Dots */}
            <div className="mt-2 flex justify-center gap-2">
              {slides.map((_, i) => {
                const active = i === index;
                return (
                  <button
                    key={i}
                    onClick={() => goTo(i)}
                    aria-label={`Go to slide ${i + 1}`}
                    className={`transition-all duration-200 ${
                      active
                        ? "w-6 h-2 rounded-full bg-purple-600"
                        : "w-2 h-2 rounded-full bg-gray-300"
                    }`}
                  />
                );
              })}
            </div>

            {/* Arrows */}
            <button
              type="button"
              onClick={prev}
              className="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/90 backdrop-blur-sm text-gray-800 grid place-items-center shadow-lg hover:bg-white hover:scale-110 active:scale-95 transition-all duration-200 border border-gray-200"
              aria-label="Previous slide"
            >
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <polyline points="15 18 9 12 15 6" />
              </svg>
            </button>

            <button
              type="button"
              onClick={next}
              className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/90 backdrop-blur-sm text-gray-800 grid place-items-center shadow-lg hover:bg-white hover:scale-110 active:scale-95 transition-all duration-200 border border-gray-200"
              aria-label="Next slide"
            >
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <polyline points="9 18 15 12 9 6" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
