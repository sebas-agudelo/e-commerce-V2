import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import 'rc-slider/assets/index.css';
import Footer from "./Footer";
import { FaArrowRightLong } from "react-icons/fa6";

export default function Home() {
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [saleProducts, setSaleProducts] = useState([]);


  console.log("Kategorier: ", categories);
  
  useEffect(() => {
    const saleProducts = async () => {
      const response = await fetch(`https://e-commerce-v2-hts6.vercel.app/superdeals`, {
        method: "GET",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
      });

      const data = await response.json();
      console.log(data.data);

      if (response.ok) {
        setSaleProducts(data.data);
      }
    }

    const getCategories = async () => {
      const response = await fetch(`https://e-commerce-v2-hts6.vercel.app/api/categori/get`, {
        method: "GET",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
      });

      const data = await response.json();
      console.log(data.data);

      if (response.ok) {
        setCategories(data.data);
      }
    };

    saleProducts()
    getCategories();
  }, []);


  return (
    <main className="home-main">
      <article className="hero-video">
        <img src="Black and White Monochrome Simple Tech Company Presentation (1).png" />
      </article>

      {/* <h2 className="fav-products">Favoriter</h2> */}

      <section style={{ padding: "0" }} className="Products-main">
        {/* <h2>TRE VÄGAR TILL DIN NÄSTA FAVORIT</h2> */}
        <article className="home-categories-container">
          {categories.map((category) => (
            <div className="home-categories" key={category.id}>
              <p>
                <Link to={`/products/${category.id}/cat/${category.category}`}>
                <div className="category-img">
                <img 
                  src={category.category_img}
                />  
                </div>
               
                  {category.category}
             
             
                </Link>


              </p>

            </div>
          ))}
        </article>
      </section>

      <section className="home-super-deals">
        <h2>SUPER DEALS</h2>
        {/* <p className="mmm">ALWAYS GREAT DEALS</p> */}
        <div className="home-super-deals-content">
          {saleProducts.map((p) => (
              <Link to={`/product/${p.id}`}>
            <div className="super-deal-product">
              <div className="super-deal-img">
                <img src={p.img}
                  alt={p.title}
                />
              </div>
              <p id="title">{p.title}</p>
              <p id="price">{p.price} kr.</p>
              <p id="sale-price">{p.sale_price}.00 kr.</p>
            </div>
          </Link>
          ))}
        </div>
      </section>

        <section className="home-new-product">
        <article className="home-new-product-content">
          <div className="home-new-product-video">
            <video
              src="0_Earbuds_Earphones_3840x2160.mp4"
              type="video/mp4"
              autoPlay
              muted
              loop
              playsInline
            ></video>
          </div>
          <div className="home-new-product-info">
            <h2>PROVA NYA EBO 3</h2>
            <h2 className="home-new-product-subtitle"> PREMIUMM SOUND QUALITY</h2>
            <p>
              Upptäck förstklassig ljudkvalitet och komfort i nästa generation med EBO 3.
            </p>
          <div className="home-new-product-actions">
            <button>
              <Link to={`/product/915af2ab-45cc-49cf-bf76-8e4daa0dd4d4`}>
                EBO 3
              </Link>
            </button>
          </div>
          </div>
        </article>
      </section>

      <section className="newlatter-container">
          <div className="newsletter-text">
            <h2>ANMÄL DIG FÖR SOUND:S NYHETSBREV</h2>
            <p>Bli först med att ta del av kampanjer, nyheter och tips från SOUND direkt till din mejl</p>
            <p className="newlatter-policy">Läs vår <Link to={``}>integritetspolicy</Link></p>
          </div>

          <div className="newsletter-form">
            <form>
              <input 
                type="email"
                placeholder="E-mail addresss"
              /> 
              <button>
                <FaArrowRightLong />
              </button>
            </form>
          </div>
              
      </section>
    
      <Footer />
    </main>
  );
}
