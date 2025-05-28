import AccessControlButton from "Components/AccessControlButton/AccessControlButton";
import { Save } from "lucide-react";

/**
 * FormActions component for tournament form actions
 */
const FormActions = ({ onCancel, onFinish, isMobile }) => {
  return (
               
        <div className={`${isMobile ? 'w-full flex justify-center' : 'flex justify-end'}`}>
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
  );
};

export default FormActions; 