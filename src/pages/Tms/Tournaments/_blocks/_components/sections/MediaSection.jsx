import { Card, Row, Col, Form, Upload, Typography, Space } from "antd";
import { Upload as UploadIcon } from "lucide-react";
import SectionHeader from "../utils/SectionHeader";

const { Text } = Typography;

// Simple utility components defined directly in the file
const FormLabel = ({ children }) => (
  <div className="mb-3">{children}</div>
);

const UploadHelperText = ({ children }) => (
  <div className="text-gray-500 text-xs">{children}</div>
);

/**
 * MediaSection component for tournament media uploads
 */
const MediaSection = ({ isExpanded, toggleSection }) => (
  <Card 
    className="mb-10 shadow-md rounded-xl border-0 overflow-hidden" 
    bodyStyle={{ padding: isExpanded ? "1.5rem" : "0 1.5rem" }}
    headStyle={{ backgroundColor: "#f8fafc", borderBottom: isExpanded ? "1px solid #e2e8f0" : "none" }}
    title={
      <SectionHeader
        icon={<UploadIcon />} 
        title="Tournament Media" 
        sectionId="media"
        tooltip="Upload logos and banners for your tournament"
        isExpanded={isExpanded}
        onToggle={toggleSection}
      />
    }
  >
    {isExpanded && (
      <div className="bg-white py-4">
        <Row gutter={[24, 30]}>
          <Col xs={24} md={12}>
            <Space direction="vertical" size={16} className="w-full">
              <FormLabel>
                <div className="text-base font-medium mb-1">Tournament Logo</div>
                <Text type="secondary" className="text-sm">Upload a high-quality logo for your tournament</Text>
              </FormLabel>
              
              <Form.Item 
                name="league_logo"
                rules={[{ required: true, message: "Please upload a tournament logo" }]}
              >
                <Upload
                  listType="picture-card"
                  maxCount={1}
                  beforeUpload={() => false} // Prevent auto upload
                  className="tournament-logo-uploader "
                >
                  <div className="flex flex-col items-center justify-center ">
                    <div className="bg-blue-50 p-3 rounded-full">
                      <UploadIcon size={24} className="text-blue-600" />
                    </div>
                    <div className="text-xs text-center text-gray-600 font-medium">
                      Upload Logo
                    </div>
                    <div className="text-xs text-gray-400">Click or drag file</div>
                  </div>
                </Upload>
              </Form.Item>
              
              <UploadHelperText>
                Recommended size: 400x400px. Max size: 2MB. <br />
                Supported formats: JPG, PNG, SVG
              </UploadHelperText>
            </Space>
          </Col>
          
          <Col xs={24} md={12}>
            <Space direction="vertical" size={16} className="w-full">
              <FormLabel>
                <div className="text-base font-medium mb-1 ">Tournament Banner</div>
                <Text type="secondary" className="text-sm">Upload up to 3 banner images for your tournament</Text>
              </FormLabel>
              
              <Form.Item 
                name="league_banner"
                rules={[{ required: true, message: "Please upload at least one banner" }]}
              >
                <Upload
                  listType="picture-card"
                  maxCount={3}
                  beforeUpload={() => false} // Prevent auto upload
                  className="tournament-banner-uploader"
                >
                  <div className="flex flex-col items-center justify-center">
                    <div className="bg-indigo-50 p-3 rounded-full">
                      <UploadIcon size={24} className="text-indigo-600" />
                    </div>
                    <div className="text-sm text-center text-gray-600 font-medium">
                      Upload Banner
                    </div>
                    <div className="text-xs text-gray-400">Click or drag file</div>
                  </div>
                </Upload>
              </Form.Item>
              
              <UploadHelperText>
                Recommended size: 1200x600px. Max size: 5MB per image. <br />
                Supported formats: JPG, PNG. You can upload up to 3 banners.
              </UploadHelperText>
            </Space>
          </Col>
        </Row>
      </div>
    )}
  </Card>
);

export default MediaSection; 