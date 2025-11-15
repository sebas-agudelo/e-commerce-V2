import React, { useContext, useEffect, useState } from "react";
import SignInForm from "../../components/AuthComponent/SignInForm";
import { useNavigate } from "react-router-dom";
import { AuthSessionContext } from "../../Context/SessionProvider";

export default function SignIn() {
  const {setAdmin, setSession, session} = useContext(AuthSessionContext);
  const [email, setEmail] = useState();
  const [password, setPassword] = useState();
  const [errorMessage, setErrorMessage] = useState("");
  const nav = useNavigate();

  const fetchSignIn = async () => {
    //`https://examensarbeten.vercel.app/auth/signin`
    try{
        if(!email || !password){
          setErrorMessage("Email samt lösenord får inte vara tomma")
          return
        }
      
        // https://e-commerce-v2-hts6.vercel.app 
      const response = await fetch(`http://localhost:3030/auth/signin`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
  
      const data = await response.json();
  
      console.log("Sign in data: ",data);
      
      if (response.ok) {
        setSession(true)
        nav("/profile");

      } else {
        setErrorMessage(data.error);
      }

    }catch(error){
      console.error("Ett oväntat fel inträffade. Försök senare igen.");
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    fetchSignIn();
  };

  return (
    <main className="user-data-container">
      <section className="user-data-wrapper">
        <SignInForm
          handleSubmit={handleSubmit}
          setEmail={setEmail}
          setPassword={setPassword}
          errorMessage={errorMessage}
        />
      </section>
    </main>
  );
}
