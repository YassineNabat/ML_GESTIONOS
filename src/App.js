import './App.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Home from './pages/home';
import Train from './pages/train';
import Predict from './pages/predict';

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/train" element={<Train />} />
          <Route path="/predict" element={<Predict />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
