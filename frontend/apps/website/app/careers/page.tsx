// SOFTMASTER TECHNOLOGY SOLUTIONS PVT LTD
// Careers Page
// File: frontend/apps/website/app/careers/page.tsx

import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Careers | Softmaster Technology Solutions',
  description: 'Join Softmaster Technology Solutions team in Hyderabad. Open positions in technology, training, sales and operations.',
};

const openings = [
  { title: 'Full Stack Developer', dept: 'Technology', type: 'Full Time', location: 'Hyderabad', exp: '1-3 years', skills: ['React', 'Node.js', 'PostgreSQL'] },
  { title: 'Python Developer', dept: 'Technology', type: 'Full Time', location: 'Hyderabad', exp: '1-2 years', skills: ['Python', 'FastAPI', 'Django'] },
  { title: 'IT Trainer - Web Development', dept: 'Academy', type: 'Full Time', location: 'Hyderabad', exp: '2-4 years', skills: ['HTML/CSS', 'JavaScript', 'React', 'Node.js'] },
  { title: 'Business Development Executive', dept: 'Sales', type: 'Full Time', location: 'Hyderabad', exp: '1-3 years', skills: ['B2B Sales', 'IT Industry', 'Communication'] },
  { title: 'HR Executive', dept: 'Human Resources', type: 'Full Time', location: 'Hyderabad', exp: '0-2 years', skills: ['Recruitment', 'Payroll', 'HR Operations'] },
  { title: 'Digital Marketing Executive', dept: 'Marketing', type: 'Full Time', location: 'Hyderabad / Remote', exp: '1-2 years', skills: ['SEO', 'Social Media', 'Google Ads'] },
  { title: 'Placement Coordinator', dept: 'Placement', type: 'Full Time', location: 'Hyderabad', exp: '0-1 years', skills: ['Communication', 'MS Office', 'Networking'] },
  { title: 'UI/UX Designer', dept: 'Technology', type: 'Full Time', location: 'Hyderabad', exp: '1-3 years', skills: ['Figma', 'Adobe XD', 'Prototyping'] },
];

const benefits = [
  { icon: '💰', title: 'Competitive Salary', desc: 'Market-competitive CTC with performance bonuses.' },
  { icon: '📚', title: 'Free Courses', desc: 'Free access to all Softmaster Academy courses.' },
  { icon: '🏥', title: 'Health Insurance', desc: 'Group health insurance for you and your family.' },
  { icon: '⏰', title: 'Flexible Hours', desc: 'Flexible work timings and hybrid work options.' },
  { icon: '📈', title: 'Fast Growth', desc: 'Young company with rapid growth and career acceleration.' },
  { icon: '🎉', title: 'Great Culture', desc: 'Collaborative, inclusive, and fun work environment.' },
];

export default function CareersPage() {
  return (
    <main className="min-h-screen bg-white">
      {/* Hero */}
      <section className="bg-gradient-to-br from-slate-900 to-blue-900 text-white py-20 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Work With Us</h1>
          <p className="text-xl text-slate-300 max-w-2xl mx-auto">
            Join a fast-growing technology company in Hyderabad, Telangana. Build products that shape
            careers and transform businesses.
          </p>
        </div>
      </section>

      {/* Benefits */}
      <section className="py-16 px-6 bg-slate-50">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-2xl font-bold text-slate-900 text-center mb-10">Why Join Softmaster?</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-5">
            {benefits.map((b) => (
              <div key={b.title} className="bg-white rounded-2xl p-5 text-center border border-slate-100">
                <div className="text-3xl mb-3">{b.icon}</div>
                <h3 className="font-bold text-slate-900 text-sm mb-1">{b.title}</h3>
                <p className="text-xs text-slate-500 leading-relaxed">{b.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Open Positions */}
      <section className="py-16 px-6 bg-white">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-2xl font-bold text-slate-900 mb-8">Open Positions</h2>
          <div className="space-y-4">
            {openings.map((job) => (
              <div key={job.title} className="border border-slate-200 rounded-2xl p-6 hover:shadow-md hover:border-blue-200 transition-all">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div>
                    <h3 className="text-lg font-bold text-slate-900">{job.title}</h3>
                    <div className="flex flex-wrap gap-3 mt-2 text-sm text-slate-500">
                      <span className="flex items-center gap-1">
                        <span>🏢</span> {job.dept}
                      </span>
                      <span className="flex items-center gap-1">
                        <span>📍</span> {job.location}
                      </span>
                      <span className="flex items-center gap-1">
                        <span>⏱</span> {job.type}
                      </span>
                      <span className="flex items-center gap-1">
                        <span>💼</span> {job.exp}
                      </span>
                    </div>
                    <div className="flex flex-wrap gap-2 mt-3">
                      {job.skills.map((skill) => (
                        <span key={skill} className="bg-blue-50 text-blue-700 text-xs font-medium px-3 py-1 rounded-full">
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                  <Link
                    href={`/contact?subject=Job Application - ${job.title}`}
                    className="flex-shrink-0 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold px-6 py-2.5 rounded-xl transition-colors"
                  >
                    Apply Now
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Application CTA */}
      <section className="py-14 px-6 bg-blue-600">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-2xl font-bold text-white mb-3">Do not see the right role?</h2>
          <p className="text-blue-100 mb-6">
            Send us your resume at careers@softmastertech.com and we will reach out when a suitable role opens.
          </p>
          <a
            href="mailto:careers@softmastertech.com"
            className="inline-block bg-white text-blue-700 font-bold px-8 py-3.5 rounded-xl hover:bg-blue-50 transition-colors"
          >
            Send Resume
          </a>
        </div>
      </section>
    </main>
  );
}

