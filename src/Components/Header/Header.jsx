import { LogoutOutlined, UserOutlined } from "@ant-design/icons";
import { Badge, Tooltip, Dropdown, Avatar, Col, Row } from "antd";
import _ from "lodash";
import { useState, useCallback, useMemo } from "react";
import { matchPath, useLocation } from "react-router-dom";
import { HEADER_TITLES } from "../../routing";
import useAuthStore from "../../stores/AuthStore/AuthStore";
import "./Header.css";
import { useApiMutation } from "../../hooks/useApiQuery/useApiQuery";
import { CACHE_KEYS } from "../../commons/constants";
import {
  Bell,
  Menu as MenuIcon,
  Users,
  Settings,
  HelpCircle,
  Shield,
  ChevronRight,
} from "lucide-react";

const Header = ({ toggleMobileMenu, userData, getCurrentPageTitle }) => {
  const { pathname } = useLocation();
  const { clearUserData } = useAuthStore();
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const { mutate: logout } = useApiMutation({
    queryKey: [CACHE_KEYS.LOGOUT],
    url: "/iam/logout",
    method: "POST",
    onSuccess: () => {
      clearUserData();
      window.location.href = "/login";
    },
  });

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

  // Use a stable callback function that won't change on re-renders
  const handleOpenChange = useCallback((open) => {
    setDropdownOpen(open);
  }, []);

  // Memoize the dropdown menu to prevent re-initialization
  const profileMenu = useMemo(() => {
    return {
      items: [
        {
          key: "profile",
          label: (
            <div className="profile-menu-header">
              <div className="profile-avatar">
                {userData?.profile_image ? (
                  <img src={userData.profile_image} alt={userData?.name} />
                ) : (
                  <span>{(userData?.name || "A").charAt(0)}</span>
                )}
              </div>
              <div className="profile-info">
                <div className="profile-name">{userData?.name || "User"}</div>
                <div className="profile-email">
                  {userData?.email || "user@example.com"}
                </div>
                <div className="profile-plan">
                  <Shield size={12} />
                  <span>Pro Plan</span>
                </div>
              </div>
            </div>
          ),
        },
        { key: "divider-1", type: "divider" },
        {
          key: "account",
          label: (
            <div className="profile-menu-item">
              <Users size={16} />
              <span>My Account</span>
              <ChevronRight size={14} className="menu-item-icon-right" />
            </div>
          ),
        },
        {
          key: "preferences",
          label: (
            <div className="profile-menu-item">
              <Settings size={16} />
              <span>Preferences</span>
              <ChevronRight size={14} className="menu-item-icon-right" />
            </div>
          ),
        },
        { key: "divider-2", type: "divider" },
        {
          key: "help",
          label: (
            <div className="profile-menu-item">
              <HelpCircle size={16} />
              <span>Help Center</span>
              <ChevronRight size={14} className="menu-item-icon-right" />
            </div>
          ),
        },
        { key: "divider-3", type: "divider" },
        {
          key: "logout",
          label: (
            <div className="profile-menu-item logout" onClick={() => logout()}>
              <LogoutOutlined />
              <span>Log Out</span>
            </div>
          ),
        },
      ],
    };
  }, [userData, logout]);

  return (
    <header className="sports-header">
      <div className="header-left">
        <button className="mobile-menu-toggle" onClick={toggleMobileMenu}>
          <MenuIcon size={24} />
        </button>
        <h1 className="page-title">{getCurrentPageTitle()}</h1>
        <span className="page-subtitle">
          Welcome back, {userData?.name?.split(" ")[0] || "User"}
        </span>
      </div>

      <div className="header-actions">
        <Tooltip title="Notifications">
          <button className="icon-button">
            <Badge count={3} size="small">
              <Bell size={18} />
            </Badge>
          </button>
        </Tooltip>

        <Row justify={"end"} align={"middle"} gutter={16}>
          <Col>
            <Dropdown
              menu={profileMenu}
              placement="bottomRight"
              arrow={{ pointAtCenter: true }}
              trigger={["click"]}
              open={dropdownOpen}
              onOpenChange={handleOpenChange}
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
          </Col>
        </Row>
      </div>
    </header>
  );
};

export default Header;
