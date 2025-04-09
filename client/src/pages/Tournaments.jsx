import { useState, useEffect } from "react";
import MatchCard from "../components/matches/MatchCard";
import { useQuery } from "@tanstack/react-query";

const Tournaments = () => {
  const [tournaments, setTournaments] = useState([]);
  const [liveMatches, setLiveMatches] = useState([
    {
      id: 1,
      league: "La Liga",
      status: "LIVE",
      homeTeam: "FC Barcelona",
      awayTeam: "Real Madrid",
      currentTime: "67'"
    },
    {
      id: 2,
      league: "Premier League",
      status: "LIVE",
      homeTeam: "Liverpool",
      awayTeam: "Manchester City",
      currentTime: "32'"
    }
  ]);

  // Fetch tournaments data
  const { data, isLoading } = useQuery({
    queryKey: ['/api/tournaments'],
    enabled: false, // Disable actual fetch for now since we're using state
  });

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-[#111827]">Tournaments</h1>
        <p className="text-[#6B7280]">Manage your tournaments and view live matches</p>
      </div>
      
      <div className="mb-6">
        <h2 className="text-xl font-semibold mb-4">Live Matches</h2>
        
        {liveMatches.map(match => (
          <MatchCard key={match.id} match={match} />
        ))}
      </div>
      
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Active Tournaments</h2>
        <button className="bg-[#6366F1] text-white text-sm px-4 py-2 rounded">
          Create Tournament
        </button>
      </div>
      
      <div className="bg-white rounded-lg shadow-sm p-4">
        {isLoading ? (
          <p>Loading tournaments...</p>
        ) : tournaments && tournaments.length > 0 ? (
          <table className="min-w-full divide-y divide-[#E5E7EB]">
            <thead>
              <tr className="bg-gray-50">
                <th className="px-6 py-3 text-left text-xs font-medium text-[#6B7280] uppercase tracking-wider">Tournament Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-[#6B7280] uppercase tracking-wider">Sport</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-[#6B7280] uppercase tracking-wider">Teams</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-[#6B7280] uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-[#6B7280] uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody>
              {/* Tournament rows would go here */}
              <tr>
                <td colSpan="5" className="px-6 py-4 text-center text-[#6B7280]">No tournaments available</td>
              </tr>
            </tbody>
          </table>
        ) : (
          <div className="p-6 text-center">
            <p className="text-[#6B7280] mb-4">No active tournaments at the moment</p>
            <button className="bg-[#6366F1] text-white text-sm px-4 py-2 rounded">Create Your First Tournament</button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Tournaments;
