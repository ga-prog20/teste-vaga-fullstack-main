import type { Metadata } from "next";
import React from "react";
import { AntdRegistry } from "@ant-design/nextjs-registry";

// providers
import CoreProvider from "@/core/provider";

export const metadata: Metadata = {
  title: "Kroonos - File import",
  description: "Simplified method for importing your CSV data.",
};

const RootLayout = ({ children }: React.PropsWithChildren) => (
  <html lang="pt-BR">
    <body>
      <CoreProvider>
        <AntdRegistry>{children}</AntdRegistry>
      </CoreProvider>
    </body>
  </html>
);

export default RootLayout;
