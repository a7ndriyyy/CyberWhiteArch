import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

import PublicLayout from '../layouts/PublicLayouts';
import PlatformLayouts from '../layouts/PlatformLayouts';
import ProtectedRoute from './ProtectedRoute';


// Public pages
import Home from './pages/Home/Home';
import Login from './components/Login/Login';
import Register from './components/Register/Register';
import Tools from './pages/Tools/Tools';
import Community from './pages/Community/Community';
import SourceFiles from './pages/SourceFiles/SourceFiles';

// Social network pages
import WelcomePage from '../srcApp/pages/WelcomePage';

function App() {
  // Imagine a function that checks if user is authenticated
 const isAuthenticated = localStorage.getItem('isLoggedIn') === 'true';

  return (
    <Router>
      <Routes>

        {/* Public routes */}
        <Route path="/*" element={<PublicLayout />}>
          <Route index element={<Home />} />
          <Route path="login" element={<Login />} />
          <Route path="register" element={<Register />} />
        <Route path="tools" element={<Tools />} />
        <Route path="community" element={<Community />} />
        <Route path="source-files" element={<SourceFiles />} />
        </Route>

        {/* Social network routes (protected) */}
      <Route path="/app/*" element={<PlatformLayouts />}>
       <Route
    path="welcome"
    element={
      <ProtectedRoute isAllowed={isAuthenticated}>
        <WelcomePage />
      </ProtectedRoute>
    }
  />
          {/* more social network routes */}
        </Route> 

      </Routes>
    </Router>
  );
}

export default App;

