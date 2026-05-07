
import "./index.css";
import React from "react";
import ReactDOM from "react-dom/client";
import { Provider } from "react-redux";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { store } from "./app/store";
import AppRouter from "./routes/AppRoutes";

import { registerSW } from 'virtual:pwa-register'

const queryClient = new QueryClient();
registerSW({ immediate: true })

ReactDOM.createRoot(document.getElementById("root")).render(
  <Provider store={store}>
    <QueryClientProvider client={queryClient}>
      <AppRouter />
    </QueryClientProvider>
  </Provider>
);