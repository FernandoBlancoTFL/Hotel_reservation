import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@presentation/context/AuthContext';
import { Input } from '@presentation/components/Input/Input';
import { Button } from '@presentation/components/Button/Button';
import { Card } from '@presentation/components/Card/Card';
import './Login.css';

export const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await login({ email, password });
      navigate('/search');
    } catch (err: any) {
      setError(err.message || 'Error al iniciar sesión');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      <Card className="login-card">
        <h1 className="login-title">Iniciar Sesión</h1>
        <p className="login-subtitle">Bienvenido de vuelta</p>

        {error && <div className="login-error">{error}</div>}

        <form onSubmit={handleSubmit} className="login-form">
          <Input
            label="Email"
            type="email"
            value={email}
            onChange={setEmail}
            placeholder="tu@email.com"
            required
          />

          <Input
            label="Contraseña"
            type="password"
            value={password}
            onChange={setPassword}
            placeholder="••••••••"
            required
          />

          <Button type="submit" fullWidth disabled={loading}>
            {loading ? 'Iniciando sesión...' : 'Iniciar Sesión'}
          </Button>
        </form>

        <div className="login-footer">
          <p>
            ¿No tienes cuenta?{' '}
            <a href="/register" className="login-link">
              Regístrate aquí
            </a>
          </p>
        </div>
      </Card>
    </div>
  );
};