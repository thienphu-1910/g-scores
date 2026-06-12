import { useJobStore } from "../stores/useJobStore";

const statusConfig = {
  processing: {
    label: "Calculating…",
    color: "bg-blue-600",
    sub: "Processing your report data",
  },
  done: {
    label: "Calculation complete",
    color: "bg-green-500",
    sub: "Your report is ready",
  },
  error: {
    label: "Calculation failed",
    color: "bg-red-500",
    sub: "Something went wrong. Please try again.",
  },
};

const JobProgressBar = () => {
  const { job, clearJob } = useJobStore();

  if (!job) return null;

  const config = statusConfig[job.status] ?? statusConfig.processing;

  return (
    <div className="fixed bottom-4 right-4 w-72 bg-white border border-gray-200 rounded-xl p-4 shadow-lg z-50">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <span
            className={`w-2 h-2 rounded-full ${config.color} ${job.status === "processing" ? "animate-pulse" : ""}`}
          />
          <p className="text-sm font-medium text-gray-800">{config.label}</p>
        </div>
        <span className="text-xs text-gray-400">{job.progress}%</span>
      </div>

      <div className="w-full h-1.5 bg-gray-100 rounded-full overflow-hidden">
        <div
          className={`h-full rounded-full transition-all duration-500 ${config.color}`}
          style={{ width: `${job.progress}%` }}
        />
      </div>

      <p className="text-xs text-gray-400 mt-2">{config.sub}</p>

      {job.status !== "processing" && (
        <div className="flex justify-end mt-3">
          <button
            onClick={clearJob}
            className="text-xs text-blue-500 hover:underline"
          >
            Dismiss
          </button>
        </div>
      )}
    </div>
  );
};

export default JobProgressBar;
