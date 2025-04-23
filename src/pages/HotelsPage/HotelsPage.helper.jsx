import {
  DeleteOutlined,
  EditOutlined,
  EyeOutlined,
} from "@ant-design/icons";
import { Button, Space, Tag, Typography } from "antd";

const { Title } = Typography;

const openInGoogleMaps = (map_location) => {
  window.open(map_location, "_blank");
};

export const getColumnsForHotels = ({ editAndDeleteActions }) => {
  return [
    {
      title: "Hotel ID",
      key: "id",
      align: "center",
      responsive: ["sm"],
      render: (record) => record.id,
    },
    {
      title: "Hotel Name",
      key: "name",
      align: "center",
      responsive: ["sm"],
      render: (record) => (
        <Space direction="vertical" size="small">
          <Title level={5} style={{ margin: 0 }}>
            {record.name}
          </Title>
        </Space>
      ),
    },
    {
      title: "Manager Information",
      key: "contact",
      align: "center",
      responsive: ["sm"],
      render: (record) => (
        <Space direction="vertical" size="small">
          <div>{record.manager_name}</div>
          <a href={`tel:${record.mobile_no}`}>{record.mobile_no}</a>
        </Space>
      ),
    },
    // {
    //   title: "Address",
    //   key: "address",
    //   align: "center",
    //   responsive: ["sm"],
    //   render: (record) => (
    //     <Space direction="vertical" size="small">
    //       <div>{record.address}</div>
    //       <Tooltip title="Open in Google Maps">
    //         <Button
    //           type="link"
    //           icon={<EnvironmentOutlined />}
    //           onClick={() => openInGoogleMaps(record.map_location)}
    //           style={{ padding: 0 }}
    //         >
    //           View on Map
    //         </Button>
    //       </Tooltip>
    //     </Space>
    //   ),
    // },
    {
      title: "Hotel Details",
      key: "details",
      align: "center",
      responsive: ["sm"],
      render: (record) => (
        <Space direction="vertical" size="small">
          <Tag color="blue">{record.hotel_type}</Tag>
          <div>Capacity: {record.hotel_capacity}</div>
          <Tag color={record.hotel_star >= 4 ? "gold" : "blue"}>
            {record.hotel_star} Star
          </Tag>
        </Space>
      ),
    },
    // {
    //   title: "Gender Policy",
    //   key: "gender",
    //   align: "center",
    //   responsive: ["sm"],
    //   render: (record) => (
    //     <Tag color="purple">
    //       {record.hotel_gender === "BOTH"
    //         ? "All Genders"
    //         : `${record.hotel_gender} Only`}
    //     </Tag>
    //   ),
    // },
    {
      title: "Avl Cap",
      key: "available_capacity",
      align: "center",
      responsive: ["sm"],
      render: (record) =>
        record.available_capacity ||
        Math.round(Math.random() * (100 - 1) + 1),
    },
    {
      title: "Action",
      key: "action",
      align: "center",
      responsive: ["sm"],
      render: (record) => (
        <Space size="small">
          <Button
            type="link"
            icon={<EyeOutlined />}
            onClick={() => editAndDeleteActions.handleView(record)}
            style={{ color: "#1890ff" }}
          >
            View
          </Button>
          <Button
            type="link"
            icon={<EditOutlined />}
            onClick={() => editAndDeleteActions.handleEdit(record)}
          >
            Edit
          </Button>
          <Button
            type="link"
            danger
            icon={<DeleteOutlined />}
            onClick={() => editAndDeleteActions.handleDelete(record)}
          >
            Delete
          </Button>
        </Space>
      ),
    },
  ];
};

export const hotelTypes = [
  { label: "Luxury", value: "LUXURY" },
  { label: "Business", value: "BUSINESS" },
  { label: "Resort", value: "RESORT" },
  { label: "Boutique", value: "BOUTIQUE" },
  { label: "Budget", value: "BUDGET" },
];

export const hotelStars = [
  { label: "1 Star", value: "1" },
  { label: "2 Stars", value: "2" },
  { label: "3 Stars", value: "3" },
  { label: "4 Stars", value: "4" },
  { label: "5 Stars", value: "5" },
];

export const hotelGenders = [
  { label: "Male Only", value: "MALE" },
  { label: "Female Only", value: "FEMALE" },
  { label: "All Genders", value: "BOTH" },
];
