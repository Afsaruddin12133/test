import React from "react";

const About = () => {
  return (
    <section className="px-4 sm:px-6 lg:px-8 py-12 bg-gradient-to-b from-purple-50 to-white">
      {/* Hero Section */}
      <div className="flex justify-center mb-12">
        <span className="inline-flex items-center rounded-xl border-2 border-purple-600 bg-white px-8 py-2.5 text-purple-700 font-bold text-2xl lg:text-3xl shadow-md">
          About Us
        </span>
      </div>

      <div className="mx-auto max-w-5xl">
        {/* Hero Introduction */}
        <div className="mb-12 text-center bg-white rounded-2xl shadow-lg p-8 border border-purple-100">
          <h1 className="text-2xl sm:text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-blue-600 mb-4">
            Welcome to Pathon — Where Learning Meets Opportunity
          </h1>
          <p className="text-lg text-gray-700 mb-4 leading-relaxed">
            Pathon isn't just another edtech platform. It's a <span className="font-semibold text-purple-700">movement</span>. A digital space where anyone can teach, everyone can learn, and knowledge flows without boundaries.
          </p>
          <p className="text-base text-gray-600 italic">
            Born out of a simple belief — "education should be accessible, empowering, and community-driven" — Pathon is reshaping how learning happens in the modern world.
          </p>
        </div>

        {/* What is Pathon */}
        <div className="mb-10 bg-white rounded-2xl shadow-md p-8 border border-gray-100 hover:shadow-xl transition-shadow duration-300">
          <div className="flex items-center gap-3 mb-4">
            <span className="flex items-center justify-center w-10 h-10 rounded-full bg-purple-600 text-white font-bold text-lg">1</span>
            <h2 className="font-bold text-2xl text-gray-900">What is Pathon?</h2>
          </div>
          <p className="mb-4 text-gray-700 leading-relaxed">
            Pathon is an open and inclusive online learning platform where users can be both students and instructors. Whether you're picking up a new skill or sharing your expertise with the world, Pathon makes it seamless.
          </p>
          <div className="bg-purple-50 rounded-xl p-6 mb-4">
            <p className="mb-3 text-gray-800 font-semibold">Our dual-role system allows users to:</p>
            <ul className="space-y-3 text-gray-700">
              <li className="flex items-start gap-3">
                <span className="text-purple-600 font-bold text-xl">✓</span>
                <span>Enroll in courses as learners</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-purple-600 font-bold text-xl">✓</span>
                <span>Create and offer courses as instructors</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-purple-600 font-bold text-xl">✓</span>
                <span>Do both — freely and flexibly</span>
              </li>
            </ul>
          </div>
          <p className="text-gray-700 leading-relaxed">
            We support free and paid content, empowering creators to monetize while keeping education within reach for everyone.
          </p>
        </div>

        {/* Core Features */}
        <div className="mb-10 bg-white rounded-2xl shadow-md p-8 border border-gray-100 hover:shadow-xl transition-shadow duration-300">
          <div className="flex items-center gap-3 mb-6">
            <span className="flex items-center justify-center w-10 h-10 rounded-full bg-purple-600 text-white font-bold text-lg">2</span>
            <h2 className="font-bold text-2xl text-gray-900">Our Core Features</h2>
          </div>
          <div className="grid md:grid-cols-2 gap-5">
            <div className="bg-gradient-to-br from-purple-50 to-blue-50 rounded-xl p-5 border border-purple-100 hover:border-purple-300 transition-all duration-200 hover:shadow-md">
              <div className="flex items-center gap-3 mb-3">
                <span className="text-3xl">🎥</span>
                <h3 className="font-bold text-lg text-gray-900">Recorded Classes</h3>
              </div>
              <p className="text-gray-700 text-sm leading-relaxed">
                Upload pre-recorded lessons and let students learn on their own schedule — anytime, anywhere.
              </p>
            </div>
            <div className="bg-gradient-to-br from-purple-50 to-blue-50 rounded-xl p-5 border border-purple-100 hover:border-purple-300 transition-all duration-200 hover:shadow-md">
              <div className="flex items-center gap-3 mb-3">
                <span className="text-3xl">🧑‍🏫</span>
                <h3 className="font-bold text-lg text-gray-900">Live Classes</h3>
              </div>
              <p className="text-gray-700 text-sm leading-relaxed">
                Host interactive real-time sessions via built-in video conferencing. It's the closest thing to being in a physical classroom.
              </p>
            </div>
            <div className="bg-gradient-to-br from-purple-50 to-blue-50 rounded-xl p-5 border border-purple-100 hover:border-purple-300 transition-all duration-200 hover:shadow-md">
              <div className="flex items-center gap-3 mb-3">
                <span className="text-3xl">🧩</span>
                <h3 className="font-bold text-lg text-gray-900">Problem Solving Module</h3>
              </div>
              <p className="text-gray-700 text-sm leading-relaxed">
                Students can share academic problems as images or PDFs. Educators respond with detailed solutions or offer live help — tailored and timely.
              </p>
            </div>
            <div className="bg-gradient-to-br from-purple-50 to-blue-50 rounded-xl p-5 border border-purple-100 hover:border-purple-300 transition-all duration-200 hover:shadow-md">
              <div className="flex items-center gap-3 mb-3">
                <span className="text-3xl">💳</span>
                <h3 className="font-bold text-lg text-gray-900">Flexible Course Monetization</h3>
              </div>
              <p className="text-gray-700 text-sm leading-relaxed">
                We support local online payment gateways like bKash and Nagad, making it easy for learners to pay and for instructors to earn.
              </p>
            </div>
            <div className="bg-gradient-to-br from-purple-50 to-blue-50 rounded-xl p-5 border border-purple-100 hover:border-purple-300 transition-all duration-200 hover:shadow-md md:col-span-2">
              <div className="flex items-center gap-3 mb-3">
                <span className="text-3xl">🔐</span>
                <h3 className="font-bold text-lg text-gray-900">Public or Private Courses</h3>
              </div>
              <p className="text-gray-700 text-sm leading-relaxed">
                Choose who sees your content. Keep it public for community access or private for exclusive learning.
              </p>
            </div>
          </div>
        </div>

        {/* Why Pathon */}
        <div className="mb-10 bg-white rounded-2xl shadow-md p-8 border border-gray-100 hover:shadow-xl transition-shadow duration-300">
          <div className="flex items-center gap-3 mb-6">
            <span className="flex items-center justify-center w-10 h-10 rounded-full bg-purple-600 text-white font-bold text-lg">3</span>
            <h2 className="font-bold text-2xl text-gray-900">Why Pathon? Why Now?</h2>
          </div>
          <div className="grid sm:grid-cols-2 gap-4">
            <div className="flex items-start gap-3 bg-purple-50 rounded-lg p-4 hover:bg-purple-100 transition-colors duration-200">
              <span className="text-green-600 font-bold text-xl flex-shrink-0">✅</span>
              <div>
                <span className="font-semibold text-gray-900">Intuitive Interface</span>
                <p className="text-sm text-gray-600 mt-1">Effortless navigation for users of all ages</p>
              </div>
            </div>
            <div className="flex items-start gap-3 bg-purple-50 rounded-lg p-4 hover:bg-purple-100 transition-colors duration-200">
              <span className="text-green-600 font-bold text-xl flex-shrink-0">✅</span>
              <div>
                <span className="font-semibold text-gray-900">Live + Recorded</span>
                <p className="text-sm text-gray-600 mt-1">Unlike many platforms, we offer both real-time and on-demand learning</p>
              </div>
            </div>
            <div className="flex items-start gap-3 bg-purple-50 rounded-lg p-4 hover:bg-purple-100 transition-colors duration-200">
              <span className="text-green-600 font-bold text-xl flex-shrink-0">✅</span>
              <div>
                <span className="font-semibold text-gray-900">Earn as You Teach</span>
                <p className="text-sm text-gray-600 mt-1">Set your own prices, grow your teaching brand</p>
              </div>
            </div>
            <div className="flex items-start gap-3 bg-purple-50 rounded-lg p-4 hover:bg-purple-100 transition-colors duration-200">
              <span className="text-green-600 font-bold text-xl flex-shrink-0">✅</span>
              <div>
                <span className="font-semibold text-gray-900">Free for Learners</span>
                <p className="text-sm text-gray-600 mt-1">Access quality content without a paywall</p>
              </div>
            </div>
            <div className="flex items-start gap-3 bg-purple-50 rounded-lg p-4 hover:bg-purple-100 transition-colors duration-200">
              <span className="text-green-600 font-bold text-xl flex-shrink-0">✅</span>
              <div>
                <span className="font-semibold text-gray-900">All-in-One Platform</span>
                <p className="text-sm text-gray-600 mt-1">Learning, teaching, interaction — all under one roof</p>
              </div>
            </div>
            <div className="flex items-start gap-3 bg-purple-50 rounded-lg p-4 hover:bg-purple-100 transition-colors duration-200">
              <span className="text-green-600 font-bold text-xl flex-shrink-0">✅</span>
              <div>
                <span className="font-semibold text-gray-900">Cross-Platform</span>
                <p className="text-sm text-gray-600 mt-1">Available on Android and Web</p>
              </div>
            </div>
          </div>
        </div>

        {/* What Sets Us Apart */}
        <div className="mb-10 bg-white rounded-2xl shadow-md p-8 border border-gray-100 hover:shadow-xl transition-shadow duration-300">
          <div className="flex items-center gap-3 mb-6">
            <span className="flex items-center justify-center w-10 h-10 rounded-full bg-purple-600 text-white font-bold text-lg">4</span>
            <h2 className="font-bold text-2xl text-gray-900">What Sets Us Apart</h2>
          </div>
          <div className="space-y-5">
            <div className="border-l-4 border-purple-500 bg-gradient-to-r from-purple-50 to-transparent rounded-r-lg p-5 hover:from-purple-100 transition-colors duration-200">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-2xl">🌍</span>
                <h3 className="font-bold text-lg text-gray-900">Truly Open</h3>
              </div>
              <p className="text-gray-700 text-sm leading-relaxed">
                We're the first in Bangladesh to offer a platform where anyone can become a teacher. No degrees or red tape required — just knowledge and the will to share.
              </p>
            </div>
            <div className="border-l-4 border-blue-500 bg-gradient-to-r from-blue-50 to-transparent rounded-r-lg p-5 hover:from-blue-100 transition-colors duration-200">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-2xl">💡</span>
                <h3 className="font-bold text-lg text-gray-900">Instructor Freedom</h3>
              </div>
              <p className="text-gray-700 text-sm leading-relaxed">
                Set your own course prices. Offer free content or create premium learning experiences — all on your terms.
              </p>
            </div>
            <div className="border-l-4 border-green-500 bg-gradient-to-r from-green-50 to-transparent rounded-r-lg p-5 hover:from-green-100 transition-colors duration-200">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-2xl">🛡️</span>
                <h3 className="font-bold text-lg text-gray-900">Secure Payments + Smart Complaints</h3>
              </div>
              <p className="text-gray-700 text-sm leading-relaxed">
                Transparent payment systems and built-in resolution channels ensure trust between students and instructors.
              </p>
            </div>
            <div className="border-l-4 border-yellow-500 bg-gradient-to-r from-yellow-50 to-transparent rounded-r-lg p-5 hover:from-yellow-100 transition-colors duration-200">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-2xl">💰</span>
                <h3 className="font-bold text-lg text-gray-900">Affordable Education</h3>
              </div>
              <p className="text-gray-700 text-sm leading-relaxed">
                Unlike rigid pricing models, Pathon supports flexible pricing, making it accessible for learners from all walks of life.
              </p>
            </div>
            <div className="border-l-4 border-pink-500 bg-gradient-to-r from-pink-50 to-transparent rounded-r-lg p-5 hover:from-pink-100 transition-colors duration-200">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-2xl">📚</span>
                <h3 className="font-bold text-lg text-gray-900">Three-in-One Learning</h3>
              </div>
              <p className="text-gray-700 text-sm leading-relaxed">
                Recorded sessions, live classes, problem-solving interactions — a robust academic toolkit in one space.
              </p>
            </div>
          </div>
        </div>

        {/* Meet the People */}
        <div className="mb-10 bg-white rounded-2xl shadow-md p-8 border border-gray-100 hover:shadow-xl transition-shadow duration-300">
          <div className="flex items-center gap-3 mb-6">
            <span className="flex items-center justify-center w-10 h-10 rounded-full bg-purple-600 text-white font-bold text-lg">5</span>
            <h2 className="font-bold text-2xl text-gray-900">Meet the People Behind Pathon</h2>
          </div>
          <div className="space-y-6">
            <div className="bg-gradient-to-r from-purple-50 to-blue-50 rounded-xl p-6 border border-purple-200">
              <div className="flex items-center gap-2 mb-4">
                <span className="text-2xl">🧭</span>
                <h3 className="font-bold text-lg text-purple-900">Board Members — Our Visionaries</h3>
              </div>
              <div className="pl-4 border-l-4 border-purple-400 space-y-3">
                <p className="text-gray-700 italic">"Knowledge grows only when it's shared."</p>
                <p className="text-gray-700 italic">"Education is not just content — it's connection."</p>
                <p className="text-gray-700 italic">"Pathon breaks the walls around knowledge."</p>
                <p className="text-gray-700 italic">"When teachers thrive, society thrives."</p>
                <p className="text-sm not-italic text-gray-600 font-medium mt-4">— Name_1, Name_2, Name_3, Name_4</p>
              </div>
            </div>
            <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-6 border border-blue-200">
              <div className="flex items-center gap-2 mb-4">
                <span className="text-2xl">💻</span>
                <h3 className="font-bold text-lg text-blue-900">Development Team — Our Tech Architects</h3>
              </div>
              <div className="pl-4 border-l-4 border-blue-400">
                <p className="text-gray-700 italic">"Building Pathon wasn't just about writing code — it was about designing the future of learning."</p>
                <p className="text-sm not-italic text-gray-600 font-medium mt-4">— Team Lead, Pathon Dev Team</p>
              </div>
            </div>
            <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl p-6 border border-green-200">
              <div className="flex items-center gap-2 mb-4">
                <span className="text-2xl">🌱</span>
                <h3 className="font-bold text-lg text-green-900">Our Community — The Real Heroes</h3>
              </div>
              <div className="pl-4 border-l-4 border-green-400 space-y-3">
                <p className="text-gray-700 italic">"Belief is where all great platforms begin — our users believed from Day One."</p>
                <p className="text-gray-700 italic">"Pathon's real strength lies in the people who shaped it — our users."</p>
                <p className="text-gray-700 italic">"Our learners and teachers are not users — they are co-creators."</p>
              </div>
            </div>
          </div>
        </div>

        {/* Partner in Innovation */}
        <div className="mb-10 bg-gradient-to-br from-purple-100 via-purple-50 to-blue-50 rounded-2xl shadow-lg p-8 border-2 border-purple-300">
          <div className="flex items-center gap-3 mb-5">
            <span className="flex items-center justify-center w-10 h-10 rounded-full bg-purple-700 text-white font-bold text-lg">6</span>
            <h2 className="font-bold text-2xl text-gray-900">Our Partner in Innovation</h2>
          </div>
          <div className="bg-white/70 backdrop-blur-sm rounded-xl p-6">
            <p className="mb-4 text-gray-800 leading-relaxed">
              Pathon proudly owes its launch to the <span className="font-bold text-purple-700 bg-purple-100 px-2 py-1 rounded">IDEA Contest by a2i (Aspire to Innovate)</span>, a flagship program under the Government of Bangladesh.
            </p>
            <p className="mb-4 text-gray-700 leading-relaxed">
              Their visionary support recognized our mission to democratize education and helped turn a bold idea into a national innovation.
            </p>
            <div className="flex items-center gap-2 text-purple-700 font-medium bg-purple-50 rounded-lg p-3 border border-purple-200">
              <span className="text-2xl">🙏</span>
              <p>We thank a2i for championing homegrown tech and enabling us to build something transformative.</p>
            </div>
          </div>
        </div>

        {/* Final Thoughts */}
        <div className="bg-white rounded-2xl shadow-md p-8 border border-gray-100">
          <div className="flex items-center gap-3 mb-5">
            <span className="flex items-center justify-center w-10 h-10 rounded-full bg-purple-600 text-white font-bold text-lg">7</span>
            <h2 className="font-bold text-2xl text-gray-900">Final Thoughts</h2>
          </div>
          <p className="mb-4 text-gray-700 leading-relaxed text-center">
            At Pathon, we believe in community-led, barrier-free, and purpose-driven learning.
          </p>
          <p className="mb-6 text-gray-700 leading-relaxed text-center">
            Whether you're here to teach, learn, solve, or simply explore — Pathon is your space.
          </p>
          <div className="relative bg-gradient-to-r from-purple-500 via-purple-600 to-blue-600 rounded-2xl p-8 shadow-xl overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent"></div>
            <div className="relative">
              <div className="flex justify-center mb-4">
                <span className="text-6xl">🚀</span>
              </div>
              <p className="text-white font-semibold text-xl text-center leading-relaxed">
                "We're not just building an education platform. We're building a future where learning has no limits, and everyone is empowered to contribute."
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;
