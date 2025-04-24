import { LogoutOutlined, MenuOutlined } from "@ant-design/icons";
import { Button, Col, Row } from "antd";
import _ from "lodash";
import { NavLink, matchPath, useLocation } from "react-router-dom";
import sfalogo from "../../assets/sfa-logo.png";
import { HEADER_TITLES } from "../../routing";
import "./Header.css";
import useAuthStore from "stores/AuthStore/AuthStore";
const Header = ({ handleMenuClick }) => {
  const { pathname } = useLocation();
  const { clearUser, userData } = useAuthStore();
  const handleLogout = () => {
    clearUser();
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

  return (
    <header>
      <div className="header-container">
        <Row justify={"space-between"} align={"middle"} gutter={[16]}>
          <Col xs={4} sm={12}>
            <Row>
              <Col xs={12} sm={2}>
                <NavLink className={"logo-link desktop-only"} to={"/"}>
                  <img src={sfalogo} height={50} alt="Sports For All" />
                </NavLink>
                <Button
                  type="primary"
                  className="menu-btn mobile-only"
                  onClick={handleMenuClick}
                >
                  <MenuOutlined />
                </Button>
              </Col>
              <Col xs={0} sm={20} offset={2}>
                <h1 className="page-title">{getHeaderTitle()}</h1>
              </Col>
            </Row>
          </Col>

          <Col xs={19} sm={12}>
            <Row justify={"end"} align={"middle"}>
              <Col className="user-details-section">
                <span className="outlet-name">
                  {userData?.stakeholder_type}
                </span>
                <div className="user-details">
                  {userData?.fullname} |{" "}
                  {userData?.phone_number || userData?.mobile_no}
                </div>
              </Col>

              <Col>
                <Button
                  onClick={handleLogout}
                  className="logout-button"
                  type="primary"
                  danger
                >
                  <LogoutOutlined />
                </Button>
              </Col>
            </Row>
          </Col>
        </Row>
      </div>
    </header>
  );
};

export default Header;
