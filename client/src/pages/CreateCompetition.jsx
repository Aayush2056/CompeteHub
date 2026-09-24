import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../services/api";

const CreateCompetition = () => {
  const navigate = useNavigate();

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

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

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

    const requiredFields = [
      "title",
      "description",
      "category",
      "prizePool",
      "maxParticipants",
      "registrationStart",
      "registrationDeadline",
      "competitionDate",
      "judgeName",
    ];

    const missingField = requiredFields.find(
      (field) => !formData[field]
    );

    if (missingField) {
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

    if (registrationDeadline <= registrationStart) {
      setError(
        "Registration deadline must be after registration start."
      );
      return;
    }

    if (competitionDate <= registrationDeadline) {
      setError(
        "Competition date must be after the registration deadline."
      );
      return;
    }

    try {
      setLoading(true);

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

      const response = await api.post(
        "/competitions",
        data
      );

      setSuccess(
        response.data.message ||
          "Competition created successfully."
      );

      setTimeout(() => {
        navigate("/admin");
      }, 1000);
    } catch (error) {
      console.log("CREATE COMPETITION ERROR:", error);

      setError(
        error.response?.data?.message ||
          "Failed to create competition."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10 lg:py-14">

        {/* Back */}
        <Link
          to="/admin"
          className="inline-flex items-center text-sm text-gray-500 hover:text-gray-900 transition"
        >
          ← Back to Dashboard
        </Link>

        {/* Header */}
        <div className="mt-6 sm:mt-8">
          <p className="text-sm font-semibold text-indigo-600">
            ADMIN PANEL
          </p>

          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mt-2">
            Create Competition
          </h1>

          <p className="text-sm sm:text-base text-gray-500 mt-2">
            Add competition details and publish it for participants.
          </p>
        </div>

        {/* Form */}
        <form
          onSubmit={handleSubmit}
          className="mt-8 space-y-6"
        >

          {/* Messages */}
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-600 rounded-lg px-4 py-3 text-sm">
              {error}
            </div>
          )}

          {success && (
            <div className="bg-green-50 border border-green-200 text-green-600 rounded-lg px-4 py-3 text-sm">
              {success}
            </div>
          )}

          {/* Basic Information */}
          <section className="bg-white border border-gray-200 rounded-2xl p-5 sm:p-7 lg:p-8">

            <h2 className="text-lg sm:text-xl font-bold text-gray-900">
              Basic Information
            </h2>

            <p className="text-sm text-gray-500 mt-1">
              Provide the basic details of your competition.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mt-6">

              {/* Title */}
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Competition Title *
                </label>

                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  placeholder="e.g. National Innovation Challenge"
                  className="input"
                />
              </div>

              {/* Category */}
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
                  <option value="Business">Business / Startup</option>
                  <option value="Quiz">Quiz</option>
                  <option value="Debate">Debate</option>
                  <option value="Photography">Photography</option>
                  <option value="Music">Music</option>
                  <option value="Sports">Sports</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              {/* Image */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Competition Image URL
                </label>

                <input
                  type="url"
                  name="image"
                  value={formData.image}
                  onChange={handleChange}
                  placeholder="https://..."
                  className="input"
                />
              </div>

              {/* Description */}
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description *
                </label>

                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  rows="5"
                  placeholder="Describe the competition..."
                  className="input resize-none"
                />
              </div>
            </div>
          </section>

          {/* Pricing & Capacity */}
          <section className="bg-white border border-gray-200 rounded-2xl p-5 sm:p-7 lg:p-8">

            <h2 className="text-lg sm:text-xl font-bold text-gray-900">
              Pricing & Capacity
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 mt-6">

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Prize Pool (₹) *
                </label>

                <input
                  type="number"
                  min="0"
                  name="prizePool"
                  value={formData.prizePool}
                  onChange={handleChange}
                  placeholder="50000"
                  className="input"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Entry Fee (₹)
                </label>

                <input
                  type="number"
                  min="0"
                  name="entryFee"
                  value={formData.entryFee}
                  onChange={handleChange}
                  placeholder="0"
                  className="input"
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
                  placeholder="100"
                  className="input"
                />
              </div>

            </div>
          </section>

          {/* Dates */}
          <section className="bg-white border border-gray-200 rounded-2xl p-5 sm:p-7 lg:p-8">

            <h2 className="text-lg sm:text-xl font-bold text-gray-900">
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
          <section className="bg-white border border-gray-200 rounded-2xl p-5 sm:p-7 lg:p-8">

            <h2 className="text-lg sm:text-xl font-bold text-gray-900">
              Judge Information
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mt-6">

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Judge Name *
                </label>

                <input
                  type="text"
                  name="judgeName"
                  value={formData.judgeName}
                  onChange={handleChange}
                  placeholder="Judge name"
                  className="input"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Judge Image URL
                </label>

                <input
                  type="url"
                  name="judgeImage"
                  value={formData.judgeImage}
                  onChange={handleChange}
                  placeholder="https://..."
                  className="input"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Judge Experience
                </label>

                <textarea
                  name="judgeExperience"
                  value={formData.judgeExperience}
                  onChange={handleChange}
                  rows="3"
                  placeholder="e.g. 10+ years of experience in..."
                  className="input resize-none"
                />
              </div>

            </div>
          </section>

          {/* Rules & Evaluation */}
          <section className="bg-white border border-gray-200 rounded-2xl p-5 sm:p-7 lg:p-8">

            <h2 className="text-lg sm:text-xl font-bold text-gray-900">
              Rules & Evaluation
            </h2>

            <p className="text-sm text-gray-500 mt-1">
              Enter one item per line.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mt-6">

              {/* Rules */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Competition Rules
                </label>

                <textarea
                  name="rules"
                  value={formData.rules}
                  onChange={handleChange}
                  rows="7"
                  placeholder={`One submission per participant
Original work only
Follow competition guidelines
Submit before deadline`}
                  className="input resize-none"
                />
              </div>

              {/* Judging */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Judging Parameters
                </label>

                <textarea
                  name="judgingParameters"
                  value={formData.judgingParameters}
                  onChange={handleChange}
                  rows="7"
                  placeholder={`Innovation
Quality
Originality
Technical execution`}
                  className="input resize-none"
                />
              </div>

            </div>
          </section>

          {/* Registration Fields */}
          <section className="bg-white border border-gray-200 rounded-2xl p-5 sm:p-7 lg:p-8">

            <h2 className="text-lg sm:text-xl font-bold text-gray-900">
              Registration Form
            </h2>

            <p className="text-sm text-gray-500 mt-1">
              Add additional information you want participants
              to provide. Enter one field per line.
            </p>

            <textarea
              name="registrationFields"
              value={formData.registrationFields}
              onChange={handleChange}
              rows="6"
              placeholder={`Age
Gender
City
Experience
GitHub URL`}
              className="input mt-6 resize-none"
            />
          </section>

          {/* Submit */}
          <div className="flex flex-col-reverse sm:flex-row gap-3 sm:justify-end">

            <Link
              to="/admin"
              className="w-full sm:w-auto px-6 py-3 text-center border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-100 transition"
            >
              Cancel
            </Link>

            <button
              type="submit"
              disabled={loading}
              className="w-full sm:w-auto px-7 py-3 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 transition disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {loading
                ? "Creating..."
                : "Create Competition"}
            </button>

          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateCompetition;