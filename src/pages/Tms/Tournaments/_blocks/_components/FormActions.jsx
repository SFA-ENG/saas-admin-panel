import AccessControlButton from "Components/AccessControlButton/AccessControlButton";
import { Save, ArrowLeft } from "lucide-react";

/**
 * FormActions component for tournament form actions
 */
const FormActions = ({ onCancel, onFinish }) => {
  return (
    <div className="sticky bottom-0 left-0 right-0 bg-white shadow-lg border-t border-gray-100 p-4 z-10">
      <div className="flex justify-between items-center max-w-7xl mx-auto">
        <AccessControlButton
          type="primary"
          title="Back to List"
          icon={ArrowLeft}
          onClick={onCancel}
        >
          Back to List
        </AccessControlButton>
        
        <div className="flex space-x-3">
          
          
          
          
          <AccessControlButton
            type="primary" 
            title="Save Tournament"
            icon={Save}
            onClick={onFinish}
          >
            Save Tournament
          </AccessControlButton>
         
        </div>
      </div>
    </div>
  );
};

export default FormActions; 