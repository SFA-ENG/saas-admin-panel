import { Card, Row, Col, Form, Input, Select, Button, Tabs, InputNumber, Divider, Radio, Tooltip } from "antd";
import { Medal, Trash2, Users, DollarSign, HelpCircle, Tag, Truck, Gamepad2, FileText } from "lucide-react";

const { TextArea } = Input;
const { TabPane } = Tabs;
const { Option } = Select;

/**
 * SubEventCard component for tournament sub-events
 */
const SubEventCard = ({ subEvent, removeSubEvent, subEventIndex, isMobile }) => {
  // Render a different layout for mobile
  if (isMobile) {
    return (
      <div className="bg-white border border-indigo-50 rounded-lg shadow-sm p-3">
        <div className="flex justify-between items-center mb-3">
          <div className="flex items-center">
            <div className="bg-indigo-100 p-1 rounded-lg mr-2">
              <Medal size={14} className="text-indigo-600" />
            </div>
            <span className="font-medium text-indigo-800 text-sm">Sub-Event {subEventIndex + 1}</span>
          </div>
          <Button 
            type="text" 
            danger 
            icon={<Trash2 size={14} />} 
            onClick={() => removeSubEvent(subEvent.name)}
            className="hover:bg-red-50 rounded-full h-7 w-7 flex items-center justify-center p-0"
          />
        </div>
        
        <Tabs defaultActiveKey="basic" size="small" className="subevent-tabs-mobile">
          <TabPane 
            tab={
              <div className="flex flex-col items-center">
                <FileText size={14} className="mb-1" />
                <span className="text-xs">Info</span>
              </div>
            } 
            key="basic"
          >
            <Form.Item
              {...subEvent}
              name={[subEvent.name, "subEventId"]}
              hidden
            >
              <Input />
            </Form.Item>
            
            <Form.Item
              {...subEvent}
              name={[subEvent.name, "name"]}
              label={<span className="text-xs">Name</span>}
              rules={[{ required: true, message: "Required" }]}
            >
              <Input 
                placeholder="Sub-event name" 
                className="rounded-lg text-sm"
                size="small"
              />
            </Form.Item>
            
            <Form.Item
              {...subEvent}
              name={[subEvent.name, "gameFormat"]}
              label={<span className="text-xs">Format</span>}
              rules={[{ required: true, message: "Required" }]}
            >
              <Select
                placeholder="Select format"
                className="rounded-lg"
                size="small"
                suffixIcon={<Gamepad2 size={14} className="text-indigo-500" />}
              >
                <Option value="KNOCKOUT">Knockout</Option>
                <Option value="LEAGUE">League</Option>
                <Option value="ROUND_ROBIN">Round Robin</Option>
                <Option value="GROUP_STAGE">Group Stage</Option>
              </Select>
            </Form.Item>
            
            <Form.Item
              {...subEvent}
              name={[subEvent.name, "type"]}
              label={<span className="text-xs">Type</span>}
              rules={[{ required: true, message: "Required" }]}
            >
              <Select
                placeholder="Select type"
                className="rounded-lg"
                size="small"
              >
                <Option value="Individual">Individual</Option>
                <Option value="Team">Team</Option>
                <Option value="Doubles">Doubles</Option>
                <Option value="Mixed">Mixed</Option>
              </Select>
            </Form.Item>
            
            <Form.Item
              {...subEvent}
              name={[subEvent.name, "description"]}
              label={<span className="text-xs">Description</span>}
              rules={[{ required: true, message: "Required" }]}
              className="mb-6"
            >
              <TextArea 
                placeholder="Describe the sub-event in detail" 
                rows={3}
                className="rounded-lg text-sm"
                size="small"
              />
            </Form.Item>
          </TabPane>
          
          <TabPane 
            tab={
              <div className="flex flex-col items-center">
                <DollarSign size={14} className="mb-1" />
                <span className="text-xs">Pricing</span>
              </div>
            } 
            key="pricing"
          >
            <Form.Item
              {...subEvent}
              name={[subEvent.name, "pricing", "currency"]}
              label={<span className="text-xs">Currency</span>}
              rules={[{ required: true, message: "Required" }]}
              initialValue="INR"
              className="mb-6"
            >
              <Select 
                placeholder="Select currency" 
                className="rounded-lg"
                size="small"
              >
                <Option value="INR">INR (₹)</Option>
                <Option value="USD">USD ($)</Option>
                <Option value="EUR">EUR (€)</Option>
                <Option value="GBP">GBP (£)</Option>
              </Select>
            </Form.Item>
            
            <Form.Item
              {...subEvent}
              name={[subEvent.name, "pricing", "amount"]}
              label={<span className="text-xs">Amount</span>}
              rules={[{ required: true, message: "Required" }]}
            >
              <InputNumber
                placeholder="Amount"
                className="w-full rounded-lg"
                min={0}
                size="small"
                formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                parser={value => value.replace(/\$\s?|(,*)/g, '')}
              />
            </Form.Item>
            
            <Form.Item
              {...subEvent}
              name={[subEvent.name, "pricing", "type"]}
              label={<span className="text-xs">Type</span>}
              initialValue="FIXED"
            >
              <Radio.Group size="small" className="w-full">
                <Radio value="FIXED" className="text-xs">Fixed</Radio>
                <Radio value="VARIABLE" className="text-xs">Variable</Radio>
              </Radio.Group>
            </Form.Item>
          </TabPane>
          
          <TabPane 
            tab={
              <div className="flex flex-col items-center">
                <Users size={14} className="mb-1" />
                <span className="text-xs">Rules</span>
              </div>
            } 
            key="rules"
          >
            <Form.List name={[subEvent.name, "participation_rules", "AND"]}>
              {(fields, { add, remove }) => (
                <>
                  {fields.length === 0 ? (
                    <div className="bg-blue-50 p-2 rounded-lg mb-3">
                      <div className="flex items-start">
                        <HelpCircle size={14} className="text-blue-600 mr-1 mt-0.5" />
                        <p className="text-blue-700 text-xs">
                          Add rules for participation in this sub-event.
                        </p>
                      </div>
                    </div>
                  ) : (
                    fields.map((field, index) => (
                      <div 
                        key={field.key}
                        className="mb-3 border border-blue-50 rounded-lg p-2"
                      >
                        <Form.Item
                          {...field}
                          name={[field.name, "field"]}
                          label={<span className="text-xs">Field</span>}
                          rules={[{ required: true, message: "Required" }]}
                          className="mb-2"
                        >
                          <Select placeholder="Select" size="small" className="rounded-lg text-xs">
                            <Option value="GENDER">Gender</Option>
                            <Option value="AGE">Age</Option>
                            <Option value="WEIGHT">Weight</Option>
                          </Select>
                        </Form.Item>
                        
                        <div className="flex gap-2">
                          <Form.Item
                            {...field}
                            name={[field.name, "operator"]}
                            label={<span className="text-xs">Operator</span>}
                            rules={[{ required: true }]}
                            className="mb-2 flex-1"
                          >
                            <Select placeholder="Select" size="small" className="rounded-lg text-xs">
                              <Option value="=">=</Option>
                              <Option value="!=">≠</Option>
                            </Select>
                          </Form.Item>
                          
                          <Form.Item
                            {...field}
                            name={[field.name, "value"]}
                            label={<span className="text-xs">Value</span>}
                            rules={[{ required: true }]}
                            className="flex-1 h-6"
                          >
                            <Input placeholder="Value" size="small" className="rounded-lg text-xs" />
                          </Form.Item>
                          
                          <Button
                            type="text"
                            danger
                            icon={<Trash2 size={14} />}
                            onClick={() => remove(field.name)}
                            className="hover:bg-red-50 rounded-full h-7 w-7 flex items-center justify-center p-0 self-end"
                          />
                        </div>
                      </div>
                    ))
                  )}
                  
                  <Form.Item className="mb-0">
                    <Button
                      type="dashed"
                      onClick={() => add({ field: "GENDER", operator: "EQUALTO", value: "" })}
                      icon={<Users size={14} />}
                      size="small"
                      className="w-full rounded-lg hover:border-blue-500 hover:text-blue-500 text-xs"
                    >
                      Add Rule
                    </Button>
                  </Form.Item>
                </>
              )}
            </Form.List>
          </TabPane>
        </Tabs>
      </div>
    );
  }

  // Desktop layout
  return (
    <Card 
      key={subEvent.key} 
      className="mb-6 border border-indigo-100 shadow-sm hover:shadow-md transition-shadow rounded-xl overflow-hidden w-full"
      headStyle={{ backgroundColor: "#EEF2FF", padding: "0.75rem 1rem" }}
      bodyStyle={{ padding: "1.25rem 1.25rem 2rem 1.25rem" }}
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
      <Tabs defaultActiveKey="basic" className="subevent-tabs">
        <TabPane 
          tab={
            <div className="flex items-center">
              <FileText size={16} className="mr-2 text-indigo-600" />
              <span>Basic Information</span>
            </div>
          } 
          key="basic"
        >
          <div className="pb-6">
          <Row gutter={[24, 24]} className="mt-4">
            <Form.Item
              {...subEvent}
              name={[subEvent.name, "subEventId"]}
              hidden
            >
              <Input />
            </Form.Item>
            
            <Col xs={24} md={12}>
              <Form.Item
                {...subEvent}
                name={[subEvent.name, "name"]}
                label="Sub-Event Name"
                rules={[{ required: true, message: "Please enter sub-event name" }]}
              >
                <Input 
                  placeholder="e.g., Men's U-18 100m Sprint" 
                  className="rounded-lg h-8"
                />
              </Form.Item>
            </Col>
            
            <Col xs={24} md={12}>
              <Form.Item
                {...subEvent}
                name={[subEvent.name, "gameFormat"]}
                label="Game Format"
                rules={[{ required: true, message: "Please select game format" }]}
              >
                <Select
                  placeholder="Select format"
                  className="rounded-lg h-8"
                  suffixIcon={<Gamepad2 size={16} className="text-indigo-500" />}
                >
                  <Option value="KNOCKOUT">Knockout</Option>
                  <Option value="LEAGUE">League</Option>
                  <Option value="ROUND_ROBIN">Round Robin</Option>
                  <Option value="GROUP_STAGE">Group Stage</Option>
                </Select>
              </Form.Item>
            </Col>
            
            <Col xs={24} md={12}>
              <Form.Item
                {...subEvent}
                name={[subEvent.name, "type"]}
                label="Sub-Event Type"
                rules={[{ required: true, message: "Please select sub-event type" }]}
              >
                <Select
                  placeholder="Select type"
                  className="rounded-lg h-8"
                >
                  <Option value="Individual">Individual</Option>
                  <Option value="Team">Team</Option>
                  <Option value="Doubles">Doubles</Option>
                  <Option value="Mixed">Mixed</Option>
                </Select>
              </Form.Item>
            </Col>
            
            <Col xs={24}>
              <Form.Item
                {...subEvent}
                name={[subEvent.name, "description"]}
                label="Description"
                rules={[{ required: true, message: "Please enter description" }]}
                className="mb-6"
              >
                <TextArea 
                  placeholder="Describe the sub-event in detail" 
                  rows={3}
                  className="rounded-lg"
                />
              </Form.Item>
            </Col>
            
            <Col xs={24}>
              <div className="h-4"></div>
            </Col>
            
            <Col xs={24} md={12}>
              <Form.Item
                {...subEvent}
                name={[subEvent.name, "status"]}
                label="Publication Status"
                initialValue="DRAFT"
              >
                <Select placeholder="Select status" className="rounded-lg">
                  <Option value="DRAFT">
                    <div className="flex items-center">
                      <Tag size={14} className="text-gray-500 mr-1" />
                      <span>Draft</span>
                    </div>
                  </Option>
                  <Option value="PUBLISHED">
                    <div className="flex items-center">
                      <Tag size={14} className="text-green-500 mr-1" />
                      <span>Published</span>
                    </div>
                  </Option>
                </Select>
              </Form.Item>
            </Col>
            <Col xs={24} md={12}>
              <Form.Item
                {...subEvent}
                name={[subEvent.name, "isActive"]}
                label="Active Status"
                initialValue={true}
              >
                <Radio.Group buttonStyle="solid" className="flex">
                  <Radio.Button value={true} className="flex-1 text-center">
                    <span className="text-green-600">Active</span>
                  </Radio.Button>
                  <Radio.Button value={false} className="flex-1 text-center">
                    <span className="text-gray-500">Inactive</span>
                  </Radio.Button>
                </Radio.Group>
              </Form.Item>
            </Col>
          </Row>
          </div>
        </TabPane>
        
        <TabPane 
          tab={
            <div className="flex items-center">
              <Users size={16} className="mr-2 text-blue-600" />
              <span>Participation Rules</span>
            </div>
          } 
          key="rules"
        >
          <div className="mt-4 pb-6">
            <div className="bg-blue-50 p-4 rounded-lg mb-6">
              <div className="flex items-start">
                <HelpCircle size={18} className="text-blue-600 mr-2 mt-0.5" />
                <div>
                  <p className="text-blue-800 text-sm font-medium">Participation Rules</p>
                  <p className="text-blue-700 text-sm">
                    Define specific rules for this sub-event. Rules are combined with AND logic.
                  </p>
                </div>
              </div>
            </div>
            
            <Form.List name={[subEvent.name, "participation_rules", "AND"]}>
              {(fields, { add, remove }) => (
                <>
                  {fields.map((field, index) => (
                    <Card 
                      key={field.key}
                      className="mb-4 border border-blue-100 rounded-lg"
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
                            <Select placeholder="Select field" className="rounded-lg">
                              <Option value="GENDER">Gender</Option>
                              <Option value="AGE">Age</Option>
                              <Option value="WEIGHT">Weight</Option>
                              <Option value="HEIGHT">Height</Option>
                              <Option value="GRADE">Grade</Option>
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
                              <Option value="EQUALTO">Equal To</Option>
                              <Option value="NOTEQUALTO">Not Equal To</Option>
                            
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
                            <Input placeholder="Enter value" className="rounded-lg h-8" />
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
                      onClick={() => add({ field: "GENDER", operator: "EQUALTO", value: "" })}
                      icon={<Users size={16} />}
                      className="w-full h-10 rounded-lg hover:border-blue-500 hover:text-blue-500"
                    >
                      Add Rule
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
              <DollarSign size={16} className="mr-2 text-green-600" />
              <span>Pricing</span>
            </div>
          } 
          key="pricing"
        >
          <div className="mt-4 pb-6">
            <div className="bg-green-50 p-4 rounded-lg mb-6">
              <div className="flex items-start">
                <HelpCircle size={18} className="text-green-600 mr-2 mt-0.5" />
                <div>
                  <p className="text-green-800 text-sm font-medium">Pricing Information</p>
                  <p className="text-green-700 text-sm">
                    Configure pricing details for this sub-event. You can use either a simple pricing model with just a single price type, or a complex model with multiple price tiers.
                  </p>
                </div>
              </div>
            </div>
            
            <Row gutter={[24, 24]}>
              <Col xs={24} md={12}>
                <Form.Item
                  {...subEvent}
                  name={[subEvent.name, "pricing", "currency"]}
                  label="Currency"
                  rules={[{ required: true, message: "Please select currency" }]}
                  initialValue="INR"
                  className="mb-6"
                >
                  <Select 
                    placeholder="Select currency" 
                    className="rounded-lg"
                    suffixIcon={<DollarSign size={16} className="text-green-500" />}
                  >
                    <Option value="INR">Indian Rupee (₹)</Option>
                    <Option value="USD">US Dollar ($)</Option>
                    <Option value="EUR">Euro (€)</Option>
                    <Option value="GBP">British Pound (£)</Option>
                  </Select>
                </Form.Item>
              </Col>
            </Row>
            
            <div className="h-4 mb-4"></div>
            
            <Row gutter={[24, 24]}>
              <Col xs={24} md={12}>
                <Form.Item
                  {...subEvent}
                  name={[subEvent.name, "pricing", "type"]}
                  label="Price Type (For Simple Pricing)"
                >
                  <Select placeholder="Select simple price type" className="rounded-lg">
                    <Option value="MRP">MRP</Option>
                    <Option value="Selling Price">Selling Price</Option>
                    <Option value="Discounted Price">Discounted Price</Option>
                  </Select>
                </Form.Item>
              </Col>
              
              <Col xs={24} md={12}>
                <Form.Item
                  {...subEvent}
                  name={[subEvent.name, "pricing", "amount"]}
                  label="Amount (For Simple Pricing)"
                >
                  <InputNumber 
                    placeholder="0.00" 
                    className="rounded-lg w-full" 
                    step={0.01}
                    min={0}
                    precision={2}
                  />
                </Form.Item>
              </Col>
            </Row>
            
            <div className="bg-yellow-50 p-3 rounded-lg mb-4 text-yellow-800 text-xs mt-8">
              <HelpCircle size={14} className="inline mr-1 text-yellow-600" />
              Note: You can either use simple pricing (above) or advanced pricing tiers (below), but not both. If you add price tiers, the simple pricing will be ignored.
            </div>
            
            <Divider orientation="left" className="mt-4">
              <div className="text-sm text-gray-600">Advanced Price Tiers</div>
            </Divider>
            
            <Form.List name={[subEvent.name, "pricing", "prices"]}>
              {(fields, { add, remove }) => (
                <>
                  {fields.map((field, index) => (
                    <Card 
                      key={field.key}
                      className="mb-4 border border-green-100 rounded-lg"
                      bodyStyle={{ padding: "16px" }}
                    >
                      <Row gutter={[16, 16]}>
                        <Col xs={24} md={6}>
                          <Form.Item
                            {...field}
                            name={[field.name, "type"]}
                            label="Price Type"
                            rules={[{ required: true, message: "Please select price type" }]}
                          >
                            <Select placeholder="Select type" className="rounded-lg">
                              <Option value="MRP">MRP</Option>
                              <Option value="Selling Price">Selling Price</Option>
                              <Option value="Discounted Price">Discounted Price</Option>
                            </Select>
                          </Form.Item>
                        </Col>
                        
                        <Col xs={24} md={6}>
                          <Form.Item
                            {...field}
                            name={[field.name, "amount"]}
                            label="Amount"
                            rules={[{ required: true, message: "Please enter amount" }]}
                          >
                            <InputNumber 
                              placeholder="0.00" 
                              className="rounded-lg w-full" 
                              step={0.01}
                              min={0}
                              precision={2}
                            />
                          </Form.Item>
                        </Col>
                        
                        <Col xs={24} md={5}>
                          <Form.Item
                            {...field}
                            name={[field.name, "tax_included"]}
                            label="Tax Included"
                            initialValue={false}
                          >
                            <Radio.Group buttonStyle="solid" className="flex">
                              <Radio.Button value={true} className="flex-1 text-center">Yes</Radio.Button>
                              <Radio.Button value={false} className="flex-1 text-center">No</Radio.Button>
                            </Radio.Group>
                          </Form.Item>
                        </Col>
                        
                        <Col xs={24} md={5}>
                          <Form.Item
                            {...field}
                            name={[field.name, "tax_details", "tax_percentage"]}
                            label="Tax Percentage"
                          >
                            <InputNumber 
                              placeholder="%" 
                              className="rounded-lg w-full" 
                              min={0}
                              max={100}
                              formatter={value => `${value}%`}
                              parser={value => value.replace('%', '')}
                            />
                          </Form.Item>
                        </Col>
                        
                        <Col xs={24} md={2} className="flex items-center justify-center">
                          <Tooltip title="Remove Price">
                            <Button
                              type="text"
                              danger
                              icon={<Trash2 size={16} />}
                              onClick={() => remove(field.name)}
                              className="hover:bg-red-50 rounded-full h-8 w-8 flex items-center justify-center p-0 mt-6"
                            />
                          </Tooltip>
                        </Col>
                      </Row>
                    </Card>
                  ))}
                  
                  <Form.Item>
                    <Button
                      type="dashed"
                      onClick={() => add({
                        type: "MRP",
                        amount: 0,
                        tax_included: false,
                        tax_details: { tax_percentage: 18 }
                      })}
                      icon={<DollarSign size={16} />}
                      className="w-full h-10 rounded-lg hover:border-green-500 hover:text-green-500"
                    >
                      Add Price Tier
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
              <Truck size={16} className="mr-2 text-orange-600" />
              <span>Metadata</span>
            </div>
          } 
          key="metadata"
        >
          <div className="mt-4 pb-6">
            <Row gutter={[24, 24]}>
              <Col xs={24} md={12}>
                <Card
                  title={
                    <div className="flex items-center">
                      <Users size={16} className="text-blue-600 mr-2" />
                      <span className="text-blue-800">Team Metadata</span>
                    </div>
                  }
                  className="shadow-sm border-blue-100 rounded-lg"
                >
                  <Form.Item
                    {...subEvent}
                    name={[subEvent.name, "meta_data", "team", "max_players_count"]}
                    label="Maximum Players per Team"
                    rules={[{ required: true, message: "Please enter max players" }]}
                  >
                    <InputNumber 
                      placeholder="Enter max players" 
                      className="rounded-lg w-full" 
                      min={1}
                    />
                  </Form.Item>
                </Card>
              </Col>
              
              <Col xs={24} md={12}>
                <Card
                  title={
                    <div className="flex items-center">
                      <Truck size={16} className="text-orange-600 mr-2" />
                      <span className="text-orange-800">Inventory Metadata</span>
                    </div>
                  }
                  className="shadow-sm border-orange-100 rounded-lg"
                >
                  <Form.Item
                    {...subEvent}
                    name={[subEvent.name, "expected_participants"]}
                    label="Total Available Slots"
                    rules={[{ required: true, message: "Please enter total slots" }]}
                  >
                    <InputNumber 
                      placeholder="Enter total slots" 
                      className="rounded-lg w-full" 
                      min={1}
                    />
                  </Form.Item>
                </Card>
              </Col>
            </Row>
          </div>
        </TabPane>
      </Tabs>
    </Card>
  );
};

export default SubEventCard; 