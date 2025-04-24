import {
  LogoutOutlined,
  MenuFoldOutlined,
  MenuOutlined,
  MenuUnfoldOutlined,
  SettingOutlined,
  UserOutlined,
} from "@ant-design/icons";
import {
  Avatar,
  Badge,
  Button,
  Col,
  Dropdown,
  Grid,
  Image,
  Row,
  Tooltip,
} from "antd";
import _ from "lodash";
import { useState } from "react";
import { NavLink, matchPath, useLocation } from "react-router-dom";
import sfalogo from "../../assets/sfa-logo.png";
import { HEADER_TITLES } from "../../routing";
import useAuthStore from "../../stores/AuthStore/AuthStore";
import "./Header.css";
const Header = ({ handleMenuClick, isCollapsed, toggleCollapse }) => {
  const { pathname } = useLocation();
  const { clearUserData, userData } = useAuthStore();
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
          {/* <Col xs={4} sm={12}>
            <Row>
              <Col xs={12} sm={2}>
                <NavLink className={"logo-link desktop-only"} to={"/"}>
                  <img src={sfalogo} width={40} alt="Sports For All" />
                </NavLink>
                <Button
                  type="primary"
                  className="menu-btn mobile-only"
                  onClick={handleMenuClick}
                >
                  <MenuOutlined />
                </Button>
              </Col>
              {!xs && <Col
                xs={0}
                sm={20}
                offset={2}
                style={{ display: "flex", alignItems: "center" }}
              >
                <h1 className="page-title">{getHeaderTitle()}</h1>
              </Col>}
            </Row>
          </Col> */}
          <Col xs={12} sm={12}>
            <Row align="middle" justify="space-between">
              <Col xs={6} sm={1}>
                <NavLink className={"logo-link desktop-only"} to={"/"}>
                  <Image
                    src={sfalogo}
                    height={50}
                    width={50}
                    alt="Altcase"
                    preview={false}
                  />
                </NavLink>
                <Button
                  type="primary"
                  className="menu-btn mobile-only"
                  onClick={handleMenuClick}
                  icon={<MenuOutlined />}
                />
              </Col>
              <Col xs={0} sm={22}>
                <Button
                  type="primary"
                  onClick={toggleCollapse}
                  className="ml-3"
                  icon={
                    isCollapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />
                  }
                />
              </Col>
              {/* <Col xs={18} sm={18}>
                <h1 className="page-title">{getHeaderTitle()}</h1>
              </Col> */}
            </Row>
          </Col>

          <Col xs={12} sm={12}>
            <Row justify={"end"} align={"middle"} gutter={16}>
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
