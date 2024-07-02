import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

// config
import { API_URL } from "@/config/api";

// utils
import showToast from "@/core/utils/toast";
import delay from "@/utils/delay";

interface DossierItem {
  _id: string;
  slug: string;
  files: Array<string>;
  createdAt: string;
  updatedAt: string;
}
interface DossierState {
  loading: boolean;
  success: boolean | null;
  message: DossierItem[];
}

const initialState: DossierState = {
  loading: true,
  success: null,
  message: [],
};

export const fetchDossierData = createAsyncThunk(
  "dossier/fetchData",
  async ({ getTheLastThree }: { getTheLastThree: boolean }) => {
    const response = await fetch(
      `${API_URL}/dossiers/all?getTheLastThree=${getTheLastThree}`
    );
    const data = await response.json();
    return data.message;
  }
);

export const postDossierData = createAsyncThunk(
  "dossier/postData",
  async ({
    slug,
    autoReload,
  }: {
    slug: string;
    autoReload: boolean;
  }) => {
    const response = await fetch(`${API_URL}/dossiers/create`, {
      method: "post",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        slug,
      }),
    });
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

export const deleteDossierData = createAsyncThunk(
  "dossier/deleteData",
  async ({ id, slug }: { id: string; slug: string }) => {
    const response = await fetch(
      `${API_URL}/dossiers/delete/${id}?slug=${slug}`,
      {
        method: "delete",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
      }
    );
    const data = await response.json();
    const { success, message } = data;
    // try render ui message
    showToast({ status: success, text: message, duration: 1.5 });
    return;
  }
);

export const dossierSlice = createSlice({
  name: "dossier",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchDossierData.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchDossierData.fulfilled, (state, action) => {
        state.loading = false;
        state.message = action.payload;
        state.success = true;
      })
      .addCase(fetchDossierData.rejected, (state, action) => {
        state.loading = false;
        state.success = false;
      });
  },
});

export default dossierSlice.reducer;
