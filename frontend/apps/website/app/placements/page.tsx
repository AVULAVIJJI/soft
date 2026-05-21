// SOFTMASTER TECHNOLOGY SOLUTIONS PVT LTD
// Placements Page
// File: frontend/apps/website/app/placements/page.tsx

import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Placements | Softmaster Technology Solutions',
  description: '500+ students placed at top companies. Average package 5.5 INR. Softmaster placement portal for IT professionals in Hyderabad, Telangana.',
};

const placedStudents = [
  { name: 'Rahul K.', role: 'Software Developer', company: 'TCS', package: '6.5 INR', course: 'Full Stack Development' },
  { name: 'Priya S.', role: 'Data Analyst', company: 'Infosys', package: '5.8 INR', course: 'Data Science' },
  { name: 'Amit R.', role: 'DevOps Engineer', company: 'HCL Technologies', package: '7.2 INR', course: 'DevOps & Cloud' },
  { name: 'Sneha M.', role: 'UI/UX Designer', company: 'Wipro', package: '5.0 INR', course: 'UI/UX Design' },
  { name: 'Kiran B.', role: 'Cloud Engineer', company: 'Cognizant', package: '8.0 INR', course: 'AWS Cloud' },
  { name: 'Divya N.', role: 'Python Developer', company: 'Tech Mahindra', package: '5.5 INR', course: 'Python & Django' },
];

const stats = [
  { value: '500+', label: 'Students Placed' },
  { value: '100+', label: 'Hiring Companies' },
  { value: '5.5 INR', label: 'Average Package' },
  { value: '14 INR', label: 'Highest Package' },
];

const companies = ['TCS', 'Infosys', 'Wipro', 'HCL', 'Cognizant', 'Tech Mahindra', 'Capgemini', 'Accenture', 'LTIMindtree', 'Mphasis'];

const process = [
  { step: '01', title: 'Complete Your Course', desc: 'Successfully finish your chosen course and clear all assessments.' },
  { step: '02', title: 'Resume Building', desc: 'Our placement team helps craft a professional, ATS-friendly resume.' },
  { step: '03', title: 'Interview Preparation', desc: 'Mock interviews, aptitude training, and group discussion sessions.' },
  { step: '04', title: 'Drive Registration', desc: 'Get registered for company placement drives matching your profile.' },
  { step: '05', title: 'Interview', desc: 'Attend technical and HR interviews with support from our team.' },
  { step: '06', title: 'Placement & Offer', desc: 'Receive your offer letter and begin your career journey.' },
];

export default function PlacementsPage() {
  return (
    <main className="min-h-screen bg-white">
      {/* Hero */}
      <section className="bg-gradient-to-br from-slate-900 to-emerald-900 text-white py-24 px-6">
        <div className="max-w-5xl mx-auto text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            Launch Your <span className="text-emerald-400">Tech Career</span>
          </h1>
          <p className="text-xl text-slate-300 max-w-2xl mx-auto mb-10">
            500+ students placed at top IT companies across India. Our dedicated placement team
            works tirelessly to connect you with the right opportunities.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="http://localhost:3001/courses" className="bg-emerald-500 hover:bg-emerald-600 text-white font-bold px-8 py-4 rounded-xl transition-colors">
              Enroll and Get Placed
            </Link>
            <Link href="http://localhost:3007" className="border-2 border-white text-white font-bold px-8 py-4 rounded-xl hover:bg-white/10 transition-colors">
              Placement Portal
            </Link>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-12 px-6 bg-emerald-600">
        <div className="max-w-5xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8">
          {stats.map((s) => (
            <div key={s.label} className="text-center">
              <div className="text-4xl font-black text-white">{s.value}</div>
              <div className="text-emerald-100 text-sm mt-1">{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Process */}
      <section className="py-20 px-6 bg-slate-50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-14">
            <h2 className="text-3xl font-bold text-slate-900 mb-3">Placement Process</h2>
            <p className="text-slate-500">Our structured 6-step process to take you from student to professional.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {process.map((p) => (
              <div key={p.step} className="bg-white rounded-2xl p-6 border border-slate-100">
                <div className="w-12 h-12 bg-emerald-100 text-emerald-700 rounded-xl flex items-center justify-center font-black text-lg mb-4">
                  {p.step}
                </div>
                <h3 className="font-bold text-slate-900 mb-2">{p.title}</h3>
                <p className="text-slate-600 text-sm leading-relaxed">{p.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Recent Placements */}
      <section className="py-20 px-6 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-slate-900 mb-3">Recent Placements</h2>
            <p className="text-slate-500">Our students are working at top companies across India.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {placedStudents.map((student) => (
              <div key={student.name} className="bg-slate-50 rounded-2xl p-5 border border-slate-100">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-emerald-700 rounded-xl flex items-center justify-center text-white font-bold">
                    {student.name.charAt(0)}
                  </div>
                  <div>
                    <p className="font-bold text-slate-900">{student.name}</p>
                    <p className="text-sm text-slate-500">{student.role}</p>
                  </div>
                </div>
                <div className="space-y-1.5">
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-500">Company</span>
                    <span className="font-semibold text-slate-800">{student.company}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-500">Package</span>
                    <span className="font-semibold text-emerald-600">{student.package}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-500">Course</span>
                    <span className="font-semibold text-slate-800">{student.course}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Hiring Companies */}
      <section className="py-16 px-6 bg-slate-900">
        <div className="max-w-5xl mx-auto text-center">
          <h2 className="text-2xl font-bold text-white mb-8">Our Hiring Partners</h2>
          <div className="flex flex-wrap justify-center gap-4">
            {companies.map((company) => (
              <span
                key={company}
                className="bg-slate-800 border border-slate-700 text-slate-300 px-5 py-2.5 rounded-xl text-sm font-semibold"
              >
                {company}
              </span>
            ))}
          </div>
          <p className="text-slate-500 text-sm mt-6">And 90+ more companies hiring our graduates</p>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 px-6 bg-emerald-600">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-white mb-4">Ready to start your career?</h2>
          <p className="text-emerald-100 mb-8">Enroll in a course today and let our placement team guide your career.</p>
          <Link href="http://localhost:3001/courses" className="bg-white text-emerald-700 font-bold px-8 py-4 rounded-xl hover:bg-emerald-50 transition-colors">
            Enroll Now - Get Placed
          </Link>
        </div>
      </section>
    </main>
  );
}

