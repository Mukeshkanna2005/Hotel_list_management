import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";

function HotelForm({ initialValues, isEdit, onSubmit, formError }) {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    latitude: "",
    longitude: "",
    price: "",
  });

  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState("");
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (initialValues) {
      setFormData({
        title: initialValues.title || "",
        description: initialValues.description || "",
        latitude:
          initialValues.latitude !== undefined
            ? String(initialValues.latitude)
            : "",
        longitude:
          initialValues.longitude !== undefined
            ? String(initialValues.longitude)
            : "",
        price:
          initialValues.price !== undefined
            ? String(initialValues.price)
            : "",
      });

      const imgPath = initialValues.image_path || initialValues.image;
      if (imgPath) {
        setImagePreview(imgPath);
      }
    }
  }, [initialValues]);

  // Clean up blob preview URL on unmount or change
  useEffect(() => {
    return () => {
      if (imagePreview && imagePreview.startsWith("blob:")) {
        URL.revokeObjectURL(imagePreview);
      }
    };
  }, [imagePreview]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files && e.target.files[0];
    if (file) {
      const validTypes = [
        "image/jpeg",
        "image/jpg",
        "image/png",
        "image/webp",
        "image/avif",
      ];

      if (!validTypes.includes(file.type) && !file.type.startsWith("image/")) {
        setErrors((prev) => ({
          ...prev,
          image: "Please select a valid image file (JPG, PNG, or WEBP).",
        }));
        e.target.value = "";
        return;
      }

      setImageFile(file);
      const previewUrl = URL.createObjectURL(file);
      setImagePreview(previewUrl);

      if (errors.image) {
        setErrors((prev) => ({
          ...prev,
          image: "",
        }));
      }
    }
  };

  const validateForm = () => {
    const newErrors = {};

    // In Add mode, image is required; in Edit mode, existing image is kept if no new one selected
    if (!isEdit && !imageFile) {
      newErrors.image = "Please select a hotel image.";
    }

    if (!formData.title.trim()) {
      newErrors.title = "Title is required.";
    }

    if (!formData.description.trim()) {
      newErrors.description = "Description is required.";
    }

    const latStr = String(formData.latitude).trim();
    const latNum = Number(formData.latitude);
    if (!latStr || isNaN(latNum)) {
      newErrors.latitude = "Please enter a valid latitude.";
    } else if (latNum < -90 || latNum > 90) {
      newErrors.latitude = "Latitude must be between -90 and 90.";
    }

    const lngStr = String(formData.longitude).trim();
    const lngNum = Number(formData.longitude);
    if (!lngStr || isNaN(lngNum)) {
      newErrors.longitude = "Please enter a valid longitude.";
    } else if (lngNum < -180 || lngNum > 180) {
      newErrors.longitude = "Longitude must be between -180 and 180.";
    }

    const priceStr = String(formData.price).trim();
    const priceNum = Number(formData.price);
    if (!priceStr || isNaN(priceNum)) {
      newErrors.price = "Please enter a valid price.";
    } else if (priceNum <= 0) {
      newErrors.price = "Price must be greater than 0.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validateForm()) {
      return;
    }

    onSubmit({
      title: formData.title.trim(),
      description: formData.description.trim(),
      latitude: Number(formData.latitude),
      longitude: Number(formData.longitude),
      price: Number(formData.price),
      imageFile: imageFile || null,
    });
  };

  return (
    <form className="hotel-form" onSubmit={handleSubmit} noValidate>
      {formError && (
        <div className="form-error-banner" role="alert">
          {formError}
        </div>
      )}

      <div className="form-group">
        <label htmlFor="image">Hotel Image {isEdit && "(Optional to replace)"}</label>
        <input
          id="image"
          name="image"
          type="file"
          accept="image/jpeg,image/png,image/webp,image/jpg"
          onChange={handleImageChange}
        />
        {errors.image && <span className="error-text">{errors.image}</span>}

        {imagePreview && (
          <div className="image-preview-wrapper">
            <span className="image-preview-label">
              {isEdit && !imageFile ? "Current Image Preview" : "Image Preview"}
            </span>
            <img
              src={imagePreview}
              alt="Hotel image preview"
              className="image-preview"
            />
          </div>
        )}
      </div>

      <div className="form-group">
        <label htmlFor="title">Title</label>
        <input
          id="title"
          name="title"
          type="text"
          value={formData.title}
          onChange={handleChange}
          placeholder="e.g. Grand Palace Hotel"
        />
        {errors.title && <span className="error-text">{errors.title}</span>}
      </div>

      <div className="form-group">
        <label htmlFor="description">Description</label>
        <textarea
          id="description"
          name="description"
          rows="4"
          value={formData.description}
          onChange={handleChange}
          placeholder="Enter a description of the hotel..."
        ></textarea>
        {errors.description && (
          <span className="error-text">{errors.description}</span>
        )}
      </div>

      <div className="form-row">
        <div className="form-group">
          <label htmlFor="latitude">Latitude</label>
          <input
            id="latitude"
            name="latitude"
            type="number"
            step="any"
            value={formData.latitude}
            onChange={handleChange}
            placeholder="e.g. 18.9217 (-90 to 90)"
          />
          {errors.latitude && (
            <span className="error-text">{errors.latitude}</span>
          )}
        </div>

        <div className="form-group">
          <label htmlFor="longitude">Longitude</label>
          <input
            id="longitude"
            name="longitude"
            type="number"
            step="any"
            value={formData.longitude}
            onChange={handleChange}
            placeholder="e.g. 72.8332 (-180 to 180)"
          />
          {errors.longitude && (
            <span className="error-text">{errors.longitude}</span>
          )}
        </div>
      </div>

      <div className="form-group">
        <label htmlFor="price">Price per night (₹)</label>
        <input
          id="price"
          name="price"
          type="number"
          step="any"
          min="1"
          value={formData.price}
          onChange={handleChange}
          placeholder="e.g. 8500"
        />
        {errors.price && <span className="error-text">{errors.price}</span>}
      </div>

      <div className="form-actions">
        <button type="submit" className="btn btn-primary">
          {isEdit ? "Update Hotel" : "Add Hotel"}
        </button>
        <Link to="/" className="btn btn-secondary">
          Cancel
        </Link>
      </div>
    </form>
  );
}

export default HotelForm;
