import { Typography, Tooltip } from "antd";
import { ChevronDown, ChevronUp, HelpCircle } from "lucide-react";
import React from "react";

const { Title } = Typography;

/**
 * SectionHeader component for collapsible section headers
 */
const SectionHeader = ({ icon, title, sectionId, tooltip, isExpanded, onToggle, isMobile = false }) => (
  <div 
    className="flex items-center justify-between py-1 sm:py-2 cursor-pointer w-full" 
    onClick={() => onToggle(sectionId)}
  >
    <div className="flex items-center">
      <div className={`${isMobile ? 'p-1.5 mr-1.5' : 'p-2 mr-3'} rounded-lg bg-blue-50`}>
        {icon && React.cloneElement(icon, { size: isMobile ? 14 : 16 })}
      </div>
      <div>
        <h3 className={`${isMobile ? 'text-sm' : 'text-lg'} font-medium text-gray-800 mb-0`}>{title}</h3>
      </div>
      
      {tooltip && !isMobile && (
        <Tooltip title={tooltip} placement="right">
          <div className="flex items-center ml-2">
            <HelpCircle size={16} className="text-gray-400 hover:text-blue-500" />
          </div>
        </Tooltip>
      )}
    </div>
    
    <div className="flex items-center text-gray-500">
      {isExpanded ? (
        <div className="flex items-center text-blue-500">
          {!isMobile && <span className="mr-2 text-sm">Collapse</span>}
          <ChevronUp size={isMobile ? 16 : 18} />
        </div>
      ) : (
        <div className="flex items-center text-gray-500">
          {!isMobile && <span className="mr-2 text-sm">Expand</span>}
          <ChevronDown size={isMobile ? 16 : 18} />
        </div>
      )}
    </div>
  </div>
);

export default SectionHeader; 