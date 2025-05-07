import { Card } from "antd";
import StatCard from "./StatCard";
import { Calendar, Award, Layers, User, Medal, MapPin } from "../components/Icons";

const StatsTab = ({ tournament }) => {
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
  );
};

export default StatsTab; 