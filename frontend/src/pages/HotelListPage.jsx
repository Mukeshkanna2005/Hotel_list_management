import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import HotelCard from "../components/HotelCard";
import SearchFilter from "../components/SearchFilter";
import Pagination from "../components/Pagination";
import SuccessPopup from "../components/SuccessPopup";
import { fetchHotels, deleteHotel } from "../store/hotelSlice";

const PAGE_SIZE = 6;

function HotelListPage() {
  const dispatch = useDispatch();
  const { hotels, total, loading, error } = useSelector((state) => state.hotels);

  const [searchTerm, setSearchTerm] = useState("");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  // Debounced filters to prevent excessive API requests
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [debouncedMinPrice, setDebouncedMinPrice] = useState("");
  const [debouncedMaxPrice, setDebouncedMaxPrice] = useState("");

  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchTerm);
      setDebouncedMinPrice(minPrice);
      setDebouncedMaxPrice(maxPrice);
    }, 300);

    return () => clearTimeout(timer);
  }, [searchTerm, minPrice, maxPrice]);

  // Request backend paginated and filtered data
  useEffect(() => {
    const offset = (currentPage - 1) * PAGE_SIZE;
    const params = {
      offset,
      limit: PAGE_SIZE,
    };

    if (debouncedSearch.trim()) {
      params.search = debouncedSearch.trim();
    }
    if (debouncedMinPrice !== "" && !isNaN(Number(debouncedMinPrice))) {
      params.minPrice = Number(debouncedMinPrice);
    }
    if (debouncedMaxPrice !== "" && !isNaN(Number(debouncedMaxPrice))) {
      params.maxPrice = Number(debouncedMaxPrice);
    }

    dispatch(fetchHotels(params));
  }, [dispatch, currentPage, debouncedSearch, debouncedMinPrice, debouncedMaxPrice]);

  const totalPages = Math.ceil(total / PAGE_SIZE) || 1;

  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(1);
    }
  }, [totalPages, currentPage]);

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
  };

  const handleMinPriceChange = (e) => {
    setMinPrice(e.target.value);
    setCurrentPage(1);
  };

  const handleMaxPriceChange = (e) => {
    setMaxPrice(e.target.value);
    setCurrentPage(1);
  };

  const handleDeleteHotel = async (hotelId) => {
    const isConfirmed = window.confirm(
      "Are you sure you want to delete this hotel?"
    );
    if (isConfirmed) {
      try {
        await dispatch(deleteHotel(hotelId)).unwrap();
        setSuccessMessage("Hotel deleted successfully.");

        // Refetch current page data
        const offset = (currentPage - 1) * PAGE_SIZE;
        dispatch(
          fetchHotels({
            offset,
            limit: PAGE_SIZE,
            search: debouncedSearch.trim() || undefined,
            minPrice: debouncedMinPrice || undefined,
            maxPrice: debouncedMaxPrice || undefined,
          })
        );
      } catch (err) {
        setErrorMessage("Unable to delete the hotel. Please try again.");
      }
    }
  };

  return (
    <div className="page-container">
      <Helmet>
        <title>Hotels | Hotel List</title>
        <meta
          name="description"
          content="Browse through our selection of hotels with prices, locations, and details."
        />
      </Helmet>

      <div className="page-header">
        <h1 className="brand-header">NAMLATIC HOTELS</h1>
        <Link to="/add" className="btn btn-primary">
          Add Hotel
        </Link>
      </div>

      <SearchFilter
        searchTerm={searchTerm}
        onSearchChange={handleSearchChange}
        minPrice={minPrice}
        onMinPriceChange={handleMinPriceChange}
        maxPrice={maxPrice}
        onMaxPriceChange={handleMaxPriceChange}
      />

      {errorMessage && (
        <div className="error-banner" role="alert">
          {errorMessage}
          <button
            type="button"
            className="error-banner-dismiss"
            onClick={() => setErrorMessage("")}
          >
            &times;
          </button>
        </div>
      )}

      {error ? (
        <div className="error-card">
          <h2>Unable to Load Hotels</h2>
          <p>We could not retrieve the hotel listings at this time. Please try again.</p>
          <button
            type="button"
            className="btn btn-primary"
            onClick={() =>
              dispatch(
                fetchHotels({
                  offset: (currentPage - 1) * PAGE_SIZE,
                  limit: PAGE_SIZE,
                })
              )
            }
          >
            Retry
          </button>
        </div>
      ) : loading ? (
        <div className="loading-state">
          <p>Loading hotels...</p>
        </div>
      ) : hotels.length === 0 ? (
        <div className="empty-state">
          <p>
            {searchTerm || minPrice || maxPrice
              ? "No hotels found matching your search criteria."
              : "No hotels added yet. Click \"Add Hotel\" to create your first hotel listing."}
          </p>
        </div>
      ) : (
        <>
          <div className="hotel-grid">
            {hotels.map((hotel) => (
              <HotelCard
                key={hotel.id}
                hotel={hotel}
                onDelete={handleDeleteHotel}
              />
            ))}
          </div>

          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
          />
        </>
      )}

      <SuccessPopup
        message={successMessage}
        onClose={() => setSuccessMessage("")}
      />
    </div>
  );
}

export default HotelListPage;
