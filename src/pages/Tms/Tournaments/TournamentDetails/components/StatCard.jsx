// StatCard component for statistics tab
const StatCard = ({ icon, title, value, bgColor }) => (
  <div className="bg-white rounded-lg shadow-sm p-4 flex items-center">
    <div className={`${bgColor} p-3 rounded-lg mr-3`}>{icon}</div>
    <div className="flex items-center gap-4 w-full">
      <p className="text-gray-600 text-sm">{title} :</p>
      <p className="text-xl font-bold text-gray-800">{value}</p>
    </div>
  </div>
);

export default StatCard; 