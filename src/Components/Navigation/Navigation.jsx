/* eslint-disable unused-imports/no-unused-vars */
import { Menu } from "antd";
import _ from "lodash";
import { Trophy } from "lucide-react";
import { useState } from "react";
import { NavLink, matchPath, useLocation } from "react-router-dom";
import { HEADER_TITLES, sideMenuConfig } from "../../routing";
import useAuthStore from "../../stores/AuthStore/AuthStore";
import useThemeStore from "../../stores/ThemeStore/ThemeStore";
import "./Navigation.css";

const getHideClassValue = ({
  array,
  input,
  hideInMenuInRouting,
  childpath,
  accessType,
}) => {
  if (hideInMenuInRouting) {
    return hideInMenuInRouting ? "hide" : "";
  }

  return "";

  // if (accessType === userAccessTypes.SUPER_ADMIN) return "";
  // if (accessType === userAccessTypes.ADMIN) {
  //   return childpath === "roles-permission" ? "hide" : "";
  // }
  // return _.intersection(array, input).length > 0 ? "" : "hide";
};

const getItems = ({ permissions, userType, accessType, isCollapsed }) => {
  const processMenuItems = (items, parentPath = "") => {
    return items.map(
      ({ label, path, icon, children, allowed_permisions, hideInMenu }) => {
        // Handle items without path
        if (!path && children?.length) {
          return {
            label,
            key: parentPath,
            icon,
            className: getHideClassValue({
              array: allowed_permisions,
              input: permissions,
              hideInMenuInRouting: hideInMenu,
              userType,
              accessType,
            }),
            children: processMenuItems(children, parentPath),
          };
        }

        const fullPath = parentPath ? `${parentPath}/${path}` : path;

        if (!children?.length) {
          return {
            label: <NavLink to={fullPath}>{label}</NavLink>,
            key: `/${fullPath}`,
            icon,
            className: getHideClassValue({
              array: allowed_permisions,
              input: permissions,
              hideInMenuInRouting: hideInMenu,
              userType,
              accessType,
            }),
          };
        }

        return {
          label: isCollapsed ? <NavLink to={fullPath}>{label}</NavLink> : label,
          key: `/${fullPath}`,
          icon,
          className: getHideClassValue({
            array: allowed_permisions,
            input: permissions,
            hideInMenuInRouting: hideInMenu,
            userType,
            accessType,
          }),
          children: processMenuItems(children, fullPath),
        };
      }
    );
  };

  return processMenuItems(sideMenuConfig);
};

export const Navigation = ({ closeMenu, isCollapsed, onCollapse }) => {
  const { pathname } = useLocation();
  const { userData } = useAuthStore();
  const { theme } = useThemeStore();

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
    closeMenu && closeMenu();
  };

  // No need to manually apply theme classes since we now use global CSS variables
  // and apply themes at the body level

  return (
    <div className={`Navigation ${isCollapsed ? "collapsed" : ""}`}>
      <div className="menu-logo">
        {!isCollapsed && (
          <>
            <Trophy
              size={20}
              color="var(--color-primary)"
              style={{ marginRight: "8px" }}
            />
            <span>Sports SAAS</span>
          </>
        )}
        {isCollapsed && <Trophy size={20} color="var(--color-primary)" />}
      </div>
      <Menu
        onClick={onClick}
        selectedKeys={[current]}
        mode="inline"
        inlineCollapsed={isCollapsed}
        items={getItems({
          permissions: userData?.permissions,
          userType: userData?.user_type,
          accessType: userData?.access_type,
          isCollapsed,
        })}
      />
    </div>
  );
};

export default Navigation;
