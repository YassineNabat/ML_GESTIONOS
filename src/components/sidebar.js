import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";

export default function Sidebar() {
  const navigate = useNavigate();
  const [isCollapsed, setIsCollapsed] = useState(true);

  const handleLogout = () => {
    localStorage.removeItem("authToken");
    navigate("/login");
  };

  return (
    <div className={`bg-gradient-to-b from-blue-600 to-blue-800 text-white h-screen fixed top-0 left-0 shadow-xl flex flex-col justify-between transition-all duration-300 ${isCollapsed ? 'w-20' : 'w-64'}`}>
      <div>
        <div className="flex justify-between items-center p-6">
          <h2 className={`text-2xl font-bold text-blue-100 transition-opacity duration-300 ${isCollapsed ? 'hidden' : 'block'}`}>Menu</h2>
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="text-blue-100 hover:text-white p-2 rounded-lg hover:bg-blue-700 transition-all duration-300"
          >
            <span className="material-icons">
              {isCollapsed ? 'chevron_right' : 'chevron_left'}
            </span>
          </button>
        </div>
        <ul className="space-y-6 px-4">
          <li>
            <Link
              to="/dashboard"
              className={`flex items-center justify-${isCollapsed ? 'center' : 'start'} text-lg font-semibold text-blue-100 hover:text-white hover:bg-blue-700 py-2 px-4 rounded-lg transition-all duration-300`}
            >
              <span className="material-icons">dashboard</span>
              {!isCollapsed && <span className="ml-2">Dashboard</span>}
            </Link>
          </li>
          <li>
            <Link
              to="/change-password"
              className={`flex items-center justify-${isCollapsed ? 'center' : 'start'} text-lg font-semibold text-blue-100 hover:text-white hover:bg-blue-700 py-2 px-4 rounded-lg transition-all duration-300`}
            >
              <span className="material-icons">lock</span>
              {!isCollapsed && <span className="ml-2">Changer mot de passe</span>}
            </Link>
          </li>
        </ul>
      </div>
      <button
        onClick={handleLogout}
        className={`flex items-center justify-${isCollapsed ? 'center' : 'start'} w-full text-lg font-bold text-blue-100 hover:text-white hover:bg-blue-700 py-2 px-4 rounded-lg transition-all duration-300 mb-6 mx-4`}
      >
        <span className="material-icons">logout</span>
        {!isCollapsed && <span className="ml-2">Logout</span>}
      </button>
    </div>
  );
}