import { useState, useEffect } from 'react';
import { Reservation } from '@domain/entities/Reservation';
import { ReservationRepositoryImpl } from '@infrastructure/repositories/ReservationRepositoryImpl';
import { GetMyReservationsUseCase } from '@domain/usecases/reservations/GetMyReservationsUseCase';
import { CancelReservationUseCase } from '@domain/usecases/reservations/CancelReservationUseCase';
import { Card } from '@presentation/components/Card/Card';
import { Button } from '@presentation/components/Button/Button';
import { Loading } from '@presentation/components/Loading/Loading';
import './MyReservations.css';

export const MyReservations = () => {
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const reservationRepository = new ReservationRepositoryImpl();
  const getMyReservationsUseCase = new GetMyReservationsUseCase(reservationRepository);
  const cancelReservationUseCase = new CancelReservationUseCase(reservationRepository);

  useEffect(() => {
    loadReservations();
  }, []);

  const loadReservations = async () => {
    setLoading(true);
    setError('');

    try {
      const data = await getMyReservationsUseCase.execute();
      setReservations(data);
    } catch (err: any) {
      setError(err.message || 'Error al cargar reservas');
    } finally {
      setLoading(false);
    }
  };

  const handleCancelReservation = async (id: string) => {
    if (!confirm('¿Estás seguro de que deseas cancelar esta reserva?')) {
      return;
    }

    try {
      await cancelReservationUseCase.execute(id);
      await loadReservations();
    } catch (err: any) {
      alert(err.message || 'Error al cancelar la reserva');
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
      <div className="my-reservations-page">
        <Loading />
      </div>
    );
  }

  return (
    <div className="my-reservations-page">
      <div className="my-reservations-container">
        <h1 className="my-reservations-title">Mis Reservas</h1>

        {error && <div className="my-reservations-error">{error}</div>}

        {reservations.length === 0 ? (
          <Card>
            <div className="my-reservations-empty">
              <p>No tienes reservas aún</p>
              <a href="/search">
                <Button>Buscar Habitaciones</Button>
              </a>
            </div>
          </Card>
        ) : (
          <div className="my-reservations-grid">
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

                  {reservation.totalPrice && (
                    <div className="reservation-card-info">
                      <span className="reservation-card-label">Total:</span>
                      <span className="reservation-card-price">
                        {reservation.totalPrice.currency} ${reservation.totalPrice.amount.toFixed(2)}
                      </span>
                    </div>
                  )}
                </div>

                {reservation.status !== 'CANCELLED' && reservation.status !== 'CHECKED_OUT' && (
                  <div className="reservation-card-actions">
                    <Button
                      variant="danger"
                      fullWidth
                      onClick={() => handleCancelReservation(reservation.id)}
                    >
                      Cancelar Reserva
                    </Button>
                  </div>
                )}
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};