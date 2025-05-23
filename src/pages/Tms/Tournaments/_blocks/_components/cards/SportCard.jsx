import { Card, Row, Col, Form, Select, Button, Divider, Tooltip, notification } from "antd";
import { Award, Trash2, Flag, PlusCircle, Gamepad2 } from "lucide-react";
import EventCard from "./EventCard";
import { useEffect, useState } from "react";
import { renderSuccessNotifications } from "../../../../../../helpers/error.helpers";

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
  sportsData,
  isMobile,
  form
}) => {
  const sportId = `${seasonId}_sport_${sportIndex}`;
  const [selectedSportEvents, setSelectedSportEvents] = useState([]);
  const [selectedSportId, setSelectedSportId] = useState(null);
  
  // Debug log to check received props
  useEffect(() => {
    console.log(`SportCard ${sportId} received sportsOptions:`, sportsOptions);
    console.log(`SportCard ${sportId} received sportsData:`, sportsData);
    
    // Check if sport ID is already selected in form
    const currentFormValues = form.getFieldsValue();
    const sportFieldName = sport.name;
    
    if (currentFormValues && 
        currentFormValues[sportFieldName] && 
        currentFormValues[sportFieldName].sportsId) {
      const existingSportId = currentFormValues[sportFieldName].sportsId;
      console.log(`SportCard ${sportId} has existing sport ID:`, existingSportId);
      
      // If we have a selected sport ID, populate events
      if (existingSportId && sportsData) {
        setSelectedSportId(existingSportId);
        handleSportChange(existingSportId);
      }
    }
  }, [sportsOptions, sportId, sportsData, form, sport.name]);
  
  // Handle sport selection change
  const handleSportChange = (sportId) => {
    console.log(`Sport selection changed to ID: ${sportId}`);
    setSelectedSportId(sportId);
    
    if (!sportsData || !Array.isArray(sportsData)) {
      console.warn("No sports data available");
      setSelectedSportEvents([]);
      return;
    }
    
    const selectedSport = sportsData.find(sport => sport.sport_id === sportId);
    
    if (selectedSport && selectedSport.events) {
      console.log(`Found events for sport ${selectedSport.name}:`, selectedSport.events);
      
      // Clear any existing events in the form when sport changes
      const currentFormValues = form.getFieldsValue();
      const sportFieldName = sport.name;
      
      if (currentFormValues && currentFormValues[sportFieldName]) {
        // Reset events array to empty
        form.setFieldsValue({
          [sportFieldName]: {
            ...currentFormValues[sportFieldName],
            events: []
          }
        });
        
        // Add a default event with the first available event ID
        if (selectedSport.events.length > 0) {
          const defaultEvent = {
            id: generateId(),
            master_sport_events_id: selectedSport.events[0].event_id,
            eventName: selectedSport.events[0].type || "Default Event",
            eventType: selectedSport.events[0].type || "SINGLES"
          };
          
          setTimeout(() => {
            const updatedValues = form.getFieldsValue();
            form.setFieldsValue({
              [sportFieldName]: {
                ...updatedValues[sportFieldName],
                events: [defaultEvent]
              }
            });
            
           renderSuccessNotifications(`Added default event for ${selectedSport.name}`);
          }, 100);
        }
      }
      
      // Store the events for selection in EventCard components
      setSelectedSportEvents(selectedSport.events);
    } else {
      console.warn(`No events found for sport ID ${sportId}`);
      setSelectedSportEvents([]);
      
      notification.warning({
        message: "No Events Available",
        description: "This sport doesn't have any associated events. Please select a different sport.",
        duration: 4
      });
    }
  };
 
  // Use either provided sports or defaults
  const sportSelectOptions = sportsOptions && sportsOptions.length > 0 
    ? sportsOptions.map(option => ({
        value: option.value,
        label: option.label
      }))
    : [];
    
  console.log(`SportCard ${sportId} using sportSelectOptions:`, sportSelectOptions);

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
              options={sportSelectOptions}
              suffixIcon={<Gamepad2 size={16} className="text-green-500" />}
              onChange={handleSportChange}
              showSearch
              optionFilterProp="label"
              filterOption={(input, option) =>
                (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
              }
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
          
          {selectedSportEvents.length === 0 && selectedSportId && (
            <div className="bg-yellow-50 p-3 mb-4 rounded-lg border border-yellow-100">
              <p className="text-yellow-700 text-sm">No events found for this sport. Please select another sport or contact the administrator.</p>
            </div>
          )}
          
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
                    eventTypeOptions={[
                      { value: "SINGLES", label: "Singles" },
                      { value: "DOUBLES", label: "Doubles" },
                      { value: "TEAM", label: "Team Event" },
                      { value: "RELAY", label: "Relay" },
                      { value: "TOURNAMENT", label: "Tournament" }
                    ]}
                    availableSportEvents={selectedSportEvents}
                  />
                ))}
                
                <Form.Item>
                  <Button
                    type="dashed"
                    onClick={() => {
                      if (selectedSportEvents.length === 0) {
                        notification.warning({
                          message: "No Events Available",
                          description: "Please select a sport first to see available events.",
                          duration: 3
                        });
                        return;
                      }
                      
                      // If events are available, add a new event with the first available event ID
                      const defaultEventId = selectedSportEvents[0]?.event_id;
                      const defaultEventType = selectedSportEvents[0]?.type || "SINGLES";
                      const defaultEventName = selectedSportEvents[0]?.type || "New Event";
                      
                      addEvent({ 
                        id: generateId(),
                        master_sport_events_id: defaultEventId,
                        eventType: defaultEventType,
                        eventName: defaultEventName
                      });
                    }}
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