import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Room } from '@domain/entities/Room';
import { RoomRepositoryImpl } from '@infrastructure/repositories/RoomRepositoryImpl';
import { SearchRoomsUseCase } from '@domain/usecases/rooms/SearchRoomsUseCase';
import { Input } from '@presentation/components/Input/Input';
import { Button } from '@presentation/components/Button/Button';
import { RoomCard } from '@presentation/components/RoomCard/RoomCard';
import { Loading } from '@presentation/components/Loading/Loading';
import { Modal } from '@presentation/components/Modal/Modal';
import { CreateReservationForm } from './CreateReservationForm';
import './SearchRooms.css';

export const SearchRooms = () => {
  const [checkInDate, setCheckInDate] = useState('');
  const [checkOutDate, setCheckOutDate] = useState('');
  const [capacity, setCapacity] = useState('');
  const [roomType, setRoomType] = useState('');
  const [rooms, setRooms] = useState<Room[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [selectedRoom, setSelectedRoom] = useState<Room | null>(null);
  const [showReservationModal, setShowReservationModal] = useState(false);

  const roomRepository = new RoomRepositoryImpl();
  const searchRoomsUseCase = new SearchRoomsUseCase(roomRepository);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    setRooms([]);

    try {
      const criteria = {
        checkInDate,
        checkOutDate,
        capacity: capacity ? parseInt(capacity) : undefined,
        roomType: roomType || undefined,
      };

      const results = await searchRoomsUseCase.execute(criteria);
      setRooms(results);

      if (results.length === 0) {
        setError('No se encontraron habitaciones disponibles para estas fechas');
      }
    } catch (err: any) {
      setError(err.message || 'Error al buscar habitaciones');
    } finally {
      setLoading(false);
    }
  };

  const handleSelectRoom = (room: Room) => {
    setSelectedRoom(room);
    setShowReservationModal(true);
  };

  const handleReservationSuccess = () => {
    setShowReservationModal(false);
    setSelectedRoom(null);
  };

  return (
    <div className="search-rooms-page">
      <div className="search-rooms-container">
        <h1 className="search-rooms-title">Buscar Habitaciones</h1>

        <form onSubmit={handleSearch} className="search-form">
          <div className="search-form-row">
            <Input
              label="Fecha de Check-in"
              type="date"
              value={checkInDate}
              onChange={setCheckInDate}
              required
            />

            <Input
              label="Fecha de Check-out"
              type="date"
              value={checkOutDate}
              onChange={setCheckOutDate}
              required
            />
          </div>

          <div className="search-form-row">
            <div className="search-form-field">
              <label className="search-form-label">Capacidad</label>
              <input
                type="number"
                min="1"
                value={capacity}
                onChange={(e) => setCapacity(e.target.value)}
                placeholder="Número de personas"
                className="search-form-input"
              />
            </div>

            <div className="search-form-field">
              <label className="search-form-label">Tipo de Habitación</label>
              <select
                value={roomType}
                onChange={(e) => setRoomType(e.target.value)}
                className="search-form-select"
              >
                <option value="">Todos</option>
                <option value="SINGLE">Individual</option>
                <option value="DOUBLE">Doble</option>
                <option value="SUITE">Suite</option>
                <option value="DELUXE">Deluxe</option>
              </select>
            </div>
          </div>

          <Button type="submit" fullWidth disabled={loading}>
            Buscar Habitaciones
          </Button>
        </form>

        {error && <div className="search-error">{error}</div>}

        {loading && <Loading />}

        {!loading && rooms.length > 0 && (
          <div className="search-results">
            <h2 className="search-results-title">
              {rooms.length} habitación(es) disponible(s)
            </h2>
            <div className="search-results-grid">
              {rooms.map((room) => (
                <RoomCard key={room.id} room={room} onSelect={handleSelectRoom} />
              ))}
            </div>
          </div>
        )}

        <Modal
          isOpen={showReservationModal}
          onClose={() => setShowReservationModal(false)}
          title="Crear Reserva"
        >
          {selectedRoom && (
            <CreateReservationForm
              room={selectedRoom}
              checkInDate={checkInDate}
              checkOutDate={checkOutDate}
              onSuccess={handleReservationSuccess}
              onCancel={() => setShowReservationModal(false)}
            />
          )}
        </Modal>
      </div>
    </div>
  );
};