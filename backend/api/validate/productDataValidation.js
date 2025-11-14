import validator from "validator";

export const productDataValidation = (
  title,
  price,
  category_id,
  category_name,
  description,
  brand,
  connection_type,
  charging_time,
  battery_life,
  garanti
) => {
    if (!title || !price || !category_id || !garanti || !description) {
        return { error: "produktens titel, pris, kategori, ganranti och beskrivning får inte vara tomma" };
      }

      if(!validator.isLength(title, {max: 100})){
          return { error: "Titel får inte överstiga 5 tecken" };
        }
      
        if(!validator.isLength(description, {max: 1500})){
          return { error: "Beskrivning får inte överstiga 5 tecken" };
        }
      
      
        if(!validator.isNumeric(price)){
          return { error: "Pris måste vara ett nummer" };
        }
      
        if(!validator.isNumeric(charging_time)){
          return { error: "Laddningstiden måste vara ett nummer" };
        }
      
        if(!validator.isNumeric(battery_life)){
          return { error: "Batteritid måste vara ett nummer" };
        }
      
      
        if(!validator.isNumeric(garanti)){
          return { error: "Garanti måste vara ett nummer" };
        }

        if(!validator.isLength(brand, {max: 50})){
            return { error: "Märke får inte överstiga 5 tecken" };
        }

        return null;
};

export const productFileValidation = (file) => {
  
  const fileIsImage = ['image/png', 'image/jpg', 'image/jpeg', 'image/webp'];

  if(!fileIsImage.includes(file.mimetype)){
    return { error: "Ogiltig filtyp. Endast PNG, JPG, JPEG och WEBP bilder är tillåtna."};
  }
}
