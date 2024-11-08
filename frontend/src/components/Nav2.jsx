import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import Logo from "./NavLogo";

function Navbar() {
  const navigate = useNavigate();
  const [authToken, setAuthToken] = useState(localStorage.getItem("jwtToken"));
  const location = useLocation();
  const logout = () => {
    setAuthToken(null);
    localStorage.removeItem("jwtToken");
    localStorage.removeItem("user_role");
    localStorage.removeItem("user_id");
    navigate("/login");
  };

  if (location.pathname === "/login" || location.pathname === "/signup") {
    return null;
  }

  return (
    <>
      <header className="shadow bg-white fixed w-full z-10 top-0">
        <div className="relative flex max-w-screen-xl flex-col overflow-hidden px-4 py-2 md:py-3 lg:py-3 md:mx-auto md:flex-row md:items-center">
          <a href="/" className="flex items-center whitespace-nowrap text-2xl font-black">
            <Logo />
          </a>
          <input type="checkbox" className="peer hidden" id="navbar-open" />
          <label className="absolute top-5 right-7 cursor-pointer md:hidden" htmlFor="navbar-open">
            <span className="sr-only">Toggle Navigation</span>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </label>
          <nav
            aria-label="Header Navigation"
            className={`peer-checked:mt-8 peer-checked:max-h-56 flex max-h-0 w-full flex-col items-center justify-between overflow-hidden transition-all md:ml-24 md:max-h-full md:flex-row md:items-start`}
          >
            <ul className="flex flex-col items-center space-y-2 md:ml-auto md:flex-row md:space-y-0">
              {/* Removed Account and Logout buttons */}
            </ul>
          </nav>
        </div>
      </header>
    </>
  );
}

export default Navbar;