import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

// config
import { API_URL } from "@/config/api";

interface LogItem {
  _id: string;
  browser: string;
  message: string;
  createdAt: string;
  updatedAt: string;
}
interface LogState {
  loading: boolean;
  success: boolean | null;
  message: LogItem[];
}

const initialState: LogState = {
  loading: true,
  success: null,
  message: [],
};

export const fetchLogData = createAsyncThunk("log/fetchData", async () => {
  const response = await fetch(`${API_URL}/logs/all`);
  const data = await response.json();
  return data.message;
});

export const postLogData = createAsyncThunk(
  "log/postData",
  async (message: string) => {
    const response = await fetch(`${API_URL}/logs/create`, {
      method: "post",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        message,
      }),
    });
    const data = await response.json();
    return data.message;
  }
);

export const logSlice = createSlice({
  name: "log",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchLogData.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchLogData.fulfilled, (state, action) => {
        state.loading = false;
        state.message = action.payload;
        state.success = true;
      })
      .addCase(fetchLogData.rejected, (state, action) => {
        state.loading = false;
        state.success = false;
      });
  },
});

export default logSlice.reducer;
