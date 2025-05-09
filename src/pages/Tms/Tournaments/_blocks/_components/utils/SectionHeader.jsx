import React from "react";
import { Button, Typography, Tooltip } from "antd";
import { ChevronDown, ChevronUp, Info } from "lucide-react";

const { Title } = Typography;

/**
 * SectionHeader component for rendering collapsible section headers
 */
const SectionHeader = ({ icon, title, sectionId, tooltip, isExpanded, onToggle }) => (
  <div className="flex items-center justify-between mb-5">
    <div className="flex items-center">
      {React.cloneElement(icon, { 
        size: 22, 
        className: "text-blue-600 mr-3"
      })}
      <Title level={4} className="!mb-0 !text-gray-800">
        {title}
      </Title>
      {tooltip && (
        <Tooltip title={tooltip}>
          <Info size={16} className="text-gray-400 ml-2 cursor-help" />
        </Tooltip>
      )}
    </div>
    <Button
      type="text"
      icon={isExpanded 
        ? <ChevronUp size={18} className="text-gray-500" /> 
        : <ChevronDown size={18} className="text-gray-500" />
      }
      onClick={() => onToggle(sectionId)}
      className="hover:bg-gray-100 rounded-full h-9 w-9 flex items-center justify-center p-0"
    />
  </div>
);

export default SectionHeader; 