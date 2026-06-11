import { type ReactNode } from 'react';
import { useNavigate } from 'react-router-dom'; 
import logoBiblioteca from '../assets/biblioteca.png';
import './pageHeader.css';

interface PageHeaderProps {
  title: string;
  subtitle?: string;
  children?: ReactNode; 
}

export default function PageHeader({ title, subtitle, children }: PageHeaderProps) {
  const navigate = useNavigate(); 

  const manejarRedireccion = () => {
    navigate('/'); 
  };

  return (
    <div className="page-header-container">

      <div className="page-header-left header-clickable" onClick={manejarRedireccion}>
        <img 
          src={logoBiblioteca} 
          alt="Logo BiblioDigital" 
          className="page-header-logo" 
        />
        <div className="page-header-text">
          <h1>{title}</h1>
          {subtitle && <p className="page-header-subtitle">{subtitle}</p>}
        </div>
      </div>
      {children && <div className="page-header-actions">{children}</div>}
    </div>
  );
}