import './App.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Header from './components/header';
import Footer from './components/footer';
import Home from './pages/home';
import Train from './pages/train';
import Predict from './pages/predict';

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Header />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/train" element={<Train />} />
          <Route path="/predict" element={<Predict />} />
        </Routes>
        <Footer />
      </BrowserRouter>
    </div>
  );
}

export default App;
