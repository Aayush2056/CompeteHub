import { Link } from "react-router-dom";

const CompetitionCard = ({ competition }) => {
  const statusStyles = {
    upcoming: "bg-blue-50 text-blue-700",
    registration_open: "bg-green-50 text-green-700",
    registration_closed: "bg-yellow-50 text-yellow-700",
    completed: "bg-gray-100 text-gray-700",
  };

  const statusText = {
    upcoming: "Upcoming",
    registration_open: "Registration Open",
    registration_closed: "Registration Closed",
    completed: "Completed",
  };

  const currentStatus =
    competition.currentStatus || "upcoming";

  const remainingSpots = Math.max(
    0,
    competition.remainingSpots ??
      competition.maxParticipants -
        competition.registeredParticipants
  );

  return (
    <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden hover:shadow-md transition">

      {/* Image */}
      {competition.image ? (
        <img
          src={competition.image}
          alt={competition.title}
          className="w-full h-48 object-cover"
        />
      ) : (
        <div className="w-full h-48 bg-gray-100 flex items-center justify-center">
          <span className="text-4xl">🏆</span>
        </div>
      )}

      <div className="p-5">

        {/* Category + Status */}
        <div className="flex flex-wrap items-center justify-between gap-2">

          <span className="text-xs font-medium text-indigo-600 bg-indigo-50 px-3 py-1 rounded-full">
            {competition.category}
          </span>

          <span
            className={`text-xs font-medium px-3 py-1 rounded-full ${
              statusStyles[currentStatus]
            }`}
          >
            {statusText[currentStatus]}
          </span>

        </div>

        {/* Title */}
        <h2 className="text-lg sm:text-xl font-semibold text-gray-900 mt-4">
          {competition.title}
        </h2>

        {/* Description */}
        <p className="text-sm text-gray-500 mt-2 line-clamp-2 leading-relaxed">
          {competition.description}
        </p>

        {/* Prize + Spots */}
        <div className="grid grid-cols-2 gap-3 mt-5">

          <div className="bg-gray-50 rounded-lg p-3">
            <p className="text-xs text-gray-500">
              Prize Pool
            </p>

            <p className="font-semibold text-gray-900 mt-1">
              ₹{Number(competition.prizePool).toLocaleString("en-IN")}
            </p>
          </div>

          <div className="bg-gray-50 rounded-lg p-3">
            <p className="text-xs text-gray-500">
              Available Spots
            </p>

            <p
              className={`font-semibold mt-1 ${
                remainingSpots === 0
                  ? "text-red-600"
                  : "text-gray-900"
              }`}
            >
              {remainingSpots}
            </p>
          </div>

        </div>

        {/* Participants */}
        <div className="mt-4 flex items-center justify-between text-xs sm:text-sm">
          <span className="text-gray-500">
            Participants
          </span>

          <span className="font-medium text-gray-800">
            {competition.registeredParticipants} /{" "}
            {competition.maxParticipants}
          </span>
        </div>

        {/* Deadline */}
        <div className="mt-5">
          <p className="text-xs text-gray-500">
            Registration Deadline
          </p>

          <p className="text-sm font-medium text-gray-800 mt-1">
            {new Date(
              competition.registrationDeadline
            ).toLocaleString()}
          </p>
        </div>

        {/* Button */}
        <Link
          to={`/competitions/${competition._id}`}
          className="block w-full text-center mt-5 py-3 bg-gray-900 text-white rounded-lg font-medium hover:bg-gray-800 transition"
        >
          View Competition
        </Link>

      </div>
    </div>
  );
};

export default CompetitionCard;