export const SelectableItem = ({ active, onClick, icon, title, subtitle }) => (
  <button
    onClick={onClick}
    className={`flex items-center gap-2 p-3 rounded-lg border text-left transition-all w-full
      ${
        active
          ? "bg-indigo-50 border-indigo-200 text-indigo-800"
          : "bg-gray-50 border-gray-100 text-gray-500 hover:border-gray-200 hover:text-gray-700"
      }`}
  >
    {icon && <span className="opacity-50 text-sm shrink-0">{icon}</span>}
    <div className="flex flex-col w-full overflow-hidden">
      <span className="font-medium truncate text-sm">{title}</span>
      {subtitle && (
        <span className="text-xs opacity-70 truncate">{subtitle}</span>
      )}
    </div>
    {active && (
      <span className="ml-auto text-indigo-500 text-xs font-bold shrink-0">
        ✓
      </span>
    )}
  </button>
);
