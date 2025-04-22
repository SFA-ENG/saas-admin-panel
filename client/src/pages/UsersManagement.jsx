import { useState, useEffect } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Modal, Form, Input, Select, Button, message, Badge, Tag, Dropdown, Spin, Upload, Avatar, Popconfirm, Tooltip, Switch, Pagination } from 'antd';
import {
  CloseOutlined,
  UserOutlined,
  MailOutlined,
  PhoneOutlined,
  TagOutlined,
  EditOutlined,
  DeleteOutlined,
  MoreOutlined,
  UploadOutlined
} from '@ant-design/icons';
import SearchBar from '../components/common/SearchBar';
import { apiService } from '../services/apiService';

const UsersManagement = () => {
  const [users, setUsers] = useState([]);
  const [roles, setRoles] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [userSearchTerm, setUserSearchTerm] = useState('');
  const [userModalVisible, setUserModalVisible] = useState(false);
  const [roleAssignmentModalVisible, setRoleAssignmentModalVisible] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [userForm] = Form.useForm();
  const [roleAssignmentForm] = Form.useForm();
  const [editingUserId, setEditingUserId] = useState(null);
  const [userModalTitle, setUserModalTitle] = useState('Add New User');
  const [previewImage, setPreviewImage] = useState(null);
  const [imagePreviewVisible, setImagePreviewVisible] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const queryClient = useQueryClient();

  // Fetch users data using React Query
  const { data: usersData, isLoading, error, refetch } = useQuery({
    queryKey: ['users', currentPage, pageSize],
    queryFn: async () => {
      console.log('Fetching users...');
      try {
        const response = await apiService.users.getAll({
          page: currentPage,
          page_size: pageSize
        });

        // Extract the data array from the response
        const usersArray = response?.data || [];
        const pagination = response?.meta?.pagination || {};

        // Process each user to ensure proper role structure
        const processedUsers = usersArray.map(user => {
          console.log('Processing user:', user);
          console.log('User roles before processing:', user.roles);

          // Ensure roles is an array and has the correct structure
          const processedRoles = Array.isArray(user.roles)
            ? user.roles.map(role => ({
              tenant_role_id: role.tenant_role_id,
              name: role.name
            }))
            : [];

          return {
            ...user,
            roles: processedRoles
          };
        });

        return {
          users: processedUsers,
          pagination
        };
      } catch (error) {
        console.error('Error fetching users:', error);
        throw error;
      }
    },
    onSuccess: (data) => {
      if (Array.isArray(data.users)) {
        setUsers(data.users);
        setFilteredUsers(data.users);
      } else {
        setUsers([]);
        setFilteredUsers([]);
      }
    },
    onError: (error) => {
      console.error('Query error:', error);
      message.error('Failed to fetch users. Please try again later.');
    }
  });

  // Fetch roles data using React Query
  const { data: rolesData, isLoading: isRolesLoading, error: rolesError } = useQuery({
    queryKey: ['roles'],
    queryFn: async () => {
      try {
        const response = await apiService.roles.getAll();
        return response?.data || [];
      } catch (error) {
        throw error;
      }
    },
    onSuccess: (data) => {
      setRoles(data);
    }
  });



  // Add useEffect to handle usersData changes
  useEffect(() => {
    if (usersData) {
      if (!userSearchTerm) {
        setUsers(usersData.users);
        setFilteredUsers(usersData.users);
      }
    }
  }, [usersData, userSearchTerm]);

  useEffect(() => {
    if (rolesData) {
      setRoles(rolesData);
    }
  }, [rolesData]);

 

  const handleUserSearch = (searchTerm) => {
    if (searchTerm !== userSearchTerm) {
      setCurrentPage(1);
    }
  
    setUserSearchTerm(searchTerm);
  
    if (!searchTerm.trim()) {
      setFilteredUsers(usersData?.users || []);
      return;
    }
  
    const filtered = users.filter(user =>
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredUsers(filtered);
  };
  

  // Handle page change
  const handlePageChange = (page, pageSize) => {
    setCurrentPage(page);
    setPageSize(pageSize);
    // Only invalidate query if we're not in the middle of a search
    if (!userSearchTerm) {
      queryClient.invalidateQueries(['users']);
    }
  };

  // Get current page of users
  const getPaginatedUsers = () => {
    // If we're searching, use filteredUsers, otherwise use the paginated data from the server
    return userSearchTerm ? filteredUsers : (usersData?.users || []);
  };

  // Handler for showing the role assignment modal
  const showRoleAssignmentModal = (user) => {
    setSelectedUser(user);
    const currentRoles = user.roles || [];
    const currentRoleIds = currentRoles.map(role => role.tenant_role_id);

    roleAssignmentForm.setFieldsValue({
      roleIds: currentRoleIds
    });
    setRoleAssignmentModalVisible(true);
  };

  const handleAlphabeticalInput = (e) => {
    const char = e.key;
    if (!/^[A-Za-z\s]$/.test(char)) {
      e.preventDefault();
    }
  };

  const handleNumericInput = (e) => {
    const char = e.key;
    if (!/^\d$/.test(char)) {
      e.preventDefault();
    }
  };

  // Handler for submitting the role assignment form
  const handleRoleAssignmentSubmit = async (values) => {
    try {
      if (!selectedUser?.tenant_user_id) {
        throw new Error('User ID is required');
      }

      if (!values.roleIds || !Array.isArray(values.roleIds) || values.roleIds.length === 0) {
        throw new Error('Please select at least one role');
      }

      // Validate that all selected role IDs exist in the roles array
      const validRoleIds = roles.map(role => role.tenant_role_id);
      const invalidRoleIds = values.roleIds.filter(id => !validRoleIds.includes(id));

      if (invalidRoleIds.length > 0) {
        throw new Error('Invalid role IDs selected');
      }

      const payload = {
        tenant_user_id: selectedUser.tenant_user_id,
        tenant_role_ids: values.roleIds,
        type: 'ADD'
      };

      console.log('Sending role assignment request:', payload);

      const response = await apiService.userRoles.assign(payload);
      console.log('Role assignment response:', response);

      if (response.success) {
        // Invalidate and refetch users query to get updated data
        await queryClient.invalidateQueries(['users']);
        message.success('Roles assigned successfully');
        setRoleAssignmentModalVisible(false);
        setSelectedUser(null);
        roleAssignmentForm.resetFields();
      } else {
        throw new Error(response.message || 'Failed to assign roles');
      }
    } catch (error) {
      console.error('Error assigning roles:', error);
      message.error(error.response?.data?.message || error.message || 'Failed to assign roles. Please try again later.');
    }
  };

  // Handler for closing the role assignment modal
  const closeRoleAssignmentModal = () => {
    setRoleAssignmentModalVisible(false);
    setSelectedUser(null);
    roleAssignmentForm.resetFields();
  };

  // Handler for opening the add user form
  const showAddUserModal = () => {
    setEditingUserId(null);
    setUserModalTitle('Add New User');
    userForm.resetFields();
    setUserModalVisible(true);
  };

  // Handle profile picture URL change
  const handleProfilePictureChange = (e) => {
    const url = e.target.value;
    setPreviewImage(url);
  };

  // Handler for opening the edit user form
  const showEditUserModal = (user) => {
    setEditingUserId(user.tenant_user_id);
    setUserModalTitle('Edit User');
    setPreviewImage(user.profile_picture_url);

    // Set form values, handling both old and new contact number formats
    const formValues = {
      name: user.name,
      email: user.email,
      contact_number: {
        country_code: user.contact_number?.country_code || '+1',
        isd_code: user.contact_number?.isd_code || '1',
        number: user.contact_number?.number || '',
      },
      profile_picture_url: user.profile_picture_url || ''
    };

    userForm.setFieldsValue(formValues);
    setUserModalVisible(true);
  };

  // Handler for submitting the user form (both add and edit)
  const handleUserFormSubmit = async (values) => {
    try {
      // Prepare the request payload
      const payload = {
        name: values.name,
        contact_number: {
          country_code: values.contact_number?.country_code || '+1',
          isd_code: values.contact_number?.isd_code || '1',
          number: values.contact_number?.number || ''
        },
        profile_picture_url: values.profile_picture_url || ''
      };

      if (editingUserId) {
        // Update existing user using API with the correct user ID
        const response = await apiService.users.update(editingUserId, payload);
        console.log('Update response:', response);

        if (response.success) {
          // Invalidate and refetch users query
          await queryClient.invalidateQueries(['users']);
          message.success('User updated successfully');
        } else {
          throw new Error(response.message || 'Failed to update user');
        }
      } else {
        // For new users, include email in the payload
        const createPayload = {
          ...payload,
          email: values.email
        };

        // Add new user using API
        const response = await apiService.users.create(createPayload);
        console.log('Create response:', response);

        if (response.success) {
          // Invalidate and refetch users query
          await queryClient.invalidateQueries(['users']);
          message.success('User added successfully');
        } else {
          throw new Error(response.message || 'Failed to add user');
        }
      }

      setUserModalVisible(false);
      setEditingUserId(null);
      userForm.resetFields();
      setPreviewImage(null);
    } catch (error) {
      console.error('Error in handleUserFormSubmit:', error);
      message.error(error.message || 'Failed to add/update user');
    }
  };

  // Handler for closing the modals
  const closeUserModal = () => {
    setUserModalVisible(false);
    setEditingUserId(null);
    userForm.resetFields();
  };

  // Handler for deleting a user
  const handleDeleteUser = async (userId) => {
    try {
      setLoading(true);
      const response = await apiService.users.delete(userId);

      if (response.data?.success) {
        message.success('User deleted successfully');

        // Update local state
        const updatedUsers = users.filter(user => user.tenant_user_id !== userId);
        setUsers(updatedUsers);
        setFilteredUsers(updatedUsers);

        // Refetch users data to ensure we have the latest state
        const { data: usersData } = await apiService.users.getAll();
        if (usersData) {
          setUsers(usersData);
          setFilteredUsers(usersData);
        }
      } else {
        throw new Error(response.data?.message || 'Failed to delete user');
      }
    } catch (error) {
      console.error('Error deleting user:', error);
      const errorMessage = error.response?.data?.message || error.message || 'Failed to delete user. Please try again later.';
      message.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusToggle = (userId, newStatus) => {
    console.log(`Toggling user ${userId} to`, newStatus ? 'Active' : 'Inactive');
  };
  

  const columns = [
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
      align: 'center',
      render: (text, record) => (
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Avatar src={record.profile_picture_url} size="small" />
          <span>{text}</span>
        </div>
      ),
    },
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
      align: 'center',
    },
    {
      title: 'Contact Number',
      dataIndex: 'contact_number',
      key: 'contact_number',
      render: (text) => formatPhoneNumber(text),
      align: 'center',
    },
    {
      title: 'Profile Picture',
      dataIndex: 'profile_picture_url',
      key: 'profile_picture_url',
      align: 'center',
      render: (text) => (
        text ? (
          <Button
            type="link"
            onClick={() => {
              setSelectedImage(text);
              setImagePreviewVisible(true);
            }}
          >
            View Image
          </Button>
        ) : (
          <span className="text-sm text-gray-500">No image</span>
        )
      ),
    },
    {
      title: 'Roles',
      dataIndex: 'roles',
      key: 'roles',
      align: 'center',
      render: (roles) => (
        <div className="flex flex-wrap gap-1">
          {roles?.length > 0 ? (
            roles.map(role => (
              <Tag key={role.tenant_role_id} color="blue">{role.name}</Tag>
            ))
          ) : (
            <span className="text-sm text-gray-500">No roles assigned</span>
          )}
        </div>
      ),
    },
    {
      title: 'Status',
      dataIndex: 'is_active',
      key: 'status',
      align: 'center',
      render: (isActive) => (
        <Badge status={isActive ? 'success' : 'error'} text={isActive ? 'Active' : 'Inactive'} />
      ),
    },
  ];

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-[#111827]">User Management</h1>
        <p className="text-[#6B7280]">Manage user accounts and permissions</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow-sm p-5">
          <div className="flex items-center justify-between mb-4">
            <div className="w-8 h-8 bg-[#EEF2FF] rounded-lg flex items-center justify-center">
              <i className="fas fa-users text-[#6366F1]"></i>
            </div>
          </div>
          <h3 className="font-semibold mb-1">Total Users</h3>
          <p className="text-sm text-[#6B7280] mb-4">{users.length} active user accounts</p>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-5">
          <div className="flex items-center justify-between mb-4">
            <div className="w-8 h-8 bg-[#EEF2FF] rounded-lg flex items-center justify-center">
              <i className="fas fa-user-shield text-[#6366F1]"></i>
            </div>
          </div>
          <h3 className="font-semibold mb-1">Admins</h3>
          <p className="text-sm text-[#6B7280] mb-4">{users.filter(user => user.roles?.[0]?.role_name === 'SUPER_ADMIN').length} administrator accounts</p>
        </div>
      </div>

      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">User Accounts</h2>
        <button
          className="bg-[#6366F1] text-white text-sm px-4 py-2 rounded hover:bg-[#4F46E5] transition-colors"
          onClick={showAddUserModal}
        >
          Add User
        </button>
      </div>

      <div className="bg-white rounded-lg shadow-sm p-4 mb-8">
        <div className="mb-4">
          <SearchBar
            placeholder="Search users by name or email..."
            value={userSearchTerm}
            onChange={setUserSearchTerm}
            onSearch={handleUserSearch}
            className="max-w-md"
          />
        </div>
        {isLoading ? (
          <div className="flex justify-center items-center p-8">
            <Spin size="large" />
          </div>
        ) : error ? (
          <div className="p-6 text-center">
            <p className="text-red-500 mb-4">Error loading users: {error.message}</p>
            <button
              className="bg-gray-200 text-gray-700 text-sm px-4 py-2 rounded hover:bg-gray-300 transition-colors"
              onClick={() => window.location.reload()}
            >
              Retry
            </button>
          </div>
        ) : users && users.length > 0 ? (
          <>
            <div className="overflow-x-auto max-h-[400px] overflow-y-auto">
              <table className="min-w-full divide-y divide-[#E5E7EB]">
                <thead className="bg-gray-50 sticky top-0 z-10 align-middle">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-[#6B7280] uppercase tracking-wider bg-gray-50 align-middle">Name</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-[#6B7280] uppercase tracking-wider bg-gray-50 align-middle">Email</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-[#6B7280] uppercase tracking-wider bg-gray-50 align-middle">Contact Number</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-[#6B7280] uppercase tracking-wider bg-gray-50 align-middle">Profile Picture</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-[#6B7280] uppercase tracking-wider bg-gray-50 align-middle">Roles</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-[#6B7280] uppercase tracking-wider bg-gray-50 align-middle">Status</th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-[#6B7280] uppercase tracking-wider bg-gray-50 align-middle">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-[#E5E7EB]">
                  {getPaginatedUsers().map((user) => {
                    console.log('Rendering user:', user);
                    return (
                      <tr key={user.tenant_user_id}>
                        <td className="px-6 py-4">
                          <div className="text-sm font-medium text-gray-900">{user.name || 'N/A'}</div>
                        </td>
                        <td className="px-6 py-4 text-center">
                          {user.email ? (
                            <a
                              href={`mailto:${user.email}`}
                              className="text-blue-600 hover:underline flex items-center justify-center gap-1"
                            >
                              <MailOutlined />
                              {user.email}
                            </a>
                          ) : (
                            <span className="text-sm text-gray-500">N/A</span>
                          )}
                        </td>
                        <td className="px-6 py-4 text-center">
                          {user.contact_number ? (
                            <a
                              href={`tel:${user.contact_number.number}`}
                              className="text-blue-600 hover:underline flex items-center justify-center gap-1"
                            >
                              <PhoneOutlined />
                              {`${user.contact_number.number}`}
                            </a>
                          ) : (
                            <span className="text-sm text-gray-500">N/A</span>
                          )}
                        </td>
                        <td className="px-6 py-4 text-center">
                          {user.profile_picture_url ? (
                            <Tooltip title="Click to view">
                              <Avatar
                                src={user.profile_picture_url}
                                size={48}
                                shape="circle"
                                style={{ cursor: 'pointer' }}
                                onClick={() => {
                                  setSelectedImage(user.profile_picture_url);
                                  setImagePreviewVisible(true);
                                }}
                                onError={() => false} // allows fallback if image fails
                              >
                                U
                              </Avatar>
                            </Tooltip>
                          ) : (
                            <span className="text-sm text-gray-500">No image</span>
                          )}
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex flex-wrap gap-1">
                            {user.roles?.length > 0 ? (
                              user.roles.map(role => (
                                <Tag key={role.tenant_role_id} color="blue">{role.name}</Tag>
                              ))
                            ) : (
                              <span className="text-sm text-gray-500">No roles assigned</span>
                            )}
                          </div>
                        </td>
                        <td className="px-6 py-4 text-center">
                          <Switch
                            checked={user.is_active}
                            checkedChildren="Active"
                            unCheckedChildren="Inactive"
                            onChange={(checked) => handleStatusToggle(user.tenant_user_id, checked)}
                          />
                        </td>
                        <td className="px-6 py-4 text-right text-sm font-medium">
                          <div className="flex items-center justify-end gap-2">
                            <Button
                              type="primary"
                              icon={<TagOutlined />}
                              onClick={() => showRoleAssignmentModal(user)}
                              className="bg-[#6366F1] hover:bg-[#4F46E5]"
                            >
                              Assign Roles
                            </Button>
                            <Dropdown
                              menu={{
                                items: [
                                  {
                                    key: '1',
                                    label: 'Edit',
                                    icon: <EditOutlined />,
                                    onClick: () => showEditUserModal(user),
                                  },
                                  {
                                    key: '2',
                                    label: (
                                      <Popconfirm
                                        title="Delete User"
                                        description="Are you sure you want to delete this user?"
                                        onConfirm={() => handleDeleteUser(user.tenant_user_id)}
                                        okText="Yes"
                                        cancelText="No"
                                        placement="left"
                                      >
                                        <span className="text-red-500">
                                          <DeleteOutlined /> Delete
                                        </span>
                                      </Popconfirm>
                                    ),
                                    danger: true,
                                  },
                                ],
                              }}
                              placement="bottomRight"
                              trigger={['click']}
                            >
                              <Button type="text" icon={<MoreOutlined />} />
                            </Dropdown>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
            <div className="mt-4 flex justify-end">
              <Pagination
                current={currentPage}
                pageSize={pageSize}
                total={usersData?.pagination?.total || 0}
                onChange={handlePageChange}
                defaultCurrent={1}
                defaultPageSize={10}
                disabled={isLoading}
              />
            </div>
          </>
        ) : (
          <div className="p-6 text-center">
            <p className="text-[#6B7280] mb-4">No users found</p>
            <button
              className="bg-[#6366F1] text-white text-sm px-4 py-2 rounded hover:bg-[#4F46E5] transition-colors"
              onClick={showAddUserModal}
            >
              Add Your First User
            </button>
          </div>
        )}
      </div>

      {/* User Modal (Add/Edit) */}
      <Modal
        title={
          <div className="flex justify-between items-center">
            <span>{userModalTitle}</span>
            <button
              onClick={closeUserModal}
              className="border-none bg-transparent text-gray-500 hover:text-gray-700"
            >
              <CloseOutlined />
            </button>
          </div>
        }
        open={userModalVisible}
        onCancel={closeUserModal}
        footer={null}
        maskStyle={{ backdropFilter: 'blur(4px)' }}
        closeIcon={null}
        className="user-modal"
      >
        <Form
          form={userForm}
          layout="vertical"
          onFinish={handleUserFormSubmit}
          onPress={handleAlphabeticalInput}
        >
          <Form.Item
            name="name"
            label="Full Name"
            rules={[{ required: true, message: 'Please enter full name' }]}
          >
            <Input
              placeholder="Enter full name"
              prefix={<UserOutlined className="text-gray-400" />}
              onKeyPress={handleAlphabeticalInput}
            />
          </Form.Item>

          <Form.Item
            name="email"
            label="Email Address"
            rules={[
              { required: true, message: 'Please enter email' },
              { type: 'email', message: 'Please enter a valid email' }
            ]}
          >
            <Input
              placeholder="Enter email address"
              prefix={<MailOutlined className="text-gray-400" />}
            />
          </Form.Item>

          {/* <Form.Item
            name="password"
            label="Password"
            rules={[
              { required: true, message: 'Please enter password' },
              { min: 8, message: 'Password must be at least 8 characters' }
            ]}
          >
            <Input.Password 
              placeholder="Enter password" 
              prefix={<LockOutlined className="text-gray-400" />} 
            />
          </Form.Item> */}

          <Form.Item
            label="Contact Number"
            required
          >
            <div className="flex space-x-2">
              <Form.Item
                name={['contact_number', 'country_code']}
                noStyle
                initialValue="IN"
              >
                <Select
                  style={{ width: 100 }}
                  showSearch
                  optionFilterProp="children"
                  options={[
                    { value: 'IN', label: 'India (+91)' },
                    { value: 'US', label: 'USA (+1)' },
                    { value: 'GB', label: 'UK (+44)' },
                    { value: 'JP', label: 'Japan (+81)' },
                    { value: 'CN', label: 'China (+86)' },
                    { value: 'DE', label: 'Germany (+49)' },
                    { value: 'FR', label: 'France (+33)' },
                    { value: 'IT', label: 'Italy (+39)' },
                    { value: 'ES', label: 'Spain (+34)' },
                    { value: 'BR', label: 'Brazil (+55)' },
                    { value: 'RU', label: 'Russia (+7)' },
                    { value: 'AU', label: 'Australia (+61)' },
                    { value: 'CA', label: 'Canada (+1)' },
                    { value: 'MX', label: 'Mexico (+52)' },
                    { value: 'ZA', label: 'South Africa (+27)' },
                  ]}
                />
              </Form.Item>
              <Form.Item
                name={['contact_number', 'isd_code']}
                noStyle
                initialValue="91"
              >
                <Select
                  style={{ width: 80 }}
                  options={[
                    { value: '91', label: '+91' },
                    { value: '1', label: '+1' },
                    { value: '44', label: '+44' },
                    { value: '81', label: '+81' },
                    { value: '86', label: '+86' },
                    { value: '49', label: '+49' },
                    { value: '33', label: '+33' },
                    { value: '39', label: '+39' },
                    { value: '34', label: '+34' },
                    { value: '55', label: '+55' },
                    { value: '7', label: '+7' },
                    { value: '61', label: '+61' },
                    { value: '52', label: '+52' },
                    { value: '27', label: '+27' },
                  ]}
                />
              </Form.Item>
              <Form.Item
                name={['contact_number', 'number']}
                noStyle
                rules={[{ required: true, message: 'Please enter phone number' }]}
              >
                <Input
                  placeholder="Enter phone number"
                  prefix={<PhoneOutlined className="text-gray-400" />}
                  maxLength={10}
                  onKeyPress={handleNumericInput}
                />
              </Form.Item>
            </div>
          </Form.Item>

          <Form.Item
            name="profile_picture_url"
            label="Profile Picture URL"
            rules={[{ required: true, message: 'Please enter profile picture URL' }]}
          >
            <Input
              placeholder="Enter profile picture URL"
              onChange={handleProfilePictureChange}
              prefix={<UploadOutlined />}
            />
          </Form.Item>

          <div className="text-center mb-4">
            <Avatar
              size={100}
              src={previewImage}
              icon={!previewImage && <UserOutlined />}
            />
          </div>

          <Form.Item className="mb-0 flex justify-end">
            <Button
              type="default"
              onClick={closeUserModal}
              className="mr-2"
            >
              Cancel
            </Button>
            <Button
              type="primary"
              htmlType="submit"
              className="bg-[#6366F1] hover:bg-[#4F46E5]"
            >
              {editingUserId ? 'Update User' : 'Add User'}
            </Button>
          </Form.Item>
        </Form>
      </Modal>

      {/* Role Assignment Modal */}
      <Modal
        title={
          <div className="flex justify-between items-center">
            <span>Assign Roles to User</span>
            <button
              onClick={closeRoleAssignmentModal}
              className="border-none bg-transparent text-gray-500 hover:text-gray-700"
            >
              <CloseOutlined />
            </button>
          </div>
        }
        open={roleAssignmentModalVisible}
        onCancel={closeRoleAssignmentModal}
        footer={null}
        maskStyle={{ backdropFilter: 'blur(4px)' }}
        closeIcon={null}
        className="role-assignment-modal"
      >
        {selectedUser && (
          <div className="mb-6">
            <div className="flex items-center mb-4">
              <img
                src={selectedUser.profile_picture_url || 'https://randomuser.me/api/portraits/men/1.jpg'}
                alt={selectedUser.name}
                className="h-12 w-12 rounded-full mr-4"
              />
              <div>
                <h3 className="text-lg font-semibold">{selectedUser.name}</h3>
                <p className="text-gray-500">{selectedUser.email}</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-6">
              <div>
                <p className="text-sm text-gray-500">Current Roles</p>
                <div className="flex flex-wrap gap-2">
                  {selectedUser.roles?.map(role => (
                    <Tag key={role.tenant_role_id} color="blue">{role.name}</Tag>
                  ))}
                </div>
              </div>
              <div>
                <p className="text-sm text-gray-500">Status</p>
                <Badge
                  status={selectedUser.is_active ? 'success' : 'error'}
                  text={selectedUser.is_active ? 'Active' : 'Inactive'}
                />
              </div>
            </div>
          </div>
        )}

        <Form
          form={roleAssignmentForm}
          layout="vertical"
          onFinish={handleRoleAssignmentSubmit}
        >
          <Form.Item
            name="roleIds"
            label="Assign Roles"
            rules={[{ required: true, message: 'Please select at least one role' }]}
          >
            <Select
              mode="multiple"
              allowClear
              placeholder="Select roles to assign"
              style={{ width: '100%' }}
              loading={isRolesLoading}
            >
              {roles.map(role => (
                <Select.Option key={role.tenant_role_id} value={role.tenant_role_id}>
                  {role.name}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item className="mb-0 flex justify-end">
            <Button
              type="default"
              onClick={closeRoleAssignmentModal}
              className="mr-2"
            >
              Cancel
            </Button>
            <Button
              type="primary"
              htmlType="submit"
              className="bg-[#6366F1] hover:bg-[#4F46E5]"
            >
              Assign Roles
            </Button>
          </Form.Item>
        </Form>
      </Modal>

      {/* Image Preview Modal */}
      <Modal
        title="Profile Picture Preview"
        open={imagePreviewVisible}
        onCancel={() => setImagePreviewVisible(false)}
        footer={null}
        width={600}
      >
        <div className="flex justify-center">
          <img
            src={selectedImage}
            alt="Profile Preview"
            className="max-w-full h-auto"
          />
        </div>
      </Modal>
    </div>
  );
};

export default UsersManagement;
