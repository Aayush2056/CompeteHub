import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Home = () => {
  const { isAuthenticated, user } = useAuth();

  return (
    <div className="min-h-screen bg-white">

      {/* =====================================================
          HERO SECTION
      ===================================================== */}
      <section className="bg-gray-50">
        <div
          className="
            max-w-7xl mx-auto
            px-4 sm:px-6 lg:px-8
            py-12 sm:py-16 lg:py-24
          "
        >
          <div
            className="
              grid
              grid-cols-1
              lg:grid-cols-2
              gap-10 sm:gap-12 lg:gap-16
              items-center
            "
          >

            {/* ================= LEFT CONTENT ================= */}
            <div className="text-center lg:text-left">

              <p
                className="
                  text-sm sm:text-base
                  font-semibold
                  text-indigo-600
                  mb-4
                "
              >
                Discover • Participate • Compete
              </p>

              <h1
                className="
                  text-3xl
                  sm:text-4xl
                  md:text-5xl
                  lg:text-6xl
                  font-bold
                  text-gray-900
                  leading-tight
                "
              >
                Find Competitions.

                <span className="block text-indigo-600">
                  Show Your Skills.
                </span>
              </h1>

              <p
                className="
                  mt-5 sm:mt-6
                  text-sm sm:text-base lg:text-lg
                  text-gray-600
                  leading-relaxed
                  max-w-xl
                  mx-auto lg:mx-0
                "
              >
                Discover competitions across different categories,
                register easily, showcase your skills and participate
                in exciting challenges.
              </p>

              {/* ================= BUTTONS ================= */}
              <div
                className="
                  mt-7 sm:mt-8
                  flex
                  flex-col
                  sm:flex-row
                  gap-3 sm:gap-4
                  justify-center lg:justify-start
                "
              >

                {/* Explore Competitions */}
                <Link
                  to="/competitions"
                  className="
                    w-full sm:w-auto
                    px-6 py-3.5
                    bg-indigo-600
                    text-white
                    rounded-lg
                    font-medium
                    text-center
                    hover:bg-indigo-700
                    transition
                  "
                >
                  Explore Competitions
                </Link>

                {/* Dynamic Button */}
                {isAuthenticated ? (
                  <Link
                    to="/my-registrations"
                    className="
                      w-full sm:w-auto
                      px-6 py-3.5
                      border border-gray-300
                      text-gray-700
                      rounded-lg
                      font-medium
                      text-center
                      hover:bg-gray-100
                      transition
                    "
                  >
                    My Registrations
                  </Link>
                ) : (
                  <Link
                    to="/register"
                    className="
                      w-full sm:w-auto
                      px-6 py-3.5
                      border border-gray-300
                      text-gray-700
                      rounded-lg
                      font-medium
                      text-center
                      hover:bg-gray-100
                      transition
                    "
                  >
                    Create Account
                  </Link>
                )}

              </div>

              {/* Logged In Message */}
              {isAuthenticated && (
                <p className="mt-5 text-sm text-gray-500">
                  Welcome back,{" "}
                  <span className="font-semibold text-gray-800">
                    {user?.name}
                  </span>
                  !
                </p>
              )}

            </div>

            {/* ================= RIGHT CONTENT ================= */}
            <div className="w-full">

              <div
                className="
                  bg-white
                  border border-gray-200
                  rounded-2xl sm:rounded-3xl
                  shadow-sm
                  p-5 sm:p-7 lg:p-10
                "
              >

                {/* Icon */}
                <div
                  className="
                    w-14 h-14
                    sm:w-16 sm:h-16
                    bg-indigo-100
                    rounded-xl sm:rounded-2xl
                    flex items-center justify-center
                    text-2xl sm:text-3xl
                  "
                >
                  🏆
                </div>

                {/* Heading */}
                <h2
                  className="
                    text-xl
                    sm:text-2xl
                    lg:text-3xl
                    font-bold
                    text-gray-900
                    mt-5 sm:mt-7
                  "
                >
                  Your Competition Journey
                </h2>

                {/* Description */}
                <p
                  className="
                    text-sm sm:text-base
                    text-gray-500
                    mt-3 sm:mt-4
                    leading-relaxed
                  "
                >
                  Explore competitions, register for challenges
                  and submit your work — all from one platform.
                </p>

                {/* ================= THREE STEPS ================= */}
                <div
                  className="
                    grid
                    grid-cols-3
                    gap-2 sm:gap-4
                    mt-6 sm:mt-8
                  "
                >

                  {/* Explore */}
                  <div
                    className="
                      bg-gray-50
                      rounded-lg sm:rounded-xl
                      p-3 sm:p-4
                      text-center
                    "
                  >
                    <p
                      className="
                        text-sm sm:text-lg
                        lg:text-xl
                        font-bold
                        text-gray-900
                      "
                    >
                      Explore
                    </p>

                    <p
                      className="
                        text-[10px] sm:text-xs lg:text-sm
                        text-gray-500
                        mt-1
                      "
                    >
                      Discover
                    </p>
                  </div>

                  {/* Join */}
                  <div
                    className="
                      bg-gray-50
                      rounded-lg sm:rounded-xl
                      p-3 sm:p-4
                      text-center
                    "
                  >
                    <p
                      className="
                        text-sm sm:text-lg
                        lg:text-xl
                        font-bold
                        text-gray-900
                      "
                    >
                      Join
                    </p>

                    <p
                      className="
                        text-[10px] sm:text-xs lg:text-sm
                        text-gray-500
                        mt-1
                      "
                    >
                      Participate
                    </p>
                  </div>

                  {/* Submit */}
                  <div
                    className="
                      bg-gray-50
                      rounded-lg sm:rounded-xl
                      p-3 sm:p-4
                      text-center
                    "
                  >
                    <p
                      className="
                        text-sm sm:text-lg
                        lg:text-xl
                        font-bold
                        text-gray-900
                      "
                    >
                      Submit
                    </p>

                    <p
                      className="
                        text-[10px] sm:text-xs lg:text-sm
                        text-gray-500
                        mt-1
                      "
                    >
                      Showcase
                    </p>
                  </div>

                </div>

                {/* Browse Button */}
                <Link
                  to="/competitions"
                  className="
                    block
                    text-center
                    mt-6 sm:mt-8
                    w-full
                    py-3
                    bg-gray-900
                    text-white
                    rounded-lg
                    font-medium
                    hover:bg-gray-800
                    transition
                  "
                >
                  Browse Competitions
                </Link>

              </div>

            </div>

          </div>
        </div>
      </section>

      {/* =====================================================
          FEATURES SECTION
      ===================================================== */}
      <section className="py-12 sm:py-16 lg:py-20">
        <div
          className="
            max-w-7xl mx-auto
            px-4 sm:px-6 lg:px-8
          "
        >

          {/* Section Heading */}
          <div
            className="
              text-center
              max-w-2xl
              mx-auto
              mb-10 sm:mb-12
            "
          >
            <p
              className="
                text-sm
                font-semibold
                text-indigo-600
              "
            >
              HOW IT WORKS
            </p>

            <h2
              className="
                text-2xl
                sm:text-3xl
                lg:text-4xl
                font-bold
                text-gray-900
                mt-2
              "
            >
              Everything you need to compete
            </h2>

            <p
              className="
                text-sm sm:text-base
                text-gray-500
                mt-3 sm:mt-4
              "
            >
              Find competitions, register and showcase your work
              through one simple platform.
            </p>
          </div>

          {/* Feature Cards */}
          <div
            className="
              grid
              grid-cols-1
              sm:grid-cols-2
              lg:grid-cols-3
              gap-4 sm:gap-6
            "
          >

            {/* ================= DISCOVER ================= */}
            <div
              className="
                p-5 sm:p-6 lg:p-8
                border border-gray-200
                rounded-xl sm:rounded-2xl
                hover:shadow-md
                transition
              "
            >
              <div
                className="
                  w-11 h-11
                  sm:w-12 sm:h-12
                  flex items-center justify-center
                  bg-indigo-100
                  text-indigo-600
                  rounded-xl
                  text-xl
                "
              >
                🔍
              </div>

              <h3
                className="
                  text-lg sm:text-xl
                  font-semibold
                  text-gray-900
                  mt-4 sm:mt-5
                "
              >
                Discover
              </h3>

              <p
                className="
                  text-sm sm:text-base
                  text-gray-500
                  mt-2 sm:mt-3
                  leading-relaxed
                "
              >
                Explore competitions from different categories
                and find challenges that match your interests.
              </p>
            </div>

            {/* ================= PARTICIPATE ================= */}
            <div
              className="
                p-5 sm:p-6 lg:p-8
                border border-gray-200
                rounded-xl sm:rounded-2xl
                hover:shadow-md
                transition
              "
            >
              <div
                className="
                  w-11 h-11
                  sm:w-12 sm:h-12
                  flex items-center justify-center
                  bg-indigo-100
                  text-indigo-600
                  rounded-xl
                  text-xl
                "
              >
                📝
              </div>

              <h3
                className="
                  text-lg sm:text-xl
                  font-semibold
                  text-gray-900
                  mt-4 sm:mt-5
                "
              >
                Participate
              </h3>

              <p
                className="
                  text-sm sm:text-base
                  text-gray-500
                  mt-2 sm:mt-3
                  leading-relaxed
                "
              >
                Register for competitions with a simple form
                and keep track of your participation.
              </p>
            </div>

            {/* ================= SUBMIT ================= */}
            <div
              className="
                p-5 sm:p-6 lg:p-8
                border border-gray-200
                rounded-xl sm:rounded-2xl
                hover:shadow-md
                transition
                sm:col-span-2
                lg:col-span-1
              "
            >
              <div
                className="
                  w-11 h-11
                  sm:w-12 sm:h-12
                  flex items-center justify-center
                  bg-indigo-100
                  text-indigo-600
                  rounded-xl
                  text-xl
                "
              >
                🚀
              </div>

              <h3
                className="
                  text-lg sm:text-xl
                  font-semibold
                  text-gray-900
                  mt-4 sm:mt-5
                "
              >
                Submit
              </h3>

              <p
                className="
                  text-sm sm:text-base
                  text-gray-500
                  mt-2 sm:mt-3
                  leading-relaxed
                "
              >
                Upload your project or work and showcase your
                skills to competition organizers.
              </p>
            </div>

          </div>
        </div>
      </section>

      {/* =====================================================
          CTA SECTION
      ===================================================== */}
      <section className="bg-gray-900">
        <div
          className="
            max-w-7xl mx-auto
            px-4 sm:px-6 lg:px-8
            py-14 sm:py-16 lg:py-20
          "
        >

          <div
            className="
              text-center
              max-w-2xl
              mx-auto
            "
          >

            <h2
              className="
                text-2xl
                sm:text-3xl
                lg:text-4xl
                font-bold
                text-white
              "
            >
              Ready to showcase your skills?
            </h2>

            <p
              className="
                text-sm sm:text-base
                text-gray-400
                mt-4
                leading-relaxed
              "
            >
              Explore competitions and take part in challenges
              that help you learn, compete and grow.
            </p>

            <div className="mt-7 sm:mt-8">

              {isAuthenticated ? (
                <Link
                  to="/competitions"
                  className="
                    inline-flex
                    items-center
                    justify-center
                    w-full sm:w-auto
                    px-7
                    py-3.5
                    bg-white
                    text-gray-900
                    rounded-lg
                    font-medium
                    hover:bg-gray-100
                    transition
                  "
                >
                  Explore Competitions
                </Link>
              ) : (
                <Link
                  to="/register"
                  className="
                    inline-flex
                    items-center
                    justify-center
                    w-full sm:w-auto
                    px-7
                    py-3.5
                    bg-white
                    text-gray-900
                    rounded-lg
                    font-medium
                    hover:bg-gray-100
                    transition
                  "
                >
                  Create Your Account
                </Link>
              )}

            </div>

          </div>

        </div>
      </section>

    </div>
  );
};

export default Home;