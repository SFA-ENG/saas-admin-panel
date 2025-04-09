import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { Table, Button, Modal, Form, Input, Select, message, Dropdown, Tag, Space, Avatar } from 'antd';
import { 
  CloseOutlined, 
  UserOutlined, 
  MailOutlined, 
  LockOutlined, 
  PhoneOutlined,
  EditOutlined, 
  DeleteOutlined, 
  MoreOutlined,
  PlusOutlined,
  UserSwitchOutlined
} from '@ant-design/icons';
import SearchBar from '../components/common/SearchBar';
import { Link, useNavigate } from "react-router-dom";

const UsersManagement = () => {
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

  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const [form] = Form.useForm();
  const [editingUserId, setEditingUserId] = useState(null);
  const [modalTitle, setModalTitle] = useState('Add New User');
  const navigate = useNavigate();

  // Initialize with dummy data
  useEffect(() => {
    setUsers(dummyUsers);
    setFilteredUsers(dummyUsers);
  }, []);
  
  // Handle search
  const handleSearch = (searchTerm) => {
    setSearchTerm(searchTerm);
    if (!searchTerm.trim()) {
      setFilteredUsers(users);
      return;
    }
    
    const filtered = users.filter(user => 
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.role.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredUsers(filtered);
  };

  // Fetch users data
  const { data, isLoading } = useQuery({
    queryKey: ['/api/users'],
    enabled: false, // Disable actual fetch for now since we're using state
  });

  // Handler for opening the add user form
  const showAddUserModal = () => {
    setEditingUserId(null);
    setModalTitle('Add New User');
    form.resetFields();
    setModalVisible(true);
  };
  
  // Handler for opening the edit user form
  const showEditUserModal = (user) => {
    setEditingUserId(user.id);
    setModalTitle('Edit User');
    
    form.setFieldsValue({
      name: user.name,
      email: user.email,
      password: user.password,
      phone: user.phone,
    });
    
    setModalVisible(true);
  };

  // Handler for submitting the user form (both add and edit)
  const handleFormSubmit = (values) => {
    if (editingUserId) {
      // Edit existing user - keep their existing roles
      const existingUser = users.find(user => user.id === editingUserId);
      const updatedUsers = users.map(user => {
        if (user.id === editingUserId) {
          return { 
            ...user, 
            ...values
            // Roles will remain unchanged
          };
        }
        return user;
      });
      setUsers(updatedUsers);
      
      // Update filtered users
      if (searchTerm) {
        handleSearch(searchTerm);
      } else {
        setFilteredUsers(updatedUsers);
      }
      
      console.log('Updated User:', { id: editingUserId, ...values, role: existingUser.role, assignedRoles: existingUser.assignedRoles });
      message.success('User updated successfully');
    } else {
      // Add new user with Staff role by default
      const defaultRole = 'Staff';
      const defaultAssignedRoles = [{
        id: 5, // Staff role ID
        name: 'Staff',
        color: '#FFBD33'
      }];
      
      const newUser = {
        id: users.length + 1,
        ...values,
        role: defaultRole,
        assignedRoles: defaultAssignedRoles,
        status: 'active',
        avatar: 'https://randomuser.me/api/portraits/men/1.jpg'
      };
      const newUsers = [...users, newUser];
      setUsers(newUsers);
      
      // Update filtered users
      if (searchTerm) {
        handleSearch(searchTerm);
      } else {
        setFilteredUsers(newUsers);
      }
      
      console.log('New User:', newUser);
      message.success('User added successfully');
    }
    setModalVisible(false);
    setEditingUserId(null);
    form.resetFields();
  };

  // Handler for closing the modal
  const closeModal = () => {
    setModalVisible(false);
    setEditingUserId(null);
    form.resetFields();
  };

  // State for role assignment modal
  const [roleModalVisible, setRoleModalVisible] = useState(false);
  const [selectedUserForRole, setSelectedUserForRole] = useState(null);
  const [roleForm] = Form.useForm();
  
  // Mock data for roles
  const dummyRoles = [
    {
      id: 1,
      name: 'Administrator',
      description: 'Full access to all features and settings',
      color: '#FF5733',
    },
    {
      id: 2,
      name: 'Manager',
      description: 'Manage tournaments, teams, and matches',
      color: '#33A5FF',
    },
    {
      id: 3,
      name: 'Coach',
      description: 'Manage team details and view match data',
      color: '#33FF57',
    },
    {
      id: 4,
      name: 'Analyst',
      description: 'View and analyze match statistics',
      color: '#FF33E9',
    },
    {
      id: 5,
      name: 'Staff',
      description: 'Basic access to the platform',
      color: '#FFBD33',
    }
  ];
  
  // Show role assignment modal
  const handleAssignRoles = (user) => {
    setSelectedUserForRole(user);
    
    // Determine which roles the user already has
    let initialRoleIds = [];
    
    // If user has assignedRoles property, use that
    if (user.assignedRoles && user.assignedRoles.length > 0) {
      initialRoleIds = user.assignedRoles.map(role => role.id);
    } else {
      // Otherwise, just use the main role
      const roleId = user.role === 'Administrator' ? 1 : 
                     user.role === 'Manager' ? 2 :
                     user.role === 'Coach' ? 3 :
                     user.role === 'Analyst' ? 4 : 5;
      initialRoleIds = [roleId];
    }
    
    roleForm.setFieldsValue({
      roleIds: initialRoleIds
    });
    
    setRoleModalVisible(true);
  };
  
  // Handle role assignment form submission
  const handleRoleFormSubmit = (values) => {
    const selectedRoles = dummyRoles.filter(role => values.roleIds.includes(role.id));
    const roleNames = selectedRoles.map(role => role.name).join(', ');
    
    // Create an array of assigned roles for display purposes
    const assignedRoles = selectedRoles.map(role => ({
      id: role.id,
      name: role.name,
      color: role.color
    }));
    
    // Update user role - for now, we'll just set the primary role as the first selected one
    // but store all roles in a new property
    const updatedUsers = users.map(user => {
      if (user.id === selectedUserForRole.id) {
        return { 
          ...user, 
          role: selectedRoles[0].name, // Primary role for display in table
          assignedRoles: assignedRoles  // All assigned roles
        };
      }
      return user;
    });
    
    setUsers(updatedUsers);
    setFilteredUsers(updatedUsers);
    
    // Success message
    if (selectedRoles.length === 1) {
      message.success(`Role '${roleNames}' assigned to ${selectedUserForRole.name}`);
    } else {
      message.success(`Roles '${roleNames}' assigned to ${selectedUserForRole.name}`);
    }
    
    setRoleModalVisible(false);
    setSelectedUserForRole(null);
    roleForm.resetFields();
  };
  
  // Close role modal
  const closeRoleModal = () => {
    setRoleModalVisible(false);
    setSelectedUserForRole(null);
    roleForm.resetFields();
  };

  // Table columns
  const columns = [
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
      render: (text, record) => (
        <div className="flex items-center">
          <img 
            src={record.avatar} 
            alt={record.name} 
            className="w-8 h-8 rounded-full mr-2"
          />
          <span>{text}</span>
        </div>
      ),
    },
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
    },
    {
      title: 'Role',
      dataIndex: 'role',
      key: 'role',
      render: (text, record) => (
        <div>
          {/* Primary role */}
          <Tag color={
            text === 'Administrator' ? 'red' :
            text === 'Manager' ? 'blue' :
            text === 'Coach' ? 'green' :
            text === 'Analyst' ? 'purple' :
            'orange'
          }>
            {text}
          </Tag>
          
          {/* Show additional roles if they exist */}
          {record.assignedRoles && record.assignedRoles.length > 1 && (
            <div className="mt-1">
              {record.assignedRoles
                .filter(role => role.name !== text) // Skip the primary role
                .map(role => (
                  <Tag 
                    key={role.id}
                    color={role.color}
                    className="mr-1 mt-1"
                    style={{ opacity: 0.8 }}
                  >
                    {role.name}
                  </Tag>
                ))
              }
            </div>
          )}
        </div>
      ),
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status) => (
        <Tag color={status === 'active' ? 'success' : 'default'}>
          {status.charAt(0).toUpperCase() + status.slice(1)}
        </Tag>
      ),
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_, record) => (
        <Space size="small">
          <Button 
            type="primary" 
            size="small" 
            icon={<UserSwitchOutlined />} 
            onClick={() => handleAssignRoles(record)}
          >
            Assign Roles
          </Button>
          <Button 
            size="small" 
            icon={<EditOutlined />} 
            onClick={() => showEditUserModal(record)}
          >
            Edit
          </Button>
          <Dropdown
            menu={{
              items: [
                {
                  key: '1',
                  icon: <DeleteOutlined />,
                  label: 'Delete',
                  danger: true,
                  onClick: () => {
                    message.success(`User ${record.name} deleted`);
                    const newUsers = users.filter(user => user.id !== record.id);
                    setUsers(newUsers);
                    setFilteredUsers(newUsers);
                  },
                },
              ],
            }}
          >
            <Button type="text" icon={<MoreOutlined />} size="small" />
          </Dropdown>
        </Space>
      ),
    },
  ];

  return (
    <div className="p-6">
      <div className="mb-6 flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-semibold text-[#111827]">Users Management</h1>
          <p className="text-[#6B7280]">Manage user accounts and details</p>
        </div>
        <Button 
          type="primary" 
          icon={<PlusOutlined />} 
          onClick={showAddUserModal}
          size="large"
        >
          Add New User
        </Button>
      </div>
      
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="mb-4">
          <SearchBar 
            placeholder="Search users by name, email or role..." 
            onSearch={handleSearch}
          />
        </div>
        
        <Table 
          dataSource={filteredUsers} 
          columns={columns} 
          rowKey="id"
          pagination={{ pageSize: 7 }}
          loading={isLoading}
          scroll={{ y: 400 }}
          className="user-table"
        />
      </div>
      
      {/* User Form Modal */}
      <Modal
        title={modalTitle}
        open={modalVisible}
        onCancel={closeModal}
        footer={null}
        destroyOnClose
        width={500}
        className="user-modal"
        centered
        closeIcon={<CloseOutlined />}
      >
        
        <Form
          form={form}
          layout="vertical"
          onFinish={handleFormSubmit}
          className="mt-4"
          requiredMark={false}
        >
          <Form.Item
            name="name"
            label="Full Name"
            rules={[{ required: true, message: 'Please enter name' }]}
          >
            <Input prefix={<UserOutlined />} placeholder="Enter full name" />
          </Form.Item>
          
          <Form.Item
            name="email"
            label="Email"
            rules={[
              { required: true, message: 'Please enter email' },
              { type: 'email', message: 'Please enter a valid email' }
            ]}
          >
            <Input prefix={<MailOutlined />} placeholder="Enter email address" />
          </Form.Item>
          
          <Form.Item
            name="password"
            label="Password"
            rules={[
              { required: !editingUserId, message: 'Please enter password' },
              { min: 8, message: 'Password must be at least 8 characters' }
            ]}
          >
            <Input.Password prefix={<LockOutlined />} placeholder="Enter password" />
          </Form.Item>
          
          <Form.Item
            name="phone"
            label="Phone"
            rules={[{ required: true, message: 'Please enter phone number' }]}
          >
            <Input prefix={<PhoneOutlined />} placeholder="Enter phone number" />
          </Form.Item>
          

          
          <Form.Item className="mb-0 flex justify-end">
            <Button className="mr-2" onClick={closeModal}>Cancel</Button>
            <Button type="primary" htmlType="submit">
              {editingUserId ? 'Update User' : 'Add User'}
            </Button>
          </Form.Item>
        </Form>
      </Modal>
      
      {/* Role Assignment Modal */}
      <Modal
        title="Assign/Edit Role"
        open={roleModalVisible}
        onCancel={closeRoleModal}
        footer={null}
        destroyOnClose
        width={480}
        className="role-modal"
        centered
        closeIcon={<CloseOutlined />}
      >
        
        {selectedUserForRole && (
          <div className="mb-6 mt-4">
            <div className="flex items-center mb-4">
              <Avatar 
                src={selectedUserForRole.avatar} 
                size={64} 
                className="mr-4"
              />
              <div>
                <h3 className="text-lg font-medium">{selectedUserForRole.name}</h3>
                <p className="text-gray-500">{selectedUserForRole.email}</p>
                <div className="mt-1">
                  <Tag color={selectedUserForRole.status === 'active' ? 'success' : 'default'}>
                    {selectedUserForRole.status.charAt(0).toUpperCase() + selectedUserForRole.status.slice(1)}
                  </Tag>
                  <Tag color={
                    selectedUserForRole.role === 'Administrator' ? 'red' : 
                    selectedUserForRole.role === 'Manager' ? 'blue' : 
                    selectedUserForRole.role === 'Coach' ? 'green' : 
                    selectedUserForRole.role === 'Analyst' ? 'purple' : 'orange'
                  }>
                    Current Role: {selectedUserForRole.role}
                  </Tag>
                </div>
              </div>
            </div>
            
            <Form
              form={roleForm}
              layout="vertical"
              onFinish={handleRoleFormSubmit}
              requiredMark={false}
            >
              <Form.Item
                name="roleIds"
                label="Select Role(s)"
                rules={[{ required: true, message: 'Please select at least one role' }]}
              >
                <Select 
                  mode="multiple"
                  placeholder="Select one or more roles"
                  optionLabelProp="label"
                >
                  {dummyRoles.map(role => (
                    <Select.Option 
                      key={role.id} 
                      value={role.id}
                      label={role.name}
                    >
                      <div className="flex items-center">
                        <div 
                          className="w-3 h-3 rounded-full mr-2" 
                          style={{ backgroundColor: role.color }}
                        ></div>
                        <span>{role.name}</span>
                      </div>
                    </Select.Option>
                  ))}
                </Select>
              </Form.Item>
              
              <Form.Item className="mb-0 flex justify-end">
                <Button className="mr-2" onClick={closeRoleModal}>Cancel</Button>
                <Button 
                  type="primary" 
                  htmlType="submit"
                  icon={<UserSwitchOutlined />}
                >
                  Assign/Edit Role
                </Button>
              </Form.Item>
            </Form>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default UsersManagement;