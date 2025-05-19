import { Badge, Image, Space, Tag, Tooltip } from "antd";
import { Calendar, Eye, MapPin, Star, Users } from "lucide-react";
import { useNavigate } from "react-router-dom";

const TournamentCard = ({ tournament }) => {
  const navigate = useNavigate();
  
  const getTournamentId = () => {
   
    if (tournament.tournamentId) {
      return tournament.tournamentId;
    }
   
    
    console.error("Could not find tournament ID");
    return null;
  };
  
  // Handle navigation using a hybrid approach
  const handleNavigate = () => {
    const tournamentId = getTournamentId();
    
    if (tournamentId) {
      navigate(`/tms/tournaments/${tournamentId}`, {
        state: { tournamentData: tournament }
      });
      
      // Force page navigation as a reliable backup
      // Using setTimeout to allow React Router to attempt navigation first
      setTimeout(() => {
        window.location.href = `/tms/tournaments/${tournamentId}`;
      }, 50);
    } else {
      console.error("Cannot navigate - missing tournament ID");
    }
  };
  
  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case "upcoming":
        return "bg-blue-500";
      case "active":
        return "bg-green-500";
      case "completed":
        return "bg-gray-500";
      case "draft":
        return "bg-orange-500";
      default:
        return "bg-gray-300";
    }
  };

  // Format date in human-readable format
  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const options = { year: "numeric", month: "short", day: "numeric" };
    return new Date(dateString).toLocaleDateString("en-US", options);
  };

  // Find start and end dates from seasons
  const getDateRange = () => {
    const rawData = tournament.rawData;
    if (!rawData?.seasons || rawData.seasons.length === 0) {
      return { startDate: null, endDate: null };
    }
    
    // Find earliest start date and latest end date across all seasons
    let startDates = [];
    let endDates = [];
    
    rawData.seasons.forEach(season => {
      if (season.start_date) startDates.push(new Date(season.start_date));
      if (season.end_date) endDates.push(new Date(season.end_date));
    });
    
    startDates.sort((a, b) => a - b);
    endDates.sort((a, b) => b - a);
    
    return {
      startDate: startDates.length > 0 ? startDates[0].toISOString().split('T')[0] : null,
      endDate: endDates.length > 0 ? endDates[0].toISOString().split('T')[0] : null
    };
  };
  
  const { startDate, endDate } = getDateRange();
  
  const defaultBanner =
    "https://static.vecteezy.com/system/resources/thumbnails/020/919/577/small_2x/sports-background-international-sports-day-illustration-graphic-design-for-the-decoration-of-gift-certificates-banners-and-flyer-free-vector.jpg";
  const defaultLogo =
    "https://placehold.co/100/e2e8f0/64748b?text=Logo";

  // Get location info from the first season's locations
  const getLocationText = () => {
    const rawData = tournament.rawData;
    if (!rawData?.seasons || rawData.seasons.length === 0 || 
        !rawData.seasons[0].locations || rawData.seasons[0].locations.length === 0) {
      return "Location not specified";
    }
    
    // Take up to 2 locations to display
    const locationNames = rawData.seasons[0].locations
      .slice(0, 2)
      .map(loc => loc.name);
      
    return locationNames.join(", ") + 
      (rawData.seasons[0].locations.length > 2 ? "..." : "");
  };

  return (
    <div className="bg-white rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 border border-gray-100">
      {/* Banner */}
      <div className="relative h-44 overflow-hidden">
        <Image
          src={tournament.banner || defaultBanner}
          preview={false}
          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          onError={(e) => {
            e.target.src = defaultBanner;
          }}
        />
        <Badge
          count={tournament.status}
          className="absolute top-3 right-3 text-xs font-semibold rounded-full text-white px-3 py-1 capitalize"
        />
        {tournament.publishToMarketPlace && (
          <Tooltip title="Published to Marketplace">
            <div className="absolute top-3 left-3 bg-yellow-500 p-1 rounded-full shadow">
              <Star size={16} className="text-white" />
            </div>
          </Tooltip>
        )}
      </div>

      {/* Content */}
      <div className="p-5">
        <div className="flex items-start">
          <div className="w-16 h-16 mr-4 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0 border border-gray-200 shadow-sm hover:shadow-lg transition-shadow duration-300">
            <img
              src={tournament.logo || defaultLogo}
              alt="logo"
              className="w-full h-full object-contain"
              onError={(e) => {
                e.target.src = defaultLogo;
              }}
            />
          </div>
          <div className="flex-grow">
            <p className="font-semibold text-gray-900 text-sm">
              {tournament.name}
            </p>
            <div className="flex items-center mt-2 text-sm text-gray-600">
              <MapPin size={14} className="mr-1" />
              <span>{getLocationText()}</span>
              <span className="mx-2">•</span>
              <Users size={14} className="mr-1" />
              <span>{tournament.rawData?.competition_type?.replace(/_/g, ' ') || "Team"}</span>
            </div>
            <p className="text-sm text-gray-500 line-clamp-2 mt-2">
              {tournament.description}
            </p>
          </div>
        </div>

        {/* Dates & Actions */}
        <div className="mt-4 flex flex-col gap-4">
          <div className="bg-gray-50 rounded-lg p-3 flex flex-col gap-2">
            <div className="flex items-center justify-between flex-wrap gap-2">
              <div className="flex items-center text-sm text-gray-600">
                <Calendar size={14} className="mr-1.5" />
                <span className="font-medium">Period</span>
              </div>
              <Tooltip
                title={tournament.sports && tournament.sports.length > 0 ? 
                  tournament.sports.join(", ") : "No sports specified"}
                className="text-blue"
              >
                <Tag
                  className="max-w-[150px] w-fit text-center overflow-hidden text-ellipsis whitespace-nowrap"
                  color={"blue"}
                >
                  {tournament.sports && tournament.sports.length > 0 ? 
                    tournament.sports.join(", ") : "No sports specified"}
                </Tag>
              </Tooltip>
            </div>
            <div className="flex items-center justify-between text-sm text-gray-700 flex-wrap gap-2">
              <div>
                <span className="text-gray-500">Start:</span>{" "}
                <span className="font-semibold">
                  {formatDate(startDate)}
                </span>
              </div>
              <div>
                <span className="text-gray-500">End:</span>{" "}
                <span className="font-semibold">
                  {formatDate(endDate)}
                </span>
              </div>
            </div>
          </div>

          <div className="flex justify-between items-center">
            <Badge
              color={tournament.isActive ? "green" : "red"}
              text={tournament.isActive ? "Active" : "Inactive"}
            />
            <button
              className="bg-blue-500 text-white px-2 py-1 rounded-md hover:bg-blue-900 transition-colors cursor-pointer"
              onClick={handleNavigate}
            >
              <Space>
                <Eye size={14} />
                View Seasons
              </Space>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TournamentCard;
