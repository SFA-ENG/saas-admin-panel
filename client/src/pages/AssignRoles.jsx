import { useState, useEffect } from "react";
import { Card, Form, Select, Button, message, Divider, Avatar, Tag, List } from 'antd';
import { UserOutlined, TagOutlined, CheckCircleOutlined } from '@ant-design/icons';
import { useNavigate, useLocation } from "react-router-dom";

const AssignRoles = () => {
  // Mock data for users
  const dummyUsers = [
    {
      id: 1,
      name: 'John Smith',
      email: 'john.smith@example.com',
      role: 'Administrator',
      avatar: 'https://randomuser.me/api/portraits/men/32.jpg'
    },
    {
      id: 2,
      name: 'Emily Johnson',
      email: 'emily.johnson@example.com',
      role: 'Manager',
      avatar: 'https://randomuser.me/api/portraits/women/26.jpg'
    },
    {
      id: 3,
      name: 'Michael Brown',
      email: 'michael.brown@example.com',
      role: 'Coach',
      avatar: 'https://randomuser.me/api/portraits/men/41.jpg'
    },
    {
      id: 4,
      name: 'Sarah Williams',
      email: 'sarah.williams@example.com',
      role: 'Analyst',
      avatar: 'https://randomuser.me/api/portraits/women/67.jpg'
    },
    {
      id: 5,
      name: 'David Lee',
      email: 'david.lee@example.com',
      role: 'Staff',
      avatar: 'https://randomuser.me/api/portraits/men/59.jpg'
    }
  ];

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

  // Mock data for user role mapping
  const dummyUserRoleMappings = [
    { userId: 1, roleIds: [1, 2] }, // John Smith has Administrator and Manager roles
    { userId: 2, roleIds: [2] },    // Emily Johnson has Manager role
    { userId: 3, roleIds: [3] },    // Michael Brown has Coach role
    { userId: 4, roleIds: [4] },    // Sarah Williams has Analyst role
    { userId: 5, roleIds: [5] },    // David Lee has Staff role
  ];

  const [users, setUsers] = useState([]);
  const [roles, setRoles] = useState([]);
  const [userRoleMappings, setUserRoleMappings] = useState([]);
  const [form] = Form.useForm();
  const [selectedUser, setSelectedUser] = useState(null);
  const [selectedUserRoles, setSelectedUserRoles] = useState([]);
  const navigate = useNavigate();
  const location = useLocation();

  // Get user id from URL query parameters
  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const userId = parseInt(queryParams.get('userId'));
    
    // Initialize with dummy data
    setUsers(dummyUsers);
    setRoles(dummyRoles);
    setUserRoleMappings(dummyUserRoleMappings);
    
    // If we have a userId in the query params, select that user
    if (userId) {
      const user = dummyUsers.find(u => u.id === userId);
      if (user) {
        handleUserChange(userId);
        form.setFieldsValue({ userId });
      }
    }
  }, [location.search]);

  // Handler for user change
  const handleUserChange = (userId) => {
    const user = users.find(u => u.id === userId);
    setSelectedUser(user);
    
    // Find existing role assignments
    const userMapping = userRoleMappings.find(m => m.userId === userId);
    const currentRoleIds = userMapping ? userMapping.roleIds : [];
    setSelectedUserRoles(currentRoleIds);
    
    form.setFieldsValue({ roleIds: currentRoleIds });
  };

  // Handler for submitting the form
  const handleFormSubmit = (values) => {
    const { userId, roleIds } = values;
    
    // Check if user already has role mappings
    const existingMappingIndex = userRoleMappings.findIndex(m => m.userId === userId);
    
    if (existingMappingIndex !== -1) {
      // Update existing mapping
      const updatedMappings = [...userRoleMappings];
      updatedMappings[existingMappingIndex] = { userId, roleIds };
      setUserRoleMappings(updatedMappings);
    } else {
      // Create new mapping
      setUserRoleMappings([...userRoleMappings, { userId, roleIds }]);
    }
    
    setSelectedUserRoles(roleIds);
    message.success('Roles assigned successfully');
  };

  // Get assigned roles data for display
  const getAssignedRolesData = () => {
    if (!selectedUserRoles || !roles) return [];
    
    return roles.filter(role => selectedUserRoles.includes(role.id));
  };

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-[#111827]">Assign Roles</h1>
        <p className="text-[#6B7280]">Assign one or more roles to a user</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2">
          <Card className="shadow-sm">
            <Form
              form={form}
              layout="vertical"
              onFinish={handleFormSubmit}
              requiredMark={false}
            >
              <Form.Item
                name="userId"
                label="Select User"
                rules={[{ required: true, message: 'Please select a user' }]}
              >
                <Select 
                  placeholder="Select a user"
                  onChange={handleUserChange}
                  optionLabelProp="label"
                >
                  {users.map(user => (
                    <Select.Option 
                      key={user.id} 
                      value={user.id}
                      label={user.name}
                    >
                      <div className="flex items-center">
                        <Avatar 
                          size="small" 
                          src={user.avatar} 
                          icon={!user.avatar && <UserOutlined />}
                          className="mr-2"
                        />
                        <span>{user.name}</span>
                      </div>
                    </Select.Option>
                  ))}
                </Select>
              </Form.Item>
              
              {selectedUser && (
                <>
                  <Divider />
                  
                  <Form.Item
                    name="roleIds"
                    label="Assign Roles"
                    rules={[{ required: true, message: 'Please select at least one role' }]}
                  >
                    <Select
                      mode="multiple"
                      placeholder="Select roles to assign"
                      optionLabelProp="label"
                    >
                      {roles.map(role => (
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
                  
                  <Form.Item className="flex justify-end mb-0">
                    <Button 
                      className="mr-2" 
                      onClick={() => navigate('/user-management/users')}
                    >
                      Cancel
                    </Button>
                    <Button 
                      type="primary" 
                      htmlType="submit"
                      icon={<CheckCircleOutlined />}
                    >
                      Assign Roles
                    </Button>
                  </Form.Item>
                </>
              )}
            </Form>
          </Card>
        </div>
        
        <div>
          <Card 
            title={
              <div className="flex items-center">
                <TagOutlined className="mr-2 text-blue-500" />
                <span>Role Summary</span>
              </div>
            }
            className="shadow-sm"
          >
            {selectedUser ? (
              <div>
                <div className="mb-4 flex items-center">
                  <Avatar 
                    size={48} 
                    src={selectedUser.avatar} 
                    icon={!selectedUser.avatar && <UserOutlined />}
                    className="mr-3"
                  />
                  <div>
                    <h3 className="text-base font-medium">{selectedUser.name}</h3>
                    <p className="text-sm text-gray-500">{selectedUser.email}</p>
                  </div>
                </div>
                
                <Divider />
                
                <div>
                  <h4 className="text-sm font-medium mb-2">Current Assigned Roles:</h4>
                  {getAssignedRolesData().length > 0 ? (
                    <List
                      itemLayout="horizontal"
                      dataSource={getAssignedRolesData()}
                      renderItem={role => (
                        <List.Item>
                          <List.Item.Meta
                            avatar={
                              <div 
                                className="w-6 h-6 rounded-full flex items-center justify-center text-white font-medium"
                                style={{ backgroundColor: role.color }}
                              >
                                {role.name.charAt(0)}
                              </div>
                            }
                            title={role.name}
                            description={<span className="text-xs">{role.description}</span>}
                          />
                        </List.Item>
                      )}
                    />
                  ) : (
                    <p className="text-sm text-gray-500">No roles assigned yet</p>
                  )}
                </div>
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                <UserOutlined style={{ fontSize: '32px' }} />
                <p className="mt-2">Select a user to view role details</p>
              </div>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
};

export default AssignRoles;