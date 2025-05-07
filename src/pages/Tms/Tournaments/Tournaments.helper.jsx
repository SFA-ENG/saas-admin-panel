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
    const categoryColors = {
      Athletics: "bg-red-100 text-red-600",
      Badminton: "bg-green-100 text-green-600",
      Swimming: "bg-blue-100 text-blue-600",
      TRACK: "bg-orange-100 text-orange-600",
      FIELD: "bg-yellow-100 text-yellow-600",
      INDOOR: "bg-indigo-100 text-indigo-600",
      WATER: "bg-cyan-100 text-cyan-600",
    };
    return categoryColors[category] || "bg-gray-100 text-gray-600";
  }; 