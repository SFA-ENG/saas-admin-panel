import { useState, useEffect } from "react";
import {
  Form,
  Tabs,
  Affix,
  Button,
  notification
} from "antd";
// Import Components
import BasicInformationSection from "./_components/sections/BasicInformationSection";
import MediaSection from "./_components/sections/MediaSection";
import TournamentStructureSection from "./_components/sections/TournamentStructureSection";
import MarketplaceSection from "./_components/sections/MarketplaceSection";
import { renderSuccessNotifications, renderErrorNotifications } from "helpers/error.helpers";
import { FileText, ShoppingCart, Image, TrendingUp, Settings } from "lucide-react";
import { useNavigate } from "react-router-dom";
import httpClient from "http-client/http-client";

// Import dropdown options from helper file
import {
  tournamentStatusOptions,
  tournamentTypeOptions,
  tournamentFormatOptions,
  genderOptions,
  ageGroupOptions,
  mediaCategoryOptions,
  marketplaceVisibilityOptions
} from "../../Tournaments/Tournaments.helper";
import { useApiMutation } from "hooks/useApiQuery/useApiQuery";

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

const AddTournamentForm = ({ onCancel, refetchTournaments }) => {
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const [expandedSections, setExpandedSections] = useState({
    basic: true,
    media: true,
    marketplace: true,
    seasons: true
  });

  // Add creation level state
  const [creationLevel, setCreationLevel] = useState("tournament"); // tournament, season, event, subevent
  const [isMobile, setIsMobile] = useState(false);
  const [activeTab, setActiveTab] = useState("basic");
  const [sportsOptions, setSportsOptions] = useState([]);
  const [rawSportsData, setRawSportsData] = useState([]);
  const [qualifierRules, setQualifierRules] = useState([]);
  const [isLoadingMasterData, setIsLoadingMasterData] = useState(true);
  const [hasSavedDraft, setHasSavedDraft] = useState(false);
  const [locationOptions, setLocationOptions] = useState([]);
  const [countryCode, setCountryCode] = useState("IN"); // Default country code
  const [availableCountries, setAvailableCountries] = useState([
    { label: "India", value: "IN" },
    { label: "United States", value: "US" },
    { label: "United Kingdom", value: "GB" }
  ]); // Default countries
  const [locationTableReference, setLocationTableReference] = useState("master_locations"); // Default table reference
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Creation level options
  const creationLevelOptions = [
    {
      value: "tournament",
      label: "Tournament Only",
      description: "Create just the tournament with basic information"
    },
    {
      value: "season",
      label: "Tournament + Season",
      description: "Create tournament with at least one season"
    },
    {
      value: "event",
      label: "Tournament + Season + Event",
      description: "Create tournament with seasons and events"
    },
    {
      value: "subevent",
      label: "Complete Structure",
      description: "Create tournament with seasons, events, and sub-events"
    }
  ];

  // Helper function to validate UUID format - moved to component level
  const isValidUUID = (id) => {
    if (!id || typeof id !== 'string') return false;
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
    return uuidRegex.test(id);
  };

  // Function to get dynamic validation rules based on creation level
  const getDynamicValidationRules = () => {
    const rules = {
      tournament: {
        // Tournament level - only basic fields required
        required: ['name', 'description', 'competition_type', 'status'],
        optional: ['marketplace_visibility_scope', 'marketplace_action_scope', 'medias']
      },
      season: {
        // Tournament + Season level - tournament fields + season fields required
        required: ['name', 'description', 'competition_type', 'status', 'seasons'],
        seasonRequired: ['name', 'description', 'start_date', 'end_date', 'registration_start_date', 'registration_end_date'],
        optional: ['marketplace_visibility_scope', 'marketplace_action_scope', 'medias']
      },
      event: {
        // Tournament + Season + Event level - previous fields + event fields required
        required: ['name', 'description', 'competition_type', 'status', 'seasons'],
        seasonRequired: ['name', 'description', 'start_date', 'end_date', 'registration_start_date', 'registration_end_date', 'sports'],
        eventRequired: ['master_sport_events_id', 'start_date', 'end_date'],
        optional: ['marketplace_visibility_scope', 'marketplace_action_scope', 'medias']
      },
      subevent: {
        // Complete structure - all fields required
        required: ['name', 'description', 'competition_type', 'status', 'seasons'],
        seasonRequired: ['name', 'description', 'start_date', 'end_date', 'registration_start_date', 'registration_end_date', 'sports'],
        eventRequired: ['master_sport_events_id', 'start_date', 'end_date', 'sub_events'],
        subeventRequired: ['name', 'description', 'expected_participants', 'participation_rules', 'meta_data', 'pricing'],
        optional: ['marketplace_visibility_scope', 'marketplace_action_scope', 'medias']
      }
    };
    
    return rules[creationLevel] || rules.tournament;
  };

  // Function to validate form based on creation level
  const validateFormByLevel = (values) => {
    const rules = getDynamicValidationRules();
    const errors = [];

    // Validate tournament level fields
    rules.required.forEach(field => {
      if (!values[field] || (Array.isArray(values[field]) && values[field].length === 0)) {
        errors.push(`${field} is required for ${creationLevel} level creation`);
      }
    });

    // Validate season level fields if applicable
    if (creationLevel !== 'tournament' && rules.seasonRequired) {
      if (!values.seasons || values.seasons.length === 0) {
        errors.push('At least one season is required');
      } else {
        values.seasons.forEach((season, seasonIndex) => {
          rules.seasonRequired.forEach(field => {
            if (!season[field] || (Array.isArray(season[field]) && season[field].length === 0)) {
              errors.push(`Season ${seasonIndex + 1}: ${field} is required`);
            }
          });
        });
      }
    }

    // Validate event level fields if applicable
    if ((creationLevel === 'event' || creationLevel === 'subevent') && rules.eventRequired) {
      if (values.seasons) {
        values.seasons.forEach((season, seasonIndex) => {
          if (!season.sports || season.sports.length === 0) {
            errors.push(`Season ${seasonIndex + 1}: At least one sport with events is required`);
          } else {
            season.sports.forEach((sport, sportIndex) => {
              if (!sport.events || sport.events.length === 0) {
                errors.push(`Season ${seasonIndex + 1}, Sport ${sportIndex + 1}: At least one event is required`);
              } else {
                sport.events.forEach((event, eventIndex) => {
                  rules.eventRequired.forEach(field => {
                    if (field !== 'sub_events' && (!event[field] || (Array.isArray(event[field]) && event[field].length === 0))) {
                      errors.push(`Season ${seasonIndex + 1}, Sport ${sportIndex + 1}, Event ${eventIndex + 1}: ${field} is required`);
                    }
                  });
                });
              }
            });
          }
        });
      }
    }

    // Validate subevent level fields if applicable
    if (creationLevel === 'subevent' && rules.subeventRequired) {
      if (values.seasons) {
        values.seasons.forEach((season, seasonIndex) => {
          if (season.sports) {
            season.sports.forEach((sport, sportIndex) => {
              if (sport.events) {
                sport.events.forEach((event, eventIndex) => {
                  if (!event.sub_events || event.sub_events.length === 0) {
                    errors.push(`Season ${seasonIndex + 1}, Sport ${sportIndex + 1}, Event ${eventIndex + 1}: At least one sub-event is required`);
                  } else {
                    event.sub_events.forEach((subevent, subeventIndex) => {
                      rules.subeventRequired.forEach(field => {
                        if (!subevent[field]) {
                          errors.push(`Season ${seasonIndex + 1}, Sport ${sportIndex + 1}, Event ${eventIndex + 1}, Sub-event ${subeventIndex + 1}: ${field} is required`);
                        }
                      });
                    });
                  }
                });
              }
            });
          }
        });
      }
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  };

  const { mutate: createTournament, isLoading: isCreatingTournament } = useApiMutation({
    url: "/tms/tournaments",
    method: "POST",
    onSuccess: (data) => {
      // Show success notification
      renderSuccessNotifications({title:"Success", message:"Tournament Created Successfully"});
      
      // Clear saved form data
      localStorage.removeItem('tournamentFormData');
      
      // Reset form fields
      form.resetFields();
      
      // Reset submitting state
      setIsSubmitting(false);
      
      // Refetch tournaments to update the list
      if (typeof refetchTournaments === 'function') {
        refetchTournaments();
      }
      
      // Clear the hash first (important for hash-based routing)
      window.location.hash = "";
      
      // Navigate to tournaments page with replace to avoid back button issues
      navigate("/tournaments", { replace: true });
    },
    onError: (error) => {
      // Check if error is undefined or null, which might indicate a network issue
      if (!error) {
        renderErrorNotifications({
          title: "Network Error",
          message: "Unable to connect to the server. Please check your internet connection and try again."
        });
        return;
      }
      
      // Check if the error is a unique key violation
      const hasUniqueKeyViolation = error?.errors?.some(err => 
        err.code === "UNIQUE_KEY_VIOLATION" || 
        (err.rawErrors && err.rawErrors.some(rawErr => 
          rawErr.code === "UNIQUE_KEY_VIOLATION"
        ))
      );
      
      if (hasUniqueKeyViolation) {
        // Get the specific ID that's causing the issue
        const violatingId = error?.errors?.[0]?.message?.match(/Key \(id\)=\((.*?)\)/)?.[1] || 
                            error?.errors?.[0]?.rawErrors?.[0]?.message?.match(/Key \(id\)=\((.*?)\)/)?.[1];
        
        renderErrorNotifications({
          title: "ID Conflict Error",
          message: `Cannot create tournament because an ID conflict was detected${violatingId ? ` (${violatingId})` : ''}. Please try again with a new submission.`
        });
      } else {
        // For other errors, extract the error message if possible
        let errorMessage = "Failed to create tournament. Please check the form and try again.";
        
        if (error.message) {
          errorMessage = error.message;
        } else if (error.errors && error.errors.length > 0) {
          if (error.errors[0].message) {
            errorMessage = error.errors[0].message;
          }
        }
        
        renderErrorNotifications({
          title: "Error Creating Tournament",
          message: errorMessage
        });
      }
    }
  });
  
  // Deeply convert string dates to moment objects
  const convertDatesToMoment = (obj) => {
    if (!obj || typeof obj !== 'object') return obj;
    
    // If it's an array, map through it
    if (Array.isArray(obj)) {
      return obj.map(item => convertDatesToMoment(item));
    }
    
    // Clone the object to avoid mutating the original
    const result = { ...obj };
    
    // Process each property
    Object.keys(result).forEach(key => {
      const value = result[key];
      
      // Convert arrays that look like date ranges
      if (Array.isArray(value) && 
          (key.includes('duration') || key.includes('date') || key === 'time_range')) {
        result[key] = value.map(dateStr => {
          if (!dateStr) return null;
          try {
            const momentDate = moment(dateStr);
            return momentDate.isValid() ? momentDate : null;
          } catch (e) {
            return null;
          }
        });
      } 
      // Recursively process nested objects and arrays
      else if (value && typeof value === 'object') {
        result[key] = convertDatesToMoment(value);
      }
    });
    
    return result;
  };
  
  // Clear form data from localStorage and reset form
  const clearSavedFormData = () => {
    try {
      localStorage.removeItem('tournamentFormData');
      setHasSavedDraft(false);
      form.resetFields();
    } catch (error) {
      // Silent error handling
    }
  };
  
  // Load saved form data from localStorage on component mount
  useEffect(() => {
    const savedFormData = localStorage.getItem('tournamentFormData');
    if (savedFormData) {
      try {
        let parsedData = JSON.parse(savedFormData);
        
        // Remove any ID fields that might cause conflicts
        if (parsedData.id) delete parsedData.id;
        if (parsedData.tournament_id) delete parsedData.tournament_id;
        
        // Also check for IDs in seasons
        if (parsedData.seasons && Array.isArray(parsedData.seasons)) {
          parsedData.seasons = parsedData.seasons.map(season => {
            const seasonCopy = {...season};
            if (seasonCopy.id) delete seasonCopy.id;
            if (seasonCopy.season_id) delete seasonCopy.season_id;
            
            // Clean IDs from sports if they exist
            if (seasonCopy.sports && Array.isArray(seasonCopy.sports)) {
              seasonCopy.sports = seasonCopy.sports.map(sport => {
                const sportCopy = {...sport};
                if (sportCopy.id) delete sportCopy.id;
                if (sportCopy.sports_id) delete sportCopy.sports_id;
                return sportCopy;
              });
            }
            
            return seasonCopy;
          });
        }
        
        setHasSavedDraft(true);
        
        // Use the deep conversion function
        parsedData = convertDatesToMoment(parsedData);
        
        // Set the form values
        form.setFieldsValue(parsedData);
        
      } catch (error) {
        // If there's an error, clear the potentially corrupted data
        localStorage.removeItem('tournamentFormData');
      }
    }
  }, [form]);

  // Save form data to localStorage whenever it changes
  const saveFormData = () => {
    try {
      const currentValues = form.getFieldsValue();
      
      // Create a deep clone of the values to avoid modifying the original object
      const valuesToSave = JSON.parse(JSON.stringify(currentValues));
      
      // Remove any ID fields that might cause conflicts
      if (valuesToSave.id) delete valuesToSave.id;
      if (valuesToSave.tournament_id) delete valuesToSave.tournament_id;
      
      // Also check for IDs in seasons
      if (valuesToSave.seasons && Array.isArray(valuesToSave.seasons)) {
        valuesToSave.seasons = valuesToSave.seasons.map(season => {
          const seasonCopy = {...season};
          if (seasonCopy.id) delete seasonCopy.id;
          if (seasonCopy.season_id) delete seasonCopy.season_id;
          
          // Clean IDs from sports if they exist
          if (seasonCopy.sports && Array.isArray(seasonCopy.sports)) {
            seasonCopy.sports = seasonCopy.sports.map(sport => {
              const sportCopy = {...sport};
              if (sportCopy.id) delete sportCopy.id;
              if (sportCopy.sports_id) delete sportCopy.sports_id;
              return sportCopy;
            });
          }
          
          return seasonCopy;
        });
      }
      
      localStorage.setItem('tournamentFormData', JSON.stringify(valuesToSave));
      setHasSavedDraft(true);
    } catch (error) {
      // Silent error handling
    }
  };

  // Add event listener to save data before user leaves the page
  useEffect(() => {
    const handleBeforeUnload = () => {
      saveFormData();
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    
    // Also save periodically
    const saveInterval = setInterval(saveFormData, 5000);

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
      clearInterval(saveInterval);
    };
  }, []);
  
  // Fetch sports and qualifier rules data on component mount
  useEffect(() => {
    const fetchMasterData = async () => {
      setIsLoadingMasterData(true);
      try {
        // Using Promise.all to fetch API endpoints in parallel where possible
        const sportsResponse = await httpClient.get({ 
          url: '/tms/master/sports',
          params: { type: "DETAILED" }
        });
        
        // First get qualifier rules
        const qualifierRulesResponse = await httpClient.get({ url: '/tms/master/qualifier-rules' });
        
        if (qualifierRulesResponse?.data) {
          // Save the full qualifier rules data
          const rulesData = Array.isArray(qualifierRulesResponse.data) 
            ? qualifierRulesResponse.data 
            : (qualifierRulesResponse.data.data || []);
            
          setQualifierRules(rulesData);
          
          // Find the rule for tournament locations
          const locationRule = rulesData.find(rule => 
            rule.type === 'tournament' && 
            rule.attribute_name === 'country' &&
            rule.table_reference === 'master_locations'
          );
          
          if (locationRule) {
            setLocationTableReference(locationRule.table_reference);
            // We could also extract the country_code here if needed
            if (locationRule.country_code) {
              setCountryCode(locationRule.country_code);
            }
          }
        }
        
        // Process sports data for dropdown options
        if (sportsResponse && sportsResponse.data) {
          // Check if response has data property or is directly an array
          const sportsData = Array.isArray(sportsResponse.data) 
            ? sportsResponse.data 
            : (sportsResponse.data.data || []);
          
          // Save the raw sports data to use for events
          setRawSportsData(sportsData);
          
          if (sportsData && sportsData.length > 0) {
            const formattedSportsOptions = sportsData.map(sport => {
              // For each sport, also prepare its events data
              const eventOptions = sport.events?.map(event => ({
                label: event.type || "Unknown Event",
                value: event.event_id,
                description: `${event.category_tree?.primary || ''} ${event.category_tree?.secondary || ''}`.trim(),
                metadata: event.metadata
              })) || [];
              
              return {
                label: sport.name,
                value: sport.sport_id || sport.id, // Handle both possible field names
                icon: sport.icon || null,
                description: sport.description || '',
                events: eventOptions // Include events data with each sport
              };
            });
            
            setSportsOptions(formattedSportsOptions);
            
            // Force render to make sure the UI updates
            setTimeout(() => {
              form.setFieldsValue(form.getFieldsValue());
            }, 100);
          } else {
            // Provide at least one valid UUID option for testing
            setSportsOptions([
              { 
                label: "Badminton", 
                value: "e2c7520b-0e8a-55ba-820f-c305a4596fdb", 
                description: "Badminton sport",
                events: [
                  {
                    label: "Singles",
                    value: "fdcfa36f-5e44-482e-8634-f99f72d13805",
                    description: "Individual"
                  }
                ]
              },
              { 
                label: "Football", 
                value: "603273a1-a3ad-5a03-a1f6-e38ec0062e95", 
                description: "Football sport",
                events: [
                  {
                    label: "Team",
                    value: "141bff2d-25b7-41ac-9e7d-6dc32ace327b",
                    description: "Team"
                  }
                ] 
              }
            ]);
          }
        } else {
          // Provide fallback options
          setSportsOptions([
            { 
              label: "Badminton", 
              value: "e2c7520b-0e8a-55ba-820f-c305a4596fdb", 
              description: "Badminton sport",
              events: [
                {
                  label: "Singles",
                  value: "fdcfa36f-5e44-482e-8634-f99f72d13805",
                  description: "Individual"
                }
              ]
            },
            { 
              label: "Football", 
              value: "603273a1-a3ad-5a03-a1f6-e38ec0062e95", 
              description: "Football sport",
              events: [
                {
                  label: "Team",
                  value: "141bff2d-25b7-41ac-9e7d-6dc32ace327b",
                  description: "Team"
                }
              ]
            }
          ]);
        }
        
        // We'll fetch locations in a separate function now
        await fetchLocationsForCountry(countryCode);
        
        setIsLoadingMasterData(false);
      } catch (error) {
        renderErrorNotifications({
          title: "Error",
          message: "Failed to load sports and qualifier rules data"
        });
        setIsLoadingMasterData(false);
      }
    };
    
    fetchMasterData();
  }, []);
  
  // Function to fetch locations based on country code
  const fetchLocationsForCountry = async (countryCodeToUse) => {
    try {
      // Update the country code state
      setCountryCode(countryCodeToUse);
      
      // Create the request payload
      const requestData = {
        country_code: countryCodeToUse,
        table_reference: locationTableReference
      };
      
      // Make API call to get locations for the specified country code
      const locationResponse = await httpClient.post({ 
        url: '/tms/master/qualifier-rules/master-lov',
        params: {
          page: 1,
          page_size: 100
        },
        headers: {
          'accept': '*/*',
          'x-channel-id': 'WEB',
          'Content-Type': 'application/json'
        },
        body: requestData  // Changed from 'data' to 'body' to match httpClient implementation
      });
      
      // Check for errors in the response
      if (locationResponse?.errors && locationResponse.errors.length > 0) {
        throw new Error("Failed to fetch locations: " + JSON.stringify(locationResponse.errors));
      }
      
      // Process location data for dropdown options
      if (locationResponse && locationResponse.data) {
        // Extract location data from response, handling different possible structures
        let locationData = [];
        if (locationResponse.data.data && Array.isArray(locationResponse.data.data)) {
          locationData = locationResponse.data.data;
        } else if (Array.isArray(locationResponse.data)) {
          locationData = locationResponse.data;
        }
        
        if (locationData.length > 0) {
          // Map the location data to the format needed for dropdown
          const formattedLocationOptions = locationData.map(location => {
            const label = location.name || location.location_name || location.venue_name || "Unknown Location";
            // Ensure we extract a valid UUID
            const value = location.id || location.location_id || location.venue_id;
            
            // Validate UUID format
            if (!isValidUUID(value)) {
              return null;
            }
            
            return {
              label,
              value,
              description: location.description || ''
            };
          }).filter(Boolean); // Remove null entries
          
          setLocationOptions(formattedLocationOptions);
          
          // Get the current form values to check if we need to clear location selections
          const formValues = form.getFieldsValue(true);
          if (formValues.seasons && Array.isArray(formValues.seasons)) {
            // We don't want to automatically clear locations when country changes
            // But we'll log the change for debugging purposes
          }
        } else {
          // Use fallback options for the specific country
          setLocationOptions(getFallbackLocationsForCountry(countryCodeToUse));
        }
      } else {
        // Set fallback location options if API fails
        setLocationOptions(getFallbackLocationsForCountry(countryCodeToUse));
      }
    } catch (locationError) {
      // Set fallback location options if API fails
      setLocationOptions(getFallbackLocationsForCountry(countryCodeToUse));
    }
  };
  
  // Helper to get fallback locations based on country code
  const getFallbackLocationsForCountry = (countryCodeToUse) => {
    if (countryCodeToUse === "IN") {
      return [
        { label: "Chennai, Tamil Nadu", value: "56ce426f-e781-4a03-b82f-007c9945d90b" },
        { label: "Mumbai, Maharashtra", value: "a9cfa75b-89a7-4c36-a982-1f1f8c06dd3b" },
        { label: "Bangalore, Karnataka", value: "b12d4e3f-c987-4a23-95e2-39b7c1e84f5a" },
        { label: "Delhi NCR", value: "e2c7520b-0e8a-55ba-820f-c305a4596fdb" },
        { label: "Hyderabad, Telangana", value: "603273a1-a3ad-5a03-a1f6-e38ec0062e95" }
      ];
    } else if (countryCodeToUse === "US") {
      return [
        { label: "New York", value: "a1b2c3d4-e5f6-1234-5678-abcdefghijkl" },
        { label: "Los Angeles", value: "b2c3d4e5-f6a1-2345-6789-bcdefghijklm" },
        { label: "Chicago", value: "c3d4e5f6-a1b2-3456-789a-defghijklmno" }
      ];
    } else {
      return [
        { label: "Default Location 1", value: "d4e5f6a1-b2c3-4567-89ab-efghijklmnop" },
        { label: "Default Location 2", value: "e5f6a1b2-c3d4-5678-9abc-fghijklmnopq" }
      ];
    }
  };
  
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
      
      // Create a new media item with type and url structure
      // Ensure 'type' is lowercase as per API schema
      let mediaItem = {
        type: usage?.toLowerCase() || "banner",
        url: ""
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
          mediaItem.url = fileList[0].name 
            ? `https://example.com/uploads/${fileList[0].name}` 
            : "https://example.com/uploads/uploaded_file.jpg";
        }
      }
      
      return mediaItem;
    });
  };
  
  // Process season media items to match the API contract
  const processSeasonMediaItems = (mediaItems) => {
    if (!mediaItems || !mediaItems.length) return [];
    
    return mediaItems.map(item => {
      // Extract the base media properties
      const { category, usage, variant, position, mediaSource } = item;
      
      // Create a new media item based on the API contract
      // Ensure 'type' is lowercase as per API schema
      let mediaItem = {
        type: usage?.toLowerCase() || "banner",
        url: ""
      };
      
      // Add the URL based on the media source
      if (mediaSource === 'url' && item.url) {
        // If source is URL, use the URL directly
        mediaItem.url = item.url;
      } else if (mediaSource === 'upload' && item.fileUpload) {
        // If source is upload, process the file upload
        const fileList = item.fileUpload.fileList;
        if (fileList && fileList.length > 0) {
          mediaItem.url = fileList[0].name 
            ? `https://example.com/uploads/${fileList[0].name}` 
            : "https://example.com/uploads/uploaded_file.jpg";
        }
      } else {
        // Default URL if none provided
        mediaItem.url = "https://example.com/uploads/default.jpg";
      }
      
      return mediaItem;
    });
  };
  
  // Helper function for safely formatting dates
  const safeFormatDate = (dateValue, defaultValue = "2025-05-15") => {
    if (!dateValue) return defaultValue;
    
    // Handle Moment objects
    if (dateValue._isAMomentObject && dateValue.isValid()) {
      return dateValue.format('YYYY-MM-DD');
    }
    
    // Handle Date objects
    if (dateValue instanceof Date) {
      return new Intl.DateTimeFormat('en-CA', { 
        year: 'numeric', 
        month: '2-digit', 
        day: '2-digit' 
      }).format(dateValue).replace(/\//g, '-');
    }
    
    // Handle ISO strings
    if (typeof dateValue === 'string') {
      try {
        const date = new Date(dateValue);
        if (!isNaN(date.getTime())) {
          return date.toISOString().split('T')[0];
        }
      } catch (e) {
        // Silent error handling
      }
    }
    
    return defaultValue;
  };
  
  // Function to validate all event IDs before submission
  const validateEventIds = (values) => {
    let missingEventIds = [];
    let validEventIds = [];

    // Function to normalize field names if needed
    const normalizeEventFields = (event) => {
      if (event.master_sport_event_id && !event.master_sport_events_id) {
        event.master_sport_events_id = event.master_sport_event_id;
      }
      return event;
    };

    if (values.seasons && Array.isArray(values.seasons)) {
      values.seasons.forEach((season, seasonIndex) => {
        if (season.sports && Array.isArray(season.sports)) {
          season.sports.forEach((sport, sportIndex) => {
            if (sport.events && Array.isArray(sport.events)) {
              sport.events.forEach((event, eventIndex) => {
                // Normalize field names first
                event = normalizeEventFields(event);
                
                const eventIdPath = `Season ${seasonIndex + 1} → Sport ${sportIndex + 1} → Event ${eventIndex + 1}`;
                
                if (!event.master_sport_events_id) {
                  missingEventIds.push(eventIdPath);
                } else {
                  // Validate UUID format
                  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
                  if (!uuidRegex.test(event.master_sport_events_id)) {
                    missingEventIds.push(`${eventIdPath} (invalid format: ${event.master_sport_events_id})`);
                  } else {
                    validEventIds.push({
                      path: eventIdPath,
                      id: event.master_sport_events_id
                    });
                  }
                }
              });
            }
          });
        }
      });
    }

    return { 
      isValid: missingEventIds.length === 0,
      missingEventIds,
      validEventIds 
    };
  };

  // Helper function to format dates to required ISO format
  const formatDateToISO = (dateValue) => {
    if (!dateValue) return null;
    
    // Handle Moment objects
    if (dateValue._isAMomentObject && dateValue.isValid()) {
      return dateValue.format('YYYY-MM-DD');
    }
    
    // Handle Date objects
    if (dateValue instanceof Date) {
      return dateValue.toISOString().split('T')[0];
    }
    
    // Handle string dates
    if (typeof dateValue === 'string') {
      try {
        const date = new Date(dateValue);
        if (!isNaN(date.getTime())) {
          return date.toISOString().split('T')[0];
        }
      } catch (e) {
        // Silent error handling
      }
    }
    
    return null;
  };

  // Form submission handler
  const onFinish = async (values) => {
    try {
      setIsSubmitting(true);
      
      // Clear any existing form data in localStorage
      window.localStorage.removeItem("tournament_form_data");

      // Validate form based on creation level
      const levelValidation = validateFormByLevel(values);
      if (!levelValidation.isValid) {
        notification.error({
          message: "Validation Error",
          description: (
            <div>
              <p>Please fix the following issues:</p>
              <ul style={{ marginTop: "8px", marginLeft: "16px", listStyleType: "disc" }}>
                {levelValidation.errors.map((error, index) => (
                  <li key={index}>{error}</li>
                ))}
              </ul>
            </div>
          ),
          duration: 0 // Keep open until user dismisses
        });
        setIsSubmitting(false);
        return;
      }

      // Only validate event IDs if we're creating events or subevents
      if (creationLevel === 'event' || creationLevel === 'subevent') {
        const { isValid, missingEventIds, validEventIds } = validateEventIds(values);
        
        if (!isValid) {
          notification.error({
            message: "Missing Event IDs",
            description: (
              <div>
                <p>The following events are missing valid event IDs:</p>
                <ul style={{ marginTop: "8px", marginLeft: "16px", listStyleType: "disc" }}>
                  {missingEventIds.map((path, index) => (
                    <li key={index}>{path}</li>
                  ))}
                </ul>
                <p style={{ marginTop: "8px" }}>Please select valid events for each sport before submission.</p>
              </div>
            ),
            duration: 0 // Keep open until user dismisses
          });
          setIsSubmitting(false);
          return;
        }
      }
      
      // If we have all necessary validations passed, proceed with form submission
      let cleanedValues = ensureNoIds(values);
      
      // Final check for proper field names according to API contract
      const verifyFieldNames = (obj) => {
        if (!obj || typeof obj !== 'object') return;
        
        // Recursively verify field names in objects and arrays
        if (Array.isArray(obj)) {
          obj.forEach(item => verifyFieldNames(item));
        } else {
          // Check for singular form of field name and convert to plural
          if (obj.master_sport_event_id !== undefined) {
            obj.master_sport_events_id = obj.master_sport_event_id;
            delete obj.master_sport_event_id;
          }
          
          // Check for incorrect capitalization or spacing
          if (obj.master_sports_event_id !== undefined) {
            obj.master_sport_events_id = obj.master_sports_event_id;
            delete obj.master_sports_event_id;
          }
          
          // Continue recursion for nested objects
          Object.keys(obj).forEach(key => {
            if (obj[key] && typeof obj[key] === 'object') {
              verifyFieldNames(obj[key]);
            }
          });
        }
      };
      
      // Verify field names in the entire payload
      verifyFieldNames(cleanedValues);
      
      // Format and validate all data according to API requirements
      if (cleanedValues.seasons && Array.isArray(cleanedValues.seasons)) {
        cleanedValues.seasons = cleanedValues.seasons.map((season, idx) => {
          // Ensure season name and description are valid strings
          if (!season.name || typeof season.name !== 'string') {
            season.name = season.name || `Season ${idx + 1}`;
          }
          
          if (!season.description || typeof season.description !== 'string') {
            season.description = season.description || `Description for Season ${idx + 1}`;
          }
          
          // Format dates to ISO 8601 format (YYYY-MM-DD)
          season.start_date = formatDateToISO(season.start_date) || formatDateToISO(new Date());
          season.end_date = formatDateToISO(season.end_date) || formatDateToISO(new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)); // 30 days from now
          season.registration_start_date = formatDateToISO(season.registration_start_date) || formatDateToISO(new Date());
          season.registration_end_date = formatDateToISO(season.registration_end_date) || formatDateToISO(new Date(Date.now() + 15 * 24 * 60 * 60 * 1000)); // 15 days from now
          
          // Ensure required objects exist
          season.participation_rules = season.participation_rules || {};
          season.terms_and_conditions = season.terms_and_conditions || { content: "", url: "" };
          season.rules_and_regulations = season.rules_and_regulations || { content: "", url: "" };
          
          // Map locations field to locations_ids for API compatibility
          if (season.locations && Array.isArray(season.locations)) {
            season.locations_ids = season.locations.filter(id => isValidUUID(id));
            delete season.locations; // Remove the old field name
          } else {
            season.locations_ids = [];
          }
          
          // Ensure locations_ids is an array of valid UUIDs
          if (!season.locations_ids || !Array.isArray(season.locations_ids)) {
            season.locations_ids = [];
          } else {
            // Filter out non-UUID values
            const originalLength = season.locations_ids.length;
            season.locations_ids = season.locations_ids.filter(id => {
              if (!id || typeof id !== 'string') {
                return false;
              }
              if (!isValidUUID(id)) {
                return false;
              }
              return true;
            });
          }
          
          // Final validation - ensure it's always an array
          if (!Array.isArray(season.locations_ids)) {
            season.locations_ids = [];
          }
          
          // Process sports
          if (season.sports && Array.isArray(season.sports)) {
            season.sports = season.sports.map(sport => {
              // Ensure master_sports_id is valid UUID
              if (!sport.master_sports_id || !isValidUUID(sport.master_sports_id)) {
                if (sport.sportsId && isValidUUID(sport.sportsId)) {
                  sport.master_sports_id = sport.sportsId;
                }
              }
              
              // Process events
              if (sport.events && Array.isArray(sport.events)) {
                sport.events = sport.events.map(event => {
                  // Copy sport ID to event if missing
                  if (!event.master_sports_id && sport.master_sports_id) {
                    event.master_sports_id = sport.master_sports_id;
                  }
                  
                  // Format dates
                  event.start_date = formatDateToISO(event.start_date) || season.start_date;
                  event.end_date = formatDateToISO(event.end_date) || season.end_date;
                  
                  // Ensure required objects exist
                  event.terms_and_conditions = event.terms_and_conditions || { content: "", url: "" };
                  event.rules_and_regulations = event.rules_and_regulations || { content: "", url: "" };
                  
                  // Handle subevents - transform event itself into a subevent structure if needed
                  // This ensures the API receives the expected format
                  if (!event.sub_events || !Array.isArray(event.sub_events) || event.sub_events.length === 0) {
                    // If we have an event but no sub_events, create a subevent from this event's data
                    const subevent = {
                      name: event.eventName || event.name || event.eventType || "Default Subevent",
                      description: event.description || `${event.eventType || "Default"} Event`,
                      expected_participants: 32,
                      participation_rules: {
                        AND: [
                          {
                            field: "COUNTRY",
                            operator: "=",
                            value: "India"
                          }
                        ]
                      },
                    meta_data: {
                      team: {
                          min_players_count: 2,
                          max_players_count: 2
                      },
                      scoring: {
                        no_of_games: 3,
                        no_of_points: 21,
                        win_margin_points: 2,
                        display_name: "Games"
                      }
                    },
                    pricing: {
                      currency: "INR",
                      prices: [
                        {
                          type: "MRP",
                          amount: 699,
                          tax_included: false,
                          tax_details: {
                            tax_percentage: 18,
                            tax_amount: 125.82
                          }
                        },
                        {
                          type: "Selling Price",
                          amount: 599,
                          tax_included: false,
                          tax_details: {
                            tax_percentage: 18,
                            tax_amount: 107.82
                          }
                          }
                        ]
                      }
                    };

                    // Ensure the master_sport_events_id is included in the subevent if needed
                    if (event.master_sport_events_id) {
                      subevent.master_sport_events_id = event.master_sport_events_id;
                    }

                    // Add this as a sub_event with proper field name
                    event.sub_events = [subevent];
                    
                    // Remove any existing subevents field (without underscore) to avoid confusion
                    if (event.subevents) {
                      delete event.subevents;
                    }
                  }
                  
                  return event;
                });
              }
              
              return sport;
            });
          }
          
          return season;
        });
      }
      
      // Final validation before API call
      if (cleanedValues.seasons && Array.isArray(cleanedValues.seasons)) {
        cleanedValues.seasons.forEach((season, idx) => {
          // Final validation before API call
          if (!Array.isArray(season.locations_ids)) {
            season.locations_ids = [];
          }
          
          // Ensure all items in the array are valid UUIDs
          season.locations_ids = season.locations_ids.filter(id => {
            if (!isValidUUID(id)) {
              return false;
            }
            return true;
          });
        });
      }
      
      // Before creating the tournament, make sure we have all required fields
      if (!cleanedValues.name && !cleanedValues.tournament_name) {
        notification.error({
          message: "Missing Tournament Name",
          description: "Please provide a tournament name before submitting."
        });
        setIsSubmitting(false);
        return;
      }
      
      // Ensure the name field is set correctly for the API
      if (cleanedValues.tournament_name && !cleanedValues.name) {
        cleanedValues.name = cleanedValues.tournament_name;
      }
      
      if (!cleanedValues.seasons || cleanedValues.seasons.length === 0) {
        notification.error({
          message: "Missing Seasons",
          description: "Please add at least one season before submitting."
        });
        setIsSubmitting(false);
        return;
      }
      
      await createTournament(cleanedValues);
      
      // The success handling (notification, form reset, navigation) is now handled in the useApiMutation onSuccess callback
      
    } catch (error) {
      setIsSubmitting(false);
      
      // Display a more helpful error message
     renderErrorNotifications("An error occurred while submitting the form. Please try again.");
    }
  };

  // Define ensureNoIds function if it doesn't exist
  const ensureNoIds = (obj) => {
    if (!obj || typeof obj !== 'object') return obj;
    
    // Check for common ID field names
    const idFields = ['id', 'tournament_id', 'season_id', 'sport_id', 'sports_id', 'event_id', 'sub_event_id', 'subEventId'];
    
    // Return value for recursive operations
    let result = Array.isArray(obj) ? [...obj] : {...obj};
    
    // Fix field name if using incorrect version
    if (result.master_sport_event_id && !result.master_sport_events_id) {
      result.master_sport_events_id = result.master_sport_event_id;
      delete result.master_sport_event_id;
    }
    
    Object.keys(result).forEach(key => {
      // Check if this is an ID field we should remove
      if (idFields.includes(key) && key !== 'master_sports_id' && key !== 'master_sport_events_id' && key !== 'locations_ids') {
        delete result[key];
      }
      
      // Check for temp_ prefix
      if (typeof result[key] === 'string' && result[key].startsWith('temp_')) {
        delete result[key];
      }
      
      // Recursively check nested objects and arrays
      if (result[key] && typeof result[key] === 'object') {
        result[key] = ensureNoIds(result[key]);
      }
    });
    
    return result;
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
  const generateId = () => {
    // Generate a completely random ID that is NOT a UUID
    // This is only for client-side tracking of items in the form
    // These IDs will not be sent to the backend
    const randomStr = Math.random().toString(36).substring(2, 15);
    const timestamp = Date.now().toString(36);
    return `temp_${timestamp}_${randomStr}`;
  };

  // Tab items for mobile navigation
  const tabItems = [
    {
      key: "config",
      label: (
        <div className="flex flex-col items-center text-xs">
          <Settings size={16} />
          <span>Config</span>
        </div>
      ),
    },
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

  // Handler for the Cancel button - use navigate function for consistent navigation
  const handleCancel = () => {
    // Clear saved form data on cancel
    localStorage.removeItem('tournamentFormData');
    setHasSavedDraft(false);
    
    // Clear the hash first (important for hash-based routing)
    window.location.hash = "";
    
    // Navigate back to tournaments page with replace to avoid back button issues
    navigate("/tournaments", { replace: true });
  };

  // Add a new direct submit function to handle manual submission
  const handleManualSubmit = () => {
    try {
      // Get current form values
      const currentValues = form.getFieldsValue();
      
      // Validate fields manually
      form.validateFields()
        .then(values => {
          // Call onFinish directly with the validated values
          onFinish(values);
        })
        .catch(errorInfo => {
          notification.error({
            message: "Validation Error",
            description: "Please check the form for validation errors and try again.",
            duration: 5,
          });
        });
    } catch (error) {
      notification.error({
        message: "Form Submission Error",
        description: "An unexpected error occurred. Please try again.",
        duration: 5,
      });
    }
  };

  /**
   * Helper function to ensure that all event IDs are valid before submission
   */
  const getEventIdBySportAndType = (sportId, eventType, sportsData) => {
    if (!sportsData || !Array.isArray(sportsData) || sportsData.length === 0) {
      return null;
    }
    
    // Find the sport in the sports data
    const sport = sportsData.find(s => s.sport_id === sportId);
    if (!sport) {
      return null;
    }
    
    if (!sport.events || sport.events.length === 0) {
      return null;
    }
    
    // Try to find an exact match for the event type
    const exactMatch = sport.events.find(e => e.type === eventType);
    if (exactMatch) {
      return exactMatch.event_id;
    }
    
    // If no exact match, try to find a partial match
    const partialMatch = sport.events.find(e => e.type && e.type.includes(eventType));
    if (partialMatch) {
      return partialMatch.event_id;
    }
    
    // If no match, return the first available event
    if (sport.events[0]) {
      return sport.events[0].event_id;
    }
    
    return null;
  };

  return (
      <Form
        form={form}
        layout="vertical"
        initialValues={{
          is_active: true,
          is_published: true,
          featured: false,
          // Use actual enum values from schema
          competition_type: "Open_Registration_Team",
          // Empty arrays for collection fields
          sports: [],
          seasons: [],
          // Scopes for visibility and actions
          marketplace_visibility_scope: ["PUBLIC", "MEMBERS"],
          marketplace_action_scope: ["REGISTER", "VIEW"],
          // Empty array for media
          medias: []
        }}
        className="tournament-form"
        onValuesChange={() => {
          // Save form data on any value change
          saveFormData();
        }}
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
              sportsData={rawSportsData}
              genderOptions={genderOptions}
              ageGroupOptions={ageGroupOptions}
              locationOptions={locationOptions}
              countryOptions={availableCountries}
              cityOptions={cityOptions}
              stateOptions={stateOptions}
              qualifierRules={qualifierRules}
              isLoadingMasterData={isLoadingMasterData}
              isMobile={isMobile}
              fetchLocationsForCountry={fetchLocationsForCountry}
              selectedCountryCode={countryCode}
            />
          </div>
        </div>
        
        <div className="flex justify-between pt-4 px-6 pb-2 border-t border-gray-200 mt-6">
          <Button
            type="default"
            onClick={handleCancel}
            className="px-4 py-2"
          >
            Cancel
          </Button>
          
          <Button
            type="primary"
            htmlType="button"
            className="px-4 py-2"
            loading={isCreatingTournament}
            onClick={async (e) => {
              e.preventDefault(); // Prevent any default behavior
              
              // First approach: Get form values and validate manually
              try {
                // Get current values without validation first (as a backup)
                const currentValues = form.getFieldsValue(true);
                
                // Try to validate (this may fail but we have the unvalidated values as backup)
                let validatedValues = null;
                try {
                  validatedValues = await form.validateFields();
                } catch (validationError) {
                  // Form validation failed, but continuing with current values
                }
                
                // Use validated values if available, otherwise use current values
                const valuesToSubmit = validatedValues || currentValues;
                
                // Process sport events to ensure we have valid event IDs
                if (valuesToSubmit.seasons && Array.isArray(valuesToSubmit.seasons)) {
                  valuesToSubmit.seasons.forEach(season => {
                    if (season.sports && Array.isArray(season.sports)) {
                      season.sports.forEach(sport => {
                        if (sport.events && Array.isArray(sport.events)) {
                          sport.events.forEach(event => {
                            // Check for incorrect field name and normalize
                            if (event.master_sport_event_id && !event.master_sport_events_id) {
                              event.master_sport_events_id = event.master_sport_event_id;
                              delete event.master_sport_event_id;
                            }
                            
                            // Check if the event has a valid master_sport_events_id
                            if (!event.master_sport_events_id || !isValidUUID(event.master_sport_events_id)) {
                              // Try to get the event ID from the sport data
                              if (sport.sportsId && event.eventType) {
                                const eventId = getEventIdBySportAndType(sport.sportsId, event.eventType, rawSportsData);
                                if (eventId) {
                                  event.master_sport_events_id = eventId;
                                }
                              }
                            }
                            
                            // Handle subevents - transform event itself into a subevent structure if needed
                            if (!event.sub_events || !Array.isArray(event.sub_events) || event.sub_events.length === 0) {
                              // If we have an event but no sub_events, create a subevent from this event's data
                              const subevent = {
                                name: event.eventName || event.name || event.eventType || "Default Subevent",
                                description: event.description || `${event.eventType || "Default"} Event`,
                                expected_participants: 32,
                                participation_rules: {
                                  AND: [
                                    {
                                      field: "COUNTRY",
                                      operator: "=",
                                      value: "India"
                                    }
                                  ]
                                },
                                meta_data: {
                                  team: {
                                    min_players_count: 2,
                                    max_players_count: 2
                                  },
                                  scoring: {
                                    no_of_games: 3,
                                    no_of_points: 21,
                                    win_margin_points: 2,
                                    display_name: "Games"
                                  }
                                },
                                pricing: {
                                  currency: "INR",
                                  prices: [
                                    {
                                      type: "MRP",
                                      amount: 699,
                                      tax_included: false,
                                      tax_details: {
                                        tax_percentage: 18,
                                        tax_amount: 125.82
                                      }
                                    },
                                    {
                                      type: "Selling Price",
                                      amount: 599,
                                      tax_included: false,
                                      tax_details: {
                                        tax_percentage: 18,
                                        tax_amount: 107.82
                                      }
                                    }
                                  ]
                                }
                              };

                              // Add subevent type if available
                              if (event.eventType) {
                                subevent.type = event.eventType;
                              }

                              // Ensure the master_sport_events_id is included in the subevent if needed
                              if (event.master_sport_events_id) {
                                subevent.master_sport_events_id = event.master_sport_events_id;
                              }

                              // Add this as a sub_event with proper field name
                              event.sub_events = [subevent];
                              
                              // Remove any existing subevents field (without underscore) to avoid confusion
                              if (event.subevents) {
                                delete event.subevents;
                              }
                            }
                          });
                        }
                      });
                    }
                  });
                }
                
                // Before creating the tournament, make sure we have all required fields
                if (!valuesToSubmit.name && !valuesToSubmit.tournament_name) {
                  notification.error({
                    message: "Missing Tournament Name",
                    description: "Please provide a tournament name before submitting."
                  });
                  return;
                }
                
                // Ensure the name field is set correctly for the API
                if (valuesToSubmit.tournament_name && !valuesToSubmit.name) {
                  valuesToSubmit.name = valuesToSubmit.tournament_name;
                }
                
                if (!valuesToSubmit.seasons || valuesToSubmit.seasons.length === 0) {
                  notification.error({
                    message: "Missing Seasons",
                    description: "Please add at least one season before submitting."
                  });
                  return;
                }
                
                await onFinish(valuesToSubmit);
              } catch (error) {
                setIsSubmitting(false);
                
                // Display a more helpful error message
                notification.error({
                  message: "Form Submission Error",
                  description: error.message || "An error occurred while submitting the form. Please try again."
                });
              }
            }}
          >
            Save Tournament
          </Button>
        </div>
      </Form>
  );
};

export default AddTournamentForm; 