import { useState, useEffect } from "react";
import { api } from "../services/api";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Bar } from "react-chartjs-2";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
);

const Subjects = {
  MATH: "math",
  LITERATURE: "literature",
  FOREIGN_LANGUAGE: "foreignLg",
  PHYSICS: "physics",
  CHEMISTRY: "chemistry",
  BIOLOGY: "biology",
  GEOGRAPHY: "geography",
  HISTORY: "history",
  PHYSICAL_EDUCATION: "phyEdu",
};

const SUBJECT_LABELS = {
  math: "Math",
  literature: "Literature",
  foreignLg: "Foreign Language",
  physics: "Physics",
  chemistry: "Chemistry",
  biology: "Biology",
  geography: "Geography",
  history: "History",
  phyEdu: "Physical Ed.",
};

const SUBJECT_ICONS = {
  math: "∑",
  literature: "✦",
  foreignLg: "◈",
  physics: "⊛",
  chemistry: "⬡",
  biology: "◉",
  geography: "◎",
  history: "◷",
  phyEdu: "◈",
};

const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: { display: false },
    tooltip: {
      backgroundColor: "#1a1a2e",
      titleColor: "#e8e8f0",
      bodyColor: "#a0a0b8",
      padding: 10,
      cornerRadius: 6,
      callbacks: {
        label: (ctx) => ` ${ctx.parsed.y.toLocaleString()} students`,
      },
    },
  },
  scales: {
    x: {
      grid: { display: false },
      border: { display: false },
      ticks: { color: "#7c7c9a", font: { size: 11 } },
    },
    y: {
      grid: { color: "rgba(124,124,154,0.1)", drawBorder: false },
      border: { display: false, dash: [4, 4] },
      ticks: { color: "#7c7c9a", font: { size: 11 }, stepSize: 1 },
    },
  },
};

const makeChartData = (distribution) => ({
  labels: ["Excellent", "Good", "Average", "Poor"],
  datasets: [
    {
      data: [
        distribution.excellent,
        distribution.good,
        distribution.average,
        distribution.poor,
      ],
      backgroundColor: ["#10b981", "#3b82f6", "#f59e0b", "#ef4444"],
      borderRadius: 6,
      borderSkipped: false,
      barThickness: 32,
    },
  ],
});

export const ReportPage = () => {
  const [selectedSubjects, setSelectedSubjects] = useState([]);
  const [sseSelectedSubjects, setSSESelectedSubjects] = useState([]);
  const [reports, setReports] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const allSubjectCodes = Object.values(Subjects);

  useEffect(() => {
    const url = new URL(`${import.meta.env.VITE_BASE_URL}/stream-reports`);
    url.searchParams.set("subjects", sseSelectedSubjects.join(","));    
    const eventSource = new EventSource(url.toString());

    eventSource.addEventListener("report", (event) => {
      try {
        const payload = JSON.parse(event.data);
        setReports((prev) => ({ ...prev, [payload.code]: payload.data }));
      } catch (error) {
        console.error("Failed to parse SSE report data:", error);
      }
    });

    return () => eventSource.close();
  }, [sseSelectedSubjects]);

  const handleToggleSubject = (code) => {
    setSelectedSubjects((prev) =>
      prev.includes(code) ? prev.filter((c) => c !== code) : [...prev, code],
    );
  };

  const handleSelectAll = () => {
    setSelectedSubjects(
      selectedSubjects.length === allSubjectCodes.length ? [] : allSubjectCodes,
    );
  };

  const handleSubmit = async () => {
    if (selectedSubjects.length === 0) return;
    setIsSubmitting(true);
    setSSESelectedSubjects(selectedSubjects);
    try {
      await api.post("/trigger-reports", { subjectCodes: selectedSubjects });
    } catch (error) {
      console.error("Error triggering reports:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const reportEntries = Object.entries(reports);
  const allSelected = selectedSubjects.length === allSubjectCodes.length;

  return (
    <div className="max-w-5xl mx-auto px-6 py-8 font-sans text-gray-900">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-xl font-semibold tracking-tight text-gray-900 mb-1">
          Subject reports
        </h1>
        <p className="text-sm text-gray-400">
          Select subjects and generate score distribution reports.
        </p>
      </div>

      {/* Subject selector card */}
      <section className="bg-white border border-gray-100 rounded-xl p-5 mb-6 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <span className="text-xs font-semibold uppercase tracking-widest text-black">
            Subjects
          </span>
          <button
            className="text-xs font-medium text-indigo-500 hover:text-indigo-700 transition-colors"
            onClick={handleSelectAll}
          >
            {allSelected ? "Deselect all" : "Select all"}
          </button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2 mb-5">
          {allSubjectCodes.map((code) => {
            const active = selectedSubjects.includes(code);
            return (
              <button
                key={code}
                onClick={() => handleToggleSubject(code)}
                className={`flex items-center gap-2 px-3 py-2 rounded-lg border text-sm text-left transition-all
                  ${
                    active
                      ? "bg-indigo-50 border-indigo-200 text-indigo-800 font-medium"
                      : "bg-gray-50 border-gray-100 text-gray-500 hover:border-gray-200 hover:text-gray-700"
                  }`}
              >
                <span className="opacity-50 text-sm shrink-0">
                  {SUBJECT_ICONS[code]}
                </span>
                <span className="truncate">{SUBJECT_LABELS[code]}</span>
                {active && (
                  <span className="ml-auto text-indigo-400 text-xs font-bold shrink-0">
                    ✓
                  </span>
                )}
              </button>
            );
          })}
        </div>

        <div className="flex items-center justify-between pt-4 border-t border-gray-50">
          <span className="text-xs text-gray-300">
            {selectedSubjects.length === 0
              ? "No subjects selected"
              : `${selectedSubjects.length} of ${allSubjectCodes.length} selected`}
          </span>
          <button
            disabled={selectedSubjects.length === 0 || isSubmitting}
            onClick={handleSubmit}
            className="inline-flex items-center gap-2 px-5 py-2 rounded-lg text-sm font-medium text-white bg-indigo-500 hover:bg-indigo-600 active:scale-95 transition-all disabled:opacity-40 disabled:cursor-not-allowed disabled:active:scale-100"
          >
            {isSubmitting ? (
              <>
                <svg
                  className="animate-spin h-3.5 w-3.5 text-white"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8v8H4z"
                  />
                </svg>
                Requesting…
              </>
            ) : (
              "Generate reports"
            )}
          </button>
        </div>
      </section>

      {/* Results */}
      <section>
        <div className="flex items-center gap-2 mb-4">
          <span className="text-xs font-semibold uppercase tracking-widest text-black">
            Results
          </span>
          {reportEntries.length > 0 && (
            <span className="inline-flex items-center justify-center h-5 min-w-5 px-1.5 rounded-full bg-indigo-50 text-indigo-600 text-xs font-semibold">
              {reportEntries.length}
            </span>
          )}
        </div>

        {reportEntries.length === 0 ? (
          <div className="border border-dashed border-gray-100 rounded-xl py-16 text-center">
            <p className="text-2xl text-gray-200 mb-2">◫</p>
            <p className="text-sm text-gray-300">
              No reports yet — select subjects above and generate to see data.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {reportEntries.map(([code, distribution]) => (
              <div
                key={code}
                className="bg-white border border-gray-100 rounded-xl p-4 shadow-sm"
              >
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-sm opacity-40">
                    {SUBJECT_ICONS[code]}
                  </span>
                  <span className="text-sm font-medium text-gray-800">
                    {SUBJECT_LABELS[code] ?? code}
                  </span>
                  <span className="ml-auto text-xs font-mono bg-gray-50 text-gray-400 px-2 py-0.5 rounded">
                    {code}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-x-3 gap-y-1 mb-3">
                  {[
                    {
                      label: "Excellent",
                      color: "bg-emerald-400",
                      val: distribution.excellent,
                    },
                    {
                      label: "Good",
                      color: "bg-blue-400",
                      val: distribution.good,
                    },
                    {
                      label: "Average",
                      color: "bg-amber-400",
                      val: distribution.average,
                    },
                    {
                      label: "Poor",
                      color: "bg-red-400",
                      val: distribution.poor,
                    },
                  ].map(({ label, color, val }) => (
                    <div
                      key={label}
                      className="flex items-center gap-1.5 text-xs"
                    >
                      <span
                        className={`w-2 h-2 rounded-full shrink-0 ${color}`}
                      />
                      <span className="text-gray-400 flex-1">{label}</span>
                      <span className="text-gray-700 font-medium tabular-nums">
                        {val.toLocaleString()}
                      </span>
                    </div>
                  ))}
                </div>

                <div className="h-44">
                  <Bar
                    data={makeChartData(distribution)}
                    options={chartOptions}
                  />
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
};