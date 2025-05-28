import { FileText, CheckCircleIcon } from '../components/Icons';
import { Globe } from '../components/Icons';
import SeasonsSection from './SeasonsSection';

const OverviewTab = ({ tournament }) => {
  // Helper to safely get type with fallback
  const getFormattedType = () => {
    // Try different property paths depending on data structure
    const type = tournament.type || 
                 tournament.competition_type || 
                 tournament.rawData?.competition_type || 
                 "Unknown Type";
    
    // Make sure to replace underscores with spaces
    return typeof type === 'string' ? type.replace(/_/g, " ") : type;
  };
  
  return (
    <div className="p-4">
      <div className="mb-6 bg-blue-50 p-4 rounded-lg">
        <h2 className="text-xl font-semibold text-blue-800 mb-2">
          About the Tournament
        </h2>
        <p className="text-gray-700">{tournament.description}</p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
          <div className="bg-white rounded-lg p-3 shadow-sm flex items-center">
            <div className="bg-blue-100 p-2 rounded-lg mr-3">
              <FileText size={18} className="text-blue-600" />
            </div>
            <div>
              <span className="text-xs text-gray-500 mr-2">Type:</span>
              <span className="font-medium">
                {getFormattedType()}
              </span>
            </div>
          </div>

          <div className="bg-white rounded-lg p-3 shadow-sm flex items-center">
            <div className="bg-green-100 p-2 rounded-lg mr-3">
              <CheckCircleIcon
                size={18}
                className="text-green-600"
              />
            </div>
            <div>
              <span className="text-xs text-gray-500 mr-2">Status:</span>
              <span className="font-medium">
                {(tournament.isActive || tournament.is_active) ? "Active" : "Inactive"}
              </span>
            </div>
          </div>

          <div className="bg-white rounded-lg p-3 shadow-sm flex items-center">
            <div className="bg-purple-100 p-2 rounded-lg mr-3">
              <Globe size={18} className="text-purple-600" />
            </div>
            <div>
              <span className="text-xs text-gray-500 mr-2">Visibility:</span>
              <span className="font-medium">
                {(tournament.isPublished || tournament.is_published)
                  ? "Published"
                  : "Not Published"}
              </span>
            </div>
          </div>
        </div>
      </div>

      <SeasonsSection seasons={tournament.seasons || tournament.rawData?.seasons || []} />
    </div>
  );
};

export default OverviewTab; 