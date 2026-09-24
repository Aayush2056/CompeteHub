import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import api from "../services/api";

const AdminParticipants = () => {
  const { competitionId } = useParams();

  const [participants, setParticipants] = useState([]);
  const [competition, setCompetition] = useState(null);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchParticipants = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await api.get(
          `/competitions/${competitionId}/participants`
        );

        setParticipants(response.data.participants || []);

        // If backend sends competition details
        if (response.data.competition) {
          setCompetition(response.data.competition);
        }
      } catch (error) {
        console.log("PARTICIPANTS ERROR:", error);

        setError(
          error.response?.data?.message ||
            "Failed to load participants."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchParticipants();
  }, [competitionId]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="text-center">
          <div className="w-10 h-10 border-4 border-gray-200 border-t-indigo-600 rounded-full animate-spin mx-auto"></div>

          <p className="mt-4 text-gray-500">
            Loading participants...
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 px-4 sm:px-6 lg:px-8 py-10">
        <div className="max-w-4xl mx-auto">
          <div className="bg-red-50 border border-red-200 rounded-xl p-5">
            <p className="text-red-700 text-sm sm:text-base">
              {error}
            </p>

            <Link
              to="/admin"
              className="inline-block mt-4 text-sm font-medium text-indigo-600 hover:text-indigo-700"
            >
              ← Back to Dashboard
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10">

        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
          <div>
            <Link
              to="/admin"
              className="text-sm text-indigo-600 hover:text-indigo-700"
            >
              ← Back to Dashboard
            </Link>

            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mt-3">
              Participants
            </h1>

            {competition && (
              <p className="text-sm sm:text-base text-gray-500 mt-1">
                {competition.title}
              </p>
            )}
          </div>

          <div className="bg-white border border-gray-200 rounded-xl px-5 py-3">
            <p className="text-xs text-gray-500">
              Total Participants
            </p>

            <p className="text-2xl font-bold text-gray-900">
              {participants.length}
            </p>
          </div>
        </div>

        {/* Empty State */}
        {participants.length === 0 ? (
          <div className="bg-white border border-gray-200 rounded-2xl p-8 sm:p-12 text-center">
            <div className="text-4xl mb-4">👥</div>

            <h2 className="text-lg sm:text-xl font-semibold text-gray-900">
              No participants yet
            </h2>

            <p className="text-sm sm:text-base text-gray-500 mt-2">
              Nobody has registered for this competition yet.
            </p>
          </div>
        ) : (
          <>
            {/* Desktop / Tablet Table */}
            <div className="hidden md:block bg-white border border-gray-200 rounded-2xl overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 border-b border-gray-200">
                    <tr>
                      <th className="text-left px-5 py-4 text-xs font-semibold text-gray-500 uppercase">
                        Participant
                      </th>

                      <th className="text-left px-5 py-4 text-xs font-semibold text-gray-500 uppercase">
                        Contact
                      </th>

                      <th className="text-left px-5 py-4 text-xs font-semibold text-gray-500 uppercase">
                        Age
                      </th>

                      <th className="text-left px-5 py-4 text-xs font-semibold text-gray-500 uppercase">
                        Gender
                      </th>

                      <th className="text-left px-5 py-4 text-xs font-semibold text-gray-500 uppercase">
                        City
                      </th>

                      <th className="text-left px-5 py-4 text-xs font-semibold text-gray-500 uppercase">
                        Registered
                      </th>
                    </tr>
                  </thead>

                  <tbody className="divide-y divide-gray-100">
                    {participants.map((participant) => (
                      <tr
                        key={participant._id}
                        className="hover:bg-gray-50 transition"
                      >
                        <td className="px-5 py-4">
                          <div>
                            <p className="font-medium text-gray-900">
                              {participant.user?.name ||
                                "Unknown User"}
                            </p>

                            {participant.experience && (
                              <p className="text-xs text-gray-500 mt-1">
                                {participant.experience}
                              </p>
                            )}
                          </div>
                        </td>

                        <td className="px-5 py-4">
                          <p className="text-sm text-gray-700">
                            {participant.user?.email || "-"}
                          </p>

                          <p className="text-xs text-gray-500 mt-1">
                            {participant.user?.phone || "-"}
                          </p>
                        </td>

                        <td className="px-5 py-4 text-sm text-gray-700">
                          {participant.age}
                        </td>

                        <td className="px-5 py-4 text-sm text-gray-700 capitalize">
                          {participant.gender?.replaceAll(
                            "_",
                            " "
                          )}
                        </td>

                        <td className="px-5 py-4 text-sm text-gray-700">
                          {participant.city}
                        </td>

                        <td className="px-5 py-4 text-sm text-gray-500">
                          {participant.registeredAt
                            ? new Date(
                                participant.registeredAt
                              ).toLocaleDateString()
                            : "-"}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Mobile Cards */}
            <div className="md:hidden space-y-4">
              {participants.map((participant, index) => (
                <div
                  key={participant._id}
                  className="bg-white border border-gray-200 rounded-2xl p-5"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="text-xs text-gray-400">
                        Participant #{index + 1}
                      </p>

                      <h2 className="font-semibold text-gray-900 mt-1">
                        {participant.user?.name ||
                          "Unknown User"}
                      </h2>
                    </div>

                    <span className="text-xs bg-green-50 text-green-700 px-2.5 py-1 rounded-full">
                      Registered
                    </span>
                  </div>

                  <div className="mt-5 space-y-3 text-sm">
                    <div>
                      <p className="text-xs text-gray-400">
                        Email
                      </p>

                      <p className="text-gray-700 break-all">
                        {participant.user?.email || "-"}
                      </p>
                    </div>

                    <div>
                      <p className="text-xs text-gray-400">
                        Phone
                      </p>

                      <p className="text-gray-700">
                        {participant.user?.phone || "-"}
                      </p>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-xs text-gray-400">
                          Age
                        </p>

                        <p className="text-gray-700">
                          {participant.age}
                        </p>
                      </div>

                      <div>
                        <p className="text-xs text-gray-400">
                          Gender
                        </p>

                        <p className="text-gray-700 capitalize">
                          {participant.gender?.replaceAll(
                            "_",
                            " "
                          )}
                        </p>
                      </div>
                    </div>

                    <div>
                      <p className="text-xs text-gray-400">
                        City
                      </p>

                      <p className="text-gray-700">
                        {participant.city}
                      </p>
                    </div>

                    {participant.experience && (
                      <div>
                        <p className="text-xs text-gray-400">
                          Experience
                        </p>

                        <p className="text-gray-700">
                          {participant.experience}
                        </p>
                      </div>
                    )}

                    {participant.github && (
                      <div>
                        <p className="text-xs text-gray-400">
                          GitHub
                        </p>

                        <a
                          href={participant.github}
                          target="_blank"
                          rel="noreferrer"
                          className="text-indigo-600 hover:underline break-all"
                        >
                          {participant.github}
                        </a>
                      </div>
                    )}

                    <div>
                      <p className="text-xs text-gray-400">
                        Registered On
                      </p>

                      <p className="text-gray-700">
                        {participant.registeredAt
                          ? new Date(
                              participant.registeredAt
                            ).toLocaleDateString()
                          : "-"}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default AdminParticipants;