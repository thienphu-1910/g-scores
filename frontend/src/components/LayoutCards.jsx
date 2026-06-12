export const ContentCard = ({ title, subtitle, children, headerAction }) => (
  <section className="bg-white border border-gray-100 rounded-xl p-5 mb-6 shadow-sm">
    {(title || headerAction) && (
      <div className="flex items-start justify-between mb-5 border-b border-gray-50 pb-4">
        <div>
          {title && (
            <h3 className="text-sm font-semibold uppercase tracking-widest text-black">
              {title}
            </h3>
          )}
          {subtitle && <p className="text-xs text-gray-400 mt-1">{subtitle}</p>}
        </div>
        {headerAction && <div>{headerAction}</div>}
      </div>
    )}
    {children}
  </section>
);
