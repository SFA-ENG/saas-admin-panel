const ActionCard = ({ icon, title, description, actionText, onClick }) => {
  return (
    <div className="bg-white rounded-lg shadow-sm p-5">
      <div className="w-8 h-8 bg-[#FFF7ED] rounded-lg flex items-center justify-center mb-4">
        <i className={`${icon} text-[#F97316]`}></i>
      </div>
      <h3 className="font-semibold mb-1">{title}</h3>
      <p className="text-sm text-[#6B7280] mb-4">{description}</p>
      <button 
        className="bg-[#F97316] text-white text-sm px-4 py-1.5 rounded"
        onClick={onClick}
      >
        {actionText}
      </button>
    </div>
  );
};

export default ActionCard;
