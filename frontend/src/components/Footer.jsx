import { Link } from "react-router-dom";
import { Heart, MapPin } from "lucide-react";
import "./Footer.css";

function Footer() {
  return (
    <footer className="footer">
      <div className="footer__contenido">

        <div className="footer__marca">
          <Link to="/" className="footer__logo">
            <span className="footer__logo-icono">
                <svg
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                >
                    <path
                    d="M3 11.5 12 4l9 7.5"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    />

                    <path
                    d="M5.5 10.5V20h13v-9.5"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinejoin="round"
                    />
                </svg>
            </span>
            <div>
              <strong>Al Rescate</strong>
              <span>Más personas. Mejores comunidades.</span>
            </div>
          </Link>
        </div>

        <nav className="footer__nav">
          <a href="#sobre-nosotros">Sobre Al Rescate</a>
          <a href="#como-funciona">Cómo funciona</a>
          <a href="#trabajadores">Para trabajadores</a>
          <a href="#ayuda">Ayuda</a>
          <a href="#contacto">Contacto</a>
        </nav>

        <div className="footer__argentina">
          <MapPin size={20} />

          <div>
            <strong>Hecho en Argentina</strong>
            <span>para nuestra comunidad</span>
          </div>

          <Heart size={18} />
        </div>

      </div>

      <div className="footer__inferior">
        <span>
          © {new Date().getFullYear()} Al Rescate
        </span>

        <div>
          <a href="#terminos">Términos y condiciones</a>
          <a href="#privacidad">Privacidad</a>
        </div>
      </div>
    </footer>
  );
}

export default Footer;