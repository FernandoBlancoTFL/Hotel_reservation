import { useAuth } from '@presentation/context/AuthContext';
import { Button } from '../Button/Button';
import './Navbar.css';

export const Navbar = () => {
  const { user, logout, isAuthenticated } = useAuth();

  return (
    <nav className="navbar">
      <div className="navbar__container">
        <a href="/" className="navbar__logo">
          Hotel Reservations
        </a>

        <div className="navbar__menu">
          {isAuthenticated ? (
            <>
              <a href="/search" className="navbar__link">
                Buscar Habitaciones
              </a>
              <a href="/my-reservations" className="navbar__link">
                Mis Reservas
              </a>

              {(user?.role === 'RECEPTIONIST' || user?.role === 'ADMIN') && (
                <>
                  <a href="/rooms" className="navbar__link">
                    Habitaciones
                  </a>
                  <a href="/all-reservations" className="navbar__link">
                    Todas las Reservas
                  </a>
                </>
              )}

              <div className="navbar__user">
                <span className="navbar__username">{user?.name}</span>
                <Button variant="secondary" onClick={logout}>
                  Cerrar Sesión
                </Button>
              </div>
            </>
          ) : (
            <>
              <a href="/login" className="navbar__link">
                Iniciar Sesión
              </a>
              <a href="/register">
                <Button>Registrarse</Button>
              </a>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};