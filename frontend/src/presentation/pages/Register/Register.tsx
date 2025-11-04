import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@presentation/context/AuthContext';
import { Input } from '@presentation/components/Input/Input';
import { Button } from '@presentation/components/Button/Button';
import { Card } from '@presentation/components/Card/Card';
import './Register.css';

export const Register = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    name: '',
    phone: '',
    documentId: '',
    role: 'GUEST' as 'GUEST' | 'RECEPTIONIST' | 'ADMIN',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { register } = useAuth();
  const navigate = useNavigate();

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await register(formData);
      navigate('/search');
    } catch (err: any) {
      setError(err.message || 'Error al registrarse');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="register-page">
      <Card className="register-card">
        <h1 className="register-title">Crear Cuenta</h1>
        <p className="register-subtitle">Únete a nuestro hotel</p>

        {error && <div className="register-error">{error}</div>}

        <form onSubmit={handleSubmit} className="register-form">
          <Input
            label="Nombre Completo"
            value={formData.name}
            onChange={(value) => handleChange('name', value)}
            placeholder="Juan Pérez"
            required
          />

          <Input
            label="Email"
            type="email"
            value={formData.email}
            onChange={(value) => handleChange('email', value)}
            placeholder="tu@email.com"
            required
          />

          <Input
            label="Contraseña"
            type="password"
            value={formData.password}
            onChange={(value) => handleChange('password', value)}
            placeholder="••••••••"
            required
          />

          <Input
            label="Teléfono"
            type="tel"
            value={formData.phone}
            onChange={(value) => handleChange('phone', value)}
            placeholder="+1234567890"
            required
          />

          <Input
            label="Documento de Identidad"
            value={formData.documentId}
            onChange={(value) => handleChange('documentId', value)}
            placeholder="12345678"
            required
          />

          <div className="register-role">
            <label className="register-role-label">Tipo de Usuario</label>
            <select
              value={formData.role}
              onChange={(e) => handleChange('role', e.target.value)}
              className="register-select"
            >
              <option value="GUEST">Huésped</option>
              <option value="RECEPTIONIST">Recepcionista</option>
            </select>
          </div>

          <Button type="submit" fullWidth disabled={loading}>
            {loading ? 'Registrando...' : 'Registrarse'}
          </Button>
        </form>

        <div className="register-footer">
          <p>
            ¿Ya tienes cuenta?{' '}
            <a href="/login" className="register-link">
              Inicia sesión aquí
            </a>
          </p>
        </div>
      </Card>
    </div>
  );
};