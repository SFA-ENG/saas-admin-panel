/* eslint-disable unused-imports/no-unused-vars */
import { Menu } from "antd";
import { useState, useEffect } from "react";
import { NavLink, useLocation } from "react-router-dom";
import { sideMenuConfig } from "../../routing";
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

  // Track both selected keys and open keys
  const [selectedKeys, setSelectedKeys] = useState([pathname]);
  const [openKeys, setOpenKeys] = useState([]);

  // Update open keys when pathname changes to ensure correct submenu expansion
  useEffect(() => {
    // Extract path segments to determine which submenus should be open
    const pathSegments = pathname.split("/").filter(Boolean);
    const newOpenKeys = [];

    // Build open keys from path segments
    let currentPath = "";
    pathSegments.forEach((segment) => {
      currentPath = currentPath ? `${currentPath}/${segment}` : segment;
      newOpenKeys.push(`/${currentPath}`);
    });

    setSelectedKeys([pathname]);
    if (!isCollapsed) {
      setOpenKeys(newOpenKeys);
    }
  }, [pathname, isCollapsed]);

  const onClick = (e) => {
    setSelectedKeys([e.key]);
    closeMenu && closeMenu();
  };

  // Handle submenu open/close
  const onOpenChange = (keys) => {
    setOpenKeys(keys);
  };

  return (
    <div className={`Navigation ${isCollapsed ? "collapsed" : ""}`}>
      <Menu
        onClick={onClick}
        selectedKeys={selectedKeys}
        openKeys={isCollapsed ? [] : openKeys}
        onOpenChange={onOpenChange}
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
