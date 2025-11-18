import React, { useState } from "react";

export default function UserInfoValidation() {
  const [frontendErrors, setFrontendErrors] = useState({});
  const errorMessages = {
    firstname: "Du måste ange ditt förnamn.",
    lastname: "Du måste ange ditt efternamn.",
    birthday: "Du måste ange ditt födelsedatum.",
    phone: "Du måste ange ditt telefonnummer.",
    address: "Du måste ange adress.",
    postal: "Du måste ange ett postnummer."
  };
  const validateUserInput = (
    firstname,
    lastname,
    phone,
    birthday,
    address,
    postal
  ) => {
    const newErrors = {};
    if (!firstname) newErrors.firstname = "Du måste ange ditt förnamn.";
    if (!lastname) newErrors.lastname = "Du måste ange ditt efternamn.";
    if (!birthday) newErrors.birthday = "Du måste ange ditt födelsedatum.";
    if (!phone) newErrors.phone = "Du måste ange ditt telefonnummer.";
    if (!address) newErrors.address = "Du måste ange adress.";
    if (!postal) newErrors.postal =  "Du måste ange ett postnummer.";

    setFrontendErrors(newErrors)

    return Object.keys(newErrors).length === 0;

  };
  return { setFrontendErrors, frontendErrors, validateUserInput, errorMessages };
}

