import { Card, Row, Col, Form, Select, Button, Divider, Tooltip } from "antd";
import { Award, Trash2, Flag, PlusCircle, Gamepad2 } from "lucide-react";
import EventCard from "./EventCard";

const { Option } = Select;

/**
 * SportCard component for tournament sports
 */
const SportCard = ({ 
  sport, 
  removeSport, 
  sports, 
  sportIndex, 
  seasonId, 
  generateId,
  tournamentFormatOptions,
  sportsOptions,
  isMobile
}) => {
  const sportId = `${seasonId}_sport_${sportIndex}`;
  
  return (
    <Card 
      key={sport.key} 
      className={`mb-8 border ${isMobile ? 'border-green-50 shadow-sm' : 'border-green-100 shadow-sm hover:shadow-md'} transition-shadow rounded-xl overflow-hidden`}
      headStyle={{ backgroundColor: "#ECFDF5", padding: isMobile ? "0.5rem 0.75rem" : "0.75rem 1rem" }}
      bodyStyle={{ padding: isMobile ? "0.75rem" : "1.25rem" }}
      title={
        <div className="flex items-center">
          <div className="bg-green-100 p-1.5 rounded-lg mr-3">
            <Award size={isMobile ? 16 : 18} className="text-green-600" />
          </div>
          <span className={`font-medium text-green-800 ${isMobile ? 'text-sm' : ''}`}>Sport {sportIndex + 1}</span>
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
            name={[sport.name, "sportsId"]}
            label="Sport"
            rules={[{ required: true, message: "Please select a sport" }]}
          >
            <Select
              placeholder="Select sport"
              className="rounded-lg h-10"
              options={sportsOptions && sportsOptions.length > 0 
                ? sportsOptions.filter(option => option.value !== 'ALL').map(option => ({
                    value: option.value,
                    label: option.label
                  }))
                : [
                    { value: "82bdf0d6-a1fd-4934-bef4-98127a86d11e", label: "Cricket" },
                    { value: "7ab3e138-5c64-4c4a-8b91-9d6a8e71ebf2", label: "Football" },
                    { value: "9c12e4a7-8f3b-4d7e-a51d-532b62e5a662", label: "Tennis" },
                    { value: "6d45a8c2-1e9f-4b8a-937c-f18d42967890", label: "Basketball" },
                    { value: "3a7e9d5b-2f8c-4e1a-b90d-675438e219a4", label: "Swimming" },
                    { value: "5c8b2e7f-4a96-48d3-ba1e-9f8c67d2134a", label: "Hockey" },
                    { value: "1d6a7e9c-5f82-43b1-9e67-a8d429b57f20", label: "Badminton" },
                  ]
              }
              suffixIcon={<Gamepad2 size={16} className="text-green-500" />}
            />
          </Form.Item>
        </Col>
        
        <Col xs={24} md={12} lg={8}>
          <Form.Item
            {...sport}
            name={[sport.name, "gameFormat"]}
            label="Game Format"
            rules={[{ required: true, message: "Please select a format" }]}
          >
            <Select
              placeholder="Select format"
              className="rounded-lg h-10"
              options={tournamentFormatOptions || [
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
              <Flag size={isMobile ? 14 : 16} className="text-purple-600 mr-2" />
              <span className={`text-purple-800 font-medium ${isMobile ? 'text-xs' : ''}`}>Events</span>
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
                    isMobile={isMobile}
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