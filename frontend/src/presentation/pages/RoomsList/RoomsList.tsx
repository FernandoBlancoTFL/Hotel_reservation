import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Room } from '@domain/entities/Room';
import { RoomRepositoryImpl } from '@infrastructure/repositories/RoomRepositoryImpl';
import { Button } from '@presentation/components/Button/Button';
import { RoomCard } from '@presentation/components/RoomCard/RoomCard';
import { Loading } from '@presentation/components/Loading/Loading';
import { useAuth } from '@presentation/context/AuthContext';
import './RoomsList.css';

export const RoomsList = () => {
  const [rooms, setRooms] = useState<Room[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const navigate = useNavigate();
  const { user } = useAuth();
  const roomRepository = new RoomRepositoryImpl();

  useEffect(() => {
    loadRooms();
  }, []);

  const loadRooms = async () => {
    setLoading(true);
    setError('');

    try {
      const data = await roomRepository.getAll();
      setRooms(data);
    } catch (err: any) {
      setError(err.message || 'Error al cargar habitaciones');
    } finally {
      setLoading(false);
    }
  };

  const canCreateRoom = user?.role === 'RECEPTIONIST' || user?.role === 'ADMIN';

  if (loading) {
    return (
      <div className="rooms-list-page">
        <Loading />
      </div>
    );
  }

  return (
    <div className="rooms-list-page">
      <div className="rooms-list-container">
        <div className="rooms-list-header">
          <h1 className="rooms-list-title">Todas las Habitaciones</h1>
          {canCreateRoom && (
            <Button onClick={() => navigate('/rooms/create')}>Crear Habitación</Button>
          )}
        </div>

        {error && <div className="rooms-list-error">{error}</div>}

        {rooms.length === 0 ? (
          <div className="rooms-list-empty">
            <p>No hay habitaciones registradas</p>
            {canCreateRoom && (
              <Button onClick={() => navigate('/rooms/create')}>Crear Primera Habitación</Button>
            )}
          </div>
        ) : (
          <div className="rooms-list-grid">
            {rooms.map((room) => (
              <RoomCard key={room.id} room={room} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};