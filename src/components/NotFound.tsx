import { Link } from 'react-router-dom';
import './notFound.css';

export default function NotFound() {
  return (
    <div className="not-found-container">
      <div className="not-found-content">
        <h1 className="error-code">404</h1>
        <h2 className="error-title">¡Página no encontrada!</h2>
        <p className="error-message">
          Parece que te has perdido entre las estanterías. La sección que buscas no existe o ha sido movida.
        </p>
        <Link to="/" className="back-home-button">
          Volver al Inicio
        </Link>
      </div>
    </div>
  );
}