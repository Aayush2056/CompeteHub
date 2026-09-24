import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import api from "../services/api";

const Registration = () => {
  const { competitionId } = useParams();
  const navigate = useNavigate();

  const [competition, setCompetition] = useState(null);
  const [formData, setFormData] = useState({});
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Fetch competition
  useEffect(() => {
    const fetchCompetition = async () => {
      try {
        setLoading(true);

        const response = await api.get(
          `/competitions/${competitionId}`
        );

        const data = response.data.competition;

        setCompetition(data);

        // Create empty form fields dynamically
        const initialData = {};

        data.registrationFields?.forEach((field) => {
          const key = field
            .toLowerCase()
            .trim()
            .replace(/\s+/g, "_");

          initialData[key] = "";
        });

        setFormData(initialData);
      } catch (error) {
        console.log("FETCH COMPETITION ERROR:", error);

        setError(
          error.response?.data?.message ||
            "Failed to load competition."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchCompetition();
  }, [competitionId]);

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

    // Required fields
    const requiredFields = ["age", "gender", "city"];

    for (const field of requiredFields) {
      if (!formData[field]) {
        setError(`Please fill ${field}.`);
        return;
      }
    }

    try {
      setSubmitting(true);

      const response = await api.post(
        `/competitions/${competitionId}/register`,
        formData
      );

      setSuccess(response.data.message);

      setTimeout(() => {
        navigate(`/competitions/${competitionId}`);
      }, 1000);
    } catch (error) {
      console.log("REGISTRATION ERROR:", error);

      setError(
        error.response?.data?.message ||
          "Registration failed. Please try again."
      );
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <p className="text-gray-500">
          Loading registration form...
        </p>
      </div>
    );
  }

  if (!competition) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <p className="text-red-500">
          Competition not found.
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 px-4 py-8 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto">

        <Link
          to={`/competitions/${competitionId}`}
          className="text-sm text-gray-600 hover:text-indigo-600"
        >
          ← Back to competition
        </Link>

        <div className="bg-white border rounded-2xl shadow-sm mt-5 p-5 sm:p-8">

          <div className="mb-8">
            <p className="text-sm text-indigo-600 font-medium">
              {competition.category}
            </p>

            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mt-2">
              Register for {competition.title}
            </h1>

            <p className="text-gray-500 mt-2">
              Enter your details to participate in this competition.
            </p>
          </div>

          {error && (
            <div className="mb-5 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
              {error}
            </div>
          )}

          {success && (
            <div className="mb-5 bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg text-sm">
              {success}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">

            {competition.registrationFields?.map(
              (field, index) => {
                const key = field
                  .toLowerCase()
                  .trim()
                  .replace(/\s+/g, "_");

                const isRequired =
                  ["age", "gender", "city"].includes(key);

                return (
                  <div key={`${key}-${index}`}>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {field}
                      {isRequired && " *"}
                    </label>

                    {key === "gender" ? (
                      <select
                        name={key}
                        value={formData[key] || ""}
                        onChange={handleChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-white outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                      >
                        <option value="">
                          Select gender
                        </option>

                        <option value="male">
                          Male
                        </option>

                        <option value="female">
                          Female
                        </option>

                        <option value="other">
                          Other
                        </option>

                        <option value="prefer_not_to_say">
                          Prefer not to say
                        </option>
                      </select>
                    ) : key === "experience" ? (
                      <textarea
                        name={key}
                        value={formData[key] || ""}
                        onChange={handleChange}
                        rows="4"
                        placeholder={`Enter your ${field.toLowerCase()}`}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg outline-none resize-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                      />
                    ) : (
                      <input
                        type={
                          key === "age"
                            ? "number"
                            : key === "github"
                            ? "url"
                            : "text"
                        }
                        name={key}
                        value={formData[key] || ""}
                        onChange={handleChange}
                        min={key === "age" ? "5" : undefined}
                        max={key === "age" ? "100" : undefined}
                        placeholder={`Enter your ${field.toLowerCase()}`}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                      />
                    )}
                  </div>
                );
              }
            )}

            <button
              type="submit"
              disabled={submitting}
              className="w-full py-3 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 disabled:opacity-60 disabled:cursor-not-allowed transition"
            >
              {submitting
                ? "Registering..."
                : "Register Now"}
            </button>

          </form>
        </div>
      </div>
    </div>
  );
};

export default Registration;