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
  genderOptions,
  ageGroupOptions,
  locationOptions,
  countryOptions,
  cityOptions,
  stateOptions
}) => (
  <Card 
    className="mb-10 shadow-md rounded-xl border-0 overflow-hidden" 
    bodyStyle={{ padding: isExpanded ? "1.5rem" : "0 1.5rem" }}
    headStyle={{ backgroundColor: "#f8fafc", borderBottom: isExpanded ? "1px solid #e2e8f0" : "none" }}
    title={
      <SectionHeader
        icon={<Award />} 
        title="Tournament Structure" 
        sectionId="seasons" 
        tooltip="Set up the hierarchical structure: Seasons → Sports → Events → Sub-events"
        isExpanded={isExpanded}
        onToggle={toggleSection}
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
                    genderOptions={genderOptions}
                    ageGroupOptions={ageGroupOptions}
                    locationOptions={locationOptions}
                    countryOptions={countryOptions}
                    cityOptions={cityOptions}
                    stateOptions={stateOptions}
                  />
                </div>
              ))}
              
              <Form.Item>
                <Button
                  type="dashed"
                  onClick={() => addSeason({ id: generateId() })}
                  block
                  icon={<PlusCircle size={16} />}
                  className="hover:border-blue-500 hover:text-blue-500 rounded-lg h-11 mt-4"
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

export default TournamentStructureSection; 