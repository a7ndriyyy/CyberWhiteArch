import React from 'react';  
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
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
import RegistrationSuccess from '../srcApp/pages/RegistrationSuccess';
import CoverPage from '../srcApp/pages/InSystem/CoverPage';
import HackerLoader from '../srcApp/componentsApp/HackerLoader/HackerLoader';
import ProfilePage from '../srcApp/pages/InSystem/Profile/ProfilePage';
import CommunityPage from '../srcApp/pages/InSystem/Community/CommunityPage';
import DMPage from '../srcApp/pages/InSystem/DM/DMPage'; 
import EditProfilePage from '../srcApp/pages/InSystem/EditProfilePage/EditProfilePage';
import Explore from '../srcApp/pages/InSystem/Explore/Explore';

// e.g. createtoolmodal
import CreateToolPage from '../srcApp/pages/CreateToolPage';
import ToolsHubPage from '../srcApp/pages/InSystem/ToolsHub/ToolsHubPage'
import ToolDetailsPage from '../srcApp/pages/InSystem/ToolsHub/ToolDetailsPage';

// Контейнер для лоадера + редірект
function WelcomePage() {
  const [view, setView] = useState('registered'); // "registered" | "loading"
  const navigate = useNavigate();

  const startSetup = () => setView('loading');
  const finishLoading = () => navigate('/app/');
    return (
    <>
      {view === 'registered' && <RegistrationSuccess onStartSetup={startSetup} />}
      {view === 'loading' && <HackerLoader durationMs={7000} onFinish={finishLoading} />}
    </>
  );
}

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
        <Route path="documetation" element={<Tools />} />
        <Route path="community" element={<Community />} />
        <Route path="source-files" element={<SourceFiles />} />
        </Route>

        {/* Social network routes (protected) */}
     <Route path="/app/*" element={<PlatformLayouts />}>
  {/* protect everything inside */}
  <Route element={<ProtectedRoute isAllowed={isAuthenticated} />}>
    {/* Home of the social app = CoverPage */}
    <Route index element={<CoverPage />} />

    {/* Optional alias: keep /app/dashboard working */}
    <Route path="dashboard" element={<Navigate to="." replace />} />

    <Route path="welcome" element={<WelcomePage />} />
    <Route path='explore' element={<Explore />} />
    <Route path="profile" element={<ProfilePage />} />
    <Route path="profile/edit" element={<EditProfilePage />} />
    <Route path="community" element={<CommunityPage />} />
    <Route path="dm" element={<DMPage />} />
    <Route path="tools/new" element={<CreateToolPage />} />
    <Route path='tools' element={<ToolsHubPage/>} />
    <Route path='tools/:id' element={<ToolDetailsPage />} />
  </Route>
</Route>
     
      {/* Fallback */}
      <Route path="*" element={<Navigate to="/" replace />} />
        

      </Routes>
    </Router>
  );
}

export default App;

