import { Avatar, Badge } from "antd";
import { TrophyIcon } from "lucide-react";
import { getStatusColor } from "../../Tournaments.helper";

const TournamentBanner = ({ tournament }) => {
  // Find banner and logo
  const logo = tournament.medias.find((m) => m.usage === "LOGO")?.url;
  const banner = tournament.medias.find((m) => m.usage === "BANNER")?.url;

  return (
    <div
      className="w-full h-100 bg-cover bg-center relative mb-2"
      style={{
        backgroundImage: `url(${
          banner ||
          "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b"
        })`,
        backgroundSize: "cover",
      }}
    >
      <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/70 flex items-end">
        <div className="flex items-center p-6 text-white">
          {logo && (
            <Avatar
              src={logo}
              size={80}
              className="border-4 border-white shadow-lg"
            />
          )}
          <div className="ml-4">
            <h1 className="text-3xl font-bold mb-1">{tournament.name}</h1>
            <div className="flex items-center space-x-4">
              <span className="mr-4">
                <Badge
                  className={`${getStatusColor(tournament.status)}`}
                  count={tournament.status}
                />
              </span>
              <span className="flex items-center gap-1">
                <TrophyIcon size={16} />
                {tournament.sports.join(", ")}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TournamentBanner; 