import { useState, useEffect } from "react";
import { api } from "../services/api";

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

// Standard predefined academic groups
const PREDEFINED_GROUPS = [
  {
    id: "A",
    name: "Group A",
    subjects: [Subjects.MATH, Subjects.PHYSICS, Subjects.CHEMISTRY],
  },
  {
    id: "B",
    name: "Group B",
    subjects: [Subjects.MATH, Subjects.CHEMISTRY, Subjects.BIOLOGY],
  },
  {
    id: "C",
    name: "Group C",
    subjects: [Subjects.LITERATURE, Subjects.HISTORY, Subjects.GEOGRAPHY],
  },
  {
    id: "D",
    name: "Group D",
    subjects: [Subjects.MATH, Subjects.LITERATURE, Subjects.FOREIGN_LANGUAGE],
  },
];

export const DashboardPage = () => {
  const [selectedGroup, setSelectedGroup] = useState(PREDEFINED_GROUPS[0]);
  const [activeStreamGroup, setActiveStreamGroup] = useState(null);
  const [topScorers, setTopScorers] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);

  // Handle Server-Sent Events
  useEffect(() => {
    if (!activeStreamGroup) return;

    const subjectQuery = activeStreamGroup.subjects.join(",");
    const url = new URL(`${import.meta.env.VITE_BASE_URL}/stream-top-highest-statistic`);
    url.searchParams.set("subjects", subjectQuery);

    const eventSource = new EventSource(url.toString());

    eventSource.addEventListener("topHighest", (event) => {
      try {
        const payload = JSON.parse(event.data);
        setTopScorers(payload.data);
        setIsSubmitting(false);
      } catch (err) {
        console.error("Failed to parse SSE top scores data:", err);
        setError("Failed to parse incoming data.");
      }
    });

    eventSource.addEventListener("error", () => {
      console.error("SSE connection error");
      setIsSubmitting(false);
      eventSource.close();
    });

    return () => eventSource.close();
  }, [activeStreamGroup]);

  const handleSubmit = async () => {
    if (!selectedGroup) return;

    setIsSubmitting(true);
    setError(null);
    setTopScorers([]);
    setActiveStreamGroup(selectedGroup);

    try {
      await api.post("/trigger-top-highest-statistic", {
        subjects: selectedGroup.subjects,
      });
    } catch (err) {
      console.error("Error triggering top highest calculation:", err);
      setError("Failed to start calculation job. Please try again.");
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-6 py-8 font-sans text-gray-900">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-xl font-semibold tracking-tight text-gray-900 mb-1">
          Top Scorers Leaderboard
        </h1>
        <p className="text-sm text-gray-400">
          Select an academic group to identify the highest-scoring candidates
          and their component metrics.
        </p>
      </div>

      {/* Control Panel */}
      <section className="bg-white border border-gray-100 rounded-xl p-5 mb-6 shadow-sm">
        <div className="mb-4">
          <span className="text-xs font-semibold uppercase tracking-widest text-black">
            Subject Groups
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 mb-5">
          {PREDEFINED_GROUPS.map((group) => {
            const isActive = selectedGroup?.id === group.id;
            return (
              <button
                key={group.id}
                onClick={() => setSelectedGroup(group)}
                className={`flex flex-col items-start p-3 rounded-lg border text-left transition-all ${
                  isActive
                    ? "bg-indigo-50 border-indigo-200"
                    : "bg-gray-50 border-gray-100 hover:border-gray-200"
                }`}
              >
                <div className="flex w-full justify-between items-center mb-1">
                  <span
                    className={`font-medium ${isActive ? "text-indigo-800" : "text-gray-700"}`}
                  >
                    {group.name}
                  </span>
                  {isActive && (
                    <span className="text-indigo-500 text-xs font-bold">✓</span>
                  )}
                </div>
                <span
                  className={`text-xs ${isActive ? "text-indigo-600" : "text-gray-400"}`}
                >
                  {group.subjects.join(", ")}
                </span>
              </button>
            );
          })}
        </div>

        {error && (
          <div className="mb-4 px-4 py-2 bg-red-50 text-red-600 text-sm rounded border border-red-100">
            {error}
          </div>
        )}

        <div className="flex items-center justify-between pt-4 border-t border-gray-50">
          <span className="text-xs text-gray-400">
            Currently targeting:{" "}
            <strong className="text-gray-600">{selectedGroup?.name}</strong>
          </span>
          <button
            disabled={isSubmitting || !selectedGroup}
            onClick={handleSubmit}
            className="inline-flex items-center gap-2 px-5 py-2 rounded-lg text-sm font-medium text-white bg-indigo-500 hover:bg-indigo-600 active:scale-95 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? "Calculating..." : "Find Top Scorers"}
          </button>
        </div>
      </section>

      {/* Table Data Section */}
      <section>
        <div className="flex items-center gap-2 mb-4">
          <span className="text-xs font-semibold uppercase tracking-widest text-black">
            Results
          </span>
        </div>

        {!activeStreamGroup && topScorers.length === 0 ? (
          <div className="border border-dashed border-gray-200 rounded-xl py-16 text-center bg-gray-50/50">
            <p className="text-sm text-gray-400">
              Select a group and initiate the calculation to view the
              leaderboard.
            </p>
          </div>
        ) : topScorers.length === 0 ? (
          <div className="border border-gray-100 rounded-xl py-24 text-center bg-white shadow-sm flex flex-col items-center justify-center">
            <p className="text-sm text-gray-500 animate-pulse">
              Waiting for background workers to process{" "}
              {activeStreamGroup?.name}...
            </p>
          </div>
        ) : (
          <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
            {/* Scrollable Container */}
            <div className="overflow-x-auto max-h-[500px]">
              <table className="w-full text-left text-sm whitespace-nowrap">
                <thead className="bg-gray-50 border-b border-gray-200 sticky top-0 z-10 text-gray-600 uppercase text-xs tracking-wider">
                  <tr>
                    <th className="px-6 py-4 font-semibold text-center w-16">
                      Rank
                    </th>
                    <th className="px-6 py-4 font-semibold">
                      Registration Number
                    </th>
                    {/* Dynamically render headers based on the active group */}
                    {activeStreamGroup.subjects.map((sub) => (
                      <th
                        key={sub}
                        className="px-6 py-4 font-semibold text-right"
                      >
                        {SUBJECT_LABELS[sub] || sub}
                      </th>
                    ))}
                    <th className="px-6 py-4 font-semibold text-right text-indigo-700 bg-indigo-50/50">
                      Total Score
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {topScorers.map((candidate, index) => (
                    <tr
                      key={candidate.regisNumber}
                      className="hover:bg-gray-50 transition-colors"
                    >
                      <td className="px-6 py-4 text-center font-medium text-gray-500">
                        {index === 0
                          ? "🥇 1"
                          : index === 1
                            ? "🥈 2"
                            : index === 2
                              ? "🥉 3"
                              : index + 1}
                      </td>
                      <td className="px-6 py-4 font-mono font-medium text-gray-900">
                        {candidate.regisNumber}
                      </td>

                      {/* Dynamically extract the specific subject scores from the payload */}
                      {activeStreamGroup.subjects.map((sub) => {
                        const targetKey = `${sub}Score`;
                        const score = candidate[targetKey];
                        return (
                          <td
                            key={sub}
                            className="px-6 py-4 text-right text-gray-600"
                          >
                            {score !== undefined && score !== null
                              ? Number(score).toFixed(2)
                              : "—"}
                          </td>
                        );
                      })}

                      <td className="px-6 py-4 text-right font-bold text-indigo-700 bg-indigo-50/30">
                        {Number(candidate.totalScore).toFixed(2)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </section>
    </div>
  );
};
