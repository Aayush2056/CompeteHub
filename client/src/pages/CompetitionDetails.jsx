import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import api from "../services/api";

const CompetitionDetails = () => {
  const { id } = useParams();

  const [competition, setCompetition] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchCompetition = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await api.get(
          `/competitions/${id}`
        );

        setCompetition(response.data.competition);
      } catch (error) {
        console.log("GET COMPETITION ERROR:", error);

        setError(
          error.response?.data?.message ||
            "Failed to load competition."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchCompetition();
  }, [id]);

  /* ---------------- LOADING ---------------- */

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="text-center">
          <div className="w-10 h-10 border-4 border-gray-200 border-t-indigo-600 rounded-full animate-spin mx-auto" />

          <p className="mt-4 text-gray-500">
            Loading competition...
          </p>
        </div>
      </div>
    );
  }

  /* ---------------- ERROR ---------------- */

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 px-4 sm:px-6 lg:px-8 py-10">
        <div className="max-w-3xl mx-auto">
          <div className="bg-red-50 border border-red-200 rounded-xl p-5">
            <p className="text-sm sm:text-base text-red-700">
              {error}
            </p>

            <Link
              to="/competitions"
              className="inline-block mt-4 text-sm font-medium text-indigo-600 hover:text-indigo-700"
            >
              ← Back to Competitions
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (!competition) {
    return null;
  }

  /* ---------------- DATA ---------------- */

  const remainingSpots = Math.max(
    0,
    competition.remainingSpots ??
      competition.maxParticipants -
        competition.registeredParticipants
  );

  const currentStatus = competition.currentStatus;

  const statusStyles = {
    upcoming: "bg-blue-50 text-blue-700 border-blue-200",
    registration_open:
      "bg-green-50 text-green-700 border-green-200",
    registration_closed:
      "bg-yellow-50 text-yellow-700 border-yellow-200",
    completed:
      "bg-gray-100 text-gray-700 border-gray-200",
  };

  const statusText = {
    upcoming: "Upcoming",
    registration_open: "Registration Open",
    registration_closed: "Registration Closed",
    completed: "Completed",
  };

  return (
    <div className="min-h-screen bg-gray-50">

      {/* Main */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10">

        {/* Back */}
        <Link
          to="/competitions"
          className="inline-flex items-center text-sm text-indigo-600 hover:text-indigo-700 mb-6"
        >
          ← Back to Competitions
        </Link>

        {/* Hero */}
        <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden">

          {/* Image */}
          {competition.image ? (
            <img
              src={competition.image}
              alt={competition.title}
              className="w-full h-56 sm:h-72 lg:h-96 object-cover"
            />
          ) : (
            <div className="w-full h-56 sm:h-72 lg:h-96 bg-gray-100 flex items-center justify-center">
              <span className="text-6xl sm:text-7xl">
                🏆
              </span>
            </div>
          )}

          <div className="p-5 sm:p-8 lg:p-10">

            {/* Category + Status */}
            <div className="flex flex-wrap gap-2">

              <span className="text-xs sm:text-sm font-medium text-indigo-600 bg-indigo-50 px-3 py-1.5 rounded-full">
                {competition.category}
              </span>

              <span
                className={`text-xs sm:text-sm font-medium px-3 py-1.5 rounded-full border ${
                  statusStyles[currentStatus]
                }`}
              >
                {statusText[currentStatus]}
              </span>

            </div>

            {/* Title */}
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mt-5">
              {competition.title}
            </h1>

            {/* Description */}
            <p className="text-sm sm:text-base lg:text-lg text-gray-600 mt-4 leading-relaxed max-w-4xl">
              {competition.description}
            </p>

            {/* Stats */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mt-8">

              <div className="bg-gray-50 rounded-xl p-4">
                <p className="text-xs sm:text-sm text-gray-500">
                  Prize Pool
                </p>

                <p className="text-lg sm:text-xl font-bold text-gray-900 mt-1">
                  ₹
                  {Number(
                    competition.prizePool
                  ).toLocaleString("en-IN")}
                </p>
              </div>

              <div className="bg-gray-50 rounded-xl p-4">
                <p className="text-xs sm:text-sm text-gray-500">
                  Entry Fee
                </p>

                <p className="text-lg sm:text-xl font-bold text-gray-900 mt-1">
                  {competition.entryFee === 0
                    ? "Free"
                    : `₹${competition.entryFee}`}
                </p>
              </div>

              <div className="bg-gray-50 rounded-xl p-4">
                <p className="text-xs sm:text-sm text-gray-500">
                  Participants
                </p>

                <p className="text-lg sm:text-xl font-bold text-gray-900 mt-1">
                  {competition.registeredParticipants} /{" "}
                  {competition.maxParticipants}
                </p>
              </div>

              <div className="bg-gray-50 rounded-xl p-4">
                <p className="text-xs sm:text-sm text-gray-500">
                  Spots Left
                </p>

                <p
                  className={`text-lg sm:text-xl font-bold mt-1 ${
                    remainingSpots === 0
                      ? "text-red-600"
                      : "text-gray-900"
                  }`}
                >
                  {remainingSpots}
                </p>
              </div>

            </div>
          </div>
        </div>

        {/* Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">

          {/* LEFT */}
          <div className="lg:col-span-2 space-y-6">

            {/* Timeline */}
            <section className="bg-white border border-gray-200 rounded-2xl p-5 sm:p-7">

              <h2 className="text-xl font-semibold text-gray-900">
                Competition Timeline
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-6">

                <div className="border border-gray-200 rounded-xl p-4">
                  <p className="text-xs text-gray-500">
                    Registration Starts
                  </p>

                  <p className="text-sm font-medium text-gray-900 mt-2">
                    {new Date(
                      competition.registrationStart
                    ).toLocaleString()}
                  </p>
                </div>

                <div className="border border-gray-200 rounded-xl p-4">
                  <p className="text-xs text-gray-500">
                    Registration Deadline
                  </p>

                  <p className="text-sm font-medium text-gray-900 mt-2">
                    {new Date(
                      competition.registrationDeadline
                    ).toLocaleString()}
                  </p>
                </div>

                <div className="border border-gray-200 rounded-xl p-4">
                  <p className="text-xs text-gray-500">
                    Competition Date
                  </p>

                  <p className="text-sm font-medium text-gray-900 mt-2">
                    {new Date(
                      competition.competitionDate
                    ).toLocaleString()}
                  </p>
                </div>

              </div>
            </section>

            {/* Rules */}
            {competition.rules?.length > 0 && (
              <section className="bg-white border border-gray-200 rounded-2xl p-5 sm:p-7">

                <h2 className="text-xl font-semibold text-gray-900">
                  Rules
                </h2>

                <ul className="mt-5 space-y-3">
                  {competition.rules.map(
                    (rule, index) => (
                      <li
                        key={index}
                        className="flex gap-3 text-sm sm:text-base text-gray-600"
                      >
                        <span className="flex-shrink-0 w-6 h-6 bg-indigo-50 text-indigo-600 rounded-full flex items-center justify-center text-xs font-semibold">
                          {index + 1}
                        </span>

                        <span>{rule}</span>
                      </li>
                    )
                  )}
                </ul>

              </section>
            )}

            {/* Judging Parameters */}
            {competition.judgingParameters?.length >
              0 && (
              <section className="bg-white border border-gray-200 rounded-2xl p-5 sm:p-7">

                <h2 className="text-xl font-semibold text-gray-900">
                  Judging Parameters
                </h2>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-5">
                  {competition.judgingParameters.map(
                    (parameter, index) => (
                      <div
                        key={index}
                        className="bg-gray-50 rounded-xl p-4"
                      >
                        <p className="text-sm font-medium text-gray-800">
                          {parameter}
                        </p>
                      </div>
                    )
                  )}
                </div>

              </section>
            )}

            {/* Registration Fields */}
            {competition.registrationFields?.length >
              0 && (
              <section className="bg-white border border-gray-200 rounded-2xl p-5 sm:p-7">

                <h2 className="text-xl font-semibold text-gray-900">
                  Registration Information
                </h2>

                <p className="text-sm text-gray-500 mt-2">
                  You will be asked to provide the
                  following information during
                  registration.
                </p>

                <div className="flex flex-wrap gap-2 mt-5">
                  {competition.registrationFields.map(
                    (field, index) => (
                      <span
                        key={index}
                        className="px-3 py-2 bg-gray-100 text-gray-700 rounded-lg text-sm"
                      >
                        {field}
                      </span>
                    )
                  )}
                </div>

              </section>
            )}

          </div>

          {/* RIGHT */}
          <div className="space-y-6">

            {/* Action */}
            <section className="bg-white border border-gray-200 rounded-2xl p-5 sm:p-6">

              <h2 className="text-lg font-semibold text-gray-900">
                Participation
              </h2>

              <div className="mt-5">

                {/* UPCOMING */}
                {currentStatus === "upcoming" && (
                  <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
                    <p className="text-sm font-medium text-blue-800">
                      Registration has not started yet.
                    </p>

                    <p className="text-xs sm:text-sm text-blue-600 mt-1">
                      Registration starts on{" "}
                      {new Date(
                        competition.registrationStart
                      ).toLocaleString()}
                    </p>
                  </div>
                )}

                {/* REGISTRATION OPEN */}
                {currentStatus ===
                  "registration_open" && (
                  <>
                    {competition.hasRegistered ? (
                      <div className="space-y-3">

                        <div className="bg-green-50 border border-green-200 rounded-xl p-4">
                          <p className="text-sm font-medium text-green-700">
                            ✓ You are registered for
                            this competition.
                          </p>
                        </div>

                        <Link
                          to={`/competitions/${competition._id}/submission`}
                          className="block w-full text-center py-3.5 bg-gray-900 text-white rounded-lg font-medium hover:bg-gray-800 transition"
                        >
                          Upload Submission
                        </Link>

                      </div>
                    ) : remainingSpots <= 0 ? (
                      <div className="bg-red-50 border border-red-200 rounded-xl p-4">
                        <p className="text-sm font-medium text-red-700">
                          Competition Full
                        </p>

                        <p className="text-xs sm:text-sm text-red-600 mt-1">
                          All available participant
                          spots have been filled.
                        </p>
                      </div>
                    ) : (
                      <Link
                        to={`/competitions/${competition._id}/register`}
                        className="block w-full text-center py-3.5 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 transition"
                      >
                        Register Now
                      </Link>
                    )}
                  </>
                )}

                {/* REGISTRATION CLOSED */}
                {currentStatus ===
                  "registration_closed" && (
                  <>
                    {competition.hasRegistered ? (
                      <div className="space-y-3">

                        <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4">
                          <p className="text-sm font-medium text-yellow-800">
                            Registration is closed.
                          </p>

                          <p className="text-xs sm:text-sm text-yellow-700 mt-1">
                            Since you are registered,
                            you can still submit your
                            work.
                          </p>
                        </div>

                        <Link
                          to={`/competitions/${competition._id}/submission`}
                          className="block w-full text-center py-3.5 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 transition"
                        >
                          Upload Submission
                        </Link>

                      </div>
                    ) : (
                      <div className="bg-gray-100 border border-gray-200 rounded-xl p-4">
                        <p className="text-sm font-medium text-gray-700">
                          Registration Closed
                        </p>

                        <p className="text-xs sm:text-sm text-gray-500 mt-1">
                          The registration deadline
                          has passed.
                        </p>
                      </div>
                    )}
                  </>
                )}

                {/* COMPLETED */}
                {currentStatus === "completed" && (
                  <div className="bg-gray-100 border border-gray-200 rounded-xl p-4">
                    <p className="text-sm font-medium text-gray-800">
                      Competition Completed
                    </p>

                    <p className="text-xs sm:text-sm text-gray-500 mt-1">
                      This competition has already
                      ended.
                    </p>
                  </div>
                )}

              </div>
            </section>

            {/* Judge */}
            {competition.judge?.name && (
              <section className="bg-white border border-gray-200 rounded-2xl p-5 sm:p-6">

                <h2 className="text-lg font-semibold text-gray-900">
                  Judge
                </h2>

                <div className="flex items-center gap-4 mt-5">

                  {competition.judge.image ? (
                    <img
                      src={competition.judge.image}
                      alt={competition.judge.name}
                      className="w-14 h-14 rounded-full object-cover"
                    />
                  ) : (
                    <div className="w-14 h-14 rounded-full bg-indigo-100 flex items-center justify-center text-xl">
                      👤
                    </div>
                  )}

                  <div>
                    <p className="font-semibold text-gray-900">
                      {competition.judge.name}
                    </p>

                    {competition.judge.experience && (
                      <p className="text-sm text-gray-500 mt-1">
                        {competition.judge.experience}
                      </p>
                    )}
                  </div>

                </div>
              </section>
            )}

            {/* Availability */}
            <section className="bg-white border border-gray-200 rounded-2xl p-5 sm:p-6">

              <h2 className="text-lg font-semibold text-gray-900">
                Availability
              </h2>

              <div className="mt-5">

                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-500">
                    Registered
                  </span>

                  <span className="text-sm font-medium text-gray-900">
                    {competition.registeredParticipants}
                  </span>
                </div>

                <div className="flex items-center justify-between mt-3">
                  <span className="text-sm text-gray-500">
                    Maximum
                  </span>

                  <span className="text-sm font-medium text-gray-900">
                    {competition.maxParticipants}
                  </span>
                </div>

                <div className="w-full h-2 bg-gray-100 rounded-full mt-5 overflow-hidden">

                  <div
                    className="h-full bg-indigo-600 rounded-full transition-all"
                    style={{
                      width: `${Math.min(
                        100,
                        (competition.registeredParticipants /
                          competition.maxParticipants) *
                          100
                      )}%`,
                    }}
                  />

                </div>

                <p className="text-xs text-gray-500 mt-3 text-center">
                  {remainingSpots} spots remaining
                </p>

              </div>
            </section>

          </div>
        </div>
      </div>
    </div>
  );
};

export default CompetitionDetails;