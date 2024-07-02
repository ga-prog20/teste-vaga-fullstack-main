import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

// config
import { API_URL } from "@/config/api";

interface StatsState {
  loading: boolean;
  success: boolean | null;
  message: {
    avgTime: number,
    total: number
  };
}

const initialState: StatsState = {
  loading: true,
  success: null,
  message: {
    avgTime: 0,
    total: 0
  },
};

export const fetchBasicStats = createAsyncThunk(
  "form/fetchBasicStats",
  async () => {
    const response = await fetch(
      `${API_URL}/imports/logs/stats/basic`
    );
    const data = await response.json();
    return data.message;
  }
);

export const statSlice = createSlice({
  name: "basicStats",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchBasicStats.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchBasicStats.fulfilled, (state, action) => {
        state.loading = false;
        state.message = action.payload;
        state.success = true;
      })
      .addCase(fetchBasicStats.rejected, (state, action) => {
        state.loading = false;
        state.success = false;
      });
  },
});

export default statSlice.reducer;
