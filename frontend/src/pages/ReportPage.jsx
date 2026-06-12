import { useState, useEffect } from "react";
import { api } from "../services/api";
import { Subjects, SUBJECT_LABELS, SUBJECT_ICONS } from "../utils/subjects";
import { PageHeader } from "../components/PageHeader";
import { SelectionCard } from "../components/SelectionCard";
import { SelectableItem } from "../components/SelectableItem";
import { EmptyState } from "../components/StateDisplays";

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

// 1. Register ChartJS
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
);

// 2. Chart Configuration Helpers
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

  // 3. SSE Connection Logic
  useEffect(() => {
    if (sseSelectedSubjects.length === 0) return;

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

  const allSelected = selectedSubjects.length === allSubjectCodes.length;

  // 4. API Trigger Logic
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

  return (
    <div className="max-w-5xl mx-auto px-6 py-8 font-sans text-gray-900">
      <PageHeader
        title="Subject Reports"
        description="Select subjects and generate score distribution reports."
      />

      <SelectionCard
        title="Subjects"
        headerAction={
          <button
            className="text-xs font-medium text-indigo-500 hover:text-indigo-700"
            onClick={() =>
              setSelectedSubjects(allSelected ? [] : allSubjectCodes)
            }
          >
            {allSelected ? "Deselect all" : "Select all"}
          </button>
        }
        footerText={`${selectedSubjects.length} of ${allSubjectCodes.length} selected`}
        buttonText="Generate Reports"
        isSubmitting={isSubmitting}
        disabled={selectedSubjects.length === 0}
        onSubmit={handleSubmit}
      >
        {allSubjectCodes.map((code) => (
          <SelectableItem
            key={code}
            active={selectedSubjects.includes(code)}
            onClick={() => handleToggleSubject(code)}
            icon={SUBJECT_ICONS[code]}
            title={SUBJECT_LABELS[code]}
          />
        ))}
      </SelectionCard>

      <section>
        <div className="mb-4 text-xs font-semibold uppercase tracking-widest text-black flex gap-2 items-center">
          Results
          {reportEntries.length > 0 && (
            <span className="h-5 min-w-5 px-1.5 rounded-full bg-indigo-50 text-indigo-600 flex items-center justify-center text-xs">
              {reportEntries.length}
            </span>
          )}
        </div>

        {reportEntries.length === 0 ? (
          <EmptyState message="No reports yet — select subjects above and generate to see data." />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {/* 5. Chart Rendering Logic Restored */}
            {reportEntries.map(([code, distribution]) => (
              <div
                key={code}
                className="bg-white border border-gray-100 rounded-xl p-4 shadow-sm flex flex-col"
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

                {/* Score Summary Metrics */}
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

                {/* Chart.js Bar Component */}
                <div className="h-44 mt-auto">
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
