import { Link } from "react-router-dom";

const MatchCard = ({ match }) => {
  return (
    <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
      <div className="flex items-center mb-4">
        <div className="w-6 h-6 bg-[#EEF2FF] rounded-full flex items-center justify-center mr-2">
          <i className="fas fa-futbol text-[#6366F1] text-xs"></i>
        </div>
        <span className="text-sm mr-2 text-red-500">{match.league} • {match.status}</span>
      </div>
      
      <h2 className="text-xl font-semibold mb-1">{match.homeTeam} vs {match.awayTeam}</h2>
      <p className="text-[#6B7280] mb-4">Current Time: {match.currentTime}</p>
      
      <div className="flex gap-4">
        <Link 
          to={`/matches/${match.id}`}
          className="inline-flex items-center text-sm px-4 py-2 bg-[#6366F1] text-white rounded"
        >
          Match Details
        </Link>
        <button className="inline-flex items-center text-sm px-4 py-2 text-[#6B7280] bg-gray-100 rounded">
          Statistics
        </button>
      </div>
    </div>
  );
};

export default MatchCard;
