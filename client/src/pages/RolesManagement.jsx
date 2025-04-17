import { useState, useEffect } from "react";
import { Table, Button, Modal, Form, Input, Select, message, Tag, Checkbox, Space, Spin } from 'antd';
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
import apiService from '../services/apiService';
import { useQueryClient } from "@tanstack/react-query";

const RolesManagement = () => {
  const queryClient = useQueryClient();
  const [roles, setRoles] = useState([]);
  const [filteredRoles, setFilteredRoles] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const [form] = Form.useForm();
  const [editingRoleId, setEditingRoleId] = useState(null);
  const [modalTitle, setModalTitle] = useState('Create New Role');
  const [selectedColor, setSelectedColor] = useState('#FF5733');
  const [loading, setLoading] = useState(true);

  // Hardcoded permissions list
  const permissionsList = [
    {
      id: "623e0949-99e5-4ecf-af99-6735520b7f1e",
      name: "READ:SUB_MODULE_1"
    },
    {
      id: "9ab57abf-3cac-4696-b2ae-53c54564be52",
      name: "UPDATE:SUB_MODULE_1"
    },
    {
      id: "f2b97e7e-3a0d-44d0-bedc-697ea94edaf5",
      name: "DELETE:SUB_MODULE_1"
    },
    {
      id: "f8220e87-938e-4d44-9e78-0d76db00a1d9",
      name: "CREATE:SUB_MODULE_1"
    }
  ];

  // Format permissions for Select component
  const permissionOptions = permissionsList.map(permission => ({
    label: permission.name,
    value: permission.id
  }));

  // Fetch roles from API
  const fetchRoles = async () => {
    try {
      setLoading(true);
      const response = await apiService.roles.getAll();
      
      if (!response || !response.data || !Array.isArray(response.data)) {
        throw new Error('Invalid response format from server');
      }

      const rolesData = response.data.map(role => ({
        tenant_role_id: role.tenant_role_id,
        role_name: role.name || role.role_name,
        privileges: role.privileges || []
      }));

      setRoles(rolesData);
      setFilteredRoles(rolesData);
    } catch (error) {
      console.error('Error fetching roles:', error);
      const errorMessage = error.response?.data?.message || error.message || 'Failed to fetch roles. Please try again later.';
      message.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  // Initial fetch
  useEffect(() => {
    fetchRoles();
  }, []);

  // Handle search
  const handleSearch = (searchTerm) => {
    setSearchTerm(searchTerm);
  };

  // Add useEffect to handle search filtering
  useEffect(() => {
    if (!searchTerm.trim()) {
      setFilteredRoles(roles);
      return;
    }
    
    const filtered = roles.filter(role => 
      role.role_name.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredRoles(filtered);
  }, [searchTerm, roles]);

  // Handler for opening the add role form
  const showAddRoleModal = () => {
    setEditingRoleId(null);
    setModalTitle('Create New Role');
    form.resetFields();
    setModalVisible(true);
  };
  
  // Handler for opening the edit role form
  const showEditRoleModal = (role) => {
    console.log('Editing role:', role);
    setEditingRoleId(role.tenant_role_id);
    setModalTitle('Edit Role');
    form.setFieldsValue({
      role_name: role.role_name,
      permissions: role.privileges ? role.privileges.map(priv => priv.tenant_privilege_id) : [],
    });
    setModalVisible(true);
  };

  // // Handler for color change
  // const handleColorChange = (color) => {
  //   setSelectedColor(color.hex);
  //   form.setFieldsValue({ color: color.hex });
  // };

  // Handler for submitting the role form (both add and edit)
  const handleFormSubmit = async (values) => {
    try {
      if (editingRoleId) {
        // Update role permissions
        if (values.permissions && values.permissions.length > 0) {
          await apiService.roles.updatePermissions({
            tenant_role_id: editingRoleId,
            tenant_privilege_ids: values.permissions,
            type: 'ADD'
          });
        }
        
        message.success('Role permissions updated successfully');
      } else {
        // Create new role with permissions
        const roleData = {
          name: values.role_name,
          tenant_privilege_ids: values.permissions || []
        };

        const response = await apiService.roles.create(roleData);
        
        if (response.success) {
          message.success('Role added successfully');
        } else {
          throw new Error(response.message || 'Failed to create role');
        }
      }

      // Refetch roles data
      await fetchRoles();
      
      setModalVisible(false);
      setEditingRoleId(null);
      form.resetFields();
    } catch (error) {
      console.error('Error creating/updating role:', error);
      const errorMessage = error.response?.data?.message || error.message || 'Failed to create/update role';
      message.error(errorMessage);
    }
  };

  // Handler for closing the modal
  const closeModal = () => {
    setModalVisible(false);
    setEditingRoleId(null);
    form.resetFields();
  };

  const handleRoleNameInput = (e) => {
    const char = e.key;
    if (!/^[A-Za-z_]$/.test(char)) {
      e.preventDefault();
    }
  };

  // Table columns
  const columns = [
    {
      title: 'Role',
      dataIndex: 'role_name',
      key: 'role_name',
      render: (text) => <span className="font-medium">{text.toUpperCase()}</span>,
    },
    {
      title: 'Permissions',
      dataIndex: 'privileges',
      key: 'privileges',
      render: (privileges) => {
        if (!privileges || privileges.length === 0) {
          return <span className="text-gray-400">No permissions</span>;
        }

        return (
          <div className="flex flex-wrap gap-1">
            {privileges.map((priv) => {
              // Find the permission name from our hardcoded list
              const permission = permissionsList.find(p => p.id === priv.tenant_privilege_id);
              return (
                <Tag key={priv.tenant_privilege_id} color="blue">
                  {permission ? permission.name : priv.tenant_privilege_id}
                </Tag>
              );
            })}
          </div>
        );
      },
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
          {/* <Button 
            danger 
            size="small" 
            icon={<DeleteOutlined />}
            onClick={() => {
              message.success(`Role ${record.role_name} deleted`);
              const newRoles = roles.filter(role => role.tenant_role_id !== record.tenant_role_id);
              setRoles(newRoles);
              setFilteredRoles(newRoles);
            }}
          >
            Delete
          </Button> */}
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
            placeholder="Search roles by name..." 
            value={searchTerm}
            onChange={setSearchTerm}
            onSearch={handleSearch}
          />
        </div>
        
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <Spin size="large" />
          </div>
        ) : (
          <Table 
            dataSource={filteredRoles} 
            columns={columns} 
            rowKey="tenant_role_id"
            pagination={{ pageSize: 7 }}
            scroll={{ y: 400 }}
            className="roles-table"
          />
        )}
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
            name="role_name"
            label="Role Name"
            rules={[{ required: true, message: 'Please enter role name' }]}
          >
            <Input 
              prefix={<TagOutlined />} 
              placeholder="Enter role name" 
              onKeyPress={handleRoleNameInput}
            />
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