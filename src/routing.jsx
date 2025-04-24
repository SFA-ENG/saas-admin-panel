import {
  DashboardOutlined,
  SettingOutlined,
  UserOutlined,
} from "@ant-design/icons";
import Custom404 from "Components/404/404";
import Login from "Components/Login/Login";
import Profile from "Components/Profile/Profile";
import Settings from "Components/Settings/Settings";

import Hotels from "pages/UsersAdminstration/Hotels/Hotels";
import HotelsPage from "pages/UsersAdminstration/HotelsPage";
import { createBrowserRouter } from "react-router-dom";
import MainLayout from "./Components/MainLayout/MainLayout";
import WelcomePage from "./pages/WelcomePage/WelcomePage";
import { generateHeaderTitles, getPermision } from "./routing.helpers";
import { UsersRound } from "lucide-react";

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
    label: "Users",
    path: "users-administration",
    icon: <UsersRound />,
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
  {
    label: "Profile",
    path: "profile",
    icon: <UserOutlined />,
    element: <Profile />,
    hideInMenu: true,
    allowed_permisions: [...getPermision("PROFILE")],
  },
  {
    label: "Settings",
    path: "settings",
    icon: <SettingOutlined />,
    element: <Settings />,
    hideInMenu: true,
    allowed_permisions: [...getPermision("SETTINGS")],
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
