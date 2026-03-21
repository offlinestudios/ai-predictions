import { useState } from "react";
import { Link } from "wouter";
import { Users, CheckCircle, AlertTriangle, Eye, ChevronDown, RotateCcw, UserPlus } from "lucide-react";

// ─── Static demo data ────────────────────────────────────────────────────────

type RiskLevel = "High" | "Medium" | "Low";
type StatusType = "Completed" | "Pending" | "In Progress";

interface Candidate {
  id: number;
  name: string;
  position: string;
  risk: RiskLevel;
  status: StatusType;
  completedAt: string;
}

const CANDIDATES: Candidate[] = [
  { id: 1,  name: "Chris Martinez",  position: "Product Manager",     risk: "Medium", status: "Completed",  completedAt: "about 2 months ago" },
  { id: 2,  name: "Emma Wilson",     position: "Senior Developer",    risk: "Low",    status: "Completed",  completedAt: "about 2 months ago" },
  { id: 3,  name: "Anya Sharma",     position: "Data Scientist",      risk: "Low",    status: "Completed",  completedAt: "about 2 months ago" },
  { id: 4,  name: "Maria Rodriguez", position: "Marketing Lead",      risk: "Medium", status: "Completed",  completedAt: "about 2 months ago" },
  { id: 5,  name: "David Chen",      position: "UX Researcher",       risk: "High",   status: "Completed",  completedAt: "about 2 months ago" },
  { id: 6,  name: "Olivia Davis",    position: "Senior Analyst",      risk: "High",   status: "Completed",  completedAt: "about 2 months ago" },
  { id: 7,  name: "Benjamin Moore",  position: "Solutions Architect", risk: "Low",    status: "Completed",  completedAt: "about 3 months ago" },
  { id: 8,  name: "Jessica Kim",     position: "Product Owner",       risk: "Medium", status: "Completed",  completedAt: "about 3 months ago" },
  { id: 9,  name: "Sophia Patel",    position: "Senior Developer",    risk: "Low",    status: "Completed",  completedAt: "about 3 months ago" },
  { id: 10, name: "Michael Brown",   position: "DevOps Engineer",     risk: "Medium", status: "Completed",  completedAt: "about 3 months ago" },
  { id: 11, name: "James Taylor",    position: "Security Engineer",   risk: "High",   status: "Completed",  completedAt: "about 3 months ago" },
  { id: 12, name: "Rachel Green",    position: "Frontend Engineer",   risk: "Low",    status: "In Progress", completedAt: "pending" },
];

const ACTIVITY = [
  { name: "Chris Martinez",  text: "completed assessment.",          isHighRisk: false, time: "about 2 months ago" },
  { name: "Emma Wilson",     text: "completed assessment.",          isHighRisk: false, time: "about 2 months ago" },
  { name: "Anya Sharma",     text: "completed assessment.",          isHighRisk: false, time: "about 2 months ago" },
  { name: "Maria Rodriguez", text: "completed assessment.",          isHighRisk: false, time: "about 2 months ago" },
  { name: "David Chen",      text: "completed assessment (High Risk).", isHighRisk: true,  time: "about 2 months ago" },
  { name: "Olivia Davis",    text: "completed assessment (High Risk).", isHighRisk: true,  time: "about 2 months ago" },
  { name: "Benjamin Moore",  text: "completed assessment.",          isHighRisk: false, time: "about 3 months ago" },
  { name: "Jessica Kim",     text: "completed assessment.",          isHighRisk: false, time: "about 3 months ago" },
];

// ─── Helpers ─────────────────────────────────────────────────────────────────

const RISK_COLORS: Record<RiskLevel, string> = {
  High:   "bg-red-500/20 text-red-400 border border-red-500/30",
  Medium: "bg-yellow-500/20 text-yellow-400 border border-yellow-500/30",
  Low:    "bg-green-500/20 text-green-400 border border-green-500/30",
};

const STATUS_COLORS: Record<StatusType, string> = {
  Completed:   "text-green-400",
  Pending:     "text-yellow-400",
  "In Progress": "text-blue-400",
};

// ─── Sub-components ───────────────────────────────────────────────────────────

function RiskBadge({ risk }: { risk: RiskLevel }) {
  return (
    <span className={`inline-block px-2 py-0.5 rounded text-xs font-semibold ${RISK_COLORS[risk]}`}>
      {risk}
    </span>
  );
}

function StatusBadge({ status }: { status: StatusType }) {
  return (
    <span className={`flex items-center gap-1 text-sm ${STATUS_COLORS[status]}`}>
      <CheckCircle className="w-4 h-4" />
      {status}
    </span>
  );
}

interface FilterDropdownProps {
  label: string;
  options: string[];
  value: string;
  onChange: (v: string) => void;
}

function FilterDropdown({ label, options, value, onChange }: FilterDropdownProps) {
  const [open, setOpen] = useState(false);
  return (
    <div className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-[#1e2433] border border-white/10 text-sm text-gray-200 hover:bg-[#252b3b] transition-colors"
      >
        {value}
        <ChevronDown className="w-3.5 h-3.5 text-gray-400" />
      </button>
      {open && (
        <div className="absolute top-full left-0 mt-1 z-50 min-w-[140px] rounded-md bg-[#1e2433] border border-white/10 shadow-xl">
          {options.map((opt) => (
            <button
              key={opt}
              onClick={() => { onChange(opt); setOpen(false); }}
              className={`w-full text-left px-3 py-2 text-sm hover:bg-white/5 transition-colors ${opt === value ? "text-white font-medium" : "text-gray-300"}`}
            >
              {opt}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

// ─── Main page ────────────────────────────────────────────────────────────────

export default function DemoDashboard() {
  const [activeTab, setActiveTab] = useState<"pipeline" | "invite" | "roles">("pipeline");
  const [riskFilter, setRiskFilter] = useState("All Risks");
  const [statusFilter, setStatusFilter] = useState("All Status");

  const filtered = CANDIDATES.filter((c) => {
    const riskOk   = riskFilter   === "All Risks"  || c.risk   === riskFilter;
    const statusOk = statusFilter === "All Status" || c.status === statusFilter;
    return riskOk && statusOk;
  });

  const highRiskCount = CANDIDATES.filter((c) => c.risk === "High").length;
  const completedCount = CANDIDATES.filter((c) => c.status === "Completed").length;

  return (
    <div className="min-h-screen bg-[#0d1117] text-white flex flex-col">

      {/* ── Top nav ── */}
      <header className="flex items-center justify-between px-6 py-3 border-b border-white/10 bg-[#0d1117]">
        <div className="flex items-center gap-3">
          <span className="font-bold text-lg tracking-tight">PredicSure</span>
          <span className="text-gray-400 text-sm">|</span>
          <span className="text-gray-300 text-sm">Demo Dashboard</span>
        </div>
        <div className="flex items-center gap-3">
          <span className="px-3 py-1.5 rounded-md bg-yellow-500/20 text-yellow-400 border border-yellow-500/30 text-xs font-semibold">
            Demo Mode – Read Only
          </span>
          <button className="px-3 py-1.5 rounded-md bg-white/5 border border-white/10 text-sm text-gray-300 hover:bg-white/10 transition-colors flex items-center gap-1.5">
            <RotateCcw className="w-3.5 h-3.5" />
            Restart Tour
          </button>
          <Link href="/sign-up">
            <button className="px-4 py-1.5 rounded-md bg-teal-500 hover:bg-teal-400 text-white text-sm font-semibold transition-colors flex items-center gap-1.5">
              <UserPlus className="w-3.5 h-3.5" />
              Create Your Account
            </button>
          </Link>
        </div>
      </header>

      {/* ── Tab bar ── */}
      <div className="flex items-center gap-2 px-6 pt-4 pb-0">
        {[
          { key: "pipeline", label: "Candidate Pipeline",  icon: <Users className="w-3.5 h-3.5" /> },
          { key: "invite",   label: "Invite Management",   icon: <UserPlus className="w-3.5 h-3.5" /> },
          { key: "roles",    label: "Roles & Matching",    icon: <CheckCircle className="w-3.5 h-3.5" /> },
        ].map(({ key, label, icon }) => (
          <button
            key={key}
            onClick={() => setActiveTab(key as typeof activeTab)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
              activeTab === key
                ? "bg-[#1e2433] text-white border border-white/10"
                : "text-gray-400 hover:text-gray-200"
            }`}
          >
            {icon}
            {label}
          </button>
        ))}
      </div>

      {/* ── Main content ── */}
      <main className="flex-1 px-6 py-5 space-y-5">

        {/* Stat cards */}
        <div className="grid grid-cols-3 gap-4">
          {/* Active Candidates */}
          <div className="rounded-xl bg-[#131820] border border-white/8 p-5 flex items-start justify-between">
            <div>
              <p className="text-gray-400 text-sm mb-1">Active Candidates</p>
              <p className="text-4xl font-bold">{CANDIDATES.length}</p>
            </div>
            <div className="p-2 rounded-lg bg-teal-500/10 border border-teal-500/20">
              <Users className="w-5 h-5 text-teal-400" />
            </div>
          </div>

          {/* Assessments Completed */}
          <div className="rounded-xl bg-[#131820] border border-white/8 p-5 flex items-start justify-between">
            <div>
              <p className="text-gray-400 text-sm mb-1">Assessments Completed</p>
              <p className="text-4xl font-bold">{completedCount}</p>
            </div>
            <div className="p-2 rounded-lg bg-teal-500/10 border border-teal-500/20">
              <CheckCircle className="w-5 h-5 text-teal-400" />
            </div>
          </div>

          {/* High Risk Flags */}
          <div className="rounded-xl bg-red-950/40 border border-red-500/20 p-5 flex items-start justify-between">
            <div>
              <p className="text-gray-400 text-sm mb-1">High Risk Flags</p>
              <p className="text-4xl font-bold">{highRiskCount}</p>
            </div>
            <div className="p-2 rounded-lg bg-red-500/10 border border-red-500/20">
              <AlertTriangle className="w-5 h-5 text-red-400" />
            </div>
          </div>
        </div>

        {/* Filters row */}
        <div className="flex items-center gap-3">
          <span className="text-sm text-gray-400 font-medium">Filters:</span>
          <FilterDropdown
            label="Risk"
            options={["All Risks", "High", "Medium", "Low"]}
            value={riskFilter}
            onChange={setRiskFilter}
          />
          <FilterDropdown
            label="Status"
            options={["All Status", "Completed", "In Progress", "Pending"]}
            value={statusFilter}
            onChange={setStatusFilter}
          />
        </div>

        {/* Two-column layout: table + activity */}
        <div className="grid grid-cols-[1fr_280px] gap-4">

          {/* Candidates table */}
          <div className="rounded-xl bg-[#131820] border border-white/8 overflow-hidden">
            <div className="px-5 py-4 border-b border-white/8">
              <h2 className="font-semibold text-base">All Candidates</h2>
            </div>
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-white/8 text-gray-400">
                  <th className="text-left px-5 py-3 font-medium">Candidate</th>
                  <th className="text-left px-4 py-3 font-medium">Position</th>
                  <th className="text-left px-4 py-3 font-medium">Risk</th>
                  <th className="text-left px-4 py-3 font-medium">Status</th>
                  <th className="text-left px-4 py-3 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((c) => (
                  <tr key={c.id} className="border-b border-white/5 hover:bg-white/3 transition-colors">
                    <td className="px-5 py-3 font-medium">{c.name}</td>
                    <td className="px-4 py-3 text-gray-300">{c.position}</td>
                    <td className="px-4 py-3"><RiskBadge risk={c.risk} /></td>
                    <td className="px-4 py-3"><StatusBadge status={c.status} /></td>
                    <td className="px-4 py-3">
                      <button className="flex items-center gap-1.5 text-gray-400 hover:text-white transition-colors text-sm">
                        <Eye className="w-4 h-4" />
                        View Report
                      </button>
                    </td>
                  </tr>
                ))}
                {filtered.length === 0 && (
                  <tr>
                    <td colSpan={5} className="px-5 py-8 text-center text-gray-500">
                      No candidates match the selected filters.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Recent Activity */}
          <div className="rounded-xl bg-[#131820] border border-white/8 p-5">
            <h2 className="font-semibold text-base mb-4">Recent Activity</h2>
            <ul className="space-y-4">
              {ACTIVITY.map((a, i) => (
                <li key={i} className="flex items-start gap-2.5">
                  <span className={`mt-1.5 w-2 h-2 rounded-full shrink-0 ${a.isHighRisk ? "bg-red-500" : "bg-green-500"}`} />
                  <div>
                    <p className="text-sm text-gray-200 leading-snug">
                      <span className="font-medium">{a.name}</span>{" "}{a.text}
                    </p>
                    <p className="text-xs text-gray-500 mt-0.5">{a.time}</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>

        </div>
      </main>

      {/* ── Footer ── */}
      <footer className="px-6 py-3 border-t border-white/8 text-xs text-gray-500 flex justify-end">
        Made with Manus
      </footer>
    </div>
  );
}
