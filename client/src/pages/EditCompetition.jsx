import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import api from "../services/api";

const EditCompetition = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "",
    image: "",
    prizePool: "",
    entryFee: "0",
    maxParticipants: "",
    registrationStart: "",
    registrationDeadline: "",
    competitionDate: "",
    judgeName: "",
    judgeImage: "",
    judgeExperience: "",
    rules: "",
    judgingParameters: "",
    registrationFields: "",
  });

  useEffect(() => {
    const fetchCompetition = async () => {
      try {
        setLoading(true);

        const response = await api.get(`/competitions/${id}`);
        const competition = response.data.competition;

        setFormData({
          title: competition.title || "",
          description: competition.description || "",
          category: competition.category || "",
          image: competition.image || "",
          prizePool: competition.prizePool ?? "",
          entryFee: competition.entryFee ?? 0,
          maxParticipants: competition.maxParticipants ?? "",

          registrationStart: competition.registrationStart
            ? formatDateTimeLocal(competition.registrationStart)
            : "",

          registrationDeadline: competition.registrationDeadline
            ? formatDateTimeLocal(competition.registrationDeadline)
            : "",

          competitionDate: competition.competitionDate
            ? formatDateTimeLocal(competition.competitionDate)
            : "",

          judgeName: competition.judge?.name || "",
          judgeImage: competition.judge?.image || "",
          judgeExperience: competition.judge?.experience || "",

          rules: competition.rules?.join("\n") || "",

          judgingParameters:
            competition.judgingParameters?.join("\n") || "",

          registrationFields:
            competition.registrationFields?.join("\n") || "",
        });
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

  const formatDateTimeLocal = (date) => {
    const d = new Date(date);

    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");
    const hours = String(d.getHours()).padStart(2, "0");
    const minutes = String(d.getMinutes()).padStart(2, "0");

    return `${year}-${month}-${day}T${hours}:${minutes}`;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");
    setSuccess("");

    if (
      !formData.title ||
      !formData.description ||
      !formData.category ||
      !formData.prizePool ||
      !formData.maxParticipants ||
      !formData.registrationStart ||
      !formData.registrationDeadline ||
      !formData.competitionDate ||
      !formData.judgeName
    ) {
      setError("Please fill all required fields.");
      return;
    }

    const registrationStart = new Date(
      formData.registrationStart
    );

    const registrationDeadline = new Date(
      formData.registrationDeadline
    );

    const competitionDate = new Date(
      formData.competitionDate
    );

    if (registrationStart >= registrationDeadline) {
      setError(
        "Registration start must be before the registration deadline."
      );
      return;
    }

    if (registrationDeadline >= competitionDate) {
      setError(
        "Registration deadline must be before the competition date."
      );
      return;
    }

    if (Number(formData.maxParticipants) < 1) {
      setError("Maximum participants must be at least 1.");
      return;
    }

    try {
      setSaving(true);

      const data = {
        title: formData.title.trim(),
        description: formData.description.trim(),
        category: formData.category.trim(),
        image: formData.image.trim(),

        prizePool: Number(formData.prizePool),
        entryFee: Number(formData.entryFee || 0),
        maxParticipants: Number(formData.maxParticipants),

        registrationStart: formData.registrationStart,
        registrationDeadline: formData.registrationDeadline,
        competitionDate: formData.competitionDate,

        judge: {
          name: formData.judgeName.trim(),
          image: formData.judgeImage.trim(),
          experience: formData.judgeExperience.trim(),
        },

        rules: formData.rules
          .split("\n")
          .map((item) => item.trim())
          .filter(Boolean),

        judgingParameters: formData.judgingParameters
          .split("\n")
          .map((item) => item.trim())
          .filter(Boolean),

        registrationFields: formData.registrationFields
          .split("\n")
          .map((item) => item.trim())
          .filter(Boolean),
      };

      const response = await api.put(
        `/competitions/${id}`,
        data
      );

      setSuccess(
        response.data.message ||
          "Competition updated successfully."
      );

      setTimeout(() => {
        navigate("/admin");
      }, 1000);
    } catch (error) {
      console.log("UPDATE COMPETITION ERROR:", error);

      setError(
        error.response?.data?.message ||
          "Failed to update competition."
      );
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-10 h-10 border-4 border-gray-200 border-t-indigo-600 rounded-full animate-spin mx-auto" />

          <p className="mt-4 text-gray-500">
            Loading competition...
          </p>
        </div>
      </div>
    );
  }

  if (error && !formData.title) {
    return (
      <div className="min-h-screen bg-gray-50 px-4 py-10">
        <div className="max-w-3xl mx-auto">
          <div className="bg-red-50 border border-red-200 rounded-xl p-5">
            <p className="text-red-700">{error}</p>

            <Link
              to="/admin"
              className="inline-block mt-4 text-indigo-600 font-medium"
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
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10">

        {/* Header */}
        <div className="mb-8">
          <Link
            to="/admin"
            className="text-sm text-indigo-600 hover:text-indigo-700"
          >
            ← Back to Dashboard
          </Link>

          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mt-3">
            Edit Competition
          </h1>

          <p className="text-sm sm:text-base text-gray-500 mt-2">
            Update competition information and participation details.
          </p>
        </div>

        {/* Messages */}
        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 rounded-xl p-4">
            <p className="text-sm text-red-700">
              {error}
            </p>
          </div>
        )}

        {success && (
          <div className="mb-6 bg-green-50 border border-green-200 rounded-xl p-4">
            <p className="text-sm text-green-700">
              {success}
            </p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">

          {/* Basic Information */}
          <section className="bg-white border border-gray-200 rounded-2xl p-5 sm:p-7">
            <h2 className="text-lg sm:text-xl font-semibold text-gray-900">
              Basic Information
            </h2>

            <div className="grid grid-cols-1 gap-5 mt-6">

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Competition Title *
                </label>

                <input
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  className="input"
                  placeholder="Enter competition title"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description *
                </label>

                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  rows="5"
                  className="input resize-none"
                  placeholder="Describe the competition"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Category *
                </label>

                <select
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  className="input"
                >
                  <option value="">
                    Select category
                  </option>
                  <option value="Coding">Coding</option>
                  <option value="AI/ML">AI / ML</option>
                  <option value="Hackathon">Hackathon</option>
                  <option value="Design">Design</option>
                  <option value="Research">Research</option>
                  <option value="Innovation">Innovation</option>
                  <option value="Business">Business</option>
                  <option value="Quiz">Quiz</option>
                  <option value="Debate">Debate</option>
                  <option value="Photography">
                    Photography
                  </option>
                  <option value="Music">Music</option>
                  <option value="Sports">Sports</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Competition Image URL
                </label>

                <input
                  name="image"
                  value={formData.image}
                  onChange={handleChange}
                  className="input"
                  placeholder="https://..."
                />
              </div>
            </div>
          </section>

          {/* Prize & Participants */}
          <section className="bg-white border border-gray-200 rounded-2xl p-5 sm:p-7">
            <h2 className="text-lg sm:text-xl font-semibold text-gray-900">
              Prize & Participation
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 mt-6">

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Prize Pool *
                </label>

                <input
                  type="number"
                  min="0"
                  name="prizePool"
                  value={formData.prizePool}
                  onChange={handleChange}
                  className="input"
                  placeholder="50000"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Entry Fee
                </label>

                <input
                  type="number"
                  min="0"
                  name="entryFee"
                  value={formData.entryFee}
                  onChange={handleChange}
                  className="input"
                  placeholder="0"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Maximum Participants *
                </label>

                <input
                  type="number"
                  min="1"
                  name="maxParticipants"
                  value={formData.maxParticipants}
                  onChange={handleChange}
                  className="input"
                  placeholder="100"
                />
              </div>
            </div>
          </section>

          {/* Dates */}
          <section className="bg-white border border-gray-200 rounded-2xl p-5 sm:p-7">
            <h2 className="text-lg sm:text-xl font-semibold text-gray-900">
              Competition Timeline
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mt-6">

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Registration Starts *
                </label>

                <input
                  type="datetime-local"
                  name="registrationStart"
                  value={formData.registrationStart}
                  onChange={handleChange}
                  className="input"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Registration Deadline *
                </label>

                <input
                  type="datetime-local"
                  name="registrationDeadline"
                  value={formData.registrationDeadline}
                  onChange={handleChange}
                  className="input"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Competition Date *
                </label>

                <input
                  type="datetime-local"
                  name="competitionDate"
                  value={formData.competitionDate}
                  onChange={handleChange}
                  className="input"
                />
              </div>
            </div>
          </section>

          {/* Judge */}
          <section className="bg-white border border-gray-200 rounded-2xl p-5 sm:p-7">
            <h2 className="text-lg sm:text-xl font-semibold text-gray-900">
              Judge Information
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mt-6">

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Judge Name *
                </label>

                <input
                  name="judgeName"
                  value={formData.judgeName}
                  onChange={handleChange}
                  className="input"
                  placeholder="Judge name"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Judge Image URL
                </label>

                <input
                  name="judgeImage"
                  value={formData.judgeImage}
                  onChange={handleChange}
                  className="input"
                  placeholder="https://..."
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Judge Experience
                </label>

                <input
                  name="judgeExperience"
                  value={formData.judgeExperience}
                  onChange={handleChange}
                  className="input"
                  placeholder="e.g. 10+ years in product design"
                />
              </div>
            </div>
          </section>

          {/* Rules */}
          <section className="bg-white border border-gray-200 rounded-2xl p-5 sm:p-7">
            <h2 className="text-lg sm:text-xl font-semibold text-gray-900">
              Rules & Evaluation
            </h2>

            <div className="space-y-5 mt-6">

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Rules
                </label>

                <textarea
                  name="rules"
                  value={formData.rules}
                  onChange={handleChange}
                  rows="6"
                  className="input resize-none"
                  placeholder={`Enter one rule per line
Example:
Participants must submit before the deadline
Only original work is allowed`}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Judging Parameters
                </label>

                <textarea
                  name="judgingParameters"
                  value={formData.judgingParameters}
                  onChange={handleChange}
                  rows="5"
                  className="input resize-none"
                  placeholder={`Enter one parameter per line
Example:
Creativity
Technical quality
Presentation`}
                />
              </div>
            </div>
          </section>

          {/* Registration Fields */}
          <section className="bg-white border border-gray-200 rounded-2xl p-5 sm:p-7">
            <h2 className="text-lg sm:text-xl font-semibold text-gray-900">
              Registration Form
            </h2>

            <p className="text-sm text-gray-500 mt-2">
              Define the information participants should provide.
            </p>

            <textarea
              name="registrationFields"
              value={formData.registrationFields}
              onChange={handleChange}
              rows="5"
              className="input resize-none mt-5"
              placeholder={`Enter one field per line
Example:
Age
Gender
City
Experience
GitHub`}
            />
          </section>

          {/* Actions */}
          <div className="flex flex-col-reverse sm:flex-row sm:justify-end gap-3">
            <Link
              to="/admin"
              className="w-full sm:w-auto px-6 py-3 text-center border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-100 transition"
            >
              Cancel
            </Link>

            <button
              type="submit"
              disabled={saving}
              className="w-full sm:w-auto px-6 py-3 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 disabled:opacity-60 disabled:cursor-not-allowed transition"
            >
              {saving
                ? "Updating..."
                : "Update Competition"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditCompetition;