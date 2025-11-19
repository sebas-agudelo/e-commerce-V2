import React, { useEffect, useState } from "react";
import UserInfoValidation from "../../hooks/UserInfoValidation"
import { MdErrorOutline } from "react-icons/md";
import ContentSpinner from "../spinners/ContentSpinner";

export default function AccountInfoForm() {
  const [changeData, setChangeData] = useState({
    email: "",
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
  const [backendErrors, setBackendErrors] = useState({});

  const { setFrontendErrors, frontendErrors, validateUserInput, errorMessages } = UserInfoValidation();

  useEffect(() => {
    getUserData();
  }, [isDisebled]);

  const toggleInputEditable = () => {
    if (isDisebled) {
      setIsDisebled(false);
    }

    if (isDisebled === false) {
      setIsDisebled(true);
      setBackendErrors({})
      setFrontendErrors({})
    }
  };

  const getUserData = async () => {
    try {
      setLoading(true);
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
            email: user.email || "",
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
        setBackendErrors(data.errors);
      }
    } catch (error) {
      alert("Ett oväntat fel har inträffat. Försök igen.")
    }
  };

  const addUserInfo = async () => {
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
        setBackendErrors(data.errors);
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

    setFrontendErrors((prev) => {
      const newErrors = { ...prev };

      if (name) {
        if (!value.trim()) {
          newErrors[name] = errorMessages[name]
        } else {
          delete newErrors[name];
        }
      }
      return newErrors;
    });

    if (backendErrors[name]) {
      setBackendErrors((u) => ({
        ...u,
        [name]: null,
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const isValid = validateUserInput(changeData.firstname, changeData.lastname, changeData.birthday, changeData.phone, changeData.address, changeData.postal);
    if (!isValid) return;

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
            {frontendErrors.firstname && (
              <p className="my-data-user-error-message">
                {frontendErrors.firstname}
              </p>
            )}
            {backendErrors.firstname && (
              <p className="my-data-user-error-message">
                {backendErrors.firstname}
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

            {frontendErrors.lastname && (
              <p className="my-data-user-error-message">
                {frontendErrors.lastname}
              </p>
            )}
            {backendErrors.lastname && (
              <p className="my-data-user-error-message">
                {backendErrors.lastname}
              </p>
            )}

            <input
              type="text"
              placeholder="Förddelsedatum"
              name="birthday"
              onChange={handleChange}
              value={changeData && changeData?.birthday}
              disabled={isDisebled}
            />
            {frontendErrors.birthday && (
              <p className="my-data-user-error-message">
                {frontendErrors.birthday}
              </p>
            )}

            {backendErrors.birthday && (
              <p className="my-data-user-error-message">
                {backendErrors.birthday}
              </p>
            )}

            <input
              type="text"
              placeholder="Telefonnummer"
              name="phone"
              onChange={handleChange}
              value={changeData && changeData?.phone}
              disabled={isDisebled}
            />
            {frontendErrors.phone && (
              <p className="my-data-user-error-message">
                {frontendErrors.phone}
              </p>
            )}
            {backendErrors.phone && (
              <p className="my-data-user-error-message">
                {backendErrors.phone}
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
            {frontendErrors.address && (
              <p className="my-data-user-error-message">
                {frontendErrors.address}
              </p>
            )}
            {backendErrors.address && (
              <p className="my-data-user-error-message">
                {backendErrors.address}
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
            {frontendErrors.postal && (
              <p className="my-data-user-error-message">
                {frontendErrors.postal}
              </p>
            )}
            {backendErrors.postal && (
              <p className="my-data-user-error-message">
                {backendErrors.postal}
              </p>
            )}

            {isDisebled ? "" : <button>Spara</button>}
          </form>

          {user.length === 0 ? (
            ""
          ) : (
            <div className="account-actions">
              <button onClick={toggleInputEditable}>
                {isDisebled ? "Ändra" : "Avbryt"}
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}

