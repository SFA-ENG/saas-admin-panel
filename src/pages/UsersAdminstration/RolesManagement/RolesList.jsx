import { useState, useEffect } from "react";
import {
  Button,
  Table,
  Form,
  Card,
  Row,
  Input,
  Col,
  Typography,
  Tooltip,
} from "antd";
import {
  UserPlus,
  RefreshCw,
  Shield,
  Key,
  CheckSquare,
  Filter,
} from "lucide-react";
import {
  useApiQuery,
  useApiMutation,
} from "../../../hooks/useApiQuery/useApiQuery";
import useAuthStore from "../../../stores/AuthStore/AuthStore";
import {
  renderErrorNotifications,
  renderSuccessNotifications,
} from "helpers/error.helpers";
import responsiveTable from "hoc/resposive-table.helper";
import { roleListColumns } from "../Users.helper";
import { CACHE_KEYS } from "../../../commons/constants";
import NewRoleModal from "./_blocks/NewRoleModal";
import AccessControlButton from "Components/AccessControlButton/AccessControlButton";
const { Title, Text } = Typography;

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
      renderSuccessNotifications({
        title: "Success",
        message: "Role created successfully",
      });
      setIsModalOpen(false);
      form.resetFields();
      refetch();
    },
    onError: (error) => {
      renderErrorNotifications(error.errors);
    },
  });

  const { mutate: updateRole, isLoading: isUpdatingRole } = useApiMutation({
    url: "/iam/roles/role-permissions",
    method: "PATCH",
    onSuccess: () => {
      renderSuccessNotifications({
        title: "Success",
        message: "Role updated successfully",
      });
      setIsModalOpen(false);
      form.resetFields();
      refetch();
    },
    onError: (error) => {
      renderErrorNotifications(error.errors);
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

  // Calculate statistics
  const totalRoles = rolesData?.length || 0;
  const adminRoles =
    rolesData?.filter((role) => role.role_name.toLowerCase().includes("admin"))
      .length || 0;
  const otherRoles = totalRoles - adminRoles;

  return (
    <Card
      bordered={false}
      style={{
        boxShadow: "0 2px 8px rgba(0, 0, 0, 0.06)",
        borderRadius: "12px",
        background: "linear-gradient(145deg, #ffffff, #f9fafb)",
      }}
    >
      <div className="mb-6">
        <Row gutter={[16, 16]} align="middle" className="mb-2">
          <Col>
            <div className="flex items-center">
              <div className="bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 h-12 w-2 rounded-full mr-4"></div>
              <div>
                <Title level={3} style={{ margin: 0, fontWeight: 600 }}>
                  Roles Management
                </Title>
                <Text type="secondary" className="mt-1">
                  Manage roles and permissions for your organization&apos;s
                  users
                </Text>
              </div>
            </div>
          </Col>
        </Row>

        {/* Role Stats */}
        <Row gutter={[16, 16]} className="mb-6">
          {[
            {
              icon: Shield,
              label: "Total",
              value: totalRoles,
              bg: "bg-blue-100",
              color: "text-blue-600",
            },
            {
              icon: Key,
              label: "Admin",
              value: adminRoles,
              bg: "bg-purple-100",
              color: "text-purple-600",
            },
            {
              icon: CheckSquare,
              label: "Other",
              value: otherRoles,
              bg: "bg-green-100",
              color: "text-green-600",
            },
          ].map(({ icon: Icon, label, value, bg, color }) => (
            <Col xs={24} sm={8} key={label}>
              <div className="flex items-center bg-white p-2 rounded-lg shadow-sm hover:shadow-md transition-all duration-300 h-full">
                <div className={`${bg} p-2 rounded-lg mr-3`}>
                  <Icon size={20} className={color} />
                </div>
                <div className="flex flex-row justify-between gap-3 items-center">
                  <p className="text-gray-500 text-sm">{label} Roles:</p>
                  <h3 className="text-xl font-bold text-gray-800">{value}</h3>
                </div>
              </div>
            </Col>
          ))}
        </Row>
      </div>

      <Row
        justify="space-between"
        align="middle"
        gutter={[16, 16]}
        className="mb-6"
      >
        <Col xs={24} sm={14} md={16}>
          <div className="relative">
            <Input
              placeholder="Search roles by name or permission"
              onChange={handleSearch}
              value={searchText}
              className="pl-10 py-2 pr-3"
              style={{
                borderRadius: "10px",
                height: "46px",
                boxShadow: "0 2px 5px rgba(0, 0, 0, 0.05)",
                fontSize: "15px",
                border: "1px solid #e2e8f0",
              }}
              suffix={
                searchText ? (
                  <Tooltip title="Clear search">
                    <Button
                      type="text"
                      className="reset-btn flex items-center justify-center"
                      onClick={() => setSearchText("")}
                      style={{ width: "30px", height: "30px" }}
                      icon={<RefreshCw size={14} className="text-gray-500" />}
                    />
                  </Tooltip>
                ) : (
                  <Filter size={15} className="text-gray-400" />
                )
              }
            />
          </div>
        </Col>
        <Col className="flex justify-end">
          <AccessControlButton
            title="Add New Role"
            icon={UserPlus}
            onClick={() => showAddModal()}
          />
        </Col>
      </Row>

      <div className="overflow-x-auto">
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
            style: { marginTop: "20px" },
          }}
          rowKey="role_id"
          className="roles-table"
          style={{
            borderRadius: "12px",
            overflow: "hidden",
            boxShadow: "0 2px 10px rgba(0, 0, 0, 0.04)",
          }}
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
