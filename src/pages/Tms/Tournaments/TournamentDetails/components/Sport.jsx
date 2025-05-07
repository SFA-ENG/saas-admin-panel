import { Tag } from "antd";
import { Trophy } from "../components/Icons";
import { getBgColor, getIconBgColor } from "../../Tournaments.helper";
import Event from "./Event";

const Sport = ({ sport, sportIndex }) => {
  const sportItem = {
    key: sport.sportsId,
    label: (
      <div className="flex items-center">
        <div className={`${getIconBgColor(sport.name)} p-2 rounded-full mr-2`}>
          <Trophy size={16} />
        </div>
        <span className="font-semibold mr-2">{sport.name}</span>
        <Tag className="ml-2" color="blue">
          {sport.events.length} events
        </Tag>
      </div>
    ),
    children: (
      <div className="space-y-3 pl-2">
        {sport.events.map((event, eventIndex) => (
          <Event key={event.eventId} event={event} eventIndex={eventIndex} />
        ))}
      </div>
    ),
    className: `mb-2 rounded-lg ${getBgColor(sportIndex)}`
  };

  return sportItem;
};

export default Sport; 