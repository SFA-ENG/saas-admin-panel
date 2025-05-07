import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Empty } from "antd";
import FullPageLoader from "Components/Loader/Loader";

// Import Components
import TournamentBanner from "./components/TournamentBanner";
import TournamentTabs from "./components/TournamentTabs";

// Import Mock Data
import { mockTournamentData } from "./data/mockTournamentData";

const TournamentDetailsPage = () => {
  const { tournament_id } = useParams();
  const [loading, setLoading] = useState(true);
  const [tournament, setTournament] = useState(null);
  
  // In a real app, fetch the tournament data from an API
  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setTournament(mockTournamentData);
      setLoading(false);
    }, 30);
  }, [tournament_id]);

  if (loading) {
    return <FullPageLoader message="Loading tournament details..." />;
  }

  if (!tournament) {
    return (
      <div className="p-8 text-center">
        <Empty description="Tournament not found" />
      </div>
    );
  }

  return (
    <div className="tournament-details bg-gray-50 min-h-screen">
      <TournamentBanner tournament={tournament} />
      <TournamentTabs tournament={tournament} />
    </div>
  );
};

export default TournamentDetailsPage;
