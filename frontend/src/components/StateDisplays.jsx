export const EmptyState = ({ message }) => (
  <div className="border border-dashed border-gray-200 rounded-xl py-16 text-center bg-gray-50/50">
    <p className="text-sm text-gray-400">{message}</p>
  </div>
);

export const LoadingState = ({ message }) => (
  <div className="border border-gray-100 rounded-xl py-24 text-center bg-white shadow-sm flex flex-col items-center justify-center">
    <p className="text-sm text-gray-500 animate-pulse">{message}</p>
  </div>
);
