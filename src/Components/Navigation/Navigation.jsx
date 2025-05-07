import { Menu } from "antd";
import { useState, useEffect } from "react";
import { NavLink, useLocation } from "react-router-dom";
import { sideMenuConfig } from "../../routing";
import useAuthStore from "../../stores/AuthStore/AuthStore";
import _ from "lodash";
import "./Navigation.css";

const getHideClassValue = ({
  allowed_permisions,
  associated_permissions,
  hideInMenuInRouting,
  rootUser,
}) => {
  if (hideInMenuInRouting) {
    return hideInMenuInRouting ? "hide" : "";
  }

  if (rootUser) {
    return "";
  }

  return _.intersection(allowed_permisions, associated_permissions).length > 0
    ? ""
    : "hide";
};

const getItems = ({ permissions, rootUser, isCollapsed, purchasedModules }) => {
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
              allowed_permisions: allowed_permisions,
              associated_permissions: permissions,
              hideInMenuInRouting: hideInMenu,
              rootUser,
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
              allowed_permisions: allowed_permisions,
              associated_permissions: permissions,
              hideInMenuInRouting: hideInMenu,
              rootUser,
            }),
          };
        }

        return {
          label: isCollapsed ? <NavLink to={fullPath}>{label}</NavLink> : label,
          key: `/${fullPath}`,
          icon,
          className: getHideClassValue({
            allowed_permisions: allowed_permisions,
            associated_permissions: permissions,
            hideInMenuInRouting: hideInMenu,
            rootUser,
          }),
          children: processMenuItems(children, fullPath),
        };
      }
    );
  };

  const purchasedModulesMapper = purchasedModules.reduce(
    (acc, { module_name, submodules }) => {
      acc[module_name] = [];
      if (submodules && submodules.length) {
        submodules.forEach(({ submodule_name }) => {
          acc[module_name].push(submodule_name);
        });
      }
      return acc;
    },
    {}
  );
  const filteredSideMenuConfig = sideMenuConfig.filter((item) => {
    if (
      item.module_name &&
      item.module_name !== "USERS_ADMINISTRATION" &&
      !purchasedModulesMapper?.[item?.module_name]
    ) {
      return false;
    }

    return item;
  });
  return processMenuItems(filteredSideMenuConfig);
};

export const Navigation = ({ closeMenu, isCollapsed, onCollapse }) => {
  const { pathname } = useLocation();
  const { userData } = useAuthStore();

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
          rootUser: userData?.is_root_user,
          isCollapsed,
          purchasedModules: userData?.modules,
        })}
      />
    </div>
  );
};

export default Navigation;
