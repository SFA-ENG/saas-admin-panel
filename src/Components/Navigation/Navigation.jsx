/* eslint-disable no-unreachable */
import { Menu } from "antd";
import _ from "lodash";
import { useState } from "react";
import { NavLink, matchPath, useLocation } from "react-router-dom";
import { HEADER_TITLES, sideMenuConfig } from "../../routing";
import "./Navigation.css";
import useAuthStore from "stores/AuthStore/AuthStore";

const getHideClassValue = ({
  array,
  input,
  hideInMenuInRouting,
  childpath,
  accessType,
  is_superadmin,
}) => {
  if (hideInMenuInRouting) {
    return hideInMenuInRouting ? "hide" : "";
  }

  return ""


  if (is_superadmin) return "";

  if (accessType === "SUPER_ADMIN") return "";   //TODO: Remove this
  if (accessType === "ADMIN") {
    return childpath === "roles-permission" ? "hide" : "";  //TODO: Remove this
  }
  return _.intersection(array, input).length > 0 ? "" : "hide";
};

const getItems = ({ permissions, userType, accessType, is_superadmin }) => {
  const routing = sideMenuConfig.map(
    ({ label, path, icon, children, allowed_permisions, hideInMenu }) => {
      if (!children) {
        return {
          label: <NavLink to={path}>{label}</NavLink>,
          key: `/${path}`,
          icon: icon,
          className: getHideClassValue({
            array: allowed_permisions,
            input: permissions,
            hideInMenuInRouting: hideInMenu,
            userType,
            accessType,
            is_superadmin,
          }),
        };
      } else {
        return {
          label,
          key: `/${path}`,
          icon: icon,
          className: getHideClassValue({
            array: allowed_permisions,
            input: permissions,
            hideInMenuInRouting: hideInMenu,
            userType,
            path,
            accessType,
            is_superadmin,
          }),
          children: children.map(
            ({ label, path: childpath, allowed_permisions, hideInMenu }) => {
              return {
                label: <NavLink to={`${path}/${childpath}`}>{label}</NavLink>,
                key: `/${path}/${childpath}`,
                className: getHideClassValue({
                  array: allowed_permisions,
                  input: permissions,
                  hideInMenuInRouting: hideInMenu,
                  userType,
                  childpath,
                  accessType,
                  is_superadmin,
                }),
              };
            }
          ),
        };
      }
    }
  );

  return routing;
};

const Navigation = ({ closeMenu }) => {
  const { pathname } = useLocation();
  const { userData } = useAuthStore();

  const getHeaderTitle = () => {
    const ROUTING_PATTRNS = Object.keys(HEADER_TITLES.headerTitles);

    for (let i = 0; i < ROUTING_PATTRNS.length; i++) {
      const element = ROUTING_PATTRNS[i];
      const match = matchPath(element, pathname);
      if (!_.isEmpty(match)) {
        return match.pattern.path;
      }
    }
    return "";
  };

  const [current, setCurrent] = useState(getHeaderTitle());
  const onClick = (e) => {
    setCurrent(e.key);
    closeMenu();
  };

  return (
    <div className="Navigation">
      <Menu
        onClick={onClick}
        selectedKeys={[current]}
        mode="inline"
        inlineCollapsed={true}
        items={getItems({
          permissions: userData?.permissions,
          userType: userData?.user_type,
          accessType: userData?.access_type,
          is_superadmin: userData?.is_superadmin,
        })}
      />
    </div>
  );
};

export default Navigation;
