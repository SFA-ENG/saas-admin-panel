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
import { getPascalCase } from "../../../helpers/common.helper";
import AddTournamentForm from "./_blocks/AddTournamentForm";
import { useApiQuery } from "hooks/useApiQuery/useApiQuery";
import { CACHE_KEYS } from "../../../commons/constants";

const TournamentsPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchQuery, setSearchQuery] = useState("");
  const [filters, setFilters] = useState({
    status: null,
    sports: null,
  });

  const [currentHash, setCurrentHash] = useState(location.hash);
  
  // Check if we're in the tournament creation mode
  const isAddingTournament = currentHash === "#new";
  
  // Check if we're in edit mode using URL search params
  const urlParams = new URLSearchParams(location.search);
  const isEditingTournament = urlParams.get('mode') === 'edit';
  const editingTournamentId = urlParams.get('id');
  
  // Get tournament data for editing from navigation state
  const editTournamentData = location.state?.tournamentData;

  const {
    data: tournamentsData,
    isFetching: tournamentsLoading,
    refetch: refetchTournaments,
  } = useApiQuery({
    queryKey: [CACHE_KEYS.TOURNAMENTS],
    url: "/tms/tournaments",
    params: {
      type: "DETAILED",
      page: 1,
      page_size: 100,
    }
  });

  // Extract tournaments and metadata from API response - updated to match actual API structure
  const tournaments = tournamentsData?.tournaments || [];
  const metadata = tournamentsData?.meta || {
    active_tournaments: 0,
    total_tournaments: 0,
    upcoming_tournaments: 0,
    filters: { status: [], sports: [] }
  };

  // Transform the tournaments to have the expected structure for rendering
  const transformedTournaments = tournaments.map(t => {
    // Extract all sports from all seasons
    const allSports = t.seasons?.flatMap(season => 
      season.sports?.map(sport => sport.name) || []
    ) || [];
    
    // Remove duplicates
    const uniqueSports = [...new Set(allSports)];
    
    return {
      tournamentId: t.tournament_id,
      tenantId: t.tenant_id,
      name: t.name,
      description: t.description,
      status: t.status,
      isActive: t.is_active,
      isPublished: t.is_published,
      // Add other fields as needed
      sports: uniqueSports,
      // Extract logo and banner if needed
      logo: t.medias?.find(m => m.usage === "LOGO")?.url,
      banner: t.medias?.find(m => m.usage === "BANNER")?.url,
      // Store original data for details page
      rawData: t
    };
  });

  const [filteredTournaments, setFilteredTournaments] = useState([]);

  const dataSource =
    filteredTournaments.length > 0 ||
    searchQuery ||
    filters.status ||
    filters.sports
      ? filteredTournaments
      : transformedTournaments;

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
    if (!transformedTournaments || transformedTournaments.length === 0) return;
    
    const q = searchQuery.trim().toLowerCase();
    const statusFilter = filters.status?.toLowerCase();
    const sportsFilter = filters.sports?.toLowerCase();

    const filtered = transformedTournaments.filter((t) => {
      // 1) Search
      if (q && !t.name.toLowerCase().includes(q)) {
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
  }, [searchQuery, filters, transformedTournaments]);

  const getFilters = (data) => {
    const filters = data.map((item) => {
      return {
        label: getPascalCase(item),
        value: item.toLowerCase(),
      };
    });
    return [{ label: "All", value: "ALL" }, ...filters];
  };


useEffect(() => {
  const handleHashChange = () => {
    const previousHash = currentHash;
    const newHash = window.location.hash;
    
    // Update the hash in state
    setCurrentHash(newHash);
    
    // If we're returning from tournament creation (hash changed from #new to empty)
    // then trigger a refetch of the tournaments data
    if (previousHash === "#new" && newHash === "") {
      refetchTournaments();
    }
  };

  window.addEventListener("hashchange", handleHashChange);

  return () => {
    window.removeEventListener("hashchange", handleHashChange);
  };
}, [currentHash, refetchTournaments]);

// Separate effect to handle edit mode navigation changes
useEffect(() => {
  // Refetch data when we return from edit mode (when query params are cleared)
  if (!isEditingTournament && location.search === "") {
    // Small delay to ensure navigation is complete
    const timeoutId = setTimeout(() => {
      refetchTournaments();
    }, 100);
    
    return () => clearTimeout(timeoutId);
  }
}, [isEditingTournament, location.search, refetchTournaments]);

  // Navigate to tournament add form
  const handleAddTournament = () => {
    // Clear any saved tournament data when starting fresh
    localStorage.removeItem('tournamentFormData');
    
    // Update the hash in the URL
    window.location.hash = "#new";
    // Also update the state directly to ensure a re-render
    setCurrentHash("#new");
  };

  // Cancel adding/editing tournament and return to list
  const handleCancelAdd = () => {
    if (isEditingTournament) {
      // For edit mode, navigate to tournaments without query params
      navigate("/tms/tournaments", { replace: true });
    } else {
      // For add mode, clear the hash
      window.location.hash = "";
      setCurrentHash("");
    }
    // Refresh tournaments data
    refetchTournaments();
  };

  if (tournamentsLoading) {
    return <FullPageLoader message="Loading tournaments ..." />;
  }

  // Show the AddTournamentForm if the hash is #new or #edit-{id}, otherwise show the tournament list
  if (isAddingTournament || isEditingTournament) {
    const isEditMode = isEditingTournament;
    const tournamentData = isEditMode ? editTournamentData : null;
    
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
                  {isEditMode ? "Edit Tournament" : "Add New Tournament"}
                </h1>
                <p className="text-gray-600">
                  {isEditMode 
                    ? "Update tournament details, seasons, sports, events, and sub-events" 
                    : "Create a new tournament with seasons, sports, events, and sub-events"
                  }
                </p>
              </div>
            </div>
          </Col>
          <Col>
            <Button
              type="default"
              className="bg-red-600 hover:bg-red-700 text-white p-4 rounded-lg"
              icon={<XCircle size={20} />}
              onClick={handleCancelAdd}
            >
              Cancel
            </Button>
          </Col>
        </Row>

        <AddTournamentForm 
          onCancel={handleCancelAdd} 
          refetchTournaments={refetchTournaments}
          editMode={isEditMode}
          tournamentId={editingTournamentId}
          tournamentData={tournamentData}
        />
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
            value: metadata.active_tournaments,
            bg: "bg-blue-100",
            color: "text-blue-600",
          },
          {
            icon: Calendar,
            label: "Upcoming",
            value: metadata.upcoming_tournaments,
            bg: "bg-green-100",
            color: "text-green-600",
          },
          {
            icon: Layers,
            label: "Total",
            value: metadata.total_tournaments,
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
                  opts: getFilters(metadata.filters.status),
                },
                {
                  key: "sports",
                  icon: Award,
                  opts: getFilters(metadata.filters.sports),
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
            <Col xs={24} sm={12} lg={8} key={t.tournamentId}>
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
