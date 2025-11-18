import React, { useEffect, useState } from "react";
import UserProfileActions from "../../components/AuthComponent/UserProfileActions";
import AccountInfoButton from "../../components/AuthComponent/AccountInfoButton";

export default function Account() {
    const [width, setWidth] = useState(window.innerWidth >= 768)

    useEffect(() => {
        setWidth(window.innerWidth >= 768);
    },[width])
    
   
  return (
    <main className="profile-container">
      <h1>MITT KONTO</h1>
      {width && <UserProfileActions />}
      <AccountInfoButton />
    </main>
  );
}
