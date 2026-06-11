import { useEffect, useState, useContext } from 'react'; 
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import { api } from '../services/api';
import Modal from '../components/Modal';
import Button from '../components/Button';
import PageHeader from '../components/PageHeader';
import { type Libro, type Usuario } from '../interfaces';
import SEO from '../components/SEO';
import { AuthContext } from '../context/AuthContext';
import './Admin.css';

export default function Admin() {
  const navigate = useNavigate();
  const { role } = useContext(AuthContext);

  const [pestañaActiva, setPestañaActiva] = useState<'libros' | 'usuarios'>('libros');
  const [errorBackend, setErrorBackend] = useState<string | null>(null);


  const [busquedaLibro, setBusquedaLibro] = useState('');
  const [busquedaUsuario, setBusquedaUsuario] = useState('');

  const [libros, setLibros] = useState<Libro[]>([]);
  const [mostrarFormLibro, setMostrarFormLibro] = useState(false);
  const [libroEditando, setLibroEditando] = useState<Libro | null>(null);
  
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [mostrarFormUsuario, setMostrarFormUsuario] = useState(false);
  const [usuarioEditando, setUsuarioEditando] = useState<Usuario | null>(null);

  const { register: registerLibro, handleSubmit: handleSubmitLibro, reset: resetLibro, formState: { errors: errorsLibro } } = useForm();
  const { register: registerUsuario, handleSubmit: handleSubmitUsuario, reset: resetUsuario, formState: { errors: errorsUsuario } } = useForm();

  useEffect(() => {
    if (role !== 'Admin' && pestañaActiva === 'usuarios') {
      setPestañaActiva('libros');
    }
  }, [pestañaActiva, role]);

  const cargarLibros = async () => {
    try {
      const res = await api.get('/libros/');
      setLibros(res.data);
    } catch (error) {
      console.error(error);
    }
  };

  const cargarUsuarios = async () => {
    try {
      const res = await api.get('/usuarios/');
      setUsuarios(res.data);
    } catch (error) {
      Swal.fire({
        icon: 'error', title: 'Acceso Denegado', text: 'No se pudieron cargar los usuarios. Revisa tus permisos.',
        toast: true, position: 'top-end', showConfirmButton: false, timer: 3000
      });
    }
  };

  useEffect(() => {
    if (pestañaActiva === 'libros') cargarLibros();
    if (pestañaActiva === 'usuarios' && role === 'Admin') cargarUsuarios(); 
  }, [pestañaActiva, role]);


  const librosFiltrados = libros.filter((libro) => {
    const termino = busquedaLibro.toLowerCase();
    return (
      libro.titulo.toLowerCase().includes(termino) ||
      libro.autor.toLowerCase().includes(termino) ||
      libro.id.toString().includes(termino)
    );
  });

  const usuariosFiltrados = usuarios.filter((usuario) => {
    const termino = busquedaUsuario.toLowerCase();
    return (
      usuario.email.toLowerCase().includes(termino) ||
      usuario.rol.toLowerCase().includes(termino) ||
      usuario.id.toString().includes(termino)
    );
  });

  const eliminarLibro = async (id: number) => {
    const result = await Swal.fire({ title: '¿Estás seguro?', icon: 'warning', showCancelButton: true, confirmButtonColor: '#dc3545', confirmButtonText: 'Sí, eliminar' });
    if (result.isConfirmed) {
      try {
        await api.delete(`/libros/${id}`);
        setLibros(libros.filter(l => l.id !== id));
        Swal.fire('¡Eliminado!', '', 'success');
      } catch (error) { Swal.fire('Error', 'Hubo un problema.', 'error'); }
    }
  };

  const onSubmitLibro = async (data: any) => {
    setErrorBackend(null); 
    try {
      const payload = { ...data, precio: Number(data.precio) };
      if (libroEditando) {
        const res = await api.put(`/libros/${libroEditando.id}`, payload);
        setLibros(libros.map(l => l.id === libroEditando.id ? res.data : l));
        Swal.fire({ icon: 'success', title: '¡Actualizado!', showConfirmButton: false, timer: 1500 });
      } else {
        const res = await api.post('/libros/', payload);
        setLibros([...libros, res.data]);
        Swal.fire({ icon: 'success', title: '¡Guardado!', showConfirmButton: false, timer: 1500 });
      }
      setMostrarFormLibro(false); resetLibro();
    } catch (error: any) { setErrorBackend(error.response?.data?.detail || "Error al procesar el libro"); }
  };

  const eliminarUsuario = async (id: number) => {
    const result = await Swal.fire({ title: '¿Eliminar Usuario?', icon: 'warning', showCancelButton: true, confirmButtonColor: '#dc3545', confirmButtonText: 'Sí, eliminar' });
    if (result.isConfirmed) {
      try {
        await api.delete(`/usuarios/${id}`);
        setUsuarios(usuarios.filter(u => u.id !== id));
        Swal.fire('¡Eliminado!', '', 'success');
      } catch (error) { Swal.fire('Error', 'No se pudo eliminar el usuario.', 'error'); }
    }
  };

  const onSubmitUsuario = async (data: any) => {
    setErrorBackend(null); 
    try {
      if (usuarioEditando) {
        const res = await api.put(`/usuarios/${usuarioEditando.id}`, data);
        setUsuarios(usuarios.map(u => u.id === usuarioEditando.id ? res.data : u));
        Swal.fire({ icon: 'success', title: '¡Actualizado!', showConfirmButton: false, timer: 1500 });
      }
      setMostrarFormUsuario(false); resetUsuario();
    } catch (error: any) { setErrorBackend(error.response?.data?.detail || "Error al procesar el usuario"); }
  };

  return (
    <div className="admin-container">
      <SEO 
        title="Panel de Administración" 
        description="Gestiona de forma segura el catálogo de libros y los usuarios registrados en BiblioDigital." 
      />
      
      <PageHeader 
        title="Panel de Administración" 
        subtitle="Gestiona el catálogo de libros y los usuarios del sistema"
      >
        <Button variant="secondary" onClick={() => navigate('/')}>
          ← Volver al Inicio
        </Button>
        
        {pestañaActiva === 'libros' && role === 'Admin' && (
          <Button variant="success" onClick={() => { setLibroEditando(null); resetLibro({}); setErrorBackend(null); setMostrarFormLibro(true); }}>
            + Agregar Nuevo Libro
          </Button>
        )}
        
        {pestañaActiva === 'usuarios' && (
           <span style={{color: '#666', fontStyle: 'italic', display: 'flex', alignItems: 'center'}}>Gestión de Usuarios</span>
        )}
      </PageHeader>

      <div className="tabs-container">
        <Button variant="tab" isActive={pestañaActiva === 'libros'} onClick={() => setPestañaActiva('libros')}>
           Gestión de Libros
        </Button>
        
        {role === 'Admin' && (
          <Button variant="tab" isActive={pestañaActiva === 'usuarios'} onClick={() => setPestañaActiva('usuarios')}>
             Gestión de Usuarios
          </Button>
        )}
      </div>

      {pestañaActiva === 'libros' && (
        <>
          <div className="search-container" style={{ margin: '0 0 20px 0', padding: '0' }}>
            <input 
              type="text" 
              placeholder="Buscar libro por ID, título o autor..." 
              value={busquedaLibro}
              onChange={(e) => setBusquedaLibro(e.target.value)}
              className="search-input"
            />
          </div>

          {librosFiltrados.length === 0 ? (
             <div className="no-results">
               <p>No se encontraron libros que coincidan con "<strong>{busquedaLibro}</strong>"</p>
             </div>
          ) : (
            <table className="admin-table">
              <thead><tr><th>ID</th><th>Título</th><th>Autor</th>{role === 'Admin' && <th>Acciones</th>}</tr></thead>
              <tbody>
                {librosFiltrados.map(libro => (
                  <tr key={libro.id}>
                    <td>{libro.id}</td><td>{libro.titulo}</td><td>{libro.autor}</td>
                    
                    {role === 'Admin' && (
                      <td>
                        <Button variant="warning" onClick={() => { setLibroEditando(libro); resetLibro(libro); setErrorBackend(null); setMostrarFormLibro(true); }} style={{ marginRight: '10px' }}>
                          Editar
                        </Button>
                        <Button variant="danger" onClick={() => eliminarLibro(libro.id)}>Eliminar</Button>
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </>
      )}

      {pestañaActiva === 'usuarios' && role === 'Admin' && (
        <>
          <div className="search-container" style={{ margin: '0 0 20px 0', padding: '0' }}>
            <input 
              type="text" 
              placeholder="Buscar usuario por ID, email o rol..." 
              value={busquedaUsuario}
              onChange={(e) => setBusquedaUsuario(e.target.value)}
              className="search-input"
            />
          </div>

          {usuariosFiltrados.length === 0 ? (
             <div className="no-results">
               <p>No se encontraron usuarios que coincidan con "<strong>{busquedaUsuario}</strong>"</p>
             </div>
          ) : (
            <table className="admin-table">
              <thead><tr><th>ID</th><th>Email</th><th>Rol</th><th>Acciones</th></tr></thead>
              <tbody>
                {usuariosFiltrados.map(usuario => (
                  <tr key={usuario.id}>
                    <td>{usuario.id}</td><td>{usuario.email}</td>
                    <td><span className={`rol-badge ${usuario.rol === 'Admin' ? 'rol-admin' : 'rol-user'}`}>{usuario.rol}</span></td>
                    <td>
                      <Button variant="warning" onClick={() => { setUsuarioEditando(usuario); resetUsuario(usuario); setErrorBackend(null); setMostrarFormUsuario(true); }} style={{ marginRight: '10px' }}>
                        Editar
                      </Button>
                      <Button variant="danger" onClick={() => eliminarUsuario(usuario.id)}>Eliminar</Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </>
      )}

      {/* ================= MODAL DE LIBROS ================= */}
      {mostrarFormLibro && (
        <Modal isOpen={mostrarFormLibro} title={libroEditando ? 'Editar Libro' : 'Crear Nuevo Libro'} onClose={() => setMostrarFormLibro(false)}>
          <form onSubmit={handleSubmitLibro(onSubmitLibro)}>
            
            <div className="form-group">
              <label htmlFor="titulo">Título del libro</label>
              <input 
                id="titulo"
                type="text" 
                {...registerLibro('titulo', { 
                  required: 'El título es obligatorio',
                  minLength: { value: 3, message: 'El título debe tener al menos 3 caracteres' }
                })} 
              />
              {errorsLibro.titulo && <span className="error-msg">{errorsLibro.titulo.message as string}</span>}
            </div>

            <div className="form-group">
              <label htmlFor="autor">Autor</label>
              <input 
                id="autor"
                type="text" 
                {...registerLibro('autor', { 
                  required: 'El autor es obligatorio',
                  minLength: { value: 5, message: 'El nombre del autor debe tener al menos 5 caracteres' }
                })} 
              />
              {errorsLibro.autor && <span className="error-msg">{errorsLibro.autor.message as string}</span>}
            </div>

            <div className="form-group">
              <label htmlFor="categoria">Categoría</label>
              <input 
                id="categoria"
                type="text" 
                {...registerLibro('categoria', { 
                  required: 'La categoría es obligatoria' 
                })} 
              />
              {errorsLibro.categoria && <span className="error-msg">{errorsLibro.categoria.message as string}</span>}
            </div>

            <div className="form-group">
              <label htmlFor="precio">Precio (Bs.)</label>
              <input 
                id="precio"
                type="number" 
                step="0.01" 
                {...registerLibro('precio', { 
                  required: 'El precio es obligatorio',
                  min: { value: 0.1, message: 'El precio debe ser mayor a 0 Bs.' }
                })} 
              />
              {errorsLibro.precio && <span className="error-msg">{errorsLibro.precio.message as string}</span>}
            </div>

            <div className="form-group">
              <label htmlFor="url_pdf">URL del PDF</label>
              <input 
                id="url_pdf"
                type="text" 
                {...registerLibro('url_pdf', { 
                  required: 'La URL del PDF es obligatoria',
                  pattern: {
                    value: /^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})([\/\w .-]*)*\/?$/,
                    message: 'Por favor, ingresa una URL válida (ej: https://dominio.com/libro.pdf)'
                  }
                })} 
              />
              {errorsLibro.url_pdf && <span className="error-msg">{errorsLibro.url_pdf.message as string}</span>}
            </div>

            <div className="form-group">
              <label htmlFor="descripcion">Descripción</label>
              <textarea 
                id="descripcion"
                rows={3} 
                {...registerLibro('descripcion', { 
                  required: 'La descripción es obligatoria',
                  minLength: { value: 10, message: 'La descripción debe tener al menos 10 caracteres' }
                })} 
              />
              {errorsLibro.descripcion && <span className="error-msg">{errorsLibro.descripcion.message as string}</span>}
            </div>

            {errorBackend && <div className="backend-error-msg">{errorBackend}</div>}
            
            <div className="modal-buttons">
              <Button variant="secondary" type="button" onClick={() => setMostrarFormLibro(false)}>Cancelar</Button>
              <Button variant="success" type="submit">{libroEditando ? 'Actualizar' : 'Guardar'}</Button>
            </div>
          </form>
        </Modal>
      )}

      {/* ================= MODAL DE USUARIOS ================= */}
      {mostrarFormUsuario && (
        <Modal isOpen={mostrarFormUsuario} title="Editar Usuario" onClose={() => setMostrarFormUsuario(false)}>
          <form onSubmit={handleSubmitUsuario(onSubmitUsuario)}>
            
            <div className="form-group">
              <label htmlFor="email">Email</label>
              <input 
                id="email"
                type="email" 
                {...registerUsuario('email', { 
                  required: 'El email es obligatorio',
                  pattern: {
                    value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/,
                    message: 'El formato de correo electrónico no es válido'
                  }
                })} 
              />
              {errorsUsuario.email && <span className="error-msg">{errorsUsuario.email.message as string}</span>}
            </div>

            <div className="form-group">
              <label htmlFor="password">Nuevo Password (obligatorio por seguridad)</label>
              <input 
                id="password"
                type="password" 
                {...registerUsuario('password', { 
                  required: 'La contraseña es obligatoria para confirmar cambios',
                  minLength: { value: 6, message: 'La contraseña debe tener un mínimo de 6 caracteres por seguridad' }
                })} 
              />
              {errorsUsuario.password && <span className="error-msg">{errorsUsuario.password.message as string}</span>}
            </div>

            <div className="form-group">
              <label htmlFor="rol">Rol del Usuario</label>
              <select id="rol" {...registerUsuario('rol', { required: 'El rol es obligatorio' })}>
                <option value="Usuario">Usuario Regular</option>
                <option value="Admin">Administrador</option>
              </select>
              {errorsUsuario.rol && <span className="error-msg">{errorsUsuario.rol.message as string}</span>}
            </div>

            {errorBackend && <div className="backend-error-msg">{errorBackend}</div>}
            
            <div className="modal-buttons">
              <Button variant="secondary" type="button" onClick={() => setMostrarFormUsuario(false)}>Cancelar</Button>
              <Button variant="success" type="submit">Actualizar Usuario</Button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
}