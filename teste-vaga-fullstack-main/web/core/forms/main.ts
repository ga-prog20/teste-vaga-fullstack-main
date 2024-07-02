import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

// config
import { API_URL } from "@/config/api";

interface FormItem {
  nrInst: number;
  cdClient: number;
  nmClient: string;
  nrCpfCnpj: string | null;
  nrContrato: number;
  dtContrato: Date;
  qtPrestacoes: number;
  vlTotal: string;
  cdProduto: number;
  dsProduto: string;
  cdCarteira: number;
  dsCarteira: string;
  nrProposta: number;
  nrPresta: number;
  tpPresta: string;
  nrSeqPre: number;
  dtVctPre: Date;
  vlPresta: string;
  vlMora: string;
  vlMulta: string;
  vlOutAcr: string;
  vlIof: string;
  vlDescon: string;
  vlAtual: string;
  idSituac: string;
  idSitVen: string;
  constVal: boolean;
}
interface FormState {
  loading: boolean;
  success: boolean | null;
  message: FormItem[];
  totalOfPages: number | 0;
}

const initialState: FormState = {
  loading: true,
  success: null,
  message: [],
  totalOfPages: 0
};

export const fetchFormData = createAsyncThunk(
  "form/fetchFormData",
  async ({
    slug,
    fileUid,
    pageSize,
    page,
  }: {
    slug: string | null;
    fileUid: string | null;
    pageSize: number | 50;
    page: number | 1;
  }) => {
    const response = await fetch(
      `${API_URL}/forms/docs?slug=${slug}&fileUid=${fileUid}&page=${page}&pageSize=${pageSize}`
    );
    const data = await response.json();
    return {
      values: data.message,
      total: data.totalOfPages
    };
  }
);

export const deleteFileFromForm = createAsyncThunk(
  "form/deleteFileFromForm",
  async ({ fileUid }: { fileUid: string }) => {
    const response = await fetch(
      `${API_URL}/forms/docs/file/delete?fileUid=${fileUid}`,
      {
        method: "delete",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
      }
    );
    const data = await response.json();
    return data.message;
  }
);

export const formSlice = createSlice({
  name: "form",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchFormData.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchFormData.fulfilled, (state, action) => {
        state.loading = false;
        state.message = action.payload.values;
        state.totalOfPages = action.payload.total;
        state.success = true;
      })
      .addCase(fetchFormData.rejected, (state, action) => {
        state.loading = false;
        state.success = false;
      });
  },
});

export default formSlice.reducer;
