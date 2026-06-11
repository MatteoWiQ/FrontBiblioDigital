import { useNavigate } from 'react-router-dom';
import PageHeader from '../components/PageHeader';
import Button from '../components/Button';
import SEO from '../components/SEO';
import './LandingPage.css';

export default function LandingPage() {
  const navigate = useNavigate();

  return (
    <div className="landing-layout">
      <SEO 
        title="Bienvenidos" 
        description="Explora la mejor biblioteca virtual moderna. Regístrate en BiblioDigital para gestionar y descargar tus libros favoritos." 
      />
      <PageHeader 
        title="BiblioDigital" 
        subtitle="Tu portal al conocimiento infinito"
      >
        <Button variant="info" onClick={() => navigate('/login')}>
          Iniciar Sesión
        </Button>
      </PageHeader>


      <header className="hero-section">
        <h2 className="hero-title">Tu biblioteca digital, en cualquier momento y lugar</h2>
        <p className="hero-subtitle">
          Descubre una forma moderna de organizar, leer y gestionar tus obras favoritas. 
          Únete hoy a nuestra comunidad literaria digital.
        </p>
        <div className="hero-actions">
          <Button variant="success" onClick={() => navigate('/catalogo')} style={{ padding: '15px 35px', fontSize: '16px' }}>
            Explorar el Catálogo Ahora
          </Button>
        </div>
      </header>


      <section className="features-section">
        <div className="feature-card">
          <h3>Búsqueda Avanzada</h3>
          <p>Encuentra libros por título, autor, categoría o palabras clave con filtros precisos y resultados instantáneos.</p>
        </div>

        <div className="feature-card">
          <h3>Lectura Sencilla</h3>
          <p>Accede a un visor limpio y adaptativo que facilita la lectura en cualquier dispositivo, sin distracciones.</p>
        </div>

        <div className="feature-card">
          <h3>Control Administrativo</h3>
          <p>Administra colecciones, usuarios y publicaciones desde un panel centralizado con permisos y registros.</p>
        </div>
      </section>


    </div>
  );
}