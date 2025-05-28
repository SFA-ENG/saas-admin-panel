import { Card, Row, Col, Form, Select, Tooltip } from "antd";
import { ShoppingCart, Info } from "lucide-react";
import SectionHeader from "../utils/SectionHeader";

/**
 * MarketplaceSection component for tournament marketplace configuration
 */
const MarketplaceSection = ({ isExpanded, toggleSection, marketplaceVisibilityOptions, isMobile }) => (
  <Card 
    className={`mb-5 sm:mb-10 ${isMobile ? 'shadow-sm rounded-lg' : 'shadow-md rounded-xl'} border-0 overflow-hidden`}
    bodyStyle={{ 
      padding: isExpanded 
        ? (isMobile ? "0.75rem" : "1.5rem") 
        : "0 1.5rem" 
    }}
    headStyle={{ 
      backgroundColor: "#f8fafc", 
      borderBottom: isExpanded ? "1px solid #e2e8f0" : "none",
      padding: isMobile ? "12px 16px" : "16px 24px"
    }}
    title={
      <SectionHeader
        icon={<ShoppingCart />} 
        title="Marketplace Configuration" 
        sectionId="marketplace"
        tooltip="Configure how the tournament appears and behaves in marketplaces"
        isExpanded={isExpanded}
        onToggle={toggleSection}
        isMobile={isMobile}
      />
    }
  >
    {isExpanded && (
      <div className="bg-white py-2 sm:py-4">
        <Row gutter={[12, 16]}>
          <Col xs={24} md={12}>
            <Form.Item
              name="marketplace_visibility_scope"
              label={
                <div className="flex items-center">
                  <span className={isMobile ? "text-sm" : ""}>Marketplace Visibility Scope</span>
                  <Tooltip title="Who can see this tournament in the marketplace">
                    <Info size={isMobile ? 14 : 16} className="text-blue-500 ml-2" />
                  </Tooltip>
                </div>
              }
              rules={[{ required: true, message: "Please select at least one visibility scope" }]}
            >
              <Select
                mode="multiple"
                placeholder="Select visibility scope"
                className="rounded-lg"
                dropdownMatchSelectWidth={!isMobile}
                maxTagCount={isMobile ? 1 : 3}
                options={marketplaceVisibilityOptions || [
                  { value: "PUBLIC", label: "Public Users" },
                  { value: "MEMBERS", label: "Members Only" }
                ]}
                optionLabelProp="label"
              />
            </Form.Item>
          </Col>
          
          <Col xs={24} md={12}>
            <Form.Item
              name="marketplace_action_scope"
              label={
                <div className="flex items-center">
                  <span className={isMobile ? "text-sm" : ""}>Marketplace Action Scope</span>
                  <Tooltip title="Who can register or take actions for this tournament">
                    <Info size={isMobile ? 14 : 16} className="text-blue-500 ml-2" />
                  </Tooltip>
                </div>
              }
              rules={[{ required: true, message: "Please select at least one action scope" }]}
            >
              <Select
                mode="multiple"
                placeholder="Select action scope"
                className="rounded-lg"
                dropdownMatchSelectWidth={!isMobile}
                maxTagCount={isMobile ? 1 : 3}
                options={[
                  { value: "REGISTER", label: "Registration Allowed" },
                  { value: "VIEW", label: "View Only" }
                ]}
                optionLabelProp="label"
              />
            </Form.Item>
          </Col>

          {/* Only show this info box on desktop or if on mobile and expanded */}
          <Col xs={24}>
            <div className={`bg-yellow-50 ${isMobile ? 'p-2 mt-1 text-xs' : 'p-3 sm:p-4'} rounded-lg border border-yellow-200`}>
              <div className="flex items-start">
                <div className="bg-yellow-100 p-1.5 sm:p-2 rounded-full mr-2 sm:mr-3 flex-shrink-0">
                  <Info size={isMobile ? 12 : 16} className="text-yellow-600" />
                </div>
                <div>
                  <h4 className={`font-medium text-yellow-800 mb-1 ${isMobile ? "text-xs" : "text-sm"}`}>Marketplace Configuration</h4>
                  <p className={`text-yellow-700 ${isMobile ? "text-xs leading-tight" : "text-sm"}`}>
                    The visibility scope determines which user types can see your tournament in marketplaces. 
                    The action scope defines who can register or participate.
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