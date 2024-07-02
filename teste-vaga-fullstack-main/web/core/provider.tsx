"use client";

import { PropsWithChildren } from "react";

import ReduxProvider from "./redux";

export default function CoreProvider({ children }: PropsWithChildren<any>) {
  return <ReduxProvider>{children}</ReduxProvider>;
}
