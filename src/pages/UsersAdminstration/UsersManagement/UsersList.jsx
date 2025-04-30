import { useState, useEffect, useMemo } from "react";
import { Input, Button, Table, Form, message, Card, Row, Col } from "antd";
import { SearchOutlined } from "@ant-design/icons";
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

  return (
    <Card title="Users Management">
      <Row justify="space-between" align="middle">
        <Col sm={12}>
          <div className="flex items-center gap-2">
            <Input.Search
              enterButton
              size="middle"
              prefix={<SearchOutlined className="text-gray-400" />}
              placeholder="Search users by name, email or phone number"
              onChange={handleSearch}
              value={searchText}
            ></Input.Search>
            <Button type="link" onClick={() => setSearchText("")}>
              Reset
            </Button>
          </div>
        </Col>
        <Col>
          <Button type="primary" onClick={showModal}>
            Add New User
          </Button>
        </Col>
      </Row>

      <div className="overflow-x-auto mt-4">
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
          className="border border-gray-100 rounded-lg tca-responsive-table"
          locale={{ emptyText: "No users found" }}
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
