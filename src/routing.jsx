import { DashboardOutlined, UsergroupAddOutlined } from "@ant-design/icons";
import Custom404 from "Components/404/404";
import Login from "Components/Login/Login";

import { Hotel } from "lucide-react";
import BulkHotelsRegistrationPage from "pages/HotelsPage/BulkHotelsUploadPage/BulkHotelsRegistrationPage";
import HotelDetailsPage from "pages/HotelsPage/HotelDetailsPage/HotelDetailsPage";
import Hotels from "pages/HotelsPage/Hotels/Hotels";
import HotelsPage from "pages/HotelsPage/HotelsPage";
import AdminSloPage from "pages/StakeHolderAdminstrationPage/AdminSloPage/AdminSloPage";
import StakeHolderRegistrationPage from "pages/StakeHolderAdminstrationPage/BulkUploadPage/StakeHolderRegistrations/StakeHolderRegistrationPage";
import ResetPasswordPage from "pages/StakeHolderAdminstrationPage/ResetPasswordPage/ResetPasswordPage";
import RolesAndPermissionPage from "pages/StakeHolderAdminstrationPage/RolesAndPermissionPage/RolesAndPermisssionPage";
import UserAdministrationPage from "pages/StakeHolderAdminstrationPage/UserAdministrationPage";
import AssignRolesPage from "pages/StakeHolderAdminstrationPage/Userpage/AssignRolesPage";
import Userpage from "pages/StakeHolderAdminstrationPage/Userpage/Userpage";
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
      {
        label: "Hotels Registration",
        path: "hotels-registration",
        element: <BulkHotelsRegistrationPage />,
        allowed_permisions: [...getPermision("HOTELS_REGISTRATION")],
      },
      {
        label: "Hotel Details",
        path: "hotel-details/:id",
        element: <HotelDetailsPage />,
        hideInMenu: true,
        allowed_permisions: [...getPermision("HOTELS")],
      },
    ],
  },
  {
    label: "Stake Holders",
    path: "stakeholder-administration",
    icon: <UsergroupAddOutlined />,
    element: <UserAdministrationPage />,
    allowed_permisions: [
      ...getPermision("STAKEHOLDERS"),
      ...getPermision("ADMIN_SLO"),
      ...getPermision("STAKEHOLDERS_REGISTRATION"),
      ...getPermision("RESET_PASSWORD"),
      ...getPermision("ROLES_ASSIGNMENT"),
      ...getPermision("ROLES_PERMISSIONS"),
    ],
    children: [
      {
        label: "Stake Holders",
        path: "stakeholder",
        element: <Userpage />,
        allowed_permisions: [...getPermision("STAKEHOLDERS")],
      },
      {
        label: "Admin SLO",
        path: "admin-slo",
        element: <AdminSloPage />,
        allowed_permisions: [...getPermision("ADMIN_SLO")],
      },
      {
        label: "Stake Holder Registration",
        path: "stake-holder-registration",
        element: <StakeHolderRegistrationPage />,
        allowed_permisions: [...getPermision("STAKEHOLDERS_REGISTRATION")],
      },
      {
        label: "Reset Password",
        path: "reset-password",
        element: <ResetPasswordPage />,
        allowed_permisions: [...getPermision("RESET_PASSWORD")],
      },
      {
        label: "Roles and Permissions",
        path: "roles-permission",
        element: <RolesAndPermissionPage />,
        allowed_permisions: [...getPermision("ROLES_PERMISSIONS")],
      },
      {
        label: "User Role Assign",
        path: "assign-roles/:id",
        element: <AssignRolesPage />,
        hideInMenu: true,
        allowed_permisions: [...getPermision("ROLES_ASSIGNMENT")],
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
