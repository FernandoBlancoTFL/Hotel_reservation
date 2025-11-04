import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Room } from '@domain/entities/Room';
import { ReservationRepositoryImpl } from '@infrastructure/repositories/ReservationRepositoryImpl';
import { CreateReservationUseCase } from '@domain/usecases/reservations/CreateReservationUseCase';
import { Input } from '@presentation/components/Input/Input';
import { Button } from '@presentation/components/Button/Button';
import './CreateReservationForm.css';

interface CreateReservationFormProps {
  room: Room;
  checkInDate: string;
  checkOutDate: string;
  onSuccess: () => void;
  onCancel: () => void;
}

export const CreateReservationForm = ({
  room,
  checkInDate,
  checkOutDate,
  onSuccess,
  onCancel,
}: CreateReservationFormProps) => {
  const [numberOfGuests, setNumberOfGuests] = useState('1');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const navigate = useNavigate();
  const reservationRepository = new ReservationRepositoryImpl();
  const createReservationUseCase = new CreateReservationUseCase(reservationRepository);

  const calculateTotalPrice = () => {
    const checkIn = new Date(checkInDate);
    const checkOut = new Date(checkOutDate);
    const nights = Math.ceil((checkOut.getTime() - checkIn.getTime()) / (1000 * 60 * 60 * 24));
    return nights * room.pricePerNight;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await createReservationUseCase.execute({
        roomId: room.id,
        checkInDate,
        checkOutDate,
        numberOfGuests: parseInt(numberOfGuests),
      });

      onSuccess();
      navigate('/my-reservations');
    } catch (err: any) {
      setError(err.message || 'Error al crear la reserva');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="reservation-form">
      <div className="reservation-summary">
        <h3>Resumen de Reserva</h3>
        <div className="reservation-summary-item">
          <span>Habitación:</span>
          <strong>{room.number}</strong>
        </div>
        <div className="reservation-summary-item">
          <span>Tipo:</span>
          <strong>{room.type}</strong>
        </div>
        <div className="reservation-summary-item">
          <span>Check-in:</span>
          <strong>{new Date(checkInDate).toLocaleDateString()}</strong>
        </div>
        <div className="reservation-summary-item">
          <span>Check-out:</span>
          <strong>{new Date(checkOutDate).toLocaleDateString()}</strong>
        </div>
        <div className="reservation-summary-item">
          <span>Precio por noche:</span>
          <strong>
            {room.currency} ${room.pricePerNight}
          </strong>
        </div>
        <div className="reservation-summary-total">
          <span>Total:</span>
          <strong>
            {room.currency} ${calculateTotalPrice()}
          </strong>
        </div>
      </div>

      {error && <div className="reservation-error">{error}</div>}

      <form onSubmit={handleSubmit} className="reservation-form-fields">
        <Input
          label="Número de Huéspedes"
          type="number"
          min="1"
          max={room.capacity.toString()}
          value={numberOfGuests}
          onChange={setNumberOfGuests}
          required
        />

        <div className="reservation-form-actions">
          <Button type="button" variant="secondary" onClick={onCancel} disabled={loading}>
            Cancelar
          </Button>
          <Button type="submit" disabled={loading}>
            {loading ? 'Creando...' : 'Confirmar Reserva'}
          </Button>
        </div>
      </form>
    </div>
  );
};