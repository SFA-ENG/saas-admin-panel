const ActivityItem = ({ icon, title, user, time, onView }) => {
  return (
    <div className="p-4 border-b border-[#E5E7EB] flex items-center justify-between">
      <div className="flex items-center">
        <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center mr-3">
          <i className={`${icon} text-[#6B7280]`}></i>
        </div>
        <div>
          <p className="text-sm">{title}</p>
          <p className="text-xs text-[#6B7280]">{user}</p>
        </div>
      </div>
      <div className="flex items-center">
        <span className="text-sm text-[#6B7280] mr-6">{time}</span>
        <button onClick={onView}>
          <i className="fas fa-eye text-[#6B7280]"></i>
        </button>
      </div>
    </div>
  );
};

export default ActivityItem;
