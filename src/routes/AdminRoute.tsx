import { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

export default function AdminRoute({ children }: { children: React.ReactNode }) {
  const { token, role } = useContext(AuthContext);

  if (!token || role?.toLowerCase() !== 'admin') {
    return <Navigate to="/" replace />;
  }

  return children;
}