import { Col, Row, Tag } from "antd";

const responsiveTable = ({ input }) => {
  const desktopColumns = input?.map((item) => ({
    ...item,
  }));

  const mobileColumn = {
    title: "",
    dataIndex: "mobile_view",
    responsive: ["xs"],
    render: (_, record) => {
      return (
        <div style={{ padding: "10px", borderBottom: "1px solid #ddd" }}>
          {input.map(({ title, dataIndex, render }) => {
            let value = record[dataIndex];

            if (dataIndex === "role_permissions" && typeof value === "string") {
              value = value.split(",");
            }

            return (
              <Row
                key={dataIndex}
                style={{
                  marginBottom: "8px",
                  display: "flex",
                  alignItems: "left",
                }}
              >
                <Col
                  span={12}
                  style={{
                    fontWeight: "bold",
                    textAlign: "left",
                    paddingRight: "12px",
                    wordSpacing: "6px",
                  }}
                >
                  {title} :
                </Col>

                <Col span={12} style={{ textAlign: "left" }}>
                  {Array.isArray(value)
                    ? value.map((perm, index) => (
                        <Tag key={index} color="blue">
                          {perm.trim()}
                        </Tag>
                      ))
                    : render
                    ? render(null, record)
                    : value || "--"}
                </Col>
              </Row>
            );
          })}
        </div>
      );
    },
  };

  return [...desktopColumns, mobileColumn];
};

export default responsiveTable;
