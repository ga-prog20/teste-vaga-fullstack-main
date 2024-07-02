import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

// config
import { API_URL } from "@/config/api";
import showToast from "@/core/utils/toast";
import delay from "@/utils/delay";

interface StatsState {
  loading: boolean;
  success: boolean | null;
  message: string | void;
}

const initialState: StatsState = {
  loading: true,
  success: null,
  message: "",
};

export const postStartImport = createAsyncThunk(
  "formImport/postStartImport",
  async ({
    slug,
    fileUid,
    autoReload,
  }: {
    slug: string;
    fileUid: string;
    autoReload: boolean;
  }) => {
    const response = await fetch(
      `${API_URL}/forms/queue/start?slug=${slug}&fileUid=${fileUid}`
    );
    const data = await response.json();
    const { success, message } = data;
    // try render ui message
    showToast({ status: success, text: message, duration: 1.5 });
    // check is have auto reload
    if (autoReload) {
      await delay(1700);
      // refresh page
      window.location.reload();
    }
    return;
  }
);

export const statSlice = createSlice({
  name: "startImports",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(postStartImport.pending, (state) => {
        state.loading = true;
      })
      .addCase(postStartImport.fulfilled, (state, action) => {
        state.loading = false;
        state.message = action.payload;
        state.success = true;
      })
      .addCase(postStartImport.rejected, (state, action) => {
        state.loading = false;
        state.success = false;
      });
  },
});

export default statSlice.reducer;
