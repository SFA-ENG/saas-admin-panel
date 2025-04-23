import { EnvironmentOutlined, PhoneOutlined } from "@ant-design/icons";
import {
  Button,
  Card,
  Col,
  Descriptions,
  Row,
  Space,
  Spin,
  Table,
  Tag,
  Typography,
} from "antd";
import dayjs from "dayjs";
import { renderErrorNotifications } from "helpers/error.helpers";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getHotelDetailsById } from "../Hotels.service";

const { Title } = Typography;

const HotelDetailsPage = () => {
  const [loading, setLoading] = useState(true);
  const [hotelData, setHotelData] = useState(null);
  const { id } = useParams();
  const navigate = useNavigate();

  const openInGoogleMaps = (map_location) => {
    window.open(map_location, "_blank");
  };

  const fetchHotelDetails = async () => {
    try {
      const { data, errors } = await getHotelDetailsById({ id });
      if (!errors.length) {
        // Transform dates in hotel_details before setting state
        const transformedData = {
          ...data.data,
          hotel_details: data.data.hotel_details.map((detail) => ({
            ...detail,
            start_date: detail.start_date ? dayjs(detail.start_date) : null,
            end_date: detail.end_date ? dayjs(detail.end_date) : null,
            created_at: detail.created_at ? dayjs(detail.created_at) : null,
            updated_at: detail.updated_at ? dayjs(detail.updated_at) : null,
          })),
        };
        setHotelData(transformedData);
      } else {
        renderErrorNotifications("Hotel Details Not Found");
      }
    } catch (error) {
      console.error("Error fetching hotel details:", error);
      renderErrorNotifications(
        error?.message || "Error fetching hotel details"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHotelDetails();
    // eslint-disable-next-line
  }, [id]);

  const inventoryColumns = [
    {
      title: "Room Type",
      key: "room_type",
      align: "center",
      render: (record) => (
        <Tag color="blue">
          {record.type_of_room} - {record.type_of_occupancy}
        </Tag>
      ),
    },
    {
      title: "No. of Rooms",
      dataIndex: "number_of_rooms",
      key: "number_of_rooms",
      align: "center",
      render: (rooms) => <Tag color="green">{rooms}</Tag>,
    },
    {
      title: "Availability Period",
      key: "period",
      align: "center",
      render: (record) => {
        const startDate = record.start_date
          ? record.start_date.format("DD MMM YYYY")
          : "-";
        const endDate = record.end_date
          ? record.end_date.format("DD MMM YYYY")
          : "-";
        return (
          <span>
            {startDate} - {endDate}
          </span>
        );
      },
    },
  ];

  if (loading) {
    return (
      <div style={{ textAlign: "center", padding: "50px" }}>
        <Spin size="large" />
      </div>
    );
  }

  return (
    <div>
      <Row gutter={[16, 16]}>
        <Col span={24}>
          <Button
            type="primary"
            onClick={() => navigate("/hotels-administration/hotels")}
          >
            Back to Hotels
          </Button>
        </Col>

        <Col span={24}>
          <Card
            bordered={false}
            style={{
              background:
                "linear-gradient(135deg, #1890ff0a 0%, #1890ff1a 100%)",
              boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
            }}
          >
            <Row gutter={[16, 16]}>
              <Col span={24}>
                <Title level={2} style={{ margin: 0, color: "#1890ff" }}>
                  {hotelData?.hotel?.name}
                </Title>
              </Col>

              <Col span={24}>
                <Row gutter={[16, 16]}>
                  <Col xs={24} md={12}>
                    <Card
                      size="small"
                      title="Contact Information"
                      bordered={false}
                      style={{ height: "100%" }}
                    >
                      <Descriptions column={1} bordered>
                        <Descriptions.Item label="Manager">
                          <strong>{hotelData?.hotel?.manager_name}</strong>
                        </Descriptions.Item>
                        <Descriptions.Item label="Contact">
                          <Space>
                            <PhoneOutlined />
                            <a href={`tel:${hotelData?.hotel?.mobile_no}`}>
                              {hotelData?.hotel?.mobile_no}
                            </a>
                          </Space>
                        </Descriptions.Item>
                      </Descriptions>
                    </Card>
                  </Col>
                  <Col xs={24} md={12}>
                    <Card
                      size="small"
                      title="Location Information"
                      bordered={false}
                      style={{ height: "100%" }}
                    >
                      <Descriptions column={1} bordered>
                        <Descriptions.Item
                          label={
                            <Space
                              style={{ cursor: "pointer" }}
                              onClick={() =>
                                openInGoogleMaps(hotelData?.hotel?.map_location)
                              }
                            >
                              <EnvironmentOutlined />
                              <span>Address</span>
                            </Space>
                          }
                        >
                          <div style={{ whiteSpace: "pre-wrap" }}>
                            {hotelData?.hotel?.address}
                          </div>
                        </Descriptions.Item>
                      </Descriptions>
                    </Card>
                  </Col>
                </Row>
              </Col>
            </Row>
          </Card>
        </Col>

        <Col span={24}>
          <Card
            title="Room Inventory"
            bordered={false}
            style={{
              background:
                "linear-gradient(135deg, #52c41a0a 0%, #52c41a1a 100%)",
              boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
            }}
          >
            <Table
              columns={inventoryColumns}
              dataSource={hotelData?.hotel_details}
              rowKey="id"
              pagination={false}
              scroll={{ x: true }}
            />
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default HotelDetailsPage;
