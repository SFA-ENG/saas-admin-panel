import { useState, useEffect } from "react";
import { Input, Button, Table, Modal, Form, Select, message } from "antd";
import { SearchOutlined, UserAddOutlined } from "@ant-design/icons";
import {
  useApiQuery,
  useApiMutation,
} from "../../../hooks/useApiQuery/useApiQuery";
import useAuthStore from "../../../stores/AuthStore/AuthStore";
import { renderErrorNotifications } from "helpers/error.helpers";
import responsiveTable from "hoc/resposive-table.helper";
import { userListColumns } from "../Users.helper";

const pageSize = 10;

const UsersList = () => {
  const { userData } = useAuthStore();
  const [searchText, setSearchText] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [form] = Form.useForm();
  const [filteredData, setFilteredData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);

  // Fetch users data
  const {
    data: usersResponse,
    isFetching: usersLoading,
    refetch,
  } = useApiQuery({
    queryKey: ["users-list"],
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
    console.log("useEffect");
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
    setCurrentPage(1); // Reset to first page when filtering
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

  // Table columns configuration
  const usersTableColumns = responsiveTable({
    input: userListColumns,
    labelCol: 9,
    valueCol: 15,
  });

  // Calculate pagination
  const paginatedData = filteredData?.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  // Handle pagination change
  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  // Country options for the form
  const countryOptions = [
    { label: "India", value: "IN", isd: "+91" },
    { label: "United States", value: "US", isd: "+1" },
    { label: "United Kingdom", value: "UK", isd: "+44" },
    // Add more countries as needed
  ];

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
          dataSource={paginatedData}
          columns={usersTableColumns}
          rowKey="tenant_user_id"
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
          locale={{ emptyText: "No users found" }}
        />
      </div>

      {/* Add User Modal */}
      <Modal
        title="Add New User"
        open={isModalOpen}
        onCancel={handleCancel}
        footer={null}
        width={600}
        className="user-modal"
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
          className="mt-4"
        >
          <Form.Item
            name="name"
            label="Full Name"
            rules={[{ required: true, message: "Please enter user's name" }]}
          >
            <Input placeholder="John Doe" />
          </Form.Item>

          <Form.Item
            name="email"
            label="Email Address"
            rules={[
              { required: true, message: "Please enter email address" },
              { type: "email", message: "Please enter a valid email" },
            ]}
          >
            <Input placeholder="john.doe@example.com" />
          </Form.Item>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Form.Item
              name="country_code"
              label="Country"
              rules={[{ required: true, message: "Required" }]}
            >
              <Select
                placeholder="Select country"
                options={countryOptions}
                onChange={(value) => {
                  const isd = countryOptions.find(
                    (c) => c.value === value
                  )?.isd;
                  form.setFieldsValue({ isd_code: isd });
                }}
              />
            </Form.Item>

            <Form.Item
              name="isd_code"
              label="ISD Code"
              rules={[{ required: true, message: "Required" }]}
            >
              <Input placeholder="+91" disabled />
            </Form.Item>

            <Form.Item
              name="phone_number"
              label="Phone Number"
              rules={[
                { required: true, message: "Please enter phone number" },
                { pattern: /^\d+$/, message: "Numbers only" },
              ]}
            >
              <Input placeholder="9876543210" />
            </Form.Item>
          </div>

          <div className="flex justify-end gap-3 mt-4">
            <Button onClick={handleCancel}>Cancel</Button>
            <Button
              type="primary"
              htmlType="submit"
              loading={isCreatingUser}
              className="bg-primary hover:bg-primary-dark"
            >
              Create User
            </Button>
          </div>
        </Form>
      </Modal>
    </div>
  );
};

export default UsersList;
