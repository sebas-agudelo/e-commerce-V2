import React from "react";
import { Link } from "react-router-dom";

export default function AccountInfoAccess() {
  return (
    <div className="user-info-container">
      <div className="account-actions">
        <button>
          <Link to={`/profile/account/mydata`}>Se/ändra uppgifter</Link>
        </button>
      </div>
    </div>
  );
}
