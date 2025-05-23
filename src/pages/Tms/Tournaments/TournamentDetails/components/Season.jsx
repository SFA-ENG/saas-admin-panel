import { Card, Badge, Tag } from "antd";
import { Calendar, ClockIcon, MapPinIcon, FlagIcon } from "../components/Icons";
import { formatDate, getCardColor } from "../../Tournaments.helper";
import Sport from "./Sport";

const Season = ({ season, index }) => {
  // No need to map sports to sportItems anymore, we'll render them directly
  
  // Render participation rules safely
  const renderParticipationRules = () => {
    if (!season.participationRules || !season.participationRules.AND || !Array.isArray(season.participationRules.AND)) {
      return <span className="text-gray-500">No eligibility rules specified</span>;
    }
    
    return season.participationRules.AND.map((rule, idx) => (
      <div key={idx}>
        {rule.field}: {rule.operator} {rule.value}
      </div>
    ));
  };

  return (
    <Card
      key={season.seasonId}
      className={`overflow-hidden ${getCardColor(index)}`}
      title={
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <Calendar className="mr-2 text-blue-600" size={18} />
            <span className="font-bold">{season.name}</span>
          </div>
          <Badge
            count={season.isActive ? "Active" : "Inactive"}
            style={{
              backgroundColor: season.isActive ? "#52c41a" : "#f5222d",
            }}
          />
          <div className="bg-blue-50 p-2 rounded-lg">
            <div className="flex items-center">
              <Calendar size={16} className="text-blue-600 mr-2" />
              <span className="text-sm font-medium text-gray-700 mr-2">
                Season Dates:
              </span>
              <span className="mt-1 text-xs">
              {formatDate(season.startDate)} - {formatDate(season.endDate)}
            </span>
            </div>
            
          </div>
        </div>
      }
    >
      
      <div className="p-1">
        <p className="text-gray-600 mb-4">{season.description}</p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3 mb-4">
          <div className="bg-green-50 p-3 rounded-lg">
            <div className="flex items-center">
              <ClockIcon size={16} className="text-green-600 mr-2" />
              <span className="text-sm font-medium text-gray-700 mr-2">
                Registration:
              </span>
              <span className="mt-1 text-xs">
              {formatDate(season.registrationStartDate)} -{" "}
              {formatDate(season.registrationEndDate)}
            </span>
            </div>
           
          </div>

          <div className="bg-yellow-50 p-3 rounded-lg">
            <div className="flex items-center">
              <MapPinIcon size={16} className="text-yellow-600 mr-2" />
              <span className="text-sm font-medium text-gray-700 mr-2">
                Locations:
              </span>
              <div className="mt-1 flex flex-wrap gap-1">
              {(season.locations || []).map((loc) => (
                <Tag key={loc.locationId} color="orange">
                  {loc.name}
                </Tag>
              ))}
            </div>
            </div>
            
          </div>

          <div className="bg-purple-50 p-3 rounded-lg">
            <div className="flex items-center">
              <FlagIcon size={16} className="text-purple-600 mr-2" />
              <span className="text-sm font-medium text-gray-700 mr-2">
                Eligibility:
              </span>
              <div className="mt-1 text-xs">
                {renderParticipationRules()}
              </div>
            </div>
            
          </div>
        </div>

        {/* Sports - Direct rendering */}
        <div className="mt-4 space-y-3">
          <h3 className="text-lg font-semibold text-blue-800 mb-3">Sports</h3>
          {season.sports && season.sports.length > 0 ? (
            season.sports.map((sport, sportIndex) => (
              <Sport key={sport.sportsId || `sport-${sportIndex}`} sport={sport} sportIndex={sportIndex} />
            ))
          ) : (
            <p className="text-gray-500">No sports available for this season.</p>
          )}
        </div>
      </div>
    </Card>
  );
};

export default Season; 