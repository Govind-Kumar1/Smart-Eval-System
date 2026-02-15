import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { useSelector } from 'react-redux';
import toast, { Toaster } from 'react-hot-toast';

const Workspace = () => {
  const { id } = useParams();
  const { token, user } = useSelector((state) => state.auth);
  
  const [problem, setProblem] = useState(null);
  const [code, setCode] = useState('// Write your code here...');
  const [language, setLanguage] = useState('cpp');
  const [output, setOutput] = useState('');
  const [loading, setLoading] = useState(false);

  // 1. Problem Details Load karo
  useEffect(() => {
    const fetchProblem = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/api/problems/${id}`);
        setProblem(res.data);
      } catch (err) {
        console.error(err);
        toast.error("Error fetching problem details");
      }
    };
    fetchProblem();
  }, [id]);

  // 2. Run Code Logic
  const handleRun = async () => {
    if (!user) return toast.error("Please login to submit code!");
    
    setLoading(true);
    setOutput("Running test cases... ⏳");

    try {
      const res = await axios.post(
        'http://localhost:5000/api/submissions',
        {
          studentId: user._id,
          problemId: id,
          code,
          language
        },
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );

      const result = res.data.result;
      if (result.status === "Passed") {
        toast.success("All Test Cases Passed! 🎉");
        setOutput(`✅ Success! \nPassed Cases: ${result.passedTestCases}`);
      } else {
        toast.error("Test Cases Failed ❌");
        setOutput(`❌ Failed. \nError Log:\n${result.errorLog}`);
      }

    } catch (err) {
      console.error(err);
      const errorMsg = err.response?.data?.error || err.message;
      setOutput(`⚠️ Server Error: ${errorMsg}`);
    } finally {
      setLoading(false);
    }
  };

  if (!problem) return <div className="text-white text-center mt-20 text-xl">Loading Problem... ⏳</div>;

  return (
    <div className="flex h-[calc(100vh-64px)] bg-gray-900 text-white">
      <Toaster />

      {/* LEFT SIDE: Problem Description */}
      <div className="w-1/2 p-6 overflow-y-auto border-r border-gray-700 scrollbar-thin scrollbar-thumb-gray-600">
        <h1 className="text-3xl font-bold text-blue-400 mb-4">{problem.title}</h1>
        
        <div className="mb-4">
          <span className={`px-3 py-1 text-sm font-bold rounded-full 
            ${problem.difficulty === 'Easy' ? 'bg-green-900 text-green-300' : 
              problem.difficulty === 'Medium' ? 'bg-yellow-900 text-yellow-300' : 
              'bg-red-900 text-red-300'}`}>
            {problem.difficulty}
          </span>
        </div>

        <p className="text-gray-300 text-lg leading-relaxed mb-6 whitespace-pre-wrap">
          {problem.description}
        </p>

        <h3 className="text-xl font-semibold mb-2 text-purple-400">Example Test Cases:</h3>
        <div className="bg-gray-800 p-4 rounded-lg space-y-4 border border-gray-700">
          {/* SAFE MAP CHECK: Agar testCases hai tabhi map chalega */}
          {problem.testCases && problem.testCases.length > 0 ? (
            problem.testCases.map((tc, idx) => (
              <div key={idx} className="border-b border-gray-700 pb-2 last:border-0 last:pb-0">
                <p className="text-sm text-gray-400 mb-1">Input:</p>
                <code className="block bg-black p-2 rounded text-green-400 font-mono text-sm mb-2">{tc.input}</code>
                <p className="text-sm text-gray-400 mb-1">Expected Output:</p>
                <code className="block bg-black p-2 rounded text-blue-400 font-mono text-sm">{tc.output}</code>
              </div>
            ))
          ) : (
            <p className="text-gray-500 italic">No public test cases available for this problem.</p>
          )}
        </div>
      </div>

      {/* RIGHT SIDE: Code Editor */}
      <div className="w-1/2 flex flex-col bg-gray-800">
        
        {/* Toolbar */}
        <div className="flex justify-between items-center p-3 bg-gray-700 border-b border-gray-600">
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-300">Language:</span>
            <select 
              value={language} 
              onChange={(e) => setLanguage(e.target.value)}
              className="bg-gray-900 text-white px-3 py-1 rounded border border-gray-600 focus:outline-none focus:border-blue-500 text-sm"
            >
              <option value="cpp">C++ (g++)</option>
              <option value="python">Python 3</option>
              <option value="java">Java</option>
            </select>
          </div>

          <button 
            onClick={handleRun}
            disabled={loading}
            className={`px-6 py-1.5 font-bold rounded shadow-lg transition flex items-center gap-2
              ${loading ? 'bg-gray-600 cursor-not-allowed text-gray-400' : 'bg-green-600 hover:bg-green-500 text-white'}`}
          >
            {loading ? 'Processing...' : '▶ Run Code'}
          </button>
        </div>

        {/* Code Input Area */}
        <textarea
          value={code}
          onChange={(e) => setCode(e.target.value)}
          className="flex-1 w-full bg-[#1e1e1e] text-gray-200 font-mono p-4 text-sm focus:outline-none resize-none leading-relaxed"
          placeholder="// Type your code here..."
          spellCheck="false"
        ></textarea>

        {/* Output Console */}
        <div className="h-48 bg-black p-4 border-t border-gray-600 overflow-y-auto font-mono text-sm">
          <h4 className="text-gray-500 text-xs uppercase font-bold mb-2 tracking-wider">Output Console</h4>
          <pre className={`whitespace-pre-wrap ${output.includes('Failed') || output.includes('Error') ? 'text-red-400' : 'text-green-400'}`}>
            {output || "Run your code to see the output here..."}
          </pre>
        </div>

      </div>
    </div>
  );
};

export default Workspace;