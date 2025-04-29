import { DashboardOutlined } from "@ant-design/icons";
import Custom404 from "Components/404/404";
import Login from "Components/Login/Login";
import Profile from "Components/Profile/Profile";
import { createBrowserRouter } from "react-router-dom";
import MainLayout from "./Components/MainLayout/MainLayout";
import WelcomePage from "./pages/WelcomePage/WelcomePage";
import { generateHeaderTitles, getPermision } from "./routing.helpers";
import { UsersRound } from "lucide-react";
import Users from "pages/UsersAdminstration/Users";
import UsersList from "pages/UsersAdminstration/UsersManagement/UsersList";
import RolesList from "pages/UsersAdminstration/RolesManagement/RolesList";
import AssignRole from "pages/UsersAdminstration/UsersManagement/AssignRole";
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
    element: <Users />,
    allowed_permisions: [
      ...getPermision("USERS_LIST"),
      ...getPermision("ROLES_LIST"),
    ],
    children: [
      {
        label: "Users List",
        path: "users-list",
        element: <UsersList />,
        allowed_permisions: [...getPermision("USERS_LIST")],
      },
      {
        label: "Roles List",
        path: "roles-list",
        element: <RolesList />,
        allowed_permisions: [...getPermision("ROLES_LIST")],
      },
      {
        label: "Assign Role",
        path: "assign-role",
        hideInMenu: true,
        element: <AssignRole />,
        allowed_permisions: [...getPermision("ASSIGN_ROLE")],
      },
    ],
  },
  {
    label: "Profile",
    path: "profile",
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
