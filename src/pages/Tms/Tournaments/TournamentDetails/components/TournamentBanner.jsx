import { Avatar, Badge } from "antd";
import { TrophyIcon } from "lucide-react";

const TournamentBanner = ({ tournament }) => {
  // Get media URLs directly or through getMediaUrl function
  const bannerUrl = tournament.banner || getMediaUrl("BANNER");
  const logoUrl = tournament.logo || getMediaUrl("LOGO");
  
  // Check if medias exists before trying to find properties
  function getMediaUrl(usage) {
    // First check if medias array exists directly
    if (tournament.medias && Array.isArray(tournament.medias)) {
      const mediaItem = tournament.medias.find((m) => m.usage === usage);
      if (mediaItem) return mediaItem.url;
    }
    
    // Check if medias exists in rawData
    if (tournament.rawData && tournament.rawData.medias && Array.isArray(tournament.rawData.medias)) {
      const mediaItem = tournament.rawData.medias.find((m) => m.usage === usage);
      if (mediaItem) return mediaItem.url;
    }
    
    // Default fallbacks
    if (usage === "LOGO") return "https://placehold.co/100/e2e8f0/64748b?text=Logo";
    if (usage === "BANNER") return "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b";
    
    return null;
  }
  
  // Get sports safely
  const sports = tournament.sports || [];

  return (
    <div
      className="w-full h-64 bg-cover bg-center relative mb-2"
      style={{
        backgroundImage: `url(${bannerUrl})`,
        backgroundSize: "cover",
      }}
    >
      <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/70 flex items-end">
        <div className="flex items-center p-6 text-white">
          {logoUrl && (
            <Avatar
              src={logoUrl}
              size={80}
              className="border-4 border-white shadow-lg"
            />
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