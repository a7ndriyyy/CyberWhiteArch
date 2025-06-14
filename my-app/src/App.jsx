import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home/Home';
import Header from './components/Header/Header';
import Tools from './pages/Tools/Tools';
import SourceFiles from './pages/SourceFiles/SourceFiles';
import Community from './pages/Community/Community';
import Footer from './components/Footer/Footer'; 
import Login from './components/Login/Login';
import Register from './components/Register/Register';

function App() {
  return (
    <Router>
      <Header />
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/" element={<Home />} />
        <Route path="/tools" element={<Tools/>} />
        <Route path="/source-files" element={<SourceFiles/>} />
        <Route path="/community" element={<Community/>} />
      </Routes>
      <Footer/> 
    </Router>
  );
}

export default App;
