"use client";
import { useState, useEffect } from "react";
import { Search, MapPin, Briefcase, Clock, DollarSign, Building2, Filter } from "lucide-react";

interface Job {
  id: string;
  title: string;
  company_name: string;
  location: string;
  job_type: string;
  experience_min: number;
  experience_max: number;
  salary_min: number;
  salary_max: number;
  skills_required: string[];
  description: string;
  created_at: string;
  deadline: string;
  is_active: boolean;
}

const jobTypes = ["All", "Full-time", "Part-time", "Internship", "Contract", "Remote"];

export default function BrowseJobsPage() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [location, setLocation] = useState("");
  const [jobType, setJobType] = useState("All");
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const params = new URLSearchParams();
        if (search) params.set("search", search);
        if (location) params.set("location", location);
        if (jobType !== "All") params.set("job_type", jobType);
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/jobs?${params}`);
        const data = await res.json();
        const jobList = data.jobs || [];
        setJobs(jobList);
        if (jobList.length > 0) setSelectedJob(jobList[0]);
      } catch {
        const mock: Job[] = [
          { id: "1", title: "Full Stack Developer", company_name: "Softmaster Technology Solutions", location: "Hyderabad", job_type: "Full-time", experience_min: 1, experience_max: 3, salary_min: 400000, salary_max: 800000, skills_required: ["React", "Node.js", "PostgreSQL"], description: "We are looking for a passionate Full Stack Developer to join our growing team. You will work on cutting-edge web applications.", created_at: "2026-05-01", deadline: "2026-06-01", is_active: true },
          { id: "2", title: "Data Analyst", company_name: "Analytics Hub", location: "Bangalore", job_type: "Full-time", experience_min: 0, experience_max: 2, salary_min: 350000, salary_max: 600000, skills_required: ["Python", "SQL", "Power BI"], description: "Analyze large datasets and generate actionable insights for business teams.", created_at: "2026-05-02", deadline: "2026-05-31", is_active: true },
          { id: "3", title: "UI/UX Designer Intern", company_name: "Creative Studio", location: "Remote", job_type: "Internship", experience_min: 0, experience_max: 1, salary_min: 15000, salary_max: 25000, skills_required: ["Figma", "Adobe XD", "Prototyping"], description: "Join our design team as an intern and work on real client projects.", created_at: "2026-05-03", deadline: "2026-05-20", is_active: true },
        ];
        setJobs(mock);
        setSelectedJob(mock[0]);
      } finally {
        setLoading(false);
      }
    };
    fetchJobs();
  }, [search, location, jobType]);

  const applyJob = async (jobId: string) => {
    const token = localStorage.getItem("access_token");
    if (!token) { window.location.href = "/login"; return; }
    try {
      await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/jobs/${jobId}/apply`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
        body: JSON.stringify({ cover_letter: "I am interested in this position." }),
      });
      alert("Application submitted successfully!");
    } catch {
      alert("Failed to apply. Please try again.");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center gap-4">
          <Briefcase className="w-6 h-6 text-green-600" />
          <span className="font-bold text-gray-900">Softmaster Jobs</span>
        </div>
      </header>

      {/* Search Bar */}
      <div className="bg-green-600 py-10 px-6">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold text-white text-center mb-6">Find Your Dream Job</h1>
          <div className="bg-white rounded-xl p-3 flex flex-wrap gap-3">
            <div className="relative flex-1 min-w-48">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Job title, skills..." className="input-field pl-9" />
            </div>
            <div className="relative flex-1 min-w-40">
              <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input value={location} onChange={e => setLocation(e.target.value)} placeholder="Location..." className="input-field pl-9" />
            </div>
            <select value={jobType} onChange={e => setJobType(e.target.value)} className="px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none">
              {jobTypes.map(t => <option key={t}>{t}</option>)}
            </select>
            <button className="btn-primary">Search</button>
          </div>
        </div>
      </div>

      {/* Job Listing */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="flex gap-6">
          {/* Left: Job List */}
          <div className="w-96 flex-shrink-0 space-y-3">
            <p className="text-sm text-gray-500 font-medium">{jobs.length} jobs found</p>
            {loading ? (
              [...Array(4)].map((_, i) => <div key={i} className="bg-white rounded-xl p-4 animate-pulse h-32" />)
            ) : jobs.map(job => (
              <div key={job.id} onClick={() => setSelectedJob(job)}
                className={`bg-white rounded-xl p-4 cursor-pointer border-2 transition-all hover:shadow-sm
                  ${selectedJob?.id === job.id ? "border-green-500" : "border-transparent"}`}>
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Building2 className="w-5 h-5 text-green-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-gray-900 text-sm">{job.title}</h3>
                    <p className="text-gray-500 text-xs">{job.company_name}</p>
                    <div className="flex flex-wrap gap-2 mt-2">
                      <span className="text-xs text-gray-500 flex items-center gap-1"><MapPin className="w-3 h-3" />{job.location}</span>
                      <span className="badge-success">{job.job_type}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Right: Job Detail */}
          {selectedJob && (
            <div className="flex-1 bg-white rounded-xl border border-gray-100 p-6 sticky top-6 h-fit">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h2 className="text-xl font-bold text-gray-900">{selectedJob.title}</h2>
                  <p className="text-gray-600 mt-1">{selectedJob.company_name}</p>
                </div>
                <button onClick={() => applyJob(selectedJob.id)} className="btn-primary">
                  Apply Now
                </button>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <MapPin className="w-4 h-4 text-gray-400" />{selectedJob.location}
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Briefcase className="w-4 h-4 text-gray-400" />{selectedJob.job_type}
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Clock className="w-4 h-4 text-gray-400" />{selectedJob.experience_min}-{selectedJob.experience_max} years
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <DollarSign className="w-4 h-4 text-gray-400" />
                  ₹{(selectedJob.salary_min / 100000).toFixed(1)}L - ₹{(selectedJob.salary_max / 100000).toFixed(1)}L
                </div>
              </div>

              <div className="mb-6">
                <h3 className="font-semibold text-gray-900 mb-2">Required Skills</h3>
                <div className="flex flex-wrap gap-2">
                  {selectedJob.skills_required.map(s => (
                    <span key={s} className="badge-info">{s}</span>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="font-semibold text-gray-900 mb-2">Job Description</h3>
                <p className="text-gray-600 text-sm leading-relaxed">{selectedJob.description}</p>
              </div>

              <p className="text-xs text-gray-400 mt-6 pt-4 border-t border-gray-100">
                Apply before: {new Date(selectedJob.deadline).toLocaleDateString("en-IN")}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
