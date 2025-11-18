// src/components/About.js
import React from 'react';


export default function About() {
  return (
    <div className="about-container">
      <h1 className="about-title">Om oss</h1>
      <p className="about-description">
        Välkommen till vår butik! Vi är specialiserade på att erbjuda högkvalitativa musikartiklar, med fokus på hörlurar. 
        Vårt mål är att ge dig en fantastisk ljudupplevelse, oavsett om du är en musikälskare, podcast-lyssnare eller en audiofil.
      </p>
      <p className="about-description">
        Vi erbjuder ett brett sortiment av hörlurar från de bästa varumärkena, noggrant utvalda för att passa alla behov och smaker. 
        Vår butik är din destination för att hitta den perfekta hörluren som passar just din livsstil.
      </p>
      <p className="about-description">
        Vi är passionerade om ljud och vi strävar efter att ge våra kunder de bästa produkterna och serviceupplevelsen. 
        Om du har några frågor eller behöver hjälp med att välja rätt hörlurar, tveka inte att kontakta oss!
      </p>
      <div className="contact-info">
        <p><strong>Kontakt:</strong> sound1example.com</p>
        <p><strong>Telefon:</strong> 012-3456789</p>
      </div>
    </div>
  );
}
