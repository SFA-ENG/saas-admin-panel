import { useEffect, useState, useMemo } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import Custom401 from "../401/401";
import Header from "../Header/Header";
import "./MainLayout.css";
import { Drawer } from "antd";
import Navigation from "Components/Navigation/Navigation";
import useAuthStore from "../../stores/AuthStore/AuthStore";
import { HEADER_TITLES, sideMenuConfig } from "../../routing";
import { matchPath } from "react-router-dom";
import _ from "lodash";
import { generatePermissionToURLMapping } from "../../routing.helpers";

const MainLayout = () => {
  const navigate = useNavigate();
  const pathname = window.location.pathname;
  const [collapsed, setCollapsed] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [isAuthorized, setAuthorized] = useState(true);
  const [loading, setLoading] = useState(false);
  const { userData, token } = useAuthStore();

  // Memoize the permission mapping
  const urlToPermissionMapping = useMemo(() => {
    return generatePermissionToURLMapping({
      sideMenuConfig: sideMenuConfig,
    });
  }, []);

  const checkPermissions = ({ pathname, permissions }) => {
    const ROUTING_PATTRNS = Object.keys(HEADER_TITLES.headerTitles);
    for (let i = 0; i < ROUTING_PATTRNS.length; i++) {
      const element = ROUTING_PATTRNS[i];
      const match = matchPath(element, pathname);
      if (!_.isEmpty(match)) {
        const requiredPermission = urlToPermissionMapping[match.pattern.path];
        const hasAccess = _.intersection(requiredPermission, permissions);
        return {
          authzFlag: Boolean(hasAccess.length),
        };
      }
    }
    return {
      authzFlag: false,
    };
  };

  useEffect(() => {
    if (!token || !userData?.tenant_user_id) {
      navigate("/login");
      return;
    }
  }, [navigate, token, userData?.tenant_user_id]);

  useEffect(() => {
    if (loading) return;
    function controlAcessAndEdit() {
      setLoading(true);
      if (userData?.is_root_user) {
        setAuthorized(true);
      } else {
        const { authzFlag } = checkPermissions({
          permissions: userData.permissions,
          pathname,
        });
        setAuthorized(authzFlag);
      }
      setLoading(false);
    }

    controlAcessAndEdit();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname, userData, loading, urlToPermissionMapping]);

  const toggleCollapse = () => {
    setCollapsed(!collapsed);
  };

  const handleMenuClick = () => {
    setDrawerOpen(true);
  };

  if (loading === true) return null;

  if (!loading) {
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
            {isAuthorized ? <Outlet /> : <Custom401 />}
          </div>
        </main>
      </section>
    );
  }

  return null;
};

export default MainLayout;
