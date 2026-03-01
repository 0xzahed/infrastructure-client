import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { RouterProvider } from "react-router/dom";
import { Toaster } from "react-hot-toast";
import "./index.css";
import App from "./App.jsx";
import { router } from "./Routes/Router.jsx";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { AuthProvider } from "./Context/AuthContext.jsx";

const queryClient = new QueryClient();

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <AuthProvider>
      <QueryClientProvider client={queryClient}>
        <Toaster
          position="top-center"
          gutter={12}
          containerStyle={{ top: 80 }}
          toastOptions={{
            duration: 3500,
            style: {
              borderRadius: "10px",
              background: "#1f2937",
              color: "#f9fafb",
              fontSize: "14px",
              fontWeight: "500",
              maxWidth: "380px",
              padding: "12px 18px",
              boxShadow:
                "0 10px 15px -3px rgba(0,0,0,0.2), 0 4px 6px -2px rgba(0,0,0,0.1)",
            },
            success: {
              iconTheme: { primary: "#22c55e", secondary: "#fff" },
              style: {
                borderRadius: "10px",
                background: "#f0fdf4",
                color: "#166534",
                border: "1px solid #bbf7d0",
                fontSize: "14px",
                fontWeight: "500",
                maxWidth: "380px",
                padding: "12px 18px",
                boxShadow:
                  "0 10px 15px -3px rgba(34,197,94,0.15), 0 4px 6px -2px rgba(34,197,94,0.1)",
              },
            },
            error: {
              iconTheme: { primary: "#ef4444", secondary: "#fff" },
              style: {
                borderRadius: "10px",
                background: "#fef2f2",
                color: "#991b1b",
                border: "1px solid #fecaca",
                fontSize: "14px",
                fontWeight: "500",
                maxWidth: "380px",
                padding: "12px 18px",
                boxShadow:
                  "0 10px 15px -3px rgba(239,68,68,0.15), 0 4px 6px -2px rgba(239,68,68,0.1)",
              },
            },
          }}
        />
        <RouterProvider router={router} />
      </QueryClientProvider>
    </AuthProvider>
  </StrictMode>
);
