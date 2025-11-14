import React, { useContext, useEffect } from 'react';
import { AuthSessionContext } from '../Context/SessionProvider';
import { useNavigate } from "react-router-dom";

export default function ProtectedRoutes({ children }) {
  const { session, admin, loading, verifySession, verifyAdmin } = useContext(AuthSessionContext);
  const navigate = useNavigate();

  console.log(session);
  
  useEffect(() => {

    
    if (loading) {
      return;
    }
    
    if (!session) {
      console.log("Du är utloggad");
      
      navigate('/signin', { replace: true });
    }
  
    
  }, [session, admin, loading, navigate]);
  
  if (loading) {
    return <div>Loading...</div>; 
  }

  return children;
}

