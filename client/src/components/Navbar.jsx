import { useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Navbar = () => {
  const { user, isAuthenticated, logoutUser } = useAuth();
  const navigate = useNavigate();

  const [menuOpen, setMenuOpen] = useState(false);

  const navLinkClass = ({ isActive }) =>
    `transition ${
      isActive
        ? "text-indigo-600 font-semibold"
        : "text-gray-600 hover:text-indigo-600"
    }`;

  const handleLogout = () => {
    logoutUser();
    setMenuOpen(false);
    navigate("/");
  };

  return (
    <nav className="bg-white border-b sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">

        {/* Logo */}
        <Link
          to="/"
          className="text-2xl font-bold text-gray-900"
          onClick={() => setMenuOpen(false)}
        >
          Compete<span className="text-indigo-600">Hub</span>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-7">

          <NavLink to="/" className={navLinkClass}>
            Home
          </NavLink>

          <NavLink to="/competitions" className={navLinkClass}>
            Competitions
          </NavLink>

          {isAuthenticated && (
            <NavLink to="/my-registrations" className={navLinkClass}>
              My Registrations
            </NavLink>
          )}

          {user?.role === "admin" && (
            <NavLink to="/admin" className={navLinkClass}>
              Admin
            </NavLink>
          )}
        </div>

        {/* Desktop Auth */}
        <div className="hidden md:flex items-center gap-3">

          {isAuthenticated ? (
            <>
              <span className="text-sm text-gray-600">
                Hi,{" "}
                <span className="font-semibold text-gray-900">
                  {user?.name}
                </span>
              </span>

              <button
                onClick={handleLogout}
                className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link
                to="/login"
                className="px-4 py-2 text-gray-700 hover:text-indigo-600"
              >
                Login
              </Link>

              <Link
                to="/register"
                className="px-5 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition"
              >
                Sign Up
              </Link>
            </>
          )}
        </div>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="md:hidden p-2 rounded-lg hover:bg-gray-100"
          aria-label="Toggle menu"
        >
          {menuOpen ? (
            <span className="text-2xl">✕</span>
          ) : (
            <span className="text-2xl">☰</span>
          )}
        </button>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="md:hidden border-t bg-white px-4 py-4 space-y-3">

          <NavLink
            to="/"
            className={navLinkClass}
            onClick={() => setMenuOpen(false)}
          >
            <div className="py-2">Home</div>
          </NavLink>

          <NavLink
            to="/competitions"
            className={navLinkClass}
            onClick={() => setMenuOpen(false)}
          >
            <div className="py-2">Competitions</div>
          </NavLink>

          {isAuthenticated && (
            <NavLink
              to="/my-registrations"
              className={navLinkClass}
              onClick={() => setMenuOpen(false)}
            >
              <div className="py-2">My Registrations</div>
            </NavLink>
          )}

          {user?.role === "admin" && (
            <NavLink
              to="/admin"
              className={navLinkClass}
              onClick={() => setMenuOpen(false)}
            >
              <div className="py-2">Admin</div>
            </NavLink>
          )}

          <div className="pt-3 border-t">

            {isAuthenticated ? (
              <div className="space-y-3">
                <p className="text-sm text-gray-600">
                  Hi,{" "}
                  <span className="font-semibold text-gray-900">
                    {user?.name}
                  </span>
                </p>

                <button
                  onClick={handleLogout}
                  className="w-full py-2.5 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                >
                  Logout
                </button>
              </div>
            ) : (
              <div className="flex flex-col gap-2">
                <Link
                  to="/login"
                  onClick={() => setMenuOpen(false)}
                  className="w-full text-center py-2.5 border border-gray-300 rounded-lg text-gray-700"
                >
                  Login
                </Link>

                <Link
                  to="/register"
                  onClick={() => setMenuOpen(false)}
                  className="w-full text-center py-2.5 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
                >
                  Sign Up
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;