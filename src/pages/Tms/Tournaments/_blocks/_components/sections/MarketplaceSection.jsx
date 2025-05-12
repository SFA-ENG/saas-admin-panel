import { Card, Row, Col, Form, Select, Tooltip } from "antd";
import { ShoppingCart, Info } from "lucide-react";
import SectionHeader from "../utils/SectionHeader";

/**
 * MarketplaceSection component for tournament marketplace configuration
 */
const MarketplaceSection = ({ isExpanded, toggleSection, marketplaceVisibilityOptions }) => (
  <Card 
    className="mb-10 shadow-md rounded-xl border-0 overflow-hidden" 
    bodyStyle={{ padding: isExpanded ? "1.5rem" : "0 1.5rem" }}
    headStyle={{ backgroundColor: "#f8fafc", borderBottom: isExpanded ? "1px solid #e2e8f0" : "none" }}
    title={
      <SectionHeader
        icon={<ShoppingCart />} 
        title="Marketplace Configuration" 
        sectionId="marketplace"
        tooltip="Configure how the tournament appears and behaves in marketplaces"
        isExpanded={isExpanded}
        onToggle={toggleSection}
      />
    }
  >
    {isExpanded && (
      <div className="bg-white py-4">
        <Row gutter={[24, 24]}>
          <Col xs={24} md={12}>
            <Form.Item
              name="marketplaceVisibilityScope"
              label={
                <div className="flex items-center">
                  <span>Marketplace Visibility Scope</span>
                  <Tooltip title="Who can see this tournament in the marketplace">
                    <Info size={16} className="text-blue-500 ml-2" />
                  </Tooltip>
                </div>
              }
              rules={[{ required: true, message: "Please select at least one visibility scope" }]}
            >
              <Select
                mode="multiple"
                placeholder="Select visibility scope"
                className="rounded-lg"
                options={marketplaceVisibilityOptions || [
                  { value: "B2C-INDIVIDUAL", label: "Individual Customers" },
                  { value: "B2C-TEAM", label: "Team Customers" },
                  { value: "B2B-SCHOOL", label: "Schools" },
                  { value: "B2B-ACADEMY", label: "Academies" },
                  { value: "B2B-CLUB", label: "Clubs" },
                ]}
                optionLabelProp="label"
              />
            </Form.Item>
          </Col>
          
          <Col xs={24} md={12}>
            <Form.Item
              name="marketplaceActionScope"
              label={
                <div className="flex items-center">
                  <span>Marketplace Action Scope</span>
                  <Tooltip title="Who can register or take actions for this tournament">
                    <Info size={16} className="text-blue-500 ml-2" />
                  </Tooltip>
                </div>
              }
              rules={[{ required: true, message: "Please select at least one action scope" }]}
            >
              <Select
                mode="multiple"
                placeholder="Select action scope"
                className="rounded-lg"
                options={marketplaceVisibilityOptions ? marketplaceVisibilityOptions.map(option => ({
                  value: option.value,
                  label: option.label
                })) : [
                  { value: "B2B-Academy", label: "Academies" },
                  { value: "B2B-School", label: "Schools" },
                  { value: "B2B-Club", label: "Clubs" },
                  { value: "B2C-Individual", label: "Individual Customers" },
                  { value: "B2C-Team", label: "Team Customers" },
                ]}
                optionLabelProp="label"
              />
            </Form.Item>
          </Col>

          <Col xs={24}>
            <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
              <div className="flex items-start">
                <div className="bg-yellow-100 p-2 rounded-full mr-3">
                  <Info size={16} className="text-yellow-600" />
                </div>
                <div>
                  <h4 className="font-medium text-yellow-800 mb-1">Marketplace Configuration</h4>
                  <p className="text-yellow-700 text-sm">
                    The visibility scope determines which user types can see your tournament in marketplaces. 
                    The action scope defines who can register or participate. Make sure these settings 
                    align with your tournament's target audience.
                  </p>
                </div>
              </div>
            </div>
          </Col>
        </Row>
      </div>
    )}
  </Card>
);

export default MarketplaceSection; 