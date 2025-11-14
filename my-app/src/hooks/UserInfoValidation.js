import React, { useState } from "react";
import validator from "validator";

export default function UserInfoValidation() {
  const [userValidationMessage, setUserValitionMessage] = useState("");
  const userInputValidation = (
    firstname,
    lastname,
    phone,
    birthday,
    address,
    postal
  ) => {
    
    const nameRegex = /^[a-zA-ZÀ-ÖØ-öø-ÿÅÄÖåäößñÑ' -]+$/;
    const addressRegex = /^[a-zA-Z0-9À-ÖØ-öø-ÿÅÄÖåäößñÑ\s.,\-\/]+$/;

    if (firstname === "") {
      setUserValitionMessage("Förnamn är obligatoriskt");
      return false;
    }
    if (lastname === "") {
      setUserValitionMessage("Efternamn är obligatoriskt");
      return false;
    }
    if (!nameRegex.test(firstname) || !nameRegex.test(lastname)) {
      setUserValitionMessage(
        "För och efternamn bör endast innehålla bokstäver."
      );
      return false;
    }


    if (phone === "") {
      setUserValitionMessage("Telefonnummer är obligatoriskt");
      return false;
    }


    if (birthday === "") {
      setUserValitionMessage("Föddelsedatum är obligatoriskt");
      return false;
    }
   
    if (address === "") {
      setUserValitionMessage("Adress är obligatoriskt");
      return false;
    }
    if (!addressRegex.test(address)) {
      setUserValitionMessage("Adress bör endast innehålla bokstaver och siffror.");
      return false;
    }

    if (postal === "") {
      setUserValitionMessage("postnummer är obligatoriskt");
      return false;
    }
    if (!validator.isPostalCode(postal.toString(), "SE")) {
      setUserValitionMessage("Ogiltigt postnummer!");
      return false;
    }

    setUserValitionMessage("");
    return true;
  };
  return { userInputValidation, userValidationMessage };
}
