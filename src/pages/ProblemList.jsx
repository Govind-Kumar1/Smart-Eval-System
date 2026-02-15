import { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

const ProblemList = () => {
  const [problems, setProblems] = useState([]);
  const [loading, setLoading] = useState(true); 
 
  useEffect(() => {
    const fetchProblems = async () => {
      try {
        const res = await axios.get('http://localhost:5000/api/problems');
        setProblems(res.data);
      } catch (err) {
        console.error("Error fetching problems:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchProblems();
  }, []);

  if (loading) return <div className="text-white text-center mt-20 text-xl">Loading problems... ⏳</div>;

  return (
    <div className="min-h-screen bg-gray-900 text-white p-10">
      
      {/* Header Section */}
      <div className="max-w-4xl mx-auto mb-8 text-center">
        <h1 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500">
          🚀 Challenge Yourself
        </h1>
        <p className="text-gray-400 mt-2">Pick a problem and start coding!</p>
      </div>

      {/* Problems Grid */}
      <div className="max-w-4xl mx-auto grid gap-6">
        
        {problems.length === 0 ? (
          <p className="text-center text-gray-500">No problems found. Ask your teacher to add some! 👨‍🏫</p>
        ) : (
          problems.map((prob) => (
            <div 
              key={prob._id} 
              className="bg-gray-800 border border-gray-700 p-6 rounded-xl hover:shadow-xl hover:shadow-blue-500/10 transition duration-300 flex justify-between items-center"
            >
              <div>
                <h3 className="text-xl font-bold text-gray-100">{prob.title}</h3>
                
                {/* Difficulty Badge Logic */}
                <span className={`inline-block mt-2 px-3 py-1 text-xs font-semibold rounded-full 
                  ${prob.difficulty === 'Easy' ? 'bg-green-900 text-green-300 border border-green-700' : 
                    prob.difficulty === 'Medium' ? 'bg-yellow-900 text-yellow-300 border border-yellow-700' : 
                    'bg-red-900 text-red-300 border border-red-700'}`}>
                  {prob.difficulty}
                </span>
              </div>

              <Link to={`/solve/${prob._id}`}>
                <button className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition transform hover:scale-105 shadow-lg shadow-blue-500/30">
                  Solve Challenge ⚡
                </button>
              </Link>
            </div>
          ))
        )}
        
      </div>
    </div>
  );
};

export default ProblemList;