import React from "react";

const Privacy = () => {
  return (
    <section className="px-4 sm:px-6 lg:px-8 py-12 bg-gradient-to-b from-purple-50 to-white">
      {/* Title */}
      <div className="flex justify-center mb-8">
        <span className="inline-flex items-center rounded-xl border-2 border-purple-600 bg-white px-8 py-2.5 text-purple-700 font-bold text-2xl lg:text-3xl shadow-md">
          Privacy Policy
        </span>
      </div>

      <div className="mx-auto max-w-4xl">
        {/* Effective Date */}
        

        {/* Introduction */}
        <div className="bg-white rounded-2xl shadow-md p-8 mb-8 border border-gray-100">
          <div className="">
          <p className="text-left text-gray-700">
            <span className="font-semibold">Effective Date:</span> July 5, 2025
          </p>
          <p className="text-left text-gray-600 text-sm mt-1">
            Last Updated: [Insert Date]
          </p>
          <br />
        </div>
          <p className="text-gray-700 leading-relaxed">
            This Privacy Policy ("Policy") describes how <span className="font-semibold text-purple-700">Pathon</span> (also referred to as "we," "us," or "our") collects, uses, discloses, and protects your personal data when you access or use our platform, including the website, mobile applications, and any associated services ("Services"). By using the Services, you consent to the practices described in this Policy.
          </p>
        </div>

        {/* Section 1 */}
        <div className="bg-white rounded-2xl shadow-md p-8 mb-8 border border-gray-100 hover:shadow-xl transition-shadow duration-300">
          <div className="flex items-center gap-3 mb-5">
            <span className="flex items-center justify-center w-10 h-10 rounded-full bg-purple-600 text-white font-bold text-lg">1</span>
            <h2 className="font-bold text-2xl text-gray-900">Information We Collect</h2>
          </div>
          <p className="text-gray-700 mb-6 leading-relaxed">
            We collect two types of data: personal information (such as name or contact details) and usage information (such as device details or browsing behavior).
          </p>

          <div className="space-y-6">
            <div className="bg-purple-50 rounded-xl p-5 border border-purple-200">
              <h3 className="font-bold text-lg text-gray-900 mb-3">1.1 Information You Provide</h3>
              <ul className="space-y-2 text-gray-700">
                <li className="flex items-start gap-2">
                  <span className="text-purple-600 font-bold mt-1">•</span>
                  <div><span className="font-semibold">Account Data:</span> Mobile number and email for OTP-based login.</div>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-purple-600 font-bold mt-1">•</span>
                  <div><span className="font-semibold">Profile Data:</span> Name, photo, date of birth, address, education, profession.</div>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-purple-600 font-bold mt-1">•</span>
                  <div><span className="font-semibold">Content Data:</span> Course titles, descriptions, YouTube links, uploaded files, and tags.</div>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-purple-600 font-bold mt-1">•</span>
                  <div><span className="font-semibold">Financial Data:</span> Payment IDs or mobile wallet numbers (but not sensitive info like balance or PIN).</div>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-purple-600 font-bold mt-1">•</span>
                  <div><span className="font-semibold">Feedback:</span> Course reviews, ratings, and complaint submissions.</div>
                </li>
              </ul>
            </div>

            <div className="bg-blue-50 rounded-xl p-5 border border-blue-200">
              <h3 className="font-bold text-lg text-gray-900 mb-3">1.2 Information Collected Automatically</h3>
              <ul className="space-y-2 text-gray-700">
                <li className="flex items-start gap-2">
                  <span className="text-blue-600 font-bold mt-1">•</span>
                  <div><span className="font-semibold">System Data:</span> Device type, OS, IP address, browser, and technical diagnostics.</div>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-600 font-bold mt-1">•</span>
                  <div><span className="font-semibold">Usage Data:</span> Interactions like course views, search queries, page clicks, and time spent.</div>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-600 font-bold mt-1">•</span>
                  <div><span className="font-semibold">Geographic Data:</span> Approximate city and country based on IP address.</div>
                </li>
              </ul>
            </div>

            <div className="bg-green-50 rounded-xl p-5 border border-green-200">
              <h3 className="font-bold text-lg text-gray-900 mb-3">1.3 Cookies and Tracking</h3>
              <p className="text-gray-700">
                We use cookies and related technologies to personalize your experience, monitor performance, and analyze usage patterns.
              </p>
            </div>
          </div>
        </div>
        {/* Section 2 */}
        <div className="bg-white rounded-2xl shadow-md p-8 mb-8 border border-gray-100 hover:shadow-xl transition-shadow duration-300">
          <div className="flex items-center gap-3 mb-5">
            <span className="flex items-center justify-center w-10 h-10 rounded-full bg-purple-600 text-white font-bold text-lg">2</span>
            <h2 className="font-bold text-2xl text-gray-900">How We Use Your Data</h2>
          </div>
          <p className="text-gray-700 mb-4 leading-relaxed">
            We use your data to operate and improve our Services, including:
          </p>
          <div className="grid sm:grid-cols-2 gap-3">
            <div className="flex items-start gap-2 bg-purple-50 rounded-lg p-3">
              <span className="text-purple-600 font-bold text-xl">✓</span>
              <span className="text-gray-700 text-sm">Creating and managing accounts</span>
            </div>
            <div className="flex items-start gap-2 bg-purple-50 rounded-lg p-3">
              <span className="text-purple-600 font-bold text-xl">✓</span>
              <span className="text-gray-700 text-sm">Customizing content and recommendations</span>
            </div>
            <div className="flex items-start gap-2 bg-purple-50 rounded-lg p-3">
              <span className="text-purple-600 font-bold text-xl">✓</span>
              <span className="text-gray-700 text-sm">Authenticating logins via OTP</span>
            </div>
            <div className="flex items-start gap-2 bg-purple-50 rounded-lg p-3">
              <span className="text-purple-600 font-bold text-xl">✓</span>
              <span className="text-gray-700 text-sm">Processing payments and instructor payouts</span>
            </div>
            <div className="flex items-start gap-2 bg-purple-50 rounded-lg p-3">
              <span className="text-purple-600 font-bold text-xl">✓</span>
              <span className="text-gray-700 text-sm">Investigating fraud or misconduct</span>
            </div>
            <div className="flex items-start gap-2 bg-purple-50 rounded-lg p-3">
              <span className="text-purple-600 font-bold text-xl">✓</span>
              <span className="text-gray-700 text-sm">Delivering notifications, reminders, and announcements</span>
            </div>
            <div className="flex items-start gap-2 bg-purple-50 rounded-lg p-3 sm:col-span-2">
              <span className="text-purple-600 font-bold text-xl">✓</span>
              <span className="text-gray-700 text-sm">Conducting analytics to improve features and usability</span>
            </div>
          </div>
        </div>

        {/* Section 3 */}
        <div className="bg-white rounded-2xl shadow-md p-8 mb-8 border border-gray-100 hover:shadow-xl transition-shadow duration-300">
          <div className="flex items-center gap-3 mb-5">
            <span className="flex items-center justify-center w-10 h-10 rounded-full bg-purple-600 text-white font-bold text-lg">3</span>
            <h2 className="font-bold text-2xl text-gray-900">Information Sharing</h2>
          </div>
          
          <div className="grid md:grid-cols-2 gap-5">
            <div className="bg-red-50 rounded-xl p-5 border-2 border-red-200">
              <h3 className="font-bold text-lg text-red-900 mb-3 flex items-center gap-2">
                <span className="text-2xl">🔒</span>
                Not Shared Publicly
              </h3>
              <ul className="space-y-2 text-gray-700 text-sm">
                <li className="flex items-center gap-2">
                  <span className="text-red-600">✗</span>
                  Mobile number
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-red-600">✗</span>
                  Email address
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-red-600">✗</span>
                  Private course content
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-red-600">✗</span>
                  Sensitive financial info
                </li>
              </ul>
            </div>

            <div className="bg-green-50 rounded-xl p-5 border-2 border-green-200">
              <h3 className="font-bold text-lg text-green-900 mb-3 flex items-center gap-2">
                <span className="text-2xl">👥</span>
                May Be Shared
              </h3>
              <ul className="space-y-2 text-gray-700 text-sm">
                <li className="flex items-center gap-2">
                  <span className="text-green-600">✓</span>
                  Public profile data (excluding contact info)
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-green-600">✓</span>
                  Public course content
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-green-600">✓</span>
                  Problem-solving module responses
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-green-600">✓</span>
                  Feedback and ratings
                </li>
              </ul>
            </div>
          </div>

          <div className="mt-5 bg-yellow-50 border-l-4 border-yellow-500 p-4 rounded-r-lg">
            <p className="text-gray-800 font-semibold flex items-center gap-2">
              <span className="text-2xl">⚠️</span>
              We do not sell your data to any third party.
            </p>
          </div>
        </div>

        {/* Section 4 */}
        <div className="bg-white rounded-2xl shadow-md p-8 mb-8 border border-gray-100 hover:shadow-xl transition-shadow duration-300">
          <div className="flex items-center gap-3 mb-5">
            <span className="flex items-center justify-center w-10 h-10 rounded-full bg-purple-600 text-white font-bold text-lg">4</span>
            <h2 className="font-bold text-2xl text-gray-900">Data Security</h2>
          </div>
          <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-6 border border-blue-200">
            <p className="text-gray-700 leading-relaxed">
              We use <span className="font-semibold text-blue-700">encryption</span>, <span className="font-semibold text-blue-700">access controls</span>, and <span className="font-semibold text-blue-700">secure storage practices</span> to protect your information. However, no digital platform can guarantee 100% security.
            </p>
          </div>
        </div>

        {/* Section 5 */}
        <div className="bg-white rounded-2xl shadow-md p-8 mb-8 border border-gray-100 hover:shadow-xl transition-shadow duration-300">
          <div className="flex items-center gap-3 mb-5">
            <span className="flex items-center justify-center w-10 h-10 rounded-full bg-purple-600 text-white font-bold text-lg">5</span>
            <h2 className="font-bold text-2xl text-gray-900">Third-Party Services</h2>
          </div>
          <p className="text-gray-700 leading-relaxed">
            Some platform features (e.g., live video, YouTube embedding, payment gateways) are powered by third parties. We do not control how they handle your data, so we recommend reviewing their privacy policies separately.
          </p>
        </div>

        {/* Section 6 */}
        <div className="bg-white rounded-2xl shadow-md p-8 mb-8 border border-gray-100 hover:shadow-xl transition-shadow duration-300">
          <div className="flex items-center gap-3 mb-5">
            <span className="flex items-center justify-center w-10 h-10 rounded-full bg-purple-600 text-white font-bold text-lg">6</span>
            <h2 className="font-bold text-2xl text-gray-900">Children's Data</h2>
          </div>
          <p className="text-gray-700 leading-relaxed">
            Pathon is open to all ages. While age-based content filters are under development, parents and guardians are encouraged to supervise minors' usage.
          </p>
        </div>

        {/* Section 7 */}
        <div className="bg-white rounded-2xl shadow-md p-8 mb-8 border border-gray-100 hover:shadow-xl transition-shadow duration-300">
          <div className="flex items-center gap-3 mb-5">
            <span className="flex items-center justify-center w-10 h-10 rounded-full bg-purple-600 text-white font-bold text-lg">7</span>
            <h2 className="font-bold text-2xl text-gray-900">User Conduct and Content</h2>
          </div>
          <p className="text-gray-700 leading-relaxed">
            Users are solely responsible for the content they create or upload. Pathon reserves the right to remove content that violates laws, community guidelines, or ethical standards. Complaints can be filed within a limited time after course enrollment.
          </p>
        </div>

        {/* Section 8 */}
        <div className="bg-white rounded-2xl shadow-md p-8 mb-8 border border-gray-100 hover:shadow-xl transition-shadow duration-300">
          <div className="flex items-center gap-3 mb-5">
            <span className="flex items-center justify-center w-10 h-10 rounded-full bg-purple-600 text-white font-bold text-lg">8</span>
            <h2 className="font-bold text-2xl text-gray-900">Changes to This Policy</h2>
          </div>
          <p className="text-gray-700 leading-relaxed">
            We may update this Policy periodically. Significant changes will be notified via platform banners or email. Continued use indicates agreement to the updated Policy.
          </p>
        </div>

        {/* Section 9 - Contact */}
        <div className="bg-gradient-to-br from-purple-100 via-purple-50 to-blue-50 rounded-2xl shadow-lg p-8 border-2 border-purple-300">
          <div className="flex items-center gap-3 mb-5">
            <span className="flex items-center justify-center w-10 h-10 rounded-full bg-purple-700 text-white font-bold text-lg">9</span>
            <h2 className="font-bold text-2xl text-gray-900">Contact Us</h2>
          </div>
          <div className="bg-white/70 backdrop-blur-sm rounded-xl p-6 space-y-4">
            <div className="flex items-center gap-3">
              <span className="text-3xl">📧</span>
              <div>
                <p className="text-sm text-gray-600">Email</p>
                <p className="font-semibold text-purple-700">[Insert official contact email]</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-3xl">🏢</span>
              <div>
                <p className="text-sm text-gray-600">Address</p>
                <p className="font-semibold text-purple-700">[Insert Pathon physical or legal address]</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Privacy;
