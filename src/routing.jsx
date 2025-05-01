import { DashboardOutlined } from "@ant-design/icons";
import Custom404 from "Components/404/404";
import Login from "Components/Login/Login";
import Profile from "Components/Profile/Profile";
import { createBrowserRouter } from "react-router-dom";
import MainLayout from "./Components/MainLayout/MainLayout";
import WelcomePage from "./pages/WelcomePage/WelcomePage";
import { generateHeaderTitles, getPermision } from "./routing.helpers";
import {
  CalendarClock,
  Dribbble,
  LockKeyholeOpen,
  Network,
  ShieldCheck,
  TrophyIcon,
  UserPlus,
  UsersRound,
} from "lucide-react";
import Users from "pages/UsersAdminstration/Users";
import UsersList from "pages/UsersAdminstration/UsersManagement/UsersList";
import RolesList from "pages/UsersAdminstration/RolesManagement/RolesList";
import AssignRole from "pages/UsersAdminstration/UsersManagement/AssignRole";
import ResetPassword from "pages/UsersAdminstration/ResetPassword/ResetPassword";
import TmsPage from "pages/Tms/Tms";
import TournamentsPage from "pages/Tms/Tournaments/Tournaments";
import DrawsPage from "pages/Tms/Draws/Draws";
import SchedulesPage from "pages/Tms/Schedules/Schedules";
import TournamentDetailsPage from "pages/Tms/Tournaments/TournamentDetails/TournamentDetails";
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
    icon: <UsersRound size={18} />,
    element: <Users />,
    allowed_permisions: [
      ...getPermision("USERS_LIST"),
      ...getPermision("ROLES_LIST"),
      ...getPermision("RESET_PASSWORD"),
      ...getPermision("ASSIGN_ROLE"),
    ],
    children: [
      {
        label: "Users List",
        path: "users-list",
        icon: <UserPlus size={18} />,
        element: <UsersList />,
        allowed_permisions: [...getPermision("USERS_LIST")],
      },
      {
        label: "Roles List",
        path: "roles-list",
        icon: <ShieldCheck size={18} />,
        element: <RolesList />,
        allowed_permisions: [...getPermision("ROLES_LIST")],
      },
      {
        label: "Reset Password",
        path: "reset-password",
        icon: <LockKeyholeOpen size={18} />,
        element: <ResetPassword />,
        allowed_permisions: [...getPermision("RESET_PASSWORD")],
      },
      {
        label: "Assign Role",
        path: "assign-role/:tenant_user_id",
        hideInMenu: true,
        element: <AssignRole />,
        allowed_permisions: [...getPermision("ASSIGN_ROLE")],
      },
    ],
  },
  {
    label: "TMS",
    path: "tms",
    element: <TmsPage />,
    icon: <TrophyIcon size={18} />,
    allowed_permisions: [
      ...getPermision("TOURNAMENTS", true),
      ...getPermision("DRAWS"),
      ...getPermision("SCHEDULES", true),
    ],
    children: [
      {
        label: "Tournaments",
        path: "tournaments",
        icon: <Dribbble size={18} />,
        element: <TournamentsPage />,
        allowed_permisions: [...getPermision("TOURNAMENTS", true)],
      },
      {
        label: "Tournament Details",
        path: "tournaments/:tournament_id",
        hideInMenu: true,
        element: <TournamentDetailsPage />,
        allowed_permisions: [...getPermision("TOURNAMENTS", true)],
      },

      {
        label: "Draws",
        path: "draws",
        icon: <Network size={18} />,
        element: <DrawsPage />,
        allowed_permisions: [...getPermision("DRAWS")],
      },
      {
        label: "Schedules",
        path: "schedules",
        icon: <CalendarClock size={18} />,
        element: <SchedulesPage />,
        allowed_permisions: [...getPermision("SCHEDULES", true)],
      },
    ],
  },
  {
    label: "Profile",
    path: "profile",
    element: <Profile />,
    hideInMenu: true,
    allowed_permisions: [...getPermision("PROFILE")],
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
