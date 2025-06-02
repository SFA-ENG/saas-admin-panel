import { useState, useEffect } from "react";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import { Alert, Spin } from "antd";
import { useApiQuery } from "hooks/useApiQuery/useApiQuery";
import { CACHE_KEYS } from "../../../../commons/constants";

// Import Components
import TournamentBanner from "./components/TournamentBanner";
import TournamentTabs from "./components/TournamentTabs";

const TournamentDetailsPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { tournament_id: tournamentId } = useParams();
  const [tournament, setTournament] = useState(null);
  const [preparedTournamentData, setPreparedTournamentData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState("overview");
  
  const {
    data: tournamentsData,
    isFetching: tournamentsLoading,
    error: tournamentsError,
    refetch: refetchTournaments,
  } = useApiQuery({
    queryKey: [CACHE_KEYS.TOURNAMENTS],
    url: `/tms/tournaments`,
    params: {
      type: "DETAILED"
    }
  });
  
  // Try to get tournament data from navigation state
  const tournamentDataFromNav = location.state?.tournamentData;
  
  // Process API data when it's available
  useEffect(() => {
    if (!tournament && tournamentId && tournamentsData?.tournaments?.length > 0) {
      // Find the tournament with matching ID
      const foundTournament = tournamentsData.tournaments.find(
        t => t.tournament_id === tournamentId
      );
      
      if (foundTournament) {
        setTournament(foundTournament);
        setError(null);
      } else {
        setError("Tournament not found in API response");
      }
    }
  }, [tournamentsData, tournamentId, tournament]);
  
  // Set tournament from navigation state if available
  useEffect(() => {
    if (tournamentDataFromNav && !tournament) {
      setTournament(tournamentDataFromNav);
    }
  }, [tournamentDataFromNav, tournament]);

  // Ensure API data is fetched when directly navigating to the URL
  useEffect(() => {
    // Force refetch on direct URL navigation (when there's no navigation state)
    if (tournamentId && !tournamentDataFromNav && !tournament && !tournamentsLoading) {
      refetchTournaments();
    }
  }, [tournamentId, tournamentDataFromNav, tournament, tournamentsLoading, refetchTournaments]);

  // Prepare tournament data for components
  useEffect(() => {
    if (tournament) {
      try {
        // Create a consistent data structure for components to use
        const normalizeSubEvent = (sub) => ({
          subEventId: sub.sub_event_id,
          name: sub.name,
          description: sub.description,
          isActive: sub.is_active,
          isPublished: sub.is_published,
          status: sub.status,
          inventoryMetadata: sub.inventory_metadata || {},
          gameFormat: sub.game_format,
          metaData: sub.meta_data || {},
          pricing: sub.pricing || {},
          participationRules: sub.participation_rules || {},
        });
        
        const normalizeEvent = (event) => ({
          ...event,
          eventId: event.event_id,
          name: event.name,
          status: event.status,
          startDate: event.start_date,
          endDate: event.end_date,
          categoryTree: event.category_tree || {},
          eventType: event.type || "Individual",
          type: event.type,
          subEvents: (event.sub_events || []).map(normalizeSubEvent),
        });
        
        const normalizeSport = (sport) => {
          // Check if events exist and are properly structured
          let eventsArray = [];
          if (sport.events && Array.isArray(sport.events)) {
            eventsArray = sport.events.map(normalizeEvent);
          }
          
          return {
            ...sport,
            sportsId: sport.sports_id || `sport-${sport.name}`, // Ensure sportsId exists
            name: sport.name || "Unknown Sport",
            events: eventsArray,
          };
        };
        
        const normalizeSeason = (season) => ({
          seasonId: season.season_id,
          name: season.name,
          description: season.description,
          startDate: season.start_date,
          endDate: season.end_date,
          registrationStartDate: season.registration_start_date,
          registrationEndDate: season.registration_end_date,
          isActive: season.is_active,
          isPublished: season.is_published,
          participationRules: season.participation_rules || {},
          termsAndConditions: season.terms_and_conditions || {},
          rulesAndRegulations: season.rules_and_regulations || {},
          medias: season.medias || [],
          locations: season.locations || [],
          sports: (season.sports || []).map(normalizeSport),
        });
        
        const prepared = {
          id: tournament.tournament_id || tournament.tournamentId || (tournament.rawData && tournament.rawData.tournament_id),
          name: tournament.name,
          description: tournament.description,
          status: tournament.status,
          rawData: tournament.rawData || tournament,
          medias: tournament.rawData?.medias || tournament.medias || [],
          seasons: (tournament.rawData?.seasons || tournament.seasons || []).map(normalizeSeason),
          sports: tournament.rawData?.sports || tournament.sports || [],
          locations: tournament.rawData?.locations || tournament.locations || [],
          participationRules: tournament.rawData?.participation_rules || tournament.participation_rules || {},
        };
        
        setPreparedTournamentData(prepared);
        setLoading(false);
      } catch (err) {
        setError("Error processing tournament data");
        setLoading(false);
      }
    }
  }, [tournament]);
  
  // Handle tabs change
  const handleTabChange = (key) => {
    setActiveTab(key);
  };

  // Combine internal loading state with API loading state
  const isLoading = loading || (tournamentsLoading && !tournament);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-96">
        <Spin size="large" tip="Loading tournament details..." />
      </div>
    );
  }

  // Combine internal error state with API error state
  const displayError = error || (tournamentsError && !tournament);

  if (displayError) {
    return (
      <Alert
        message="Error Loading Tournament"
        description={typeof displayError === 'string' ? displayError : displayError.message || "Failed to load tournament data"}
        type="error"
        showIcon
        className="m-4"
        action={
          <button
            onClick={() => refetchTournaments()}
            className="mt-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Retry
          </button>
        }
      />
    );
  }

  if (!tournament && !preparedTournamentData) {
    return (
      <Alert
        message="Tournament Not Found"
        description="The requested tournament could not be found. Please check the tournament ID and try again."
        type="warning"
        showIcon
        className="m-4"
      />
    );
  }

  return (
    <div className="tournament-details-container">
      {preparedTournamentData ? (
        <>
          <TournamentBanner tournament={preparedTournamentData} />
          <TournamentTabs
            tournament={preparedTournamentData}
            activeTab={activeTab}
            handleTabChange={handleTabChange}
          />
        </>
      ) : (
        <Alert
          message="Processing Tournament Data"
          description="Please wait while we process the tournament information..."
          type="info"
          showIcon
          className="m-4"
        />
      )}
    </div>
  );
};

export default TournamentDetailsPage;
