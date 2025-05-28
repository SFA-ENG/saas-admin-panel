import { Collapse, Tag } from "antd";
import { Trophy, ChevronDownIcon } from "../components/Icons";
import { getBgColor, getIconBgColor } from "../../Tournaments.helper";
import Event from "./Event";

const Sport = ({ sport, sportIndex }) => {
  const sportItem = {
    key: sport.sportsId || `sport-${sportIndex}`,
    label: (
      <div className="flex items-center">
        <div className={`${getIconBgColor(sport.name)} p-2 rounded-full mr-2`}>
          <Trophy size={16} />
        </div>
        <span className="font-semibold mr-2">{sport.name}</span>
        <Tag className="ml-2" color="blue">
          {sport.events ? sport.events.length : 0} events
        </Tag>
      </div>
    ),
    children: (
      <div className="space-y-3 pl-2">
        {sport.events && sport.events.length > 0 ? (
          sport.events.map((event, eventIndex) => (
            <div key={`event-wrapper-${event.eventId || eventIndex}`}>
              <Event event={event} eventIndex={eventIndex} />
            </div>
          ))
        ) : (
          <p className="text-gray-500">No events available for this sport.</p>
        )}
      </div>
    ),
    className: `mb-2 rounded-lg ${getBgColor(sportIndex)}`
  };

  return (
    <Collapse
      items={[sportItem]}
      className="bg-white rounded-lg shadow-sm border-0"
      bordered={false}
      expandIconPosition="end"
      defaultActiveKey={[]}
      expandIcon={({ isActive }) => (
        <ChevronDownIcon size={14} className={isActive ? "rotate-180" : ""} />
      )}
    />
  );
};

export default Sport; 