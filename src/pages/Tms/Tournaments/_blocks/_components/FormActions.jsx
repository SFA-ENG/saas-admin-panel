import { Button } from "antd";
import { CheckCircle2 } from "lucide-react";
import AccessControlButton from "Components/AccessControlButton/AccessControlButton";

/**
 * FormActions component for the form submission and cancel buttons
 */
const FormActions = ({ onCancel, onSubmit }) => (
  <div className="flex justify-end space-x-4 sticky bottom-0 bg-white p-4 border-t border-gray-100 shadow-inner mt-8 -mx-6 -mb-6 rounded-b-xl">
    <Button 
      onClick={onCancel} 
      className="px-6 h-11 rounded-lg border-gray-300 hover:border-gray-400 hover:text-gray-800"
    >
      Cancel
    </Button>
    <AccessControlButton
      icon={CheckCircle2}
      title="Create Tournament"
      onClick={onSubmit}
    />
  </div>
);

export default FormActions; 