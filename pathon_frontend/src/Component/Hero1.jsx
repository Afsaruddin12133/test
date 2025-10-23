import React from "react";

const people = [
  {
    name: "Ahmed Sabit",
    country: "UK",
    avatar: "/3.jpg",
    quote:
      "Pathon has been a game-changer for my learning journey. The variety of courses and the ease of access make it a top choice. I've gained valuable skills that have already helped me in my career",
  },
  {
    name: "Ovi",
    country: "Bagladesh",
    avatar: "/5.jpg",
    quote:
      "Joining the Pathon community was a fantastic decision. The live classes are interactive and engaging, and the problem-solving sessions have boosted my critical thinking skills. It's a platform that truly enhances learning.",
  },
  {
    name: "Sabrina",
    country: "USA",
    avatar: "/4.jpg",
    quote:
      "I'm impressed by the diverse resources available on Pathon. From recorded classes for flexible learning to the support of fellow learners in the community, it's an all-in-one hub for education. I've found my educational home here.",
  },
];

const Hero1 = () => {
  return (
    <section className="w-full bg-white">
      <div className="max-w-6xl mx-auto px-6 md:px-8 py-12 md:py-16">
        {/* Heading */}
        <div className="text-center">
          <h2 className="text-[28px] md:text-[34px] font-extrabold tracking-tight text-[#111]">
            From The Pathon Community
          </h2>
          <p className="mt-3 text-[13px] md:text-[14px] text-gray-600 leading-5">
            Over A Thousand People Have Already Become
            <br />
            Part Of Pathon.
          </p>
        </div>

        {/* People */}
        <div className="mt-10 md:mt-12 grid grid-cols-1 md:grid-cols-3 gap-10 md:gap-8">
          {people.map((p) => (
            <div
              key={p.name}
              className="flex flex-col items-center text-center"
            >
              {/* Avatar */}
              <div className="w-[156px] h-[156px] rounded-full overflow-hidden bg-gray-100 shadow-sm">
                <img
                  src={p.avatar}
                  alt={p.name}
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Name */}
              <a
                href="#"
                className="mt-6 text-[22px] font-semibold text-purple-800"
              >
                {p.name}
              </a>

              {/* Country + underline */}
              <div className="mt-2">
                <div className="text- font-semibold text-gray-600">{p.country}</div>
                <div className="mx-auto mt-3 h-[3px] w-28 bg-purple-900 rounded-full" />
              </div>

              {/* Quote */}
              <p className="mt-6 max-w-[320px] text-[14.5px] leading-7 text-[#111]">
                {/* use curly quotes to match the mock */}
                {p.quote.includes("“") || p.quote.includes("”")
                  ? p.quote
                  : `“${p.quote}”`}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Hero1;
