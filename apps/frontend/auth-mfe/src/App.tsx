import { lazy, Suspense } from "react";
import { BrowserRouter } from "react-router-dom";
import { AppRoutes } from "@/app/routes/AppRoutes";

const RemoteThemeProvider = lazy(() =>
  import("theme_mfe/ThemeProvider").then((module) => ({
    default: module.ThemeProvider,
  })),
);

function App() {
  return (
    <Suspense
      fallback={<div style={{ padding: "1rem" }}>Loading theme runtime...</div>}
    >
      <RemoteThemeProvider>
        <BrowserRouter>
          <AppRoutes />
        </BrowserRouter>
      </RemoteThemeProvider>
    </Suspense>
  );
}

export default App;
