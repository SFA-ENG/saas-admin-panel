import AccessControlButton from "Components/AccessControlButton/AccessControlButton";
import { Save, ArrowLeft } from "lucide-react";

/**
 * FormActions component for tournament form actions
 */
const FormActions = ({ onCancel, onFinish, isMobile }) => {
  return (
    <div className="sticky bottom-0 left-0 right-0 bg-white shadow-lg border-t border-gray-100 p-4 z-10">
      <div className={`${isMobile ? 'flex flex-col' : 'flex justify-between items-center'} max-w-7xl mx-auto`}>
        <div className={`${isMobile ? 'w-full mb-4 flex justify-center' : ''}`}>
          <AccessControlButton
            type="default"
            title="Back to List"
            icon={ArrowLeft}
            onClick={onCancel}
            className={`${isMobile ? 'w-full py-2.5' : ''}`}
          >
            {isMobile ? "Back to List" : "Back to List"}
          </AccessControlButton>
        </div>
        
        <div className={`${isMobile ? 'w-full flex justify-center' : 'flex space-x-3'}`}>
          <AccessControlButton
            type="primary" 
            title="Save Tournament"
            icon={Save}
            onClick={onFinish}
            className={`${isMobile ? 'w-full py-2.5' : ''}`}
          >
            Save Tournament
          </AccessControlButton>
        </div>
      </div>
    </div>
  );
};

export default FormActions; 