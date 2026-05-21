// SOFTMASTER TECHNOLOGY SOLUTIONS PVT LTD
// Terms and Conditions Page
// File: frontend/apps/website/app/terms/page.tsx

import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Terms and Conditions | Softmaster Technology Solutions',
  description: 'Terms and conditions governing use of Softmaster Technology Solutions services.',
};

export default function TermsPage() {
  return (
    <main className="min-h-screen bg-white">
      <section className="bg-slate-900 text-white py-16 px-6">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold mb-3">Terms and Conditions</h1>
          <p className="text-slate-400">Last Updated: January 1, 2025</p>
        </div>
      </section>

      <section className="py-16 px-6">
        <div className="max-w-4xl mx-auto space-y-10 text-slate-700 leading-relaxed">

          <p className="text-lg text-slate-600">
            Please read these Terms and Conditions carefully before using the services of
            Softmaster Technology Solutions Private Limited (Reg: PVT-20000-LK).
            By accessing or using our platforms, you agree to be bound by these terms.
          </p>

          <div>
            <h2 className="text-2xl font-bold text-slate-900 mb-4">1. Acceptance of Terms</h2>
            <p>
              By registering on any of our portals (Academy, Jobs, Client, Workspace, Employee,
              Placement, or Admin), you confirm that you are at least 16 years old, have read and
              understood these terms, and agree to be bound by them.
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-slate-900 mb-4">2. Use of Services</h2>
            <p className="mb-3">You agree to use our services only for lawful purposes. You must not:</p>
            <ul className="list-disc pl-6 space-y-2 text-slate-600">
              <li>Share your login credentials with any other person</li>
              <li>Attempt to gain unauthorized access to any portal or system</li>
              <li>Upload malicious code, viruses, or harmful content</li>
              <li>Use our platforms to harass, defame, or harm others</li>
              <li>Copy, resell, or redistribute course content without written permission</li>
              <li>Create multiple accounts for the same service without authorization</li>
              <li>Use automated bots or scrapers to access our platforms</li>
            </ul>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-slate-900 mb-4">3. Academy Portal Terms</h2>
            <ul className="list-disc pl-6 space-y-2 text-slate-600">
              <li>Course enrollments are for individual use only and are non-transferable</li>
              <li>Course content, videos, and materials are proprietary to Softmaster</li>
              <li>Certificates are issued only upon successful completion of all course requirements</li>
              <li>We reserve the right to update course content at any time</li>
              <li>Live class schedules are subject to change with reasonable notice</li>
            </ul>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-slate-900 mb-4">4. Jobs Portal Terms</h2>
            <ul className="list-disc pl-6 space-y-2 text-slate-600">
              <li>Job postings must be genuine and legally compliant</li>
              <li>Recruiters must not post misleading, fake, or discriminatory job listings</li>
              <li>Candidates must provide accurate information in their profiles and applications</li>
              <li>Softmaster does not guarantee placement or employment outcomes</li>
              <li>We are not responsible for disputes between employers and candidates</li>
            </ul>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-slate-900 mb-4">5. Payments and Billing</h2>
            <ul className="list-disc pl-6 space-y-2 text-slate-600">
              <li>All prices are in Indian Rupees (INR) and inclusive of applicable taxes</li>
              <li>Payments are processed securely through Razorpay</li>
              <li>Invoices and receipts are generated automatically and sent to your registered email</li>
              <li>Subscription fees are billed in advance and are non-refundable unless covered by our Refund Policy</li>
              <li>We reserve the right to change pricing with 30 days notice to existing subscribers</li>
            </ul>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-slate-900 mb-4">6. Intellectual Property</h2>
            <p className="mb-3">
              All content on our platforms, including but not limited to course videos, study
              materials, software code, logos, trademarks, and designs are the exclusive intellectual
              property of Softmaster Technology Solutions Private Limited.
            </p>
            <p>
              Unauthorized reproduction, distribution, or creation of derivative works is strictly
              prohibited and may result in legal action under applicable Indian intellectual property law.
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-slate-900 mb-4">7. ERP and Workspace Terms</h2>
            <ul className="list-disc pl-6 space-y-2 text-slate-600">
              <li>ERP data (attendance, payroll, HR records) is confidential and must not be shared externally</li>
              <li>Employees must accurately report attendance and not misuse check-in features</li>
              <li>Leave applications must be genuine and submitted through the proper channel</li>
              <li>Expense claims must be supported by valid receipts</li>
            </ul>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-slate-900 mb-4">8. Disclaimers and Limitation of Liability</h2>
            <p className="mb-3">
              Our services are provided "as is" without warranty of any kind. We do not guarantee
              that our platforms will be error-free or uninterrupted at all times.
            </p>
            <p>
              To the maximum extent permitted under applicable law, Softmaster shall not be liable
              for any indirect, incidental, special, or consequential damages arising from your use
              of our services.
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-slate-900 mb-4">9. Account Suspension and Termination</h2>
            <p>
              We reserve the right to suspend or terminate your account without notice if you violate
              these terms, engage in fraudulent activity, or cause harm to other users or our platform.
              You may close your account at any time by contacting support@softmastertech.com.
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-slate-900 mb-4">10. Governing Law and Jurisdiction</h2>
            <p>
              These Terms and Conditions are governed by the laws of India. Any disputes arising shall
              be subject to the exclusive jurisdiction of the courts in Hyderabad, Telangana.
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-slate-900 mb-4">11. Contact for Legal Matters</h2>
            <div className="bg-slate-50 rounded-xl p-6">
              <p className="font-semibold text-slate-900 mb-2">Softmaster Technology Solutions Private Limited</p>
              <p className="text-slate-700">12-18, Indira Nagar Colony, Peerzadiguda, Hyderabad, Telangana - 500039</p>
              <p className="text-slate-700 mt-2">Email: legal@softmastertech.com</p>
              <p className="text-slate-500 text-sm mt-2">Reg: PVT-20000-LK</p>
            </div>
          </div>

        </div>
      </section>
    </main>
  );
}

