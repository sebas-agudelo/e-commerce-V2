import { supabase_config } from "../../supabase_config/supabase_conlig.js";
import { uuserDataValidations } from "../../validate/signValidation.js";
import validator from "validator";
const supabase = supabase_config();

export const sessionAuthCheck = async (req, res) => {
  const token = req?.cookies?.cookie_key;

  if (!token) {
    return res.status(200).json({ isLoggedIn: false });
  }

  const { data, error } = await supabase.auth.getUser(token);

  const email = data?.user?.email;

  if (!email) {
    return res.status(400).json({ error: "Ingen användare hittad" });
  }

  console.log(email);
  console.log("Token från sessionAuthCheck", token);

  if (error || !data?.user) {
    return res.status(200).json({ isLoggedIn: false });
  }

  return res.status(200).json({ isLoggedIn: true, email: data.user.email });
};

export const authenticateUser = async (req, res, next) => {
  try {
    const access_token = req.cookies.cookie_key;

    console.log(access_token);
    
    if (!access_token) {
      return res
        .status(401)
        .json({ error: "Ingen giltig inloggning hittades" });
    }
    const {
      data: { user },
      error,
    } = await supabase.auth.getUser(access_token);

    if (error || !user) {
      return res
        .status(401)
        .json({ error: "Ingen giltig inloggning hittades" });
    }

    req.user = user;

    next();
  } catch (error) {
    return res
      .status(500)
      .json({ error: "Ett oväntat fel inträffade. Försök senare igen." });
  }
};

export const signIn = async (req, res) => {
  const { email, password } = req.body;
  try {
    let { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    

    if (error) {
      return res.status(400).json({
        error: "Felaktig e-postadress eller lösenord. Vänligen försök igen.",
      });
    }

    const { data: sessionData, error: sessionError } =
      await supabase.auth.getSession();

    if (sessionError || !sessionData.session) {
      return res.status(400).json({ error: error.message });
    }
    const { access_token } = sessionData.session;

    return res
      .cookie("cookie_key", access_token, {
        httpOnly: true,
        secure: false,
        sameSite: "lax",
        maxAge: 24 * 60 * 60 * 1000,
      })
      .status(200)
      .json({ successfully: "Du är inloggad"});
  } catch (error) {
    console.log("Ett oväntat fel inträffade. Försök senare igen.");
  }
};

export const signOut = async (req, res) => {
  try {
    console.log("Logga ut mig");

    res.clearCookie("cookie_key", {
      httpOnly: true,
      secure: false,   
      sameSite: "lax",
    });

    console.log("har loggat ut");
    return res.status(200).json({ successfully: "Du är utloggad" });
  } catch (error) {
    console.error("Fel vid utloggning:", error);
    return res.status(500).json({ error: "Ett oväntat fel inträffade. Försök senare igen." });
  }
};

export const profile = async (req, res) => {
  try {
    const userId = req?.user?.id;
    const userEmail = req?.user?.email;

    let { data: users_info, error } = await supabase
      .from("users_info")
      .select("*")
      .eq("user_id", userId);

    if (!users_info) {
      console.log("Ingen användare hittades för user_id:", userId);
      return res.status(200).json({ success: [] });
    } else if (users_info) {
      return res.status(200).json({ success: "Ja Ja", users_info, userEmail });
    }
  } catch (error) {
    console.log("");
  }
};

export const updateUserData = async (req, res) => {
  const { firstname, lastname, phone, birthday, address, postal } = req.body;
    const userID = req?.user?.id;
  
    if (!userID) {
      return res
        .status(401)
        .json({ error: "Ogiltig användare. Försök att logga in." });
    }

   const validationError = uuserDataValidations(
    firstname,
    lastname,
    birthday,
    phone,
    address,
    postal
  );

  console.log("Firstname: ",firstname);
  
  if (validationError) {
    return res.status(400).json(validationError);
  }

  try {
    const { data, error } = await supabase
      .from("users_info")
      .update([
        {
          firstname,
          lastname,
          phone,
          birthday,
          address,
          postal,
        },
      ])
      .eq("user_id", userID);





      if(error){
        throw new Error(`internt fel: Kunde inte uppdatera användarensuppgidter. (insertUserData: error): ${JSON.stringify(
            error
          )}`)
      }
    
    return res.status(201).json({ success: "Dina uppgifter har uppdaterats." });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ error: "Ett oväntat fel har inträffat. Försök senare igen." });
  }
};

export const addUserInfo = async (req, res) => {
  const { firstname, lastname, phone, birthday, address, postal, email } =
    req.body;
  const postalCode = postal.toString();
  const userID = req?.user?.id;
  const userEmail = req?.user?.email;

  const nameRegex = /^[a-zA-ZÀ-ÖØ-öø-ÿÅÄÖåäößñÑ' -]+$/;
  const addressRegex = /^[a-zA-Z0-9À-ÖØ-öø-ÿÅÄÖåäößñÑ\s.,\-\/]+$/;

  if (!userID) {
    return res
      .status(401)
      .json({ error: "Ogiltig användare. Försök att logga in." });
  }

  if (!firstname || !lastname || !phone || !birthday || !address || !postal) {
    return res
      .status(400)
      .json({
        error: "Det saknas information i ett eller flera obligatoriska fält.",
      });
  }

  if (!firstname) {
    return res.status(400).json({ error: "Förnam är obligatoriskt!" });
  }
  if (!lastname) {
    return res.status(400).json({ error: "Efternamn är obligatoriskt!" });
  }
  if (!nameRegex.test(firstname) || !nameRegex.test(lastname)) {
    return res
      .status(400)
      .json({ error: "För och efternamn bör endast innehålla bokstäver." });
  }

  if (!phone) {
    return res.status(400).json({ error: "Telefonnummer ör obligatoriskt" });
  }

  if (!validator.isDate(birthday, new Date())) {
    return res.status(400).json({ error: "Ogiltigt datumformat!" });
  }

  if (!addressRegex.test(address)) {
    return res.status(400).json({ error: "Adress är obligatoriskt!" });
  }

  if (!validator.isPostalCode(postalCode, "SE")) {
    return res.status(400).json({ error: "Ogiltigt postnummer!" });
  }

  try {
    const { data, error } = await supabase
      .from("users_info")
      .insert([
        {
          user_id: userID,
          firstname,
          lastname,
          phone,
          birthday,
          address,
          postal,
          email: userEmail,
        },
      ])
      .select()
      .eq("user_id", userID);

    if (!data || error) {
      return res
        .status(500)
        .json({
          error:
            "Ett oväntat fel inträffade. Kontrollera att alla obligatoriska fält är ifyllda.",
        });
    }

    return res.status(201).json({ success: "Dina uppgifter har sparats." });
  } catch (error) {
    return res
      .status(500)
      .json({ error: "Ett oväntat fel har inträffat. Försök senare igen." });
  }
};
