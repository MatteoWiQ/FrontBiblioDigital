import './footer.css';

export default function Footer() {
  const anioActual = new Date().getFullYear();

  return (
    <footer className="footer-container">
      <div className="footer-content">
        <div className="footer-section brand-info">
          <h3>📚 BiblioDigital</h3>
          <p>
            Tu biblioteca virtual moderna. Descubre, lee y gestiona tu catálogo de libros 
            favoritos en un solo lugar con la mejor tecnología.
          </p>
        </div>
        <div className="footer-section links">
          <h4>Enlaces Rápidos</h4>
          <ul>
            <li><a href="/">Inicio</a></li>
            <li><a href="/admin">Panel de Administración</a></li>
          </ul>
        </div>
        <div className="footer-section contact">
          <h4>Contacto y Soporte</h4>
          <p>soporte@bibliodigital.com</p>
          <p>+591 12345678</p>
          <p>Cochabamba, Bolivia</p>
        </div>

      </div>
      <div className="footer-bottom">
        <p>&copy; {anioActual} BiblioDigital. Todos los derechos reservados.</p>
        <p className="footer-credits">Desarrollado por <a href="https://github.com/MatteoWiQ" target="_blank" rel="noopener noreferrer">MatteoWiQ</a></p>
      </div>
    </footer>
  );
}