import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import ProblemList from './pages/ProblemList';
import Login from './pages/Login';
import Workspace from './pages/Workspace'; // <--- IMPORT THIS
import AddProblem from './pages/AddProblem';

function App() {
  return (
    <BrowserRouter>
      <Navbar /> 
      <Routes>
        <Route path="/" element={<ProblemList />} />
        <Route path="/login" element={<Login />} /> 
        
        {/* Is line ko UNCOMMENT kar do */}
        <Route path="/solve/:id" element={<Workspace />} /> 
       <Route path="/create-problem" element={<AddProblem />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;