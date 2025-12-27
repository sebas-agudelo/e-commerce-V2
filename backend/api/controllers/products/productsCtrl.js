import { supabase_config } from "../../supabase_config/supabase_conlig.js";
import { Redis } from '@upstash/redis'
import validator from "validator";
const supabase = supabase_config();

const DEFAULT_PAGESIZE = 4;

const pagination = async (query, page, size = DEFAULT_PAGESIZE) => {
  const from = (page - 1) * size;
  const to = from + size - 1

  const { data, count, error } = await query
    .range(from, to)
  const totalPages = Math.ceil(count / size);

  return { data, count, page, totalPages }
}

const pricefilter = (query, minPrice, maxPrice, mino) => {
  if (minPrice) {
    query = query.gte('price', minPrice)
  }

  if (maxPrice) {
    query = query.lte('price', maxPrice)
  }

  if (mino === "ASC" || mino === "DESC") {
    query = query.order('price', {
      ascending: mino === "ASC"
    })
  }

  return query
}

const filterByCategory = (query, categoryID) => {
  if (categoryID !== null && categoryID !== undefined && categoryID !== "") {
    query = query.eq("category_id", categoryID);
  }

  return query
}

const theMinAndMax = async (categoryID) => {
  const filters = {};
  if (categoryID) {
    filters.category_id = categoryID;
  }

  let { data: minimum, error: minimumError } = await supabase
    .from('products')
    .select('price')
    .match(filters)
    .order('price', { ascending: true })
    .limit(1)


  let { data: maximum, error: maximumError } = await supabase
    .from('products')
    .select('price')
    .match(filters)
    .order('price', { ascending: false })
    .limit(1)

  return { min: minimum[0].price, max: maximum[0].price }
}

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
  const { price, categoryID, page, minPrice, maxPrice, mino } = req.query;

  try {
    let query = supabase
      .from('products')
      .select('*', { count: 'exact' })

    if (categoryID) {
      query = filterByCategory(query, categoryID)
    }

    if (minPrice || maxPrice || mino) {
      query = pricefilter(query, minPrice, maxPrice, mino)
    }

    const { data: products, count, totalPages } = await pagination(query, Number(page))

    const minAndMax = await theMinAndMax(categoryID);

    return res.status(200).json({ products, totalPages: totalPages, count: count, currenPage: Number(page), minAndMax });
  } catch (error) {
    console.error("Intert fel getProducts", error);
    return res.status(500).json({ error: "Något gick fel. Försök igen." });
  }
};

//HÄMTAR PRODUKTER BASERAD PÅ KATEGORY
export const getProductsByCategory = async (req, res) => {
  const { selectedCatId } = req.params;
  const { minPrice, maxPrice, mino, categoryID, page } = req.query;

  const usedCategoryId = categoryID || selectedCatId;

  try {
    let query = supabase
      .from('products')
      .select('*', { count: "exact" })
      .eq('category_id', usedCategoryId)

    if (minPrice || maxPrice || mino) {
      query = pricefilter(query, minPrice, maxPrice, mino)
    }

    const { data: products, count, totalPages } = await pagination(query, Number(page))

    const minAndMax = await theMinAndMax(selectedCatId);

    return res.status(200).json({ products, totalPages: totalPages, count: count, currenPage: Number(page), minAndMax });
  } catch (error) {
    return res.status(500).json({ error: "Något gick fel. Försök igen." });
  }
};

//SÖK FUNKTIONALITET
export const searchProduct = async (req, res) => {
  const { minPrice, maxPrice, mino, categoryID, page, query } = req.query;

  let searched = query || ""; 
    
  try {
     let query = supabase
      .from('products')
      .select('*', { count: "exact" })
      .ilike('title', `%${searched}%`)

      if(categoryID){
        const existingCategory = await categoryExists(categoryID);
    
        if (!existingCategory) {
          return res.status(400).json({
            error: "Vi kunde inte visa några produkter baserat på dina val."
          });
        }
      }

     if (categoryID) {
      query = filterByCategory(query, categoryID)
    }

      if (minPrice || maxPrice || mino) {
      query = pricefilter(query, minPrice, maxPrice, mino)
    }

      const { data: products, count, totalPages } = await pagination(query, Number(page))

    const minAndMax = await theMinAndMax(categoryID);

    return res.status(200).json({ products, totalPages: totalPages, count: count, currenPage: Number(page), minAndMax });

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


    const productId = product.id;

    const { data: productImages, error: imagesError } = await supabase
      .from("product_images")
      .select("img")
      .eq("product_id", productId)


    let productWithImages = { ...product, images: productImages };

    return res.status(200).json({ product: productWithImages });
  } catch (error) {
    console.error("Intert fel getProductByID", error);
    return res.status(500).json({ error: "Något gick fel. Försök igen." });
  }
};

//HÄMTAR ALLA KATEGORIER
export const categories = async (req, res) => {
  try {
    const redis = new Redis({
      url: process.env.UPSTASH_REDIS_REST_URL || "",
      token: process.env.UPSTASH_REDIS_REST_TOKEN || ""
    })
    const cached = await redis.get("categories");

    if (cached) {
      return res.status(200).json({ data: cached });
    }

    let { data, error } = await supabase.from("categories").select("category, category_img, id");
    if (error || !data) {
      return res.status(500).json({ error: "Fel vid hämtning av kategorier." });
    } else {
      await redis.set("categories", JSON.stringify(data))
      return res.status(200).json({ data });
    }
  } catch (error) {
    return res
      .status(500)
      .json({ error: "Något gick fel. Försök igen." });
  }
};

export const getSuperDealsProducts = async (req, res) => {
  try {
    let { data: superDealsCategories, error: superDealsCategoriesError } = await supabase
      .from("categories")
      .select("category")
      .in("category", ["On-ear", "In-ear"]);

    let results = [];

    console.log(superDealsCategories);
    let results2 = [];

    if (superDealsCategories.length > 0) {
      for (const categories of superDealsCategories) {
        let { data: superDealsProducts, error: superDealsProductErrors } = await supabase.from("products").select("*").eq("category_name", categories.category)
        results.push(...superDealsProducts)
      }

      const filtredProducts = results.filter((p) =>
        p.id === "1cec906e-7235-44e1-8fb9-dbfa14ac14c6" ||
        p.id === "d627f757-fe2f-4253-853b-8c863a56099c" ||
        p.id === "75ddd05c-5bc1-40fd-9783-4a4dae05d130" ||
        p.id === "f1cde2cc-549b-49ce-8111-e000cdf04e50" ||
        p.id === "59b39ed7-b193-487c-abdf-f458464a352e"
      )


      for (const p of filtredProducts) {
        let descate = 30;
        let pricies = p.price;
        pricies = pricies * (1 - descate / 100)
        p.sale_price = Math.round(pricies)
        results2.push(p)
      }

    }


    return res.status(200).json({ data: results2 })

  } catch (error) {
    console.log("Error Super Deals: ", error);

  }
}

export const addDiscountedProduct = async (req, res) => {
  const sale_product = req.body || {};

  if (!Array.isArray(sale_product)) {
    return res.status(400).json({ message: "Produkterna eller produkten som försöktes skapas i kampanjer är ej i rätt format." })
  }

  let invalidSaleProducts = [];
  let saleProducts = [];
  let created = new Date()
  let discountedPriceis = [];

  try {
    for (const product of sale_product) {
      if (!product.product_id || !product.product_discounted || !product.sale_type) {
        invalidSaleProducts.push(product)
      } else {
        discountedPriceis.push({
          id: product.product_id,
          discount: product.product_discounted
        });

        saleProducts.push({ ...product, created })
      }
    }



    const { data, error } = await supabase
      .from('campaigns')
      .insert(saleProducts)
      .select()

    const { data: products, error: err } = await supabase
      .from('products')
      .upsert(discountedPriceis, { onConflict: 'id' })
      .select()


    return res.status(201).json({ saleProducts: data, invalidSaleProducts: invalidSaleProducts.length > 0 ? invalidSaleProducts : invalidSaleProducts.length })

  } catch (error) {
    console.log(error);
  }
};

export const createProduct = async (req, res) => {
  const products = req.body || {};

  let invalidProducts = [];
  let validProducts = [];
  let product_images = [];

  if (!Array.isArray(products?.products) || products.products.length === 0) {
    return res
      .status(400)
      .json({ message: "Produkterna kunde inte bearbetas eftersom datan inte var i rätt format eller tom." });
  }

  try {
    for (const product of products.products) {
      if (!product.category_id || !product.title || !product.price || !product.purchase_count) {
        invalidProducts.push(product);
      } else {
        const { images, ...productFeilds } = product;
        const { images: productImages } = product;
        validProducts.push(productFeilds);
        product_images.push(productImages)
      }
    }

    const { data: product_data, error: product_error } = await supabase
      .from('products_duplicate')
      .insert(validProducts)
      .select();

    console.log("product_error ", product_error);
    console.log("product_data ", product_data);

    let finalImageRows = [];

    if (product_data.length > 0) {
      for (let i = 0; i < product_data.length; i++) {
        const productId = product_data[i].id;
        const images = product_images[i];

        for (const img_url of images) {
          finalImageRows.push({
            product_id: productId,
            img: img_url
          }
          );

        }

        console.log(`new product index: -> ${i}`, product_data[i].id);
        console.log(`new images index: -> ${i}`, product_images[i]);
      }
    }

    console.log("finalImageRows ", finalImageRows);


    const { data: images_data, error: images_error } = await supabase
      .from('product_images')
      .insert(finalImageRows)
      .select();

    return res.status(201).json({
      message: validProducts.length > 0 ? "Produkter skapades framgångsrikt." : "",
      error: invalidProducts.length > 0 ? "Det finns 1 eller flera produkter som inte kunde skapas på grund av ogiltig data." : "",
      validProducts,
      invalidProducts
    });
  } catch (error) {
    console.log("Error creating product: ", error);
    return res.status(500).json({ error: "Något gick fel vid skapandet av produkten. Försök igen." });
  }
};