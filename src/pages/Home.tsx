import { useEffect, useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom'; 
import { api } from '../services/api';
import { AuthContext } from '../context/AuthContext';
import PageHeader from '../components/PageHeader';
import Button from '../components/Button';
import SEO from '../components/SEO';
import './home.css';

interface Libro {
  id: number;
  titulo: string;
  autor: string;
  descripcion: string;
  url_pdf: string;
  categoria: string;
  precio: number;
}

export default function Home() {
  const [libros, setLibros] = useState<Libro[]>([]);
  const [cargando, setCargando] = useState(true);
  const [busqueda, setBusqueda] = useState(''); 
  
  const { logout, role } = useContext(AuthContext);
  const navigate = useNavigate(); 

  useEffect(() => {
    const obtenerLibros = async () => {
      try {
        const respuesta = await api.get('/libros/');
        setLibros(respuesta.data);
      } catch (error) {
        console.error("Error al obtener los libros:", error);
      } finally {
        setCargando(false);
      }
    };
    obtenerLibros();
  }, []);

  const librosFiltrados = libros.filter((libro) => {
    const termino = busqueda.toLowerCase();
    return (
      libro.titulo.toLowerCase().includes(termino) ||
      libro.autor.toLowerCase().includes(termino) ||
      libro.categoria.toLowerCase().includes(termino)
    );
  });

  return (
    <div className="home-container">
      <SEO title="Inicio" description="Explora la mejor biblioteca virtual. Encuentra miles de libros en PDF listos para ti." />
      
      <PageHeader 
        title="Catálogo de Libros" 
        subtitle="Explora y adquiere las mejores obras digitales disponibles"
      >
        {role?.toLowerCase() === 'admin' && (
          <Button variant="info" onClick={() => navigate('/admin')}>
            Panel Admin
          </Button>
        )}
        
        <span className="user-info">Has entrado como: <strong>{role}</strong></span>
        
        <Button variant="danger" onClick={logout}>
          Cerrar Sesión
        </Button>
      </PageHeader>
      
      <div className="search-container">
        <input 
          type="text" 
          placeholder="Buscar por título, autor o categoría..." 
          value={busqueda}
          onChange={(e) => setBusqueda(e.target.value)}
          className="search-input"
        />
      </div>

      {cargando ? (
        <p>Cargando libros de la base de datos...</p>
      ) : (
        <>
          {librosFiltrados.length === 0 && (
             <div className="no-results">
               <p>No se encontraron libros que coincidan con "<strong>{busqueda}</strong>"</p>
             </div>
          )}

          <div className="books-grid">
            {librosFiltrados.map((libro) => (
              <div key={libro.id} className="book-card">
                <h2 className="book-title">{libro.titulo}</h2>
                <p><strong>Autor:</strong> {libro.autor}</p>
                <p><strong>Categoría:</strong> {libro.categoria}</p>
                <p><strong>Precio:</strong> {libro.precio} Bs.</p>
                <p className="book-description">{libro.descripcion}</p>
                <a 
                  href={libro.url_pdf} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="book-link"
                >
                  Leer PDF
                </a>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}