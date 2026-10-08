import React, { useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { Helmet } from "react-helmet-async";
import { fetchHotelById, clearCurrentHotel } from "../store/hotelSlice";

function getImageUrl(hotel) {
  if (!hotel) return "";
  const img = hotel.image_path || hotel.image;
  if (!img) return "";
  if (img.startsWith("http") || img.startsWith("data:")) return img;
  return img;
}

function HotelDetailPage() {
  const { id } = useParams();
  const dispatch = useDispatch();
  const { currentHotel, loading } = useSelector((state) => state.hotels);

  useEffect(() => {
    dispatch(fetchHotelById(id));
    return () => {
      dispatch(clearCurrentHotel());
    };
  }, [dispatch, id]);

  if (loading && !currentHotel) {
    return (
      <div className="page-container">
        <div className="loading-state">
          <p>Loading hotel details...</p>
        </div>
      </div>
    );
  }

  if (!currentHotel) {
    return (
      <div className="page-container">
        <Helmet>
          <title>Hotel Not Found | Hotel List</title>
          <meta name="description" content="The requested hotel was not found." />
        </Helmet>
        <div className="not-found-container">
          <h2>Hotel Not Found</h2>
          <p>The hotel you are looking for does not exist or has been removed.</p>
          <Link to="/" className="btn btn-primary">
            Back to Hotels
          </Link>
        </div>
      </div>
    );
  }

  const metaDescription =
    currentHotel.description && currentHotel.description.length > 150
      ? currentHotel.description.slice(0, 150)
      : currentHotel.description || "Hotel details";

  const mapUrl = `https://maps.google.com/maps?q=${currentHotel.latitude},${currentHotel.longitude}&z=15&output=embed`;

  return (
    <div className="page-container">
      <Helmet>
        <title>{`${currentHotel.title} | Hotel List`}</title>
        <meta name="description" content={metaDescription} />
      </Helmet>

      <div className="detail-header">
        <Link to="/" className="btn btn-secondary">
          &larr; Back to Hotels
        </Link>
      </div>

      <div className="hotel-detail-card">
        <img
          src={getImageUrl(currentHotel)}
          alt={currentHotel.title}
          className="hotel-detail-image"
          onError={(e) => {
            e.target.onerror = null;
            e.target.src =
              "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&auto=format&fit=crop&q=60";
          }}
        />

        <div className="hotel-detail-content">
          <h1 className="hotel-detail-title">{currentHotel.title}</h1>
          <p className="hotel-detail-price">
            ₹{Number(currentHotel.price).toFixed(2)} <span>/ night</span>
          </p>

          <div className="hotel-detail-section">
            <h3>About this Hotel</h3>
            <p className="hotel-detail-description">
              {currentHotel.description}
            </p>
          </div>

          <div className="hotel-detail-section">
            <h3>Location Coordinates</h3>
            <p className="coordinates-info">
              <strong>Latitude:</strong> {currentHotel.latitude} |{" "}
              <strong>Longitude:</strong> {currentHotel.longitude}
            </p>
          </div>

          <div className="hotel-detail-map">
            <h3>Map View</h3>
            <iframe
              title={`Map showing location of ${currentHotel.title}`}
              src={mapUrl}
              width="100%"
              height="350"
              style={{ border: 0, borderRadius: "8px" }}
              loading="lazy"
              allowFullScreen
            ></iframe>
          </div>
        </div>
      </div>
    </div>
  );
}

export default HotelDetailPage;
