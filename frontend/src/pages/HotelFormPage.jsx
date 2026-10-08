import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { Helmet } from "react-helmet-async";
import HotelForm from "../components/HotelForm";
import {
  createHotel,
  updateHotel,
  fetchHotelById,
  clearCurrentHotel,
} from "../store/hotelSlice";

function HotelFormPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const isEdit = Boolean(id);
  const [formError, setFormError] = useState("");

  const currentHotel = useSelector((state) => {
    if (!isEdit) return null;
    if (
      state.hotels.currentHotel &&
      String(state.hotels.currentHotel.id) === String(id)
    ) {
      return state.hotels.currentHotel;
    }
    return (
      state.hotels.hotels.find((h) => String(h.id) === String(id)) || null
    );
  });

  useEffect(() => {
    if (isEdit && !currentHotel) {
      dispatch(fetchHotelById(id));
    }
    return () => {
      dispatch(clearCurrentHotel());
    };
  }, [dispatch, id, isEdit]);

  const handleFormSubmit = async (formData) => {
    try {
      setFormError("");

      const fd = new FormData();
      fd.append("title", formData.title);
      fd.append("description", formData.description);
      fd.append("latitude", formData.latitude);
      fd.append("longitude", formData.longitude);
      fd.append("price", formData.price);

      if (formData.imageFile) {
        fd.append("image", formData.imageFile);
      }

      if (isEdit) {
        const hotelId = currentHotel ? currentHotel.id : id;
        await dispatch(updateHotel({ id: hotelId, formData: fd })).unwrap();
      } else {
        await dispatch(createHotel(fd)).unwrap();
      }

      navigate("/");
    } catch (error) {
      const message =
        typeof error === "string"
          ? error
          : error?.message || "Unable to save hotel. Please check your entries and try again.";
      setFormError(message);
    }
  };

  const helmetTitle = isEdit ? "Edit Hotel | Hotel List" : "Add Hotel | Hotel List";
  const metaDescription = isEdit
    ? "Edit hotel details and information."
    : "Add a new hotel listing.";

  return (
    <div className="page-container">
      <Helmet>
        <title>{helmetTitle}</title>
        <meta name="description" content={metaDescription} />
      </Helmet>

      <div className="form-page-container">
        <h2>{isEdit ? "Edit Hotel" : "Add Hotel"}</h2>
        <HotelForm
          initialValues={currentHotel}
          isEdit={isEdit}
          onSubmit={handleFormSubmit}
          formError={formError}
        />
      </div>
    </div>
  );
}

export default HotelFormPage;
