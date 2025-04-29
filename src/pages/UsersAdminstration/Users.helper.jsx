import { EditOutlined, DeleteOutlined } from "@ant-design/icons";
import { Avatar, Button, Row, Space, Switch, Tooltip } from "antd";
import { isMobile } from "helpers/device.helpers";

export const userListColumns = [
  {
    title: "User",
    key: "name",
    align: "center",
    responsive: ["sm"],
    render: ({ name, profile_picture_url }) => (
      <Row className="items-center" justify={!isMobile() ? "start" : "center"}>
        <div className="flex items-center gap-3">
          {!isMobile() && <Avatar size={40} src={profile_picture_url} />}
          {name}
        </div>
      </Row>
    ),
  },
  {
    title: "Phone",
    key: "phone",
    align: "center",
    responsive: ["sm"],
    render: ({ contact_number }) => (
      <Row justify={"center"}>
        <a href={`tel:${contact_number.isd_code}${contact_number.number}`}>
          <span>{contact_number.number}</span>
        </a>
      </Row>
    ),
  },
  {
    title: "Email",
    key: "email",
    align: "center",
    responsive: ["sm"],
    render: ({ email }) => (
      <Row justify={"center"}>
        <a href={`mailto:${email}`} className="flex items-center gap-2">
          <span>{email}</span>
        </a>
      </Row>
    ),
  },
  {
    title: "Status",
    key: "status",
    align: "center",
    responsive: ["sm"],
    render: ({ is_active }) => (
      <Row justify={"center"}>
        <Switch checked={is_active} color={is_active ? "success" : "error"}>
          {is_active ? "Active" : "Inactive"}
        </Switch>
      </Row>
    ),
  },
  {
    title: "Actions",
    key: "actions",
    align: "center",
    responsive: ["sm"],
    render: (record) => (
      <Row justify={"center"}>
        <Space size="middle">
          <Tooltip title="Edit User">
            <Button
              icon={<EditOutlined />}
              shape="circle"
              className="border-gray-300 hover:border-primary hover:text-primary"
            />
          </Tooltip>
          <Tooltip title="Delete User">
            <Button
              icon={<DeleteOutlined />}
              shape="circle"
              className="border-gray-300 hover:border-red-500 hover:text-red-500"
            />
          </Tooltip>
        </Space>
      </Row>
    ),
  },
];

export const roleListColumns = (onEdit) => [
  {
    title: "Role",
    key: "name",
    align: "center",
    responsive: ["sm"],
    render: ({ name }) => (
      <Row justify={"center"}>
        <span>{name}</span>
      </Row>
    ),
  },
  {
    title: "Permissions",
    key: "permissions",
    align: "center",
    responsive: ["sm"],
    render: ({ permissions }) => (
      <Row justify={"center"}>
        <span>{(permissions || []).map((permission) => permission.name).join(", ")}</span>
      </Row>
    ),
  },
  {
    title: "Actions",
    key: "actions",
    align: "center",
    responsive: ["sm"],    
    render: (record) => (
      <Row justify={"center"}>
        <Space size="middle">
          <Tooltip title="Edit Role">
            <Button 
              icon={<EditOutlined />} 
              shape="circle"
              onClick={() => onEdit && onEdit(record)}
              className="border-gray-300 hover:border-primary hover:text-primary"
            />
          </Tooltip>
        </Space>
      </Row>
    ),
  },
];

