import { Col, Row, Button } from "antd";
import { useRouteError } from "react-router-dom";
import "./404.css";
import sfaLogo from "../../assets/sfa-logo.png";
export default function Custom404() {
  const error = useRouteError();

  const clearCache = () => {
    localStorage.clear();
    sessionStorage.clear();
    window.location.reload();
  };

  return (
    <div className="error-page">
      <Row
        type="flex"
        justify="center"
        align="middle"
        style={{ minHeight: "100vh" }}
      >
        <Col xs={20} sm={18} md={14} lg={7} xl={7}>
          <Row
            type="flex"
            justify="center"
            align="middle"
            style={{ marginBottom: "20px", flexDirection: "column" }}
          >
            <Col span={8}>
              <img
                onClick={() => {
                  window.location.href = "/";
                }}
                src={sfaLogo}
                alt="Sports Admin Panel"
              />
            </Col>
            <Col className="error-message-container">
              <h1>Oops!</h1>
              <p>Sorry, an unexpected error has occurred.</p>
              <p className="error">
                <strong>{error.statusText || error.message}</strong>
              </p>
            </Col>
            <Col className="error-message-container">
              <Button type="primary" onClick={clearCache}>
                Clear Cache
              </Button>
            </Col>
          </Row>
        </Col>
      </Row>
    </div>
  );
}
