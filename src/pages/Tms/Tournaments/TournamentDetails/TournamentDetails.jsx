import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Card, Avatar, Collapse, Badge, Tabs, Tag, Empty } from "antd";
import {
  MapPinIcon,
  TrophyIcon,
  FlagIcon,
  ChevronDownIcon,
  InfoIcon,
  CheckCircleIcon,
  ClockIcon,
  TargetIcon,
  BookOpenIcon,
  Calendar,
  Award,
  Layers,
  User,
  Users,
  Medal,
  FileText,
} from "lucide-react";
import FullPageLoader from "Components/Loader/Loader";

// Mock data - in a real app, this would come from an API
const mockTournamentData = {
  sports: ["Athletics", "Badminton", "Swimming"],
  tenantId: "df04533a-4452-53e6-87d9-e1dabcef5d17",
  tournamentId: "02cd6655-3d94-4145-aa64-b65224fbd84b",
  type: "OPEN_REGISTRATION_TEAM",
  name: "National Youth Championship 2025",
  description:
    "An all-India inter-school championship featuring athletics, badminton, and swimming events.",
  status: "DRAFT",
  isPublished: false,
  isActive: true,
  medias: [
    {
      category: "IMAGE",
      usage: "LOGO",
      variant: "DESKTOP",
      url: "https://upload.wikimedia.org/wikipedia/commons/thumb/4/4f/Iconic_sports_logo.png/600px-Iconic_sports_logo.png",
      position: 1,
    },
    {
      category: "IMAGE",
      usage: "BANNER",
      variant: "MOBILE",
      url: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b",
      position: 2,
    },
  ],
  seasons: [
    {
      seasonId: "s1-2025-mumbai",
      name: "Mumbai Season 2025",
      description: "First season of the championship held in Mumbai.",
      medias: [
        {
          category: "IMAGE",
          usage: "LOGO",
          variant: "DESKTOP",
          url: "https://upload.wikimedia.org/wikipedia/commons/thumb/9/9a/Sports_event_logo.png/600px-Sports_event_logo.png",
          position: 1,
        },
        {
          category: "IMAGE",
          usage: "BANNER",
          variant: "MOBILE",
          url: "https://images.unsplash.com/photo-1600281031348-7c65a9093a0b",
          position: 2,
        },
      ],
      participationRules: {
        AND: [
          {
            field: "COUNTRY",
            operator: "=",
            value: "India",
          },
        ],
      },
      startDate: "2025-06-01",
      endDate: "2025-06-15",
      registrationStartDate: "2025-05-01",
      registrationEndDate: "2025-05-25",
      tenantId: "5a23f1d3-fd5e-5bb1-bbfa-41a2f45b4dc0",
      isPublished: false,
      isActive: true,
      locations: [
        {
          locationId: "loc-mumbai-01",
          name: "Mumbai",
          description: "Major sporting venue in Mumbai",
          type: "CITY",
          countryCode: "IN",
        },
      ],
      sports: [
        {
          sportsId: "sp-athletics",
          name: "Athletics",
          events: [
            {
              eventId: "ev-100m",
              name: "100m Dash",
              isActive: true,
              isPublished: false,
              status: "DRAFT",
              startDate: "2025-06-02",
              endDate: "2025-06-03",
              eventType: "INDIVIDUAL",
              categoryTree: {
                primary: "TRACK",
                secondary: "SPRINT",
                tertiary: null,
                quaternary: null,
              },
              subEvents: [
                {
                  subEventId: "sub-100m-m-u18",
                  name: "Men's U-18 100m",
                  description: "U-18 boys 100m dash",
                  participationRules: {
                    AND: [
                      { field: "GENDER", operator: "=", value: "MALE" },
                      { field: "AGE", operator: "<=", value: 18 },
                    ],
                  },
                  isActive: true,
                  isPublished: false,
                  status: "DRAFT",
                  teamMetadata: { maxPlayers: 1, minPlayers: 1 },
                  inventoryMetada: { total: 20, available: 20 },
                  gameFormat: "KNOCKOUT",
                },
                {
                  subEventId: "sub-100m-f-u18",
                  name: "Women's U-18 100m",
                  description: "U-18 girls 100m dash",
                  participationRules: {
                    AND: [
                      { field: "GENDER", operator: "=", value: "FEMALE" },
                      { field: "AGE", operator: "<=", value: 18 },
                    ],
                  },
                  isActive: true,
                  isPublished: false,
                  status: "DRAFT",
                  teamMetadata: { maxPlayers: 1, minPlayers: 1 },
                  inventoryMetada: { total: 20, available: 18 },
                  gameFormat: "KNOCKOUT",
                },
              ],
            },
            {
              eventId: "ev-long-jump",
              name: "Long Jump",
              isActive: true,
              isPublished: false,
              status: "DRAFT",
              startDate: "2025-06-04",
              endDate: "2025-06-05",
              eventType: "INDIVIDUAL",
              categoryTree: {
                primary: "FIELD",
                secondary: "JUMP",
                tertiary: "LONG_JUMP",
                quaternary: null,
              },
              subEvents: [
                {
                  subEventId: "sub-lj-m-u16",
                  name: "Men's U-16 Long Jump",
                  description: "Boys long jump event",
                  participationRules: {
                    AND: [
                      { field: "GENDER", operator: "=", value: "MALE" },
                      { field: "AGE", operator: "<=", value: 16 },
                    ],
                  },
                  isActive: true,
                  isPublished: false,
                  status: "DRAFT",
                  teamMetadata: { maxPlayers: 1, minPlayers: 1 },
                  inventoryMetada: { total: 12, available: 12 },
                  gameFormat: "LEAGUE",
                },
              ],
            },
          ],
        },
        {
          sportsId: "sp-badminton",
          name: "Badminton",
          events: [
            {
              eventId: "ev-bdm-team",
              name: "Team Badminton",
              isActive: true,
              isPublished: false,
              status: "DRAFT",
              startDate: "2025-06-06",
              endDate: "2025-06-08",
              eventType: "TEAM",
              categoryTree: {
                primary: "INDOOR",
                secondary: "RACKET_SPORTS",
                tertiary: "BADMINTON",
                quaternary: null,
              },
              subEvents: [
                {
                  subEventId: "sub-bdm-mix",
                  name: "Mixed Doubles",
                  description: "Mixed team doubles",
                  participationRules: {
                    AND: [{ field: "AGE", operator: "<=", value: 20 }],
                  },
                  isActive: true,
                  isPublished: false,
                  status: "DRAFT",
                  teamMetadata: { maxPlayers: 4, minPlayers: 2 },
                  inventoryMetada: { total: 10, available: 10 },
                  gameFormat: "ROUND_ROBIN",
                },
              ],
            },
          ],
        },
      ],
    },
    {
      seasonId: "s2-2025-delhi",
      name: "Delhi Season 2025",
      description: "Second season of the championship in Delhi.",
      medias: [],
      participationRules: {
        AND: [
          {
            field: "COUNTRY",
            operator: "=",
            value: "India",
          },
        ],
      },
      startDate: "2025-07-01",
      endDate: "2025-07-15",
      registrationStartDate: "2025-06-01",
      registrationEndDate: "2025-06-25",
      tenantId: "5a23f1d3-fd5e-5bb1-bbfa-41a2f45b4dc0",
      isPublished: false,
      isActive: true,
      locations: [
        {
          locationId: "loc-delhi-01",
          name: "Delhi",
          description: "National stadium in Delhi",
          type: "CITY",
          countryCode: "IN",
        },
      ],
      sports: [
        {
          sportsId: "sp-swimming",
          name: "Swimming",
          events: [
            {
              eventId: "ev-swim-50m",
              name: "50m Freestyle",
              isActive: true,
              isPublished: false,
              status: "DRAFT",
              startDate: "2025-07-02",
              endDate: "2025-07-03",
              eventType: "INDIVIDUAL",
              categoryTree: {
                primary: "WATER",
                secondary: "FREESTYLE",
                tertiary: null,
                quaternary: null,
              },
              subEvents: [
                {
                  subEventId: "sub-swim-m-u14",
                  name: "Boys U-14 50m",
                  description: "Freestyle swim for boys under 14",
                  participationRules: {
                    AND: [
                      { field: "GENDER", operator: "=", value: "MALE" },
                      { field: "AGE", operator: "<=", value: 14 },
                    ],
                  },
                  isActive: true,
                  isPublished: false,
                  status: "DRAFT",
                  teamMetadata: { maxPlayers: 1, minPlayers: 1 },
                  inventoryMetada: { total: 10, available: 10 },
                  gameFormat: "KNOCKOUT",
                },
              ],
            },
          ],
        },
      ],
    },
  ],
};

// Helper functions for formatting data
const formatDate = (dateString) => {
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};

const getStatusColor = (status) => {
  const statusColors = {
    DRAFT: "text-gray-800",
    ACTIVE: "bg-green-100 text-green-800",
    PUBLISHED: "bg-blue-100 text-blue-800",
    COMPLETED: "bg-purple-100 text-purple-800",
    CANCELLED: "bg-red-100 text-red-800",
  };
  return statusColors[status] || "bg-gray-100 text-gray-800";
};

const getFormatLabel = (format) => {
  const formatLabels = {
    KNOCKOUT: "Knockout",
    LEAGUE: "League",
    ROUND_ROBIN: "Round Robin",
  };
  return formatLabels[format] || format;
};

const getBgColor = (index) => {
  const colors = [
    "bg-blue-50",
    "bg-green-50",
    "bg-purple-50",
    "bg-yellow-50",
    "bg-red-50",
    "bg-indigo-50",
  ];
  return colors[index % colors.length];
};

const getCardColor = (index) => {
  const colors = [
    "border-l-4 border-blue-500",
    "border-l-4 border-green-500",
    "border-l-4 border-purple-500",
    "border-l-4 border-yellow-500",
    "border-l-4 border-red-500",
    "border-l-4 border-indigo-500",
  ];
  return colors[index % colors.length];
};

const getIconBgColor = (category) => {
  const categoryColors = {
    Athletics: "bg-red-100 text-red-600",
    Badminton: "bg-green-100 text-green-600",
    Swimming: "bg-blue-100 text-blue-600",
    TRACK: "bg-orange-100 text-orange-600",
    FIELD: "bg-yellow-100 text-yellow-600",
    INDOOR: "bg-indigo-100 text-indigo-600",
    WATER: "bg-cyan-100 text-cyan-600",
  };
  return categoryColors[category] || "bg-gray-100 text-gray-600";
};

const TournamentDetailsPage = () => {
  const { tournament_id } = useParams();
  const [loading, setLoading] = useState(true);
  const [tournament, setTournament] = useState(null);
  const [activeKey, setActiveKey] = useState(["overview"]);

  // In a real app, fetch the tournament data from an API
  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setTournament(mockTournamentData);
      setLoading(false);
    }, 30);
  }, [tournament_id]);

  if (loading) {
    return <FullPageLoader message="Loading tournament details..." />;
  }

  if (!tournament) {
    return (
      <div className="p-8 text-center">
        <Empty description="Tournament not found" />
      </div>
    );
  }

  // Find banner and logo
  const logo = tournament.medias.find((m) => m.usage === "LOGO")?.url;
  const banner = tournament.medias.find((m) => m.usage === "BANNER")?.url;

  return (
    <div className="tournament-details bg-gray-50 min-h-screen">
      {/* Banner */}
      <div
        className="w-full h-50 bg-cover bg-center relative mb-4"
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
                className="border-4 border-white shadow-lg mr-4"
              />
            )}
            <div>
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

      {/* Main Content */}
      <div>
        <Tabs
          type="card"
          activeKey={activeKey[0]}
          onChange={(key) => setActiveKey([key])}
          className="bg-white rounded-xl shadow-sm"
          items={[
            {
              key: "overview",
              label: (
                <span className="flex items-center">
                  <InfoIcon size={16} className="mr-1" /> Overview
                </span>
              ),
              children: (
                <div className="p-4">
                  <div className="mb-6 bg-blue-50 p-4 rounded-lg">
                    <h2 className="text-xl font-semibold text-blue-800 mb-2">
                      About the Tournament
                    </h2>
                    <p className="text-gray-700">{tournament.description}</p>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                      <div className="bg-white rounded-lg p-3 shadow-sm flex items-center">
                        <div className="bg-blue-100 p-2 rounded-lg mr-3">
                          <FileText size={18} className="text-blue-600" />
                        </div>
                        <div>
                          <p className="text-xs text-gray-500">Type:</p>
                          <p className="font-medium">
                            {tournament.type.replace(/_/g, " ")}
                          </p>
                        </div>
                      </div>

                      <div className="bg-white rounded-lg p-3 shadow-sm flex items-center">
                        <div className="bg-green-100 p-2 rounded-lg mr-3">
                          <CheckCircleIcon
                            size={18}
                            className="text-green-600"
                          />
                        </div>
                        <div>
                          <p className="text-xs text-gray-500">Status:</p>
                          <p className="font-medium">
                            {tournament.isActive ? "Active" : "Inactive"}
                          </p>
                        </div>
                      </div>

                      <div className="bg-white rounded-lg p-3 shadow-sm flex items-center">
                        <div className="bg-purple-100 p-2 rounded-lg mr-3">
                          <Globe size={18} className="text-purple-600" />
                        </div>
                        <div>
                          <p className="text-xs text-gray-500">Visibility:</p>
                          <p className="font-medium">
                            {tournament.isPublished
                              ? "Published"
                              : "Not Published"}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="seasons">
                    <h2 className="text-xl font-semibold text-gray-800 mb-4">
                      Seasons
                    </h2>
                    <div className="space-y-4">
                      {tournament.seasons.map((season, index) => (
                        <Card
                          key={season.seasonId}
                          className={`overflow-hidden ${getCardColor(index)}`}
                          title={
                            <div className="flex items-center justify-between">
                              <div className="flex items-center">
                                <Calendar
                                  className="mr-2 text-blue-600"
                                  size={18}
                                />
                                <span className="font-bold">{season.name}</span>
                              </div>
                              <Badge
                                count={season.isActive ? "Active" : "Inactive"}
                                style={{
                                  backgroundColor: season.isActive
                                    ? "#52c41a"
                                    : "#f5222d",
                                }}
                              />
                            </div>
                          }
                        >
                          <div className="p-1">
                            <p className="text-gray-600 mb-4">
                              {season.description}
                            </p>

                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3 mb-4">
                              <div className="bg-blue-50 p-3 rounded-lg">
                                <div className="flex items-center">
                                  <Calendar
                                    size={16}
                                    className="text-blue-600 mr-2"
                                  />
                                  <span className="text-sm font-medium text-gray-700">
                                    Season Dates
                                  </span>
                                </div>
                                <p className="mt-1 text-xs">
                                  {formatDate(season.startDate)} -{" "}
                                  {formatDate(season.endDate)}
                                </p>
                              </div>

                              <div className="bg-green-50 p-3 rounded-lg">
                                <div className="flex items-center">
                                  <ClockIcon
                                    size={16}
                                    className="text-green-600 mr-2"
                                  />
                                  <span className="text-sm font-medium text-gray-700">
                                    Registration
                                  </span>
                                </div>
                                <p className="mt-1 text-xs">
                                  {formatDate(season.registrationStartDate)} -{" "}
                                  {formatDate(season.registrationEndDate)}
                                </p>
                              </div>

                              <div className="bg-yellow-50 p-3 rounded-lg">
                                <div className="flex items-center">
                                  <MapPinIcon
                                    size={16}
                                    className="text-yellow-600 mr-2"
                                  />
                                  <span className="text-sm font-medium text-gray-700">
                                    Locations
                                  </span>
                                </div>
                                <div className="mt-1 flex flex-wrap gap-1">
                                  {season.locations.map((loc) => (
                                    <Tag key={loc.locationId} color="orange">
                                      {loc.name}
                                    </Tag>
                                  ))}
                                </div>
                              </div>

                              <div className="bg-purple-50 p-3 rounded-lg">
                                <div className="flex items-center">
                                  <FlagIcon
                                    size={16}
                                    className="text-purple-600 mr-2"
                                  />
                                  <span className="text-sm font-medium text-gray-700">
                                    Eligibility
                                  </span>
                                </div>
                                <div className="mt-1 text-xs">
                                  {season.participationRules.AND.map(
                                    (rule, idx) => (
                                      <div key={idx}>
                                        {rule.field}: {rule.operator}{" "}
                                        {rule.value}
                                      </div>
                                    )
                                  )}
                                </div>
                              </div>
                            </div>

                            {/* Sports Accordion */}
                            <Collapse
                              className="mt-4 bg-transparent border-0"
                              bordered={false}
                              expandIconPosition="end"
                              expandIcon={({ isActive }) => (
                                <ChevronDownIcon
                                  size={16}
                                  className={isActive ? "rotate-180" : ""}
                                />
                              )}
                            >
                              {season.sports.map((sport, sportIndex) => (
                                <Collapse.Panel
                                  key={sport.sportsId}
                                  header={
                                    <div className="flex items-center">
                                      <div
                                        className={`${getIconBgColor(
                                          sport.name
                                        )} p-2 rounded-full mr-2`}
                                      >
                                        <Trophy size={16} />
                                      </div>
                                      <span className="font-semibold mr-2">
                                        {sport.name}
                                      </span>
                                      <Tag className="ml-2" color="blue">
                                        {sport.events.length} events
                                      </Tag>
                                    </div>
                                  }
                                  className={`mb-2 rounded-lg ${getBgColor(
                                    sportIndex
                                  )}`}
                                >
                                  {/* Events */}
                                  <div className="space-y-3 pl-2">
                                    {sport.events.map((event, eventIndex) => (
                                      <Collapse
                                        key={event.eventId}
                                        className="bg-white rounded-lg shadow-sm border-0"
                                        bordered={false}
                                        expandIconPosition="end"
                                        expandIcon={({ isActive }) => (
                                          <ChevronDownIcon
                                            size={14}
                                            className={
                                              isActive ? "rotate-180" : ""
                                            }
                                          />
                                        )}
                                      >
                                        <Collapse.Panel
                                          key={event.eventId}
                                          header={
                                            <div className="flex items-center">
                                              <div
                                                className={`${getIconBgColor(
                                                  event.categoryTree.primary
                                                )} p-1.5 rounded-full mr-2`}
                                              >
                                                <TargetIcon size={14} />
                                              </div>
                                              <span className="font-medium mr-2">
                                                {event.name}
                                              </span>
                                              <Tag
                                                className="ml-2"
                                                color="cyan"
                                              >
                                                {event.eventType}
                                              </Tag>
                                            </div>
                                          }
                                          className="border border-gray-100"
                                        >
                                          <div className="pt-1 pb-2">
                                            <div className="text-xs text-gray-500 mb-2 grid grid-cols-2 md:grid-cols-4 gap-2">
                                              <div>
                                                <span className="font-medium">
                                                  Dates:
                                                </span>{" "}
                                                {formatDate(event.startDate)} -{" "}
                                                {formatDate(event.endDate)}
                                              </div>
                                              <div>
                                                <span className="font-medium">
                                                  Status:
                                                </span>{" "}
                                                {event.status}
                                              </div>
                                              <div>
                                                <span className="font-medium">
                                                  Type:
                                                </span>{" "}
                                                {event.eventType}
                                              </div>
                                              <div>
                                                <span className="font-medium">
                                                  Category:
                                                </span>{" "}
                                                {event.categoryTree.primary} -{" "}
                                                {event.categoryTree.secondary}
                                              </div>
                                            </div>

                                            {/* SubEvents */}
                                            <div className="mt-3">
                                              <p className="text-sm font-medium text-gray-700 mb-2">
                                                Sub-Events
                                              </p>
                                              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                                {event.subEvents.map(
                                                  (subEvent) => (
                                                    <div
                                                      key={subEvent.subEventId}
                                                      className="border border-gray-200 rounded-lg p-3 bg-white hover:shadow transition-shadow"
                                                    >
                                                      <div className="flex justify-between mb-2">
                                                        <h4 className="font-medium text-blue-800">
                                                          {subEvent.name}
                                                        </h4>
                                                        <Tag
                                                          color={
                                                            subEvent.isActive
                                                              ? "success"
                                                              : "default"
                                                          }
                                                        >
                                                          {subEvent.isActive
                                                            ? "Active"
                                                            : "Inactive"}
                                                        </Tag>
                                                      </div>

                                                      <p className="text-xs text-gray-600 mb-2">
                                                        {subEvent.description}
                                                      </p>

                                                      <div className="flex flex-wrap gap-2 mb-2">
                                                        <Tag color="purple">
                                                          <div className="flex items-center gap-1">
                                                            <Trophy size={12} />
                                                            <span>
                                                              {getFormatLabel(
                                                                subEvent.gameFormat
                                                              )}
                                                            </span>
                                                          </div>
                                                        </Tag>

                                                        <Tag color="green">
                                                          <div className="flex items-center gap-1">
                                                            <Users size={12} />
                                                            <span>
                                                              {
                                                                subEvent
                                                                  .teamMetadata
                                                                  .minPlayers
                                                              }
                                                              -
                                                              {
                                                                subEvent
                                                                  .teamMetadata
                                                                  .maxPlayers
                                                              }{" "}
                                                              players
                                                            </span>
                                                          </div>
                                                        </Tag>

                                                        <Tag color="blue">
                                                          <div className="flex items-center gap-1">
                                                            <BookOpenIcon
                                                              size={12}
                                                            />
                                                            <span>
                                                              {
                                                                subEvent
                                                                  .inventoryMetada
                                                                  .available
                                                              }
                                                              /
                                                              {
                                                                subEvent
                                                                  .inventoryMetada
                                                                  .total
                                                              }{" "}
                                                              spots
                                                            </span>
                                                          </div>
                                                        </Tag>
                                                      </div>

                                                      <div className="mt-2 border-t border-gray-100 pt-2">
                                                        <p className="text-xs font-medium text-gray-700">
                                                          Eligibility:
                                                        </p>
                                                        <div className="mt-1 text-xs text-gray-600">
                                                          {subEvent.participationRules.AND.map(
                                                            (rule, idx) => (
                                                              <div
                                                                key={idx}
                                                                className="flex items-center gap-1"
                                                              >
                                                                <FlagIcon
                                                                  size={10}
                                                                />
                                                                {rule.field}:{" "}
                                                                {rule.operator}{" "}
                                                                {rule.value}
                                                              </div>
                                                            )
                                                          )}
                                                        </div>
                                                      </div>
                                                    </div>
                                                  )
                                                )}
                                              </div>
                                            </div>
                                          </div>
                                        </Collapse.Panel>
                                      </Collapse>
                                    ))}
                                  </div>
                                </Collapse.Panel>
                              ))}
                            </Collapse>
                          </div>
                        </Card>
                      ))}
                    </div>
                  </div>
                </div>
              ),
            },
            {
              key: "stats",
              label: (
                <span className="flex items-center">
                  <BarChart size={16} className="mr-1" /> Statistics
                </span>
              ),
              children: (
                <div className="p-6">
                  <Card className="bg-gradient-to-br from-blue-50 to-indigo-50">
                    <h2 className="text-xl font-bold text-blue-800 mb-4">
                      Tournament Statistics
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <StatCard
                        icon={
                          <Calendar size={20} className="text-purple-600" />
                        }
                        bgColor="bg-purple-50"
                        title="Seasons"
                        value={tournament.seasons.length}
                      />

                      <StatCard
                        icon={<Award size={20} className="text-blue-600" />}
                        bgColor="bg-blue-50"
                        title="Sports"
                        value={tournament.sports.length}
                      />

                      <StatCard
                        icon={<Layers size={20} className="text-green-600" />}
                        bgColor="bg-green-50"
                        title="Total Events"
                        value={tournament.seasons.reduce(
                          (acc, s) =>
                            acc +
                            s.sports.reduce(
                              (acc2, sp) => acc2 + sp.events.length,
                              0
                            ),
                          0
                        )}
                      />

                      <StatCard
                        icon={<Medal size={20} className="text-yellow-600" />}
                        bgColor="bg-yellow-50"
                        title="Sub-Events"
                        value={tournament.seasons.reduce(
                          (acc, s) =>
                            acc +
                            s.sports.reduce(
                              (acc2, sp) =>
                                acc2 +
                                sp.events.reduce(
                                  (acc3, e) => acc3 + e.subEvents.length,
                                  0
                                ),
                              0
                            ),
                          0
                        )}
                      />

                      <StatCard
                        icon={<User size={20} className="text-red-600" />}
                        bgColor="bg-red-50"
                        title="Available Spots"
                        value={tournament.seasons.reduce(
                          (acc, s) =>
                            acc +
                            s.sports.reduce(
                              (acc2, sp) =>
                                acc2 +
                                sp.events.reduce(
                                  (acc3, e) =>
                                    acc3 +
                                    e.subEvents.reduce(
                                      (acc4, se) =>
                                        acc4 + se.inventoryMetada.available,
                                      0
                                    ),
                                  0
                                ),
                              0
                            ),
                          0
                        )}
                      />

                      <StatCard
                        icon={<MapPin size={20} className="text-indigo-600" />}
                        bgColor="bg-indigo-50"
                        title="Locations"
                        value={tournament.seasons.reduce(
                          (acc, s) => acc + s.locations.length,
                          0
                        )}
                      />
                    </div>
                  </Card>
                </div>
              ),
            },
          ]}
        />
      </div>
    </div>
  );
};

// Components
const StatCard = ({ icon, title, value, bgColor }) => (
  <div className="bg-white rounded-lg shadow-sm p-4 flex items-center">
    <div className={`${bgColor} p-3 rounded-lg mr-3`}>{icon}</div>
    <div>
      <p className="text-gray-600 text-sm">{title}</p>
      <p className="text-2xl font-bold text-gray-800">{value}</p>
    </div>
  </div>
);

const Trophy = ({ size, className }) => (
  <TrophyIcon size={size} className={className} />
);

const Globe = ({ size, className }) => (
  <div className={className}>
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="12" cy="12" r="10"></circle>
      <line x1="2" y1="12" x2="22" y2="12"></line>
      <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path>
    </svg>
  </div>
);

const BarChart = ({ size, className }) => (
  <div className={className}>
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <line x1="18" y1="20" x2="18" y2="10"></line>
      <line x1="12" y1="20" x2="12" y2="4"></line>
      <line x1="6" y1="20" x2="6" y2="14"></line>
      <line x1="2" y1="20" x2="22" y2="20"></line>
    </svg>
  </div>
);

const MapPin = ({ size, className }) => (
  <div className={className}>
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
      <circle cx="12" cy="10" r="3"></circle>
    </svg>
  </div>
);

export default TournamentDetailsPage;
