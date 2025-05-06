import { useState, useEffect } from "react";
import { Row, Col, Space, Input, Select, Button, Tooltip, Card } from "antd";
import {
  Filter,
  Plus,
  Calendar,
  Users,
  Award,
  TrendingUp,
  Layers,
  RefreshCw,
} from "lucide-react";
import AccessControlButton from "Components/AccessControlButton/AccessControlButton";
import TournamentCard from "./_blocks/TournamentCard";
import FullPageLoader from "Components/Loader/Loader";
import { tournaments as mockTournaments } from "../Tms.service";

const TournamentsPage = () => {
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [tournaments, setTournaments] = useState([]);
  const [filteredTournaments, setFilteredTournaments] = useState([]);
  const [filters, setFilters] = useState({
    status: "all",
    sport: "all",
    genders: "all"
  });

  useEffect(() => {
    // Access the tournaments array from the mock data
    const tournamentsData = mockTournaments.tournaments;
    setTournaments(tournamentsData);
    setFilteredTournaments(tournamentsData);
  }, []);

  const handleFilterChange = (value, filterType) => {
    setFilters((prev) => ({
      ...prev,
      [filterType]: value,
    }));
  };

  const handleSearch = (e) => {
    const query = e.target.value;
    setSearchQuery(query);
    applyFilters(query);
  };

  const applyFilters = (searchText = searchQuery) => {
    const currentTournaments = tournaments;
  
    let filtered = [...currentTournaments];

    // Apply search filter
    if (searchText.length > 0) {
      filtered = filtered.filter((t) => 
        t.tournament_name.toLowerCase().includes(searchText.toLowerCase())
      );
    }

    // Apply status filter
    if (filters.status !== "all") {
      filtered = filtered.filter((t) => 
        t.status.toLowerCase() === filters.status.toLowerCase()
      );
    }

    // Apply gender filter
    if (filters.genders !== "all") {
      filtered = filtered.filter((t) => 
        t.genders.toLowerCase() === filters.genders.toLowerCase()
      );
    }
    
    // Apply sport filter
    if (filters.sport !== "all") {
      filtered = filtered.filter((t) => 
        t.sport_type.toLowerCase() === filters.sport.toLowerCase()
      );
    }

    setFilteredTournaments(filtered);
  };

  useEffect(() => {
    if (tournaments.length > 0) {
      applyFilters();
    }
  }, [filters, tournaments]);

  if (loading) {
    return <FullPageLoader message="Loading tournaments ..." />;
  }

  // Get unique values for filters from the actual data
  const getUniqueValues = (key) => {
    const values = new Set();
  
    tournaments.forEach((t) => {
      const val = t[key];
      if (Array.isArray(val)) {
        val.forEach((v) => values.add(v.toLowerCase()));
      } else if (typeof val === "string") {
        values.add(val.toLowerCase());
      }
    });
  
    return Array.from(values).map((value) => ({
      label: value.charAt(0).toUpperCase() + value.slice(1),
      value,
    }));
  };
  
  

  return (
    <Card style={{ backgroundColor: "#F9FAFB", maxWidth: "88vw", padding: "16px" }}>
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
            onClick={() => {}}
          />
        </Col>
      </Row>

      {/* Stats */}
      <Row gutter={[16, 16]} className="mb-4">
        {[
          {
            icon: TrendingUp,
            label: "Active",
            value: tournaments.filter(t => t.status === "active").length,
            bg: "bg-blue-100",
            color: "text-blue-600",
          },
          {
            icon: Calendar,
            label: "Upcoming",
            value: tournaments.filter(t => t.status === "upcoming").length,
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
                  opts: [
                    { label: "All Status", value: "all" },
                    ...getUniqueValues("status")
                  ],
                },
                {
                  key: "genders",
                  icon: Users,
                  opts: [
                    { label: "All Genders", value: "all" },
                    ...getUniqueValues("genders")
                  ],
                },
                {
                  key: "sport",
                  icon: Award,
                  opts: [
                    { label: "All Sports", value: "all" },
                    ...getUniqueValues("sport_type")
                  ],
                },
              ].map(({ key, icon: Icon, opts }) => (
                <Select
                  key={key}
                  defaultValue="all"
                  onChange={(v) => handleFilterChange(v, key)}
                  placeholder={key.charAt(0).toUpperCase() + key.slice(1)}
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
        {filteredTournaments.length > 0 ? (
          filteredTournaments.map((t) => (
            <Col xs={24} sm={12} lg={8} xxl={6} key={t.tournament_id}>
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
