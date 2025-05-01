import { useParams } from "react-router-dom";

const TournamentDetailsPage = () => {
  const { tournament_id } = useParams();
  return (
    <div>
      <h1>Tournament Details</h1>
      <p>Tournament ID: {tournament_id}</p>
    </div>
  );
};

export default TournamentDetailsPage;
