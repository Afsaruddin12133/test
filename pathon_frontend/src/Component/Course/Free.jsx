import React from 'react';

const Free = () => {
    return (
        <section className="px-4 sm:px-6 lg:px-8 py-12 bg-gradient-to-b from-blue-50 to-white">
            {/* Title */}
            <div className="flex justify-center mb-8">
                <span className="inline-flex items-center rounded-xl border-2 border-blue-600 bg-white px-8 py-2.5 text-blue-700 font-bold text-2xl lg:text-3xl shadow-md">
                    Return & Refund Policy
                </span>
            </div>

            <div className="mx-auto max-w-5xl">
                {/* Effective Date */}
               

                {/* Introduction */}
                <div className="bg-white rounded-2xl shadow-md p-8 mb-8 border border-gray-100">
                     <div className="">
                    <div className="  justify-left items-center gap-4 text-gray-700">
                        <p>
                            <span className="font-semibold">Effective Date:</span> [Insert Date]
                        </p>
                        
                        <p>
                            <span className="font-semibold">Last Updated:</span> [Insert Date]
                        </p>
                        <br />
                    </div>
                </div>
                    <p className="text-gray-700 leading-relaxed">
                        At <span className="font-semibold text-blue-700">Pathon</span>, we strive to deliver high-quality digital learning experiences. This Return & Refund Policy outlines the terms under which learners may request refunds for paid services, and how Pathon handles such requests in a fair, transparent, and balanced manner for both learners and content creators.
                    </p>
                </div>

                {/* Section 1 */}
                <div className="bg-white rounded-2xl shadow-md p-8 mb-8 border border-gray-100 hover:shadow-xl transition-shadow duration-300">
                    <div className="flex items-center gap-3 mb-5">
                        <span className="flex items-center justify-center w-10 h-10 rounded-full bg-blue-600 text-white font-bold text-lg">1</span>
                        <h2 className="font-bold text-2xl text-gray-900">Scope of Policy</h2>
                    </div>
                    <p className="text-gray-700 mb-4">This policy applies exclusively to the following digital services offered on Pathon:</p>
                    <div className="grid md:grid-cols-3 gap-4 mb-4">
                        <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl p-5 border border-purple-200 hover:border-purple-400 transition-colors duration-200">
                            <div className="flex items-center gap-2 mb-2">
                                <span className="text-3xl">🎥</span>
                                <h3 className="font-bold text-gray-900">Recorded Courses</h3>
                            </div>
                            <p className="text-gray-700 text-sm">Paid recorded courses</p>
                        </div>
                        <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-5 border border-blue-200 hover:border-blue-400 transition-colors duration-200">
                            <div className="flex items-center gap-2 mb-2">
                                <span className="text-3xl">📹</span>
                                <h3 className="font-bold text-gray-900">Live Classes</h3>
                            </div>
                            <p className="text-gray-700 text-sm">Paid live classes or sessions</p>
                        </div>
                        <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-5 border border-green-200 hover:border-green-400 transition-colors duration-200">
                            <div className="flex items-center gap-2 mb-2">
                                <span className="text-3xl">🧩</span>
                                <h3 className="font-bold text-gray-900">Problem Solving</h3>
                            </div>
                            <p className="text-gray-700 text-sm">Paid interactions through the Problem Solving module</p>
                        </div>
                    </div>
                    <div className="bg-yellow-50 rounded-lg p-4 border-l-4 border-yellow-500">
                        <p className="text-gray-700 text-sm font-medium">
                            ⚠️ No physical goods or downloadable products are sold on Pathon.
                        </p>
                    </div>
                </div>

                {/* Section 2 */}
                <div className="bg-white rounded-2xl shadow-md p-8 mb-8 border border-gray-100 hover:shadow-xl transition-shadow duration-300">
                    <div className="flex items-center gap-3 mb-5">
                        <span className="flex items-center justify-center w-10 h-10 rounded-full bg-blue-600 text-white font-bold text-lg">2</span>
                        <h2 className="font-bold text-2xl text-gray-900">Refund Eligibility</h2>
                    </div>
                    <div className="bg-blue-50 rounded-xl p-6 mb-5 border-2 border-blue-200">
                        <p className="text-gray-700 leading-relaxed">
                            A user may be eligible for a refund if a complaint is submitted <span className="font-bold text-blue-700">within 48 hours</span> of purchasing or enrolling in a paid service, and the issue falls under any of the following categories:
                        </p>
                    </div>
                    <div className="space-y-4">
                        <div className="bg-red-50 rounded-xl p-5 border-l-4 border-red-500">
                            <div className="flex items-center gap-2 mb-2">
                                <span className="text-2xl">❌</span>
                                <h3 className="font-bold text-gray-900">No Content Delivered</h3>
                            </div>
                            <p className="text-gray-700 text-sm">The service lacks accessible, viewable, or functioning learning material.</p>
                        </div>
                        <div className="bg-orange-50 rounded-xl p-5 border-l-4 border-orange-500">
                            <div className="flex items-center gap-2 mb-2">
                                <span className="text-2xl">⚠️</span>
                                <h3 className="font-bold text-gray-900">Misrepresentation</h3>
                            </div>
                            <p className="text-gray-700 text-sm">The actual service content deviates significantly from its title, description, or preview.</p>
                        </div>
                        <div className="bg-yellow-50 rounded-xl p-5 border-l-4 border-yellow-500">
                            <div className="flex items-center gap-2 mb-2">
                                <span className="text-2xl">📉</span>
                                <h3 className="font-bold text-gray-900">Incomplete Content</h3>
                            </div>
                            <p className="text-gray-700 text-sm">A substantial portion of the promised content is missing or not delivered as advertised.</p>
                        </div>
                    </div>
                    <div className="mt-5 bg-purple-50 rounded-lg p-4 border border-purple-200">
                        <p className="text-gray-700 text-sm">
                            <span className="font-semibold">📝 Note:</span> Refund requests must be submitted via the appropriate reporting mechanism within the platform during the 48-hour eligibility window.
                        </p>
                    </div>
                </div>

                {/* Section 3 */}
                <div className="bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 rounded-2xl shadow-lg p-8 mb-8 border-2 border-blue-300">
                    <div className="flex items-center gap-3 mb-5">
                        <span className="flex items-center justify-center w-10 h-10 rounded-full bg-blue-700 text-white font-bold text-lg">3</span>
                        <h2 className="font-bold text-2xl text-gray-900">48-Hour Payment Holding Period</h2>
                    </div>
                    <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 mb-5">
                        <p className="text-gray-700 leading-relaxed mb-4">
                            All payments for eligible digital services are held in <span className="font-bold text-blue-700">escrow by Pathon for 48 hours</span> following the learner's purchase or enrollment.
                        </p>
                    </div>
                    <div className="grid md:grid-cols-2 gap-4">
                        <div className="bg-green-50 rounded-xl p-5 border-2 border-green-300">
                            <div className="flex items-center gap-2 mb-3">
                                <span className="text-2xl">✅</span>
                                <h3 className="font-bold text-green-900">No Issues Reported</h3>
                            </div>
                            <p className="text-gray-700 text-sm">If no issue is reported within this timeframe, the full amount is released automatically to the content provider.</p>
                        </div>
                        <div className="bg-orange-50 rounded-xl p-5 border-2 border-orange-300">
                            <div className="flex items-center gap-2 mb-3">
                                <span className="text-2xl">⏸️</span>
                                <h3 className="font-bold text-orange-900">Refund Requested</h3>
                            </div>
                            <p className="text-gray-700 text-sm">If a refund request is submitted, the payment will remain on hold until the resolution process is complete.</p>
                        </div>
                    </div>
                </div>

                {/* Section 4 */}
                <div className="bg-white rounded-2xl shadow-md p-8 mb-8 border border-gray-100 hover:shadow-xl transition-shadow duration-300">
                    <div className="flex items-center gap-3 mb-5">
                        <span className="flex items-center justify-center w-10 h-10 rounded-full bg-blue-600 text-white font-bold text-lg">4</span>
                        <h2 className="font-bold text-2xl text-gray-900">Refund Review and Resolution Process</h2>
                    </div>
                    <div className="space-y-5">
                        <div className="bg-blue-50 rounded-xl p-5 border border-blue-200">
                            <h3 className="font-bold text-gray-900 mb-3 flex items-center gap-2">
                                <span className="text-xl">🔍</span>
                                When a refund request is submitted:
                            </h3>
                            <ul className="space-y-2 ml-6">
                                <li className="flex items-start gap-2 text-gray-700 text-sm">
                                    <span className="text-blue-600 mt-1">•</span>
                                    <span>Pathon will assess the issue by reviewing the reported content, comparing it with the description, and contacting the content provider if needed.</span>
                                </li>
                                <li className="flex items-start gap-2 text-gray-700 text-sm">
                                    <span className="text-blue-600 mt-1">•</span>
                                    <span>We aim to resolve most cases within <span className="font-semibold">10 business days</span>.</span>
                                </li>
                                <li className="flex items-start gap-2 text-gray-700 text-sm">
                                    <span className="text-blue-600 mt-1">•</span>
                                    <span>For non-straightforward or complex cases, Pathon may extend this timeframe at its sole discretion to ensure a fair and thorough investigation.</span>
                                </li>
                            </ul>
                        </div>

                        <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl p-5 border border-purple-200">
                            <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                                <span className="text-xl">⚖️</span>
                                Outcome:
                            </h3>
                            <div className="space-y-3">
                                <div className="flex items-start gap-3 bg-green-100 rounded-lg p-3 border border-green-300">
                                    <span className="text-green-600 text-xl">✓</span>
                                    <p className="text-gray-700 text-sm">
                                        <span className="font-semibold">Valid Complaint:</span> A full refund will be issued to the learner.
                                    </p>
                                </div>
                                <div className="flex items-start gap-3 bg-red-100 rounded-lg p-3 border border-red-300">
                                    <span className="text-red-600 text-xl">✗</span>
                                    <p className="text-gray-700 text-sm">
                                        <span className="font-semibold">Unsubstantiated Complaint:</span> The held funds will be released to the content provider.
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="bg-yellow-50 rounded-lg p-4 border-2 border-yellow-400">
                            <p className="text-gray-900 font-semibold text-center">
                                ⚠️ Pathon's decision in all refund matters will be considered final and binding.
                            </p>
                        </div>
                    </div>
                </div>

                {/* Section 5 */}
                <div className="bg-white rounded-2xl shadow-md p-8 mb-8 border border-gray-100 hover:shadow-xl transition-shadow duration-300">
                    <div className="flex items-center gap-3 mb-5">
                        <span className="flex items-center justify-center w-10 h-10 rounded-full bg-red-600 text-white font-bold text-lg">5</span>
                        <h2 className="font-bold text-2xl text-gray-900">Non-Refundable Circumstances</h2>
                    </div>
                    <p className="text-gray-700 mb-5">Refunds will <span className="font-bold text-red-700">not</span> be issued under the following circumstances:</p>
                    <div className="space-y-3">
                        <div className="flex items-start gap-3 bg-red-50 rounded-lg p-4 border-l-4 border-red-500">
                            <span className="text-red-600 text-xl mt-0.5">✗</span>
                            <p className="text-gray-700">The learner changes their mind after purchase</p>
                        </div>
                        <div className="flex items-start gap-3 bg-red-50 rounded-lg p-4 border-l-4 border-red-500">
                            <span className="text-red-600 text-xl mt-0.5">✗</span>
                            <p className="text-gray-700">The learner accessed or substantially completed the content before submitting a complaint</p>
                        </div>
                        <div className="flex items-start gap-3 bg-red-50 rounded-lg p-4 border-l-4 border-red-500">
                            <span className="text-red-600 text-xl mt-0.5">✗</span>
                            <p className="text-gray-700">The learner failed to attend a scheduled live class without prior notice or valid justification</p>
                        </div>
                        <div className="flex items-start gap-3 bg-red-50 rounded-lg p-4 border-l-4 border-red-500">
                            <span className="text-red-600 text-xl mt-0.5">✗</span>
                            <p className="text-gray-700">The refund request was submitted after the 48-hour eligibility window</p>
                        </div>
                    </div>
                </div>

                {/* Section 6 */}
                <div className="bg-white rounded-2xl shadow-md p-8 mb-8 border border-gray-100 hover:shadow-xl transition-shadow duration-300">
                    <div className="flex items-center gap-3 mb-5">
                        <span className="flex items-center justify-center w-10 h-10 rounded-full bg-blue-600 text-white font-bold text-lg">6</span>
                        <h2 className="font-bold text-2xl text-gray-900">Abuse Prevention</h2>
                    </div>
                    <div className="bg-gradient-to-r from-orange-50 to-red-50 rounded-xl p-6 border-2 border-orange-300">
                        <p className="text-gray-700 mb-4">
                            To maintain fairness and platform integrity, users who are found to be repeatedly misusing the refund process may be subject to:
                        </p>
                        <div className="space-y-3 ml-4">
                            <div className="flex items-start gap-2">
                                <span className="text-orange-600 font-bold">⚠️</span>
                                <p className="text-gray-700">Refund privileges being limited or suspended</p>
                            </div>
                            <div className="flex items-start gap-2">
                                <span className="text-orange-600 font-bold">⚠️</span>
                                <p className="text-gray-700">Account-level review for potential misuse</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Section 7 */}
                <div className="bg-white rounded-2xl shadow-md p-8 mb-8 border border-gray-100 hover:shadow-xl transition-shadow duration-300">
                    <div className="flex items-center gap-3 mb-5">
                        <span className="flex items-center justify-center w-10 h-10 rounded-full bg-blue-600 text-white font-bold text-lg">7</span>
                        <h2 className="font-bold text-2xl text-gray-900">Refund Method and Timing</h2>
                    </div>
                    <div className="grid md:grid-cols-2 gap-5">
                        <div className="bg-green-50 rounded-xl p-6 border-2 border-green-300">
                            <div className="flex items-center gap-2 mb-3">
                                <span className="text-2xl">💳</span>
                                <h3 className="font-bold text-gray-900">Refund Method</h3>
                            </div>
                            <p className="text-gray-700 text-sm">All approved refunds will be processed to the original method of payment</p>
                        </div>
                        <div className="bg-blue-50 rounded-xl p-6 border-2 border-blue-300">
                            <div className="flex items-center gap-2 mb-3">
                                <span className="text-2xl">⏱️</span>
                                <h3 className="font-bold text-gray-900">Processing Time</h3>
                            </div>
                            <p className="text-gray-700 text-sm">Depending on the payment gateway or financial provider, it may take <span className="font-semibold">5 to 10 business days</span> for the refunded amount to reflect</p>
                        </div>
                    </div>
                </div>

                {/* Section 8 - Contact */}
                <div className="bg-gradient-to-br from-blue-100 via-blue-50 to-indigo-50 rounded-2xl shadow-lg p-8 border-2 border-blue-300">
                    <div className="flex items-center gap-3 mb-5">
                        <span className="flex items-center justify-center w-10 h-10 rounded-full bg-blue-700 text-white font-bold text-lg">8</span>
                        <h2 className="font-bold text-2xl text-gray-900">Questions and Contact</h2>
                    </div>
                    <p className="text-gray-700 mb-5">For refund-related inquiries or support:</p>
                    <div className="bg-white/70 backdrop-blur-sm rounded-xl p-6 space-y-4">
                        <div className="flex items-center gap-3">
                            <span className="text-3xl">📧</span>
                            <div>
                                <p className="text-sm text-gray-600">Email</p>
                                <p className="font-semibold text-blue-700">[Insert official support email]</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-3">
                            <span className="text-3xl">🌐</span>
                            <div>
                                <p className="text-sm text-gray-600">Website</p>
                                <p className="font-semibold text-blue-700">[Insert Pathon website URL]</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Free;