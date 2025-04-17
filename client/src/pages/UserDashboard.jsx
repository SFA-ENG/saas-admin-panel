import { useState, useEffect } from "react";
import { Card, Row, Col, Statistic, List, Avatar, Button, Spin } from 'antd';
import { UserOutlined, TeamOutlined, UsergroupAddOutlined, UserSwitchOutlined } from '@ant-design/icons';
import { Link } from "react-router-dom";
import { apiService } from '../services/apiService';

const UserDashboard = () => {
  const [users, setUsers] = useState([]);
  const [roles, setRoles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch users and roles data
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        // Fetch users
        const usersResponse = await apiService.users.getAll();
        if (usersResponse && usersResponse.data) {
          setUsers(usersResponse.data);
        }

        // Fetch roles
        const rolesResponse = await apiService.roles.getAll();
        if (rolesResponse && rolesResponse.data) {
          setRoles(rolesResponse.data);
        }
      } catch (err) {
        console.error('Error fetching data:', err);
        setError(err.message || 'Failed to fetch data');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const [recentlyAddedUsers, setRecentlyAddedUsers] = useState([]);

  // Update recently added users when users data changes
  useEffect(() => {
    if (users.length > 0) {
      // Sort users by creation date (assuming there's a created_at field)
      // If not, we can sort by ID as a fallback
      const sortedUsers = [...users].sort((a, b) => {
        if (a.created_at && b.created_at) {
          return new Date(b.created_at) - new Date(a.created_at);
        }
        return b.tenant_user_id - a.tenant_user_id;
      });
      setRecentlyAddedUsers(sortedUsers.slice(0, 5));
    }
  }, [users]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Spin size="large" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <div className="text-red-500 mb-4">Error: {error}</div>
        <Button type="primary" onClick={() => window.location.reload()}>
          Retry
        </Button>
      </div>
    );
  }

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