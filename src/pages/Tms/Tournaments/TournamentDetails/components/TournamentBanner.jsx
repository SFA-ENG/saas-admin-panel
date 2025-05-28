import { Avatar, Badge } from "antd";
import { TrophyIcon } from "lucide-react";

const TournamentBanner = ({ tournament }) => {
  // Extract media URLs from the tournament data using the same approach as TournamentCard
  const getMediaUrls = () => {
    const mediaUrls = {
      logo: null,
      banner: null
    };
    
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
            mediaUrls.logo = media.url;
          } else if (media.usage.toUpperCase() === 'BANNER') {
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
            mediaUrls.logo = media.url;
          } else if (media.type.toLowerCase() === 'banner') {
            mediaUrls.banner = media.url;
          }
        }
        
        // Handle structure with "usage" field (uppercase)
        if (media.usage && media.url) {
          if (media.usage.toUpperCase() === 'LOGO') {
            mediaUrls.logo = media.url;
          } else if (media.usage.toUpperCase() === 'BANNER') {
            mediaUrls.banner = media.url;
          }
        }
      });
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
  
  // Get sports safely
  const sports = tournament.sports || [];

  return (
    <div
      className="w-full h-64 bg-cover bg-center relative mb-2"
      style={{
        backgroundImage: banner ? `url(${banner})` : 'none',
        backgroundSize: "cover",
        backgroundColor: !banner ? getColorFromName(tournament.name) : undefined,
      }}
    >
      {!banner && (
        <div className="absolute inset-0 flex items-center justify-center">
          <p className="text-white font-semibold text-2xl opacity-60">
            {(tournament.name || "Tournament").toUpperCase()}
          </p>
        </div>
      )}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/70 flex items-end">
        <div className="flex items-center p-6 text-white">
          {logo ? (
            <Avatar
              src={logo}
              size={80}
              className="border-4 border-white shadow-lg"
            />
          ) : (
            <div 
              className="w-20 h-20 bg-gray-200 rounded-full flex items-center justify-center border-4 border-white shadow-lg"
              style={{ 
                backgroundColor: getColorFromName(tournament.name),
                fontSize: "calc(min(2rem, 8vw))",
                fontWeight: 500,
                color: "white"
              }}
            >
              <span>
                {getInitial(tournament.name)}
              </span>
            </div>
          )}
          <div className="ml-4">
            <h1 className="text-3xl font-bold mb-1">{tournament.name}</h1>
            <div className="flex items-center space-x-4">
              <span className="mr-4">
                <Badge
                  // className={`${getStatusColor(tournament.status)}`}
                  count={tournament.status}
                />
              </span>
              <span className="flex items-center gap-1">
                <TrophyIcon size={16} />
                {sports.join(", ")}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TournamentBanner; 