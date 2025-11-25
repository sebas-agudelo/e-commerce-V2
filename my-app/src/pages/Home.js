import React, { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import 'rc-slider/assets/index.css';
import Footer from "./Footer";
import { FaArrowRightLong } from "react-icons/fa6";
import { SaleProductsCarousel } from "../components/Carousels/SaleProductsCarousel";
import { ProductContext } from "../Context/ProductContext";

export default function Home() {
  const { categories, getCategories } = useContext(ProductContext)

  useEffect(() => {
    getCategories();
  }, []);

  return (
    <main className="home-main">
      <article className="hero-video">
        <img src="/HEROO.png" />
      </article>

      <section className="Products-main">
        <h2>Kategorier</h2>
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
                  <span>{category.category}</span>
                </Link>


              </p>

            </div>
          ))}
        </article>
      </section>

      <SaleProductsCarousel />

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
            <div className="price-box">
              <img src="arrow1.png" />
              <p className="price-box-label">FÖR ENDAST</p>
              <p className="price-box-amount">987.00 kr.</p>
            </div>
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
          <h2>
            ANMÄL DIG FÖR
            <br />
            SOUND:S NYHETSBREV
          </h2>

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
