import { DashboardOutlined } from "@ant-design/icons";
import Custom404 from "Components/404/404";
import Login from "Components/Login/Login";

import { Hotel } from "lucide-react";
import Hotels from "pages/HotelsPage/Hotels/Hotels";
import HotelsPage from "pages/HotelsPage/HotelsPage";
import { createBrowserRouter } from "react-router-dom";
import MainLayout from "./Components/MainLayout/MainLayout";
import WelcomePage from "./pages/WelcomePage/WelcomePage";
import { generateHeaderTitles, getPermision } from "./routing.helpers";

export const sideMenuConfig = [
  {
    label: "Welcome Page",
    path: "/",
    icon: <DashboardOutlined />,
    element: <WelcomePage />,
    hideInMenu: true,
    allowed_permisions: [...getPermision("WELCOME")],
  },
  {
    label: "Hotels",
    path: "hotels-administration",
    icon: <Hotel />,
    element: <HotelsPage />,
    allowed_permisions: [...getPermision("HOTELS")],
    children: [
      {
        label: "Hotels",
        path: "hotels",
        element: <Hotels />,
        allowed_permisions: [...getPermision("HOTELS")],
      },
    ],
  },
];

const getRoutingObject = ({ sideMenuConfig }) => {
  const filteredData = sideMenuConfig.filter(
    ({ hideInRouting }) => !hideInRouting
  );
  const routing = filteredData.map(({ path, children = [], element }) => {
    return {
      path,
      element,
      children: children.map(({ path, element, allowed_permisions }) => {
        return {
          path,
          element: allowed_permisions?.length ? (
            element
          ) : (
            <div>Not Authorised</div>
          ),
        };
      }),
    };
  });

  return routing;
};

export const routing = createBrowserRouter(
  [
    {
      path: "/",
      element: <MainLayout />,
      errorElement: <Custom404 />,
      children: getRoutingObject({ sideMenuConfig }),
    },
    {
      path: "/login",
      element: <Login />,
    },
  ],
  {
    future: {
      v7_startTransition: true,
      v7_relativeSplatPath: true,
    },
  }
);

export const HEADER_TITLES = generateHeaderTitles({ sideMenuConfig });
