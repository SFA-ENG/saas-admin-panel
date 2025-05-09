import { useState } from "react";
import {
  Form,
  notification,
} from "antd";
import { CheckCircle2 } from "lucide-react";

// Import Components
import BasicInformationSection from "./_components/sections/BasicInformationSection";
import MediaSection from "./_components/sections/MediaSection";
import TournamentStructureSection from "./_components/sections/TournamentStructureSection";
import FormActions from "./_components/FormActions";

// ==========================================
// Main Component
// ==========================================

const AddTournamentForm = ({ onCancel }) => {
  const [form] = Form.useForm();
  const [expandedSections, setExpandedSections] = useState({});
  
  // Form submission handler
  const onSubmit = (values) => {
    console.log("Tournament form values:", values);
    notification.success({
      message: "Tournament Created",
      description: `Tournament ${values.tournament_name} has been created successfully.`,
      icon: <CheckCircle2 className="text-green-500" />,
    });
    // In a real implementation, this would send data to an API
    onCancel(); // Return to tournaments list
  };

  // Toggle section expansion
  const toggleSection = (sectionId) => {
    setExpandedSections((prev) => ({
      ...prev,
      [sectionId]: !prev[sectionId],
    }));
  };
  
  // Check if a section is expanded
  const isSectionExpanded = (sectionId) => {
    return expandedSections[sectionId] !== false; // Default to expanded
  };

  // Function to generate a unique ID for new items
  const generateId = () => `item_${Date.now()}_${Math.floor(Math.random() * 1000)}`;

  return (
    <Form
      form={form}
      layout="vertical"
      onFinish={onSubmit}
      initialValues={{
        is_active: true,
        is_published: true,
        featured: false,
        sports: [],
        seasons: [
          {
            id: generateId(),
            sports: [
              {
                id: generateId(),
                events: [
                  {
                    id: generateId(),
                    sub_events: [],
                  },
                ],
              },
            ],
          },
        ],
      }}
      className="tournament-form"
    >
      {/* Tournament Basic Information */}
      <BasicInformationSection 
        isExpanded={isSectionExpanded("basic")} 
        toggleSection={toggleSection} 
      />

      {/* Tournament Media */}
      <MediaSection 
        isExpanded={isSectionExpanded("media")} 
        toggleSection={toggleSection} 
      />
      
      {/* Tournament Structure */}
      <TournamentStructureSection 
        isExpanded={isSectionExpanded("seasons")} 
        toggleSection={toggleSection} 
        generateId={generateId} 
      />
      
      {/* Form Actions */}
      <FormActions onCancel={onCancel} onSubmit={onSubmit} />
    </Form>
  );
};

export default AddTournamentForm; 