import { Card, Row, Col, Form, Input, Select, Button, Badge, Tooltip, DatePicker, Tabs, Upload } from "antd";
import { Flag, Trash2, Medal, PlusCircle, Calendar, FileText, Upload as UploadIcon } from "lucide-react";
import SubEventCard from "./SubEventCard";

const { TextArea } = Input;
const { RangePicker } = DatePicker;
const { TabPane } = Tabs;

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
      <Tabs defaultActiveKey="basic" className="event-tabs">
        <TabPane 
          tab={
            <div className="flex items-center">
              <FileText size={16} className="mr-2 text-purple-600" />
              <span>Basic Information</span>
            </div>
          } 
          key="basic"
        >
          <Row gutter={[24, 24]} className="mt-4">
            <Col xs={24} md={12}>
              <Form.Item
                {...event}
                name={[event.name, "sportEventId"]}
                label="Event Type"
                rules={[{ required: true, message: "Please select event type" }]}
              >
                <Select
                  placeholder="Select event type"
                  className="rounded-lg h-10"
                  options={[
                    { value: "6237e481-e097-4080-8ffd-f719f1ce54fd", label: "Men's Singles" },
                    { value: "8a4e2c7b-9f53-4d68-b12e-7395a8fd64e9", label: "Women's Singles" },
                    { value: "1f5c3b9a-7d24-48e6-9035-812a6e457f83", label: "Men's Doubles" },
                    { value: "5b2a9c7e-64d1-4f83-a8e2-976c31b45d29", label: "Women's Doubles" },
                    { value: "3d7e2a9f-18c5-4b67-9d4e-82af5c613b48", label: "Mixed Doubles" },
                    { value: "9c5b3e7a-28f6-49d7-b154-ec283a615f97", label: "Team Event" },
                  ]}
                />
              </Form.Item>
            </Col>
            
            <Col xs={24} md={12}>
              <Form.Item
                {...event}
                name={[event.name, "event_duration"]}
                label="Event Duration"
                rules={[{ required: true, message: "Please select event duration" }]}
              >
                <RangePicker 
                  style={{ width: "100%" }} 
                  className="rounded-lg h-10"
                  format="YYYY-MM-DD"
                  placeholder={["Start Date", "End Date"]}
                  suffixIcon={<Calendar size={16} className="text-purple-500" />}
                />
              </Form.Item>
            </Col>

            <Col xs={24} md={12}>
              <Form.Item
                {...event}
                name={[event.name, "termsAndConditions"]}
                label="Terms & Conditions"
                rules={[{ required: true, message: "Please upload terms and conditions file" }]}
              >
                <Upload
                  listType="picture-card"
                  maxCount={1}
                  beforeUpload={() => false} // Prevent auto upload
                  className="w-full"
                >
                  <div className="flex flex-col items-center justify-center">
                    <div className="bg-purple-50 p-3 rounded-full">
                      <UploadIcon size={24} className="text-purple-600" />
                      <div className="text-xs text-center text-gray-600 font-medium">Upload</div>
                    </div>
                    <div className="text-xs text-center text-gray-400">Click or drag file</div>
                  </div>
                </Upload>
              
              </Form.Item>
            </Col>


            <Col xs={24} md={12}>
              <Form.Item
                {...event}
                name={[event.name, "rulesAndRegulations"]}
                label="Rules & Regulations"
                rules={[{ required: true, message: "Please upload rules and regulations file" }]}
              >
                <Upload
                  listType="picture-card"
                  maxCount={1}
                  beforeUpload={() => false} // Prevent auto upload
                  className="w-full"
                >
                  <div className="flex flex-col items-center justify-center">
                    <div className="bg-purple-50 p-3 rounded-full">
                      <UploadIcon size={24} className="text-purple-600" />
                      <div className="text-xs text-center text-gray-600 font-medium">Upload</div>
                    </div>
                    <div className="text-xs text-center text-gray-400">Click or drag file</div>
                  </div>
                </Upload>
              </Form.Item>
            </Col>
          </Row>
        </TabPane>

        <TabPane
          tab={
            <div className="flex items-center">
              <Medal size={16} className="mr-2 text-indigo-600" />
              <span>Sub-Events</span>
            </div>
          }
          key="subEvents"
        >
          <div className="mt-4">
            <div className="flex items-center mb-4">
              <div className="bg-indigo-100 p-2 rounded-lg mr-3">
                <Medal size={18} className="text-indigo-600" />
              </div>
              <span className="text-lg font-medium text-gray-800">Sub-Events</span>
              <Badge 
                count="Optional" 
                className="ml-2" 
                style={{ backgroundColor: '#E0E7FF', color: '#4F46E5' }}
              />
            </div>
            
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
    </Card>
  );
};

export default EventCard; 