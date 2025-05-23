import { Card, Form, Button } from "antd";
import { Award, PlusCircle } from "lucide-react";
import SectionHeader from "../utils/SectionHeader";
import SeasonCard from "../cards/SeasonCard";

/**
 * TournamentStructureSection component for managing tournament structure
 */
const TournamentStructureSection = ({ 
  isExpanded, 
  toggleSection, 
  generateId,
  tournamentFormatOptions,
  sportsOptions,
  sportsData,
  genderOptions,
  ageGroupOptions,
  locationOptions,
  countryOptions,
  cityOptions,
  stateOptions,
  isMobile,
  fetchLocationsForCountry,
  selectedCountryCode
}) => {
  const form = Form.useFormInstance(); // Get the form instance from the context
  
  const generateSafeId = () => {
    // Generate a random string that's NOT a UUID but uniquely identifies items in the UI
    return `temp_${Math.random().toString(36).substring(2, 11)}`;
  };

  return (
    <Card 
      className={`mb-10 ${isMobile ? 'shadow-sm rounded-lg' : 'shadow-md rounded-xl'} border-0 overflow-hidden`} 
      bodyStyle={{ padding: isExpanded ? (isMobile ? "1rem" : "1.5rem") : "0 1.5rem" }}
      headStyle={{ backgroundColor: "#f8fafc", borderBottom: isExpanded ? "1px solid #e2e8f0" : "none" }}
      title={
        <SectionHeader
          icon={<Award />} 
          title="Tournament Structure" 
          sectionId="seasons" 
          tooltip="Set up the hierarchical structure: Seasons → Sports → Events → Sub-events"
          isExpanded={isExpanded}
          onToggle={toggleSection}
          isMobile={isMobile}
        />
      }
    >
      {isExpanded && (
        <div className="bg-white py-4">
          <Form.List name="seasons">
            {(seasons, { add: addSeason, remove: removeSeason }) => (
              <>
                {seasons.map((season, seasonIndex) => (
                  <div key={season.key} className="mb-8">
                    <SeasonCard 
                      season={season} 
                      removeSeason={removeSeason} 
                      seasons={seasons} 
                      seasonIndex={seasonIndex} 
                      generateId={generateId} 
                      tournamentFormatOptions={tournamentFormatOptions}
                      sportsOptions={sportsOptions}
                      sportsData={sportsData}
                      genderOptions={genderOptions}
                      ageGroupOptions={ageGroupOptions}
                      locationOptions={locationOptions}
                      countryOptions={countryOptions}
                      cityOptions={cityOptions}
                      stateOptions={stateOptions}
                      isMobile={isMobile}
                      fetchLocationsForCountry={fetchLocationsForCountry}
                      selectedCountryCode={selectedCountryCode}
                      form={form}
                    />
                  </div>
                ))}
                
                <Form.Item>
                  <Button
                    type="dashed"
                    onClick={() => addSeason({ 
                      id: generateSafeId(),
                      season_name: `Season ${seasons.length + 1}`,
                      isActive: true,
                      isPublished: true
                    })}
                    block
                    icon={<PlusCircle size={18} />}
                    className="hover:border-blue-500 hover:text-blue-500 rounded-lg h-12"
                  >
                    Add Season
                  </Button>
                </Form.Item>
              </>
            )}
          </Form.List>
        </div>
      )}
    </Card>
  );
};

export default TournamentStructureSection; 