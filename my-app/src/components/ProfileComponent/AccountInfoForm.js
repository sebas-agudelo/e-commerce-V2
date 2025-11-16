import React, { useEffect, useState } from "react";
import UserInfoValidation from "../../hooks/UserInfoValidation";
import { MdErrorOutline } from "react-icons/md";
import ContentSpinner from "../spinners/ContentSpinner";

export default function AccountInfoForm() {
  const [changeData, setChangeData] = useState({
    firstname: "",
    lastname: "",
    phone: "",
    birthday: "",
    address: "",
    postal: "",
  });
  const [user, setUser] = useState([]);
  const [userEmail, setUserEmail] = useState("");
  const [emailDisebled, setEmailDisebled] = useState(true);
  const [isDisebled, setIsDisebled] = useState(true);
  const [loading, setLoading] = useState(true);
  const [userInputError, setUserInputError] = useState({});

  const { userInputValidation, userValidationMessage } = UserInfoValidation();

  useEffect(() => {
    getUserData();
  }, [isDisebled]);

  const toggleUserInputAccess = () => {
    if (isDisebled) {
      setIsDisebled(false);
    }

    if (isDisebled === false) {
      setIsDisebled(true);
      setUserInputError({})
    }
  };

  const getUserData = async () => {
    try {
      setLoading(true);

      // https://examensarbeten.vercel.app/auth/profile
      const response = await fetch(`https://e-commerce-v2-hts6.vercel.app/auth/profile`, {
        method: "GET",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
      });

      const data = await response.json();

      if (response.ok) {
        const userArray = data.users_info;
        setUser(userArray);

        if (userArray.length > 0) {
          const user = userArray[0];
          setChangeData({
            firstname: user.firstname || "",
            lastname: user.lastname || "",
            phone: user.phone || "",
            birthday: user.birthday || "",
            address: user.address || "",
            postal: user.postal || "",
          });
        } else {
          setIsDisebled(false);
        }

        setUserEmail(data.userEmail);
      }

      setLoading(false);
    } catch (error) {
      alert("Ett oväntat fel har inträffat. Försök igen.");
    }
  };

  const updateUserData = async () => {
    try {
      const response = await fetch(
        `https://e-commerce-v2-hts6.vercel.app/auth/user/update`,
        {
          method: "PUT",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(changeData),
        }
      );

      const data = await response.json();

      if (response.ok) {
        setIsDisebled(true);
      } else {
        setUserInputError(data.errors);
      }
    } catch (error) {
      alert("Ett oväntat fel har inträffat. Försök igen.")
    }
  };

  const addUserInfo = async () => {
    const inputValidation = userInputValidation(
      changeData?.firstname,
      changeData?.lastname,
      changeData?.phone,
      changeData?.birthday,
      changeData?.address,
      changeData?.postal
    );

    if (!inputValidation) {
      return;
    }
    try {
      const response = await fetch(`https://e-commerce-v2-hts6.vercel.app/auth/user/add-info`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(changeData),
      });

      const data = await response.json();

      if (response.ok) {
        setIsDisebled(true);
      } else {
        setUserInputError(data.errors);
      }
    } catch (error) {
      alert("Ett oväntat fel har inträffat. Försök igen.")
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    setChangeData((prevDetails) => ({
      ...prevDetails,
      [name]: value,
    }));

    if (userInputError) {
      setUserInputError((u) => ({
        ...u,
        [name]: null,
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (user.length > 0) {
      await updateUserData();
    } else {
      await addUserInfo();
    }
  };

  return (
    <div className="user-info-container">
      {loading ? (
        <ContentSpinner />
      ) : (
        <>
          {user.length === 0 ? (
            <div className="user-info-empty">
              <p>
                <MdErrorOutline />
                Inga uppgifter har registrerats om dig ännu.
              </p>
            </div>
          ) : (
            ""
          )}

          <form onSubmit={handleSubmit}>
           
            <input
              type="email"
              name="email"
              onChange={handleChange}
              value={userEmail && userEmail}
              disabled={emailDisebled}
            />
           
            <input
              type="text"
              placeholder="Förnamn"
              name="firstname"
              onChange={handleChange}
              value={changeData && changeData?.firstname}
              disabled={isDisebled}
            />
            {userInputError.firstname && (
              <p className="my-data-user-error-message">
                {userInputError.firstname}
              </p>
            )}

            <input
              type="text"
              placeholder="Efternamn"
              name="lastname"
              onChange={handleChange}
              value={changeData && changeData?.lastname}
              disabled={isDisebled}
            />
            {userInputError.lastname && (
              <p className="my-data-user-error-message">
                {userInputError.lastname}
              </p>
            )}

            <input
              type="number"
              placeholder="Förddelsedatum"
              name="birthday"
              onChange={handleChange}
              value={changeData && changeData?.birthday}
              disabled={isDisebled}
            />
            {userInputError.birthday && (
              <p className="my-data-user-error-message">
                {userInputError.birthday}
              </p>
            )}

            <input
              type="number"
              placeholder="Telefonnummer"
              name="phone"
              onChange={handleChange}
              value={changeData && changeData?.phone}
              disabled={isDisebled}
            />
            {userInputError.phone && (
              <p className="my-data-user-error-message">
                {userInputError.phone}
              </p>
            )}

            <input
              type="text"
              placeholder="Adress"
              name="address"
              onChange={handleChange}
              value={changeData && changeData?.address}
              disabled={isDisebled}
            />
            {userInputError.address && (
              <p className="my-data-user-error-message">
                {userInputError.address}
              </p>
            )}

            <input
              type="number"
              placeholder="Postnummer"
              name="postal"
              onChange={handleChange}
              value={changeData && changeData?.postal}
              disabled={isDisebled}
            />
            {userInputError.postal && (
              <p className="my-data-user-error-message">
                {userInputError.postal}
              </p>
            )}

            {isDisebled ? "" : <button>Spara</button>}
          </form>

          {user.length === 0 ? (
            ""
          ) : (
            <div className="account-actions">
              <button onClick={toggleUserInputAccess}>
                {isDisebled ? "Ändra" : "Avbryt"}
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
