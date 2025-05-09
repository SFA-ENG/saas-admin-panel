import { Card, Row, Col, Form, Input, DatePicker, Select, Badge } from "antd";
import { FileText, Flag, MapPin, Users, Clock } from "lucide-react";
import SectionHeader from "../utils/SectionHeader";

const { TextArea } = Input;
const { RangePicker } = DatePicker;

/**
 * BasicInformationSection component for tournament basic details
 */
const BasicInformationSection = ({ isExpanded, toggleSection }) => (
  <Card 
    className="mb-10 shadow-md rounded-xl border-0 overflow-hidden" 
    bodyStyle={{ padding: isExpanded ? "1.5rem" : "0 1.5rem" }}
    headStyle={{ backgroundColor: "#f8fafc", borderBottom: isExpanded ? "1px solid #e2e8f0" : "none" }}
    title={
      <SectionHeader
        icon={<FileText />} 
        title="Basic Information" 
        sectionId="basic" 
        tooltip="Core details about your tournament"
        isExpanded={isExpanded}
        onToggle={toggleSection}
      />
    }
  >
    {isExpanded && (
      <div className="bg-white py-4">
        <Row gutter={[24, 24]}>
          <Col xs={24} md={12} lg={8}>
            <Form.Item
              name="tournament_name"
              label="Tournament Name"
              rules={[{ required: true, message: "Please enter the tournament name" }]}
            >
              <Input 
                placeholder="Enter tournament name" 
                className="rounded-lg h-11" 
                prefix={<Flag size={16} className="text-blue-500 mr-2" />}
              />
            </Form.Item>
          </Col>
          
          <Col xs={24} md={12} lg={8}>
            <Form.Item
              name="location"
              label="Location"
              rules={[{ required: true, message: "Please enter the location" }]}
            >
              <Input 
                prefix={<MapPin size={16} className="text-green-500 mr-2" />} 
                placeholder="City, State, Country" 
                className="rounded-lg h-11"
              />
            </Form.Item>
          </Col>
          
          <Col xs={24} md={12} lg={8}>
            <Form.Item
              name="participants"
              label="Expected Participants"
              rules={[{ required: true, message: "Please enter expected participants" }]}
            >
              <Input 
                prefix={<Users size={16} className="text-orange-500 mr-2" />} 
                placeholder="Number of teams/participants" 
                type="number"
                min={1} 
                className="rounded-lg h-11"
              />
            </Form.Item>
          </Col>
          
          <Col xs={24}>
            <Form.Item
              name="tournament_description"
              label="Description"
              rules={[{ required: true, message: "Please enter a description" }]}
            >
              <TextArea 
                placeholder="Enter tournament description" 
                rows={4} 
                showCount 
                maxLength={500} 
                className="rounded-lg"
              />
            </Form.Item>
          </Col>
          
          <Col xs={24} md={12}>
            <Form.Item
              name="date_range"
              label="Tournament Date Range"
              rules={[{ required: true, message: "Please select date range" }]}
            >
              <RangePicker 
                style={{ width: "100%" }} 
                format="YYYY-MM-DD"
                placeholder={["Start Date", "End Date"]}
                className="rounded-lg h-11"
                placement="bottomLeft"
                suffixIcon={<Clock size={16} className="text-purple-500" />}
              />
            </Form.Item>
          </Col>
          
          <Col xs={24} md={12}>
            <Form.Item
              name="status"
              label="Tournament Status"
              rules={[{ required: true, message: "Please select status" }]}
              initialValue="UPCOMING"
            >
              <Select
                placeholder="Select status"
                className="rounded-lg h-11"
                options={[
                  { value: "UPCOMING", label: (
                    <div className="flex items-center">
                      <Badge color="blue" />
                      <span className="ml-2">Upcoming</span>
                    </div>
                  )},
                  { value: "ACTIVE", label: (
                    <div className="flex items-center">
                      <Badge color="green" />
                      <span className="ml-2">Active</span>
                    </div>
                  )},
                  { value: "COMPLETED", label: (
                    <div className="flex items-center">
                      <Badge color="gray" />
                      <span className="ml-2">Completed</span>
                    </div>
                  )},
                ]}
              />
            </Form.Item>
          </Col>
          
          <Col xs={24} md={12} lg={8}>
            <Form.Item 
              name="genders" 
              label="Genders" 
              rules={[{ required: true, message: "Please select at least one gender" }]}
            >
              <Select
                mode="multiple"
                placeholder="Select genders"
                className="rounded-lg"
                options={[
                  { value: "MALE", label: "Male" },
                  { value: "FEMALE", label: "Female" },
                  { value: "OTHER", label: "Other" },
                ]}
                optionLabelProp="label"
              />
            </Form.Item>
          </Col>
          
          <Col xs={24} md={12} lg={8}>
            <Form.Item name="options" label="Options">
              <Select
                mode="multiple"
                placeholder="Select options"
                className="rounded-lg"
                options={[
                  { 
                    value: "is_active", 
                    label: (
                      <div className="flex items-center">
                        <span className="h-3 w-3 rounded-full bg-green-500 mr-2"></span>
                        <span>Active</span>
                      </div>
                    )
                  },
                  { 
                    value: "is_published", 
                    label: (
                      <div className="flex items-center">
                        <span className="h-3 w-3 rounded-full bg-blue-500 mr-2"></span>
                        <span>Published</span>
                      </div>
                    )
                  },
                  { 
                    value: "featured", 
                    label: (
                      <div className="flex items-center">
                        <span className="h-3 w-3 rounded-full bg-yellow-500 mr-2"></span>
                        <span>Featured</span>
                      </div>
                    )
                  },
                ]}
                defaultValue={["is_active", "is_published"]}
              />
            </Form.Item>
          </Col>
        </Row>
      </div>
    )}
  </Card>
);

export default BasicInformationSection; 