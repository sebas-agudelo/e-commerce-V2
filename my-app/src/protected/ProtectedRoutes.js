import React, { useContext, useEffect } from 'react';
import { AuthSessionContext } from '../Context/SessionProvider';
import { useNavigate } from "react-router-dom";

export default function ProtectedRoutes({ children }) {
  const { session, admin, loading } = useContext(AuthSessionContext);
  const navigate = useNavigate();
  useEffect(() => {
    if (loading) {
      return;
    }
    
    if (!session) {
      navigate('/signin', { replace: true });
    }
  }, [session, admin, loading, navigate]);
  
  if (loading) {
    return <div>Loading...</div>; 
  }

  return children;
}

