import { useState } from "react";
import { Card, Row, Col, Form, Upload, Typography, Select, Input, Button, Tabs } from "antd";
import { Upload as UploadIcon, Plus, Image, Monitor, Smartphone, HelpCircle, Trash2, Link } from "lucide-react";
import SectionHeader from "../utils/SectionHeader";

const { Text } = Typography;
const { Option } = Select;
const { TabPane } = Tabs;

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
const MediaSection = ({ isExpanded, toggleSection, mediaCategoryOptions }) => {
  const formInstance = Form.useFormInstance();
  const [activeTabsMap, setActiveTabsMap] = useState({});
  
  // Handle tab change for media source
  const handleMediaSourceChange = (key, field) => {
    // Update the local state immediately for UI response
    setActiveTabsMap(prev => ({
      ...prev,
      [field.name]: key
    }));
    
    // Set the form value
    formInstance.setFieldValue(['medias', field.name, 'mediaSource'], key);
  };

  return (
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
          <div className="mb-6">
            <div className="flex items-center mb-4">
              <Image size={18} className="text-purple-600 mr-2" />
              <h3 className="text-lg font-medium text-gray-800">Media Assets</h3>
            </div>
            
            <div className="bg-blue-50 p-4 rounded-lg mb-6">
              <div className="flex items-start">
                <HelpCircle size={18} className="text-blue-600 mr-2 mt-0.5" />
                <div>
                  <p className="text-blue-800 text-sm">
                    Upload media assets for your tournament. Each media item requires:
                  </p>
                  <ul className="list-disc pl-5 mt-1 text-blue-700 text-sm">
                    <li>Category (Image/Video)</li>
                    <li>Usage (Logo/Banner)</li>
                    <li>Variant (Desktop/Mobile)</li>
                    <li>Position (ordering number)</li>
                    <li>Either a direct URL or uploaded file</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
          
          <Form.List name="medias">
            {(fields, { add, remove }) => (
              <>
                {fields.map((field, index) => {
                  // Get the current mediaSource value for this field
                  const currentValues = formInstance.getFieldsValue(true);
                  const formMediaSource = currentValues.medias?.[field.name]?.mediaSource || 'url';
                  
                  // Use the state value if it exists, otherwise use the form value
                  const activeTabKey = activeTabsMap[field.name] || formMediaSource;
                  
                  // Initialize the state if it doesn't exist yet
                  if (!activeTabsMap[field.name]) {
                    setActiveTabsMap(prev => ({
                      ...prev,
                      [field.name]: formMediaSource
                    }));
                  }
                  
                  return (
                    <Card
                      key={field.key}
                      className="mb-4 border border-gray-200 rounded-lg shadow-sm"
                      bodyStyle={{ padding: "16px" }}
                    >
                      <div className="flex justify-between items-center mb-4">
                        <h4 className="font-medium text-gray-800">Media Item #{index + 1}</h4>
                        <Button 
                          type="text" 
                          danger 
                          icon={<Trash2 size={16} />}
                          onClick={() => remove(field.name)}
                          className="hover:bg-red-50 rounded-full h-8 w-8 flex items-center justify-center p-0"
                        />
                      </div>
                      
                      <Row gutter={[16, 16]}>
                        <Col xs={24} sm={12} md={6}>
                          <Form.Item
                            {...field}
                            name={[field.name, "category"]}
                            label="Category"
                            rules={[{ required: true, message: "Please select category" }]}
                          >
                            <Select placeholder="Select category" className="rounded-lg">
                              {mediaCategoryOptions && mediaCategoryOptions.length > 0 ? 
                                mediaCategoryOptions.map(option => (
                                  <Option key={option.value} value={option.value}>
                                    {option.label}
                                  </Option>
                                )) : (
                                  <>
                                    <Option value="IMAGE">Image</Option>
                                    <Option value="VIDEO">Video</Option>
                                  </>
                                )
                              }
                            </Select>
                          </Form.Item>
                        </Col>
                        
                        <Col xs={24} sm={12} md={6}>
                          <Form.Item
                            {...field}
                            name={[field.name, "usage"]}
                            label="Usage"
                            rules={[{ required: true, message: "Please select usage" }]}
                          >
                            <Select placeholder="Select usage" className="rounded-lg">
                              <Option value="LOGO">
                                <div className="flex items-center">
                                  <Image size={14} className="text-blue-500 mr-1" />
                                  <span>Logo</span>
                                </div>
                              </Option>
                              <Option value="BANNER">
                                <div className="flex items-center">
                                  <Image size={14} className="text-green-500 mr-1" />
                                  <span>Banner</span>
                                </div>
                              </Option>
                            </Select>
                          </Form.Item>
                        </Col>
                        
                        <Col xs={24} sm={12} md={6}>
                          <Form.Item
                            {...field}
                            name={[field.name, "variant"]}
                            label="Variant"
                            rules={[{ required: true, message: "Please select variant" }]}
                          >
                            <Select placeholder="Select variant" className="rounded-lg">
                              <Option value="DESKTOP">
                                <div className="flex items-center">
                                  <Monitor size={14} className="text-indigo-500 mr-1" />
                                  <span>Desktop</span>
                                </div>
                              </Option>
                              <Option value="MOBILE">
                                <div className="flex items-center">
                                  <Smartphone size={14} className="text-purple-500 mr-1" />
                                  <span>Mobile</span>
                                </div>
                              </Option>
                            </Select>
                          </Form.Item>
                        </Col>
                        
                        <Col xs={24} sm={12} md={6}>
                          <Form.Item
                            {...field}
                            name={[field.name, "position"]}
                            label="Position"
                            rules={[{ required: true, message: "Please enter position" }]}
                          >
                            <Input type="number" min={1} className="rounded-lg" placeholder="Display order" />
                          </Form.Item>
                        </Col>
                        
                        <Col xs={24}>
                          <p>Media Source</p>
                          
                          {/* Tabs for choosing media source */}
                          <Tabs 
                            activeKey={activeTabKey}
                            className="media-source-tabs"
                            onChange={(key) => handleMediaSourceChange(key, field)}
                          >
                            <TabPane 
                              tab={
                                <div className="flex items-center">
                                  <Link size={16} className="mr-2 text-blue-600" />
                                  <span>Direct URL</span>
                                </div>
                              } 
                              key="url"
                            >
                              <Form.Item
                                {...field}
                                name={[field.name, "url"]}
                                label="URL"
                                rules={[
                                  { 
                                    required: activeTabKey === 'url', 
                                    message: "Please enter media URL" 
                                  }
                                ]}
                              >
                                <Input 
                                  placeholder="https://example.com/image.jpg" 
                                  className="rounded-lg"
                                  prefix={<Link size={16} className="text-blue-500 mr-2" />}
                                />
                              </Form.Item>
                              <div className="text-sm text-gray-500 mt-1">
                                Enter a direct URL to the media file you want to use
                              </div>
                            </TabPane>
                            
                            <TabPane 
                              tab={
                                <div className="flex items-center">
                                  <UploadIcon size={16} className="mr-2 text-purple-600" />
                                  <span>Upload File</span>
                                </div>
                              } 
                              key="upload"
                            >
                              <Form.Item 
                                {...field} 
                                name={[field.name, "fileUpload"]}
                                label="Upload file"
                                rules={[
                                  { 
                                    required: activeTabKey === 'upload', 
                                    message: "Please upload a file" 
                                  }
                                ]}
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
                                    </div>
                                    <div className="text-xs text-center text-gray-600 font-medium">
                                      Upload Media
                                    </div>
                                    <div className="text-xs text-gray-400">Click or drag file</div>
                                  </div>
                                </Upload>
                              </Form.Item>
                              <div className="text-sm text-gray-500 mt-1">
                                Upload a new file from your device
                              </div>
                            </TabPane>
                          </Tabs>
                        </Col>
                      </Row>
                    </Card>
                  );
                })}
                
                <Form.Item>
                  <Button
                    type="dashed"
                    onClick={() => add({ mediaSource: 'url' })}
                    block
                    icon={<Plus size={16} />}
                    className="hover:border-purple-500 hover:text-purple-500 rounded-lg"
                  >
                    Add Media
                  </Button>
                </Form.Item>
                
                <UploadHelperText>
                  <div className="bg-gray-50 p-4 rounded-lg mt-2">
                    <div className="flex items-start">
                      <HelpCircle size={16} className="text-gray-400 mr-2 mt-0.5" />
                      <div>
                        <p className="text-gray-700 text-sm font-medium">Media Recommendations:</p>
                        <ul className="list-disc pl-5 mt-1 text-gray-600 text-xs space-y-1">
                          <li><span className="font-medium">Logo:</span> 400x400px, max 2MB, formats: JPG, PNG, SVG</li>
                          <li><span className="font-medium">Desktop Banner:</span> 1200x600px, max 5MB, formats: JPG, PNG</li>
                          <li><span className="font-medium">Mobile Banner:</span> 600x800px, max 3MB, formats: JPG, PNG</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </UploadHelperText>
              </>
            )}
          </Form.List>
        </div>
      )}
    </Card>
  );
};

export default MediaSection; 