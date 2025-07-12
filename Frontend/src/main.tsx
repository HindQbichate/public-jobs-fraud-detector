import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import "swiper/swiper-bundle.css";
import "flatpickr/dist/flatpickr.css";
import App from "./App.tsx";
import { AppWrapper } from "./components/common/PageMeta.tsx";
import { ThemeProvider } from "./context/ThemeContext.tsx";
import { AuthProvider } from "./context/AuthContext.tsx";
import { BrowserRouter } from "react-router-dom";
import { ScrollToTop } from "./components/common/ScrollToTop"; // ✅ ici

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BrowserRouter> 
      <AuthProvider>
        <ThemeProvider>
          <AppWrapper>
            <ScrollToTop />     
            <App />
          </AppWrapper>
        </ThemeProvider>
      </AuthProvider>
    </BrowserRouter>
  </StrictMode>
);
