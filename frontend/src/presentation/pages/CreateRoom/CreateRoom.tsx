import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { RoomRepositoryImpl } from '@infrastructure/repositories/RoomRepositoryImpl';
import { CreateRoomUseCase } from '@domain/usecases/rooms/CreateRoomUseCase';
import { Input } from '@presentation/components/Input/Input';
import { Button } from '@presentation/components/Button/Button';
import { Card } from '@presentation/components/Card/Card';
import './CreateRoom.css';

export const CreateRoom = () => {
  const [formData, setFormData] = useState({
    number: '',
    type: 'SINGLE' as 'SINGLE' | 'DOUBLE' | 'SUITE' | 'DELUXE',
    pricePerNight: '',
    currency: 'USD',
    capacity: '',
    amenities: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const navigate = useNavigate();
  const roomRepository = new RoomRepositoryImpl();
  const createRoomUseCase = new CreateRoomUseCase(roomRepository);

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const amenitiesArray = formData.amenities
        .split(',')
        .map((a) => a.trim())
        .filter((a) => a.length > 0);

      await createRoomUseCase.execute({
        number: formData.number,
        type: formData.type,
        pricePerNight: parseFloat(formData.pricePerNight),
        currency: formData.currency,
        capacity: parseInt(formData.capacity),
        amenities: amenitiesArray,
      });

      alert('Habitación creada exitosamente');
      navigate('/rooms');
    } catch (err: any) {
      setError(err.message || 'Error al crear la habitación');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="create-room-page">
      <div className="create-room-container">
        <Card className="create-room-card">
          <h1 className="create-room-title">Crear Nueva Habitación</h1>

          {error && <div className="create-room-error">{error}</div>}

          <form onSubmit={handleSubmit} className="create-room-form">
            <Input
              label="Número de Habitación"
              value={formData.number}
              onChange={(value) => handleChange('number', value)}
              placeholder="101"
              required
            />

            <div className="create-room-field">
              <label className="create-room-label">
                Tipo de Habitación<span className="create-room-required">*</span>
              </label>
              <select
                value={formData.type}
                onChange={(e) => handleChange('type', e.target.value)}
                className="create-room-select"
                required
              >
                <option value="SINGLE">Individual</option>
                <option value="DOUBLE">Doble</option>
                <option value="SUITE">Suite</option>
                <option value="DELUXE">Deluxe</option>
              </select>
            </div>

            <div className="create-room-row">
              <Input
                label="Precio por Noche"
                type="number"
                min="0"
                step="0.01"
                value={formData.pricePerNight}
                onChange={(value) => handleChange('pricePerNight', value)}
                placeholder="100.00"
                required
              />

              <div className="create-room-field">
                <label className="create-room-label">
                  Moneda<span className="create-room-required">*</span>
                </label>
                <select
                  value={formData.currency}
                  onChange={(e) => handleChange('currency', e.target.value)}
                  className="create-room-select"
                  required
                >
                  <option value="USD">USD</option>
                  <option value="EUR">EUR</option>
                  <option value="ARS">ARS</option>
                </select>
              </div>
            </div>

            <Input
              label="Capacidad"
              type="number"
              min="1"
              value={formData.capacity}
              onChange={(value) => handleChange('capacity', value)}
              placeholder="2"
              required
            />

            <div className="create-room-field">
              <label className="create-room-label">Amenidades</label>
              <textarea
                value={formData.amenities}
                onChange={(e) => handleChange('amenities', e.target.value)}
                placeholder="WiFi, TV, MiniBar (separados por comas)"
                className="create-room-textarea"
                rows={3}
              />
              <span className="create-room-hint">Separa las amenidades con comas</span>
            </div>

            <div className="create-room-actions">
              <Button type="button" variant="secondary" onClick={() => navigate('/rooms')}>
                Cancelar
              </Button>
              <Button type="submit" disabled={loading}>
                {loading ? 'Creando...' : 'Crear Habitación'}
              </Button>
            </div>
          </form>
        </Card>
      </div>
    </div>
  );
};