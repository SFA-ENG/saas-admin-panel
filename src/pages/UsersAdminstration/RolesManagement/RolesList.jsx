import { useState, useEffect } from "react";
import { Input, Button, Table, Form, message } from "antd";
import { SearchOutlined, UserAddOutlined } from "@ant-design/icons";
import { useApiQuery, useApiMutation } from "../../../hooks/useApiQuery/useApiQuery";
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
  const [currentPage, setCurrentPage] = useState(1);
  const [editingRole, setEditingRole] = useState(null);
  const {
    data: rolesResponse,
    isFetching: rolesLoading,
    refetch,
  } = useApiQuery({
    queryKey: [CACHE_KEYS.ROLES_LIST],
    url: "/iam/roles",
    params: { tenant_id: userData?.tenant_id },
    staleTimeInMinutes: 1,
    onSuccess: (data) => {
      console.log(data);
    },
    onError: (error) => {
      renderErrorNotifications(error.errors);
    },
  });

  const {
    data: permissionsResponse,
    isFetching: permissionsLoading,
  } = useApiQuery({
    queryKey: [CACHE_KEYS.PERMISSIONS_LIST],
    url: "/iam/roles/role-permissions",
    params: { tenant_id: userData?.tenant_id },
    staleTimeInMinutes: 1,
    onSuccess: (data) => {
      console.log("Permissions data:", data);
    },
    onError: (error) => {
      console.error("Error fetching permissions:", error);
      renderErrorNotifications(error.errors);
    },
  });

  const rolesData = rolesResponse?.data || [];
  const totalRoles = rolesResponse?.meta?.pagination?.total || 0;
  const permissions = permissionsResponse?.data || [];

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
        role.name.toLowerCase().includes(lowerCaseSearch) ||
        role.permissions.some((permission) =>
          permission.name.toLowerCase().includes(lowerCaseSearch)
        )
    );

    setFilteredData(filtered);
    setCurrentPage(1);
  }, [searchText, rolesData]);

  useEffect(() => {
    if (rolesData && rolesData.length) {
      setFilteredData(rolesData);
    }
  }, [rolesData]);

  const handleSearch = (e) => {
    setSearchText(e.target.value);
  };

  const showAddModal = (role = null) => {
    setEditingRole(role);
    if (role) {
      form.setFieldsValue({
        name: role.name,
        permissions: role.permissions
      });
    }
    setIsModalOpen(true);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
    setEditingRole(null);
    form.resetFields();
  };

  const handleSubmit = (values) => {
    if (editingRole) {
      // For existing role, we need to compare current and new permissions
      const currentPermissions = editingRole.permissions || [];
      const newPermissions = values.permissions || [];
      
      // Find permissions to add and remove
      const permissionsToAdd = newPermissions.filter(
        perm => !currentPermissions.some(p => p.id === perm)
      );
      const permissionsToRemove = currentPermissions
        .filter(p => !newPermissions.includes(p.id))
        .map(p => p.id);

      // First add new permissions
      if (permissionsToAdd.length > 0) {
        updateRole({
          tenant_role_id: editingRole.tenant_role_id,
          tenant_privilege_ids: permissionsToAdd,
          type: "ADD"
        });
      }

      // Then remove old permissions
      if (permissionsToRemove.length > 0) {
        updateRole({
          tenant_role_id: editingRole.tenant_role_id,
          tenant_privilege_ids: permissionsToRemove,
          type: "REMOVE"
        });
      }

      // If no changes to permissions, just update the name
      if (permissionsToAdd.length === 0 && permissionsToRemove.length === 0) {
        updateRole({
          tenant_role_id: editingRole.tenant_role_id,
          name: values.name
        });
      }
    } else {
      // Create new role - no type field needed
      createRole({
        name: values.name,
        tenant_privilege_ids: values.permissions
      });
    }
  };

  const handleEdit = (record) => {
    console.log("Edit clicked for record:", record); // Debug log
    showAddModal(record);
  };

  const rolesTableColumns = responsiveTable({
    input: roleListColumns(handleEdit),
    labelCol: 8,
    valueCol: 16,
  });

  const paginatedData = filteredData?.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <h1 className="text-2xl font-semibold text-gray-800">Roles Management</h1>
        <Button
          type="primary"
          icon={<UserAddOutlined />}
          onClick={() => showAddModal()}
          className="bg-primary hover:bg-primary-dark"
        >
          Add New Role
        </Button>
      </div>
        
      <div className="mb-6">
        <Input
          prefix={<SearchOutlined className="text-gray-400" />}
          placeholder="Search roles by name"
          onChange={handleSearch}
          value={searchText}
          className="rounded-lg max-w-xl"
          allowClear
        />
      </div>

      <div className="overflow-x-auto">
        <Table
          loading={rolesLoading}
          dataSource={paginatedData}
          columns={rolesTableColumns}
          rowKey="role_id"
          pagination={{
            current: currentPage,
            pageSize: pageSize,
            showQuickJumper: true,
            total: filteredData?.length,
            onChange: handlePageChange,
            showSizeChanger: false,
            showTotal: (total) => `Total ${total} items`,
          }}
          className="border border-gray-100 rounded-lg tca-responsive-table"
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
    </div>
  );
};

export default RolesList;
