import _ from "lodash";
import { useEffect, useState } from "react";
import { matchPath, Outlet, useLocation, useNavigate } from "react-router-dom";
import Header from "../Header/Header";
import "./MainLayout.css";

import { Drawer } from "antd";
import Navigation from "Components/Navigation/Navigation";
import { jwtDecode } from "jwt-decode";
import { userAccessTypes } from "../../commons/constants";
import { withAuthContext } from "../../contexts/AuthContext/AuthContext";
import { HEADER_TITLES, sideMenuConfig } from "../../routing";
import { generatePermissionToURLMapping } from "../../routing.helpers";
import Custom401 from "Components/401/401";

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

const MainLayoutWithoutContext = ({ authContext }) => {
  const [loading, setLoading] = useState(true);
  const [authorized, setAuthorized] = useState(false);
  const [tokenVerified, setTokenVerified] = useState(false);
  const [collapsed, setCollapsed] = useState(false);
  const { userData, setUserMasterData } = authContext;
  const { pathname } = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    const userData = JSON.parse(localStorage.getItem("user_data"));
    if (!token || !userData?.mobile_no) {
      navigate("/login");
      return;
    }
    const decoded = jwtDecode(token);
    const currentTime = Math.floor(Date.now() / 1000);
    if (currentTime < decoded.exp) {
      setTokenVerified(true);
      setUserMasterData({ user_data: userData });
    } else {
      navigate("/login");
    }
    //eslint-disable-next-line
  }, []);

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
        setAuthorized(authzFlag);
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

const MainLayout = withAuthContext(MainLayoutWithoutContext);

export default MainLayout;
