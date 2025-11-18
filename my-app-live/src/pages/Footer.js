import React from "react";
import { Link } from "react-router-dom";
import { FaInstagram } from "react-icons/fa6";
import { FaFacebook } from "react-icons/fa";
import { MdOutlineMail } from "react-icons/md";
import { FaPhoneAlt } from "react-icons/fa";
import { IoMdCheckmark } from "react-icons/io";
import { FaTiktok } from "react-icons/fa";
import { FaYoutube } from "react-icons/fa";
import { FaLinkedin } from "react-icons/fa6";

export default function Footer() {
  return (
    <footer>
      <section className="footer-about-contact">
      <article className="additional-info">
        <div className="footer-logo-img">
           <img src="SOUND (2) (2).png"/>
        </div>
        <div className="info-section">
          <p>
            <IoMdCheckmark /> Säker betalning
          </p>
          <p>
            <IoMdCheckmark />
            Alltid fri frakt
          </p>
          <p>
            <IoMdCheckmark />
            30-dagars öppet köp
          </p>
        </div>

      </article>

      <article className="about-section">
        <p>Om sound1</p>
        <Link to={`/about`}>Vilka är vi?</Link>
        <Link to={``}>Press</Link>
        <Link to={``}>Lediga tjänster</Link>
      </article>

      <article className="contact-info">
        <p className="contact">Kontakta oss</p>
        <p className="contact-link">
          <MdOutlineMail /> sound1@example.com
        </p>
        <p className="contact-link">
          <FaPhoneAlt /> 012-3456789
        </p>
      </article>
      </section>

      <article className="social-info">

        <div className="social-info-icons">
        <p className="social-icons">
          <FaInstagram />
        </p>
        <p className="social-icons">
          <FaFacebook />
        </p>
        <p className="social-icons"><FaLinkedin /></p>
        <p className="social-icons"><FaTiktok /></p>
        <p className="social-icons"><FaYoutube /></p>
        </div>

        <div className="org">
        <p className="org-name">Sound1</p>
        <p className="orgnr">OrgNr: 555555555555</p>
        </div>
      </article>
    </footer>
  );
}
