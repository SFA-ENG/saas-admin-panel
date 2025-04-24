import { DashboardOutlined } from "@ant-design/icons";
import Custom404 from "Components/404/404";
import Login from "Components/Login/Login";
import Profile from "Components/Profile/Profile";

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
    allowed_permisions: [...getPermision("USERS")],
    children: [
      {
        label: "Sumit",
        path: "sumit",
        element: <Hotels />,
        allowed_permisions: [...getPermision("USERS")],
        children: [
          {
            label: "1st User",
            path: "one",
            element: <h1>1st User</h1>,
            allowed_permisions: [...getPermision("USERS")],
          },
          {
            label: "2nd User",
            path: "two",
            element: <h1>2nd User</h1>,
            allowed_permisions: [...getPermision("USERS")],
          },
        ],
      },
    ],
  },
  {
    label: "Test",
    path: "test",
    icon: <UsersRound />,
    element: <Profile />,
    allowed_permisions: [...getPermision("PROFILE")],
    children: [
      {
        label: "Test1",
        path: "test1",
        element: <Profile />,
      },
    ],
  },
  {
    label: "Test2",
    path: "test2",
    icon: <UsersRound />,
    element: <Profile />,
    allowed_permisions: [...getPermision("PROFILE")],
    children: [
      {
        label: "Test3",
        path: "test3",
        element: <Profile />,
      },
    ],
  },
];

const getRoutingObject = ({ sideMenuConfig }) => {
  const filteredData = sideMenuConfig.filter(
    ({ hideInRouting }) => !hideInRouting
  );

  const processRoutes = (routes) => {
    return routes.map((route) => {
      const { path, element, children } = route;

      if (!path && !children?.length) {
        return null;
      }

      if (!children?.length) {
        return { path, element };
      }

      const processedChildren = processRoutes(children).filter(Boolean);

      return {
        path,
        element,
        children: processedChildren,
      };
    });
  };

  return processRoutes(filteredData);
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
