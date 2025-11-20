import { createContext, useEffect, useState } from "react";

export const AuthSessionContext = createContext();

export const SessionProvider = ({ children }) => {
  const [session, setSession] = useState(null);
  const [email, setEmail] = useState();
const [loadingSession, setLoadingSession] = useState(true);

    useEffect(() => {
    verifySession();
  }, []);

  const verifySession = async () => {
    try {
    setLoadingSession(true);

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
    }finally {
    setLoadingSession(false);
  }
  };

  return (
    <AuthSessionContext.Provider
      value={{
        session,
        setSession,
        verifySession,
        email,
        loadingSession
      }}
    >
      {children}
    </AuthSessionContext.Provider>
  );
};
