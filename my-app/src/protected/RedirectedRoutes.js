import React, { useContext, useEffect } from 'react';
import { AuthSessionContext } from '../Context/SessionProvider';
import { useNavigate } from "react-router-dom";

export default function RedirectedRoutes({ children }) {
  const { session, loading } = useContext(AuthSessionContext);


  const navigate = useNavigate();

  useEffect(() => {
    if (loading) {
        return; 
      }
  
      if (session) {
        navigate('/profile', { replace: true });
      }

      
    }, [session, loading, navigate]);
  
    if (loading) {
      return <div>Loading...</div>;
    }
    return children;
}
