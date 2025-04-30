import { useState, useEffect } from "react";
import { Button, Table, Form, message, Card, Row, Input, Col } from "antd";
import { SearchOutlined, UserAddOutlined } from "@ant-design/icons";
import {
  useApiQuery,
  useApiMutation,
} from "../../../hooks/useApiQuery/useApiQuery";
import useAuthStore from "../../../stores/AuthStore/AuthStore";
import { renderErrorNotifications } from "helpers/error.helpers";
import responsiveTable from "hoc/resposive-table.helper";
import { roleListColumns } from "../Users.helper";
import { CACHE_KEYS } from "../../../commons/constants";
import NewRoleModal from "./_blocks/NewRoleModal";

const pageSize = 10;

const RolesList = () => {
  const { userData } = useAuthStore();
  const [searchText, setSearchText] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [form] = Form.useForm();
  const [filteredData, setFilteredData] = useState([]);
  const [editingRole, setEditingRole] = useState(null);

  const {
    data: permissionsResponse,
    isFetching: permissionsLoading,
    refetch,
  } = useApiQuery({
    queryKey: [CACHE_KEYS.PERMISSIONS_LIST],
    url: "/iam/roles/role-permissions",
    params: { tenant_id: userData?.tenant_id },
    staleTimeInMinutes: 1,
    onError: (error) => {
      console.error("Error fetching permissions:", error);
      renderErrorNotifications(error.errors);
    },
  });

  const rolesData = permissionsResponse;

  const { mutate: createRole, isLoading: isCreatingRole } = useApiMutation({
    url: "/iam/roles",
    method: "POST",
    onSuccess: () => {
      message.success("Role created successfully");
      setIsModalOpen(false);
      form.resetFields();
      refetch();
    },
    onError: (error) => {
      message.error(error?.errors?.[0]?.message || "Failed to create role");
    },
  });

  const { mutate: updateRole, isLoading: isUpdatingRole } = useApiMutation({
    url: "/iam/roles/role-permissions",
    method: "PATCH",
    onSuccess: () => {
      message.success("Role updated successfully");
      setIsModalOpen(false);
      form.resetFields();
      refetch();
    },
    onError: (error) => {
      message.error(error?.errors?.[0]?.message || "Failed to update role");
    },
  });

  useEffect(() => {
    if (!rolesData || !rolesData.length) return;

    if (!searchText) {
      setFilteredData(rolesData);
      return;
    }

    const lowerCaseSearch = searchText.toLowerCase();
    const filtered = rolesData.filter(
      (role) =>
        role.role_name.toLowerCase().includes(lowerCaseSearch) ||
        role.privileges.some((permission) =>
          permission.privilege_name.toLowerCase().includes(lowerCaseSearch)
        )
    );

    setFilteredData(filtered);
  }, [searchText, rolesData]);

  // useEffect(() => {
  //   if (rolesData && rolesData.length) {
  //     setFilteredData(rolesData);
  //   }
  // }, [rolesData]);

  const handleSearch = (e) => {
    setSearchText(e.target.value);
  };

  const showAddModal = (role = null) => {
    setEditingRole(role);
    if (role) {
      form.setFieldsValue({
        name: role.role_name,
        permissions: role.privileges?.map((perm) => perm.tenant_privilege_id),
      });
    }
    setIsModalOpen(true);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
    setEditingRole(null);
    form.resetFields();
  };

  const handleDelete = (record) => {
    console.log("Delete clicked for record:", record);
  };

  const handleSubmit = (values) => {
    if (editingRole) {
      const currentPermissionIds = new Set(
        editingRole.privileges.map((p) => p.tenant_privilege_id)
      );
      const newPermissionIds = new Set(values.permissions);

      const permissionsToAdd = values.permissions.filter(
        (id) => !currentPermissionIds.has(id)
      );
      const permissionsToRemove = editingRole.privileges
        .map((p) => p.tenant_privilege_id)
        .filter((id) => !newPermissionIds.has(id));

      if (permissionsToAdd.length > 0) {
        updateRole({
          tenant_role_id: editingRole.tenant_role_id,
          tenant_privilege_ids: permissionsToAdd,
          type: "ADD",
        });
      }

      if (permissionsToRemove.length > 0) {
        updateRole({
          tenant_role_id: editingRole.tenant_role_id,
          tenant_privilege_ids: permissionsToRemove,
          type: "REMOVE",
        });
      }
    } else {
      createRole({
        name: values.name,
        tenant_privilege_ids: values.permissions,
      });
    }
  };

  const handleEdit = (record) => {
    showAddModal(record);
  };

  const rolesTableColumns = responsiveTable({
    input: roleListColumns(handleEdit, handleDelete),
    labelCol: 8,
    valueCol: 16,
  });

  return (
    <Card title="Roles Management">
      <Row justify="space-between" align="middle">
        <Col>
          <div className="flex items-center gap-2">
            <Input.Search
              enterButton
              size="middle"
              prefix={<SearchOutlined className="text-gray-400" />}
              placeholder="Search roles by name"
              onChange={handleSearch}
              value={searchText}
              className="rounded-lg max-w-lg"
              allowClear
            />

            <Button type="link" onClick={() => setSearchText("")}>
              Reset
            </Button>
          </div>
        </Col>
        <Col>
          <Button
            type="primary"
            icon={<UserAddOutlined />}
            onClick={() => showAddModal()}
            className="bg-primary hover:bg-primary-dark"
          >
            Add New Role
          </Button>
        </Col>
      </Row>

      <div className="overflow-x-auto mt-4">
        <Table
          loading={permissionsLoading}
          dataSource={filteredData}
          columns={rolesTableColumns}
          pagination={{
            defaultPageSize: 5,
            pageSizeOptions: [5, 10, 15, 20],
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total) => `Total ${total} items`,
          }}
          rowKey="role_id"
          locale={{ emptyText: "No roles found" }}
        />
      </div>

      {isModalOpen && (
        <NewRoleModal
          existingRole={editingRole}
          handleCancel={handleCancel}
          handleSubmit={handleSubmit}
          permissionsLoading={permissionsLoading}
          isCreatingRole={isCreatingRole}
          isUpdatingRole={isUpdatingRole}
        />
      )}
    </Card>
  );
};

export default RolesList;
