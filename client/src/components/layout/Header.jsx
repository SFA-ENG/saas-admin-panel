import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Avatar, Button, Dropdown, Menu, Space } from 'antd';
import { UserOutlined, LogoutOutlined, SettingOutlined, BellOutlined, MenuOutlined } from '@ant-design/icons';
import { apiService } from '../../services/apiService';

const Header = ({ user, handleMenuClick }) => {
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      // Call the logout API
      await apiService.auth.logout();
      
      // Clear authentication data
      localStorage.removeItem('sfa_admin_token');
      localStorage.removeItem('user');
      
      // Force a hard navigation to ensure complete logout
      window.location.href = '/auth';
    } catch (error) {
      console.error('Logout failed:', error);
      // Even if API call fails, we should still clear local storage and redirect
      localStorage.removeItem('sfa_admin_token');
      localStorage.removeItem('user');
      window.location.href = '/auth';
    }
  };

  const userMenu = (
    <Menu>
      <Menu.Item key="profile" icon={<UserOutlined />} onClick={() => navigate('/settings')}>
        Profile
      </Menu.Item>
      <Menu.Item key="settings" icon={<SettingOutlined />} onClick={() => navigate('/settings')}>
        Settings
      </Menu.Item>
      <Menu.Divider />
      <Menu.Item key="logout" icon={<LogoutOutlined />} onClick={handleLogout}>
        Logout
      </Menu.Item>
    </Menu>
  );

  return (
    <header className="bg-white border-b border-gray-200">
      <div className="flex justify-between items-center px-4 py-3">
        <div className="flex items-center">
          {/* Mobile menu toggle - only visible on mobile */}
          <Button 
            type="text"
            icon={<MenuOutlined />} 
            onClick={handleMenuClick}
            className="mr-3 md:hidden flex items-center justify-center"
          />
          <div className="text-lg font-medium text-gray-800">
            {/* Page title can be dynamic based on route */}
            Sports Administration
          </div>
        </div>
        <div className="flex items-center space-x-4">
          {/* Notifications */}
          <Button 
            type="text" 
            icon={<BellOutlined />} 
            className="flex items-center justify-center"
            onClick={() => console.log('Notifications clicked')}
          />
          
          {/* User profile dropdown */}
          <Dropdown overlay={userMenu} trigger={['click']} placement="bottomRight">
            <Space className="cursor-pointer">
              <Avatar 
                src={user?.avatar} 
                icon={!user?.avatar && <UserOutlined />} 
                size="small"
              />
              <span className="hidden md:inline">{user?.name || 'User'}</span>
            </Space>
          </Dropdown>
        </div>
      </div>
    </header>
  );
};

export default Header;