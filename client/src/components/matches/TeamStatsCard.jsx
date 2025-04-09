const TeamStatsCard = ({ team }) => {
  return (
    <div className="bg-white rounded-lg shadow-sm p-5">
      <div className="flex items-center mb-4">
        <div className="w-6 h-6 bg-[#EEF2FF] rounded-full flex items-center justify-center mr-2">
          <i className="fas fa-futbol text-[#6366F1] text-xs"></i>
        </div>
        <h3 className="font-semibold">{team.name}</h3>
      </div>
      <p className="text-sm mb-1">Possession: {team.possession}</p>
      <p className="text-sm mb-1">Shots: {team.shots} Shots</p>
      <p className="text-sm">on Target: {team.shotsOnTarget}</p>
    </div>
  );
};

export default TeamStatsCard;
