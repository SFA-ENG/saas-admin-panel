import { Collapse, Tag } from "antd";
import { ChevronDownIcon, TargetIcon } from "../components/Icons";
import { formatDate, getIconBgColor } from "../../Tournaments.helper";
import SubEvent from "./SubEvent";

const Event = ({ event, eventIndex }) => {
  const eventItems = [
    {
      key: event.eventId,
      label: (
        <div className="flex items-center">
          <div
            className={`${getIconBgColor(event.categoryTree.primary)} p-1.5 rounded-full mr-2`}
          >
            <TargetIcon size={14} />
          </div>
          <span className="font-medium mr-2">{event.name}</span>
          <Tag className="ml-2" color="cyan">
            {event.eventType}
          </Tag>
        </div>
      ),
      children: (
        <div className="pt-1 pb-2">
          <div className="text-xs text-gray-500 mb-2 grid grid-cols-2 md:grid-cols-4 gap-2">
            <div>
              <span className="font-medium">Dates:</span>{" "}
              {formatDate(event.startDate)} - {formatDate(event.endDate)}
            </div>
            <div>
              <span className="font-medium">Status:</span> {event.status}
            </div>
            <div>
              <span className="font-medium">Type:</span> {event.eventType}
            </div>
            <div>
              <span className="font-medium">Category:</span>{" "}
              {event.categoryTree.primary} - {event.categoryTree.secondary}
            </div>
          </div>

          {/* SubEvents */}
          <div className="mt-3">
            <p className="text-sm font-medium text-gray-700 mb-2">Sub-Events</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {event.subEvents.map((subEvent) => (
                <SubEvent key={subEvent.subEventId} subEvent={subEvent} />
              ))}
            </div>
          </div>
        </div>
      ),
      className: "border border-gray-100"
    }
  ];

  return (
    <Collapse
      items={eventItems}
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

export default Event; 