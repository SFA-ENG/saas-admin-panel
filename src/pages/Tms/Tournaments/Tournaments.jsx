import { useState, useEffect } from "react";
import { Row, Col, Space, Input, Select, Button, Tooltip, Card } from "antd";
import {
  Filter,
  Plus,
  Calendar,
  Award,
  TrendingUp,
  Layers,
  RefreshCw,
  XCircle,
} from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import AccessControlButton from "Components/AccessControlButton/AccessControlButton";
import TournamentCard from "./_blocks/TournamentCard";
import FullPageLoader from "Components/Loader/Loader";
import { tournaments as mockTournaments } from "../Tms.service";
import { getPascalCase } from "../../../helpers/common.helper";
import AddTournamentForm from "./_blocks/AddTournamentForm";

const TournamentsPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [tournaments, setTournaments] = useState(mockTournaments.tournaments);
  const [filteredTournaments, setFilteredTournaments] = useState([]);
  const [filters, setFilters] = useState({
    status: null,
    sports: null,
  });

  // Check if we're in the tournament creation mode
  const isAddingTournament = location.hash === "#new";

  const dataSource =
    filteredTournaments.length > 0 ||
    searchQuery ||
    filters.status ||
    filters.sports
      ? filteredTournaments
      : tournaments;

  const handleFilterChange = (value) => {
    setFilters((prev) => ({
      ...prev,
      ...value,
    }));
  };

  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
  };

  useEffect(() => {
    const q = searchQuery.trim().toLowerCase();
    const statusFilter = filters.status?.toLowerCase();
    const sportsFilter = filters.sports?.toLowerCase();

    const filtered = tournaments.filter((t) => {
      // 1) Search
      if (q && !t.tournament_name.toLowerCase().includes(q)) {
        return false;
      }
      // 2) Status
      if (
        statusFilter &&
        statusFilter !== "all" &&
        t.status.toLowerCase() !== statusFilter
      ) {
        return false;
      }
      // 3) Sports
      if (
        sportsFilter &&
        sportsFilter !== "all" &&
        !t.sports.some((s) => s.toLowerCase() === sportsFilter)
      ) {
        return false;
      }
      return true;
    });

    setFilteredTournaments(filtered);
  }, [searchQuery, filters, tournaments]);

  const getFilters = (data) => {
    const filters = data.map((item) => {
      return {
        label: getPascalCase(item),
        value: item.toLowerCase(),
      };
    });
    return [{ label: "All", value: "ALL" }, ...filters];
  };

  // Navigate to tournament add form
  const handleAddTournament = () => {
    navigate("#new");
  };

  // Cancel adding tournament and return to list
  const handleCancelAdd = () => {
    navigate("#");
  };

  if (loading) {
    return <FullPageLoader message="Loading tournaments ..." />;
  }

  // Show the AddTournamentForm if the hash is #new, otherwise show the tournament list
  if (isAddingTournament) {
    return (
      <Card style={{ backgroundColor: "#F9FAFB" }}>
        {/* Header & Cancel Button */}
        <Row
          justify="space-between"
          align="middle"
          gutter={[16, 16]}
          className="mb-4"
        >
          <Col xs={24} lg={16}>
            <div className="flex items-center">
              <div className="bg-blue-600 h-8 w-2 rounded mr-3"></div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900 mb-1">
                  Add New Tournament
                </h1>
                <p className="text-gray-600">
                  Create a new tournament with seasons, sports, events, and sub-events
                </p>
              </div>
            </div>
          </Col>
          <Col>
            <AccessControlButton
              type="default"
              title="Cancel"
              icon={XCircle}
              onClick={handleCancelAdd}
             
            >
              Cancel
            </AccessControlButton>
          </Col>
        </Row>

        <AddTournamentForm onCancel={handleCancelAdd} />
      </Card>
    );
  }

  return (
    <Card style={{ backgroundColor: "#F9FAFB" }}>
      {/* Header & Add Button */}
      <Row
        justify="space-between"
        align="middle"
        gutter={[16, 16]}
        className="mb-4"
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
          <AccessControlButton
            title="Add New Tournament"
            icon={Plus}
            onClick={handleAddTournament}
          />
        </Col>
      </Row>

      {/* Stats */}
      <Row gutter={[16, 16]} className="mb-4">
        {[
          {
            icon: TrendingUp,
            label: "Active",
            value: mockTournaments.metadata.active_tournaments,
            bg: "bg-blue-100",
            color: "text-blue-600",
          },
          {
            icon: Calendar,
            label: "Upcoming",
            value: mockTournaments.metadata.upcoming_tournaments,
            bg: "bg-green-100",
            color: "text-green-600",
          },
          {
            icon: Layers,
            label: "Total",
            value: mockTournaments.metadata.total_tournaments,
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
      <div className="mb-4 bg-white p-2 rounded-xl shadow-sm border border-gray-100">
        <Row gutter={[16, 16]} align="middle">
          <Col xs={24} md={8}>
            <Input
              placeholder="Search tournaments by name"
              onChange={handleSearch}
              value={searchQuery}
              className="pl-10 py-2 pr-3"
              style={{
                borderRadius: "10px",
                height: "46px",
                boxShadow: "0 2px 5px rgba(0, 0, 0, 0.05)",
                fontSize: "15px",
                border: "1px solid #e2e8f0",
              }}
              suffix={
                searchQuery ? (
                  <Tooltip title="Clear search">
                    <Button
                      type="text"
                      className="reset-btn flex items-center justify-center"
                      onClick={() => setSearchQuery("")}
                      style={{ width: "30px", height: "30px" }}
                      icon={<RefreshCw size={14} className="text-gray-500" />}
                    />
                  </Tooltip>
                ) : (
                  <Filter size={15} className="text-gray-400" />
                )
              }
            />
          </Col>
          <Col xs={24} md={16}>
            <Space wrap className="w-full md:justify-end justify-center">
              {[
                {
                  key: "status",
                  icon: Filter,
                  opts: getFilters(mockTournaments.metadata.filters.status),
                },
                {
                  key: "sports",
                  icon: Award,
                  opts: getFilters(mockTournaments.metadata.filters.sports),
                },
              ].map(({ key, icon: Icon, opts }) => (
                <Select
                  key={key}
                  onChange={(v) => handleFilterChange({ [key]: v })}
                  placeholder={getPascalCase(key)}
                  allowClear
                  size="large"
                  className="rounded-lg min-w-[160px]"
                  suffixIcon={<Icon size={16} />}
                  options={opts}
                />
              ))}
            </Space>
          </Col>
        </Row>
      </div>

      {/* Tournament Cards or Empty/Loading */}
      <Row gutter={[16, 16]}>
        {dataSource.length > 0 ? (
          dataSource.map((t) => (
            <Col xs={24} sm={12} lg={8} key={t.tournament_id}>
              <TournamentCard tournament={t} />
            </Col>
          ))
        ) : (
          <Col span={24} className="text-center py-8">
            <p className="text-gray-500">No tournaments found</p>
          </Col>
        )}
      </Row>
    </Card>
  );
};

export default TournamentsPage;
