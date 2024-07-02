import { configureStore } from "@reduxjs/toolkit";
import { useDispatch } from 'react-redux';

// reducers
import dossierReducer from "./dossiers/main";
import formReducer from "./forms/main";
import logReducer from "./logs/main";
import startImport from "./forms/imports/start";
import basicStatsReducer from "./forms/imports/stats";
import polarGraphReducer from "./forms/imports/graphs/polar";

const store = configureStore({
  reducer: {
    dossier: dossierReducer,
    form: formReducer,
    log: logReducer,
    // misc
    startImport: startImport,
    basicStats: basicStatsReducer,
    polarGraph: polarGraphReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export const useAppDispatch = () => useDispatch<AppDispatch>();
export default store;
