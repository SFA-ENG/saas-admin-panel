import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { Modal, Form, Input, Select, Button, message, Badge, Tag, Dropdown } from 'antd';
import { 
  CloseOutlined, 
  UserOutlined, 
  MailOutlined, 
  LockOutlined, 
  PhoneOutlined, 
  TagOutlined, 
  InfoCircleOutlined, 
  EditOutlined, 
  DeleteOutlined, 
  MoreOutlined,
  SearchOutlined
} from '@ant-design/icons';
import SearchBar from '../components/common/SearchBar';

const UserManagement = () => {
  // Mock data for users
  const dummyUsers = [
    {
      id: 1,
      name: 'John Smith',
      email: 'john.smith@example.com',
      role: 'Administrator',
      password: 'Password123',
      phone: '+1 (555) 123-4567',
      status: 'active',
      avatar: 'https://randomuser.me/api/portraits/men/32.jpg'
    },
    {
      id: 2,
      name: 'Emily Johnson',
      email: 'emily.johnson@example.com',
      role: 'Manager',
      password: 'Password123',
      phone: '+1 (555) 234-5678',
      status: 'active',
      avatar: 'https://randomuser.me/api/portraits/women/26.jpg'
    },
    {
      id: 3,
      name: 'Michael Brown',
      email: 'michael.brown@example.com',
      role: 'Coach',
      password: 'Password123',
      phone: '+1 (555) 345-6789',
      status: 'active',
      avatar: 'https://randomuser.me/api/portraits/men/41.jpg'
    },
    {
      id: 4,
      name: 'Sarah Williams',
      email: 'sarah.williams@example.com',
      role: 'Analyst',
      password: 'Password123',
      phone: '+1 (555) 456-7890',
      status: 'inactive',
      avatar: 'https://randomuser.me/api/portraits/women/67.jpg'
    },
    {
      id: 5,
      name: 'David Lee',
      email: 'david.lee@example.com',
      role: 'Staff',
      password: 'Password123',
      phone: '+1 (555) 567-8901',
      status: 'active',
      avatar: 'https://randomuser.me/api/portraits/men/59.jpg'
    },
    {
      id: 6,
      name: 'Jennifer Martinez',
      email: 'jennifer.martinez@example.com',
      role: 'Coach',
      password: 'Password123',
      phone: '+1 (555) 678-9012',
      status: 'active',
      avatar: 'https://randomuser.me/api/portraits/women/33.jpg'
    },
    {
      id: 7,
      name: 'Robert Wilson',
      email: 'robert.wilson@example.com',
      role: 'Manager',
      password: 'Password123',
      phone: '+1 (555) 789-0123',
      status: 'active',
      avatar: 'https://randomuser.me/api/portraits/men/45.jpg'
    },
    {
      id: 8,
      name: 'Jessica Taylor',
      email: 'jessica.taylor@example.com',
      role: 'Administrator',
      password: 'Password123',
      phone: '+1 (555) 890-1234',
      status: 'active',
      avatar: 'https://randomuser.me/api/portraits/women/52.jpg'
    },
    {
      id: 9,
      name: 'Thomas Anderson',
      email: 'thomas.anderson@example.com',
      role: 'Analyst',
      password: 'Password123',
      phone: '+1 (555) 901-2345',
      status: 'inactive',
      avatar: 'https://randomuser.me/api/portraits/men/72.jpg'
    }
  ];

  // Mock data for roles
  const dummyRoles = [
    {
      id: 1,
      name: 'Administrator',
      description: 'Full access to all features and settings',
      users: 2,
      color: '#FF5733',
      permissions: ['manage_users', 'manage_roles', 'admin_access', 'manage_tournaments', 'manage_teams', 'manage_matches', 'view_reports']
    },
    {
      id: 2,
      name: 'Manager',
      description: 'Manage tournaments, teams, and matches',
      users: 3,
      color: '#33A5FF',
      permissions: ['manage_tournaments', 'manage_teams', 'manage_matches', 'view_reports']
    },
    {
      id: 3,
      name: 'Coach',
      description: 'Manage team details and view match data',
      users: 5,
      color: '#33FF57',
      permissions: ['manage_teams', 'view_reports']
    },
    {
      id: 4,
      name: 'Analyst',
      description: 'View and analyze match statistics',
      users: 2,
      color: '#FF33E9',
      permissions: ['view_reports']
    },
    {
      id: 5,
      name: 'Staff',
      description: 'Basic access to the platform',
      users: 3,
      color: '#FFBD33',
      permissions: []
    }
  ];

  // Mock data for user role mapping
  const dummyUserRoleMappings = [
    { id: 1, userId: 1, userName: 'John Smith', userEmail: 'john.smith@example.com', roleIds: [1], roleNames: ['Administrator'], assignedDate: '2023-01-15' },
    { id: 2, userId: 2, userName: 'Emily Johnson', userEmail: 'emily.johnson@example.com', roleIds: [2], roleNames: ['Manager'], assignedDate: '2023-02-20' },
    { id: 3, userId: 3, userName: 'Michael Brown', userEmail: 'michael.brown@example.com', roleIds: [3], roleNames: ['Coach'], assignedDate: '2023-03-10' },
    { id: 4, userId: 4, userName: 'Sarah Williams', userEmail: 'sarah.williams@example.com', roleIds: [4], roleNames: ['Analyst'], assignedDate: '2023-04-05' },
    { id: 5, userId: 5, userName: 'David Lee', userEmail: 'david.lee@example.com', roleIds: [5], roleNames: ['Staff'], assignedDate: '2023-05-12' },
    { id: 6, userId: 1, userName: 'John Smith', userEmail: 'john.smith@example.com', roleIds: [2, 3], roleNames: ['Manager', 'Coach'], assignedDate: '2023-06-18' },
    { id: 7, userId: 6, userName: 'Jennifer Martinez', userEmail: 'jennifer.martinez@example.com', roleIds: [3, 4], roleNames: ['Coach', 'Analyst'], assignedDate: '2023-07-22' },
    { id: 8, userId: 7, userName: 'Robert Wilson', userEmail: 'robert.wilson@example.com', roleIds: [2, 5], roleNames: ['Manager', 'Staff'], assignedDate: '2023-08-14' },
    { id: 9, userId: 8, userName: 'Jessica Taylor', userEmail: 'jessica.taylor@example.com', roleIds: [1, 2, 4], roleNames: ['Administrator', 'Manager', 'Analyst'], assignedDate: '2023-09-30' }
  ];

  const [users, setUsers] = useState([]);
  const [roles, setRoles] = useState([]);
  const [userRoleMappings, setUserRoleMappings] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [filteredRoles, setFilteredRoles] = useState([]);
  const [filteredUserRoleMappings, setFilteredUserRoleMappings] = useState([]);
  const [userSearchTerm, setUserSearchTerm] = useState('');
  const [roleSearchTerm, setRoleSearchTerm] = useState('');
  const [mappingSearchTerm, setMappingSearchTerm] = useState('');
  const [userModalVisible, setUserModalVisible] = useState(false);
  const [roleModalVisible, setRoleModalVisible] = useState(false);
  const [mappingModalVisible, setMappingModalVisible] = useState(false);
  const [userForm] = Form.useForm();
  const [roleForm] = Form.useForm();
  const [mappingForm] = Form.useForm();
  const [editingUserId, setEditingUserId] = useState(null);
  const [editingRoleId, setEditingRoleId] = useState(null);
  const [editingMappingId, setEditingMappingId] = useState(null);
  const [userModalTitle, setUserModalTitle] = useState('Add New User');
  const [roleModalTitle, setRoleModalTitle] = useState('Create New Role');
  const [mappingModalTitle, setMappingModalTitle] = useState('Assign Roles to User');
  
  // Initialize with dummy data
  useEffect(() => {
    setUsers(dummyUsers);
    setRoles(dummyRoles);
    setUserRoleMappings(dummyUserRoleMappings);
    setFilteredUsers(dummyUsers);
    setFilteredRoles(dummyRoles);
    setFilteredUserRoleMappings(dummyUserRoleMappings);
  }, []);
  
  // Handle user search
  const handleUserSearch = (searchTerm) => {
    setUserSearchTerm(searchTerm);
    if (!searchTerm.trim()) {
      setFilteredUsers(users);
      return;
    }
    
    const filtered = users.filter(user => 
      user.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredUsers(filtered);
  };
  
  // Handle role search
  const handleRoleSearch = (searchTerm) => {
    setRoleSearchTerm(searchTerm);
    if (!searchTerm.trim()) {
      setFilteredRoles(roles);
      return;
    }
    
    const filtered = roles.filter(role => 
      role.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredRoles(filtered);
  };

  // Handle mapping search
  const handleMappingSearch = (searchTerm) => {
    setMappingSearchTerm(searchTerm);
    if (!searchTerm.trim()) {
      setFilteredUserRoleMappings(userRoleMappings);
      return;
    }
    
    const filtered = userRoleMappings.filter(mapping => 
      mapping.userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      mapping.roleNames.some(roleName => 
        roleName.toLowerCase().includes(searchTerm.toLowerCase())
      )
    );
    setFilteredUserRoleMappings(filtered);
  };
  
  // Handler for showing the add mapping modal
  const showAddMappingModal = () => {
    setEditingMappingId(null);
    setMappingModalTitle('Assign Roles to User');
    mappingForm.resetFields();
    setMappingModalVisible(true);
  };
  
  // Handler for showing the edit mapping modal
  const showEditMappingModal = (mapping) => {
    setEditingMappingId(mapping.id);
    setMappingModalTitle('Edit User Role Assignment');
    mappingForm.setFieldsValue({
      userId: mapping.userId,
      roleIds: mapping.roleIds,
    });
    setMappingModalVisible(true);
  };
  
  // Handler for submitting the mapping form
  const handleMappingFormSubmit = (values) => {
    const selectedUser = users.find(user => user.id === values.userId);
    const selectedRoles = roles.filter(role => values.roleIds.includes(role.id));
    
    if (editingMappingId) {
      // Edit existing mapping
      const updatedMappings = userRoleMappings.map(mapping => {
        if (mapping.id === editingMappingId) {
          return {
            ...mapping,
            userId: values.userId,
            userName: selectedUser.name,
            userEmail: selectedUser.email,
            roleIds: values.roleIds,
            roleNames: selectedRoles.map(role => role.name)
          };
        }
        return mapping;
      });
      
      setUserRoleMappings(updatedMappings);
      
      // Update filtered mappings
      if (mappingSearchTerm) {
        handleMappingSearch(mappingSearchTerm);
      } else {
        setFilteredUserRoleMappings(updatedMappings);
      }
      
      console.log('Updated Mapping:', { id: editingMappingId, ...values });
      message.success('User role assignment updated successfully');
    } else {
      // Add new mapping
      const newMapping = {
        id: userRoleMappings.length + 1,
        userId: values.userId,
        userName: selectedUser.name,
        userEmail: selectedUser.email,
        roleIds: values.roleIds,
        roleNames: selectedRoles.map(role => role.name),
        assignedDate: new Date().toISOString().split('T')[0]
      };
      
      const newMappings = [...userRoleMappings, newMapping];
      setUserRoleMappings(newMappings);
      
      // Update filtered mappings
      if (mappingSearchTerm) {
        handleMappingSearch(mappingSearchTerm);
      } else {
        setFilteredUserRoleMappings(newMappings);
      }
      
      console.log('New Mapping:', newMapping);
      message.success('User role assigned successfully');
    }
    
    setMappingModalVisible(false);
    setEditingMappingId(null);
    mappingForm.resetFields();
  };
  
  // Handler for closing the mapping modal
  const closeMappingModal = () => {
    setMappingModalVisible(false);
    setEditingMappingId(null);
    mappingForm.resetFields();
  };

  // Fetch users data
  const { data, isLoading } = useQuery({
    queryKey: ['/api/users'],
    enabled: false, // Disable actual fetch for now since we're using state
  });

  // Handler for opening the add user form
  const showAddUserModal = () => {
    setEditingUserId(null);
    setUserModalTitle('Add New User');
    userForm.resetFields();
    setUserModalVisible(true);
  };
  
  // Handler for opening the edit user form
  const showEditUserModal = (user) => {
    setEditingUserId(user.id);
    setUserModalTitle('Edit User');
    userForm.setFieldsValue({
      name: user.name,
      email: user.email,
      password: user.password,
      phone: user.phone,
      role: user.role.toLowerCase(),
    });
    setUserModalVisible(true);
  };

  // Handler for opening the add role form
  const showAddRoleModal = () => {
    setEditingRoleId(null);
    setRoleModalTitle('Create New Role');
    roleForm.resetFields();
    setRoleModalVisible(true);
  };
  
  // Handler for opening the edit role form
  const showEditRoleModal = (role) => {
    setEditingRoleId(role.id);
    setRoleModalTitle('Edit Role');
    roleForm.setFieldsValue({
      name: role.name,
      description: role.description,
      permissions: role.permissions,
      color: role.color,
    });
    setRoleModalVisible(true);
  };

  // Handler for submitting the user form (both add and edit)
  const handleUserFormSubmit = (values) => {
    if (editingUserId) {
      // Edit existing user
      const updatedUsers = users.map(user => {
        if (user.id === editingUserId) {
          return { ...user, ...values };
        }
        return user;
      });
      setUsers(updatedUsers);
      
      // Update filtered users
      if (userSearchTerm) {
        handleUserSearch(userSearchTerm);
      } else {
        setFilteredUsers(updatedUsers);
      }
      
      console.log('Updated User:', { id: editingUserId, ...values });
      message.success('User updated successfully');
    } else {
      // Add new user
      const newUser = {
        id: users.length + 1,
        ...values,
        status: 'active',
        avatar: 'https://randomuser.me/api/portraits/men/1.jpg'
      };
      const newUsers = [...users, newUser];
      setUsers(newUsers);
      
      // Update filtered users
      if (userSearchTerm) {
        handleUserSearch(userSearchTerm);
      } else {
        setFilteredUsers(newUsers);
      }
      
      console.log('New User:', newUser);
      message.success('User added successfully');
    }
    setUserModalVisible(false);
    setEditingUserId(null);
    userForm.resetFields();
  };

  // Handler for submitting the role form (both add and edit)
  const handleRoleFormSubmit = (values) => {
    if (editingRoleId) {
      // Edit existing role
      const updatedRoles = roles.map(role => {
        if (role.id === editingRoleId) {
          return { ...role, ...values };
        }
        return role;
      });
      setRoles(updatedRoles);
      
      // Update filtered roles
      if (roleSearchTerm) {
        handleRoleSearch(roleSearchTerm);
      } else {
        setFilteredRoles(updatedRoles);
      }
      
      console.log('Updated Role:', { id: editingRoleId, ...values });
      message.success('Role updated successfully');
    } else {
      // Add new role
      const newRole = {
        id: roles.length + 1,
        ...values,
        users: 0
      };
      const newRoles = [...roles, newRole];
      setRoles(newRoles);
      
      // Update filtered roles
      if (roleSearchTerm) {
        handleRoleSearch(roleSearchTerm);
      } else {
        setFilteredRoles(newRoles);
      }
      
      console.log('New Role:', newRole);
      message.success('Role added successfully');
    }
    setRoleModalVisible(false);
    setEditingRoleId(null);
    roleForm.resetFields();
  };

  // Handler for closing the modals
  const closeUserModal = () => {
    setUserModalVisible(false);
    setEditingUserId(null);
    userForm.resetFields();
  };

  const closeRoleModal = () => {
    setRoleModalVisible(false);
    setEditingRoleId(null);
    roleForm.resetFields();
  };

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-[#111827]">User Management</h1>
        <p className="text-[#6B7280]">Manage user accounts and permissions</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow-sm p-5">
          <div className="flex items-center justify-between mb-4">
            <div className="w-8 h-8 bg-[#EEF2FF] rounded-lg flex items-center justify-center">
              <i className="fas fa-users text-[#6366F1]"></i>
            </div>
          </div>
          <h3 className="font-semibold mb-1">Total Users</h3>
          <p className="text-sm text-[#6B7280] mb-4">9 active user accounts</p>
        </div>
        
        <div className="bg-white rounded-lg shadow-sm p-5">
          <div className="flex items-center justify-between mb-4">
            <div className="w-8 h-8 bg-[#EEF2FF] rounded-lg flex items-center justify-center">
              <i className="fas fa-user-tag text-[#6366F1]"></i>
            </div>
          </div>
          <h3 className="font-semibold mb-1">Roles</h3>
          <p className="text-sm text-[#6B7280] mb-4">5 different user roles configured</p>
        </div>
        
        <div className="bg-white rounded-lg shadow-sm p-5">
          <div className="flex items-center justify-between mb-4">
            <div className="w-8 h-8 bg-[#EEF2FF] rounded-lg flex items-center justify-center">
              <i className="fas fa-user-shield text-[#6366F1]"></i>
            </div>
          </div>
          <h3 className="font-semibold mb-1">Admins</h3>
          <p className="text-sm text-[#6B7280] mb-4">3 administrator accounts</p>
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
            placeholder="Search users by name..."
            value={userSearchTerm}
            onChange={setUserSearchTerm}
            onSearch={handleUserSearch}
            className="max-w-md"
          />
        </div>
        {isLoading ? (
          <p>Loading users...</p>
        ) : filteredUsers && filteredUsers.length > 0 ? (
          <div className="overflow-x-auto max-h-[400px] overflow-y-auto">
            <table className="min-w-full divide-y divide-[#E5E7EB]">
              <thead className="bg-gray-50 sticky top-0">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-[#6B7280] uppercase tracking-wider">Name</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-[#6B7280] uppercase tracking-wider">Email</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-[#6B7280] uppercase tracking-wider">Role</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-[#6B7280] uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-[#6B7280] uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-[#E5E7EB]">
                {filteredUsers.map((user) => (
                  <tr key={user.id}>
                    <td className="px-6 py-4">
                      <div className="flex items-center">
                        <img 
                          src={user.avatar} 
                          alt={user.name} 
                          className="h-8 w-8 rounded-full mr-3"
                        />
                        <div>
                          <div className="text-sm font-medium text-gray-900">{user.name}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-500">{user.email}</div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-[#EEF2FF] text-[#6366F1]">
                        {user.role}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <Badge 
                        status={user.status === 'active' ? 'success' : 'error'} 
                        text={user.status === 'active' ? 'Active' : 'Inactive'} 
                      />
                    </td>
                    <td className="px-6 py-4 text-right text-sm font-medium">
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
                              label: 'Delete',
                              icon: <DeleteOutlined />,
                              danger: true,
                            },
                          ],
                        }}
                        placement="bottomRight"
                        trigger={['click']}
                      >
                        <Button type="text" icon={<MoreOutlined />} />
                      </Dropdown>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="p-6 text-center">
            {userSearchTerm ? (
              <>
                <p className="text-[#6B7280] mb-4">No users match your search criteria</p>
                <button 
                  className="bg-gray-200 text-gray-700 text-sm px-4 py-2 rounded hover:bg-gray-300 transition-colors"
                  onClick={() => handleUserSearch('')}
                >
                  Clear Search
                </button>
              </>
            ) : (
              <>
                <p className="text-[#6B7280] mb-4">No users found</p>
                <button 
                  className="bg-[#6366F1] text-white text-sm px-4 py-2 rounded hover:bg-[#4F46E5] transition-colors"
                  onClick={showAddUserModal}
                >
                  Add Your First User
                </button>
              </>
            )}
          </div>
        )}
      </div>
      
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">User Roles</h2>
        <button 
          className="bg-[#6366F1] text-white text-sm px-4 py-2 rounded hover:bg-[#4F46E5] transition-colors"
          onClick={showAddRoleModal}
        >
          Create Role
        </button>
      </div>
      
      <div className="bg-white rounded-lg shadow-sm p-4 mb-8">
        <div className="mb-4">
          <SearchBar
            placeholder="Search roles by name..."
            value={roleSearchTerm}
            onChange={setRoleSearchTerm}
            onSearch={handleRoleSearch}
            className="max-w-md"
          />
        </div>
        {isLoading ? (
          <p>Loading roles...</p>
        ) : filteredRoles && filteredRoles.length > 0 ? (
          <div className="overflow-x-auto max-h-[400px] overflow-y-auto">
            <table className="min-w-full divide-y divide-[#E5E7EB]">
              <thead className="bg-gray-50 sticky top-0">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-[#6B7280] uppercase tracking-wider">Role Name</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-[#6B7280] uppercase tracking-wider">Description</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-[#6B7280] uppercase tracking-wider">Users</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-[#6B7280] uppercase tracking-wider">Permissions</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-[#6B7280] uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-[#E5E7EB]">
                {filteredRoles.map((role) => (
                  <tr key={role.id}>
                    <td className="px-6 py-4">
                      <div className="flex items-center">
                        <div className="w-4 h-4 rounded-full mr-3" style={{ backgroundColor: role.color }}></div>
                        <div className="text-sm font-medium text-gray-900">{role.name}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-500">{role.description}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-500">
                        <span className="px-2 py-1 text-xs font-medium bg-[#EEF2FF] text-[#6366F1] rounded">
                          {role.users} {role.users === 1 ? 'user' : 'users'}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-wrap gap-1 max-w-xs">
                        {role.permissions.length > 0 ? (
                          role.permissions.slice(0, 3).map((permission, index) => (
                            <Tag key={index} color={role.color} className="mr-1 mb-1">
                              {permission.split('_').map(word => 
                                word.charAt(0).toUpperCase() + word.slice(1)
                              ).join(' ')}
                            </Tag>
                          ))
                        ) : (
                          <span className="text-xs text-gray-500">No permissions</span>
                        )}
                        {role.permissions.length > 3 && (
                          <Dropdown
                            menu={{
                              items: role.permissions.slice(3).map((perm, idx) => ({
                                key: idx,
                                label: perm.split('_').map(word => 
                                  word.charAt(0).toUpperCase() + word.slice(1)
                                ).join(' ')
                              }))
                            }}
                            placement="bottomLeft"
                          >
                            <Tag className="cursor-pointer">+{role.permissions.length - 3} more</Tag>
                          </Dropdown>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right text-sm font-medium">
                      <Dropdown
                        menu={{
                          items: [
                            {
                              key: '1',
                              label: 'Edit',
                              icon: <EditOutlined />,
                              onClick: () => showEditRoleModal(role),
                            },
                            {
                              key: '2',
                              label: 'Delete',
                              icon: <DeleteOutlined />,
                              danger: true,
                            },
                          ],
                        }}
                        placement="bottomRight"
                        trigger={['click']}
                      >
                        <Button type="text" icon={<MoreOutlined />} />
                      </Dropdown>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="p-6 text-center">
            {roleSearchTerm ? (
              <>
                <p className="text-[#6B7280] mb-4">No roles match your search criteria</p>
                <button 
                  className="bg-gray-200 text-gray-700 text-sm px-4 py-2 rounded hover:bg-gray-300 transition-colors"
                  onClick={() => handleRoleSearch('')}
                >
                  Clear Search
                </button>
              </>
            ) : (
              <>
                <p className="text-[#6B7280] mb-4">No user roles defined</p>
                <button 
                  className="bg-[#6366F1] text-white text-sm px-4 py-2 rounded hover:bg-[#4F46E5] transition-colors"
                  onClick={showAddRoleModal}
                >
                  Create Your First Role
                </button>
              </>
            )}
          </div>
        )}
      </div>

      {/* User-Role Mapping Table */}
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">User-Role Mappings</h2>
        <button 
          className="bg-[#6366F1] text-white text-sm px-4 py-2 rounded hover:bg-[#4F46E5] transition-colors"
          onClick={showAddMappingModal}
        >
          Assign Roles
        </button>
      </div>
      
      <div className="bg-white rounded-lg shadow-sm p-4 mb-8">
        <div className="mb-4">
          <SearchBar
            placeholder="Search mappings by user or role..."
            value={mappingSearchTerm}
            onChange={setMappingSearchTerm}
            onSearch={handleMappingSearch}
            className="max-w-md"
          />
        </div>
        {isLoading ? (
          <p>Loading mappings...</p>
        ) : filteredUserRoleMappings && filteredUserRoleMappings.length > 0 ? (
          <div className="overflow-x-auto max-h-[400px] overflow-y-auto">
            <table className="min-w-full divide-y divide-[#E5E7EB]">
              <thead className="bg-gray-50 sticky top-0">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-[#6B7280] uppercase tracking-wider">User</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-[#6B7280] uppercase tracking-wider">Email</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-[#6B7280] uppercase tracking-wider">Role</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-[#6B7280] uppercase tracking-wider">Assigned Date</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-[#6B7280] uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-[#E5E7EB]">
                {filteredUserRoleMappings.map((mapping) => (
                  <tr key={mapping.id}>
                    <td className="px-6 py-4">
                      <div className="text-sm font-medium text-gray-900">{mapping.userName}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-500">{mapping.userEmail}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-wrap gap-1">
                        {mapping.roleNames.map((roleName, index) => (
                          <span 
                            key={index} 
                            className="px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-[#EEF2FF] text-[#6366F1] mr-1"
                          >
                            {roleName}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-500">{mapping.assignedDate}</div>
                    </td>
                    <td className="px-6 py-4 text-right text-sm font-medium">
                      <Dropdown
                        menu={{
                          items: [
                            {
                              key: '1',
                              label: 'Edit',
                              icon: <EditOutlined />,
                              onClick: () => showEditMappingModal(mapping),
                            },
                            {
                              key: '2',
                              label: 'Remove',
                              icon: <DeleteOutlined />,
                              danger: true,
                            },
                          ],
                        }}
                        placement="bottomRight"
                        trigger={['click']}
                      >
                        <Button type="text" icon={<MoreOutlined />} />
                      </Dropdown>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="p-6 text-center">
            {mappingSearchTerm ? (
              <>
                <p className="text-[#6B7280] mb-4">No mappings match your search criteria</p>
                <button 
                  className="bg-gray-200 text-gray-700 text-sm px-4 py-2 rounded hover:bg-gray-300 transition-colors"
                  onClick={() => handleMappingSearch('')}
                >
                  Clear Search
                </button>
              </>
            ) : (
              <>
                <p className="text-[#6B7280] mb-4">No user-role mappings defined</p>
              </>
            )}
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
        >
          <Form.Item
            name="name"
            label="Full Name"
            rules={[{ required: true, message: 'Please enter full name' }]}
          >
            <Input 
              placeholder="Enter full name" 
              prefix={<UserOutlined className="text-gray-400" />} 
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
          
          <Form.Item
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
          </Form.Item>
          
          <Form.Item
            name="phone"
            label="Phone Number"
          >
            <Input 
              placeholder="Enter phone number" 
              prefix={<PhoneOutlined className="text-gray-400" />} 
            />
          </Form.Item>
          
          <Form.Item
            name="role"
            label="User Role"
            rules={[{ required: true, message: 'Please select a role' }]}
          >
            <Select placeholder="Select user role">
              <Select.Option value="admin">Administrator</Select.Option>
              <Select.Option value="manager">Manager</Select.Option>
              <Select.Option value="staff">Staff</Select.Option>
              <Select.Option value="coach">Coach</Select.Option>
              <Select.Option value="analyst">Analyst</Select.Option>
            </Select>
          </Form.Item>
          
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

      {/* Role Modal (Add/Edit) */}
      <Modal
        title={
          <div className="flex justify-between items-center">
            <span>{roleModalTitle}</span>
            <button 
              onClick={closeRoleModal}
              className="border-none bg-transparent text-gray-500 hover:text-gray-700"
            >
              <CloseOutlined />
            </button>
          </div>
        }
        open={roleModalVisible}
        onCancel={closeRoleModal}
        footer={null}
        maskStyle={{ backdropFilter: 'blur(4px)' }}
        closeIcon={null}
        className="role-modal"
      >
        <Form
          form={roleForm}
          layout="vertical"
          onFinish={handleRoleFormSubmit}
        >
          <Form.Item
            name="name"
            label="Role Name"
            rules={[{ required: true, message: 'Please enter role name' }]}
          >
            <Input 
              placeholder="Enter role name" 
              prefix={<TagOutlined className="text-gray-400" />} 
            />
          </Form.Item>
          
          <Form.Item
            name="description"
            label="Role Description"
            rules={[{ required: true, message: 'Please enter role description' }]}
          >
            <Input.TextArea 
              placeholder="Enter role description" 
              rows={4}
            />
          </Form.Item>
          
          <Form.Item
            name="permissions"
            label="Permissions"
            rules={[{ required: true, message: 'Please select permissions' }]}
          >
            <Select
              mode="multiple"
              allowClear
              placeholder="Select permissions"
              style={{ width: '100%' }}
            >
              <Select.Option value="manage_users">Manage Users</Select.Option>
              <Select.Option value="manage_roles">Manage Roles</Select.Option>
              <Select.Option value="manage_tournaments">Manage Tournaments</Select.Option>
              <Select.Option value="manage_teams">Manage Teams</Select.Option>
              <Select.Option value="manage_matches">Manage Matches</Select.Option>
              <Select.Option value="view_reports">View Reports</Select.Option>
              <Select.Option value="admin_access">Admin Access</Select.Option>
            </Select>
          </Form.Item>
          
          <Form.Item
            name="color"
            label="Role Color"
          >
            <Input 
              type="color" 
              defaultValue="#6366F1"
              className="w-full h-10" 
            />
          </Form.Item>
          
          <Form.Item className="mb-0 flex justify-end">
            <Button
              type="default"
              onClick={closeRoleModal}
              className="mr-2"
            >
              Cancel
            </Button>
            <Button
              type="primary"
              htmlType="submit"
              className="bg-[#6366F1] hover:bg-[#4F46E5]"
            >
              {editingRoleId ? 'Update Role' : 'Create Role'}
            </Button>
          </Form.Item>
        </Form>
      </Modal>

      {/* User-Role Mapping Modal */}
      <Modal
        title={
          <div className="flex justify-between items-center">
            <span>{mappingModalTitle}</span>
            <button 
              onClick={closeMappingModal}
              className="border-none bg-transparent text-gray-500 hover:text-gray-700"
            >
              <CloseOutlined />
            </button>
          </div>
        }
        open={mappingModalVisible}
        onCancel={closeMappingModal}
        footer={null}
        maskStyle={{ backdropFilter: 'blur(4px)' }}
        closeIcon={null}
        className="mapping-modal"
      >
        <Form
          form={mappingForm}
          layout="vertical"
          onFinish={handleMappingFormSubmit}
        >
          <Form.Item
            name="userId"
            label="User"
            rules={[{ required: true, message: 'Please select a user' }]}
          >
            <Select placeholder="Select user">
              {users.map(user => (
                <Select.Option key={user.id} value={user.id}>
                  {user.name} ({user.email})
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
          
          <Form.Item
            name="roleIds"
            label="Roles"
            rules={[{ required: true, message: 'Please select at least one role' }]}
          >
            <Select
              mode="multiple"
              allowClear
              placeholder="Select roles to assign"
              style={{ width: '100%' }}
            >
              {roles.map(role => (
                <Select.Option key={role.id} value={role.id}>
                  {role.name}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
          
          <Form.Item className="mb-0 flex justify-end">
            <Button
              type="default"
              onClick={closeMappingModal}
              className="mr-2"
            >
              Cancel
            </Button>
            <Button
              type="primary"
              htmlType="submit"
              className="bg-[#6366F1] hover:bg-[#4F46E5]"
            >
              {editingMappingId ? 'Update Assignment' : 'Assign Roles'}
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default UserManagement;
