import { type ButtonHTMLAttributes } from 'react';
import './button.css';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {

  variant?: 'success' | 'danger' | 'warning' | 'secondary' | 'tab' | 'info';
  isActive?: boolean; 
}

export default function Button({ 
  variant = 'success', 
  isActive = false, 
  className = '', 
  children, 
  ...props 
}: ButtonProps) {
  
  const getVariantClass = () => {
    if (variant === 'tab') return `btn-tab ${isActive ? 'active' : ''}`;
    return `btn-${variant}`;
  };

  return (
    <button className={`btn ${getVariantClass()} ${className}`} {...props}>
      {children}
    </button>
  );
}