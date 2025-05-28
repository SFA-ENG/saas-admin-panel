import { Badge, Space, Tag, Tooltip } from "antd";
import { Calendar, Eye, MapPin, Star, Users } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";

const TournamentCard = ({ tournament }) => {
  const navigate = useNavigate();
  
  const getTournamentId = () => {
    if (tournament.tournamentId) {
      return tournament.tournamentId;
    }
    
    if (tournament.tournament_id) {
      return tournament.tournament_id;
    }
    
    if (tournament.rawData && tournament.rawData.tournament_id) {
      return tournament.rawData.tournament_id;
    }
    
    console.error("Could not find tournament ID");
    return null;
  };
  
  // Extract media URLs from the tournament data
  const getMediaUrls = () => {
    const mediaUrls = {
      logo: null,
      banner: null
    };
    
    // Log tournament data for debugging
    console.log("Tournament data:", tournament);
    
    // First check if medias array is in rawData (original API format)
    if (tournament.rawData && tournament.rawData.medias && Array.isArray(tournament.rawData.medias)) {     
      // Process each media item in the array
      tournament.rawData.medias.forEach(media => {
        
        // Handle structure with "type" field (lowercase)
        if (media.type && media.url) {
          if (media.type.toLowerCase() === 'logo') {
            mediaUrls.logo = media.url;
          } else if (media.type.toLowerCase() === 'banner') {
            mediaUrls.banner = media.url;
          }
        }
        
        // Handle structure with "usage" field (uppercase)
        if (media.usage && media.url) {
          if (media.usage.toUpperCase() === 'LOGO') {
            console.log("Found logo with usage field:", media.url);
            mediaUrls.logo = media.url;
          } else if (media.usage.toUpperCase() === 'BANNER') {
            console.log("Found banner with usage field:", media.url);
            mediaUrls.banner = media.url;
          }
        }
      });
    } 
    // If not in rawData, check direct medias array
    else if (tournament.medias && Array.isArray(tournament.medias)) {

      // Process each media item in the array
      tournament.medias.forEach(media => {
        
        // Handle structure with "type" field (lowercase)
        if (media.type && media.url) {
          if (media.type.toLowerCase() === 'logo') {
            console.log("Found logo with type field:", media.url);
            mediaUrls.logo = media.url;
          } else if (media.type.toLowerCase() === 'banner') {
            console.log("Found banner with type field:", media.url);
            mediaUrls.banner = media.url;
          }
        }
        
        // Handle structure with "usage" field (uppercase)
        if (media.usage && media.url) {
          if (media.usage.toUpperCase() === 'LOGO') {
            console.log("Found logo with usage field:", media.url);
            mediaUrls.logo = media.url;
          } else if (media.usage.toUpperCase() === 'BANNER') {
            console.log("Found banner with usage field:", media.url);
            mediaUrls.banner = media.url;
          }
        }
      });
    } else {
      console.log("No medias array found in tournament data");
    }
    
    // As a last resort, check if logo and banner are direct properties
    if (!mediaUrls.logo && tournament.logo) {
      mediaUrls.logo = tournament.logo;
    }
    
    if (!mediaUrls.banner && tournament.banner) {
      mediaUrls.banner = tournament.banner;
    }
    
    // Check if the URLs might need protocol added
    if (mediaUrls.logo && !mediaUrls.logo.startsWith('http')) {
      mediaUrls.logo = 'https://' + mediaUrls.logo;
    }
    
    if (mediaUrls.banner && !mediaUrls.banner.startsWith('http')) {
      mediaUrls.banner = 'https://' + mediaUrls.banner;
    }
    
    return mediaUrls;
  };
  
  // Generate a color based on tournament name for banner placeholder
  const getColorFromName = (name) => {
    if (!name) return '#4a5568'; // Default gray if no name
    
    // Predefined vibrant colors
    const colors = [
      '#3182CE', // Blue
      '#805AD5', // Purple
      '#DD6B20', // Orange
      '#38A169', // Green
      '#E53E3E', // Red
      '#D69E2E', // Yellow
      '#0D9488', // Teal
      '#6B46C1', // Indigo
      '#B83280', // Pink
      '#2C5282', // Dark Blue
    ];
    
    // Simple hash function to determine color index
    let hash = 0;
    for (let i = 0; i < name.length; i++) {
      hash = name.charCodeAt(i) + ((hash << 5) - hash);
    }
    
    // Use the hash to pick a color from the array
    const index = Math.abs(hash) % colors.length;
    return colors[index];
  };
  
  // Get first letter for logo placeholder
  const getInitial = (name) => {
    if (!name || name.length === 0) return '?';
    return name.charAt(0).toUpperCase();
  };
  
  const { logo, banner } = getMediaUrls();
  
  // Debug logging
  useEffect(() => {
    console.log("Tournament card rendered with:", { 
      tournamentId: getTournamentId(),
      tournamentName: tournament.name, 
      logo, 
      banner 
    });
  }, []);
  
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
    // Check for seasons data in different possible locations
    let seasons = [];
    
    // Check in rawData (primary source)
    if (tournament.rawData?.seasons && Array.isArray(tournament.rawData.seasons)) {
      seasons = tournament.rawData.seasons;
    } 
    // Check if seasons are directly on tournament object
    else if (tournament.seasons && Array.isArray(tournament.seasons)) {
      seasons = tournament.seasons;
    }
    
    if (seasons.length === 0) {
      return { startDate: null, endDate: null };
    }
    
    // Find earliest start date and latest end date across all seasons
    let startDates = [];
    let endDates = [];
    
    seasons.forEach(season => {
      // Check for start_date or startDate
      if (season.start_date) startDates.push(new Date(season.start_date));
      else if (season.startDate) startDates.push(new Date(season.startDate));
      
      // Check for end_date or endDate
      if (season.end_date) endDates.push(new Date(season.end_date));
      else if (season.endDate) endDates.push(new Date(season.endDate));
    });
    
    // Sort start dates in ascending order (earliest first)
    startDates.sort((a, b) => a - b);
    // Sort end dates in descending order (latest first)
    endDates.sort((a, b) => b - a);
    
    return {
      startDate: startDates.length > 0 ? startDates[0].toISOString().split('T')[0] : null,
      endDate: endDates.length > 0 ? endDates[0].toISOString().split('T')[0] : null
    };
  };
  
  const { startDate, endDate } = getDateRange();
  
  // Debug log for date range
  useEffect(() => {
    console.log(`Tournament date range for ${tournament.name}:`, { 
      startDate: formatDate(startDate), 
      endDate: formatDate(endDate) 
    });
  }, [startDate, endDate]);
  
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
        {banner ? (
          <img
            src={banner}
            alt="Tournament banner"
            className="w-full h-full object-cover"
            onError={(e) => {
              console.error("Failed to load banner image:", banner);
            }}
          />
        ) : (
          <div 
            className="w-full h-full flex items-center justify-center"
            style={{ backgroundColor: getColorFromName(tournament.name) }}
          >
            <p className="text-white font-semibold text-xl opacity-60">
              {(tournament.name || "Tournament").toUpperCase()}
            </p>
          </div>
        )}
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
          <div className="w-16 h-16 mr-4 bg-gray-100 rounded-lg overflow-hidden border border-gray-200 shadow-sm hover:shadow-lg transition-shadow duration-300">
            {logo ? (
              <img
                src={logo}
                alt="logo"
                className="w-full h-full object-contain"
                onError={(e) => {
                  console.error("Failed to load logo image:", logo);
                }}
              />
            ) : (
              <div 
                className="w-full h-full flex items-center justify-center"
                style={{ 
                  backgroundColor: getColorFromName(tournament.name),
                  fontSize: "calc(min(2.5rem, 8vw))",
                  fontWeight: 500,
                  color: "white"
                }}
              >
                <span>
                  {getInitial(tournament.name)}
                </span>
              </div>
            )}
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
              <span>{tournament.competition_type?.replace(/_/g, ' ') || tournament.rawData?.competition_type?.replace(/_/g, ' ') || "Team"}</span>
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
                <span className="font-medium">Tournament Period</span>
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
                <span className="text-gray-500">Earliest Start:</span>{" "}
                <span className="font-semibold">
                  {formatDate(startDate)}
                </span>
              </div>
              <div>
                <span className="text-gray-500">Latest End:</span>{" "}
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
