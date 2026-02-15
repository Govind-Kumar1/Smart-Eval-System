import { Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../redux/authSlice';

const Navbar = () => {
  const { user, isAuthenticated } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  return (
    <nav className="flex items-center justify-between px-6 py-4 bg-gray-800 border-b border-gray-700 text-white shadow-md">
      {/* Logo */}
      <div className="text-2xl font-bold tracking-wide">
        <Link to="/" className="hover:text-blue-400 transition">🚀 SmartEval</Link>
      </div>

      {/* Links */}
      <div className="flex items-center gap-6">
        {isAuthenticated ? (
          <>
            <span className="text-gray-300 hidden md:block">
              Welcome, <span className="font-semibold text-white">{user?.username}</span>
              <span className="ml-2 text-xs px-2 py-1 bg-gray-700 rounded-full text-blue-300 border border-blue-900">
                {user?.role}
              </span>
            </span>

            {user?.role === 'teacher' && (
              <Link 
                to="/create-problem" 
                className="text-sm font-medium text-green-400 hover:text-green-300 transition"
              >
                + Add Problem
              </Link>
            )}

            <button 
              onClick={handleLogout} 
              className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded hover:bg-red-700 transition focus:outline-none focus:ring-2 focus:ring-red-500"
            >
              Logout
            </button>
          </>
        ) : (
          <Link to="/login">
            <button className="px-5 py-2 text-sm font-medium text-white bg-blue-600 rounded hover:bg-blue-700 transition shadow-lg shadow-blue-500/30">
              Login
            </button>
          </Link>
        )}
      </div>
    </nav>
  );
};

export default Navbar;