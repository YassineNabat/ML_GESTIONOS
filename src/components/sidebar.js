import { Link, useNavigate } from "react-router-dom";

export default function Sidebar() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("authToken");
    navigate("/login");
  };

  return (
    <div className="bg-gradient-to-b from-blue-600 to-blue-800 text-white h-screen w-64 fixed top-0 left-0 p-6 shadow-xl flex flex-col justify-between">
      <div>
        <h2 className="text-2xl font-bold mb-8 text-center text-blue-100">Menu</h2>
        <ul className="space-y-6">
          <li>
            <Link
              to="/dashboard"
              className="block text-lg font-semibold text-center text-blue-100 hover:text-white hover:bg-blue-700 py-2 px-4 rounded-lg transition-all duration-300"
            >
              Dashboard
            </Link>
          </li>
          <li>
            <Link
              to="/change-password"
              className="block text-lg font-semibold text-center text-blue-100 hover:text-white hover:bg-blue-700 py-2 px-4 rounded-lg transition-all duration-300"
            >
              Changer mot de passe
            </Link>
          </li>
        </ul>
      </div>
      <button
        onClick={handleLogout}
        className="block w-full text-lg font-bold text-center text-blue-100 hover:text-white hover:bg-blue-700 py-2 px-4 rounded-lg transition-all duration-300"
      >
        Logout
      </button>
    </div>
  );
}