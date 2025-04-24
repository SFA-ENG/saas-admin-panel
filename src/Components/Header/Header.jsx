import {
  LogoutOutlined,
  MenuFoldOutlined,
  MenuOutlined,
  MenuUnfoldOutlined,
  SettingOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { Avatar, Badge, Button, Col, Dropdown, Grid, Row, Tooltip } from "antd";
import _ from "lodash";
import { Moon, Sun, Zap } from "lucide-react";
import { useState } from "react";
import { NavLink, matchPath, useLocation } from "react-router-dom";
import { HEADER_TITLES } from "../../routing";
import useAuthStore from "../../stores/AuthStore/AuthStore";
import useThemeStore from "../../stores/ThemeStore/ThemeStore";
import "./Header.css";

const Header = ({ handleMenuClick, isCollapsed, toggleCollapse }) => {
  const { pathname } = useLocation();
  const { clearUserData, userData } = useAuthStore();
  const { theme, toggleTheme } = useThemeStore();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const { xs } = Grid.useBreakpoint();

  const handleLogout = () => {
    console.log("logout");
    clearUserData();
    window.location.href = "/login";
  };

  const getHeaderTitle = () => {
    const ROUTING_PATTRNS = Object.keys(HEADER_TITLES.headerTitles);

    for (let i = 0; i < ROUTING_PATTRNS.length; i++) {
      const element = ROUTING_PATTRNS[i];
      const match = matchPath(element, pathname);
      if (!_.isEmpty(match)) {
        return HEADER_TITLES.headerTitles[match.pattern.path];
      }
    }
    return "";
  };

  const getThemeIcon = () => {
    switch (theme) {
      case "dark-theme":
        return <Moon size={16} />;
      case "sports-theme":
        return <Zap size={16} />;
      default:
        return <Sun size={16} />;
    }
  };

  const profileMenuItems = [
    {
      key: "profile",
      label: (
        <NavLink to="/profile" className="profile-dropdown-item">
          <UserOutlined /> My Profile
        </NavLink>
      ),
    },
    {
      key: "settings",
      label: (
        <NavLink to="/settings" className="profile-dropdown-item">
          <SettingOutlined /> Settings
        </NavLink>
      ),
    },
    {
      type: "divider",
    },
    {
      key: "logout",
      label: (
        <div
          onClick={handleLogout}
          className="profile-dropdown-item text-danger"
        >
          <LogoutOutlined /> Logout
        </div>
      ),
    },
  ];

  return (
    <header>
      <div className="header-container">
        <Row justify={"space-between"} align={"middle"} gutter={[16]}>
          <Col xs={12} sm={12}>
            <Row align="middle" justify="space-between">
              <Col xs={6} sm={7}>
                <NavLink className={"logo-link desktop-only"} to={"/"}>
                  <div className="text-lg font-medium text-gray-800">
                    Sports Administration
                  </div>{" "}
                </NavLink>
                <Button
                  type="primary"
                  className="menu-btn mobile-only"
                  onClick={handleMenuClick}
                  icon={<MenuOutlined />}
                />
              </Col>
              {xs && (
                <Col xs={0} sm={3}>
                  <Button
                    type="primary"
                    onClick={toggleCollapse}
                    className="ml-3"
                    icon={
                      isCollapsed ? (
                        <MenuUnfoldOutlined />
                      ) : (
                        <MenuFoldOutlined />
                      )
                    }
                  />
                </Col>
              )}
              <Col xs={18} sm={14}>
                <h1 className="page-title">{getHeaderTitle()}</h1>
              </Col>
            </Row>
          </Col>

          <Col xs={12} sm={12}>
            <Row justify={"end"} align={"middle"} gutter={16}>
              <Col>
                <Tooltip title="Change Theme" placement="bottom">
                  <div
                    className="theme-toggle"
                    onClick={toggleTheme}
                    title="Change theme"
                  >
                    {getThemeIcon()}
                  </div>
                </Tooltip>
              </Col>
              <Col>
                <Tooltip title="Profile Menu" placement="bottom">
                  <Dropdown
                    menu={{ items: profileMenuItems }}
                    placement="bottomRight"
                    arrow={{ pointAtCenter: true }}
                    trigger={["click"]}
                    onOpenChange={setDropdownOpen}
                  >
                    <div
                      className={`profile-avatar-container ${
                        dropdownOpen ? "profile-avatar-active" : ""
                      }`}
                    >
                      <Badge dot status="success" offset={[-4, 36]}>
                        <Avatar
                          size={42}
                          src={userData?.profile_image}
                          icon={!userData?.profile_image && <UserOutlined />}
                          className="profile-avatar"
                        />
                      </Badge>
                    </div>
                  </Dropdown>
                </Tooltip>
              </Col>
            </Row>
          </Col>
        </Row>
      </div>
    </header>
  );
};

export default Header;
