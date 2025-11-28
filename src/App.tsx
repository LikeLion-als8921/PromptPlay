import { Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import ImprovedPrompt from './components/ImprovedPrompt';

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/result" element={<ImprovedPrompt />} />
    </Routes>
  );
}

export default App;
