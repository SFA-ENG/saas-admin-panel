import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";
import { useEffect } from "react";
import { Avatar, Dropdown, Button } from "antd";
import { LogoutOutlined, UserOutlined, BellOutlined, SettingOutlined } from "@ant-design/icons";
import { useAuth } from "../../contexts/AuthContext";

// Add fontawesome script
const addFontAwesome = () => {
  const script = document.createElement("script");
  script.src = "https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/js/all.min.js";
  script.async = true;
  document.body.appendChild(script);
  return () => {
    document.body.removeChild(script);
  };
};

const PageLayout = () => {
  const { user, logout } = useAuth();

  useEffect(() => {
    const cleanup = addFontAwesome();
    return cleanup;
  }, []);

  const userMenuItems = [
    {
      key: 'profile',
      label: 'Profile',
      icon: <UserOutlined />,
      onClick: () => {}
    },
    {
      key: 'settings',
      label: 'Settings',
      icon: <SettingOutlined />,
      onClick: () => {}
    },
    {
      key: 'divider',
      type: 'divider'
    },
    {
      key: 'logout',
      label: 'Logout',
      icon: <LogoutOutlined />,
      onClick: logout
    }
  ];

  return (
    <div className="bg-gray-50 h-screen flex overflow-hidden font-['Inter',sans-serif]">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="bg-white border-b border-gray-200 px-4 py-2 flex justify-between items-center">
          <div className="flex-1"></div>
          <div className="flex items-center space-x-4">
            {/* Notifications */}
            <Button 
              type="text" 
              icon={<BellOutlined style={{ fontSize: '18px' }} />} 
              className="flex items-center justify-center"
            />
            
            {/* User dropdown */}
            <Dropdown 
              menu={{ items: userMenuItems }} 
              placement="bottomRight" 
              trigger={['click']}
            >
              <div className="flex items-center space-x-2 cursor-pointer">
                <Avatar 
                  src={user?.avatar || undefined} 
                  icon={!user?.avatar && <UserOutlined />} 
                  size="small"
                />
                <span className="text-sm font-medium">{user?.name || 'User'}</span>
              </div>
            </Dropdown>
          </div>
        </header>
        
        {/* Main content */}
        <main className="flex-1 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default PageLayout;
