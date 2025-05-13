import { useState, useEffect } from "react";
import {
  Form,
  Tabs,
  Affix
} from "antd";

// Import Components
import BasicInformationSection from "./_components/sections/BasicInformationSection";
import MediaSection from "./_components/sections/MediaSection";
import TournamentStructureSection from "./_components/sections/TournamentStructureSection";
import MarketplaceSection from "./_components/sections/MarketplaceSection";
import FormActions from "./_components/FormActions";
import { renderSuccessNotifications } from "helpers/error.helpers";
import { FileText, ShoppingCart, Image, TrendingUp } from "lucide-react";

// Import dropdown options from helper file
import {
  tournamentStatusOptions,
  tournamentTypeOptions,
  tournamentFormatOptions,
  sportsOptions,
  genderOptions,
  ageGroupOptions,
  mediaCategoryOptions,
  marketplaceVisibilityOptions,
  locationOptions
} from "../../Tournaments/Tournaments.helper";

// Sample country options for participationRules
const countryOptions = [
  { label: "India", value: "India" },
  { label: "United States", value: "United States" },
  { label: "United Kingdom", value: "United Kingdom" },
  { label: "Australia", value: "Australia" },
  { label: "Canada", value: "Canada" },
  { label: "Japan", value: "Japan" },
  { label: "China", value: "China" },
  { label: "Singapore", value: "Singapore" },
  { label: "Germany", value: "Germany" },
  { label: "France", value: "France" },
  { label: "Brazil", value: "Brazil" },
  { label: "South Africa", value: "South Africa" },
];

// Sample city options
const cityOptions = [
  { label: "Mumbai", value: "Mumbai" },
  { label: "Delhi", value: "Delhi" },
  { label: "Bangalore", value: "Bangalore" },
  { label: "Chennai", value: "Chennai" },
  { label: "Hyderabad", value: "Hyderabad" },
  { label: "Kolkata", value: "Kolkata" },
  { label: "Pune", value: "Pune" },
  { label: "New York", value: "New York" },
  { label: "London", value: "London" },
  { label: "Sydney", value: "Sydney" },
];

// Sample state options
const stateOptions = [
  { label: "Maharashtra", value: "Maharashtra" },
  { label: "Delhi", value: "Delhi" },
  { label: "Karnataka", value: "Karnataka" },
  { label: "Tamil Nadu", value: "Tamil Nadu" },
  { label: "Telangana", value: "Telangana" },
  { label: "West Bengal", value: "West Bengal" },
  { label: "California", value: "California" },
  { label: "New York", value: "New York" },
  { label: "Texas", value: "Texas" },
  { label: "Florida", value: "Florida" },
];

// ==========================================
// Main Component
// ==========================================

const AddTournamentForm = ({ onCancel }) => {
  const [form] = Form.useForm();
  const [expandedSections, setExpandedSections] = useState({
    basic: true,
    media: true,
    marketplace: true,
    seasons: true
  });

  const [isMobile, setIsMobile] = useState(false);
  const [activeTab, setActiveTab] = useState("basic");
  
  // Check if the screen is mobile size
  useEffect(() => {
    const checkIfMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    // Initial check
    checkIfMobile();
    
    // Add event listener for window resize
    window.addEventListener('resize', checkIfMobile);
    
    // Cleanup
    return () => window.removeEventListener('resize', checkIfMobile);
  }, []);
  
  // Process media items to extract the correct data based on the mediaSource
  const processMediaItems = (mediaItems) => {
    if (!mediaItems || !mediaItems.length) return [];
    
    return mediaItems.map(item => {
      // Extract the base media properties
      const { category, usage, variant, position, mediaSource } = item;
      
      // Create a new media item based on the source type
      let mediaItem = {
        category,
        usage,
        variant, 
        position
      };
      
      // Add the URL based on the media source
      if (mediaSource === 'url' && item.url) {
        // If source is URL, use the URL directly
        mediaItem.url = item.url;
      } else if (mediaSource === 'upload' && item.fileUpload) {
        // If source is upload, process the file upload
        const fileList = item.fileUpload.fileList;
        if (fileList && fileList.length > 0) {
          // In a real implementation, we'd upload the file to a server and get a URL back
          // For now, use the filename or a generated URL based on the file
          mediaItem.url = fileList[0].name 
            ? `https://example.com/uploads/${fileList[0].name}` 
            : "https://example.com/uploads/uploaded_file.jpg";
        }
      }
      
      return mediaItem;
    });
  };
  
  // Form submission handler
  const onFinish = (values) => {
    console.log("Tournament form values:", values);
    
    // Process the media items to handle different input methods
    const processedMedias = processMediaItems(values.medias);
    
    // Transform form values to match the contract structure
    const transformedValues = {
      tenantId: "df04533a-4452-53e6-87d9-e1dabcef5d17", // Static tenant ID
      type: values.type || "OPEN_REGISTRATION_TEAM",
      name: values.tournament_name,
      description: values.tournament_description,
      marketplaceVisibilityScope: values.marketplaceVisibilityScope || [],
      marketplaceActionScope: values.marketplaceActionScope || [],
      medias: processedMedias,
      seasons: values.seasons?.map(season => {
        // Process season media items
        const seasonMedias = processMediaItems(season.medias);
        
        return {
          name: season.season_name,
          description: season.season_description,
          termsAndConditions: season.termsAndConditions,
          rulesAndRegulations: season.rulesAndRegulations,
          medias: seasonMedias,
          participationRules: season.participationRules || {
            AND: [
              { field: "COUNTRY", operator: "=", value: "India" }
            ]
          },
          startDate: season.duration?.[0]?.format('YYYY-MM-DD'),
          endDate: season.duration?.[1]?.format('YYYY-MM-DD'),
          registrationStartDate: season.registration_duration?.[0]?.format('YYYY-MM-DD'),
          registrationEndDate: season.registration_duration?.[1]?.format('YYYY-MM-DD'),
          locations: season.locations || [],
          sports: season.sports?.map(sport => ({
            sportsId: sport.sportsId,
            events: sport.events?.map(event => ({
              sportEventId: event.sportEventId,
              termsAndConditions: event.termsAndConditions,
              rulesAndRegulations: event.rulesAndRegulations,
              startDate: event.event_duration?.[0]?.format('YYYY-MM-DD'),
              endDate: event.event_duration?.[1]?.format('YYYY-MM-DD'),
              subEvents: event.sub_events?.map(subEvent => {
                // Include subEventId if it exists
                const baseSubEvent = {
                  name: subEvent.sub_event_name,
                  description: subEvent.sub_event_description,
                  participationRules: subEvent.participationRules,
                  isActive: subEvent.isActive !== false,
                  isPublished: subEvent.isPublished !== false,
                  status: subEvent.status || "DRAFT",
                  teamMetadata: subEvent.teamMetadata,
                  inventoryMetada: subEvent.inventoryMetadata,
                  gameFormat: subEvent.gameFormat
                };
                
                // Add subEventId if it exists
                if (subEvent.subEventId) {
                  baseSubEvent.subEventId = subEvent.subEventId;
                }
                
                // Handle different pricing structures
                if (subEvent.pricing) {
                  // If it has the complex pricing structure with prices array
                  if (Array.isArray(subEvent.pricing.prices)) {
                    baseSubEvent.pricing = {
                      currency: subEvent.pricing.currency,
                      prices: subEvent.pricing.prices
                    };
                  } 
                  // If it has a simple pricing structure
                  else if (subEvent.pricing.amount) {
                    baseSubEvent.pricing = {
                      currency: subEvent.pricing.currency,
                      amount: subEvent.pricing.amount,
                      type: subEvent.pricing.type
                    };
                  }
                }
                
                return baseSubEvent;
              })
            }))
          }))
        };
      }) || []
    };
    
    console.log("Transformed values:", transformedValues);
    
    renderSuccessNotifications({
      title: "Success",
      message: "Tournament Created Successfully",
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

  // Tab items for mobile navigation
  const tabItems = [
    {
      key: "basic",
      label: (
        <div className="flex flex-col items-center text-xs">
          <FileText size={16} />
          <span>Basic</span>
        </div>
      ),
    },
    {
      key: "marketplace",
      label: (
        <div className="flex flex-col items-center text-xs">
          <ShoppingCart size={16} />
          <span>Market</span>
        </div>
      ),
    },
    {
      key: "media",
      label: (
        <div className="flex flex-col items-center text-xs">
          <Image size={16} />
          <span>Media</span>
        </div>
      ),
    },
    {
      key: "seasons",
      label: (
        <div className="flex flex-col items-center text-xs">
          <TrendingUp size={16} />
          <span>Structure</span>
        </div>
      ),
    },
  ];

  return (
      <Form
        form={form}
        layout="vertical"
        onFinish={onFinish}
        initialValues={{
          is_active: true,
          is_published: true,
          featured: false,
          type: "OPEN_REGISTRATION_TEAM",
          sports: [],
          seasons: [],
          marketplaceVisibilityScope: ["B2C-INDIVIDUAL", "B2C-TEAM"],
          marketplaceActionScope: ["B2B-Academy", "B2B-School"],
        }}
        className="tournament-form"
      >
        {/* Mobile Tab Navigation */}
        {isMobile && (
          <Affix offsetTop={0}>
            <div className="bg-white shadow-md border-b border-gray-200">
              <Tabs 
                items={tabItems}
                activeKey={activeTab}
                onChange={setActiveTab}
                centered
                size="small"
                className="tournament-tabs"
              />
            </div>
          </Affix>
        )}

        <div className={`tournament-form-container px-2 sm:px-4 md:px-6 ${isMobile ? 'pt-2' : ''}`}>
          {/* Tournament Basic Information */}
          <div id="basic" className={isMobile && activeTab !== "basic" ? "hidden" : ""}>
            <BasicInformationSection 
              isExpanded={isSectionExpanded("basic")} 
              toggleSection={toggleSection} 
              tournamentTypeOptions={tournamentTypeOptions}
              tournamentStatusOptions={tournamentStatusOptions}
              isMobile={isMobile}
            />
          </div>

          {/* Marketplace Configuration */}
          <div id="marketplace" className={isMobile && activeTab !== "marketplace" ? "hidden" : ""}>
            <MarketplaceSection
              isExpanded={isSectionExpanded("marketplace")}
              toggleSection={toggleSection}
              marketplaceVisibilityOptions={marketplaceVisibilityOptions}
              isMobile={isMobile}
            />
          </div>

          {/* Tournament Media */}
          <div id="media" className={isMobile && activeTab !== "media" ? "hidden" : ""}>
            <MediaSection 
              isExpanded={isSectionExpanded("media")} 
              toggleSection={toggleSection} 
              mediaCategoryOptions={mediaCategoryOptions}
              isMobile={isMobile}
            />
          </div>
          
          {/* Tournament Structure */}
          <div id="seasons" className={isMobile && activeTab !== "seasons" ? "hidden" : ""}>
            <TournamentStructureSection 
              isExpanded={isSectionExpanded("seasons")} 
              toggleSection={toggleSection} 
              generateId={generateId} 
              tournamentFormatOptions={tournamentFormatOptions}
              sportsOptions={sportsOptions}
              genderOptions={genderOptions}
              ageGroupOptions={ageGroupOptions}
              locationOptions={locationOptions}
              countryOptions={countryOptions}
              cityOptions={cityOptions}
              stateOptions={stateOptions}
              isMobile={isMobile}
            />
          </div>
        </div>
        
        {/* Form Actions */}
        <FormActions onCancel={onCancel} onFinish={onFinish} isMobile={isMobile} />
      </Form>
  );
};

export default AddTournamentForm; 