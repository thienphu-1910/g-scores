export const MetricCard = ({ title, value }) => (
  <div className="bg-gray-50 border border-gray-100 rounded-lg p-4 flex flex-col items-center justify-center transition-all hover:bg-indigo-50/30 hover:border-indigo-100">
    <span className="text-[10px] font-semibold uppercase tracking-widest text-gray-400 mb-1 text-center">
      {title}
    </span>
    <span className="text-2xl font-bold text-gray-800">
      {value !== undefined && value !== null ? value : "—"}
    </span>
  </div>
);
