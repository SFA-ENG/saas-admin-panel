import { Card, Row, Col, Form, Input, Select, Button, Divider, Badge, Tooltip } from "antd";
import { Flag, Trash2, Medal, PlusCircle } from "lucide-react";
import SubEventCard from "./SubEventCard";

/**
 * EventCard component for tournament events
 */
const EventCard = ({ event, removeEvent, events, eventIndex, generateId }) => {
  const eventId = `event_${eventIndex}`;
  
  return (
    <Card 
      key={event.key} 
      className="mb-8 border border-purple-100 shadow-sm hover:shadow-md transition-shadow rounded-xl overflow-hidden"
      headStyle={{ backgroundColor: "#F5F3FF", padding: "0.75rem 1rem" }}
      bodyStyle={{ padding: "1.25rem" }}
      title={
        <div className="flex items-center">
          <div className="bg-purple-100 p-1.5 rounded-lg mr-3">
            <Flag size={18} className="text-purple-600" />
          </div>
          <span className="font-medium text-purple-800">Event {eventIndex + 1}</span>
        </div>
      }
      extra={
        <Tooltip title={events.length === 1 ? "At least one event is required" : "Remove event"}>
          <Button 
            type="text" 
            danger 
            icon={<Trash2 size={16} />} 
            onClick={() => removeEvent(event.name)}
            className="hover:bg-red-50 rounded-full h-8 w-8 flex items-center justify-center p-0"
            disabled={events.length === 1}
          />
        </Tooltip>
      }
    >
      <Row gutter={[24, 24]}>
        <Col xs={24} md={12}>
          <Form.Item
            {...event}
            name={[event.name, "event_name"]}
            label="Event Name"
            rules={[{ required: true, message: "Please enter event name" }]}
          >
            <Input 
              placeholder="e.g., Men's Singles" 
              className="rounded-lg h-10"
            />
          </Form.Item>
        </Col>
        
        <Col xs={24} md={12}>
          <Form.Item
            {...event}
            name={[event.name, "event_type"]}
            label="Event Type"
            rules={[{ required: true, message: "Please select event type" }]}
          >
            <Select
              placeholder="Select event type"
              className="rounded-lg h-10"
              options={[
                { value: "SINGLES", label: "Singles" },
                { value: "DOUBLES", label: "Doubles" },
                { value: "TEAM", label: "Team" },
                { value: "MIXED", label: "Mixed" },
              ]}
            />
          </Form.Item>
        </Col>

        {/* Sub-Events Section */}
        <Col span={24}>
          <Divider orientation="left" className="my-2">
            <div className="flex items-center">
              <div className="flex items-center">
                <Medal size={16} className="text-indigo-600 mr-2" />
                <span className="text-indigo-800 font-medium">Sub-Events</span>
              </div>
              <Badge 
                count="Optional" 
                className="ml-2" 
                style={{ backgroundColor: '#E0E7FF', color: '#4F46E5' }}
              />
            </div>
          </Divider>
          
          <Form.List name={[event.name, "sub_events"]}>
            {(subEvents, { add: addSubEvent, remove: removeSubEvent }) => (
              <>
                {subEvents.map((subEvent, subEventIndex) => (
                  <SubEventCard 
                    key={subEvent.key} 
                    subEvent={subEvent} 
                    removeSubEvent={removeSubEvent} 
                    subEventIndex={subEventIndex} 
                  />
                ))}
                
                <Form.Item>
                  <Button
                    type="dashed"
                    onClick={() => addSubEvent({ id: generateId() })}
                    block
                    icon={<PlusCircle size={16} />}
                    className="hover:border-indigo-500 hover:text-indigo-500 rounded-lg h-10"
                  >
                    Add Sub-Event
                  </Button>
                </Form.Item>
              </>
            )}
          </Form.List>
        </Col>
      </Row>
    </Card>
  );
};

export default EventCard; 