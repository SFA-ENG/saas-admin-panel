import { useEffect, useState } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import Custom401 from "../401/401";
import Header from "../Header/Header";
import "./MainLayout.css";
import { Drawer } from "antd";
import Navigation from "Components/Navigation/Navigation";
import useAuthStore from "../../stores/AuthStore/AuthStore";

// const getPermissions = ({ pathname, permissions }) => {
//   const urlToPermisison = generatePermissionToURLMapping({
//     sideMenuConfig: sideMenuConfig,
//   });

//   const ROUTING_PATTRNS = Object.keys(HEADER_TITLES.headerTitles);
//   for (let i = 0; i < ROUTING_PATTRNS.length; i++) {
//     const element = ROUTING_PATTRNS[i];
//     const match = matchPath(element, pathname);
//     if (!_.isEmpty(match)) {
//       const requiredPermission = urlToPermisison[match.pattern.path];
//       const hasAccess = _.intersection(requiredPermission, permissions);

//       // const editFlag = hasAccess.some((item) => {
//       //   return item.startsWith("UPDATE");
//       // });

//       return {
//         authzFlag: Boolean(hasAccess.length),
//         // editFlag,
//       };
//     }
//   }
//   return {
//     authzFlag: false,
//     // editFlag: false,
//   };
// };

const MainLayout = () => {
  const navigate = useNavigate();
  // const pathname = window.location.pathname;
  const [collapsed, setCollapsed] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [isTokenVerified, setTokenVerified] = useState(true);
  const [isAuthorized, setAuthorized] = useState(true);
  const [loading, setLoading] = useState(false);
  const { userData, token } = useAuthStore();

  useEffect(() => {
    setLoading(true);
    if (!token || !userData?.tenant_user_id) {
      navigate("/login");
      return;
    }
    setLoading(false);
  }, [navigate, token, userData?.tenant_user_id]);

  // useEffect(() => {
  //   if (loading) return;
  //   setAuthorized(true);
  //   setLoading(false);
  //   // function controlAcessAndEdit() {
  //   //   setLoading(true);
  //   //   if (userData?.access_type === userAccessTypes.SUPER_ADMIN) {
  //   //     setAuthorized(true);
  //   //   } else if (userData?.access_type === userAccessTypes.ADMIN) {
  //   //     if (pathname !== "/user-administration/roles-permission") {
  //   //       setAuthorized(true);
  //   //     }
  //   //   } else {
  //   //     const { authzFlag } = getPermissions({
  //   //       permissions: userData.permissions,
  //   //       pathname,
  //   //     });
  //   //     setAuthorized(authzFlag);
  //   //   }
  //   //   setLoading(null);
  //   // }

  //   // controlAcessAndEdit();
  // }, [pathname, userData, loading]);

  const toggleCollapse = () => {
    setCollapsed(!collapsed);
  };

  const handleMenuClick = () => {
    setDrawerOpen(true);
  };

  if (loading === true) return null;

  if (isTokenVerified && !loading) {
    return (
      <section className="MainLayout">
        <Header
          handleMenuClick={handleMenuClick}
          isCollapsed={collapsed}
          toggleCollapse={toggleCollapse}
        />
        <main>
          <div className="mobile-only">
            <Drawer
              placement="left"
              onClose={() => setDrawerOpen(false)}
              open={drawerOpen}
              width={280}
              className="main-navigation-drawer"
            >
              <Navigation
                closeMenu={() => setDrawerOpen(false)}
                isCollapsed={false}
              />
            </Drawer>
          </div>
          <div className="desktop-only">
            <aside className={collapsed ? "collapsed" : ""}>
              <Navigation
                closeMenu={() => setDrawerOpen(false)}
                isCollapsed={collapsed}
              />
            </aside>
          </div>
          <div
            className={`main-content ${collapsed ? "content-collapsed" : ""}`}
          >
            {isTokenVerified && isAuthorized ? <Outlet /> : <Custom401 />}
          </div>
        </main>
      </section>
    );
  }

  return null;
};

export default MainLayout;
