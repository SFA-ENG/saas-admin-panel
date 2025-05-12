import { Typography, Tooltip } from "antd";
import { ChevronDown, ChevronUp, HelpCircle } from "lucide-react";

const { Title } = Typography;

/**
 * SectionHeader component for collapsible section headers
 */
const SectionHeader = ({ icon, title, sectionId, tooltip, isExpanded, onToggle,}) => (
  <div 
    className="flex items-center justify-between py-2 cursor-pointer w-full" 
    onClick={() => onToggle(sectionId)}
  >
    <div className="flex items-center">
      <div className="p-2 rounded-lg bg-blue-50 mr-3">
        {icon}
      </div>
      <div>
        <h3 className="text-lg font-medium text-gray-800 mb-0">{title}</h3>
      </div>
      
      {tooltip && (
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
          <span className="mr-2 text-sm">Collapse</span>
          <ChevronUp size={18} />
        </div>
      ) : (
        <div className="flex items-center text-gray-500">
          <span className="mr-2 text-sm">Expand</span>
          <ChevronDown size={18} />
        </div>
      )}
    </div>
  </div>
);

export default SectionHeader; 