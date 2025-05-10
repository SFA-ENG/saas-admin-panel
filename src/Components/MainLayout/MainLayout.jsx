import { useEffect, useState, useMemo } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { Drawer } from "antd";
import Custom401 from "../401/401";
import useAuthStore from "../../stores/AuthStore/AuthStore";
import { HEADER_TITLES, sideMenuConfig } from "../../routing";
import { matchPath } from "react-router-dom";
import _ from "lodash";
import { generatePermissionToURLMapping } from "../../routing.helpers";
import "./MainLayout.css";
import Navigation from "../Navigation/Navigation";
import Header from "../Header/Header";

const MainLayout = () => {
  const navigate = useNavigate();
  const pathname = window.location.pathname;
  const [isAuthorized, setAuthorized] = useState(true);
  const [loading, setLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [mobileMenuVisible, setMobileMenuVisible] = useState(false);
  const { userData, token, clearUserData } = useAuthStore();

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
        const { allowed_permisions, is_public_route } =
          urlToPermissionMapping[match.pattern.path];
        if (is_public_route) {
          return {
            authzFlag: true,
          };
        }
        const hasAccess = _.intersection(allowed_permisions, permissions);
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token, userData]);

  useEffect(() => {
    function controlAccessAndEdit() {
      setLoading(true);
      if (userData?.is_root_user) {
        setAuthorized(true);
      } else {
        const { authzFlag } = checkPermissions({
          permissions: userData?.permissions,
          pathname,
        });
        setAuthorized(authzFlag);
      }
      setLoading(false);
    }

    controlAccessAndEdit();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname, userData, loading, urlToPermissionMapping]);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const toggleMobileMenu = () => {
    setMobileMenuVisible(!mobileMenuVisible);
  };

  const handleMobileMenuClose = () => {
    setMobileMenuVisible(false);
  };

  // Get current page title
  const getCurrentPageTitle = () => {
    const ROUTING_PATTRNS = Object.keys(HEADER_TITLES.headerTitles);
    for (let i = 0; i < ROUTING_PATTRNS.length; i++) {
      const element = ROUTING_PATTRNS[i];
      const match = matchPath(element, pathname);
      if (!_.isEmpty(match)) {
        return HEADER_TITLES.headerTitles[match.pattern.path];
      }
    }
    return "Dashboard";
  };

  if (loading === true) return null;

  if (!loading) {
    return (
      <div className="sports-dashboard">
        {/* Desktop Sidebar */}
        <aside
          className={`sports-sidebar desktop-sidebar ${
            sidebarOpen ? "expanded" : "collapsed"
          }`}
        >
          <Navigation
            isCollapsed={!sidebarOpen}
            onToggleSidebar={toggleSidebar}
            closeMenu={() => {}}
          />
        </aside>

        {/* Mobile Menu Drawer */}
        <Drawer
          placement="left"
          open={mobileMenuVisible}
          onClose={handleMobileMenuClose}
          width={280}
          className="mobile-sidebar-drawer"
          closeIcon={null}
          styles={{
            body: {
              padding: 0,
              background: `linear-gradient(135deg, var(--sports-primary), var(--sports-primary-dark))`,
            },
          }}
        >
          <Navigation
            isCollapsed={false}
            onToggleSidebar={handleMobileMenuClose}
            closeMenu={handleMobileMenuClose}
            isMobile={true}
          />
        </Drawer>

        {/* Main Content Area */}
        <main className="sports-main">
          {/* Top Header */}
          <Header
            toggleMobileMenu={toggleMobileMenu}
            userData={userData}
            getCurrentPageTitle={getCurrentPageTitle}
          />

          {/* Content Area */}
          <div className="content-area">
            {isAuthorized ? <Outlet /> : <Custom401 />}
          </div>
        </main>
      </div>
    );
  }

  return null;
};

export default MainLayout;
