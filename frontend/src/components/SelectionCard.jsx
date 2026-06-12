export const SelectionCard = ({
  title,
  headerAction,
  children,
  footerText,
  buttonText,
  isSubmitting,
  onSubmit,
  disabled,
  error,
}) => (
  <section className="bg-white border border-gray-100 rounded-xl p-5 mb-6 shadow-sm">
    <div className="flex items-center justify-between mb-4">
      <span className="text-xs font-semibold uppercase tracking-widest text-black">
        {title}
      </span>
      {headerAction}
    </div>

    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-3 mb-5">
      {children}
    </div>

    {error && (
      <div className="mb-4 px-4 py-2 bg-red-50 text-red-600 text-sm rounded border border-red-100">
        {error}
      </div>
    )}

    <div className="flex items-center justify-between pt-4 border-t border-gray-50">
      <span className="text-xs text-gray-400">{footerText}</span>
      <button
        disabled={disabled || isSubmitting}
        onClick={onSubmit}
        className="inline-flex items-center gap-2 px-5 py-2 rounded-lg text-sm font-medium text-white bg-indigo-500 hover:bg-indigo-600 active:scale-95 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isSubmitting ? "Calculating..." : buttonText}
      </button>
    </div>
  </section>
);
