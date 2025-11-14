import React, { useContext, useEffect, useState } from "react";
import UserProfileActions from "../../components/ProfileComponent/UserProfileActions";

export default function Profile() {
  return (
    <div className="profile-container">
      <h1>MITT KONTO</h1>
      <UserProfileActions />
    </div>
  );
}
