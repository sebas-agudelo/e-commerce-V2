import { supabase_config } from "../../supabase_config/supabase_conlig.js";
import validator from "validator";
const supabase = supabase_config();

const DEFAULT_PAGESIZE = 4;

//Funktionen för att filtrera produkterna efter pris och kategori samt pagination.
export const filtredProducts = async (
  price = null,
  categoryID = null,
  page,
  pageSize,
  searchQuery = null
) => {
  const offset = (page - 1) * pageSize;
  let query = supabase
    .from("products")
    .select("id, title, price, img, sale_price, category_id, category_name, purchase_count, brand, battery_life, charging_time", { count: "exact" })
    .range(offset, offset + pageSize - 1);

  if (price !== null && price !== undefined && price !== "" && price !== 0) {
    const minPrice = parseInt(price);
    const maxPrice = minPrice + 100;
    query = query.gte("price", minPrice).lte("price", maxPrice);
  }
  if (categoryID !== null && categoryID !== undefined && categoryID !== "") {
    query = query.eq("category_id", categoryID);
  }
  if (searchQuery !== undefined && searchQuery !== null && searchQuery !== "") {
    query = query.ilike("title", `%${searchQuery}%`);
  }
  const { data, count, error } = await query;
  if (error || !data) {
    return {
      products: [],
      currentPage: page,
      totalPages: 0,
      count: 0,
      error: error,
    };
  }

  const totalPages = Math.ceil(count / pageSize);

  return {
    currenPage: page,
    totalPages: totalPages,
    count: count,
    products: data,
    error: error,
  };
};

export const categoryExists = async (categoryId) => {
  try {
    const { data, error } = await supabase
      .from("categories")
      .select("id")
      .eq("id", categoryId)
      .limit(1);

    if (error) {
      console.error(
        `Databasfel vid kontroll av kategoriID='${categoryId}'`,
        error
      );
      return false;
    }

    if (!data || data.length === 0) {
      console.warn(`Ingen kategori hittades med ID='${categoryId}'`);
      return false;
    }

    return true;
  } catch (error) {
    console.error("Okänt fel vid kategorikontroll:", error);
    return false;
  }
};

//HÄMTAR ALLA PRODUKTER
export const getProducts = async (req, res) => {
  const { price, categoryID, page } = req.query;

  try {
    let products;

    if(price !== undefined && price !== null){
      if(typeof price !== "string" || price.trim() === "" || !validator.isFloat(price.trim())){
              console.error(
        `Ogiltigt prisfilter mottaget: (get products) värde='${price}', typeof='${typeof price}'`
      );
      return res.status(400).json({
        error: "Vi kunde inte visa några produkter baserat på dina val.",
      });
      }
    };

    if (categoryID !== undefined && categoryID !== null) {
      if (typeof categoryID !== "string" || categoryID.trim() === "") {
        console.error(
          `Ogiltigt vald kategori mottaget: (get products) värde='${categoryID}', typeof='${typeof categoryID}'`
        );
        return res.status(400).json({
          error: "Vi kunde inte visa några produkter baserat på dina val.",
        });
      }
    const existingCategory = await categoryExists(categoryID);

      if (!existingCategory) {
        return res.status(400).json({
          error: "Vi kunde inte visa några produkter baserat på dina val."
        });
      }
      
    };

    const parsedPage = parseInt(page);

    if (!page || isNaN(parsedPage) || parsedPage < 1) {
      console.error(
        `Ogiltigt sida mottaget: (get products) värde='${page}', typeof='${typeof page}'`
      );
      return res.status(400).json({
        error: "Vi kunde inte visa några produkter baserat på dina val.",
      });
    }

    // const pageSize = 2;

    products = await filtredProducts(
      price,
      categoryID,
      parsedPage,
      DEFAULT_PAGESIZE
    );

    if (!Array.isArray(products.products) || products.products.length === 0) {
      return res.status(200).json({
        products: [],
        count: 0,
        currenPage: 0,
        totalPages: 0,
      });
    }

    // console.log("Alla produkter: ",products);
    

    return res.status(200).json(products);
  } catch (error) {
    console.error("Intert fel getProducts", error);
    return res.status(500).json({ error: "Något gick fel. Försök igen." });
  }
};

//HÄMTAR PRODUKTER BASERAD PÅ KATEGORY
export const productByCategory = async (req, res) => {
  const { selectedCatId } = req.params;
  const { price, categoryID, page } = req.query;

  const usedCategoryId = categoryID || selectedCatId;

  try {
    let products;
    
    if(price !== undefined && price !== null){
      if(typeof price !== "string" || price.trim() === "" || !validator.isFloat(price.trim())){
              console.error(
        `Ogiltigt prisfilter mottaget: (product by category) värde='${price}', typeof='${typeof price}'`
      );
      return res.status(400).json({
        error: "Vi kunde inte visa några produkter baserat på dina val.",
      });
      }
    };

    if (
      usedCategoryId !== undefined &&
      usedCategoryId !== null 
    ) {
      if (typeof usedCategoryId !== "string" || usedCategoryId.trim() === "") {
        console.error(
          `Ogiltigt vald kategori mottaget: (product by category) värde='${price}', typeof='${typeof price}'`
        );
        return res.status(400).json({ reason: "INVALID_CATEGORY" });
      }

      const existingCategory = await categoryExists(usedCategoryId);

      if (!existingCategory) {
        return res.status(400).json({ reason: "INVALID_CATEGORY" });
      }
    }
    const parsedPage = parseInt(page);

    if (!page || isNaN(parsedPage) || parsedPage < 1) {
      console.error(
        `Ogiltigt sida mottaget: (product by category) värde='${page}', typeof='${typeof page}'`
      );
      return res.status(400).json({
        error: "Vi kunde inte visa några produkter baserat på dina val.",
      });
    }

    products = await filtredProducts(
      price,
      usedCategoryId,
      parsedPage,
      DEFAULT_PAGESIZE
    );

    if (!Array.isArray(products.products) || products.products.length === 0) {
      return res.status(200).json({
        products: [],
        count: 0,
        currenPage: 0,
        totalPages: 0,
      });
    }

    return res.status(200).json(products);
  } catch (error) {
    console.error("Intert fel productByCategory", error);
    return res.status(500).json({ error: "Något gick fel. Försök igen." });
  }
};

//SÖK FUNKTIONALITET
export const searchProduct = async (req, res) => {
  const { price, categoryID, page, query } = req.query;

  try {
    let products;

    if(price !== undefined && price !== null){
      if(typeof price !== "string" || price.trim() === "" || !validator.isFloat(price.trim())){
              console.error(
        `Ogiltigt prisfilter mottaget: (search product) värde='${price}', typeof='${typeof price}'`
      );
      return res.status(400).json({
        error: "Vi kunde inte visa några produkter baserat på dina val.",
      });
      }
    };

     if (categoryID !== undefined && categoryID !== null) {
      if (typeof categoryID !== "string" || categoryID.trim() === "") {
        console.error(
          `Ogiltigt kategori från filtret förmodlingen tom: (search product) värde='${categoryID}', typeof='${typeof categoryID}'`
        );
        return res.status(400).json({
          error: "Vi kunde inte visa några produkter baserat på dina val.",
        });
      };

      const existingCategory = await categoryExists(categoryID);

      if (!existingCategory) {
        return res.status(400).json({
          error: "Vi kunde inte visa några produkter baserat på dina val."
        });
      }
      
    };

    const parsedPage = parseInt(page);

    if (!page || isNaN(parsedPage) || parsedPage < 1) {
      console.error(
        `Ogiltigt sida mottaget: (search product) värde='${page}', typeof='${typeof page}'`
      );
      return res.status(400).json({
        error: "Vi kunde inte visa några produkter baserat på dina val.",
      });
    };

    products = await filtredProducts(
      price,
      categoryID,
      parsedPage,
      DEFAULT_PAGESIZE,
      query
    );

    if (!Array.isArray(products.products) || products.products.length === 0) {
      return res.status(200).json({
        products: [],
        count: 0,
        currenPage: 0,
        totalPages: 0,
      });
    }

    return res.status(200).json(products);
  } catch (error) {
    console.error("Intert fel i searchProduct()", error);
    return res.status(500).json({ error: "Något gick fel. Försök igen." });
  }
};

//HÄMTAR EN PRODUKT BASERAD PÅ KATEGORI ID
export const getProductByID = async (req, res) => {
  const { id } = req.params;

  try {
    if (!id || 
      typeof id !== "string" || 
      id.trim() === "") {
      throw new Error("Ogiltig produkt ID.");
    };
    
    let { data: product, error: productError } = await supabase
      .from("products")
      .select("*")
      .eq("id", id)
      .single();

    if (productError) {
      throw new Error(`Supabase error: ${productError}`);
    }

    if (!product) {
      return res.status(404).json({ error: "Produkten kunde inte hittas." });
    }

    return res.status(200).json({ product });
  } catch (error) {
    console.error("Intert fel getProductByID", error);
    return res.status(500).json({ error: "Något gick fel. Försök igen." });
  }
};

//HÄMTAR ALLA KATEGORIER
export const categories = async (req, res) => {
  try {
    let { data, error } = await supabase.from("categories").select("*");
    if (error || !data) {
      return res.status(500).json({ error: "Fel vid hämtning av kategorier." });
    } else {
      return res.status(200).json({ data });
    }
  } catch (error) {
    return res
      .status(500)
      .json({ error: "Något gick fel. Försök igen." });
  }
};

export const getSuperDealsProducts = async (req, res) => {
  try{
let { data: superDealsCategories, superDealsCategoriesError } = await supabase
  .from("categories")
  .select("category")
  .in("category", ["On-ear", "In-ear"]);

  let results = [];



    for(const categories of superDealsCategories){      
      let {data: superDealsProducts, error: superDealsProductErrors } = await supabase.from("products").select("*").eq("category_name", categories.category)
      results.push(...superDealsProducts)
    }


    

      const filtredProducts = results.filter((p) => 
      p.id === "1cec906e-7235-44e1-8fb9-dbfa14ac14c6" || 
      p.id === "d627f757-fe2f-4253-853b-8c863a56099c" || 
      p.id === "75ddd05c-5bc1-40fd-9783-4a4dae05d130"||
      p.id === "f1cde2cc-549b-49ce-8111-e000cdf04e50" ||
      p.id === "59b39ed7-b193-487c-abdf-f458464a352e"
    ) 

  let results2 = [];

      for(const p of filtredProducts){
        let descate = 30;
        let pricies = p.price;
        pricies = pricies * (1 - descate / 100)
        p.sale_price = Math.round(pricies)        
        results2.push(p) 
      }

      console.log();
      

    return res.status(200).json({data: results2})

  }catch(error){
    console.log("Error Super Deals: ",error);
    
  }
}
