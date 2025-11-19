import React, { useContext } from "react";
import { Link } from "react-router-dom";
import SignOut from "./SignOut";
import { MdManageAccounts } from "react-icons/md";
import { AiOutlineProduct } from "react-icons/ai";
import { AuthSessionContext } from "../../Context/SessionProvider";

export default function UserProfileActions() {
  const { email } = useContext(AuthSessionContext);
  return (
    <div className="profile-actions">
      <div className="welcome">
        <p>Välkommen, {email}</p>
      </div>

      <div>
        <div className="action-btns">
          <p>
            <Link to={`/profile/account`}>
              <MdManageAccounts /> Hantera konto
            </Link>
          </p>
          <p>
            <Link to={`/myorders`}>
              <AiOutlineProduct /> Mina beställningar
            </Link>
          </p>
        </div>

        <SignOut />
      </div>
    </div>
  );
}
