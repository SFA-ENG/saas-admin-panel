const UpcomingMatchCard = ({ match }) => {
  return (
    <div className="bg-white rounded-lg shadow-sm p-4 flex items-center justify-between">
      <div className="flex items-center">
        <div className="w-6 h-6 bg-[#EEF2FF] rounded-full flex items-center justify-center mr-3">
          <i className="fas fa-futbol text-[#6366F1] text-xs"></i>
        </div>
        <div>
          <p className="text-sm font-medium">{match.homeTeam} vs {match.awayTeam}</p>
          <p className="text-xs text-[#6B7280]">{match.league} • {match.time}</p>
        </div>
      </div>
      <div className="flex items-center space-x-2">
        <button className="text-[#6B7280]">
          <i className="fas fa-bell"></i>
        </button>
        <button className="text-[#6B7280]">
          <i className="fas fa-calendar"></i>
        </button>
      </div>
    </div>
  );
};

export default UpcomingMatchCard;
