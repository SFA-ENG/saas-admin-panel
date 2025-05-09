import { Card, Row, Col, Form, Select, Button, Divider, Tooltip } from "antd";
import { Award, Trash2, Flag, PlusCircle, Gamepad2 } from "lucide-react";
import EventCard from "./EventCard";

/**
 * SportCard component for tournament sports
 */
const SportCard = ({ sport, removeSport, sports, sportIndex, seasonId, generateId }) => {
  const sportId = `${seasonId}_sport_${sportIndex}`;
  
  return (
    <Card 
      key={sport.key} 
      className="mb-8 border border-green-100 shadow-sm hover:shadow-md transition-shadow rounded-xl overflow-hidden"
      headStyle={{ backgroundColor: "#ECFDF5", padding: "0.75rem 1rem" }}
      bodyStyle={{ padding: "1.25rem" }}
      title={
        <div className="flex items-center">
          <div className="bg-green-100 p-1.5 rounded-lg mr-3">
            <Award size={18} className="text-green-600" />
          </div>
          <span className="font-medium text-green-800">Sport {sportIndex + 1}</span>
        </div>
      }
      extra={
        <Tooltip title={sports.length === 1 ? "At least one sport is required" : "Remove sport"}>
          <Button 
            type="text" 
            danger 
            icon={<Trash2 size={16} />} 
            onClick={() => removeSport(sport.name)}
            className="hover:bg-red-50 rounded-full h-8 w-8 flex items-center justify-center p-0"
            disabled={sports.length === 1}
          />
        </Tooltip>
      }
    >
      <Row gutter={[24, 24]}>
        <Col xs={24} md={12} lg={8}>
          <Form.Item
            {...sport}
            name={[sport.name, "sport_name"]}
            label="Sport Name"
            rules={[{ required: true, message: "Please select a sport" }]}
          >
            <Select
              placeholder="Select sport"
              className="rounded-lg h-10"
              options={[
                { value: "CRICKET", label: "Cricket" },
                { value: "FOOTBALL", label: "Football" },
                { value: "TENNIS", label: "Tennis" },
                { value: "BASKETBALL", label: "Basketball" },
                { value: "SWIMMING", label: "Swimming" },
                { value: "HOCKEY", label: "Hockey" },
                { value: "BADMINTON", label: "Badminton" },
              ]}
              suffixIcon={<Gamepad2 size={16} className="text-green-500" />}
            />
          </Form.Item>
        </Col>
        
        <Col xs={24} md={12} lg={8}>
          <Form.Item
            {...sport}
            name={[sport.name, "format"]}
            label="Format"
            rules={[{ required: true, message: "Please select a format" }]}
          >
            <Select
              placeholder="Select format"
              className="rounded-lg h-10"
              options={[
                { value: "LEAGUE", label: "League" },
                { value: "KNOCKOUT", label: "Knockout" },
                { value: "ROUND_ROBIN", label: "Round Robin" },
                { value: "GROUP_STAGE", label: "Group Stage" },
              ]}
            />
          </Form.Item>
        </Col>

        {/* Events Section */}
        <Col span={24}>
          <Divider orientation="left" className="my-2">
            <div className="flex items-center">
              <Flag size={16} className="text-purple-600 mr-2" />
              <span className="text-purple-800 font-medium">Events</span>
            </div>
          </Divider>
          
          <Form.List name={[sport.name, "events"]}>
            {(events, { add: addEvent, remove: removeEvent }) => (
              <>
                {events.map((event, eventIndex) => (
                  <EventCard 
                    key={event.key} 
                    event={event} 
                    removeEvent={removeEvent} 
                    events={events} 
                    eventIndex={eventIndex} 
                    generateId={generateId} 
                  />
                ))}
                
                <Form.Item>
                  <Button
                    type="dashed"
                    onClick={() => addEvent({ id: generateId() })}
                    block
                    icon={<PlusCircle size={16} />}
                    className="hover:border-purple-500 hover:text-purple-500 rounded-lg h-10 mt-2"
                  >
                    Add Event
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

export default SportCard; 