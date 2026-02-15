import { useState } from 'react';
import axios from 'axios';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import toast, { Toaster } from 'react-hot-toast';

const AddProblem = () => {
  const { token } = useSelector((state) => state.auth);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  // Form States
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [difficulty, setDifficulty] = useState('Easy');
  
  // Test Cases State (Array of Objects)
  const [testCases, setTestCases] = useState([{ input: '', output: '' }]);

  // Test Case ke inputs change karne ka logic
  const handleTestCaseChange = (index, field, value) => {
    const newTestCases = [...testCases];
    newTestCases[index][field] = value;
    setTestCases(newTestCases);
  };

  // Naya Test Case add karna
  const addTestCase = () => {
    setTestCases([...testCases, { input: '', output: '' }]);
  };

  // Test Case delete karna
  const removeTestCase = (index) => {
    const newTestCases = testCases.filter((_, i) => i !== index);
    setTestCases(newTestCases);
  };

  // Form Submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await axios.post(
        'http://localhost:5000/api/problems/create',
        { title, description, difficulty, testCases },
        { headers: { Authorization: `Bearer ${token}` } } // Teacher Token Zaroori hai
      );

      toast.success("Problem Added Successfully! 🎉");
      setTimeout(() => navigate('/'), 1500);

    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || "Failed to add problem");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white p-10 flex justify-center">
      <Toaster />
      
      <div className="w-full max-w-3xl bg-gray-800 p-8 rounded-xl shadow-2xl border border-gray-700">
        <h2 className="text-3xl font-bold mb-6 text-center text-blue-400">Add New Challenge 🧩</h2>

        <form onSubmit={handleSubmit} className="space-y-6">
          
          {/* Title */}
          <div>
            <label className="block text-gray-400 mb-2">Problem Title</label>
            <input 
              type="text" 
              placeholder="e.g. Sum of Array"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full p-3 bg-gray-700 rounded border border-gray-600 focus:outline-none focus:border-blue-500"
              required
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-gray-400 mb-2">Description</label>
            <textarea 
              rows="4"
              placeholder="Explain the problem clearly..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full p-3 bg-gray-700 rounded border border-gray-600 focus:outline-none focus:border-blue-500"
              required
            ></textarea>
          </div>

          {/* Difficulty */}
          <div>
            <label className="block text-gray-400 mb-2">Difficulty</label>
            <select 
              value={difficulty}
              onChange={(e) => setDifficulty(e.target.value)}
              className="w-full p-3 bg-gray-700 rounded border border-gray-600 focus:outline-none"
            >
              <option value="Easy">Easy 🟢</option>
              <option value="Medium">Medium 🟡</option>
              <option value="Hard">Hard 🔴</option>
            </select>
          </div>

          {/* Test Cases Section */}
          <div>
            <div className="flex justify-between items-center mb-2">
              <label className="text-gray-400">Test Cases (Input/Output)</label>
              <button 
                type="button" 
                onClick={addTestCase}
                className="text-sm bg-blue-600 px-3 py-1 rounded hover:bg-blue-500 transition"
              >
                + Add Case
              </button>
            </div>

            {testCases.map((tc, index) => (
              <div key={index} className="flex gap-4 mb-3 items-start">
                <textarea 
                  placeholder="Input (e.g. 2 3)"
                  value={tc.input}
                  onChange={(e) => handleTestCaseChange(index, 'input', e.target.value)}
                  className="w-1/2 p-2 bg-gray-900 rounded border border-gray-600 text-sm font-mono"
                  required
                />
                <textarea 
                  placeholder="Output (e.g. 5)"
                  value={tc.output}
                  onChange={(e) => handleTestCaseChange(index, 'output', e.target.value)}
                  className="w-1/2 p-2 bg-gray-900 rounded border border-gray-600 text-sm font-mono"
                  required
                />
                {testCases.length > 1 && (
                  <button 
                    type="button" 
                    onClick={() => removeTestCase(index)}
                    className="text-red-400 hover:text-red-500 font-bold p-2"
                  >
                    ✕
                  </button>
                )}
              </div>
            ))}
          </div>

          {/* Submit Button */}
          <button 
            type="submit" 
            disabled={loading}
            className={`w-full py-3 font-bold text-white bg-green-600 rounded-lg hover:bg-green-700 transition ${loading ? 'opacity-50' : ''}`}
          >
            {loading ? 'Adding Problem...' : '🚀 Publish Problem'}
          </button>

        </form>
      </div>
    </div>
  );
};

export default AddProblem;