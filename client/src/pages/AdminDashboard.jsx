import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import api from "../services/api";

const AdminDashboard = () => {
  const [competitions, setCompetitions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchCompetitions = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await api.get("/competitions");

      setCompetitions(response.data.competitions || []);
    } catch (error) {
      console.log("ADMIN DASHBOARD ERROR:", error);

      setError(
        error.response?.data?.message ||
          "Failed to load competitions."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCompetitions();
  }, []);

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this competition?"
    );

    if (!confirmDelete) return;

    try {
      await api.delete(`/competitions/${id}`);

      setCompetitions((prev) =>
        prev.filter((competition) => competition._id !== id)
      );
    } catch (error) {
      console.log("DELETE COMPETITION ERROR:", error);

      alert(
        error.response?.data?.message ||
          "Failed to delete competition."
      );
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-10 h-10 border-4 border-gray-200 border-t-indigo-600 rounded-full animate-spin mx-auto" />

          <p className="mt-4 text-sm text-gray-500">
            Loading dashboard...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10 lg:py-14">

        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <p className="text-sm font-semibold text-indigo-600">
              ADMIN PANEL
            </p>

            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mt-2">
              Competition Dashboard
            </h1>

            <p className="text-sm sm:text-base text-gray-500 mt-2">
              Create and manage competitions.
            </p>
          </div>

          <Link
            to="/admin/competitions/create"
            className="inline-flex items-center justify-center px-5 py-3 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 transition"
          >
            + Create Competition
          </Link>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mt-8">
          <div className="bg-white border border-gray-200 rounded-xl p-5 sm:p-6">
            <p className="text-sm text-gray-500">
              Total Competitions
            </p>

            <p className="text-2xl sm:text-3xl font-bold text-gray-900 mt-2">
              {competitions.length}
            </p>
          </div>

          <div className="bg-white border border-gray-200 rounded-xl p-5 sm:p-6">
            <p className="text-sm text-gray-500">
              Active Registrations
            </p>

            <p className="text-2xl sm:text-3xl font-bold text-gray-900 mt-2">
              {competitions.reduce(
                (total, competition) =>
                  total + (competition.registeredParticipants || 0),
                0
              )}
            </p>
          </div>

          <div className="col-span-2 lg:col-span-1 bg-white border border-gray-200 rounded-xl p-5 sm:p-6">
            <p className="text-sm text-gray-500">
              Available Spots
            </p>

            <p className="text-2xl sm:text-3xl font-bold text-gray-900 mt-2">
              {competitions.reduce(
                (total, competition) =>
                  total +
                  Math.max(
                    0,
                    (competition.maxParticipants || 0) -
                      (competition.registeredParticipants || 0)
                  ),
                0
              )}
            </p>
          </div>
        </div>

        {/* Error */}
        {error && (
          <div className="mt-6 bg-red-50 border border-red-200 text-red-600 rounded-lg px-4 py-3 text-sm">
            {error}
          </div>
        )}

        {/* Competitions */}
        <div className="mt-8">
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900">
              Competitions
            </h2>

            <span className="text-sm text-gray-500">
              {competitions.length} total
            </span>
          </div>

          {competitions.length === 0 ? (
            <div className="bg-white border border-gray-200 rounded-2xl p-8 sm:p-12 text-center">
              <div className="text-4xl">🏆</div>

              <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mt-4">
                No competitions yet
              </h3>

              <p className="text-sm text-gray-500 mt-2">
                Create your first competition to get started.
              </p>

              <Link
                to="/admin/competitions/create"
                className="inline-block mt-5 px-5 py-3 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 transition"
              >
                Create Competition
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 sm:gap-6">
              {competitions.map((competition) => (
                <div
                  key={competition._id}
                  className="bg-white border border-gray-200 rounded-2xl p-5 sm:p-6"
                >
                  <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
                    <div>
                      <span className="inline-block px-3 py-1 bg-indigo-50 text-indigo-600 text-xs font-medium rounded-full">
                        {competition.category}
                      </span>

                      <h3 className="text-lg sm:text-xl font-bold text-gray-900 mt-3">
                        {competition.title}
                      </h3>
                    </div>

                    <span className="text-sm font-semibold text-gray-700">
                      ₹{competition.prizePool?.toLocaleString()}
                    </span>
                  </div>

                  <p className="text-sm text-gray-500 mt-3 line-clamp-2">
                    {competition.description}
                  </p>

                  <div className="grid grid-cols-2 gap-4 mt-5">
                    <div className="bg-gray-50 rounded-lg p-3">
                      <p className="text-xs text-gray-500">
                        Participants
                      </p>

                      <p className="text-sm font-semibold text-gray-900 mt-1">
                        {competition.registeredParticipants}/
                        {competition.maxParticipants}
                      </p>
                    </div>

                    <div className="bg-gray-50 rounded-lg p-3">
                      <p className="text-xs text-gray-500">
                        Competition Date
                      </p>

                      <p className="text-sm font-semibold text-gray-900 mt-1">
                        {new Date(
                          competition.competitionDate
                        ).toLocaleDateString()}
                      </p>
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-3 mt-5">
                    <Link
                      to={`/competitions/${competition._id}`}
                      className="flex-1 text-center px-4 py-2.5 border border-gray-300 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-50 transition"
                    >
                      View
                    </Link>

                    <Link
                      to={`/admin/competitions/${competition._id}/participants`}
                      className="flex-1 text-center px-4 py-2.5 bg-gray-900 text-white rounded-lg text-sm font-medium hover:bg-gray-800 transition"
                    >
                      Participants
                    </Link>
                     <Link
  to={`/admin/competitions/${competition._id}/edit`}
  className="flex-1 text-center px-4 py-2.5 border border-gray-300 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-50 transition"
>
  Edit
</Link>
                    <button
                      onClick={() =>
                        handleDelete(competition._id)
                      }
                      className="px-4 py-2.5 border border-red-200 text-red-600 rounded-lg text-sm font-medium hover:bg-red-50 transition"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>
    </div>
  );
};

export default AdminDashboard;