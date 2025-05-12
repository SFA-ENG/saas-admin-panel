import { Tag } from "antd";
import { FlagIcon, Users, Trophy, BookOpenIcon } from "../components/Icons";
import { getFormatLabel } from "../../Tournaments.helper";

const SubEvent = ({ subEvent }) => {
  return (
    <div className="border border-gray-200 rounded-lg p-3 bg-white hover:shadow transition-shadow w-full">
      <div className="flex justify-between mb-2">
        <h4 className="font-medium text-blue-800">{subEvent.name}</h4>
        <Tag color={subEvent.isActive ? "success" : "default"}>
          {subEvent.isActive ? "Active" : "Inactive"}
        </Tag>
      </div>

      <p className="text-xs text-gray-600 mb-2">{subEvent.description}</p>

      <div className="flex flex-wrap gap-2 mb-2">
        <Tag color="purple">
          <div className="flex items-center gap-1">
            <Trophy size={12} />
            <span>{getFormatLabel(subEvent.gameFormat)}</span>
          </div>
        </Tag>

        <Tag color="green">
          <div className="flex items-center gap-1">
            <Users size={12} />
            <span>
              {subEvent.teamMetadata.minPlayers}-{subEvent.teamMetadata.maxPlayers}{" "}
              players
            </span>
          </div>
        </Tag>

        <Tag color="blue">
          <div className="flex items-center gap-1">
            <BookOpenIcon size={12} />
            <span>
              {subEvent.inventoryMetada.available}/{subEvent.inventoryMetada.total}{" "}
              spots
            </span>
          </div>
        </Tag>
      </div>

      <div className="mt-2 border-t border-gray-100 pt-2">
        <p className="text-xs font-medium text-gray-700">Eligibility:</p>
        <div className="mt-1 text-xs text-gray-600">
          {subEvent.participationRules.AND.map((rule, idx) => (
            <div key={idx} className="flex items-center gap-1">
              <FlagIcon size={10} />
              {rule.field}: {rule.operator} {rule.value}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SubEvent; 