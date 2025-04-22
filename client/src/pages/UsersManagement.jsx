import { useState, useEffect } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { message, Spin } from 'antd';
import SearchBar from '../components/common/SearchBar';
import { apiService } from '../services/apiService';
import UsersTable from '../components/users/UsersTable';
import UserFormModal from '../components/users/UserFormModal';
import RoleAssignmentModal from '../components/users/RoleAssignmentModal';

const UsersManagement = () => {
  const [users, setUsers] = useState([]);
  const [roles, setRoles] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [userSearchTerm, setUserSearchTerm] = useState('');
  const [userModalVisible, setUserModalVisible] = useState(false);
  const [roleAssignmentModalVisible, setRoleAssignmentModalVisible] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [editingUserId, setEditingUserId] = useState(null);
  const [userModalTitle, setUserModalTitle] = useState('Add New User');
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const queryClient = useQueryClient();
  const [totalUsers, setTotalUsers] = useState(0);

  // Fetch users data using React Query
  const { data: usersData, isLoading, error, refetch } = useQuery({
    queryKey: ['users', currentPage, pageSize],
    queryFn: async () => {
      try {
        const response = await apiService.users.getAll({
          page: currentPage,
          page_size: pageSize
        });
        const totalUsersResponse = await apiService.users.getAll({
          page: 1,
          page_size: 50
        });
        if (totalUsersResponse && totalUsersResponse.data) {
          setTotalUsers(totalUsersResponse.data.length);
        }

        const usersArray = response?.data || [];
        const pagination = response?.meta?.pagination || {};

        const processedUsers = usersArray.map(user => ({
          ...user,
          roles: Array.isArray(user.roles)
            ? user.roles.map(role => ({
              tenant_role_id: role.tenant_role_id,
              name: role.name
            }))
            : []
        }));

        return {
          users: processedUsers,
          pagination
        };
      } catch (error) {
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
  const { data: rolesData, isLoading: isRolesLoading } = useQuery({
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

  const handlePageChange = (page, pageSize) => {
    setCurrentPage(page);
    setPageSize(pageSize);
    if (!userSearchTerm) {
      queryClient.invalidateQueries(['users']);
    }
  };

  const getPaginatedUsers = () => {
    return userSearchTerm ? filteredUsers : (usersData?.users || []);
  };

  const showRoleAssignmentModal = (user) => {
    setSelectedUser(user);
    setRoleAssignmentModalVisible(true);
  };

  const handleRoleAssignmentSubmit = async (values) => {
    try {
      if (!selectedUser?.tenant_user_id) {
        throw new Error('User ID is required');
      }

      if (!values.roleIds || !Array.isArray(values.roleIds) || values.roleIds.length === 0) {
        throw new Error('Please select at least one role');
      }

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

      const response = await apiService.userRoles.assign(payload);

      if (response.success) {
        await queryClient.invalidateQueries(['users']);
        message.success('Roles assigned successfully');
        setRoleAssignmentModalVisible(false);
        setSelectedUser(null);
      } else {
        throw new Error(response.message || 'Failed to assign roles');
      }
    } catch (error) {
      console.error('Error assigning roles:', error);
      message.error(error.response?.data?.message || error.message || 'Failed to assign roles. Please try again later.');
    }
  };

  const showAddUserModal = () => {
    setEditingUserId(null);
    setUserModalTitle('Add New User');
    setUserModalVisible(true);
  };

  const showEditUserModal = (user) => {
    setEditingUserId(user.tenant_user_id);
    setUserModalTitle('Edit User');
    setSelectedUser(user);
    setUserModalVisible(true);
  };

  const handleUserFormSubmit = async (values) => {
    try {
      setLoading(true);
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
        const response = await apiService.users.update(editingUserId, payload);
        if (response.success) {
          await queryClient.invalidateQueries(['users']);
          message.success('User updated successfully');
        } else {
          throw new Error(response.message || 'Failed to update user');
        }
      } else {
        const createPayload = {
          ...payload,
          email: values.email
        };
        const response = await apiService.users.create(createPayload);
        if (response.success) {
          await queryClient.invalidateQueries(['users']);
          message.success('User added successfully');
        } else {
          throw new Error(response.message || 'Failed to add user');
        }
      }

      setUserModalVisible(false);
      setEditingUserId(null);
      setSelectedUser(null);
    } catch (error) {
      console.error('Error in handleUserFormSubmit:', error);
      message.error(error.message || 'Failed to add/update user');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteUser = async (userId) => {
    try {
      setLoading(true);
      const response = await apiService.users.delete(userId);

      if (response.data?.success) {
        message.success('User deleted successfully');
        await queryClient.invalidateQueries(['users']);
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
          <p className="text-sm text-[#6B7280] mb-4">{totalUsers} active user accounts</p>
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
          <UsersTable
            users={getPaginatedUsers()}
            loading={loading}
            onEditUser={showEditUserModal}
            onDeleteUser={handleDeleteUser}
            onAssignRoles={showRoleAssignmentModal}
            onStatusToggle={handleStatusToggle}
            currentPage={currentPage}
            pageSize={pageSize}
            total={usersData?.pagination?.total || 0}
            onPageChange={handlePageChange}
          />
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

      <UserFormModal
        visible={userModalVisible}
        onClose={() => {
          setUserModalVisible(false);
          setEditingUserId(null);
          setSelectedUser(null);
        }}
        onSubmit={handleUserFormSubmit}
        initialValues={selectedUser}
        title={userModalTitle}
        loading={loading}
      />

      <RoleAssignmentModal
        visible={roleAssignmentModalVisible}
        onClose={() => {
          setRoleAssignmentModalVisible(false);
          setSelectedUser(null);
        }}
        onSubmit={handleRoleAssignmentSubmit}
        selectedUser={selectedUser}
        roles={roles}
        loading={loading}
      />
    </div>
  );
};

export default UsersManagement;
