import { useState, useEffect } from "react";
import { Input, Button, Table, Form, message } from "antd";
import { SearchOutlined, UserAddOutlined } from "@ant-design/icons";
import {
  useApiQuery,
  useApiMutation,
} from "../../../hooks/useApiQuery/useApiQuery";
import useAuthStore from "../../../stores/AuthStore/AuthStore";
import { renderErrorNotifications } from "helpers/error.helpers";
import responsiveTable from "hoc/resposive-table.helper";
import { getColumnsForUsersList } from "../Users.helper";
import { CACHE_KEYS } from "../../../commons/constants";
import NewUserModal from "./_blocks/NewUserModal";

const UsersList = () => {
  const { userData } = useAuthStore();
  const [form] = Form.useForm();
  const [searchText, setSearchText] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [filteredData, setFilteredData] = useState([]);
  const [selectedRow, setSelectedRow] = useState(null);

  // Fetch users data
  const {
    data: usersResponse,
    isFetching: usersLoading,
    refetch,
  } = useApiQuery({
    queryKey: [CACHE_KEYS.USERS_LIST],
    url: "/iam/users",
    params: { tenant_id: userData?.tenant_id },
    staleTimeInMinutes: 1,
    onSuccess: (data) => {
      console.log(data);
    },
    onError: (error) => {
      renderErrorNotifications(error.errors);
    },
  });

  const usersData = usersResponse?.data || [];
  const totalUsers = usersResponse?.meta?.pagination?.total || 0;

  // Create new user mutation
  const { mutate: createUser, isLoading: isCreatingUser } = useApiMutation({
    url: "/iam/users",
    method: "POST",
    onSuccess: () => {
      message.success("User created successfully");
      setIsModalOpen(false);
      form.resetFields();
      refetch();
    },
    onError: (error) => {
      message.error(error?.errors?.[0]?.message || "Failed to create user");
    },
  });

  // Filter data based on search text
  useEffect(() => {
    if (!usersData || !usersData.length) return;

    if (!searchText) {
      setFilteredData(usersData);
      return;
    }

    const lowerCaseSearch = searchText.toLowerCase();
    const filtered = usersData.filter(
      (user) =>
        user.name.toLowerCase().includes(lowerCaseSearch) ||
        user.email.toLowerCase().includes(lowerCaseSearch) ||
        user.contact_number.number.includes(searchText)
    );

    setFilteredData(filtered);
  }, [searchText, usersData]);

  // Set initial filtered data when users data loads
  useEffect(() => {
    if (usersData && usersData.length) {
      setFilteredData(usersData);
    }
  }, [usersData]);

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
    createUser({
      tenant_id: userData.tenant_id,
      name: values.name,
      email: values.email,
      contact_number: {
        country_code: values.country_code,
        isd_code: values.isd_code,
        number: values.phone_number,
      },
    });
  };

  const editAndDeleteActions = {
    handleEdit: (rowData) => {
      console.log(rowData);
      setSelectedRow(rowData);
      setIsModalOpen(true);
    },
    handleDelete: ({ receipt_id }) => {
      // navigate(`/receipt/receipt-approval/${receipt_id}`);
    },
  };
  // Table columns configuration
  const usersTableColumns = responsiveTable({
    input: getColumnsForUsersList({editAndDeleteActions}),
    labelCol: 9,
    valueCol: 15,
  });

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <h1 className="text-2xl font-semibold text-gray-800">
          Users Management
        </h1>
        <Button
          type="primary"
          icon={<UserAddOutlined />}
          onClick={showModal}
          className="bg-primary hover:bg-primary-dark"
        >
          Add New User
        </Button>
      </div>

      {/* Search Bar */}
      <div className="mb-6">
        <Input
          prefix={<SearchOutlined className="text-gray-400" />}
          placeholder="Search users by name, email or phone number"
          onChange={handleSearch}
          value={searchText}
          className="rounded-lg max-w-xl"
          allowClear
        />
      </div>

      {/* Users Table */}
      <div className="overflow-x-auto">
        <Table
          loading={usersLoading}
          dataSource={filteredData}
          columns={usersTableColumns}
          rowKey="tenant_user_id"
          pagination={{
            defaultPageSize: 10,
            pageSizeOptions: [10, 20, 30, 40, 50],
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total) => `Total ${total} items`,
          }}
          className="border border-gray-100 rounded-lg"
          locale={{ emptyText: "No users found" }}
        />
      </div>

      {/* Add User Modal */}
      {isModalOpen && (
        <NewUserModal
          existingUser={selectedRow}
          handleCancel={handleCancel}
          handleSubmit={handleSubmit}
        />
      )}
    </div>
  );
};

export default UsersList;
