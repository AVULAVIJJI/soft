"use client";
import { useState, useEffect } from "react";
import { Award, Download, Share2, ExternalLink } from "lucide-react";

interface Certificate {
  id: string;
  course_title: string;
  issued_date: string;
  certificate_number: string;
  instructor: string;
  score: number;
  pdf_url?: string;
}

export default function CertificatesPage() {
  const [certs, setCerts] = useState<Certificate[]>([
    { id: "1", course_title: "Full Stack Web Development", issued_date: "2026-04-15", certificate_number: "CERT-2026-FS-001", instructor: "Omkar Chittiboina", score: 92, pdf_url: "#" },
    { id: "2", course_title: "Data Science with Python", issued_date: "2026-03-20", certificate_number: "CERT-2026-DS-002", instructor: "Sravani Bikkasani", score: 88, pdf_url: "#" },
  ]);

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">My Certificates</h1>
        <p className="text-gray-500 mt-1">Download and share your achievement certificates</p>
      </div>

      {certs.length === 0 ? (
        <div className="card text-center py-16">
          <Award className="w-16 h-16 text-gray-200 mx-auto mb-4" />
          <h3 className="font-semibold text-gray-500">No certificates yet</h3>
          <p className="text-gray-400 text-sm mt-1">Complete a course to earn your certificate</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {certs.map(cert => (
            <div key={cert.id} className="bg-gradient-to-br from-blue-600 to-indigo-700 rounded-2xl p-6 text-white relative overflow-hidden">
              {/* Decorative */}
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -translate-y-8 translate-x-8" />
              <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/5 rounded-full translate-y-6 -translate-x-6" />

              <div className="relative">
                <Award className="w-10 h-10 text-yellow-300 mb-3" />
                <p className="text-blue-200 text-xs font-medium tracking-wider uppercase mb-1">Certificate of Completion</p>
                <h3 className="text-xl font-bold mb-3">{cert.course_title}</h3>
                <p className="text-blue-200 text-sm mb-1">Issued: {new Date(cert.issued_date).toLocaleDateString("en-IN", { year: "numeric", month: "long", day: "numeric" })}</p>
                <p className="text-blue-300 text-xs">By: {cert.instructor}</p>
                <p className="text-blue-300 text-xs mt-0.5">Score: {cert.score}% | {cert.certificate_number}</p>

                <div className="flex gap-3 mt-5">
                  <button className="flex items-center gap-1.5 bg-white text-blue-700 px-4 py-2 rounded-lg text-sm font-semibold hover:bg-blue-50 transition-colors">
                    <Download className="w-4 h-4" /> Download PDF
                  </button>
                  <button className="flex items-center gap-1.5 bg-white/20 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-white/30 transition-colors">
                    <Share2 className="w-4 h-4" /> Share
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="mt-8 card">
        <h2 className="font-semibold text-gray-900 mb-2">Verify a Certificate</h2>
        <p className="text-sm text-gray-500 mb-3">Enter a certificate number to verify its authenticity</p>
        <div className="flex gap-3">
          <input placeholder="e.g. CERT-2026-FS-001" className="input-field flex-1" />
          <button className="btn-primary">Verify</button>
        </div>
      </div>
    </div>
  );
}
