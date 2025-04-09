import { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import TeamStatsCard from "../components/matches/TeamStatsCard";
import UpcomingMatchCard from "../components/matches/UpcomingMatchCard";
import { useQuery } from "@tanstack/react-query";

const LiveMatch = () => {
  const { id } = useParams();
  
  const [activeTab, setActiveTab] = useState("recent");
  const [match, setMatch] = useState({
    id: 1,
    league: "La Liga",
    status: "LIVE",
    homeTeam: "FC Barcelona",
    awayTeam: "Real Madrid",
    currentTime: "67'",
    score: {
      home: 2,
      away: 1
    },
    lastGoal: "Lewandowski (55')"
  });
  
  const [homeTeam, setHomeTeam] = useState({
    name: "FC Barcelona",
    possession: "58%",
    shots: 12,
    shotsOnTarget: 5
  });
  
  const [awayTeam, setAwayTeam] = useState({
    name: "Real Madrid",
    possession: "42%",
    shots: 8,
    shotsOnTarget: 3
  });
  
  const [recentResults, setRecentResults] = useState([
    {
      id: 1,
      team: "Manchester City",
      score: "3 - 1",
      opponent: "Arsenal",
      league: "Premier League",
      status: "Completed"
    },
    {
      id: 2,
      team: "Liverpool",
      score: "2 - 0",
      opponent: "Newcastle",
      league: "Premier League",
      status: "Completed"
    },
    {
      id: 3,
      team: "Bayern Munich",
      score: "4 - 2",
      opponent: "Dortmund",
      league: "Bundesliga",
      status: "Completed"
    },
    {
      id: 4,
      team: "PSG",
      score: "1 - 0",
      opponent: "Lyon",
      league: "Ligue 1",
      status: "Completed"
    }
  ]);
  
  const [upcomingMatches, setUpcomingMatches] = useState([
    {
      id: 1,
      homeTeam: "Juventus",
      awayTeam: "AC Milan",
      league: "Serie A",
      time: "Tomorrow, 20:45"
    },
    {
      id: 2,
      homeTeam: "Chelsea",
      awayTeam: "Manchester United",
      league: "Premier League",
      time: "Saturday, 18:30"
    },
    {
      id: 3,
      homeTeam: "Atletico Madrid",
      awayTeam: "Sevilla",
      league: "La Liga",
      time: "Sunday, 21:00"
    }
  ]);

  // Fetch match data
  const { data, isLoading } = useQuery({
    queryKey: [`/api/matches/${id}`],
    enabled: false, // Disable actual fetch for now since we're using state
  });

  const handleViewMatch = (match) => {
    console.log("View match:", match);
    // Handle view match details
  };

  return (
    <div className="p-6">
      <div className="mb-4">
        <div className="flex items-center text-sm text-[#6B7280] mb-2">
          <Link to="/tournaments">Matches</Link>
          <i className="fas fa-chevron-right mx-2 text-xs"></i>
          <span>Live Scoreboard</span>
        </div>
        <h1 className="text-2xl font-semibold text-[#111827]">Live Match</h1>
      </div>
      
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
          <button 
            className={`inline-flex items-center text-sm px-4 py-2 ${activeTab === 'details' ? 'bg-[#6366F1] text-white' : 'bg-gray-100 text-[#6B7280]'} rounded`}
            onClick={() => setActiveTab('details')}
          >
            Match Details
          </button>
          <button 
            className={`inline-flex items-center text-sm px-4 py-2 ${activeTab === 'statistics' ? 'bg-[#6366F1] text-white' : 'bg-gray-100 text-[#6B7280]'} rounded`}
            onClick={() => setActiveTab('statistics')}
          >
            Statistics
          </button>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        {/* FC Barcelona Stats */}
        <TeamStatsCard team={homeTeam} />
        
        {/* Score */}
        <div className="bg-white rounded-lg shadow-sm p-5">
          <h3 className="text-center font-semibold mb-2">SCORE</h3>
          <div className="text-3xl font-bold text-center mb-2">{match.score.home} - {match.score.away}</div>
          <p className="text-sm text-center text-[#6B7280]">Last Goal: {match.lastGoal}</p>
        </div>
        
        {/* Real Madrid Stats */}
        <TeamStatsCard team={awayTeam} />
      </div>
      
      {/* Match Tabs */}
      <div className="border-b border-[#E5E7EB] mb-6">
        <div className="flex">
          <button 
            className={`px-4 py-2 text-sm font-medium ${activeTab === 'recent' ? 'text-[#6366F1] border-b-2 border-[#6366F1]' : 'text-[#6B7280]'}`}
            onClick={() => setActiveTab('recent')}
          >
            Recent Results
          </button>
          <button 
            className={`px-4 py-2 text-sm font-medium ${activeTab === 'upcoming' ? 'text-[#6366F1] border-b-2 border-[#6366F1]' : 'text-[#6B7280]'}`}
            onClick={() => setActiveTab('upcoming')}
          >
            Upcoming Matches
          </button>
        </div>
      </div>
      
      {activeTab === 'recent' && (
        <div className="bg-white rounded-lg shadow-sm mb-6">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-[#E5E7EB]">
              <thead>
                <tr className="bg-gray-50">
                  <th className="px-6 py-3 text-left text-xs font-medium text-[#6B7280] uppercase tracking-wider" style={{width: "30%"}}>Team</th>
                  <th className="px-6 py-3 text-center text-xs font-medium text-[#6B7280] uppercase tracking-wider" style={{width: "10%"}}>Score</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-[#6B7280] uppercase tracking-wider" style={{width: "20%"}}>Opponent</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-[#6B7280] uppercase tracking-wider" style={{width: "20%"}}>League</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-[#6B7280] uppercase tracking-wider" style={{width: "15%"}}>Status</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-[#6B7280] uppercase tracking-wider" style={{width: "5%"}}>Action</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-[#E5E7EB]">
                {recentResults.map(result => (
                  <tr key={result.id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="w-6 h-6 bg-gray-100 rounded-full flex items-center justify-center mr-2">
                          <i className="fas fa-futbol text-[#6B7280] text-xs"></i>
                        </div>
                        <span className="text-sm">{result.team}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-center text-sm font-medium">{result.score}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">{result.opponent}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">{result.league}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-xs font-medium text-[#111827] bg-gray-100 px-2 py-1 rounded">{result.status}</span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm">
                      <button onClick={() => handleViewMatch(result)}>
                        <i className="fas fa-eye text-[#6B7280]"></i>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
      
      {/* Upcoming Matches Section */}
      {activeTab === 'upcoming' || activeTab === 'recent' ? (
        <>
          <h2 className="text-xl font-semibold mb-4">Upcoming Matches</h2>
          
          <div className="space-y-4">
            {upcomingMatches.map(match => (
              <UpcomingMatchCard key={match.id} match={match} />
            ))}
          </div>
          
          <div className="mt-6 text-center">
            <button className="bg-[#6366F1] text-white px-4 py-2 rounded">View All Matches</button>
          </div>
        </>
      ) : null}
    </div>
  );
};

export default LiveMatch;
