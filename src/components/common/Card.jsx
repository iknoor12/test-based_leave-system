const Card = ({ title, value, description, children, className = '' }) => {
  return (
    <div className={`bg-white rounded-lg shadow-md p-6 border border-gray-200 ${className}`}>
      {title && <h3 className="text-gray-600 text-sm font-semibold uppercase tracking-wide">{title}</h3>}
      {value && <p className="text-3xl font-bold text-gray-900 mt-2">{value}</p>}
      {description && <p className="text-gray-500 text-sm mt-1">{description}</p>}
      {children && <div className="mt-4">{children}</div>}
    </div>
  );
};

export default Card;
