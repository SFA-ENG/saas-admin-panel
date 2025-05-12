import React,{ useState, useEffect } from "react";
import { Card, Row, Col, Form, Input, DatePicker, Button, Tooltip, Select, Tabs, Badge, Upload} from "antd";
import { CalendarPlus, Trash2, Medal, PlusCircle,HelpCircle, Calendar, Clock, Smartphone ,Monitor, FileText, Map, Image, Link, Plus, Upload as UploadIcon } from "lucide-react";
import SportCard from "./SportCard";

const { RangePicker } = DatePicker;
const { TextArea } = Input;
const { TabPane } = Tabs;
const { Option } = Select;

// Custom Tab component with indicator for mobile
const CustomTab = ({ icon, title, badgeCount, isMobile }) => (
  <div className="flex items-center">
    {icon && React.cloneElement(icon, { size: isMobile ? 14 : 16, className: isMobile ? "mb-1" : "mr-2 text-blue-600" })}
    {!isMobile && <span>{title}</span>}
    {isMobile && (
      <div className="flex flex-col items-center">
        <span className="text-xs font-medium">{title}</span>
        {badgeCount > 0 && <Badge count={badgeCount} size="small" className="mt-1" />}
      </div>
    )}
  </div>
);

/**
 * SeasonCard component for tournament seasons
 */
const SeasonCard = ({
  season,
  removeSeason,
  seasons,
  seasonIndex,
  generateId,
  tournamentFormatOptions,
  sportsOptions,
  genderOptions,
  ageGroupOptions,
  locationOptions,
  countryOptions,
  cityOptions,
  stateOptions,
  isMobile
}) => {
  const seasonId = `season_${seasonIndex}`;
  const formInstance = Form.useFormInstance();
  const [activeMediaTabsMap, setActiveMediaTabsMap] = useState({});
  const [activeTabKey, setActiveTabKey] = useState("basic");

  // For tracking selected field types in participation rules
  const [fieldTypes, setFieldTypes] = useState({});

  // Handle tab change
  const handleTabChange = (key) => {
    setActiveTabKey(key);
  };

  // Handle tab change for media source in season
  const handleSeasonMediaSourceChange = (key, field) => {
    // Update the local state immediately for UI response
    setActiveMediaTabsMap(prev => ({
      ...prev,
      [field.name]: key
    }));

    // Set the form value
    formInstance.setFieldValue([season.name, 'medias', field.name, 'mediaSource'], key);
  };

  // Handle field type changes in participation rules
  const handleFieldTypeChange = (value, fieldIndex) => {
    setFieldTypes(prev => ({
      ...prev,
      [fieldIndex]: value
    }));
  };

  // Get options for participation rule value based on selected field
  const getValueOptions = (fieldType) => {
    switch (fieldType) {
      case 'COUNTRY':
        return countryOptions || [];
      case 'GENDER':
        return genderOptions || [];
      case 'AGE':
        // For age, we'll use a number input instead of dropdown
        return null;
      case 'CITY':
        return cityOptions || [];
      case 'STATE':
        return stateOptions || [];
      default:
        return [];
    }
  };

  // Effect to initialize field types from form values
  useEffect(() => {
    const values = formInstance.getFieldsValue(true);
    const rules = values?.seasons?.[seasonIndex]?.participationRules?.AND || [];

    // Initialize field types state from existing values
    const initialFieldTypes = {};
    rules.forEach((rule, index) => {
      if (rule && rule.field) {
        initialFieldTypes[index] = rule.field;
      }
    });

    setFieldTypes(initialFieldTypes);
  }, [formInstance, seasonIndex]);

  // Calculate sports count for the badge
  const sportsCount = formInstance.getFieldValue(['seasons', seasonIndex, 'sports'])?.length || 0;

  return (
    <Card
      key={season.key}
      className={`${isMobile ? 'border border-gray-200 shadow-sm' : 'border border-blue-100 shadow-sm hover:shadow-md'} transition-shadow rounded-lg overflow-hidden`}
      headStyle={{ 
        backgroundColor: "#EFF6FF", 
        padding: isMobile ? "0.5rem 0.75rem" : "0.75rem 1rem" 
      }}
      bodyStyle={{ 
        padding: isMobile ? "0.75rem" : "1.25rem",
      }}
      title={
        <div className="flex items-center">
          <div className="bg-blue-100 p-1.5 rounded-lg mr-2">
            <CalendarPlus size={isMobile ? 16 : 18} className="text-blue-600" />
          </div>
          <span className={`${isMobile ? 'text-sm' : ''} font-medium text-blue-800`}>Season {seasonIndex + 1}</span>
        </div>
      }
      extra={
        <Tooltip title={seasons.length === 1 ? "At least one season is required" : "Remove season"}>
          <Button
            type="text"
            danger
            icon={<Trash2 size={16} />}
            onClick={() => removeSeason(season.name)}
            className="hover:bg-red-50 rounded-full h-8 w-8 flex items-center justify-center p-0"
            disabled={seasons.length === 1}
          />
        </Tooltip>
      }
    >
      <Tabs defaultActiveKey="basic" className="season-tabs">
        <TabPane
          tab={
            <div className="flex items-center">
              <FileText size={16} className="mr-2 text-blue-600" />
              <span>Basic Information</span>
            </div>
          }
          key="basic"
        >
          <Row gutter={[24, 24]} className="mt-4">
            <Col xs={24} md={12}>
              <Form.Item
                {...season}
                name={[season.name, "season_name"]}
                label="Season Name"
                rules={[{ required: true, message: "Please enter season name" }]}
              >
                <Input
                  placeholder="e.g., Summer 2024"
                  className="rounded-lg h-10"
                  prefix={<Calendar size={16} className="text-blue-500 mr-2" />}
                />
              </Form.Item>
            </Col>
            <Col xs={24} md={12}>
              <Form.Item
                {...season}
                name={[season.name, "duration"]}
                label="Season Duration"
                rules={[{ required: true, message: "Please select season duration" }]}
              >
                <RangePicker
                  style={{ width: "100%" }}
                  className="rounded-lg h-10"
                  format="YYYY-MM-DD"
                  placeholder={["Start Date", "End Date"]}
                  suffixIcon={<Clock size={16} className="text-blue-500" />}
                />
              </Form.Item>
            </Col>




            <Col xs={24} md={12}>
              <Form.Item
                {...season}
                name={[season.name, "registration_duration"]}
                label="Registration Period"
                rules={[{ required: true, message: "Please select registration period" }]}
              >
                <RangePicker
                  style={{ width: "100%" }}
                  className="rounded-lg h-10"
                  format="YYYY-MM-DD"
                  placeholder={["Start Date", "End Date"]}
                  suffixIcon={<Clock size={16} className="text-green-500" />}
                />
              </Form.Item>



            </Col>

            <div className="ml-4">
            <Row gutter={[24, 24]}>
              <Col xs={24} md={12} >
                <Form.Item
                  {...season}
                  name={[season.name, "termsAndConditions"]}
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
                  {...season}
                  name={[season.name, "rulesAndRegulations"]}
                  label={<span style={{ whiteSpace: "nowrap" }}>Rules & Regulations</span>}
                  rules={[{ required: true, message: "Please enter rules and regulations" }]}
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
          </div>



          <Col xs={24}>
            <Form.Item
              name={[season.name, "season_description"]}
              label="Description"
              rules={[{ required: true, message: "Please enter a description" }]}
            >
              <TextArea
                placeholder="Enter season description"
                rows={4}
                showCount
                maxLength={500}
                className="rounded-lg"
              />
            </Form.Item>
          </Col>

          <Col xs={24}>
            <Form.Item
              {...season}
              name={[season.name, "locations"]}
              label="Locations"
              rules={[{ required: true, message: "Please select at least one location" }]}
            >
              <Select
                mode="multiple"
                placeholder="Select locations"
                className="rounded-lg"
                suffixIcon={<Map size={16} className="text-indigo-500" />}
              >
                {locationOptions && locationOptions.length > 0 ?
                  locationOptions.map(option => (
                    <Option key={option.value} value={option.value}>{option.label}</Option>
                  )) : (
                    <>
                      <Option value="56ce426f-e781-4a03-b82f-007c9945d90b">Chennai, Tamil Nadu</Option>
                      <Option value="a9cfa75b-89a7-4c36-a982-1f1f8c06dd3b">Mumbai, Maharashtra</Option>
                      <Option value="b12d4e3f-c987-4a23-95e2-39b7c1e84f5a">Bangalore, Karnataka</Option>
                      <Option value="c23e5f4g-h876-5i43-j098-76k5l4m3n2o1">Delhi NCR</Option>
                      <Option value="d34f6g5h-i765-4j32-k109-87l6m5n4o3p2">Hyderabad, Telangana</Option>
                    </>
                  )
                }
              </Select>
            </Form.Item>
          </Col>
        </Row>
      </TabPane>

      <TabPane
        tab={
          <div className="flex items-center">
            <Image size={16} className="mr-2 text-purple-600" />
            <span>Media</span>
          </div>
        }
        key="media"
      >
        <div className="mt-4">
          <div className="flex items-center mb-4">
            <Image size={18} className="text-purple-600 mr-2" />
            <h3 className="text-lg font-medium text-gray-800">Season Media Assets</h3>
          </div>

          <Form.List name={[season.name, "medias"]}>
            {(fields, { add, remove }) => (
              <>
                {fields.map((field, index) => {
                  // Get the current mediaSource value for this field
                  const currentValues = formInstance.getFieldsValue(true);
                  const formMediaSource = currentValues.seasons?.[seasonIndex]?.medias?.[field.name]?.mediaSource || 'url';

                  // Use the state value if it exists, otherwise use the form value
                  const activeTabKey = activeMediaTabsMap[field.name] || formMediaSource;

                  // Initialize the state if it doesn't exist yet
                  if (!activeMediaTabsMap[field.name]) {
                    setActiveMediaTabsMap(prev => ({
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
                              <Option value="IMAGE">Image</Option>
                              <Option value="VIDEO">Video</Option>
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
                          <Form.Item
                            {...field}
                            name={[field.name, "mediaSource"]}
                            label="Media Source"
                            initialValue="url"
                            rules={[{ required: true }]}
                          />
                           

                          {/* Tabs for choosing media source */}
                          <Tabs
                            activeKey={activeTabKey}
                            className="media-source-tabs"
                            onChange={(key) => handleSeasonMediaSourceChange(key, field)}
                          >
                            <TabPane
                              tab={
                                <div className="flex items-center">
                                  <Link size={16} className="text-blue-600" />
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
                                  prefix={<Link size={16} className="text-blue-500" />}
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
                    onClick={() => {
                      // Add a new media item with default values
                      const newItem = {
                        mediaSource: 'url', // Default to URL tab
                        category: 'IMAGE',
                        position: fields.length + 1
                      };

                      // Add the new item and update state for the tab
                      const newFieldIndex = fields.length;
                      add(newItem);

                      // Set the active tab for the new field after a short delay
                      setTimeout(() => {
                        setActiveMediaTabsMap(prev => ({
                          ...prev,
                          [newFieldIndex]: 'url'
                        }));
                      }, 0);
                    }}
                    icon={<Plus size={16} />}
                    className="w-full h-11 rounded-lg hover:border-purple-500 hover:text-purple-500"
                  >
                    Add Media Item
                  </Button>
                </Form.Item>
              </>
            )}
          </Form.List>
        </div>
      </TabPane>

      <TabPane
        tab={
          <div className="flex items-center">
            <Medal size={16} className="mr-2 text-green-600" />
            <span>Sports</span>
          </div>
        }
        key="sports"
      >
        <div className="mt-4">
          <Form.List name={[season.name, "sports"]}>
            {(sports, { add: addSport, remove: removeSport }) => (
              <>
                {sports.map((sport, sportIndex) => (
                  <SportCard
                    key={sport.key}
                    sport={sport}
                    removeSport={removeSport}
                    sports={sports}
                    sportIndex={sportIndex}
                    seasonId={seasonId}
                    generateId={generateId}
                    tournamentFormatOptions={tournamentFormatOptions}
                    sportsOptions={sportsOptions}
                  />
                ))}

                <Form.Item>
                  <Button
                    type="dashed"
                    onClick={() => addSport({ id: generateId() })}
                    block
                    icon={<PlusCircle size={16} />}
                    className="hover:border-green-500 hover:text-green-500 rounded-lg h-10 mt-4"
                  >
                    Add Sport
                  </Button>
                </Form.Item>
              </>
            )}
          </Form.List>
        </div>
      </TabPane>

      <TabPane
        tab={
          <div className="flex items-center">
            <FileText size={16} className="mr-2 text-orange-600" />
            <span>Participation Rules</span>
          </div>
        }
        key="rules"
      >
        <div className="mt-4">
          <div className="bg-yellow-50 p-4 rounded-lg mb-6">
            <div className="flex items-start">
              <HelpCircle size={18} className="text-yellow-600 mr-2 mt-0.5" />
              <div>
                <p className="text-yellow-800 text-sm font-medium">Participation Rules</p>
                <p className="text-yellow-700 text-sm">
                  Define who can participate in this season. Rules are combined with AND logic.
                </p>
              </div>
            </div>
          </div>

          <Form.List name={[season.name, "participationRules", "AND"]}>
            {(fields, { add, remove }) => (
              <>
                {fields.map((field, index) => (
                  <Card
                    key={field.key}
                    className="mb-4 border border-orange-100 rounded-lg"
                    bodyStyle={{ padding: "16px" }}
                  >
                    <Row gutter={[16, 16]}>
                      <Col xs={24} md={8}>
                        <Form.Item
                          {...field}
                          name={[field.name, "field"]}
                          label="Field"
                          rules={[{ required: true, message: "Please select a field" }]}
                        >
                          <Select
                            placeholder="Select field"
                            className="rounded-lg"
                            onChange={(value) => handleFieldTypeChange(value, index)}
                          >
                            <Option value="COUNTRY">Country</Option>
                            <Option value="GENDER">Gender</Option>
                            <Option value="AGE">Age</Option>
                            <Option value="CITY">City</Option>
                            <Option value="STATE">State</Option>
                          </Select>
                        </Form.Item>
                      </Col>

                      <Col xs={24} md={6}>
                        <Form.Item
                          {...field}
                          name={[field.name, "operator"]}
                          label="Operator"
                          rules={[{ required: true, message: "Please select an operator" }]}
                        >
                          <Select placeholder="Select operator" className="rounded-lg">
                            <Option value="=">Equal To</Option>
                            <Option value="!=">Not Equal To</Option>
                          
                          </Select>
                        </Form.Item>
                      </Col>

                      <Col xs={24} md={8}>
                        <Form.Item
                          {...field}
                          name={[field.name, "value"]}
                          label="Value"
                          rules={[{ required: true, message: "Please enter a value" }]}
                        >
                          {fieldTypes[index] === 'AGE' ? (
                            <Input
                              type="number"
                              min={0}
                              max={100}
                              placeholder="Enter age"
                              className="rounded-lg"
                            />
                          ) : (
                            <Select
                              placeholder="Select value"
                              className="rounded-lg"
                              showSearch
                              optionFilterProp="label"
                              options={getValueOptions(fieldTypes[index])}
                            />
                          )}
                        </Form.Item>
                      </Col>

                      <Col xs={24} md={2} className="flex items-center justify-center">
                        <Button
                          type="text"
                          danger
                          icon={<Trash2 size={16} />}
                          onClick={() => remove(field.name)}
                          className="hover:bg-red-50 rounded-full h-8 w-8 flex items-center justify-center p-0 mt-6"
                        />
                      </Col>
                    </Row>
                  </Card>
                ))}

                <Form.Item>
                  <Button
                    type="dashed"
                    onClick={() => add({ field: "COUNTRY", operator: "EQUALTO", value: "" })}
                    icon={<PlusCircle size={16} />}
                    className="w-full h-10 rounded-lg hover:border-orange-500 hover:text-orange-500"
                  >
                    Add Rule
                  </Button>
                </Form.Item>
              </>
            )}
          </Form.List>
        </div>
      </TabPane>
    </Tabs>
    </Card >
  );
};

export default SeasonCard; 