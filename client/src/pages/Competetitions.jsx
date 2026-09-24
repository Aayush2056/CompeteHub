import { useEffect, useState } from "react";
import api from "../services/api";
import CompetitionCard from "../components/CompetitionCard.jsx";

const Competitions = () => {
  const [competitions, setCompetitions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchCompetitions = async () => {
    try {
      const response = await api.get("/competitions");

      setCompetitions(response.data.competitions);
    } catch (error) {
      console.log("FETCH COMPETITIONS ERROR:", error);

      setError(
        error.response?.data?.message ||
          "Failed to load competitions"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCompetitions();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <p className="text-lg text-gray-600">
          Loading competitions...
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
        <div className="text-center">
          <p className="text-red-500">{error}</p>

          <button
            onClick={fetchCompetitions}
            className="mt-4 px-5 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 px-4 sm:px-6 lg:px-8 py-8 sm:py-10">
      <div className="max-w-7xl mx-auto">

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
            Competitions
          </h1>

          <p className="text-sm sm:text-base text-gray-500 mt-2">
            Explore competitions and participate in the ones you like.
          </p>
        </div>

        {/* Empty State */}
        {competitions.length === 0 ? (
          <div className="bg-white border border-gray-200 rounded-2xl text-center py-16 sm:py-20 px-4">
            <p className="text-gray-500">
              No competitions available.
            </p>
          </div>
        ) : (
          /* Competition Grid */
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
            {competitions.map((competition) => (
              <CompetitionCard
                key={competition._id}
                competition={competition}
              />
            ))}
          </div>
        )}

      </div>
    </div>
  );
};

export default Competitions;