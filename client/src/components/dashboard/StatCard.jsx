const StatCard = ({ icon, title, description, status, actionText, viewText }) => {
  const statusColors = {
    ACTIVE: "text-green-600 bg-green-100",
    "IN PROGRESS": "text-amber-600 bg-amber-100",
    UPCOMING: "text-orange-600 bg-orange-100"
  };

  return (
    <div className="bg-white rounded-lg shadow-sm p-5">
      <div className="flex items-center justify-between mb-4">
        <div className="w-8 h-8 bg-[#FFF7ED] rounded-lg flex items-center justify-center">
          <i className={`${icon} text-[#F97316]`}></i>
        </div>
        <span className={`text-xs font-medium ${statusColors[status]} px-2 py-0.5 rounded`}>
          {status}
        </span>
      </div>
      <h3 className="font-semibold mb-1">{title}</h3>
      <p className="text-sm text-[#6B7280] mb-4">{description}</p>
      <div className="flex gap-2">
        <button className="bg-[#F97316] text-white text-sm px-4 py-1.5 rounded">
          {actionText}
        </button>
        <button className="text-[#F97316] text-sm px-4 py-1.5 rounded border border-[#E5E7EB]">
          {viewText}
        </button>
      </div>
    </div>
  );
};

export default StatCard;
