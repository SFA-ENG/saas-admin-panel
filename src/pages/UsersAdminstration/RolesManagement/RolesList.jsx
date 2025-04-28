import { useState, useEffect } from "react";
import { Input, Button, Table, Modal, Form, message, Select } from "antd";
import { SearchOutlined, UserAddOutlined } from "@ant-design/icons";
import { useApiQuery, useApiMutation } from "../../../hooks/useApiQuery/useApiQuery";
import useAuthStore from "../../../stores/AuthStore/AuthStore";
import { renderErrorNotifications } from "helpers/error.helpers";
import responsiveTable from "hoc/resposive-table.helper";
import { roleListColumns } from "../Users.helper";
import { CACHE_KEYS, getAllPermissionsList } from "../../../commons/constants";

const pageSize = 10;

const RolesList = () => {
  const { userData } = useAuthStore();
  const [searchText, setSearchText] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [form] = Form.useForm();
  const [filteredData, setFilteredData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);

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
    onError: (error) => {
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

  const showModal = () => {
    setIsModalOpen(true);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
    form.resetFields();
  };

  const handleSubmit = (values) => {
    createRole({
      tenant_id: userData.tenant_id,
      name: values.name,
      tenant_privilege_ids: values.permissions.map(permission => permission.id),
    });
  };

  const rolesTableColumns = responsiveTable({
    input: roleListColumns,
    labelCol: 9,
    valueCol: 15,
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
          onClick={showModal}
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
          className="border border-gray-100 rounded-lg"
          locale={{ emptyText: "No roles found" }}    
        />
      </div>

      <Modal
        title="Add New Role"
        open={isModalOpen}
        onCancel={handleCancel}
        footer={null}
        width={600}
        className="role-modal"
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
          className="mt-4"
        >
          <Form.Item
            name="name"
            label="Role Name"
            rules={[{ required: true, message: "Please enter role name" }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            name="permissions"
            label="Permissions"
            rules={[{ required: true, message: "Please select at least one permission" }]}
          >
            <Select 
              mode="multiple" 
              placeholder="Select permissions"
              loading={permissionsLoading}
              notFoundContent={permissionsLoading ? "Loading..." : "No permissions found"}
              options={getAllPermissionsList()}
            />
             
          </Form.Item>

          <div className="flex justify-end gap-3 mt-4">
            <Button onClick={handleCancel}>Cancel</Button>
            <Button
              type="primary"
              htmlType="submit"
              loading={isCreatingRole}
              className="bg-primary hover:bg-primary-dark"
            >
              Create Role
            </Button>
          </div>
        </Form>
      </Modal>
    </div>
  );
};

export default RolesList;
