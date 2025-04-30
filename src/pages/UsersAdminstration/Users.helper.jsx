import { EditOutlined, DeleteOutlined, UserAddOutlined } from "@ant-design/icons";
import { Avatar, Button, Row, Space, Switch, Tooltip, Popconfirm, Tag, Col } from "antd";
import { isMobile } from "helpers/device.helpers";

export const getColumnsForUsersList = ({ editAndDeleteActions }) => {
  const columns = [
    {
      title: "User",
      key: "name",
      align: "center",
      responsive: ["sm"],
      render: ({ name, profile_picture_url }) => (
        <Row
          className="items-center"
          justify={!isMobile() ? "start" : "center"}
        >
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
      render: (record) => (
        <Row justify={"center"}>
          <Switch
            color={record.is_active ? "success" : "error"}
            onChange={(checked) =>
              editAndDeleteActions.handleActiveInactive({
                record,
                checked,
              })
            }
            checkedChildren="ACTIVE"
            unCheckedChildren="INACTIVE"
            defaultChecked={record?.is_active}
          >
            {record.is_active ? "Active" : "Inactive"}
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
                onClick={() => editAndDeleteActions.handleEdit(record)}
              />
            </Tooltip>
            <Tooltip title="Delete User">
              <Popconfirm
              title="Are you sure you want to delete this user?"
              onConfirm={() => editAndDeleteActions.handleDelete(record)}
              >
              <Button
                icon={<DeleteOutlined />}
                shape="circle"
                className="border-gray-300 hover:border-red-500 hover:text-red-500"
                disabled={record.is_root_user}
              />
              </Popconfirm>
            </Tooltip>
            <Tooltip title="Assign Role">
              <Button
                icon={<UserAddOutlined />}
                shape="circle"
                className="border-gray-300 hover:border-red-500 hover:text-red-500"
                onClick={() => editAndDeleteActions.handleAssignRole(record)}
              />

            </Tooltip>
          </Space>
        </Row>
      ),
    },
  ];

  return columns;
};

export const roleListColumns = (onEdit, onDelete) => [
  {
    title: "Role",
    key: "name",
    align: "center",
    responsive: ["sm"],
    render: ({ role_name }) => (
      <Row justify={"center"}>
        <span>{role_name.toUpperCase().replace(/\s+/g, "_")}</span>
      </Row>
    ),
  },
  {
    title: "Permissions",
    key: "permissions",
    align: "center",
    responsive: ["sm"],
    render: ({ privileges }) => {
     

      // Split privileges into pairs for two-column layout
      const permissionPairs = [];
      for (let i = 0; i < privileges.length; i += 2) {
        permissionPairs.push(privileges.slice(i, i + 2));
      }

      return (
        <div className="flex flex-col">
          {permissionPairs.map((pair, index) => (
            <Row key={index} justify="center" gutter={[0, 0]}>
              {pair.map((permission) => (
                <Col key={permission.tenant_privilege_id} span={4}>
                  <Tag color="blue" style={{ overflow: 'hidden', whiteSpace: 'nowrap', textAlign: 'center' }}>
                    {permission.privilege_name}
                  </Tag>
                </Col>
              ))}
            </Row>
          ))}
        </div>
      );
    },
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
          <Tooltip title="Delete Role">
            <Popconfirm
              title="Are you sure you want to delete this role?"
              onConfirm={() => onDelete && onDelete(record)}
            >
              <Button 
                icon={<DeleteOutlined />} 
                shape="circle"  
                className="border-gray-300 hover:border-red-500 hover:text-red-500"
                disabled={record.tenant_role_id === "42122c12-a143-5807-9c2e-aca004836374"}
              />
            </Popconfirm>
          </Tooltip>
        </Space>
      </Row>
    ),
  },
];
