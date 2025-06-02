import { Collapse, Tag, Button, Tooltip } from "antd";
import { ChevronDownIcon, TargetIcon, Trash2 } from "../components/Icons";
import { formatDate, getIconBgColor } from "../../Tournaments.helper";
import SubEvent from "./SubEvent";
import { useDeleteEntity } from "../hooks/useDeleteEntity";
import { useParams } from "react-router-dom";

const Event = ({ event, eventIndex }) => {
  const { tournament_id: tournamentId } = useParams();
  const { handleDelete, isDeleting } = useDeleteEntity(tournamentId);

  try {
    // Handle potential undefined or missing data
    if (!event || !event.eventId) {
      return null;
    }

    // Safely access categoryTree or provide default
    const primaryCategory = event.categoryTree?.primary || "Individual";
    const secondaryCategory = event.categoryTree?.secondary || "";

    // Get appropriate background color for categoryTree
    const bgColorClass = getIconBgColor(primaryCategory);

    const eventItems = [
      {
        key: event.eventId,
        label: (
          <div className="flex items-center justify-between w-full">
            <div className="flex items-center">
              <div
                className={`${bgColorClass} p-1.5 rounded-full mr-2`}
              >
                <TargetIcon size={14} />
              </div>
              {Object.entries(event.categoryTree || {}).map(
                ([key, value]) =>
                  value && (
                    <span key={key} className="font-medium mr-2">
                      {value}
                    </span>
                  )
              )}
              <Tag className="ml-2" color="cyan">
                {event.eventType}
              </Tag>
            </div>
            <Tooltip title="Delete Event">
              <Button
                type="text"
                danger
                shape="circle"
                icon={<Trash2 size={14} />}
                loading={isDeleting}
                onClick={(e) => {
                  e.stopPropagation(); // Prevent collapse toggle
                  handleDelete('event', event.name || 'Event');
                }}
                className="hover:bg-red-50"
              />
            </Tooltip>
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
                <span className="font-medium">Status:</span> {event.status || "Unknown"}
              </div>
              <div>
                <span className="font-medium">Type:</span> {event.eventType || "Unknown"}
              </div>
              <div>
                <span className="font-medium">Category:</span>{" "}
                {primaryCategory} {secondaryCategory ? `- ${secondaryCategory}` : ""}
              </div>
            </div>

            {/* SubEvents */}
            <div className="mt-3">
              <p className="text-sm font-medium text-gray-700 mb-2">Sub-Events</p>
              <div className="grid grid-cols-1 gap-3">
                {event.subEvents && event.subEvents.length > 0 ? (
                  event.subEvents.map((subEvent) => (
                    <SubEvent key={subEvent.subEventId} subEvent={subEvent} />
                  ))
                ) : (
                  <p className="text-gray-500">No sub-events available.</p>
                )}
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
  } catch (error) {
    console.error("Error rendering Event component:", error);
    return null;
  }
};

export default Event; 