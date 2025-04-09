import { useState, useEffect } from "react";
import { Card, Row, Col, Statistic, List, Avatar, Button } from 'antd';
import { UserOutlined, TeamOutlined, UsergroupAddOutlined, UserSwitchOutlined } from '@ant-design/icons';
import { Link } from "react-router-dom";

const UserDashboard = () => {
  // Mock data for users and roles
  const dummyUsers = [
    { id: 1, name: 'John Smith', email: 'john.smith@example.com', role: 'Administrator' },
    { id: 2, name: 'Emily Johnson', email: 'emily.johnson@example.com', role: 'Manager' },
    { id: 3, name: 'Michael Brown', email: 'michael.brown@example.com', role: 'Coach' },
    { id: 4, name: 'Sarah Williams', email: 'sarah.williams@example.com', role: 'Analyst' },
    { id: 5, name: 'David Lee', email: 'david.lee@example.com', role: 'Staff' }
  ];

  const dummyRoles = [
    { id: 1, name: 'Administrator', users: 2, color: '#FF5733' },
    { id: 2, name: 'Manager', users: 3, color: '#33A5FF' },
    { id: 3, name: 'Coach', users: 5, color: '#33FF57' },
    { id: 4, name: 'Analyst', users: 2, color: '#FF33E9' },
    { id: 5, name: 'Staff', users: 3, color: '#FFBD33' }
  ];

  const [users, setUsers] = useState([]);
  const [roles, setRoles] = useState([]);
  const [recentlyAddedUsers, setRecentlyAddedUsers] = useState([]);

  // Initialize with dummy data
  useEffect(() => {
    setUsers(dummyUsers);
    setRoles(dummyRoles);
    // Sort to get most recently added users (assuming higher IDs are more recent)
    setRecentlyAddedUsers([...dummyUsers].sort((a, b) => b.id - a.id).slice(0, 5));
  }, []);

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-[#111827]">User Dashboard</h1>
        <p className="text-[#6B7280]">Overview of user accounts and role distribution</p>
      </div>
      
      {/* Stats Cards */}
      <Row gutter={[16, 16]} className="mb-8">
        <Col xs={24} sm={12} md={6}>
          <Card bordered={false} className="shadow-sm">
            <Statistic
              title="Total Users"
              value={users.length}
              prefix={<UserOutlined className="text-blue-500 mr-2" />}
              valueStyle={{ color: '#3f8600' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card bordered={false} className="shadow-sm">
            <Statistic
              title="Active Roles"
              value={roles.length}
              prefix={<TeamOutlined className="text-green-500 mr-2" />}
              valueStyle={{ color: '#cf1322' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card bordered={false} className="shadow-sm">
            <Statistic
              title="Administrators"
              value={roles.find(r => r.name === 'Administrator')?.users || 0}
              prefix={<UserSwitchOutlined className="text-purple-500 mr-2" />}
              valueStyle={{ color: '#9254de' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card bordered={false} className="shadow-sm">
            <Statistic
              title="New Users (Week)"
              value={2}
              prefix={<UsergroupAddOutlined className="text-orange-500 mr-2" />}
              valueStyle={{ color: '#faad14' }}
            />
          </Card>
        </Col>
      </Row>
      
      {/* Quick Actions */}
      <div className="mb-8">
        <h2 className="text-lg font-medium mb-4 text-[#111827]">Quick Actions</h2>
        <Row gutter={[16, 16]}>
          <Col xs={24} sm={8}>
            <Link to="/user-management/users">
              <Button type="primary" size="large" block icon={<UserOutlined />}>
                Manage Users
              </Button>
            </Link>
          </Col>
          <Col xs={24} sm={8}>
            <Link to="/user-management/roles">
              <Button size="large" block icon={<TeamOutlined />}>
                Manage Roles
              </Button>
            </Link>
          </Col>

        </Row>
      </div>
      
      {/* Lists */}
      <Row gutter={[16, 16]}>
        <Col xs={24} lg={12}>
          <Card title="Recently Added Users" bordered={false} className="shadow-sm">
            <List
              itemLayout="horizontal"
              dataSource={recentlyAddedUsers}
              renderItem={user => (
                <List.Item>
                  <List.Item.Meta
                    avatar={<Avatar src={`https://randomuser.me/api/portraits/${Math.random() > 0.5 ? 'men' : 'women'}/${user.id}.jpg`} />}
                    title={<Link to={`/user-management/users?id=${user.id}`}>{user.name}</Link>}
                    description={`${user.email} • ${user.role}`}
                  />
                </List.Item>
              )}
            />
          </Card>
        </Col>
        <Col xs={24} lg={12}>
          <Card title="Role Distribution" bordered={false} className="shadow-sm">
            <List
              itemLayout="horizontal"
              dataSource={roles}
              renderItem={role => (
                <List.Item>
                  <List.Item.Meta
                    avatar={
                      <Avatar style={{ backgroundColor: role.color }}>
                        {role.name.charAt(0)}
                      </Avatar>
                    }
                    title={<Link to={`/user-management/roles?id=${role.id}`}>{role.name}</Link>}
                    description={`${role.users} ${role.users === 1 ? 'user' : 'users'}`}
                  />
                </List.Item>
              )}
            />
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default UserDashboard;