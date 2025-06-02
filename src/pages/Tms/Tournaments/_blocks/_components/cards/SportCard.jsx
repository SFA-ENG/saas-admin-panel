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
    // Add a small delay to ensure form data is fully loaded
    const timer = setTimeout(() => {
      
      // Check if sport ID is already selected in form
      const currentFormValues = form.getFieldsValue();
      
      // Navigate through the form structure to find the sport ID
      let existingSportId = null;
      let hasExistingEvents = false;
      
      // Try different ways to access the sport ID from the form values
      if (currentFormValues && currentFormValues.seasons) {
        // Since sport.name is a number (index), we need to find which season and sport this corresponds to
        // From the sportId format like "season_0_sport_0", extract the indices
        const seasonIndex = parseInt(sportId.split('_')[1]);
        const sportIndex = parseInt(sportId.split('_')[3]);
                
        const seasonData = currentFormValues.seasons[seasonIndex];
        
        if (seasonData && seasonData.sports) {    
          if (seasonData.sports[sportIndex]) {
            const sportData = seasonData.sports[sportIndex];
            existingSportId = sportData.sportsId;
            hasExistingEvents = sportData.events && sportData.events.length > 0;
          } else {
            console.warn(`  - No sport data at sports[${sportIndex}]`);
          }
        } else {
          console.warn(`  - No season data or sports array at seasons[${seasonIndex}]`);
        }
      }
      
      // If we have a selected sport ID, populate events
      if (existingSportId && sportsData && sportsData.length > 0) {
        setSelectedSportId(existingSportId);
        
        // Find the sport in sportsData and set available events
        const selectedSport = sportsData.find(sport => 
          sport.sport_id === existingSportId || 
          sport.id === existingSportId ||
          sport.value === existingSportId ||
          sport.master_sports_id === existingSportId
        );
        
        if (selectedSport && selectedSport.events) {
          setSelectedSportEvents(selectedSport.events);
        } else {
          console.warn(`SportCard ${sportId} - No events found for sport ID ${existingSportId}`);
        }
        
        // Only trigger handleSportChange if we don't have existing events (to avoid clearing edit data)
        if (!hasExistingEvents) {
          handleSportChange(existingSportId);
        }
      }
    }, 100); // Small delay to ensure form data is loaded
    
    return () => clearTimeout(timer);
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
    
    // Try different ID field names to find the matching sport
    const selectedSport = sportsData.find(sport => 
      sport.sport_id === sportId || 
      sport.id === sportId ||
      sport.value === sportId ||
      sport.master_sports_id === sportId
    );
  
    
    if (selectedSport && selectedSport.events) {
      
      // Clear any existing events in the form when sport changes
      const currentFormValues = form.getFieldsValue();
      const sportFieldName = sport.name;
      
      console.log(`Clearing events for sport field: ${sportFieldName}`);
      
      if (currentFormValues && currentFormValues[sportFieldName]) {
        // Reset the entire sport section to clear all nested data
        form.setFieldsValue({
          [sportFieldName]: {
            sportsId: sportId, // Keep the new sport ID
            events: [] // Clear all events
          }
        });
        
        console.log(`Cleared all events for sport ${selectedSport.name}`);
        
        // Add a default event with the first available event ID after a short delay
        if (selectedSport.events.length > 0) {
          setTimeout(() => {
            const defaultEvent = {
              id: generateId(),
              master_sport_events_id: selectedSport.events[0].event_id,
              eventName: selectedSport.events[0].type || "Default Event",
              eventType: selectedSport.events[0].type || "SINGLES",
              sub_events: [] // Ensure sub_events are also cleared
            };
            
            // Add the default event
            const currentValues = form.getFieldsValue();
            const sportData = currentValues[sportFieldName] || {};
            
            form.setFieldsValue({
              [sportFieldName]: {
                ...sportData,
                sportsId: sportId, // Ensure sport ID is preserved
                events: [defaultEvent]
              }
            });
            
            console.log(`Added default event for ${selectedSport.name}:`, defaultEvent);
            renderSuccessNotifications(`Added default event for ${selectedSport.name}`);
          }, 200); // Increased delay to ensure proper clearing
        }
      }
      
      // Store the events for selection in EventCard components
      setSelectedSportEvents(selectedSport.events);
      console.log(`Set selected sport events for ${selectedSport.name}:`, selectedSport.events.map(e => ({ id: e.event_id, type: e.type })));
    } else {
      console.warn(`No events found for sport ID ${sportId}`);
      console.warn(`Available sports:`, sportsData.map(s => ({ id: s.sport_id || s.id, name: s.name })));
      setSelectedSportEvents([]);
      
      // Clear the form section for this sport
      const sportFieldName = sport.name;
      form.setFieldsValue({
        [sportFieldName]: {
          sportsId: sportId,
          events: []
        }
      });
      
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
                    sportsData={sportsData}
                    selectedSportId={selectedSportId}
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