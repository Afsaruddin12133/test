import React from 'react';

const Terms = () => {
    return (
        <section className="px-4 sm:px-6 lg:px-8 py-12 bg-gradient-to-b from-purple-50 to-white">
            {/* Title */}
            <div className="flex justify-center mb-8">
                <span className="inline-flex items-center rounded-xl border-2 border-purple-600 bg-white px-8 py-2.5 text-purple-700 font-bold text-2xl lg:text-3xl shadow-md">
                    Terms of Use
                </span>
            </div>

            <div className="mx-auto max-w-5xl">
                {/* Effective Date */}
                

                {/* Introduction */}
                <div className="bg-white rounded-2xl shadow-md p-8 mb-8 border border-gray-100">
                    <div className="">
                    <p className="text-left text-gray-700">
                        <span className="font-semibold">Effective Date:</span> May 15, 2025
                    </p>
                    <br />
                </div>
                    <p className="text-gray-700 leading-relaxed">
                        Welcome to <span className="font-semibold text-purple-700">Pathon</span>, a community-driven online learning platform accessible via Android and Web. These Terms of Use ("Terms") govern your access to and use of the services ("Services") provided by Pathon. By accessing or using our platform, you agree to be bound by these Terms. If you do not agree, please discontinue use.
                    </p>
                </div>

                {/* Section 1 */}
                <div className="bg-white rounded-2xl shadow-md p-8 mb-8 border border-gray-100 hover:shadow-xl transition-shadow duration-300">
                    <div className="flex items-center gap-3 mb-5">
                        <span className="flex items-center justify-center w-10 h-10 rounded-full bg-purple-600 text-white font-bold text-lg">1</span>
                        <h2 className="font-bold text-2xl text-gray-900">User Accounts and Access</h2>
                    </div>
                    <div className="space-y-4">
                        <div className="border-l-4 border-purple-500 bg-purple-50 rounded-r-lg p-4">
                            <p className="font-semibold text-gray-900 mb-2">✓ Eligibility</p>
                            <p className="text-gray-700 text-sm">Open to users of all age groups.</p>
                        </div>
                        <div className="border-l-4 border-blue-500 bg-blue-50 rounded-r-lg p-4">
                            <p className="font-semibold text-gray-900 mb-2">✓ Registration</p>
                            <p className="text-gray-700 text-sm">Requires a valid mobile number and email address.</p>
                        </div>
                        <div className="border-l-4 border-green-500 bg-green-50 rounded-r-lg p-4">
                            <p className="font-semibold text-gray-900 mb-2">✓ Login</p>
                            <p className="text-gray-700 text-sm">Pathon uses a password-free OTP (One-Time Password) system for secure login.</p>
                        </div>
                        <div className="border-l-4 border-yellow-500 bg-yellow-50 rounded-r-lg p-4">
                            <p className="font-semibold text-gray-900 mb-2">⚠️ User Responsibility</p>
                            <p className="text-gray-700 text-sm">Users are responsible for all activities occurring under their accounts. Keep your device secure and do not share your OTPs.</p>
                        </div>
                    </div>
                </div>

                {/* Section 2 */}
                <div className="bg-white rounded-2xl shadow-md p-8 mb-8 border border-gray-100 hover:shadow-xl transition-shadow duration-300">
                    <div className="flex items-center gap-3 mb-5">
                        <span className="flex items-center justify-center w-10 h-10 rounded-full bg-purple-600 text-white font-bold text-lg">2</span>
                        <h2 className="font-bold text-2xl text-gray-900">Platform Purpose and Intended Use</h2>
                    </div>
                    <div className="space-y-4">
                        <div className="bg-gradient-to-r from-purple-50 to-blue-50 rounded-xl p-5 border border-purple-200">
                            <div className="flex items-center gap-2 mb-2">
                                <span className="text-2xl">🌍</span>
                                <p className="font-semibold text-gray-900">Knowledge Sharing</p>
                            </div>
                            <p className="text-gray-700 text-sm">The platform encourages open exchange of knowledge across all age, location, and background.</p>
                        </div>
                        <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-5 border border-blue-200">
                            <div className="flex items-center gap-2 mb-2">
                                <span className="text-2xl">👥</span>
                                <p className="font-semibold text-gray-900">Age Suitability</p>
                            </div>
                            <p className="text-gray-700 text-sm">Course creators may recommend suitable age groups. However, Pathon does not enforce such restrictions. User discretion is advised.</p>
                        </div>
                    </div>
                </div>

                {/* Section 3 */}
                <div className="bg-white rounded-2xl shadow-md p-8 mb-8 border border-gray-100 hover:shadow-xl transition-shadow duration-300">
                    <div className="flex items-center gap-3 mb-5">
                        <span className="flex items-center justify-center w-10 h-10 rounded-full bg-purple-600 text-white font-bold text-lg">3</span>
                        <h2 className="font-bold text-2xl text-gray-900">User-Generated Content</h2>
                    </div>
                    <div className="grid md:grid-cols-3 gap-4">
                        <div className="bg-purple-50 rounded-xl p-5 border border-purple-200 hover:border-purple-400 transition-colors duration-200">
                            <div className="flex items-center gap-2 mb-3">
                                <span className="text-3xl">🎥</span>
                                <h3 className="font-bold text-gray-900">Course Creation</h3>
                            </div>
                            <p className="text-gray-700 text-sm">Any registered user may upload video courses or host live classes.</p>
                        </div>
                        <div className="bg-blue-50 rounded-xl p-5 border border-blue-200 hover:border-blue-400 transition-colors duration-200">
                            <div className="flex items-center gap-2 mb-3">
                                <span className="text-3xl">⚖️</span>
                                <h3 className="font-bold text-gray-900">Responsibility</h3>
                            </div>
                            <p className="text-gray-700 text-sm">Pathon does not pre-screen content for legality, accuracy, or appropriateness. Creators bear sole responsibility for what they publish.</p>
                        </div>
                        <div className="bg-green-50 rounded-xl p-5 border border-green-200 hover:border-green-400 transition-colors duration-200">
                            <div className="flex items-center gap-2 mb-3">
                                <span className="text-3xl">⭐</span>
                                <h3 className="font-bold text-gray-900">Feedback System</h3>
                            </div>
                            <p className="text-gray-700 text-sm">Students may rate and comment on courses. These serve as the primary quality indicators.</p>
                        </div>
                    </div>
                </div>

                {/* Section 4 */}
                <div className="bg-white rounded-2xl shadow-md p-8 mb-8 border border-gray-100 hover:shadow-xl transition-shadow duration-300">
                    <div className="flex items-center gap-3 mb-5">
                        <span className="flex items-center justify-center w-10 h-10 rounded-full bg-purple-600 text-white font-bold text-lg">4</span>
                        <h2 className="font-bold text-2xl text-gray-900">Course Accessibility</h2>
                    </div>
                    <div className="grid md:grid-cols-2 gap-5">
                        <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-6 border-2 border-green-300">
                            <div className="flex items-center gap-2 mb-3">
                                <span className="text-3xl">🌐</span>
                                <h3 className="font-bold text-lg text-green-900">Public Courses</h3>
                            </div>
                            <p className="text-gray-700">Accessible by all Pathon users.</p>
                        </div>
                        <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl p-6 border-2 border-purple-300">
                            <div className="flex items-center gap-2 mb-3">
                                <span className="text-3xl">🔐</span>
                                <h3 className="font-bold text-lg text-purple-900">Private Courses</h3>
                            </div>
                            <p className="text-gray-700">Only accessible through shared links.</p>
                        </div>
                    </div>
                </div>

                {/* Section 5 */}
                <div className="bg-white rounded-2xl shadow-md p-8 mb-8 border border-gray-100 hover:shadow-xl transition-shadow duration-300">
                    <div className="flex items-center gap-3 mb-5">
                        <span className="flex items-center justify-center w-10 h-10 rounded-full bg-purple-600 text-white font-bold text-lg">5</span>
                        <h2 className="font-bold text-2xl text-gray-900">Course Pricing and Transactions</h2>
                    </div>
                    
                    <div className="space-y-5">
                        <div className="bg-green-50 rounded-xl p-5 border border-green-200">
                            <div className="flex items-center gap-2 mb-2">
                                <span className="text-2xl">🆓</span>
                                <h3 className="font-bold text-gray-900">Free Courses</h3>
                            </div>
                            <p className="text-gray-700 text-sm">No payment required.</p>
                        </div>

                        <div className="bg-blue-50 rounded-xl p-5 border border-blue-200">
                            <div className="flex items-center gap-2 mb-3">
                                <span className="text-2xl">💳</span>
                                <h3 className="font-bold text-gray-900">Paid Courses</h3>
                            </div>
                            <div className="space-y-3 ml-6">
                                <div className="flex items-start gap-2">
                                    <span className="text-blue-600 font-bold">•</span>
                                    <div>
                                        <span className="font-semibold text-gray-900">Negotiable:</span>
                                        <span className="text-gray-700 text-sm"> Students can propose a price.</span>
                                    </div>
                                </div>
                                <div className="flex items-start gap-2">
                                    <span className="text-blue-600 font-bold">•</span>
                                    <div>
                                        <span className="font-semibold text-gray-900">Non-Negotiable:</span>
                                        <span className="text-gray-700 text-sm"> Instructor sets a fixed price.</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="bg-purple-50 rounded-xl p-5 border border-purple-200">
                            <div className="flex items-center gap-2 mb-2">
                                <span className="text-2xl">🔄</span>
                                <h3 className="font-bold text-gray-900">Pricing Adjustments</h3>
                            </div>
                            <p className="text-gray-700 text-sm">Instructors may change the course model at any time. Changes apply only to future enrollments.</p>
                        </div>

                        <div className="bg-yellow-50 rounded-xl p-5 border-2 border-yellow-300">
                            <div className="flex items-center gap-2 mb-3">
                                <span className="text-2xl">↩️</span>
                                <h3 className="font-bold text-gray-900">Refund Policy</h3>
                            </div>
                            <p className="text-gray-700 text-sm mb-3">Refund requests can be made within <span className="font-semibold">24 hours of enrollment</span> if:</p>
                            <ul className="space-y-2 ml-6">
                                <li className="flex items-start gap-2 text-gray-700 text-sm">
                                    <span className="text-yellow-600">✗</span>
                                    <span>No content exists</span>
                                </li>
                                <li className="flex items-start gap-2 text-gray-700 text-sm">
                                    <span className="text-yellow-600">✗</span>
                                    <span>The content is misleading or false</span>
                                </li>
                                <li className="flex items-start gap-2 text-gray-700 text-sm">
                                    <span className="text-yellow-600">✗</span>
                                    <span>The course is incomplete</span>
                                </li>
                            </ul>
                            <p className="text-gray-700 text-sm mt-3 font-medium">Valid claims receive full refunds. Invalid claims will be rejected.</p>
                        </div>
                    </div>
                </div>

                {/* Section 6 */}
                <div className="bg-white rounded-2xl shadow-md p-8 mb-8 border border-gray-100 hover:shadow-xl transition-shadow duration-300">
                    <div className="flex items-center gap-3 mb-5">
                        <span className="flex items-center justify-center w-10 h-10 rounded-full bg-purple-600 text-white font-bold text-lg">6</span>
                        <h2 className="font-bold text-2xl text-gray-900">Content Hosting and Live Class Delivery</h2>
                    </div>
                    <div className="space-y-4">
                        <div className="bg-red-50 rounded-xl p-5 border-l-4 border-red-500">
                            <div className="flex items-center gap-2 mb-2">
                                <span className="text-2xl">🎬</span>
                                <h3 className="font-bold text-gray-900">Recorded Classes</h3>
                            </div>
                            <p className="text-gray-700 text-sm">Videos are hosted on YouTube. If a video is deleted from YouTube, it becomes inaccessible on Pathon.</p>
                        </div>
                        <div className="bg-orange-50 rounded-xl p-5 border-l-4 border-orange-500">
                            <div className="flex items-center gap-2 mb-2">
                                <span className="text-2xl">📹</span>
                                <h3 className="font-bold text-gray-900">Live Classes</h3>
                            </div>
                            <p className="text-gray-700 text-sm">Held via third-party video conferencing tools. Pathon is not liable for any technical or content issues arising from these services.</p>
                        </div>
                    </div>
                </div>

                {/* Section 7 */}
                <div className="bg-white rounded-2xl shadow-md p-8 mb-8 border border-gray-100 hover:shadow-xl transition-shadow duration-300">
                    <div className="flex items-center gap-3 mb-5">
                        <span className="flex items-center justify-center w-10 h-10 rounded-full bg-purple-600 text-white font-bold text-lg">7</span>
                        <h2 className="font-bold text-2xl text-gray-900">Content Protection & Anti-Piracy</h2>
                    </div>
                    <div className="space-y-4">
                        <div className="bg-red-50 rounded-xl p-5 border-2 border-red-300">
                            <div className="flex items-center gap-2 mb-2">
                                <span className="text-2xl">⛔</span>
                                <h3 className="font-bold text-gray-900">Download Restrictions</h3>
                            </div>
                            <p className="text-gray-700 text-sm">Pathon does not permit downloading videos from the platform.</p>
                        </div>
                        <div className="bg-orange-50 rounded-xl p-5 border-2 border-orange-300">
                            <div className="flex items-center gap-2 mb-2">
                                <span className="text-2xl">📵</span>
                                <h3 className="font-bold text-gray-900">Screen Recording</h3>
                            </div>
                            <p className="text-gray-700 text-sm">While not technically blocked, it is considered a violation of intellectual property rights.</p>
                        </div>
                        <div className="bg-purple-50 rounded-xl p-5 border-2 border-purple-300">
                            <div className="flex items-center gap-2 mb-2">
                                <span className="text-2xl">©️</span>
                                <h3 className="font-bold text-gray-900">IP Rights</h3>
                            </div>
                            <p className="text-gray-700 text-sm">Users retain ownership of their content but grant Pathon a non-exclusive license to host, reproduce, and display it on the platform.</p>
                        </div>
                    </div>
                </div>

                {/* Section 8 */}
                <div className="bg-white rounded-2xl shadow-md p-8 mb-8 border border-gray-100 hover:shadow-xl transition-shadow duration-300">
                    <div className="flex items-center gap-3 mb-5">
                        <span className="flex items-center justify-center w-10 h-10 rounded-full bg-purple-600 text-white font-bold text-lg">8</span>
                        <h2 className="font-bold text-2xl text-gray-900">Data Privacy and Sharing</h2>
                    </div>
                    <div className="grid md:grid-cols-2 gap-5 mb-4">
                        <div className="bg-green-50 rounded-xl p-5 border-2 border-green-300">
                            <div className="flex items-center gap-2 mb-3">
                                <span className="text-2xl">✓</span>
                                <h3 className="font-bold text-green-900">What We Share</h3>
                            </div>
                            <p className="text-gray-700 text-sm">Public profile information (e.g., name, profession) may be visible to other users.</p>
                        </div>
                        <div className="bg-red-50 rounded-xl p-5 border-2 border-red-300">
                            <div className="flex items-center gap-2 mb-3">
                                <span className="text-2xl">✗</span>
                                <h3 className="font-bold text-red-900">What We Don't Share</h3>
                            </div>
                            <p className="text-gray-700 text-sm">Email addresses and mobile numbers remain private.</p>
                        </div>
                    </div>
                    <div className="bg-blue-50 rounded-lg p-4 border-l-4 border-blue-500">
                        <p className="text-gray-700 text-sm">
                            <span className="font-semibold">Policy Link:</span> Refer to our <span className="text-blue-700 font-semibold underline cursor-pointer">[Privacy Policy]</span> for detailed information on data collection and protection.
                        </p>
                    </div>
                </div>

                {/* Section 9 */}
                <div className="bg-white rounded-2xl shadow-md p-8 mb-8 border border-gray-100 hover:shadow-xl transition-shadow duration-300">
                    <div className="flex items-center gap-3 mb-5">
                        <span className="flex items-center justify-center w-10 h-10 rounded-full bg-purple-600 text-white font-bold text-lg">9</span>
                        <h2 className="font-bold text-2xl text-gray-900">Availability and Platform Changes</h2>
                    </div>
                    <p className="text-gray-700 leading-relaxed">
                        We strive for uninterrupted service but do not guarantee continuous availability. Pathon may modify, suspend, or terminate portions of the platform without prior notice.
                    </p>
                </div>

                {/* Section 10 */}
                <div className="bg-white rounded-2xl shadow-md p-8 mb-8 border border-gray-100 hover:shadow-xl transition-shadow duration-300">
                    <div className="flex items-center gap-3 mb-5">
                        <span className="flex items-center justify-center w-10 h-10 rounded-full bg-purple-600 text-white font-bold text-lg">10</span>
                        <h2 className="font-bold text-2xl text-gray-900">Limitation of Liability</h2>
                    </div>
                    <div className="space-y-4">
                        <div className="bg-yellow-50 rounded-xl p-5 border-l-4 border-yellow-500">
                            <div className="flex items-center gap-2 mb-2">
                                <span className="text-2xl">⚠️</span>
                                <h3 className="font-bold text-gray-900">As-Is Service</h3>
                            </div>
                            <p className="text-gray-700 text-sm">The platform is provided without warranties or guarantees.</p>
                        </div>
                        <div className="bg-red-50 rounded-xl p-5 border-l-4 border-red-500">
                            <div className="flex items-center gap-2 mb-2">
                                <span className="text-2xl">🚫</span>
                                <h3 className="font-bold text-gray-900">No Liability</h3>
                            </div>
                            <p className="text-gray-700 text-sm">Pathon is not responsible for any losses resulting from content errors, system outages, or misuse of the platform.</p>
                        </div>
                    </div>
                </div>

                {/* Section 11 */}
                <div className="bg-white rounded-2xl shadow-md p-8 mb-8 border border-gray-100 hover:shadow-xl transition-shadow duration-300">
                    <div className="flex items-center gap-3 mb-5">
                        <span className="flex items-center justify-center w-10 h-10 rounded-full bg-purple-600 text-white font-bold text-lg">11</span>
                        <h2 className="font-bold text-2xl text-gray-900">Modifications to Terms</h2>
                    </div>
                    <p className="text-gray-700 leading-relaxed">
                        These Terms may be updated from time to time. Significant changes will be communicated via the platform. Continued use constitutes acceptance of updated Terms.
                    </p>
                </div>

                {/* Section 12 */}
                <div className="bg-white rounded-2xl shadow-md p-8 mb-8 border border-gray-100 hover:shadow-xl transition-shadow duration-300">
                    <div className="flex items-center gap-3 mb-5">
                        <span className="flex items-center justify-center w-10 h-10 rounded-full bg-purple-600 text-white font-bold text-lg">12</span>
                        <h2 className="font-bold text-2xl text-gray-900">Governing Law</h2>
                    </div>
                    <div className="bg-gradient-to-r from-purple-50 to-blue-50 rounded-xl p-6 border border-purple-200">
                        <p className="text-gray-700 leading-relaxed">
                            These Terms are governed by the laws of <span className="font-semibold text-purple-700">[Insert Country]</span>. All disputes shall be subject to the jurisdiction of the courts in <span className="font-semibold text-purple-700">[Insert Jurisdiction]</span>.
                        </p>
                    </div>
                </div>

                {/* Section 13 - Contact */}
                <div className="bg-gradient-to-br from-purple-100 via-purple-50 to-blue-50 rounded-2xl shadow-lg p-8 border-2 border-purple-300">
                    <div className="flex items-center gap-3 mb-5">
                        <span className="flex items-center justify-center w-10 h-10 rounded-full bg-purple-700 text-white font-bold text-lg">13</span>
                        <h2 className="font-bold text-2xl text-gray-900">Contact Us</h2>
                    </div>
                    <p className="text-gray-700 mb-5">If you have any questions regarding these Terms:</p>
                    <div className="bg-white/70 backdrop-blur-sm rounded-xl p-6 space-y-4">
                        <div className="flex items-center gap-3">
                            <span className="text-3xl">📧</span>
                            <div>
                                <p className="text-sm text-gray-600">Email</p>
                                <p className="font-semibold text-purple-700">[Insert Contact Email]</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-3">
                            <span className="text-3xl">🌐</span>
                            <div>
                                <p className="text-sm text-gray-600">Website</p>
                                <p className="font-semibold text-purple-700">[Insert Pathon Website URL]</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Terms;