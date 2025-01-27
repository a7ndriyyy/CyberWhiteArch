
import './App.css';
import HeaderComponent from './components/Header';
import Home from './components/HomePage/Home';
import { BrowserRouter as Router, Routes, Route} from 'react-router-dom';


const RegistrationForm = () => <h1>Registration Form (Coming Soon)</h1>;


function App() {
  return (

    <div className="App">
    <HeaderComponent></HeaderComponent>
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/register" element={<RegistrationForm />} />
      </Routes>
    </Router>
     
    </div>
  );
}

export default App;
