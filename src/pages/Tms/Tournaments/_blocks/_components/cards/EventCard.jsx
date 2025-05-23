import { Card, Row, Col, Form, Input, Select, Button, Badge, Tooltip, DatePicker, Tabs, Upload, notification } from "antd";
import { Flag, Trash2, Medal, PlusCircle, Calendar, FileText, Upload as UploadIcon } from "lucide-react";
import SubEventCard from "./SubEventCard";
import { useState, useEffect } from "react";
import dayjs from "dayjs";
import { renderSuccessNotifications } from "helpers/error.helpers";

const { TextArea } = Input;
const { RangePicker } = DatePicker;
const { TabPane } = Tabs;
const { useFormInstance } = Form;

/**
 * Format category tree into a readable string
 */
const formatCategoryTree = (categoryTree) => {
  if (!categoryTree) return "";
  
  const parts = [
    categoryTree.primary,
    categoryTree.secondary,
    categoryTree.tertiary,
    categoryTree.quaternary
  ].filter(Boolean);
  
  return parts.join(' > ');
};

/**
 * Format category tree into a readable string for event name
 */
const formatCategoryTreeForEventName = (categoryTree) => {
  if (!categoryTree) return "";
  
  const parts = [
    categoryTree.primary,
    categoryTree.secondary,
    categoryTree.tertiary,
    categoryTree.quaternary
  ].filter(Boolean); // Only include values that are not null/undefined/empty
  
  return parts.join(', '); // Join with comma and space
};

/**
 * EventCard component for tournament events
 */
const EventCard = ({ event, removeEvent, events, eventIndex, generateId, isMobile, eventTypeOptions, availableSportEvents = [] }) => {
  const eventId = `event_${eventIndex}`;
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [form] = Form.useForm();
  const parentForm = useFormInstance();

  // State for managing file lists
  const [termsFileList, setTermsFileList] = useState([]);
  const [rulesFileList, setRulesFileList] = useState([]);

  // Log available sport events on component mount
  useEffect(() => {
    console.log(`EventCard ${eventId} received availableSportEvents:`, availableSportEvents);
    
    // Check if the event already has a master_sport_events_id set from a previous selection
    try {
      if (!parentForm) {
        console.warn("Parent form not available in EventCard");
        return;
      }
      
      const currentFormValues = parentForm.getFieldsValue();
      const existingEventIdPath = event.name ? [...event.name.split('_'), 'master_sport_events_id'] : null;
      
      if (existingEventIdPath && currentFormValues) {
        // Navigate through the nested form values to find the master_sport_events_id
        let current = currentFormValues;
        for (const part of existingEventIdPath) {
          if (current && typeof current === 'object') {
            current = current[part];
          } else {
            current = undefined;
            break;
          }
        }
        
        const existingEventId = current;
        console.log(`EventCard ${eventId} has existing master_sport_events_id:`, existingEventId);
        
        // If there is an existing ID and available events, find the matching event
        if (existingEventId && availableSportEvents && availableSportEvents.length > 0) {
          const matchingEvent = availableSportEvents.find(e => e.event_id === existingEventId);
          if (matchingEvent) {
            console.log(`Found matching event for ID ${existingEventId}:`, matchingEvent);
            setSelectedEvent(matchingEvent);
          }
        }
      }
    } catch (error) {
      console.error("Error checking for existing event ID:", error);
    }
  }, [availableSportEvents, eventId, event.name, parentForm]);

  // Format available events for the dropdown
  const eventOptions = availableSportEvents.map(event => {
    const categoryTreeString = formatCategoryTree(event.category_tree);
    const displayLabel = `${event.type || 'Unknown'}${categoryTreeString ? ` - ${categoryTreeString}` : ''}`;
    
    return {
      value: event.event_id,
      label: displayLabel,
      eventData: event
    };
  });
  
  // Handle event selection
  const handleEventSelection = (eventId, option) => {
    console.log("Selected event ID:", eventId);
    console.log("Selected event data:", option?.eventData);
    
    if (!option || !option.eventData) {
      notification.warning({
        message: "Invalid Event Selection",
        description: "Unable to process the selected event data. Please try selecting again.",
      });
      return;
    }
    
    const selectedEventData = option.eventData;
    setSelectedEvent(selectedEventData);
    
    // Use the parentForm instance from the hook
    if (!parentForm) {
      console.error("Parent form not available in EventCard handleEventSelection");
      notification.error({
        message: "Form Error",
        description: "Unable to update form data. Please try again or refresh the page.",
      });
      return;
    }
    
    // Update form fields with selected event data
    const categoryTreeString = formatCategoryTreeForEventName(selectedEventData.category_tree);
    const eventName = categoryTreeString || selectedEventData.type || "Unnamed Event";
    const eventType = selectedEventData.type || "";
    
    // Create the path to set the values correctly in the nested form structure
    const eventNamePath = [...event.name.split('_'), 'eventName'];
    const eventTypePath = [...event.name.split('_'), 'eventType'];
    const masterEventIdPath = [...event.name.split('_'), 'master_sport_events_id'];
    
    // Set values in the parent form
    parentForm.setFieldsValue({
      [eventNamePath.join('.')]: eventName,
      [eventTypePath.join('.')]: eventType,
      [masterEventIdPath.join('.')]: eventId
    });
    
    console.log("Set form values:", {
      eventName,
      eventType,
      master_sport_events_id: eventId
    });
    
    // Notify successful selection
  renderSuccessNotifications({
      message: "Event Selected",
      description: `Successfully selected event: ${eventName}`,
      
    });
  };

  // Handle file changes for terms and conditions
  const handleTermsFileChange = ({ fileList }) => {
    setTermsFileList(fileList);
    parentForm.setFieldValue([event.name, 'termsAndConditions'], { fileList });
  };

  // Handle file changes for rules and regulations
  const handleRulesFileChange = ({ fileList }) => {
    setRulesFileList(fileList);
    parentForm.setFieldValue([event.name, 'rulesAndRegulations'], { fileList });
  };

  return (
    <Card 
      key={event.key} 
      className={`mb-8 border ${isMobile ? 'border-purple-50 shadow-sm' : 'border-purple-100 shadow-sm hover:shadow-md'} transition-shadow rounded-xl overflow-hidden`}
      headStyle={{ backgroundColor: "#F5F3FF", padding: isMobile ? "0.5rem 0.75rem" : "0.75rem 1rem" }}
      bodyStyle={{ padding: isMobile ? "0.75rem 0.75rem 3rem" : "1.25rem 1.25rem 6rem" }}
      title={
        <div className="flex items-center">
          <div className="bg-purple-100 p-1.5 rounded-lg mr-3">
            <Flag size={isMobile ? 16 : 18} className="text-purple-600" />
          </div>
          <span className={`font-medium text-purple-800 ${isMobile ? 'text-sm' : ''}`}>Event {eventIndex + 1}</span>
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
      <Form form={form}>
        <Tabs defaultActiveKey="basic" className="event-tabs" size={isMobile ? "small" : "default"}>
          <TabPane 
            tab={
              <div className="flex items-center">
                <FileText size={isMobile ? 14 : 16} className={isMobile ? "mb-1" : "mr-2 text-purple-600"} />
                {!isMobile && <span>Basic Information</span>}
                {isMobile && <span className="text-xs">Basic</span>}
              </div>
            } 
            key="basic"
          >
            <Row gutter={[24, 48]} className={isMobile ? "mt-2" : "mt-4"}>
              {/* Select event from available sport events */}
              {availableSportEvents && availableSportEvents.length > 0 && (
                <Col xs={24}>
                  <Form.Item
                    name={[event.name, "master_sport_events_id"]}
                    label={
                      <div className="flex items-center">
                        <span>Select Event</span>
                        <Badge color="red" className="ml-2" count="Required" />
                      </div>
                    }
                    // tooltip="This field is required to match an existing event ID from the Master Sports API"
                    rules={[{ required: true, message: "Please select an event from the dropdown" }]}
                    className="mb-6"
                  >
                    <Select
                      placeholder="Select an event"
                      className="rounded-lg h-10"
                      options={eventOptions}
                      onSelect={(value, option) => handleEventSelection(value, option)}
                      showSearch
                      optionFilterProp="label"
                      filterOption={(input, option) =>
                        (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
                      }
                    />
                  </Form.Item>
                  <div className="text-xs text-gray-500 mt-0 mb-3">
                    <span className="text-red-500">Important:</span> You must select a valid event from this dropdown to avoid database errors
                  </div>
                </Col>
              )}
              
              {/* If no events are available, show a warning */}
              {(!availableSportEvents || availableSportEvents.length === 0) && (
                <Col xs={24}>
                  <div className="bg-yellow-50 p-3 rounded-lg border border-yellow-200 mb-6">
                    <p className="text-yellow-700">No events available for the selected sport. Please select a different sport to see available events.</p>
                  </div>
                </Col>
              )}
              
              <Col xs={24} md={12}>
                <Form.Item
                  name={[event.name, "eventName"]}
                  label="Event Name"
                  rules={[{ required: true, message: "Please enter event name" }]}
                  className="mb-6"
                >
                  <Input
                    placeholder={selectedEvent ? formatCategoryTreeForEventName(selectedEvent.category_tree) || "Enter event name" : "Enter event name"}
                    className="rounded-lg h-8"
                    disabled={selectedEvent !== null}
                  />
                </Form.Item>
              </Col>
              
              <Col xs={24} md={12}>
                <Form.Item
                  name={[event.name, "eventType"]}
                  label="Event Type"
                  rules={[{ required: true, message: "Please select event type" }]}
                  className="mb-6"
                >
                  <Select
                    placeholder={selectedEvent ? selectedEvent.type || "Select event type" : "Select event type"}
                    className="rounded-lg h-8"
                    options={eventTypeOptions || [
                      { value: "SINGLES", label: "Singles" },
                      { value: "DOUBLES", label: "Doubles" },
                      { value: "TEAM", label: "Team Event" },
                    ]}
                    disabled={selectedEvent !== null}
                  />
                </Form.Item>
              </Col>
              
              <Col xs={24} md={12}>
                <Form.Item
                  name={[event.name, "event_duration"]}
                  label="Event Duration"
                  rules={[{ required: true, message: "Please select event duration" }]}
                  className="mb-6 mt-4"
                  
                >
                  <RangePicker 
                    style={{ width: "100%" }} 
                    className="rounded-lg h-8"
                    format="YYYY-MM-DD"
                    placeholder={["Start Date", "End Date"]}
                    suffixIcon={<Calendar size={16} className="text-purple-500" />}
                    disabledDate={(current) => {
                      return current && current < dayjs().startOf('day');
                    }}
                  />
                </Form.Item>
              </Col>

              <Col xs={24} md={12}>
                <Row gutter={[16, 32]}>
                  <Col xs={24} md={12}>
                    <Form.Item
                      name={[event.name, "termsAndConditions"]}
                      label="Terms & Conditions"
                      rules={[{ required: true, message: "Please upload terms and conditions file" }]}
                      className="mb-6 mt-4"
                    >
                      <Upload
                        maxCount={1}
                        beforeUpload={() => false} // Prevent auto upload
                        className="w-full upload-box-fixed"
                        accept=".pdf"
                        fileList={termsFileList}
                        onChange={handleTermsFileChange}
                        showUploadList={{
                          showPreviewIcon: false,
                          showRemoveIcon: true,
                          showDownloadIcon: false,
                        }}
                      >
                        {termsFileList.length < 1 && (
                          <div className="border border-dashed border-gray-300 rounded-lg p-3 text-center hover:border-purple-500 cursor-pointer" style={{ height: '100px', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
                            <div className="bg-purple-50 p-2 rounded-full mb-1">
                              <UploadIcon size={20} className="text-purple-600" />
                            </div>
                            <div className="text-xs text-center text-gray-600 font-medium">Upload File</div>
                            <div className="text-xs text-center text-gray-400">Click or drag file</div>
                          </div>
                        )}
                      </Upload>
                    </Form.Item>
                  </Col>

                  <Col xs={24} md={12}>
                    <Form.Item
                      name={[event.name, "rulesAndRegulations"]}
                      label="Rules & Regulations"
                      rules={[{ required: true, message: "Please upload rules and regulations file" }]}
                      className="mb-6 mt-6"
                    >
                      <Upload
                        maxCount={1}
                        beforeUpload={() => false} // Prevent auto upload
                        className="w-full upload-box-fixed"
                        accept=".pdf"
                        fileList={rulesFileList}
                        onChange={handleRulesFileChange}
                        showUploadList={{
                          showPreviewIcon: false,
                          showRemoveIcon: true,
                          showDownloadIcon: false,
                        }}
                      >
                        {rulesFileList.length < 1 && (
                          <div className="border border-dashed border-gray-300 rounded-lg p-3 text-center hover:border-purple-500 cursor-pointer" style={{ height: '100px', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
                            <div className="bg-purple-50 p-2 rounded-full mb-1">
                              <UploadIcon size={20} className="text-purple-600" />
                            </div>
                            <div className="text-xs text-center text-gray-600 font-medium">Upload File</div>
                            <div className="text-xs text-center text-gray-400">Click or drag file</div>
                          </div>
                        )}
                      </Upload>
                    </Form.Item>
                  </Col>
                </Row>
              </Col>
            </Row>
          </TabPane>

          <TabPane
            tab={
              <div className="flex items-center">
                <Medal size={isMobile ? 14 : 16} className={isMobile ? "mb-1" : "mr-2 text-indigo-600"} />
                {!isMobile && <span>Sub-Events</span>}
                {isMobile && <span className="text-xs">Sub-Events</span>}
              </div>
            }
            key="subEvents"
          >
            <div className={isMobile ? "mt-2" : "mt-4"}>
              <div className="flex items-center mb-4">
                <div className="bg-indigo-100 p-2 rounded-lg mr-3">
                  <Medal size={isMobile ? 16 : 18} className="text-indigo-600" />
                </div>
                <span className={`${isMobile ? 'text-sm' : 'text-lg'} font-medium text-gray-800`}>Sub-Events</span>
                <Badge 
                  count="Optional" 
                  className="ml-2" 
                  style={{ backgroundColor: '#E0E7FF', color: '#4F46E5' }}
                />
              </div>
              
              <Form.List name={[event.name, "sub_events"]}>
                {(subEvents, { add: addSubEvent, remove: removeSubEvent }) => (
                  <>
                    <div className={`w-full ${isMobile ? 'space-y-4' : 'overflow-x-visible'}`}>
                      {subEvents.map((subEvent, subEventIndex) => (
                        <SubEventCard 
                          key={subEvent.key} 
                          subEvent={subEvent} 
                          removeSubEvent={removeSubEvent} 
                          subEventIndex={subEventIndex}
                          isMobile={isMobile}
                        />
                      ))}
                    </div>
                    
                    <Form.Item>
                      <Button
                        type="dashed"
                        onClick={() => addSubEvent({ subEventId: generateId() })}
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
            </div>
          </TabPane>
        </Tabs>
      </Form>
    </Card>
  );
};

export default EventCard; 