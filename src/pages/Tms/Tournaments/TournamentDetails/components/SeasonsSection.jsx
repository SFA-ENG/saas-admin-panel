import Season from './Season';

const SeasonsSection = ({ seasons }) => {
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