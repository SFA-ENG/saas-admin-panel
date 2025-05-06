import { Col, Row } from "antd";

const responsiveTable = ({ input, labelCol = 8, valueCol = 16 }) => {
  const desktopColumn = Array.isArray(input) ? input : [];

  const mobileColumn = {
    title: "",
    responsive: ["xs"],
    render: (__, item, index) => {
      return (
        <div className="p-4 bg-white rounded-lg shadow-sm">
          {desktopColumn.map(({ title, mobileTitle, render }) => {
            const applicableTitle =
              mobileTitle !== undefined ? mobileTitle : title;

            const hasTitle = true;

            return (
              <Row
                key={applicableTitle}
                className="space-y-2"
                align="middle"
              >
                {hasTitle && (
                  <Col span={labelCol} className="font-medium text-gray-600">
                    {applicableTitle}
                  </Col>
                )}
                {render && (
                  <Col span={hasTitle ? valueCol : 24} className="text-gray-800">
                    {render(__, item, index)}
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
