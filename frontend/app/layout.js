import React from "react";
import { AppRouterCacheProvider } from "@mui/material-nextjs/v15-appRouter";
import ThemeProviderClient from "../component/ThemeProviderClient";

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <AppRouterCacheProvider>
          <ThemeProviderClient>{children}</ThemeProviderClient>
        </AppRouterCacheProvider>
      </body>
    </html>
  );
}
