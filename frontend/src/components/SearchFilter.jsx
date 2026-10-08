import React from "react";

function SearchFilter({
  searchTerm,
  onSearchChange,
  minPrice,
  onMinPriceChange,
  maxPrice,
  onMaxPriceChange,
}) {
  const isInvalidRange =
    minPrice !== "" &&
    maxPrice !== "" &&
    Number(minPrice) > Number(maxPrice);

  return (
    <div className="filters-container">
      <div className="filters-bar">
        <div className="filter-group">
          <label htmlFor="search-input">Search Hotel</label>
          <input
            id="search-input"
            type="text"
            placeholder="Search by hotel title..."
            value={searchTerm}
            onChange={onSearchChange}
          />
        </div>

        <div className="filter-group">
          <label htmlFor="min-price">Min Price (₹)</label>
          <input
            id="min-price"
            type="number"
            min="0"
            placeholder="0"
            value={minPrice}
            onChange={onMinPriceChange}
          />
        </div>

        <div className="filter-group">
          <label htmlFor="max-price">Max Price (₹)</label>
          <input
            id="max-price"
            type="number"
            min="0"
            placeholder="10000"
            value={maxPrice}
            onChange={onMaxPriceChange}
          />
        </div>
      </div>
      {isInvalidRange && (
        <p className="filter-warning-text">
          Notice: Minimum price (₹{minPrice}) is greater than Maximum price (₹{maxPrice}).
        </p>
      )}
    </div>
  );
}

export default SearchFilter;
