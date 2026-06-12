export const PageHeader = ({ title, description }) => (
  <div className="mb-8">
    <h1 className="text-xl font-semibold tracking-tight text-gray-900 mb-1">
      {title}
    </h1>
    <p className="text-sm text-gray-400">{description}</p>
  </div>
);
