import {
  Star,
  MapPin,
  BadgeCheck,
  ArrowRight,
  Store,
} from "lucide-react";

import "./TrabajadoresInicio.css";

const trabajadores = [
  {
    id: 1,
    nombre: "Carla M.",
    especialidad: "Pintura · Remodelaciones",
    calificacion: "4.9",
    resenas: 32,
    ubicacion: "Palermo, CABA",
    imagen: "https://i.pravatar.cc/300?img=47",
  },
  {
    id: 2,
    nombre: "Diego L.",
    especialidad: "Plomería · Reparaciones",
    calificacion: "4.8",
    resenas: 27,
    ubicacion: "Villa Urquiza, CABA",
    imagen: "https://i.pravatar.cc/300?img=12",
  },
];

function TrabajadoresInicio() {
  return (
    <section
      className="trabajadores-inicio"
      id="trabajadores"
    >
      <div className="trabajadores-inicio__contenido">

        <div className="trabajadores-inicio__encabezado">
          <h2>Trabajadores de tu zona</h2>

          <a href="#trabajadores">
            Ver más trabajadores
            <ArrowRight size={18} />
          </a>
        </div>

        <div className="trabajadores-inicio__grid">

          <div className="trabajadores-inicio__perfiles">
            {trabajadores.map((trabajador) => (
              <article
                className="trabajador-card"
                key={trabajador.id}
              >
                <img
                  src={trabajador.imagen}
                  alt={trabajador.nombre}
                  className="trabajador-card__imagen"
                />

                <div className="trabajador-card__info">
                  <div className="trabajador-card__nombre">
                    <h3>{trabajador.nombre}</h3>

                    <BadgeCheck
                      size={18}
                      className="trabajador-card__verificado"
                    />
                  </div>

                  <p className="trabajador-card__especialidad">
                    {trabajador.especialidad}
                  </p>

                  <div className="trabajador-card__rating">
                    <Star
                      size={17}
                      fill="currentColor"
                    />

                    <strong>{trabajador.calificacion}</strong>

                    <span>
                      ({trabajador.resenas} reseñas)
                    </span>
                  </div>

                  <div className="trabajador-card__ubicacion">
                    <MapPin size={16} />
                    <span>{trabajador.ubicacion}</span>
                  </div>
                </div>

                <button className="trabajador-card__boton">
                  Ver perfil
                </button>
              </article>
            ))}
          </div>

          <aside className="comercios-card">
            <div className="comercios-card__icono">
              <Store size={27} />
            </div>

            <div className="comercios-card__contenido">
              <span className="comercios-card__eyebrow">
                Comunidad local
              </span>

              <h3>
                Comercios de barrio que impulsan grandes trabajadores
              </h3>

              <p>
                Negocios y organizaciones locales respaldan perfiles
                dentro de Al Rescate.
              </p>

              <button>
                Conocé los aliados
                <ArrowRight size={17} />
              </button>
            </div>
          </aside>

        </div>
      </div>
    </section>
  );
}

export default TrabajadoresInicio;