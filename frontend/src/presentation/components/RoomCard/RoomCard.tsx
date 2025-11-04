import { Room } from '@domain/entities/Room';
import { Card } from '../Card/Card';
import { Button } from '../Button/Button';
import './RoomCard.css';

export interface RoomCardProps {
  room: Room;
  onSelect?: (room: Room) => void;
  actionLabel?: string;
}

export const RoomCard = ({ room, onSelect, actionLabel = 'Reservar' }: RoomCardProps) => {
  const getRoomTypeLabel = (type: string) => {
    const labels: Record<string, string> = {
      SINGLE: 'Individual',
      DOUBLE: 'Doble',
      SUITE: 'Suite',
      DELUXE: 'Deluxe',
    };
    return labels[type] || type;
  };

  return (
    <Card className="room-card">
      <div className="room-card__header">
        <h3 className="room-card__title">Habitación {room.number}</h3>
        <span className="room-card__type">{getRoomTypeLabel(room.type)}</span>
      </div>

      <div className="room-card__info">
        <div className="room-card__info-item">
          <span className="room-card__label">Capacidad:</span>
          <span className="room-card__value">{room.capacity} persona(s)</span>
        </div>

        <div className="room-card__info-item">
          <span className="room-card__label">Precio por noche:</span>
          <span className="room-card__price">
            {room.currency} ${room.pricePerNight}
          </span>
        </div>
      </div>

      {room.amenities && room.amenities.length > 0 && (
        <div className="room-card__amenities">
          <span className="room-card__label">Amenidades:</span>
          <div className="room-card__amenities-list">
            {room.amenities.map((amenity, index) => (
              <span key={index} className="room-card__amenity">
                {amenity}
              </span>
            ))}
          </div>
        </div>
      )}

      {onSelect && (
        <Button onClick={() => onSelect(room)} fullWidth>
          {actionLabel}
        </Button>
      )}
    </Card>
  );
};