// Helper functions for formatting data
export const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };
  
  export const getStatusColor = (status) => {
    const statusColors = {
      DRAFT: "text-gray-800",
      ACTIVE: "bg-green-100 text-green-800",
      PUBLISHED: "bg-blue-100 text-blue-800",
      COMPLETED: "bg-purple-100 text-purple-800",
      CANCELLED: "bg-red-100 text-red-800",
    };
    return statusColors[status] || "bg-gray-100 text-gray-800";
  };
  
  export const getFormatLabel = (format) => {
    const formatLabels = {
      KNOCKOUT: "Knockout",
      LEAGUE: "League",
      ROUND_ROBIN: "Round Robin",
    };
    return formatLabels[format] || format;
  };
  
  export const getBgColor = (index) => {
    const colors = [
      "bg-blue-50",
      "bg-green-50",
      "bg-purple-50",
      "bg-yellow-50",
      "bg-red-50",
      "bg-indigo-50",
    ];
    return colors[index % colors.length];
  };
  
  export const getCardColor = (index) => {
    const colors = [
      "border-l-4 border-blue-500",
      "border-l-4 border-green-500",
      "border-l-4 border-purple-500",
      "border-l-4 border-yellow-500",
      "border-l-4 border-red-500",
      "border-l-4 border-indigo-500",
    ];
    return colors[index % colors.length];
  };
  
  export const getIconBgColor = (category) => {
    if (!category) {
      return "bg-gray-100 text-gray-600"; // default
    }
    
    const categoryColors = {
      // Original categories
      "Athletics": "bg-red-100 text-red-600",
      "Badminton": "bg-green-100 text-green-600",
      "Swimming": "bg-blue-100 text-blue-600",
      "TRACK": "bg-orange-100 text-orange-600",
      "FIELD": "bg-yellow-100 text-yellow-600",
      "INDOOR": "bg-indigo-100 text-indigo-600",
      "WATER": "bg-cyan-100 text-cyan-600",
      
      // Add more categories 
      "Football": "bg-emerald-100 text-emerald-600",
      "Cricket": "bg-sky-100 text-sky-600",
      "Team Sport": "bg-blue-100 text-blue-600",
      "Individual": "bg-purple-100 text-purple-600",
      "Team": "bg-orange-100 text-orange-600",
    };
    
    // Case-insensitive match
    const match = Object.keys(categoryColors).find(
      key => key.toLowerCase() === category.toLowerCase()
    );
    
    if (match) {
      return categoryColors[match];
    }
    
    return "bg-gray-100 text-gray-600"; // default
  };

// Dropdown options data for various tournament fields
// These will be replaced with API responses in the future

// Tournament status options
export const tournamentStatusOptions = [
  { label: "All", value: "ALL" },
  { label: "Draft", value: "DRAFT" },
  { label: "Active", value: "ACTIVE" },
  { label: "Published", value: "PUBLISHED" },
  { label: "Completed", value: "COMPLETED" },
  { label: "Cancelled", value: "CANCELLED" },
];

// Tournament type options
export const tournamentTypeOptions = [
  { label: "Open Registration (Team)", value: "OPEN_REGISTRATION_TEAM" },
  { label: "Open Registration (Individual)", value: "OPEN_REGISTRATION_INDIVIDUAL" },
  { label: "Invitation Only", value: "INVITATION_ONLY" },
  { label: "Qualification Based", value: "QUALIFICATION_BASED" },
];

// Tournament format options
export const tournamentFormatOptions = [
  { label: "Knockout", value: "KNOCKOUT" },
  { label: "League", value: "LEAGUE" },
  { label: "Round Robin", value: "ROUND_ROBIN" },
  { label: "Group Stage + Knockout", value: "GROUP_KNOCKOUT" },
  { label: "Swiss System", value: "SWISS" },
];

// Sports options
export const sportsOptions = [
  { label: "All", value: "ALL" },
  { label: "Cricket", value: "CRICKET" },
  { label: "Football", value: "FOOTBALL" },
  { label: "Tennis", value: "TENNIS" },
  { label: "Basketball", value: "BASKETBALL" },
  { label: "Badminton", value: "BADMINTON" },
  { label: "Swimming", value: "SWIMMING" },
  { label: "Hockey", value: "HOCKEY" },
  { label: "Athletics", value: "ATHLETICS" },
  { label: "Table Tennis", value: "TABLE_TENNIS" },
  { label: "Volleyball", value: "VOLLEYBALL" },
];

// Gender options for tournaments
export const genderOptions = [
  { label: "Male", value: "MALE" },
  { label: "Female", value: "FEMALE" },
  { label: "Both", value: "BOTH" },
];

// Age group options
export const ageGroupOptions = [
  { label: "Under 10", value: "U10" },
  { label: "Under 12", value: "U12" },
  { label: "Under 14", value: "U14" },
  { label: "Under 16", value: "U16" },
  { label: "Under 18", value: "U18" },
  { label: "Under 21", value: "U21" },
  { label: "Senior", value: "SENIOR" },
  { label: "Veterans", value: "VETERANS" },
];

// Media category options
export const mediaCategoryOptions = [
  { label: "Logo", value: "LOGO" },
  { label: "Banner", value: "BANNER" },
  { label: "Poster", value: "POSTER" },
  { label: "Cover Image", value: "COVER" },
  { label: "Thumbnail", value: "THUMBNAIL" },
];

// Marketplace visibility scope options
export const marketplaceVisibilityOptions = [
  { label: "B2C - Individual", value: "B2C-INDIVIDUAL" },
  { label: "B2C - Team", value: "B2C-TEAM" },
  { label: "B2B - Academy", value: "B2B-ACADEMY" },
  { label: "B2B - School", value: "B2B-SCHOOL" },
  { label: "B2B - Club", value: "B2B-CLUB" },
];

// Location options (Indian cities)
export const locationOptions = [
  { label: "New Delhi", value: "NEW_DELHI" },
  { label: "Mumbai", value: "MUMBAI" },
  { label: "Bangalore", value: "BANGALORE" },
  { label: "Hyderabad", value: "HYDERABAD" },
  { label: "Chennai", value: "CHENNAI" },
  { label: "Kolkata", value: "KOLKATA" },
  { label: "Pune", value: "PUNE" },
  { label: "Ahmedabad", value: "AHMEDABAD" },
  { label: "Jaipur", value: "JAIPUR" },
  { label: "Lucknow", value: "LUCKNOW" },
]; 