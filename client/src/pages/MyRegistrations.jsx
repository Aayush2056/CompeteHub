import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../services/api";

const MyRegistrations = () => {
  const [registrations, setRegistrations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [cancelLoading, setCancelLoading] = useState(null);

  const fetchRegistrations = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await api.get("/competitions/my-registrations");

      setRegistrations(response.data.registrations || []);
    } catch (error) {
      console.log("GET REGISTRATIONS ERROR:", error);

      setError(
        error.response?.data?.message ||
          "Failed to load your registrations."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRegistrations();
  }, []);

  const handleCancel = async (registrationId) => {
    const confirmCancel = window.confirm(
      "Are you sure you want to cancel this registration?"
    );

    if (!confirmCancel) return;

    try {
      setCancelLoading(registrationId);

      await api.delete(
        `/competitions/registrations/${registrationId}`
      );

      setRegistrations((prev) =>
        prev.filter(
          (registration) => registration._id !== registrationId
        )
      );
    } catch (error) {
      console.log("CANCEL REGISTRATION ERROR:", error);

      alert(
        error.response?.data?.message ||
          "Failed to cancel registration."
      );
    } finally {
      setCancelLoading(null);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <div className="text-center">
          <div className="w-10 h-10 border-4 border-gray-200 border-t-indigo-600 rounded-full animate-spin mx-auto"></div>

          <p className="mt-4 text-sm sm:text-base text-gray-500">
            Loading your registrations...
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 px-4 sm:px-6 lg:px-8 py-10 sm:py-14">
        <div className="max-w-3xl mx-auto">
          <div className="bg-white border border-red-200 rounded-xl p-6 sm:p-8 text-center">
            <h2 className="text-lg sm:text-xl font-semibold text-red-600">
              Something went wrong
            </h2>

            <p className="text-sm sm:text-base text-gray-600 mt-2">
              {error}
            </p>

            <button
              onClick={fetchRegistrations}
              className="mt-5 px-5 py-2.5 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10 lg:py-14">

        {/* Header */}
        <div className="mb-8 sm:mb-10">
          <p className="text-sm font-semibold text-indigo-600">
            MY ACTIVITY
          </p>

          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mt-2">
            My Registrations
          </h1>

          <p className="text-sm sm:text-base text-gray-500 mt-2 max-w-2xl">
            Track the competitions you have registered for and
            manage your participation.
          </p>
        </div>

        {/* Empty State */}
        {registrations.length === 0 ? (
          <div className="bg-white border border-gray-200 rounded-2xl p-8 sm:p-12 lg:p-16 text-center">
            <div className="w-16 h-16 sm:w-20 sm:h-20 bg-indigo-100 rounded-2xl flex items-center justify-center text-3xl sm:text-4xl mx-auto">
              🏆
            </div>

            <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mt-5">
              No registrations yet
            </h2>

            <p className="text-sm sm:text-base text-gray-500 mt-2 max-w-md mx-auto">
              You haven't registered for any competition yet.
              Explore available competitions and find one that
              interests you.
            </p>

            <Link
              to="/competitions"
              className="inline-flex items-center justify-center mt-6 px-6 py-3 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 transition"
            >
              Explore Competitions
            </Link>
          </div>
        ) : (
          <>
            {/* Registration count */}
            <div className="mb-5">
              <p className="text-sm text-gray-500">
                You have{" "}
                <span className="font-semibold text-gray-900">
                  {registrations.length}
                </span>{" "}
                active registration
                {registrations.length !== 1 ? "s" : ""}
              </p>
            </div>

            {/* Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5 sm:gap-6">
              {registrations.map((registration) => {
                const competition = registration.competition;

                if (!competition) return null;

                const deadline = new Date(
                  competition.registrationDeadline
                );

                const competitionDate = new Date(
                  competition.competitionDate
                );

                return (
                  <div
                    key={registration._id}
                    className="bg-white border border-gray-200 rounded-2xl overflow-hidden hover:shadow-md transition"
                  >
                    {/* Image */}
                    {competition.image ? (
                      <img
                        src={competition.image}
                        alt={competition.title}
                        className="w-full h-44 sm:h-48 object-cover"
                      />
                    ) : (
                      <div className="w-full h-44 sm:h-48 bg-indigo-50 flex items-center justify-center">
                        <span className="text-5xl">🏆</span>
                      </div>
                    )}

                    <div className="p-5 sm:p-6">
                      {/* Category */}
                      <span className="inline-block px-3 py-1 bg-indigo-50 text-indigo-600 text-xs sm:text-sm font-medium rounded-full">
                        {competition.category}
                      </span>

                      {/* Title */}
                      <h2 className="text-lg sm:text-xl font-bold text-gray-900 mt-3 line-clamp-2">
                        {competition.title}
                      </h2>

                      {/* Details */}
                      <div className="mt-5 space-y-3">

                        <div className="flex justify-between gap-4 text-sm">
                          <span className="text-gray-500">
                            Prize Pool
                          </span>

                          <span className="font-semibold text-gray-900">
                            ₹{competition.prizePool?.toLocaleString()}
                          </span>
                        </div>

                        <div className="flex justify-between gap-4 text-sm">
                          <span className="text-gray-500">
                            Registration Deadline
                          </span>

                          <span className="font-medium text-gray-900 text-right">
                            {deadline.toLocaleDateString()}
                          </span>
                        </div>

                        <div className="flex justify-between gap-4 text-sm">
                          <span className="text-gray-500">
                            Competition Date
                          </span>

                          <span className="font-medium text-gray-900 text-right">
                            {competitionDate.toLocaleDateString()}
                          </span>
                        </div>

                        <div className="flex justify-between gap-4 text-sm">
                          <span className="text-gray-500">
                            Participants
                          </span>

                          <span className="font-medium text-gray-900">
                            {competition.registeredParticipants}/
                            {competition.maxParticipants}
                          </span>
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="mt-6 flex flex-col sm:flex-row gap-3">
                        <Link
                          to={`/competitions/${competition._id}`}
                          className="flex-1 text-center px-4 py-2.5 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700 transition"
                        >
                          View Competition
                        </Link>

                        <button
                          onClick={() =>
                            handleCancel(registration._id)
                          }
                          disabled={
                            cancelLoading === registration._id
                          }
                          className="flex-1 px-4 py-2.5 border border-red-200 text-red-600 rounded-lg text-sm font-medium hover:bg-red-50 transition disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          {cancelLoading === registration._id
                            ? "Cancelling..."
                            : "Cancel"}
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default MyRegistrations;