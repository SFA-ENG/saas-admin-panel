import { useState, useEffect } from "react";
import { Table, Button, Modal, Form, Input, Select, message, Tag, Checkbox, Space } from 'antd';
import { 
  CloseOutlined, 
  TagOutlined,
  EditOutlined, 
  DeleteOutlined, 
  InfoCircleOutlined,
  PlusOutlined
} from '@ant-design/icons';
import SearchBar from '../components/common/SearchBar';
import { TwitterPicker } from 'react-color';

const RolesManagement = () => {
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

  // Permission options
  const permissionOptions = [
    { label: 'Manage Users', value: 'manage_users' },
    { label: 'Manage Roles', value: 'manage_roles' },
    { label: 'Admin Access', value: 'admin_access' },
    { label: 'Manage Tournaments', value: 'manage_tournaments' },
    { label: 'Manage Teams', value: 'manage_teams' },
    { label: 'Manage Matches', value: 'manage_matches' },
    { label: 'View Reports', value: 'view_reports' },
  ];

  const [roles, setRoles] = useState([]);
  const [filteredRoles, setFilteredRoles] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const [form] = Form.useForm();
  const [editingRoleId, setEditingRoleId] = useState(null);
  const [modalTitle, setModalTitle] = useState('Create New Role');
  const [selectedColor, setSelectedColor] = useState('#FF5733');

  // Initialize with dummy data
  useEffect(() => {
    setRoles(dummyRoles);
    setFilteredRoles(dummyRoles);
  }, []);
  
  // Handle search
  const handleSearch = (searchTerm) => {
    setSearchTerm(searchTerm);
    if (!searchTerm.trim()) {
      setFilteredRoles(roles);
      return;
    }
    
    const filtered = roles.filter(role => 
      role.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      role.description.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredRoles(filtered);
  };

  // Handler for opening the add role form
  const showAddRoleModal = () => {
    setEditingRoleId(null);
    setModalTitle('Create New Role');
    setSelectedColor('#FF5733');
    form.resetFields();
    form.setFieldsValue({ color: '#FF5733' });
    setModalVisible(true);
  };
  
  // Handler for opening the edit role form
  const showEditRoleModal = (role) => {
    setEditingRoleId(role.id);
    setModalTitle('Edit Role');
    setSelectedColor(role.color);
    form.setFieldsValue({
      name: role.name,
      description: role.description,
      permissions: role.permissions,
      color: role.color,
    });
    setModalVisible(true);
  };

  // Handler for color change
  const handleColorChange = (color) => {
    setSelectedColor(color.hex);
    form.setFieldsValue({ color: color.hex });
  };

  // Handler for submitting the role form (both add and edit)
  const handleFormSubmit = (values) => {
    // Ensure color is included
    const formData = { ...values, color: selectedColor };

    if (editingRoleId) {
      // Edit existing role
      const updatedRoles = roles.map(role => {
        if (role.id === editingRoleId) {
          return { ...role, ...formData };
        }
        return role;
      });
      setRoles(updatedRoles);
      
      // Update filtered roles
      if (searchTerm) {
        handleSearch(searchTerm);
      } else {
        setFilteredRoles(updatedRoles);
      }
      
      console.log('Updated Role:', { id: editingRoleId, ...formData });
      message.success('Role updated successfully');
    } else {
      // Add new role
      const newRole = {
        id: roles.length + 1,
        ...formData,
        users: 0
      };
      const newRoles = [...roles, newRole];
      setRoles(newRoles);
      
      // Update filtered roles
      if (searchTerm) {
        handleSearch(searchTerm);
      } else {
        setFilteredRoles(newRoles);
      }
      
      console.log('New Role:', newRole);
      message.success('Role added successfully');
    }
    setModalVisible(false);
    setEditingRoleId(null);
    form.resetFields();
  };

  // Handler for closing the modal
  const closeModal = () => {
    setModalVisible(false);
    setEditingRoleId(null);
    form.resetFields();
  };

  // Table columns
  const columns = [
    {
      title: 'Role',
      dataIndex: 'name',
      key: 'name',
      render: (text, record) => (
        <div className="flex items-center">
          <div 
            className="w-4 h-4 rounded-full mr-2" 
            style={{ backgroundColor: record.color }}
          ></div>
          <span className="font-medium">{text}</span>
        </div>
      ),
    },
    {
      title: 'Description',
      dataIndex: 'description',
      key: 'description',
    },
    {
      title: 'Permissions',
      dataIndex: 'permissions',
      key: 'permissions',
      render: (permissions) => (
        <div className="flex flex-wrap gap-1">
          {permissions.length > 0 ? (
            permissions.map((perm, index) => (
              <Tag key={index} color="blue">
                {perm.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
              </Tag>
            ))
          ) : (
            <span className="text-gray-400">No permissions</span>
          )}
        </div>
      ),
    },
    {
      title: 'Users',
      dataIndex: 'users',
      key: 'users',
      render: (count) => (
        <Tag color="green">{count}</Tag>
      ),
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_, record) => (
        <Space size="small">
          <Button 
            size="small" 
            icon={<EditOutlined />} 
            onClick={() => showEditRoleModal(record)}
          >
            Edit
          </Button>
          <Button 
            danger 
            size="small" 
            icon={<DeleteOutlined />}
            onClick={() => {
              message.success(`Role ${record.name} deleted`);
              const newRoles = roles.filter(role => role.id !== record.id);
              setRoles(newRoles);
              setFilteredRoles(newRoles);
            }}
          >
            Delete
          </Button>
        </Space>
      ),
    },
  ];

  return (
    <div className="p-6">
      <div className="mb-6 flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-semibold text-[#111827]">Roles Management</h1>
          <p className="text-[#6B7280]">Manage roles and permissions</p>
        </div>
        <Button 
          type="primary" 
          icon={<PlusOutlined />} 
          onClick={showAddRoleModal}
          size="large"
        >
          Create New Role
        </Button>
      </div>
      
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="mb-4">
          <SearchBar 
            placeholder="Search roles by name or description..." 
            onSearch={handleSearch}
          />
        </div>
        
        <Table 
          dataSource={filteredRoles} 
          columns={columns} 
          rowKey="id"
          pagination={{ pageSize: 7 }}
          scroll={{ y: 400 }}
          className="roles-table"
        />
      </div>
      
      {/* Role Form Modal */}
      <Modal
        title={modalTitle}
        open={modalVisible}
        onCancel={closeModal}
        footer={null}
        destroyOnClose
        width={550}
        className="role-modal"
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
            label="Role Name"
            rules={[{ required: true, message: 'Please enter role name' }]}
          >
            <Input prefix={<TagOutlined />} placeholder="Enter role name" />
          </Form.Item>
          
          <Form.Item
            name="description"
            label="Description"
            rules={[{ required: true, message: 'Please enter description' }]}
          >
            <Input.TextArea 
              placeholder="Enter role description" 
              autoSize={{ minRows: 2, maxRows: 4 }}
            />
          </Form.Item>
          
          <Form.Item
            name="color"
            label="Role Color"
            rules={[{ required: true, message: 'Please select a color' }]}
          >
            <div>
              <TwitterPicker 
                color={selectedColor}
                onChange={handleColorChange}
                colors={['#FF5733', '#33A5FF', '#33FF57', '#FF33E9', '#FFBD33', '#5D33FF', '#33FFBD', '#FF5733', '#33A5FF', '#33FF57']}
              />
              <div 
                className="mt-2 h-8 rounded border border-gray-200" 
                style={{ backgroundColor: selectedColor }}
              ></div>
            </div>
          </Form.Item>
          
          <Form.Item
            name="permissions"
            label="Permissions"
            tooltip={{ 
              title: 'Select the permissions for this role', 
              icon: <InfoCircleOutlined /> 
            }}
          >
            <Select
              mode="multiple"
              placeholder="Select permissions"
              optionLabelProp="label"
              className="w-full"
              options={permissionOptions}
            />
          </Form.Item>
          
          <Form.Item className="mb-0 flex justify-end">
            <Button className="mr-2" onClick={closeModal}>Cancel</Button>
            <Button type="primary" htmlType="submit">
              {editingRoleId ? 'Update Role' : 'Create Role'}
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default RolesManagement;