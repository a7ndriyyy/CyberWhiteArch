
import './App.css';
import HeaderComponent from './components/Header';
import Home from './components/HomePage/Home';
import { BrowserRouter as Router, Routes, Route} from 'react-router-dom';
import { useEffect,useState } from 'react';
import Loader from './components/Loader/Loader'


const RegistrationForm = () => <h1>Registration Form (Coming Soon)</h1>;


function App() {
  const [showLoader, setShowLoader] = useState(true); // Loader visibility state

  useEffect(() => {
    // Simulate loader duration
    const timer = setTimeout(() => {
      setShowLoader(false);
    }, 5000); // 5 seconds
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="App">
      {showLoader ? (
        <Loader /> // Show loader while `showLoader` is true
      ) : (
        <>
          <HeaderComponent />
          <Router>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/register" element={<RegistrationForm />} />
            </Routes>
          </Router>
        </>
      )}
    </div>
  );
}

export default App;
