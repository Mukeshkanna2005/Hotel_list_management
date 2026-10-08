import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import hotelApi from "../services/hotelApi";

// Async thunks
export const fetchHotels = createAsyncThunk(
  "hotels/fetchHotels",
  async (params = {}) => {
    return await hotelApi.getAll(params);
  }
);

export const fetchHotelById = createAsyncThunk(
  "hotels/fetchHotelById",
  async (id) => {
    return await hotelApi.getById(id);
  }
);

export const createHotel = createAsyncThunk(
  "hotels/createHotel",
  async (formData) => {
    return await hotelApi.create(formData);
  }
);

export const updateHotel = createAsyncThunk(
  "hotels/updateHotel",
  async ({ id, formData }) => {
    return await hotelApi.update(id, formData);
  }
);

export const deleteHotel = createAsyncThunk(
  "hotels/deleteHotel",
  async (id) => {
    await hotelApi.delete(id);
    return id;
  }
);

const initialState = {
  hotels: [],
  total: 0,
  currentHotel: null,
  loading: false,
  error: null,
};

const hotelSlice = createSlice({
  name: "hotels",
  initialState,
  reducers: {
    clearCurrentHotel: (state) => {
      state.currentHotel = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // fetchHotels
      .addCase(fetchHotels.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchHotels.fulfilled, (state, action) => {
        state.loading = false;
        if (Array.isArray(action.payload)) {
          state.hotels = action.payload;
          state.total = action.payload.length;
        } else if (action.payload && Array.isArray(action.payload.hotels)) {
          state.hotels = action.payload.hotels;
          state.total = action.payload.total !== undefined ? action.payload.total : action.payload.hotels.length;
        }
      })
      .addCase(fetchHotels.rejected, (state) => {
        state.loading = false;
        state.error = "Unable to load hotels. Please try again.";
      })

      // fetchHotelById
      .addCase(fetchHotelById.fulfilled, (state, action) => {
        state.currentHotel = action.payload;
      })
      .addCase(fetchHotelById.rejected, (state) => {
        state.currentHotel = null;
      })

      // createHotel
      .addCase(createHotel.fulfilled, (state, action) => {
        state.hotels.unshift(action.payload);
        state.total += 1;
      })

      // updateHotel
      .addCase(updateHotel.fulfilled, (state, action) => {
        const index = state.hotels.findIndex(
          (h) => h.id === action.payload.id
        );
        if (index !== -1) {
          state.hotels[index] = action.payload;
        }
        state.currentHotel = action.payload;
      })

      // deleteHotel
      .addCase(deleteHotel.fulfilled, (state, action) => {
        state.hotels = state.hotels.filter(
          (h) => h.id !== Number(action.payload)
        );
        state.total = Math.max(0, state.total - 1);
      });
  },
});

export const { clearCurrentHotel } = hotelSlice.actions;
export default hotelSlice.reducer;
