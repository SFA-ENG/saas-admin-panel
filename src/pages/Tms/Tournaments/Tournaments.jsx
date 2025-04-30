import { useState } from "react";
import {
  Row,
  Col,
  Space,
  Input,
  Select,
  Badge,
  Button,
  Spin,
  Empty,
  Tag,
  Tooltip,
  Card,
} from "antd";
import {
  Filter,
  Plus,
  Calendar,
  Users,
  Award,
  ChevronDown,
  Eye,
  Star,
  TrendingUp,
  MapPin,
  Layers,
} from "lucide-react";
import { SearchOutlined } from "@ant-design/icons";
import { tournaments } from "../Tms.service";

const TournamentsPage = () => {
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [filters, setFilters] = useState({
    status: "all",
    year: "all",
    gender: "all",
    sport: "all",
  });

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

  const handleFilterChange = (value, filterType) => {
    setFilters((prev) => ({
      ...prev,
      [filterType]: value,
    }));
  };

  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
  };

  // Format date in human-readable format
  const formatDate = (dateString) => {
    const options = { year: "numeric", month: "short", day: "numeric" };
    return new Date(dateString).toLocaleDateString("en-US", options);
  };

  const TournamentCard = ({ tournament }) => (
    <div className="bg-white rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 border border-gray-100">
      {/* Banner */}
      <div className="relative h-44 overflow-hidden">
        <img
          src={tournament.tournament_configuration.league_banner.web}
          alt="banner"
          className="w-full h-full object-cover"
          onError={(e) => {
            e.target.src =
              "https://placehold.co/600x400/e2e8f0/64748b?text=Banner";
          }}
        />
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
            <div className="flex items-center justify-between">
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
            <div className="flex items-center justify-between text-sm text-gray-700">
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
            <Button
              type="primary"
              size="middle"
              className="flex items-center bg-gradient-to-r from-blue-500 to-blue-600 border-0 hover:from-blue-600 hover:to-blue-700 transition-all"
            >
              <Space>
                <Eye size={14} />
                View Seasons
                <ChevronDown size={12} />
              </Space>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <Card style={{ backgroundColor: "#F9FAFB" }}>
      {/* Header & Add Button */}
      <Row
        justify="space-between"
        align="middle"
        gutter={[16, 16]}
        className="mb-6"
      >
        <Col xs={24} lg={16}>
          <div className="flex items-center">
            <div className="bg-blue-600 h-8 w-2 rounded mr-3"></div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900 mb-1">
                Tournaments
              </h1>
              <p className="text-gray-600">
                Manage all your sports tournaments in one place
              </p>
            </div>
          </div>
        </Col>
        <Col>
          <button
            type="button"
            className="relative flex items-center px-3 py-2 text-lg font-normal text-white bg-gray-800 rounded-full overflow-hidden group transition-all duration-300 ease-in-out focus:outline-none transform hover:scale-105"
          >
            {/* gradient reveal */}
            <span className="absolute inset-0 bg-gradient-to-r from-indigo-500 via-purple-600 to-pink-500 transform scale-x-0 group-hover:scale-x-110 opacity-0 group-hover:opacity-100 transition-all duration-500 ease-in-out"></span>

            <span className="relative z-10 flex items-center">
              <Plus size={18} className="mr-1" />
              Add New Tournament
            </span>
          </button>
        </Col>
      </Row>

      {/* Stats */}
      <Row gutter={[16, 16]} className="mb-6">
        {[
          {
            icon: TrendingUp,
            label: "Active",
            value: 3,
            bg: "bg-blue-100",
            color: "text-blue-600",
          },
          {
            icon: Calendar,
            label: "Upcoming",
            value: 3,
            bg: "bg-green-100",
            color: "text-green-600",
          },
          {
            icon: Layers,
            label: "Total",
            value: tournaments.length,
            bg: "bg-purple-100",
            color: "text-purple-600",
          },
        ].map(({ icon: Icon, label, value, bg, color }) => (
          <Col xs={24} sm={8} key={label}>
            <div className="flex items-center bg-white p-2 rounded-lg shadow-sm">
              <div className={`${bg} p-2 rounded-lg mr-3`}>
                <Icon size={20} className={color} />
              </div>
              <div className="flex flex-row justify-between gap-3 items-center">
                <p className="text-gray-500 text-sm">{label} Tournaments:</p>
                <h3 className="text-xl font-bold text-gray-800">{value}</h3>
              </div>
            </div>
          </Col>
        ))}
      </Row>

      {/* Search & Filters */}
      <div className="mb-6 bg-white p-5 rounded-xl shadow-sm border border-gray-100">
        <Row gutter={[16, 16]} align="middle">
          <Col xs={24} md={8}>
            <Input.Search
              enterButton
              size="middle"
              prefix={<SearchOutlined className="text-gray-400" />}
              placeholder="Search tournaments..."
              value={searchQuery}
              onChange={handleSearch}
              className="w-full rounded-lg focus:border-blue-500"
            />
          </Col>
          <Col xs={24} md={16}>
            <Space wrap className="w-full justify-end">
              {[
                {
                  key: "status",
                  icon: Filter,
                  opts: [
                    { label: "All Status", value: "all" },
                    { label: "Upcoming", value: "upcoming" },
                    { label: "Active", value: "active" },
                    { label: "Completed", value: "completed" },
                  ],
                },
                {
                  key: "year",
                  icon: Calendar,
                  opts: [
                    { label: "All Years", value: "all" },
                    { label: "2024", value: "2024" },
                    { label: "2023", value: "2023" },
                    { label: "2022", value: "2022" },
                  ],
                },
                {
                  key: "gender",
                  icon: Users,
                  opts: [
                    { label: "All Genders", value: "all" },
                    { label: "Male", value: "male" },
                    { label: "Female", value: "female" },
                    { label: "Mixed", value: "mixed" },
                  ],
                },
                {
                  key: "sport",
                  icon: Award,
                  opts: [
                    { label: "All Sports", value: "all" },
                    { label: "Cricket", value: "cricket" },
                    { label: "Football", value: "football" },
                    { label: "Basketball", value: "basketball" },
                    { label: "Tennis", value: "tennis" },
                    { label: "Badminton", value: "badminton" },
                    { label: "Hockey", value: "hockey" },
                    { label: "Swimming", value: "swimming" },
                  ],
                },
              ].map(({ key, icon: Icon, opts }) => (
                <Select
                  key={key}
                  defaultValue="all"
                  onChange={(v) => handleFilterChange(v, key)}
                  placeholder={key.charAt(0).toUpperCase() + key.slice(1)}
                  size="large"
                  className="rounded-lg min-w-[140px]"
                  suffixIcon={<Icon size={16} />}
                  options={opts}
                />
              ))}
            </Space>
          </Col>
        </Row>
      </div>

      {/* Tournament Cards or Empty/Loading */}
      {loading ? (
        <div className="flex justify-center items-center h-64 bg-white rounded-xl shadow-sm p-8">
          <Spin size="large" />
        </div>
      ) : tournaments.length > 0 ? (
        <Row gutter={[20, 20]}>
          {tournaments.map((t) => (
            <Col xs={24} sm={12} lg={8} xxl={6} key={t.tournament_id}>
              <TournamentCard tournament={t} />
            </Col>
          ))}
        </Row>
      ) : (
        <div className="flex flex-col items-center justify-center h-64 bg-white p-8 rounded-xl shadow-sm">
          <Empty description="No tournaments found" />
          <button
            type="button"
            className="mt-6 relative flex items-center justify-center px-6 py-3 text-lg font-semibold text-white bg-gray-800 rounded-full overflow-hidden group transition-all duration-300 ease-in-out"
          >
            <span className="absolute inset-0 bg-gradient-to-r from-indigo-500 to-blue-500 transform scale-x-0 group-hover:scale-x-100 opacity-0 group-hover:opacity-100 transition-all duration-500 ease-in-out"></span>
            <span className="relative z-10 flex items-center">
              <Plus size={16} className="mr-2" />
              Add Your First Tournament
            </span>
          </button>
        </div>
      )}
    </Card>
  );
};

export default TournamentsPage;
