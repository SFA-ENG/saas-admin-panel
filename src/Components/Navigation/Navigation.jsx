import { Menu } from "antd";
import { useState, useEffect } from "react";
import { NavLink, useLocation } from "react-router-dom";
import { sideMenuConfig } from "../../routing";
import useAuthStore from "../../stores/AuthStore/AuthStore";
import _ from "lodash";
import { ChevronLeft, ChevronRight } from "lucide-react";
import "./Navigation.css";
import sfaLogo from "../../assets/sfa-play_logo.png";
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

  const filtered = sideMenuConfig.filter(
    (item) =>
      item.module_name === "USERS_ADMINISTRATION" || modules[item.module_name]
  );

  const mapItems = (items, parent = "") =>
    items.map(
      ({ label, path, icon, children, allowed_permisions, hideInMenu }) => {
        const full = parent ? `${parent}/${path}` : path;
        const item = {
          label: path ? <NavLink to={`/${full}`}>{label}</NavLink> : label,
          key: `/${full}`,
          icon,
          className: getHideClassValue({
            allowed_permisions,
            associated_permissions: permissions,
            hideInMenuInRouting: hideInMenu,
            rootUser,
          }),
        };
        if (children?.length) item.children = mapItems(children, full);
        return item;
      }
    );

  return mapItems(filtered);
};

export const Navigation = ({
  isCollapsed,
  onToggleSidebar,
  closeMenu,
  isMobile = false,
}) => {
  const { pathname } = useLocation();
  const { userData } = useAuthStore();
  const [selectedKeys, setSelectedKeys] = useState([pathname]);
  const [openKeys, setOpenKeys] = useState([]);

  // Sync selection & openKeys on route change
  useEffect(() => {
    setSelectedKeys([pathname]);

    if (isCollapsed) {
      // close any open submenu in collapsed mode
      setOpenKeys([]);
    } else {
      // expand parent menus in expanded mode
      const segments = pathname.split("/").filter(Boolean);
      const parents = segments
        .slice(0, -1)
        .map((_, i) => "/" + segments.slice(0, i + 1).join("/"));
      setOpenKeys(parents);
    }
  }, [pathname, isCollapsed]);

  const onOpenChange = (keys) => {
    setOpenKeys(keys);
  };

  const onClick = (e) => {
    setSelectedKeys([e.key]);
    if (closeMenu && isMobile) closeMenu();
  };

  return (
    <div className={`navbar ${isCollapsed ? "collapsed" : ""}`}>
      <div className="navbar-header">
        <div className="logo">
         <img src={sfaLogo} alt="Sports Admin Panel" />
        </div>
        <button className="toggle-btn" onClick={onToggleSidebar}>
          {isCollapsed ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
        </button>
      </div>

      <div className="navbar-menu">
        <Menu
          mode="inline"
          inlineCollapsed={isCollapsed}
          triggerSubMenuAction={isCollapsed ? "hover" : "click"}
          selectedKeys={selectedKeys}
          openKeys={openKeys}
          onOpenChange={onOpenChange}
          onClick={onClick}
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

export default Navigation;
