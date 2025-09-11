// import { Navigate } from 'react-router-dom';

// const ProtectedRoute = ({ isAllowed, children }) => {
//   return isAllowed ? children : <Navigate to="/login" replace />;
// };

// export default ProtectedRoute;

// ./ProtectedRoute.jsx

import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';

export default function ProtectedRoute({ isAllowed, redirectTo = "/login" }) {
  return isAllowed ? <Outlet /> : <Navigate to={redirectTo} replace />;
}
