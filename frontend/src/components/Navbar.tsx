import { SunIcon, MoonIcon } from "@heroicons/react/24/solid";
import { useTheme } from "../context/ThemeContext";
import { useNavigate } from "react-router-dom";

const Navbar = () => {
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("authToken"); // Limpia el token
    navigate("/"); // Redirige al inicio de sesión
  };

  const isAuthenticated = !!localStorage.getItem("authToken");

  return (
    <nav className="bg-gray-100 dark:bg-gray-800 p-4 shadow-md">
      <div className="w-11/12 mx-auto flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-100">
          Weather App
        </h1>
        <div className="flex justify-center items-center space-x-8">
          <button
            onClick={toggleTheme}
            className="p-2 rounded-full bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 transition"
          >
            {theme === "light" ? (
              <MoonIcon className="h-6 w-6 text-gray-800" />
            ) : (
              <SunIcon className="h-6 w-6 text-yellow-400" />
            )}
          </button>
          {isAuthenticated && (
            <button
              onClick={handleLogout}
              className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition"
            >
              Salir
            </button>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
