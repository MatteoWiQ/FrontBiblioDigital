import AppRouter from './routes/AppRoutes';
import { AuthProvider } from './context/AuthContext';
import Footer from './components/Footer';
import { HelmetProvider } from 'react-helmet-async';

function App() {
  return (
    <HelmetProvider>
      <AuthProvider>
        <div className="app-layout">
          <main className="main-content">
            <AppRouter />
          </main>
          <Footer />
        </div>
      </AuthProvider>
    </HelmetProvider>
  );
}

export default App;