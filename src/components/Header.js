import { Link, useNavigate, useLocation } from "react-router-dom";
import logo from "../images/logo.png";

export default function Header() {
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    localStorage.removeItem("authToken");
    navigate("/login");
  };

  const isAuthenticated = !!localStorage.getItem("authToken");
  const isAuthPage = location.pathname === "/login" || location.pathname === "/register";

  return (
    <nav className="bg-gradient-to-r from-blue-600 to-blue-800 border-b shadow-lg py-2">
      <div className="container mx-auto flex items-center justify-between max-w-6xl px-4">
        <Link className="text-white text-xl font-bold hover:text-blue-200 transition-colors duration-300 ml-8" to="/">
          <img className="h-16 w-auto rounded-lg shadow-md hover:shadow-lg transition-all duration-300" src={logo} alt="" />
        </Link>

        <div className="lg:flex items-center space-x-8">
          <ul className="flex space-x-8">
            {!isAuthenticated && !isAuthPage && (
              <>
                <li>
                  <Link to="/login" className="text-white font-semibold hover:text-blue-200 transition-colors duration-300">
                    Login
                  </Link>
                </li>
                <li>
                  <Link to="/register" className="text-white font-semibold hover:text-blue-200 transition-colors duration-300">
                    Register
                  </Link>
                </li>
              </>
            )}
            {isAuthenticated && (
              <>
                <li>
                  <Link to="/train" className="text-white font-semibold hover:text-blue-200 transition-colors duration-300">
                    Train
                  </Link>
                </li>
                <li>
                  <Link to="/predict" className="text-white font-semibold hover:text-blue-200 transition-colors duration-300">
                    Predict
                  </Link>
                </li>
              </>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
}