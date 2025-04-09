import React, { useEffect, useState } from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { Spin, notification, Drawer } from 'antd';
import Sidebar from './Sidebar';
import Header from './Header';
import { useAuth } from '../../contexts/AuthContext';

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

// Define user access types
const USER_ACCESS_TYPES = {
  SUPER_ADMIN: 'super_admin',
  ADMIN: 'admin',
  MANAGER: 'manager',
  STAFF: 'staff',
  USER: 'user'
};

// MainLayout with authentication and authorization
const MainLayout = () => {
  const location = useLocation();
  const { user, loading } = useAuth();
  const [menuCollapsed, setMenuCollapsed] = useState(false);

  // If the user doesn't have an accessType, assign the admin role for demo credentials
  useEffect(() => {
    if (user && user.email === 'admin@sfa.com' && !user.accessType) {
      // Only for demo user, ensure accessType is set
      user.accessType = 'admin';
      console.log('Updated user with admin access type:', user);
    }
  }, [user]);

  // Add FontAwesome script
  useEffect(() => {
    const cleanup = addFontAwesome();
    return cleanup;
  }, []);
  
  // Handle mobile menu toggle
  const handleMenuClick = () => {
    setMenuCollapsed(!menuCollapsed);
  };

  // If loading, show spinner
  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Spin size="large" className="flex-col" />
        <p className="mt-4">Loading...</p>
      </div>
    );
  }

  // If not authenticated, redirect to login
  if (!user) {
    return <Navigate to="/auth" state={{ from: location }} replace />;
  }

  return (
    <section className="bg-gray-50 h-screen flex flex-col overflow-hidden">
      <Header user={user} handleMenuClick={handleMenuClick} />
      <div className="flex flex-1 overflow-hidden">
        {/* Mobile sidebar in drawer */}
        <div className="md:hidden">
          <Drawer
            placement="left"
            onClose={() => setMenuCollapsed(false)}
            open={menuCollapsed}
            width={250}
            bodyStyle={{ padding: 0 }}
          >
            <Sidebar user={user} />
          </Drawer>
        </div>
        
        {/* Desktop sidebar */}
        <div className="hidden md:block">
          <Sidebar user={user} />
        </div>
        
        {/* Main content */}
        <main className="flex-1 overflow-y-auto bg-gray-50">
          <Outlet context={{ user }} />
        </main>
      </div>
    </section>
  );
};

export default MainLayout;