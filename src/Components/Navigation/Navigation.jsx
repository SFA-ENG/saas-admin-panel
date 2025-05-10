import { Menu } from "antd";
import { useState, useEffect, useRef } from "react";
import { NavLink, useLocation } from "react-router-dom";
import { sideMenuConfig } from "../../routing";
import useAuthStore from "../../stores/AuthStore/AuthStore";
import _ from "lodash";
import { ChevronRight } from "lucide-react";
import "./Navigation.css";

const getHideClassValue = ({
  allowed_permisions,
  associated_permissions,
  hideInMenuInRouting,
  rootUser,
}) => {
  if (hideInMenuInRouting) return "hide";
  if (rootUser) return "";
  return _.intersection(allowed_permisions, associated_permissions).length > 0
    ? ""
    : "hide";
};

const getMenuItems = ({ permissions, rootUser, purchasedModules }) => {
  const modules =
    purchasedModules?.reduce((acc, { module_name, submodules }) => {
      acc[module_name] = submodules?.map((s) => s.submodule_name) || [];
      return acc;
    }, {}) || {};

  const filteredMenu = sideMenuConfig.filter(
    (item) =>
      item.module_name === "USERS_ADMINISTRATION" || modules[item.module_name]
  );

  const mapItems = (items, parentPath = "") =>
    items.map(
      ({ label, path, icon, children, allowed_permisions, hideInMenu }) => {
        const fullPath = parentPath ? `${parentPath}/${path}` : path;

        const item = {
          label: path ? <NavLink to={`/${fullPath}`}>{label}</NavLink> : label,
          key: `/${fullPath}`,
          icon,
          className: getHideClassValue({
            allowed_permisions,
            associated_permissions: permissions,
            hideInMenuInRouting: hideInMenu,
            rootUser,
          }),
        };

        if (children?.length) {
          item.children = mapItems(children, fullPath);
        }

        return item;
      }
    );

  return mapItems(filteredMenu);
};

const Navbar = ({
  isCollapsed,
  onToggleSidebar,
  closeMenu,
  isMobile = false,
}) => {
  const { pathname } = useLocation();
  const { userData } = useAuthStore();
  const [selectedKeys, setSelectedKeys] = useState([pathname]);
  const menuRef = useRef();

  useEffect(() => {
    setSelectedKeys([pathname]);

    // Close all open submenus in collapsed mode after navigation
    if (isCollapsed) {
      const openMenus = document.querySelectorAll(".ant-menu-submenu-popup");
      openMenus.forEach((menu) => (menu.style.display = "none"));
    }
  }, [pathname, isCollapsed]);

  const handleMenuClick = (e) => {
    setSelectedKeys([e.key]);
    if (closeMenu && isMobile) closeMenu();
  };

  return (
    <div className={`navbar ${isCollapsed ? "collapsed" : ""}`}>
      <div className="navbar-header">
        <div className="logo">
          <div className="logo-icon">SFA</div>
          {!isCollapsed && <div className="logo-text">SPORTS ADMIN</div>}
        </div>
        <button className="toggle-btn" onClick={onToggleSidebar}>
          <ChevronRight size={20} />
        </button>
      </div>

      <div className="navbar-menu" ref={menuRef}>
        <Menu
          mode="inline"
          inlineCollapsed={isCollapsed}
          selectedKeys={selectedKeys}
          onClick={handleMenuClick}
          items={getMenuItems({
            permissions: userData?.permissions,
            rootUser: userData?.is_root_user,
            purchasedModules: userData?.modules,
          })}
          className="navbar-ant-menu"
        />
      </div>
    </div>
  );
};

export default Navbar;
