import React from "react";
import { useAuthContext } from "../../context/AuthContext";
import { Navigate } from "react-router-dom";

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { user } = useAuthContext();
console.log(user,'>>>>>>',!user);

  // if (!user || JSON.stringify(user) === '{}') {
  //   console.log('sssssssss');
    
  //   return <Navigate to="/login" replace />;
  // }

  return <>{children}</>;
};

export default ProtectedRoute;
