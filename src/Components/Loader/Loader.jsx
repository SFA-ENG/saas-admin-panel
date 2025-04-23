import { Col, Row, Spin } from "antd";

const tcaLoader = () => {
  return (
    <Row className="tcaLoader" gutter={[16]}>
      <Col>
        <Spin />
      </Col>
      <Col>
        <span
          style={{
            fontSize: "14px",
          }}
        >
          Loading content ...
        </span>
      </Col>
    </Row>
  );
};

export default tcaLoader;
