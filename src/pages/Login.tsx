import { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { AuthContext } from '../context/AuthContext';
import { api } from '../services/api';
import PageHeader from '../components/PageHeader';
import SEO from '../components/SEO';
import './login.css';

export default function Login() {
  const [isRegister, setIsRegister] = useState(false);
  const [errorBackend, setErrorBackend] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  
  const { register, handleSubmit, formState: { errors }, reset, watch } = useForm();
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const toggleMode = () => {
    setIsRegister(!isRegister);
    setErrorBackend('');
    setSuccessMessage('');
    reset(); 
  };

  const onSubmit = async (data: any) => {
    setErrorBackend('');
    setSuccessMessage('');
    
    const payload = {
      email: data.email, 
      password: data.password
    };

    try {
      if (isRegister) {
        await api.post('/auth/registro', payload);
        setSuccessMessage('¡Registro exitoso! Iniciando sesión...');
        
        const respuestaLogin = await api.post('/auth/login', payload);
        login(respuestaLogin.data.access_token);
        navigate('/catalogo');
      } else {
        const respuesta = await api.post('/auth/login', payload);
        login(respuesta.data.access_token);
        navigate('/catalogo');
      }
    } catch (error: any) {
      console.error(error);
      if (isRegister) {
        setErrorBackend(error.response?.data?.detail || 'Hubo un error al crear tu cuenta. Intenta de nuevo.');
      } else {
        setErrorBackend('Correo o contraseña incorrectos. Intenta de nuevo.');
      }
    }
  };

  return (
    <div className="login-container">
      <SEO 
        title={isRegister ? "Crear Cuenta" : "Iniciar Sesión"} 
        description={isRegister ? "Regístrate en BiblioDigital para empezar a gestionar tus libros." : "Ingresa a tu cuenta en BiblioDigital para gestionar tus libros y descargas."} 
      />

      <div className="auth-box">
        
        <PageHeader 
          title={isRegister ? "Únete a BiblioDigital" : "Ingresar a BiblioDigital"} 
          subtitle={isRegister ? "Crea una cuenta para explorar y gestionar libros" : "Introduce tus credenciales para acceder a la plataforma"} 
        />

        <form onSubmit={handleSubmit(onSubmit)} className="login-form">
          {errorBackend && <div className="error-message">{errorBackend}</div>}
          {successMessage && <div className="error-message" style={{ backgroundColor: '#e6fffa', color: '#00a3c4', borderColor: '#b2f5ea' }}>{successMessage}</div>}

          <div className="input-group">
            <label htmlFor="email" className="input-label">Correo Electrónico</label>
            <input 
              id="email"
              type="email" 
              className="input-field"
              {...register('email', { 
                required: 'El correo es obligatorio',
                pattern: {
                  value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/,
                  message: 'El formato de correo electrónico no es válido'
                }
              })} 
            />
            {errors.email && <span className="input-error">{errors.email.message as string}</span>}
          </div>

          <div className="input-group">
            <label htmlFor="password" className="input-label">Contraseña</label>
            <input 
              id="password"
              type="password" 
              className="input-field"
              {...register('password', { 
                required: 'La contraseña es obligatoria',
                minLength: { value: 6, message: 'La contraseña debe tener un mínimo de 6 caracteres' }
              })} 
            />
            {errors.password && <span className="input-error">{errors.password.message as string}</span>}
          </div>

          {isRegister && (
            <div className="input-group">
              <label htmlFor="confirmPassword" className="input-label">Repetir Contraseña</label>
              <input 
                id="confirmPassword"
                type="password" 
                className="input-field"
                {...register('confirmPassword', { 
                  required: 'Debes confirmar tu contraseña',
                  validate: (value) => value === watch('password') || 'Las contraseñas no coinciden'
                })} 
              />
              {errors.confirmPassword && <span className="input-error">{errors.confirmPassword.message as string}</span>}
            </div>
          )}

          <button type="submit" className="submit-button">
            {isRegister ? 'Registrarse' : 'Entrar'}
          </button>

          <p className="register-text">
            {isRegister ? '¿Ya tienes una cuenta?' : '¿No tienes una cuenta?'}
            <span className="register-link" onClick={toggleMode}>
              {isRegister ? 'Inicia Sesión' : 'Regístrate'}
            </span>
          </p>
        </form>

      </div>
    </div>
  );
}