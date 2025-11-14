import React from "react";
import Footer from "./Footer";

export default function PageNotFound() {
  return (
    <>
      <div className="not-found-container">
        <h1>SIDAN HITTADES INTE</h1>
        <p>Sidan du letar efter är för närvarande inte tillgänglig.</p>

        <a href="/products">Alla våra produkter</a>
      </div>
      <Footer />
    </>
  );
}
