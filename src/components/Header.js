import { Link, useNavigate, useLocation } from "react-router-dom";
import logo from "../images/logo.png";

export default function Header() {
  const navigate = useNavigate();
  const location = useLocation(); // Récupérer l'emplacement actuel

  const handleLogout = () => {
    localStorage.removeItem("authToken"); // Supprimer le token
    navigate("/login"); // Rediriger vers la page de connexion
  };

  const isAuthenticated = !!localStorage.getItem("authToken");
  const isAuthPage = location.pathname === "/login" || location.pathname === "/register"; // Vérifier si on est sur Login/Register

  return (
    <nav className="bg-stone-700 border-b shadow py-1 mb-3">
      <div className="container mx-auto flex items-center justify-between max-w-4xl">
        <Link className="text-lg font-semibold" to="/">
          <img className="h-16 w-auto" src={logo} alt="" />
        </Link>

        <div className="lg:flex items-center space-x-6">
          <ul className="flex space-x-8">
            {!isAuthPage && ( // Cacher Train et Predict sur Login/Register
              <>
                <li className="font-bold text-center hover:text-gray-200">
                  <Link to="/train">Train</Link>
                </li>
                <li className="font-bold text-center hover:text-gray-200">
                  <Link to="/predict">Predict</Link>
                </li>
              </>
            )}
            {!isAuthenticated && (
              <>
                <li className="font-bold text-center hover:text-gray-200">
                  <Link to="/login">Login</Link>
                </li>
                <li className="font-bold text-center hover:text-gray-200">
                  <Link to="/register">Register</Link>
                </li>
              </>
            )}
            {isAuthenticated && (
              <li className="font-bold text-center hover:text-gray-200">
                <button onClick={handleLogout} className="text-white">
                  Logout
                </button>
              </li>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
}