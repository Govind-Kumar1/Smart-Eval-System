import { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import toast, { Toaster } from 'react-hot-toast';

const Register = () => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    role: 'student' // Default role student rakha hai
  });

  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Input change handle karne ke liye
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await axios.post('http://localhost:5000/api/auth/register', formData);

      toast.success("Registration Successful! 🎉 Redirecting to Login...");
      
      // 1.5 second baad Login page par bhej do
      setTimeout(() => {
        navigate('/login');
      }, 1500);

    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || "Registration Failed!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-900 text-white">
      <Toaster position="top-center" />
      
      <div className="w-full max-w-md p-8 space-y-6 bg-gray-800 rounded-xl shadow-2xl border border-gray-700">
        
        <div className="text-center">
          <h2 className="text-3xl font-extrabold text-white">Create Account 🚀</h2>
          <p className="mt-2 text-sm text-gray-400">Join the community of coders</p>
        </div>

        <form className="space-y-4" onSubmit={handleRegister}>
          
          {/* Username */}
          <div>
            <label className="block text-sm font-medium text-gray-300">Full Name</label>
            <input 
              type="text" 
              name="username"
              placeholder="e.g. Govind Kumar" 
              value={formData.username}
              onChange={handleChange}
              className="w-full px-4 py-3 mt-1 text-white bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-gray-300">Email Address</label>
            <input 
              type="email" 
              name="email"
              placeholder="e.g. govind@hbtu.ac.in" 
              value={formData.email}
              onChange={handleChange}
              className="w-full px-4 py-3 mt-1 text-white bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          {/* Password */}
          <div>
            <label className="block text-sm font-medium text-gray-300">Password</label>
            <input 
              type="password" 
              name="password"
              placeholder="••••••••" 
              value={formData.password}
              onChange={handleChange}
              className="w-full px-4 py-3 mt-1 text-white bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          {/* Role Select */}
          <div>
            <label className="block text-sm font-medium text-gray-300">I am a:</label>
            <select 
              name="role"
              value={formData.role}
              onChange={handleChange}
              className="w-full px-4 py-3 mt-1 text-white bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="student">Student 👨‍🎓</option>
              <option value="teacher">Teacher 👨‍🏫</option>
            </select>
          </div>

          {/* Submit Button */}
          <button 
            type="submit" 
            disabled={loading}
            className={`w-full px-4 py-3 font-bold text-white bg-green-600 rounded-lg hover:bg-green-700 transition duration-300 ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            {loading ? 'Creating Account...' : 'Register'}
          </button>
        </form>

        <p className="text-sm text-center text-gray-400">
          Already have an account?{' '}
          <Link to="/login" className="font-medium text-blue-400 hover:text-blue-300 hover:underline">
            Login here
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Register;