import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import AccountInfoForm from "../../components/ProfileComponent/AccountInfoForm";
import UserProfileActions from "../../components/ProfileComponent/UserProfileActions";

export default function MyData() {
  const [width, setWidth] = useState(window.innerWidth >= 768);

  useEffect(() => {
    setWidth(window.innerWidth >= 768);
  }, [width]);

  return (
    <div className="profile-container">
      <h1>MITT KONTO</h1>
      {width && <UserProfileActions />}
      <AccountInfoForm />
    </div>
  );
}
