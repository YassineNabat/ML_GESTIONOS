import { Link, useNavigate } from "react-router-dom";

export default function Sidebar() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("authToken");
    navigate("/login");
  };

  return (
    <div className="bg-gray-800 text-white h-screen w-64 fixed top-0 left-0 p-4">
      <h2 className="text-xl font-bold mb-6">Menu</h2>
      <ul className="space-y-4">
        <li>
          <Link to="/dashboard" className="hover:text-gray-300">
            Dashboard
          </Link>
        </li>
        <li>
          <Link to="/change-password" className="hover:text-gray-300">
            Changer mot de passe
          </Link>
        </li>
        <li>
          <button onClick={handleLogout} className="hover:text-gray-300">
            Logout
          </button>
        </li>
      </ul>
    </div>
  );
}