import React, { useContext, useEffect } from 'react';
import { AuthSessionContext } from '../Context/SessionProvider';
import { useNavigate } from "react-router-dom";

export default function RedirectedRoutes({ children }) {
  const { session, admin, loading, verifySession, verifyAdmin } = useContext(AuthSessionContext);
  // verifySession()
  // verifyAdmin()

  const navigate = useNavigate();

  useEffect(() => {
    if (loading) {
        return; 
      }
  
      if (session) {
        
        console.log("Du är inloggad");
        navigate('/profile', { replace: true });
      }

      
    }, [session, loading, navigate]);
  
    if (loading) {
      return <div>Loading...</div>;
    }
  
    return children;
}
