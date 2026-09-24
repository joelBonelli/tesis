import "./Hero.css";

function Hero() {
  return (
    <section className="hero">
      <div className="hero__contenido">
        <div className="hero__texto">
          <span className="hero__eyebrow">Gente de confianza, cerca tuyo</span>

          <h1>
            Oficios y ayuda
            <br />
            para tu día a día
          </h1>

          <p>
            Encontrá personas de confianza para tu hogar,
            tu negocio o lo que necesites.
          </p>

          <div className="hero__buscador">
            <div className="hero__campo">
              <span>⌕</span>

              <div>
                <strong>¿Qué servicio necesitás?</strong>
                <small>Ej.: plomería, pintura, limpieza...</small>
              </div>
            </div>

            <div className="hero__campo">
              <span>⌖</span>

              <div>
                <strong>Tu ubicación</strong>
                <small>Ej.: CABA, Palermo</small>
              </div>
            </div>

            <button className="hero__buscar">
              Buscar
              <span>→</span>
            </button>
          </div>
        </div>

        <div className="hero__imagen">
          <div className="hero__mensaje">
            Personas reales,
            <br />
            barrios más fuertes
          </div>

          <div className="hero__foto-placeholder">
            <span>Foto principal</span>
          </div>

          <div className="hero__comunidad">
            <span>⌂</span>

            <p>
              Trabajos que mueven
              <br />
              comunidades
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Hero;