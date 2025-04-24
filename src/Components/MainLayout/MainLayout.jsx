import _ from "lodash";
import { useEffect, useState } from "react";
import { matchPath, Outlet, useLocation, useNavigate } from "react-router-dom";
import Header from "../Header/Header";
import "./MainLayout.css";

import { Drawer } from "antd";
import Custom401 from "Components/401/401";
import Navigation from "Components/Navigation/Navigation";
import { userAccessTypes } from "../../commons/constants";
import { HEADER_TITLES, sideMenuConfig } from "../../routing";
import { generatePermissionToURLMapping } from "../../routing.helpers";
import useAuthStore from "stores/AuthStore/AuthStore";

const getPermissions = ({ pathname, permissions }) => {
  const urlToPermisison = generatePermissionToURLMapping({
    sideMenuConfig: sideMenuConfig,
  });

  const ROUTING_PATTRNS = Object.keys(HEADER_TITLES.headerTitles);
  for (let i = 0; i < ROUTING_PATTRNS.length; i++) {
    const element = ROUTING_PATTRNS[i];
    const match = matchPath(element, pathname);
    if (!_.isEmpty(match)) {
      const requiredPermission = urlToPermisison[match.pattern.path];
      const hasAccess = _.intersection(requiredPermission, permissions);

      // const editFlag = hasAccess.some((item) => {
      //   return item.startsWith("UPDATE");
      // });

      return {
        authzFlag: Boolean(hasAccess.length),
        // editFlag,
      };
    }
  }
  return {
    authzFlag: false,
    // editFlag: false,
  };
};

const MainLayout = () => {
  const [loading, setLoading] = useState(true);
  const [authorized, setAuthorized] = useState(false);
  const [tokenVerified, setTokenVerified] = useState(false);
  const [collapsed, setCollapsed] = useState(false);
  const { userData, token } = useAuthStore();
  const { pathname } = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    console.log(userData, token);
    if (!token) {
      navigate("/login");
    } else {
      setTokenVerified(true);
    }
    //eslint-disable-next-line
  }, [userData, token]);

  useEffect(() => {
    if (!tokenVerified || !userData) return;

    setAuthorized(false);

    function controlAcessAndEdit() {
      if (userData?.is_superadmin) {
        setAuthorized(true);
      } else if (userData?.access_type === userAccessTypes.ADMIN) {
        if (pathname !== "/user-administration/roles-permission") {
          setAuthorized(true);
        }
      } else {
        const { authzFlag } = getPermissions({
          permissions: userData.permissions,
          pathname,
        });
        setAuthorized(true);
      }
      setLoading(false);
    }

    controlAcessAndEdit();
  }, [pathname, userData, tokenVerified]);

  const handleMenuClick = () => {
    setCollapsed(true);
  };

  if (loading === true) return null;

  if (tokenVerified && !loading) {
    return (
      <section className="MainLayout">
        <Header handleMenuClick={handleMenuClick} />
        <main>
          <div className="mobile-only">
            <Drawer
              placement="left"
              onClose={() => setCollapsed(false)}
              open={collapsed}
              width={100}
              className="main-navigation-drawer"
            >
              <Navigation closeMenu={() => setCollapsed(false)} />
            </Drawer>
          </div>
          <div className="desktop-only">
            <aside>
              <Navigation closeMenu={() => setCollapsed(false)} />
            </aside>
          </div>
          <div className="main-content">
            {tokenVerified && authorized ? <Outlet /> : <Custom401 />}
            {/* {true ? <Outlet /> : <Custom401 />} */}
          </div>
        </main>
      </section>
    );
  }

  return null;
};


export default MainLayout;
