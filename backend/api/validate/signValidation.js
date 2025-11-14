import validator from "validator";

export const signUserValidation = (
  email,
  password,
  tokenHash,
  firstname,
  lastname,
  phone,
  birthday,
  address,
  postal
) => {};

export const signUpValidation = (email, password, repeitpassword) => {
  if (!email || !password || !repeitpassword) {
    return { error: "Både email och lösenord måste fyllas i." };
  }
};

export const userDataValidations = (
  email,
  firstname,
  lastname,
  birthday,
  phone,
  address,
  postal
) => {

  const errors = {};

  if (!birthday) { 
      errors.birthday =  "Du måste ange ditt födelsedatum.";
  };

  if (!email || !validator.isEmail(email)) {
    errors.email = "Du måste ange din e-postadress.";
  }; 

  if (firstname === "" || firstname === null || firstname === undefined) {
    errors.firstname = "Du måste ange ditt förnamn.";
  };

  if (lastname === "" || lastname === null || lastname === undefined) {
    errors.lastname = "Du måste ange ditt efternamn.";
  };

  if (phone === "" || phone === null || phone === undefined ||  !/^\d+$/.test(phone)) {
   errors.phone = "Du måste ange ditt telefonnummer.";
  }
  if (
    address === "" ||
    address === null ||
    address === undefined ||
    typeof address !== "string"
  ) {
    errors.address = "Du måste ange adress.";
  }
  if (!postal || !validator.isPostalCode(postal, "SE")) {
    errors.postal = "Du måste ange ett postnummer.";
  }

  if(Object.keys(errors).length > 0){
    return {errors}
  }
  return null;
};

export const uuserDataValidations = (
  firstname,
  lastname,
  birthday,
  phone,
  address,
  postal
) => {

  const errors = {};

  if (!birthday) { 
      errors.birthday =  "Du måste ange ditt födelsedatum.";
  };

  if (firstname === "" || firstname === null || firstname === undefined) {
    errors.firstname = "Du måste ange ditt förnamn.";
  };

  if (lastname === "" || lastname === null || lastname === undefined) {
    errors.lastname = "Du måste ange ditt efternamn.";
  };

  if (phone === "" || phone === null || phone === undefined ||  !/^\d+$/.test(phone)) {
   errors.phone = "Du måste ange ditt telefonnummer.";
  }
  if (
    address === "" ||
    address === null ||
    address === undefined ||
    typeof address !== "string"
  ) {
    errors.address = "Du måste ange adress.";
  }
  if (!postal || !validator.isPostalCode(postal, "SE")) {
    errors.postal = "Du måste ange ett postnummer.";
  }

  if(Object.keys(errors).length > 0){
    return {errors}
  }
  return null;
};