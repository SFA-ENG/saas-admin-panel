import ReactDOM from "react-dom/client";
import "./index.css";
import { ConfigProvider } from "antd";
import { routing } from "./routing";
import { RouterProvider } from "react-router-dom";
import { AuthContextProvider } from "contexts/AuthContext/AuthContext";

ReactDOM.createRoot(document.getElementById("root")).render(
  <ConfigProvider
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
    <AuthContextProvider>
      <RouterProvider
        router={routing}
        future={{
          v7_startTransition: true,
          v7_relativeSplatPath: true,
        }}
      />
    </AuthContextProvider>
  </ConfigProvider>
);
