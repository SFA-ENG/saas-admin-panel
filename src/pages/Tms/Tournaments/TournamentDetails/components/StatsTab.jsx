import { Card } from "antd";
import StatCard from "./StatCard";
import { Calendar, Award, Layers, User, Medal, MapPin } from "../components/Icons";

const StatsTab = ({ tournament }) => {
  // Make sure we have the seasons data regardless of source format
  const getSeasons = () => {
    return tournament.seasons || tournament.rawData?.seasons || [];
  };
  
  // Make sure we have the sports data regardless of source format
  const getSports = () => {
    return tournament.sports || [];
  };
  
  // Helper function to safely calculate total events
  const calculateTotalEvents = () => {
    const seasons = getSeasons();
    if (!seasons || seasons.length === 0) return 0;
    
    return seasons.reduce(
      (acc, s) => {
        if (!s.sports) return acc;
        return acc + s.sports.reduce(
          (acc2, sp) => acc2 + (sp.events ? sp.events.length : 0),
          0
        );
      },
      0
    );
  };

  // Helper function to safely calculate sub-events
  const calculateSubEvents = () => {
    const seasons = getSeasons();
    if (!seasons || seasons.length === 0) return 0;
    
    return seasons.reduce(
      (acc, s) => {
        if (!s.sports) return acc;
        return acc + s.sports.reduce(
          (acc2, sp) => {
            if (!sp.events) return acc2;
            return acc2 + sp.events.reduce(
              (acc3, e) => acc3 + (e.subEvents ? e.subEvents.length : 0),
              0
            );
          },
          0
        );
      },
      0
    );
  };

  // Helper function to safely calculate available spots
  const calculateAvailableSpots = () => {
    const seasons = getSeasons();
    if (!seasons || seasons.length === 0) return 0;
    
    return seasons.reduce(
      (acc, s) => {
        if (!s.sports) return acc;
        return acc + s.sports.reduce(
          (acc2, sp) => {
            if (!sp.events) return acc2;
            return acc2 + sp.events.reduce(
              (acc3, e) => {
                if (!e.subEvents) return acc3;
                return acc3 + e.subEvents.reduce(
                  (acc4, se) => acc4 + (se.inventoryMetada ? se.inventoryMetada.available : 0),
                  0
                );
              },
              0
            );
          },
          0
        );
      },
      0
    );
  };

  // Helper function to safely calculate locations
  const calculateLocations = () => {
    const seasons = getSeasons();
    if (!seasons || seasons.length === 0) return 0;
    
    return seasons.reduce(
      (acc, s) => acc + (s.locations ? s.locations.length : 0),
      0
    );
  };

  return (
    <div className="p-6">
      <Card className="bg-gradient-to-br from-blue-50 to-indigo-50">
        <h2 className="text-xl font-bold text-blue-800 mb-4">
          Tournament Statistics
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <StatCard
            icon={<Calendar size={20} className="text-purple-600" />}
            bgColor="bg-purple-50"
            title="Seasons"
            value={getSeasons().length}
          />

          <StatCard
            icon={<Award size={20} className="text-blue-600" />}
            bgColor="bg-blue-50"
            title="Sports"
            value={getSports().length}
          />

          <StatCard
            icon={<Layers size={20} className="text-green-600" />}
            bgColor="bg-green-50"
            title="Total Events"
            value={calculateTotalEvents()}
          />

          <StatCard
            icon={<Medal size={20} className="text-yellow-600" />}
            bgColor="bg-yellow-50"
            title="Sub-Events"
            value={calculateSubEvents()}
          />

          <StatCard
            icon={<User size={20} className="text-red-600" />}
            bgColor="bg-red-50"
            title="Available Sports"
            value={calculateAvailableSpots()}
          />

          <StatCard
            icon={<MapPin size={20} className="text-indigo-600" />}
            bgColor="bg-indigo-50"
            title="Locations"
            value={calculateLocations()}
          />
        </div>
      </Card>
    </div>
  );
};

export default StatsTab; 