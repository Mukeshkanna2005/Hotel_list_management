import React from "react";
import { useNavigate } from "react-router-dom";

function getImageUrl(hotel) {
  if (!hotel) return "";
  const img = hotel.image_path || hotel.image;
  if (!img) return "";
  if (img.startsWith("http") || img.startsWith("data:")) return img;
  return img;
}

function HotelCard({ hotel, onDelete }) {
  const navigate = useNavigate();

  const handleCardClick = () => {
    navigate(`/hotel/${hotel.id}`);
  };

  const handleEditClick = (e) => {
    e.stopPropagation();
    navigate(`/edit/${hotel.id}`);
  };

  const handleDeleteClick = (e) => {
    e.stopPropagation();
    onDelete(hotel.id);
  };

  const descriptionSnippet =
    hotel.description && hotel.description.length > 90
      ? `${hotel.description.slice(0, 90)}...`
      : hotel.description;

  return (
    <div className="hotel-card" onClick={handleCardClick}>
      <img
        src={getImageUrl(hotel)}
        alt={hotel.title}
        className="hotel-card-image"
        onError={(e) => {
          e.target.onerror = null;
          e.target.src =
            "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&auto=format&fit=crop&q=60";
        }}
      />
      <div className="hotel-card-body">
        <h3 className="hotel-card-title">{hotel.title}</h3>
        <p className="hotel-card-price">
          ₹{Number(hotel.price).toFixed(2)} / night
        </p>
        <p className="hotel-card-description">{descriptionSnippet}</p>

        <div className="hotel-card-actions">
          <button
            type="button"
            className="btn btn-sm btn-edit"
            onClick={handleEditClick}
            aria-label={`Edit ${hotel.title}`}
          >
            Edit
          </button>
          <button
            type="button"
            className="btn btn-sm btn-delete"
            onClick={handleDeleteClick}
            aria-label={`Delete ${hotel.title}`}
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}

export default HotelCard;
