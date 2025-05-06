import { Badge, Space, Tag, Tooltip, Carousel } from "antd";
import { Calendar, Eye, MapPin, Star, Users } from "lucide-react";
import { useNavigate } from "react-router-dom";

const TournamentCard = ({ tournament }) => {
  const navigate = useNavigate();
  const getStatusColor = (status) => {
    switch (status) {
      case "upcoming":
        return "bg-blue-500";
      case "active":
        return "bg-green-500";
      case "completed":
        return "bg-gray-500";
      default:
        return "bg-gray-300";
    }
  };

  // Format date in human-readable format
  const formatDate = (dateString) => {
    const options = { year: "numeric", month: "short", day: "numeric" };
    return new Date(dateString).toLocaleDateString("en-US", options);
  };

  const banners = tournament.tournament_configuration.league_banner || [];
  const defaultBanner = "https://static.vecteezy.com/system/resources/thumbnails/020/919/577/small_2x/sports-background-international-sports-day-illustration-graphic-design-for-the-decoration-of-gift-certificates-banners-and-flyer-free-vector.jpg";

  return (
    <div className="bg-white rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 border border-gray-100">
      {/* Banner */}
      <div className="relative w-full h-44 overflow-hidden">
        {banners.length > 1 ? (
          <div className="w-full h-full overflow-hidden">
            <Carousel 
              autoplay 
              className="tournament-carousel"
              dots={false}
            >
              {banners.map((banner, index) => (
                <div key={index} className="w-full h-44 overflow-hidden">
                  <img
                    src={banner.web}
                    alt={`banner-${index + 1}`}
                    className="w-full h-full object-cover overflow-hidden"
                    onError={(e) => {
                      e.target.src = defaultBanner;
                    }}
                  />
                </div>
              ))}
            </Carousel>
          </div>
        ) : (
          <div className="w-full h-full overflow-hidden">
            <img
              src={banners[0]?.web || defaultBanner}
              alt="banner"
              className="w-full h-full object-cover"
              onError={(e) => {
                e.target.src = defaultBanner;
              }}
            />
          </div>
        )}
        <Badge
          count={tournament.status}
          className={`absolute top-3 right-3 text-xs font-semibold rounded-full text-white px-3 py-1 capitalize ${getStatusColor(
            tournament.status
          )}`}
        />
        {tournament.featured && (
          <Tooltip title="Featured">
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
              src={tournament.tournament_configuration.league_logo.web}
              alt="logo"
              className="w-full h-full object-contain"
              onError={(e) => {
                e.target.src =
                  "https://placehold.co/100/e2e8f0/64748b?text=Logo";
              }}
            />
          </div>
          <div className="flex-grow">
            <h3 className="text-xl font-semibold text-gray-900 line-clamp-1">
              {tournament.tournament_name}
            </h3>
            <div className="flex items-center mt-2 text-sm text-gray-600">
              <MapPin size={14} className="mr-1" />
              <span>{tournament.location}</span>
              <span className="mx-2">•</span>
              <Users size={14} className="mr-1" />
              <span>{tournament.participants} teams</span>
            </div>
            <p className="text-sm text-gray-500 line-clamp-2 mt-2">
              {tournament.tournament_description}
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
              <Tag
                color={tournament.status === "completed" ? "default" : "blue"}
              >
                {tournament.sport_type}
              </Tag>
            </div>
            <div className="flex items-center justify-between text-sm text-gray-700 flex-wrap gap-2">
              <div>
                <span className="text-gray-500">Start:</span>{" "}
                <span className="font-semibold">
                  {formatDate(tournament.start_date)}
                </span>
              </div>
              <div>
                <span className="text-gray-500">End:</span>{" "}
                <span className="font-semibold">
                  {formatDate(tournament.end_date)}
                </span>
              </div>
            </div>
          </div>

          <div className="flex justify-between items-center">
            <Badge
              color={tournament.is_active ? "green" : "red"}
              text={tournament.is_active ? "Active" : "Inactive"}
            />
            <button
              className="bg-blue-500 text-white px-2 py-1 rounded-md hover:bg-blue-900 transition-colors cursor-pointer"
              onClick={() => {
                navigate(`/tms/tournaments/${tournament.tournament_id}`);
              }}
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
