import { useState, useEffect } from 'react';
import { Reservation } from '@domain/entities/Reservation';
import { ReservationRepositoryImpl } from '@infrastructure/repositories/ReservationRepositoryImpl';
import { Card } from '@presentation/components/Card/Card';
import { Button } from '@presentation/components/Button/Button';
import { Loading } from '@presentation/components/Loading/Loading';
import './AllReservations.css';

export const AllReservations = () => {
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const reservationRepository = new ReservationRepositoryImpl();

  useEffect(() => {
    loadReservations();
  }, []);

  const loadReservations = async () => {
    setLoading(true);
    setError('');

    try {
      const data = await reservationRepository.getAllReservations();
      setReservations(data);
    } catch (err: any) {
      setError(err.message || 'Error al cargar reservas');
    } finally {
      setLoading(false);
    }
  };

  const handleCheckIn = async (id: string) => {
    if (!confirm('¿Confirmar check-in?')) return;

    try {
      await reservationRepository.checkIn(id);
      await loadReservations();
    } catch (err: any) {
      alert(err.message || 'Error al hacer check-in');
    }
  };

  const handleCheckOut = async (id: string) => {
    if (!confirm('¿Confirmar check-out?')) return;

    try {
      await reservationRepository.checkOut(id);
      await loadReservations();
    } catch (err: any) {
      alert(err.message || 'Error al hacer check-out');
    }
  };

  const handleCancel = async (id: string) => {
    if (!confirm('¿Cancelar esta reserva?')) return;

    try {
      await reservationRepository.cancel(id);
      await loadReservations();
    } catch (err: any) {
      alert(err.message || 'Error al cancelar reserva');
    }
  };

  const getStatusLabel = (status: string) => {
    const labels: Record<string, string> = {
      PENDING: 'Pendiente',
      CONFIRMED: 'Confirmada',
      CHECKED_IN: 'Check-in realizado',
      CHECKED_OUT: 'Check-out realizado',
      CANCELLED: 'Cancelada',
    };
    return labels[status] || status;
  };

  const getStatusClass = (status: string) => {
    return `reservation-status--${status.toLowerCase()}`;
  };

  if (loading) {
    return (
      <div className="all-reservations-page">
        <Loading />
      </div>
    );
  }

  return (
    <div className="all-reservations-page">
      <div className="all-reservations-container">
        <h1 className="all-reservations-title">Todas las Reservas</h1>

        {error && <div className="all-reservations-error">{error}</div>}

        {reservations.length === 0 ? (
          <Card>
            <div className="all-reservations-empty">
              <p>No hay reservas registradas</p>
            </div>
          </Card>
        ) : (
          <div className="all-reservations-grid">
            {reservations.map((reservation) => (
              <Card key={reservation.id} className="reservation-card">
                <div className="reservation-card-header">
                  <h3 className="reservation-card-title">
                    {reservation.room?.number
                      ? `Habitación ${reservation.room.number}`
                      : 'Habitación'}
                  </h3>
                  <span className={`reservation-status ${getStatusClass(reservation.status)}`}>
                    {getStatusLabel(reservation.status)}
                  </span>
                </div>

                <div className="reservation-card-body">
                  <div className="reservation-card-info">
                    <span className="reservation-card-label">Check-in:</span>
                    <span className="reservation-card-value">
                      {new Date(reservation.checkInDate).toLocaleDateString()}
                    </span>
                  </div>

                  <div className="reservation-card-info">
                    <span className="reservation-card-label">Check-out:</span>
                    <span className="reservation-card-value">
                      {new Date(reservation.checkOutDate).toLocaleDateString()}
                    </span>
                  </div>

                  <div className="reservation-card-info">
                    <span className="reservation-card-label">Huéspedes:</span>
                    <span className="reservation-card-value">{reservation.numberOfGuests}</span>
                  </div>

                  {reservation.room?.type && (
                    <div className="reservation-card-info">
                      <span className="reservation-card-label">Tipo:</span>
                      <span className="reservation-card-value">{reservation.room.type}</span>
                    </div>
                  )}
                </div>

                <div className="reservation-card-actions">
                  {reservation.status === 'CONFIRMED' && (
                    <Button fullWidth onClick={() => handleCheckIn(reservation.id)}>
                      Check-in
                    </Button>
                  )}

                  {reservation.status === 'CHECKED_IN' && (
                    <Button fullWidth onClick={() => handleCheckOut(reservation.id)}>
                      Check-out
                    </Button>
                  )}

                  {reservation.status !== 'CANCELLED' &&
                    reservation.status !== 'CHECKED_OUT' && (
                      <Button
                        variant="danger"
                        fullWidth
                        onClick={() => handleCancel(reservation.id)}
                      >
                        Cancelar
                      </Button>
                    )}
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};