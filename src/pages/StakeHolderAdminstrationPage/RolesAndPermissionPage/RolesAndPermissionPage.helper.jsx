import { Button, Tag } from "antd";
import moment from "moment";

export const getColumnsForRoles = ({ onEdit }) => {
  return [
    {
      title: "Role Name",
      dataIndex: "role_name",
      align: "center",
      responsive: ["sm"],
    },
    {
      title: "Description",
      dataIndex: "role_description",
      align: "center",
      responsive: ["sm"],
    },

    {
      title: "Permissions",
      dataIndex: "role_permissions",
      align: "center",
      responsive: ["sm"],
      width: "350px",
      render: (permissions) => {
        return (
          <div>
            {permissions.map((permission, index) => {
              const [action] = permission.split(":");
              return (
                <Tag
                  key={index}
                  color={action === "VIEW" ? "gold" : "green"}
                  style={{
                    fontSize: "10px",
                    fontWeight: "550",
                  }}
                >
                  {permission}
                </Tag>
              );
            })}
          </div>
        );
      },
    },

    {
      title: "Last Updated At / Last Updated By",
      dataIndex: "last_updated_at",
      align: "center",
      responsive: ["sm"],
      width: "200",
      render: (_, record) => (
        <>
          <div>
            {record.last_updated_at
              ? moment(record.last_updated_at).format("Do MMM YYYY")
              : "--"}
          </div>
          <div>{record.last_updated_by || "System"}</div>
        </>
      ),
    },
    {
      title: "Action",
      dataIndex: "action",
      align: "center",
      render: (_, record) => (
        <Button
          type="primary"
          onClick={() => onEdit(record)}
          style={{ fontSize: "14px" }}
          aria-label={`Edit role ${record.role_name}`}
        >
          Edit
        </Button>
      ),
      responsive: ["sm"],
    },
  ];
};
