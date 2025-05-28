import Season from './Season';

const SeasonsSection = ({ seasons }) => {
  // Return null if seasons is undefined or empty
  if (!seasons || seasons.length === 0) {
    return (
      <div className="seasons">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">
          Seasons
        </h2>
        <p className="text-gray-500">No seasons available for this tournament.</p>
      </div>
    );
  }

  return (
    <div className="seasons">
      <h2 className="text-xl font-semibold text-gray-800 mb-4">
        Seasons
      </h2>
      <div className="space-y-4">
        {seasons.map((season, index) => (
          <Season key={season.seasonId} season={season} index={index} />
        ))}
      </div>
    </div>
  );
};

export default SeasonsSection; 