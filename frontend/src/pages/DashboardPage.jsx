import { useState, useEffect } from "react";
import { api } from "../services/api";
import { PREDEFINED_GROUPS, SUBJECT_LABELS } from "../utils/subjects";
import { PageHeader } from "../components/PageHeader";
import { SelectionCard } from "../components/SelectionCard";
import { SelectableItem } from "../components/SelectableItem";
import { EmptyState, LoadingState } from "../components/StateDisplays";

const DashboardPage = () => {
  const [selectedGroup, setSelectedGroup] = useState(PREDEFINED_GROUPS[0]);
  const [activeStreamGroup, setActiveStreamGroup] = useState(null);
  const [topScorers, setTopScorers] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!activeStreamGroup) return;

    const subjectQuery = activeStreamGroup.subjects.join(",");
    const url = new URL(
      `${import.meta.env.VITE_BASE_URL}/stream-top-highest-statistic`,
    );
    url.searchParams.set("subjects", subjectQuery);

    const eventSource = new EventSource(url.toString());

    eventSource.addEventListener("topHighest", (event) => {
      try {
        const payload = JSON.parse(event.data);
        setTopScorers(payload.data);
        setIsSubmitting(false);
      } catch (err) {
        setError("Failed to parse incoming data.");
      }
    });

    eventSource.addEventListener("error", () => {
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
      setError("Failed to start calculation job. Please try again.");
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-6 py-8 font-sans text-gray-900">
      <PageHeader
        title="Top Scorers Leaderboard"
        description="Select an academic group to identify the highest-scoring candidates and their component metrics."
      />

      <SelectionCard
        title="Subject Groups"
        footerText={
          <span>
            Currently targeting:{" "}
            <strong className="text-gray-600">{selectedGroup?.name}</strong>
          </span>
        }
        buttonText="Find Top Scorers"
        isSubmitting={isSubmitting}
        disabled={!selectedGroup}
        onSubmit={handleSubmit}
        error={error}
      >
        {PREDEFINED_GROUPS.map((group) => (
          <SelectableItem
            key={group.id}
            active={selectedGroup?.id === group.id}
            onClick={() => setSelectedGroup(group)}
            title={group.name}
            subtitle={group.subjects.join(", ")}
          />
        ))}
      </SelectionCard>

      <section>
        <div className="mb-4 text-xs font-semibold uppercase tracking-widest text-black">
          Results
        </div>

        {!activeStreamGroup && topScorers.length === 0 ? (
          <EmptyState message="Select a group and initiate the calculation to view the leaderboard." />
        ) : topScorers.length === 0 ? (
          <LoadingState
            message={`Waiting for background workers to process ${activeStreamGroup?.name}...`}
          />
        ) : (
          <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
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
                      className="hover:bg-gray-50"
                    >
                      <td className="px-6 py-4 text-center text-gray-500">
                        {index + 1}
                      </td>
                      <td className="px-6 py-4 font-mono font-medium">
                        {candidate.regisNumber}
                      </td>
                      {activeStreamGroup.subjects.map((sub) => (
                        <td
                          key={sub}
                          className="px-6 py-4 text-right text-gray-600"
                        >
                          {candidate[`${sub}Score`]
                            ? Number(candidate[`${sub}Score`]).toFixed(2)
                            : "—"}
                        </td>
                      ))}
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

export default DashboardPage;