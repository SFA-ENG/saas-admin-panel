import { LoadingOutlined } from "@ant-design/icons";
import { Col, Row, Spin } from "antd";

const FullPageLoader = ({
  spinning = true,
  percent = false,
  message = "Loading content ...",
  allowFullScreen = false,
  showMessage = true,
}) => {
  return (
    <Row gutter={[16]} justify="center" align="middle">
      <Col>
        <Spin
          spinning={spinning}
          percent={percent}
          fullscreen={allowFullScreen}
          size={"large"}
          indicator={<LoadingOutlined spin />}
        />
      </Col>
      {showMessage && (
        <Col>
          <span
            style={{
              fontSize: "14px",
            }}
          >
            {message}
          </span>
        </Col>
      )}
    </Row>
  );
};

export default FullPageLoader;
