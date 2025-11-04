import { useAuth } from '@presentation/context/AuthContext';
import { Button } from '@presentation/components/Button/Button';
import './Home.css';

export const Home = () => {
  const { isAuthenticated } = useAuth();

  return (
    <div className="home-page">
      <div className="home-hero">
        <div className="home-content">
          <h1 className="home-title">Bienvenido a Hotel Reservations</h1>
          <p className="home-subtitle">
            Sistema de gestión de reservas de hotel. Encuentra y reserva la habitación perfecta para tu estadía.
          </p>

          <div className="home-actions">
            {isAuthenticated ? (
              <a href="/search">
                <Button>Buscar Habitaciones</Button>
              </a>
            ) : (
              <>
                <a href="/register">
                  <Button>Registrarse</Button>
                </a>
                <a href="/login">
                  <Button variant="secondary">Iniciar Sesión</Button>
                </a>
              </>
            )}
          </div>
        </div>
      </div>

      <div className="home-features">
        <div className="home-features-container">
          <h2 className="home-features-title">Características</h2>
          <div className="home-features-grid">
            <div className="home-feature-card">
              <div className="home-feature-icon">🔍</div>
              <h3>Búsqueda Avanzada</h3>
              <p>Encuentra habitaciones disponibles según tus fechas y preferencias</p>
            </div>

            <div className="home-feature-card">
              <div className="home-feature-icon">🏨</div>
              <h3>Variedad de Habitaciones</h3>
              <p>Individual, Doble, Suite y Deluxe para todas tus necesidades</p>
            </div>

            <div className="home-feature-card">
              <div className="home-feature-icon">📅</div>
              <h3>Gestión de Reservas</h3>
              <p>Administra tus reservas fácilmente desde tu panel personal</p>
            </div>

            <div className="home-feature-card">
              <div className="home-feature-icon">✨</div>
              <h3>Amenidades Premium</h3>
              <p>WiFi, TV, MiniBar y más para tu comodidad</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};