import { Card, Row, Col, Form, Input, Select, Button } from "antd";
import { Medal, Trash2 } from "lucide-react";

/**
 * SubEventCard component for tournament sub-events
 */
const SubEventCard = ({ subEvent, removeSubEvent, subEventIndex }) => (
  <Card 
    key={subEvent.key} 
    className="mb-6 border border-indigo-100 shadow-sm hover:shadow-md transition-shadow rounded-xl overflow-hidden"
    headStyle={{ backgroundColor: "#EEF2FF", padding: "0.75rem 1rem" }}
    bodyStyle={{ padding: "1.25rem" }}
    title={
      <div className="flex items-center">
        <div className="bg-indigo-100 p-1.5 rounded-lg mr-3">
          <Medal size={18} className="text-indigo-600" />
        </div>
        <span className="font-medium text-indigo-800">Sub-Event {subEventIndex + 1}</span>
      </div>
    }
    extra={
      <Button 
        type="text" 
        danger 
        icon={<Trash2 size={16} />} 
        onClick={() => removeSubEvent(subEvent.name)}
        className="hover:bg-red-50 rounded-full h-8 w-8 flex items-center justify-center p-0"
      />
    }
  >
    <Row gutter={[24, 24]}>
      <Col xs={24} md={12}>
        <Form.Item
          {...subEvent}
          name={[subEvent.name, "sub_event_name"]}
          label="Sub-Event Name"
          rules={[{ required: true, message: "Please enter sub-event name" }]}
        >
          <Input 
            placeholder="e.g., Under-19" 
            className="rounded-lg h-10"
          />
        </Form.Item>
      </Col>
      
      <Col xs={24} md={12}>
        <Form.Item
          {...subEvent}
          name={[subEvent.name, "sub_event_category"]}
          label="Category"
          rules={[{ required: true, message: "Please select category" }]}
        >
          <Select
            placeholder="Select category"
            className="rounded-lg h-10"
            options={[
              { value: "AGE_GROUP", label: "Age Group" },
              { value: "WEIGHT_CLASS", label: "Weight Class" },
              { value: "SKILL_LEVEL", label: "Skill Level" },
              { value: "OTHER", label: "Other" },
            ]}
          />
        </Form.Item>
      </Col>
    </Row>
  </Card>
);

export default SubEventCard; 