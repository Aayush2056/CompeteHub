import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import api from "../services/api";

const Submission = () => {
  const { competitionId } = useParams();
  const navigate = useNavigate();

  const [competition, setCompetition] = useState(null);
  const [submission, setSubmission] = useState(null);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [file, setFile] = useState(null);

  const [loading, setLoading] = useState(true);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Fetch competition + existing submission
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError("");

        const competitionResponse = await api.get(
          `/competitions/${competitionId}`
        );

        setCompetition(competitionResponse.data.competition);

        try {
          const submissionResponse = await api.get(
            `/submissions/${competitionId}`
          );

          setSubmission(submissionResponse.data.submission);
        } catch (submissionError) {
          // 404 simply means user hasn't submitted yet
          if (submissionError.response?.status !== 404) {
            throw submissionError;
          }
        }
      } catch (error) {
        console.log("SUBMISSION PAGE ERROR:", error);

        setError(
          error.response?.data?.message ||
            "Failed to load submission page."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [competitionId]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");
    setSuccess("");

    if (!title.trim()) {
      setError("Please enter your submission title.");
      return;
    }

    if (!file) {
      setError("Please select a file to upload.");
      return;
    }

    try {
      setSubmitLoading(true);

      const formData = new FormData();

      formData.append("title", title);
      formData.append("description", description);
      formData.append("submission", file);

      const response = await api.post(
        `/submissions/${competitionId}`,
        formData
      );

      setSubmission(response.data.submission);
      setSuccess("Your submission has been uploaded successfully.");

      setFile(null);
      setTitle("");
      setDescription("");

      // Reset file input
      document.getElementById("submission-file").value = "";
    } catch (error) {
      console.log("SUBMISSION ERROR:", error);

      setError(
        error.response?.data?.message ||
          "Failed to submit your work."
      );
    } finally {
      setSubmitLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <div className="text-center">
          <div className="w-10 h-10 border-4 border-gray-200 border-t-indigo-600 rounded-full animate-spin mx-auto"></div>

          <p className="mt-4 text-sm sm:text-base text-gray-500">
            Loading submission page...
          </p>
        </div>
      </div>
    );
  }

  if (error && !competition) {
    return (
      <div className="min-h-screen bg-gray-50 px-4 py-10">
        <div className="max-w-2xl mx-auto bg-white border border-red-200 rounded-2xl p-6 sm:p-10 text-center">
          <h2 className="text-xl font-semibold text-red-600">
            Something went wrong
          </h2>

          <p className="text-sm sm:text-base text-gray-600 mt-3">
            {error}
          </p>

          <Link
            to="/competitions"
            className="inline-block mt-6 px-6 py-3 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 transition"
          >
            Browse Competitions
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10 lg:py-14">

        {/* Back */}
        <Link
          to={`/competitions/${competitionId}`}
          className="inline-flex items-center text-sm text-gray-500 hover:text-gray-900 transition"
        >
          ← Back to Competition
        </Link>

        {/* Header */}
        <div className="mt-6 sm:mt-8">
          <p className="text-sm font-semibold text-indigo-600">
            SUBMISSION
          </p>

          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mt-2">
            Submit Your Work
          </h1>

          <p className="text-sm sm:text-base text-gray-500 mt-2">
            {competition?.title}
          </p>
        </div>

        {/* Already Submitted */}
        {submission ? (
          <div className="mt-8 bg-white border border-green-200 rounded-2xl p-5 sm:p-7 lg:p-8">

            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <span className="inline-flex px-3 py-1 bg-green-100 text-green-700 text-xs sm:text-sm font-medium rounded-full">
                  Submitted
                </span>

                <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mt-4">
                  {submission.title}
                </h2>
              </div>

              <div className="text-sm text-gray-500">
                Submitted on{" "}
                {new Date(
                  submission.submittedAt
                ).toLocaleDateString()}
              </div>
            </div>

            {submission.description && (
              <div className="mt-6">
                <h3 className="font-semibold text-gray-900">
                  Description
                </h3>

                <p className="text-sm sm:text-base text-gray-600 mt-2 leading-relaxed">
                  {submission.description}
                </p>
              </div>
            )}

            <div className="mt-6">
              <a
                href={submission.submissionUrl}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center justify-center w-full sm:w-auto px-6 py-3 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 transition"
              >
                View Submitted File
              </a>
            </div>
          </div>
        ) : (
          /* Submission Form */
          <div className="mt-8 grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">

            {/* Form */}
            <div className="lg:col-span-2 bg-white border border-gray-200 rounded-2xl p-5 sm:p-7 lg:p-8">

              <form onSubmit={handleSubmit}>

                {/* Error */}
                {error && (
                  <div className="mb-6 bg-red-50 border border-red-200 text-red-600 text-sm rounded-lg px-4 py-3">
                    {error}
                  </div>
                )}

                {/* Success */}
                {success && (
                  <div className="mb-6 bg-green-50 border border-green-200 text-green-600 text-sm rounded-lg px-4 py-3">
                    {success}
                  </div>
                )}

                {/* Title */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Submission Title *
                  </label>

                  <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Enter your project title"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm sm:text-base"
                  />
                </div>

                {/* Description */}
                <div className="mt-5">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Description
                  </label>

                  <textarea
                    value={description}
                    onChange={(e) =>
                      setDescription(e.target.value)
                    }
                    rows="5"
                    placeholder="Briefly describe your work..."
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg outline-none resize-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm sm:text-base"
                  />
                </div>

                {/* File */}
                <div className="mt-5">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Upload File *
                  </label>

                  <div className="border-2 border-dashed border-gray-300 rounded-xl p-5 sm:p-7 text-center hover:border-indigo-400 transition">
                    <div className="text-3xl">
                      📁
                    </div>

                    <p className="text-sm sm:text-base font-medium text-gray-800 mt-3">
                      Choose your submission file
                    </p>

                    <p className="text-xs sm:text-sm text-gray-500 mt-1">
                      PDF, ZIP, DOCX or other supported format
                    </p>

                    <input
                      id="submission-file"
                      type="file"
                      onChange={(e) =>
                        setFile(e.target.files[0])
                      }
                      className="w-full mt-5 text-sm text-gray-600"
                    />

                    {file && (
                      <p className="text-sm text-indigo-600 font-medium mt-4 break-all">
                        Selected: {file.name}
                      </p>
                    )}
                  </div>
                </div>

                {/* Submit */}
                <button
                  type="submit"
                  disabled={submitLoading}
                  className="w-full mt-6 py-3.5 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 transition disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {submitLoading
                    ? "Uploading..."
                    : "Submit Your Work"}
                </button>
              </form>
            </div>

            {/* Competition Info */}
            <div className="bg-white border border-gray-200 rounded-2xl p-5 sm:p-7 h-fit">

              <h2 className="text-lg sm:text-xl font-bold text-gray-900">
                Competition Details
              </h2>

              <div className="mt-5 space-y-4">

                <div>
                  <p className="text-xs sm:text-sm text-gray-500">
                    Competition
                  </p>

                  <p className="text-sm sm:text-base font-semibold text-gray-900 mt-1">
                    {competition?.title}
                  </p>
                </div>

                <div>
                  <p className="text-xs sm:text-sm text-gray-500">
                    Category
                  </p>

                  <p className="text-sm sm:text-base font-semibold text-gray-900 mt-1">
                    {competition?.category}
                  </p>
                </div>

                <div>
                  <p className="text-xs sm:text-sm text-gray-500">
                    Competition Date
                  </p>

                  <p className="text-sm sm:text-base font-semibold text-gray-900 mt-1">
                    {new Date(
                      competition?.competitionDate
                    ).toLocaleDateString()}
                  </p>
                </div>

                <div>
                  <p className="text-xs sm:text-sm text-gray-500">
                    Prize Pool
                  </p>

                  <p className="text-sm sm:text-base font-semibold text-gray-900 mt-1">
                    ₹
                    {competition?.prizePool?.toLocaleString()}
                  </p>
                </div>

              </div>

              <div className="mt-6 pt-6 border-t border-gray-200">
                <p className="text-sm text-gray-500 leading-relaxed">
                  Make sure your submission follows the competition
                  rules and judging criteria before uploading.
                </p>
              </div>

            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Submission;