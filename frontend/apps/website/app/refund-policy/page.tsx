// SOFTMASTER TECHNOLOGY SOLUTIONS PVT LTD
// Refund Policy Page
// File: frontend/apps/website/app/refund-policy/page.tsx

import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Refund Policy | Softmaster Technology Solutions',
  description: 'Refund and cancellation policy for courses, subscriptions, and services at Softmaster Technology Solutions.',
};

export default function RefundPolicyPage() {
  return (
    <main className="min-h-screen bg-white">
      <section className="bg-slate-900 text-white py-16 px-6">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold mb-3">Refund and Cancellation Policy</h1>
          <p className="text-slate-400">Last Updated: January 1, 2025</p>
        </div>
      </section>

      <section className="py-16 px-6">
        <div className="max-w-4xl mx-auto space-y-10 text-slate-700 leading-relaxed">

          <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
            <p className="text-blue-800 font-medium">
              At Softmaster Technology Solutions, we are committed to your satisfaction. Please read
              our refund policy carefully before making any purchase. If you have questions, contact
              us at billing@softmastertech.com before purchasing.
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-slate-900 mb-4">1. Course Enrollments</h2>
            <div className="space-y-4">
              <div className="border border-slate-200 rounded-xl p-5">
                <h3 className="font-semibold text-slate-900 mb-2">Full Refund - Within 7 Days</h3>
                <p className="text-slate-600 text-sm">
                  If you are unsatisfied with a course, you are eligible for a full refund within
                  7 days of enrollment, provided you have not completed more than 20% of the course
                  content.
                </p>
              </div>
              <div className="border border-slate-200 rounded-xl p-5">
                <h3 className="font-semibold text-slate-900 mb-2">Partial Refund - 8 to 14 Days</h3>
                <p className="text-slate-600 text-sm">
                  Between 8 and 14 days of enrollment, you may be eligible for a 50% refund if you
                  have accessed less than 30% of the course content. Processing fees of 5% apply.
                </p>
              </div>
              <div className="border border-slate-200 rounded-xl p-5">
                <h3 className="font-semibold text-slate-900 mb-2">No Refund - After 14 Days</h3>
                <p className="text-slate-600 text-sm">
                  Refund requests made after 14 days of enrollment or after completing more than 30%
                  of course content will not be eligible for any refund.
                </p>
              </div>
            </div>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-slate-900 mb-4">2. Subscriptions</h2>
            <ul className="list-disc pl-6 space-y-3 text-slate-600">
              <li>Monthly subscriptions may be cancelled at any time. Access continues until the end of the billing period. No prorated refunds for unused days.</li>
              <li>Annual subscriptions cancelled within 14 days of purchase are eligible for a full refund minus processing fees. After 14 days, no refund is applicable.</li>
              <li>Subscription cancellation stops future billing. Historical data remains accessible for 30 days after cancellation.</li>
            </ul>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-slate-900 mb-4">3. Software Development and Client Projects</h2>
            <ul className="list-disc pl-6 space-y-3 text-slate-600">
              <li>Advance payments for software projects are non-refundable once development work has commenced.</li>
              <li>Milestone payments are non-refundable after milestone delivery and client approval.</li>
              <li>If a project is cancelled by Softmaster before commencement, 100% of the advance is refunded.</li>
              <li>Disputes related to project deliverables must be raised within 7 business days of delivery.</li>
            </ul>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-slate-900 mb-4">4. Jobs Portal and Recruiter Subscriptions</h2>
            <ul className="list-disc pl-6 space-y-3 text-slate-600">
              <li>Job posting fees are non-refundable once the listing is live on the platform.</li>
              <li>Recruiter subscription refunds follow the same policy as general subscriptions above.</li>
              <li>Resume download credits that have been used are non-refundable.</li>
            </ul>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-slate-900 mb-4">5. Non-Refundable Items</h2>
            <ul className="list-disc pl-6 space-y-3 text-slate-600">
              <li>Issued certificates and transcripts</li>
              <li>Live session fees once the session has taken place</li>
              <li>One-on-one mentoring sessions that have been completed</li>
              <li>Resume review and feedback services once delivered</li>
              <li>Any service marked as "non-refundable" at the time of purchase</li>
            </ul>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-slate-900 mb-4">6. Refund Process</h2>
            <ol className="list-decimal pl-6 space-y-3 text-slate-600">
              <li>Submit a refund request to billing@softmastertech.com with your order ID, registered email, and reason for refund.</li>
              <li>Our billing team will review your request within 3 business days.</li>
              <li>Approved refunds are processed within 7 to 10 business days to the original payment method.</li>
              <li>Razorpay payment gateway processing fees (up to 5%) may be deducted from approved refunds.</li>
              <li>Refunds to credit/debit cards may take additional 5 to 7 business days to reflect as per your bank's processing time.</li>
            </ol>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-slate-900 mb-4">7. Special Circumstances</h2>
            <p className="text-slate-600 mb-3">
              We understand that unforeseen circumstances arise. In cases of medical emergencies,
              natural disasters, or other exceptional situations, please contact us with supporting
              documentation and we will review refund requests on a case-by-case basis.
            </p>
            <p className="text-slate-600">
              If a course is discontinued by Softmaster, enrolled students will receive a full refund
              or credit for equivalent courses, at their choice.
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-slate-900 mb-4">8. Dispute Resolution</h2>
            <p className="text-slate-600">
              If you are not satisfied with our refund decision, you may escalate the issue to
              escalations@softmastertech.com. We will review the case and provide a final decision
              within 10 business days. Unresolved disputes are subject to arbitration under the
              Arbitration and Conciliation Act, 1996, in Hyderabad, Telangana.
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-slate-900 mb-4">9. Contact for Refunds</h2>
            <div className="bg-slate-50 rounded-xl p-6">
              <p className="font-semibold text-slate-900 mb-2">Billing Department</p>
              <p className="text-slate-700">Softmaster Technology Solutions Private Limited</p>
              <p className="text-slate-700">12-18, Indira Nagar Colony, Peerzadiguda, Hyderabad, Telangana - 500039</p>
              <p className="text-slate-700 mt-2">Email: billing@softmastertech.com</p>
              <p className="text-slate-700">Response time: Within 3 business days</p>
            </div>
          </div>

        </div>
      </section>
    </main>
  );
}

