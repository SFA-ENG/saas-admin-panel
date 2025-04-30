import { useState, useEffect, useMemo } from "react";
import {
  Input,
  Button,
  Table,
  Form,
  message,
  Card,
  Row,
  Col,
  Tooltip,
  Typography,
} from "antd";
import {
  UserPlus,
  RefreshCw,
  Layers,
  Filter,
  TrendingUp,
  Calendar,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
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
import { getColumnsForUsersList } from "../Users.helper";
import { CACHE_KEYS, countryCodes } from "../../../commons/constants";
import NewUserModal from "./_blocks/NewUserModal";
import { deleteUserByuserId } from "../Users.service";
import AccessControlButton from "Components/AccessControlButton/AccessControlButton";

const { Title, Text } = Typography;

const UsersList = () => {
  const navigate = useNavigate();
  const { userData: authUserData } = useAuthStore();
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
    params: { tenant_id: authUserData?.tenant_id },
    staleTimeInMinutes: 1,
    onSuccess: (data) => {
      console.log("Users fetched successfully:", data);
    },
    onError: (error) => {
      renderErrorNotifications(error.errors);
    },
  });

  const usersData = useMemo(
    () => usersResponse?.data || [],
    [usersResponse?.data]
  );

  // Create new user mutation
  const { mutate: createUser, isLoading: isCreatingUser } = useApiMutation({
    url: "/iam/users",
    method: "POST",
    onSuccess: (response) => {
      console.log("User created successfully:", response);
      message.success("User created successfully");
      setIsModalOpen(false);
      form.resetFields();
      refetch();
    },
    onError: (error) => {
      console.error("Error creating user:", error);
      message.error(error?.errors?.[0]?.message || "Failed to create user");
    },
  });

  // Update user mutation
  const { mutate: updateUser, isLoading: isUpdatingUser } = useApiMutation({
    url: `/iam/users`,
    method: "PATCH",
    onSuccess: () => {
      setIsModalOpen(false);
      form.resetFields();
      renderSuccessNotifications({
        title: "Success",
        message: "User updated successfully",
      });
      refetch();
    },
    onError: (error) => {
      console.error("Error updating user:", error);
      message.error(error?.errors?.[0]?.message || "Failed to update user");
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

  const handleSearch = (e) => {
    setSearchText(e.target.value);
  };

  const showModal = () => {
    setIsModalOpen(true);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
    setSelectedRow(null);
    form.resetFields();
  };

  const handleSubmit = (values) => {
    if (selectedRow) {
      // Update existing user
      const updatePayload = {
        tenant_user_id: selectedRow.tenant_user_id,
        name: values.name,
        contact_number: {
          country_code: values.country_code,
          isd_code: countryCodes[values.country_code],
          number: values.phone_number,
        },
      };
      updateUser(updatePayload);
    } else {
      // Create new user
      const createPayload = {
        // tenant_user_id: authUserData.tenant_user_id,
        tenant_id: authUserData.tenant_user_id,
        name: values.name,
        email: values.email,
        password: values.password,
        contact_number: {
          country_code: values.country_code,
          isd_code: countryCodes[values.country_code],
          number: values.phone_number,
        },
      };
      createUser(createPayload);
    }
  };

  const editAndDeleteActions = {
    handleEdit: (rowData) => {
      setSelectedRow(rowData);
      setIsModalOpen(true);
    },
    handleDelete: async (record) => {
      const { data, errors } = await deleteUserByuserId(record.tenant_user_id);
      if (errors.length) {
        renderErrorNotifications(errors);
      } else {
        renderSuccessNotifications({
          title: "Success",
          message: "User deleted successfully",
        });
        refetch();
      }
    },
    handleActiveInactive: ({ record, checked }) => {
      const updatePayload = {
        tenant_user_id: record.tenant_user_id,
        is_active: checked ? true : false,
      };

      updateUser(updatePayload);
    },
    handleAssignRole: (record) => {
      navigate(`/users-administration/assign-role/${record.tenant_user_id}`);
    },
  };
  // Table columns configuration
  const usersTableColumns = responsiveTable({
    input: getColumnsForUsersList({ editAndDeleteActions }),
    labelCol: 8,
    valueCol: 16,
  });

  // Get user statistics
  const totalUsers = usersData.length;
  const activeUsers = usersData.filter((user) => user.is_active).length;
  const inactiveUsers = totalUsers - activeUsers;

  return (
    <Card
      bordered={false}
      style={{
        boxShadow: "0 2px 8px rgba(0, 0, 0, 0.06)",
        borderRadius: "12px",
        background: "linear-gradient(145deg, #ffffff, #f9fafb)",
      }}
    >
      <div className="mb-8">
        <Row gutter={[16, 16]} align="middle" className="mb-2">
          <Col>
            <div className="flex items-center">
              <div className="bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 h-12 w-2 rounded-full mr-4"></div>
              <div>
                <Title level={3} style={{ margin: 0, fontWeight: 600 }}>
                  Users Management
                </Title>
                <Text type="secondary" className="mt-1">
                  Manage your organization&apos;s users and their access
                  permissions
                </Text>
              </div>
            </div>
          </Col>
        </Row>

        {/* User Stats */}
        <Row gutter={[16, 16]} className="mb-6">
          {[
            {
              icon: TrendingUp,
              label: "Active",
              value: activeUsers,
              bg: "bg-blue-100",
              color: "text-blue-600",
            },
            {
              icon: Calendar,
              label: "Inactive",
              value: inactiveUsers,
              bg: "bg-green-100",
              color: "text-green-600",
            },
            {
              icon: Layers,
              label: "Total",
              value: usersData.length,
              bg: "bg-purple-100",
              color: "text-purple-600",
            },
          ].map(({ icon: Icon, label, value, bg, color }) => (
            <Col xs={24} sm={8} key={label}>
              <div className="flex items-center bg-white p-2 rounded-lg shadow-sm">
                <div className={`${bg} p-2 rounded-lg mr-3`}>
                  <Icon size={20} className={color} />
                </div>
                <div className="flex flex-row justify-between gap-3 items-center">
                  <p className="text-gray-500 text-sm">{label} Users:</p>
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
        gutter={[20, 20]}
        className="mb-6"
      >
        <Col xs={24} sm={14} md={16}>
          <div>
            <Input
              placeholder="Search users by name, email or phone number"
              onChange={handleSearch}
              value={searchText}
              className="search-input pl-10 py-2 pr-3"
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
            title="Add New User"
            icon={UserPlus}
            onClick={showModal}
          />
        </Col>
      </Row>

      <div>
        <Table
          loading={usersLoading}
          dataSource={filteredData}
          columns={usersTableColumns}
          rowKey="tenant_user_id"
          rowClassName="user-table-row"
          pagination={{
            defaultPageSize: 10,
            pageSizeOptions: [10, 20, 30, 40, 50],
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total) => `Total ${total} items`,
            style: { marginTop: "20px" },
          }}
          className="users-table"
          style={{
            borderRadius: "12px",
            overflow: "hidden",
            boxShadow: "0 2px 10px rgba(0, 0, 0, 0.04)",
          }}
        />
      </div>

      {/* Add User Modal */}
      {isModalOpen && (
        <NewUserModal
          existingUser={selectedRow}
          handleCancel={handleCancel}
          handleSubmit={handleSubmit}
          isLoading={isCreatingUser || isUpdatingUser}
        />
      )}
    </Card>
  );
};

export default UsersList;
