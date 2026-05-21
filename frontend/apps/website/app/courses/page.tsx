// SOFTMASTER TECHNOLOGY SOLUTIONS PVT LTD
// Website Courses Listing Page
// File: frontend/apps/website/app/courses/page.tsx

import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Courses | Softmaster Academy',
  description: 'Explore 100+ IT courses in web development, data science, cloud computing, DevOps, cybersecurity, and more at Softmaster Academy, Hyderabad.',
};

const courses = [
  { category: 'Web Development', emoji: '🌐', color: 'from-blue-500 to-blue-700', courses: [
    { title: 'Full Stack Web Development', duration: '6 months', price: '₹29,999', level: 'Beginner to Advanced', highlights: ['React, Node.js, PostgreSQL', 'Live Projects', 'Placement Support', 'Certificate'] },
    { title: 'Frontend Development', duration: '3 months', price: '₹14,999', level: 'Beginner', highlights: ['HTML, CSS, JavaScript', 'React.js', 'Responsive Design', 'Portfolio Projects'] },
    { title: 'Backend Development', duration: '3 months', price: '₹14,999', level: 'Intermediate', highlights: ['Node.js, Express', 'PostgreSQL, MongoDB', 'REST APIs', 'Authentication'] },
  ]},
  { category: 'Python & AI', emoji: '🐍', color: 'from-yellow-500 to-yellow-700', courses: [
    { title: 'Python for Beginners', duration: '2 months', price: '₹9,999', level: 'Beginner', highlights: ['Python basics', 'OOP', 'File Handling', 'Mini Projects'] },
    { title: 'Django & FastAPI', duration: '3 months', price: '₹14,999', level: 'Intermediate', highlights: ['Django Framework', 'FastAPI', 'REST APIs', 'Deployment'] },
    { title: 'Machine Learning', duration: '4 months', price: '₹19,999', level: 'Intermediate', highlights: ['Scikit-learn', 'TensorFlow', 'Real Datasets', 'Model Deployment'] },
  ]},
  { category: 'Data Science', emoji: '📊', color: 'from-purple-500 to-purple-700', courses: [
    { title: 'Data Science with Python', duration: '5 months', price: '₹24,999', level: 'Beginner to Advanced', highlights: ['NumPy, Pandas', 'Data Visualization', 'ML Algorithms', 'Industry Projects'] },
    { title: 'Data Analytics', duration: '3 months', price: '₹12,999', level: 'Beginner', highlights: ['Excel, SQL', 'Power BI, Tableau', 'Statistics', 'Case Studies'] },
  ]},
  { category: 'Cloud & DevOps', emoji: '☁️', color: 'from-orange-500 to-orange-700', courses: [
    { title: 'AWS Cloud Computing', duration: '3 months', price: '₹19,999', level: 'Intermediate', highlights: ['EC2, S3, RDS', 'AWS Lambda', 'CloudFormation', 'SAA-C03 Prep'] },
    { title: 'DevOps Engineering', duration: '4 months', price: '₹22,999', level: 'Intermediate', highlights: ['Docker, Kubernetes', 'CI/CD', 'Jenkins, GitHub Actions', 'Monitoring'] },
  ]},
  { category: 'Cybersecurity', emoji: '🔐', color: 'from-red-500 to-red-700', courses: [
    { title: 'Ethical Hacking & Security', duration: '3 months', price: '₹17,999', level: 'Intermediate', highlights: ['Network Security', 'Web App Testing', 'Kali Linux', 'CTF Practice'] },
  ]},
  { category: 'UI/UX Design', emoji: '🎨', color: 'from-pink-500 to-pink-700', courses: [
    { title: 'UI/UX Design', duration: '3 months', price: '₹13,999', level: 'Beginner', highlights: ['Figma', 'Design Systems', 'Prototyping', 'Portfolio'] },
  ]},
];

export default function CoursesPage() {
  return (
    <main className="min-h-screen bg-white">
      {/* Hero */}
      <section className="bg-gradient-to-br from-slate-900 to-blue-900 py-20 px-6 text-white">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Softmaster Academy</h1>
          <p className="text-xl text-slate-300 max-w-2xl mx-auto mb-8">
            100+ industry-relevant IT courses with live classes, hands-on projects, and guaranteed placement support.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="http://localhost:3001/courses" className="bg-blue-500 hover:bg-blue-600 text-white font-bold px-8 py-4 rounded-xl transition-colors">
              Enroll Now — Free Trial
            </Link>
            <Link href="/contact" className="border-2 border-white/50 text-white font-bold px-8 py-4 rounded-xl hover:bg-white/10 transition-colors">
              Talk to Counselor
            </Link>
          </div>
        </div>
      </section>

      {/* Highlights */}
      <section className="py-10 px-6 bg-blue-600">
        <div className="max-w-5xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-6 text-center text-white">
          {[['100+', 'Courses'], ['500+', 'Students Placed'], ['50+', 'Expert Trainers'], ['4.8★', 'Average Rating']].map(([v, l]) => (
            <div key={l}><div className="text-3xl font-black">{v}</div><div className="text-blue-200 text-sm">{l}</div></div>
          ))}
        </div>
      </section>

      {/* Courses by Category */}
      <section className="py-16 px-6">
        <div className="max-w-7xl mx-auto">
          {courses.map((cat) => (
            <div key={cat.category} className="mb-14">
              <div className="flex items-center gap-3 mb-6">
                <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${cat.color} flex items-center justify-center text-xl`}>{cat.emoji}</div>
                <h2 className="text-2xl font-bold text-slate-900">{cat.category}</h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {cat.courses.map((course) => (
                  <div key={course.title} className="bg-white border border-slate-100 rounded-2xl p-6 hover:shadow-lg hover:border-blue-200 transition-all">
                    <h3 className="font-bold text-slate-900 text-lg mb-1">{course.title}</h3>
                    <div className="flex gap-3 mb-4 text-sm text-slate-500">
                      <span>⏱ {course.duration}</span>
                      <span>•</span>
                      <span>{course.level}</span>
                    </div>
                    <ul className="space-y-1.5 mb-5">
                      {course.highlights.map((h) => (
                        <li key={h} className="flex items-center gap-2 text-sm text-slate-600">
                          <span className="text-green-500 flex-shrink-0">✓</span> {h}
                        </li>
                      ))}
                    </ul>
                    <div className="flex items-center justify-between mt-auto">
                      <span className="text-2xl font-black text-slate-900">{course.price}</span>
                      <Link href="http://localhost:3001/courses" className={`bg-gradient-to-r ${cat.color} text-white text-sm font-bold px-5 py-2.5 rounded-xl hover:opacity-90 transition-opacity`}>
                        Enroll
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 px-6 bg-slate-900">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-white mb-4">Not sure which course to pick?</h2>
          <p className="text-slate-400 mb-8">Our counselors will help you choose the right course based on your goals and background.</p>
          <Link href="/contact" className="bg-blue-600 hover:bg-blue-700 text-white font-bold px-8 py-4 rounded-xl transition-colors">
            Get Free Counseling
          </Link>
        </div>
      </section>
    </main>
  );
}

