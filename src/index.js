import { ConfigProvider } from "antd";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import ReactDOM from "react-dom/client";
import { RouterProvider } from "react-router-dom";
import "./index.css";
import { routing } from "./routing";

// Create a client
const queryClient = new QueryClient();

ReactDOM.createRoot(document.getElementById("root")).render(
  <QueryClientProvider client={queryClient}>
    <ConfigProvider
      virtual={true}
      theme={{
        hashed: false,
        token: {
          colorPrimary: "#001b5e",
          colorLink: "#07b27a",
          marginLG: 16,
          padding: 12,
        },
      }}
    >
      <RouterProvider
        router={routing}
        future={{
          v7_startTransition: true,
          v7_relativeSplatPath: true,
        }}
      />
    </ConfigProvider>
  </QueryClientProvider>
);
