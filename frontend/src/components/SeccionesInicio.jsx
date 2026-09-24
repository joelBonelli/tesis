import {
  Sparkles,
  PaintRoller,
  Wrench,
  ShieldCheck,
  Star,
  Users,
  ArrowRight,
} from "lucide-react";

import "./SeccionesInicio.css";

function SeccionesInicio() {
  return (
    <section className="inicio-secciones">
      <div className="inicio-secciones__contenido">

        <div className="categorias-destacadas">

          <article className="categoria-card categoria-card--naranja">
            <Sparkles size={34} />

            <div>
              <h3>Limpieza</h3>
              <p>Hogares y oficinas</p>
            </div>

            <button aria-label="Ver servicios de limpieza">
              <ArrowRight size={20} />
            </button>
          </article>

          <article className="categoria-card categoria-card--verde">
            <PaintRoller size={34} />

            <div>
              <h3>Pintura</h3>
              <p>Interiores y exteriores</p>
            </div>

            <button aria-label="Ver servicios de pintura">
              <ArrowRight size={20} />
            </button>
          </article>

          <article className="categoria-card categoria-card--naranja">
            <Wrench size={34} />

            <div>
              <h3>Reparaciones</h3>
              <p>Soluciones para tu hogar</p>
            </div>

            <button aria-label="Ver servicios de reparaciones">
              <ArrowRight size={20} />
            </button>
          </article>

        </div>

        <div className="confianza">

          <div className="confianza__encabezado">
            <h2>Cómo genera confianza</h2>

            <a href="#confianza">
              Conocé más
              <ArrowRight size={18} />
            </a>
          </div>

          <div className="confianza__items">

            <div className="confianza-item">
              <div className="confianza-item__icono confianza-item__icono--verde">
                <ShieldCheck size={30} />
              </div>

              <div>
                <h3>Verificados</h3>
                <p>Identidad y experiencia comprobada.</p>
              </div>
            </div>

            <div className="confianza-item">
              <div className="confianza-item__icono confianza-item__icono--naranja">
                <Star size={30} />
              </div>

              <div>
                <h3>Reseñas</h3>
                <p>Opiniones reales de otros usuarios.</p>
              </div>
            </div>

            <div className="confianza-item">
              <div className="confianza-item__icono confianza-item__icono--verde">
                <Users size={30} />
              </div>

              <div>
                <h3>Patrocinios</h3>
                <p>Comercios que respaldan su trabajo.</p>
              </div>
            </div>

          </div>
        </div>

      </div>
    </section>
  );
}

export default SeccionesInicio;