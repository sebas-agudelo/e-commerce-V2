import { createContext, useEffect, useState } from "react";

export const AuthSessionContext = createContext();

export const SessionProvider = ({ children }) => {
  const [session, setSession] = useState(null);
  const [email, setEmail] = useState();
  const [admin, setAdmin] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSessionData = async () => {
      await verifySession();
      setLoading(false);
    };
    fetchSessionData();
    const interval = setInterval(() => {
      verifySession();
    }, 60 * 60 * 1000);
    
    return () => clearInterval(interval);
  }, [session, admin]);
  
  console.log("Session desde SessionProvider: ",session); 
  const verifySession = async () => {
    try {
      const response = await fetch(
        "https://e-commerce-v2-hts6.vercel.app/auth/checkUserSession",
        {
          method: "GET",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
        }
      );

      const data = await response.json();
      if (response.ok && data.isLoggedIn) {
        setSession(true);
        setEmail(data.email);
      } else {
        setSession(false);
      }
    } catch (error) {
      setSession(false);
      alert("Ett oväntat fel har inträffat. Försök igen.")
    }
  };

  
  return (
    <AuthSessionContext.Provider
      value={{
        session,
        setSession,
        loading,
        verifySession,
        setLoading,
        email,
      }}
    >
      {children}
    </AuthSessionContext.Provider>
  );
};
