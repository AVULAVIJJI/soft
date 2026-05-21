// SOFTMASTER TECHNOLOGY SOLUTIONS PVT LTD
// Privacy Policy Page
// File: frontend/apps/website/app/privacy-policy/page.tsx

import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Privacy Policy | Softmaster Technology Solutions',
  description: 'Privacy policy of Softmaster Technology Solutions Pvt Ltd - how we collect, use and protect your data.',
};

export default function PrivacyPolicyPage() {
  return (
    <main className="min-h-screen bg-white">
      <section className="bg-slate-900 text-white py-16 px-6">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold mb-3">Privacy Policy</h1>
          <p className="text-slate-400">Last Updated: January 1, 2025</p>
        </div>
      </section>

      <section className="py-16 px-6">
        <div className="max-w-4xl mx-auto prose prose-slate max-w-none">
          <div className="space-y-10 text-slate-700 leading-relaxed">

            <div>
              <p className="text-lg text-slate-600">
                This Privacy Policy describes how Softmaster Technology Solutions Private Limited
                ("Softmaster", "we", "us", or "our"), registered under CIN ,
                collects, uses, and protects your personal information when you use our website,
                portals, and services.
              </p>
            </div>

            <div>
              <h2 className="text-2xl font-bold text-slate-900 mb-4">1. Information We Collect</h2>
              <h3 className="text-lg font-semibold text-slate-800 mb-2">1.1 Information You Provide</h3>
              <ul className="list-disc pl-6 space-y-2 text-slate-600">
                <li>Name, email address, phone number, and date of birth when you register</li>
                <li>Educational and professional details when you apply for courses or jobs</li>
                <li>Payment information processed securely through Razorpay (we do not store card data)</li>
                <li>Resume and portfolio documents you upload</li>
                <li>Messages and communications you send through our contact forms or support system</li>
                <li>Profile information you voluntarily provide</li>
              </ul>

              <h3 className="text-lg font-semibold text-slate-800 mt-6 mb-2">1.2 Automatically Collected Information</h3>
              <ul className="list-disc pl-6 space-y-2 text-slate-600">
                <li>IP address, browser type, operating system, and device information</li>
                <li>Pages visited, time spent, and click behavior on our platforms</li>
                <li>Course progress, quiz scores, and learning activity data</li>
                <li>Attendance check-in and check-out times (for employees)</li>
                <li>Login times and session data</li>
              </ul>
            </div>

            <div>
              <h2 className="text-2xl font-bold text-slate-900 mb-4">2. How We Use Your Information</h2>
              <ul className="list-disc pl-6 space-y-2 text-slate-600">
                <li>To create and manage your account across our portals</li>
                <li>To deliver courses, issue certificates, and track your learning progress</li>
                <li>To process payments and send billing information</li>
                <li>To match job seekers with relevant opportunities</li>
                <li>To manage employee attendance, leaves, and payroll (ERP)</li>
                <li>To send important notifications about your account, courses, or applications</li>
                <li>To send marketing communications (you may opt out at any time)</li>
                <li>To improve our platform through analytics</li>
                <li>To comply with legal obligations under Indian law</li>
              </ul>
            </div>

            <div>
              <h2 className="text-2xl font-bold text-slate-900 mb-4">3. Data Sharing</h2>
              <p className="text-slate-600 mb-4">
                We do not sell your personal data. We may share your information with:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-slate-600">
                <li><strong>Recruiters and employers</strong> on our jobs portal when you apply for positions (with your explicit consent)</li>
                <li><strong>Payment processors</strong> (Razorpay) to process transactions</li>
                <li><strong>Cloud storage providers</strong> (Cloudinary) to host uploaded files</li>
                <li><strong>Email service providers</strong> (Brevo) to send transactional emails</li>
                <li><strong>Analytics providers</strong> (Google Analytics) for platform improvement</li>
                <li><strong>Law enforcement or government authorities</strong> when required by applicable Indian law</li>
              </ul>
            </div>

            <div>
              <h2 className="text-2xl font-bold text-slate-900 mb-4">4. Data Security</h2>
              <p className="text-slate-600 mb-4">
                We implement industry-standard security measures including:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-slate-600">
                <li>HTTPS encryption for all data in transit</li>
                <li>Password hashing using bcrypt</li>
                <li>JWT-based authentication with secure token management</li>
                <li>Role-based access control to limit data access</li>
                <li>Regular database backups</li>
                <li>Rate limiting and DDoS protection</li>
                <li>SQL injection and XSS protection</li>
              </ul>
            </div>

            <div>
              <h2 className="text-2xl font-bold text-slate-900 mb-4">5. Data Retention</h2>
              <p className="text-slate-600">
                We retain your personal data for as long as your account is active or as required to
                provide services. You may request deletion of your account and associated data at any
                time. Certain data may be retained for up to 7 years as required under Indian financial
                and tax laws.
              </p>
            </div>

            <div>
              <h2 className="text-2xl font-bold text-slate-900 mb-4">6. Your Rights</h2>
              <p className="text-slate-600 mb-4">
                Under applicable Indian law and our policy, you have the right to:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-slate-600">
                <li>Access the personal data we hold about you</li>
                <li>Request correction of inaccurate information</li>
                <li>Request deletion of your personal data (subject to legal obligations)</li>
                <li>Opt out of marketing communications at any time</li>
                <li>Data portability for information you have provided</li>
                <li>Withdraw consent for data processing where consent is the legal basis</li>
              </ul>
              <p className="text-slate-600 mt-4">
                To exercise any of these rights, contact us at: privacy@softmastertech.com
              </p>
            </div>

            <div>
              <h2 className="text-2xl font-bold text-slate-900 mb-4">7. Cookies</h2>
              <p className="text-slate-600">
                We use essential cookies for authentication and session management, and analytics
                cookies (Google Analytics) to understand how our platform is used. You can control
                non-essential cookies through your browser settings.
              </p>
            </div>

            <div>
              <h2 className="text-2xl font-bold text-slate-900 mb-4">8. Children's Privacy</h2>
              <p className="text-slate-600">
                Our services are intended for users 16 years of age and older. We do not knowingly
                collect personal data from children under 16. If you believe a child has provided us
                with personal data, please contact us immediately.
              </p>
            </div>

            <div>
              <h2 className="text-2xl font-bold text-slate-900 mb-4">9. Changes to This Policy</h2>
              <p className="text-slate-600">
                We may update this Privacy Policy periodically. We will notify registered users of
                significant changes via email. Continued use of our services after changes constitutes
                acceptance of the updated policy.
              </p>
            </div>

            <div>
              <h2 className="text-2xl font-bold text-slate-900 mb-4">10. Contact Us</h2>
              <div className="bg-slate-50 rounded-xl p-6 text-slate-700">
                <p className="font-semibold text-slate-900 mb-3">Softmaster Technology Solutions Private Limited</p>
                <p>No:07, George E De Silva Mawatha</p>
                <p>12-18, Indira Nagar Colony, Peerzadiguda, Hyderabad, Telangana - 500039</p>
                <p className="mt-3">Email: privacy@softmastertech.com</p>
                <p>Phone: +91-9000000000</p>
                <p className="mt-2 text-sm text-slate-500">Reg: PVT-20000-LK</p>
              </div>
            </div>

          </div>
        </div>
      </section>
    </main>
  );
}

