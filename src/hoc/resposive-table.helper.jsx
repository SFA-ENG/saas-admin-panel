import { Col, Row } from "antd";

const responsiveTable = ({ input, labelCol = 8, valueCol = 16 }) => {
  const desktopColumn = input?.map((item) => {
    return {
      ...item,
    };
  });

  const mobileColumn = {
    title: "",
    responsive: ["xs"],
    render: (__, item, index) => {
      return (
        <div>
          {input?.map(({ title, mobileTitle, render: desktopRender }) => {
            const applicableTitle =
              mobileTitle !== undefined ? mobileTitle : title;

            const hasTitle = true;

            return (
              <Row
                key={applicableTitle}
                style={{
                  marginBottom: "6px",
                }}
              >
                {hasTitle && (
                  <Col span={labelCol - 1}>
                    <strong>{applicableTitle}</strong>
                  </Col>
                )}
                {hasTitle && <Col span={1}>:</Col>}
                {desktopRender && (
                  <Col span={hasTitle ? valueCol : 24}>
                    {desktopRender(__, item, index)}
                  </Col>
                )}
              </Row>
            );
          })}
        </div>
      );
    },
  };

  return [...desktopColumn, mobileColumn];
};

export default responsiveTable;
