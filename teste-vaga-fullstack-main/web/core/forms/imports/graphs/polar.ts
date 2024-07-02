import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

// config
import { API_URL } from "@/config/api";

interface PolarState {
  loading: boolean;
  success: boolean | null;
  message: {
    saveds: number,
    warnings: number,
    total: number
  };
}

const initialState: PolarState = {
  loading: true,
  success: null,
  message: {
    saveds: 0,
    warnings: 0,
    total: 0
  },
};

export const fetchPolarGraph = createAsyncThunk(
  "form/fetchPolarGraph",
  async () => {
    const response = await fetch(
      `${API_URL}/imports/logs/graphs/polar`
    );
    const data = await response.json();
    return data.message;
  }
);

export const polarSlice = createSlice({
  name: "polarGraph",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchPolarGraph.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchPolarGraph.fulfilled, (state, action) => {
        state.loading = false;
        state.message = action.payload;
        state.success = true;
      })
      .addCase(fetchPolarGraph.rejected, (state, action) => {
        state.loading = false;
        state.success = false;
      });
  },
});

export default polarSlice.reducer;
