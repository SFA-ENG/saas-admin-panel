import { Tag, Tooltip, Progress, Badge } from "antd";
import { FlagIcon, Users, Trophy, BookOpenIcon } from "../components/Icons";
import { getFormatLabel } from "../../Tournaments.helper";

const SubEvent = ({ subEvent }) => {
  // Render participation rules safely
  const renderParticipationRules = () => {
    if (!subEvent.participationRules || !subEvent.participationRules.AND || !Array.isArray(subEvent.participationRules.AND)) {
      return <div className="text-gray-500 italic">No eligibility rules specified</div>;
    }
    
    return subEvent.participationRules.AND.map((rule, idx) => (
      <Tooltip key={idx} title={`${rule.field} ${rule.operator} ${rule.value}`}>
        <div className="flex items-center gap-2 p-1.5 bg-gray-50 rounded-md hover:bg-gray-100 transition-colors">
          <FlagIcon size={12} className="text-blue-600" />
          <span>
            <span className="font-medium">{rule.field}:</span> {rule.operator} {rule.value}
          </span>
        </div>
      </Tooltip>
    ));
  };

  // Calculate occupancy percentage for Progress bar
  const calculateOccupancy = () => {
    if (!subEvent.inventoryMetada) return 0;
    const { available, total } = subEvent.inventoryMetada;
    return Math.round(((total - available) / total) * 100);
  };
  
  return (
    <div className="border border-gray-200 rounded-xl p-5 bg-white hover:shadow-md transition-all duration-300 w-full">
      <div className="flex justify-between items-center mb-3">
        <div className="flex items-center gap-2">
          <h3 className="font-semibold text-blue-800 text-lg m-0">{subEvent.name}</h3>
          <Badge 
            status={subEvent.isActive ? "success" : "default"} 
            text={<span className="text-sm">{subEvent.isActive ? "Active" : "Inactive"}</span>} 
          />
        </div>
        
        <Tag color={subEvent.isActive ? "success" : "default"} className="rounded-full px-3 py-1">
          {subEvent.isActive ? "Active" : "Inactive"}
        </Tag>
      </div>

      <p className="text-sm text-gray-600 mb-4">{subEvent.description}</p>

      {/* Info Cards Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
        <div className="bg-purple-50 rounded-lg p-3 border border-purple-100">
          <div className="flex items-center gap-2 mb-1.5">
            <Trophy size={16} className="text-purple-600" />
            <span className="font-medium text-purple-800">Format</span>
          </div>
          <div className="text-purple-900">{getFormatLabel(subEvent.gameFormat)}</div>
        </div>

        {subEvent.teamMetadata && (
          <div className="bg-green-50 rounded-lg p-3 border border-green-100">
            <div className="flex items-center gap-2 mb-1.5">
              <Users size={16} className="text-green-600" />
              <span className="font-medium text-green-800">Team Size</span>
            </div>
            <div className="text-green-900">
              {subEvent.teamMetadata.minPlayers}-{subEvent.teamMetadata.maxPlayers}{" "}
              players
            </div>
          </div>
        )}

        {subEvent.inventoryMetada && (
          <div className="bg-blue-50 rounded-lg p-3 border border-blue-100">
            <div className="flex items-center gap-2 mb-1.5">
              <BookOpenIcon size={16} className="text-blue-600" />
              <span className="font-medium text-blue-800">Availability</span>
            </div>
            <div className="text-blue-900 mb-1">
              {subEvent.inventoryMetada.available} of {subEvent.inventoryMetada.total} spots available
            </div>
            <Progress 
              percent={calculateOccupancy()} 
              size="small" 
              showInfo={false}
              strokeColor="#3b82f6"
              trailColor="#e0e7ff"
            />
          </div>
        )}
      </div>

      <div className="mt-4 border-t border-gray-200 pt-4">
        <h4 className="font-medium text-gray-800 mb-2 flex items-center gap-1">
          <FlagIcon size={14} className="text-blue-600" />
          Eligibility Criteria
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mt-2">
          {renderParticipationRules()}
        </div>
      </div>
    </div>
  );
};

export default SubEvent; 