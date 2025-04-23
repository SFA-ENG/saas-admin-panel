import { useState, useEffect } from "react";
import { Link, useLocation, useOutletContext } from "react-router-dom";
import { apiService } from "../../services/apiService";
const Sidebar = ({ user: propUser }) => {
  // Get user context from MainLayout or props
  const contextValue = useOutletContext() || {};
  const user = propUser || contextValue.user;
  const location = useLocation();
  const [userManagementExpanded, setUserManagementExpanded] = useState(
    location.pathname.startsWith('/user-management')
  );
  const [userName, setUserName] = useState('');

  const isActive = (path) => {
    return location.pathname === path;
  };

  const isActiveOrChild = (path) => {
    return location.pathname.startsWith(path);
  };
  
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await apiService.auth.getTenants();
        console.log("side bar",response.data);
        const currentUserData = response.data.find(
          tenant => tenant.tenant_id === user?.tenant_id
        );
        if (currentUserData) {
          setUserName(currentUserData.name);
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };

    if (user?.tenant_id) {
      fetchUserData();
    }
  }, [user?.tenant_id]);
  // Check if user has any of the roles based on accessType
  const hasRole = (requiredRoles) => {
    if (!user || !user.accessType) return false;
    return requiredRoles.includes(user.accessType);
  };
  
  // Check if user has specific permission
  const hasPermission = (permission) => {
    if (!user || !user.permissions) return false;
    return user.permissions.includes(permission);
  };

  return (
    <aside className="w-60 bg-[#F9FAFB] border-r border-[#E5E7EB] flex flex-col h-full">
      <div className="p-4 flex items-center justify-between border-b border-[#E5E7EB]">
        <h1 className="font-bold text-lg text-[#111827]">SportsAdmin Pro</h1>
        <button className="text-[#6B7280]">
          <i className="fas fa-plus"></i>
        </button>
      </div>
      
      <nav className="flex-1 overflow-y-auto">
        <ul className="py-2">
          <li>
            <Link 
              to="/" 
              className={`flex items-center px-4 py-3 text-sm ${isActive('/') 
                ? 'bg-[#FFF7ED] text-[#F97316] border-l-3 border-[#F97316]' 
                : 'text-[#6B7280] hover:bg-gray-100'}`}
            >
              <i className="fas fa-th-large w-5 h-5 mr-3"></i>
              <span>Dashboard</span>
            </Link>
          </li>
          <li>
            <Link 
              to="/tournaments" 
              className={`flex items-center px-4 py-3 text-sm ${isActive('/tournaments') 
                ? 'bg-[#FFF7ED] text-[#F97316] border-l-3 border-[#F97316]' 
                : 'text-[#6B7280] hover:bg-gray-100'}`}
            >
              <i className="fas fa-trophy w-5 h-5 mr-3"></i>
              <span>Tournaments</span>
            </Link>
          </li>
          <li>
            <Link 
              to="/academy" 
              className={`flex items-center px-4 py-3 text-sm ${isActive('/academy') 
                ? 'bg-[#FFF7ED] text-[#F97316] border-l-3 border-[#F97316]' 
                : 'text-[#6B7280] hover:bg-gray-100'}`}
            >
              <i className="fas fa-graduation-cap w-5 h-5 mr-3"></i>
              <span>Academy</span>
            </Link>
          </li>
          <li>
            <Link 
              to="/sfa-next" 
              className={`flex items-center px-4 py-3 text-sm ${isActive('/sfa-next') 
                ? 'bg-[#FFF7ED] text-[#F97316] border-l-3 border-[#F97316]' 
                : 'text-[#6B7280] hover:bg-gray-100'}`}
            >
              <i className="fas fa-chart-line w-5 h-5 mr-3"></i>
              <span>SFA Next</span>
            </Link>
          </li>
          <li>
            <Link 
              to="/sports-camps" 
              className={`flex items-center px-4 py-3 text-sm ${isActive('/sports-camps') 
                ? 'bg-[#FFF7ED] text-[#F97316] border-l-3 border-[#F97316]' 
                : 'text-[#6B7280] hover:bg-gray-100'}`}
            >
              <i className="fas fa-campground w-5 h-5 mr-3"></i>
              <span>Sports Camps</span>
            </Link>
          </li>
          
          {/* Modules - Now linking to a separate page */}
          <li>
            <Link 
              to="/modules" 
              className={`flex items-center px-4 py-3 text-sm ${isActive('/modules') || isActiveOrChild('/modules/') 
                ? 'bg-[#FFF7ED] text-[#F97316] border-l-3 border-[#F97316]' 
                : 'text-[#6B7280] hover:bg-gray-100'}`}
            >
              <i className="fas fa-cubes w-5 h-5 mr-3"></i>
              <span>Modules</span>
            </Link>
          </li>
        </ul>
        
        {/* Only show admin section if user has manager, admin or super_admin accessType */}
        {hasRole(['admin', 'super_admin', 'manager']) && (
          <>
            <div className="px-4 py-2 text-xs font-semibold text-[#6B7280]">
              ADMIN
            </div>
            
            <ul className="py-2">
              
              {/* User Management with submenu - only for manager and admin */}
              <li>
                <div 
                  className={`flex items-center justify-between px-4 py-3 text-sm cursor-pointer ${
                    userManagementExpanded ? 'bg-[#FFF7ED] text-[#F97316]' : 'text-[#6B7280]'
                  } hover:bg-gray-100`}
                  onClick={() => setUserManagementExpanded(!userManagementExpanded)}
                >
                  <div className="flex items-center">
                    <i className="fas fa-users w-5 h-5 mr-3"></i>
                    <span>User Management</span>
                  </div>
                  <i className={`fas fa-chevron-${userManagementExpanded ? 'down' : 'right'} text-xs`}></i>
                </div>
                
                {/* User Management Submenu */}
                {userManagementExpanded && (
                  <ul className="bg-[#F3F4F6] border-l-2 border-gray-200 ml-4">
                    <li>
                      <Link
                        to="/user-management"
                        className={`flex items-center px-4 py-2 text-sm ${
                          isActive('/user-management') 
                            ? 'text-[#F97316] font-medium' 
                            : 'text-[#6B7280] hover:text-[#F97316]'
                        }`}
                      >
                        <i className="fas fa-tachometer-alt w-5 h-5 mr-3 text-xs"></i>
                        <span>Dashboard</span>
                      </Link>
                    </li>
                    <li>
                      <Link
                        to="/user-management/users"
                        className={`flex items-center px-4 py-2 text-sm ${
                          isActive('/user-management/users') 
                            ? 'text-[#F97316] font-medium' 
                            : 'text-[#6B7280] hover:text-[#F97316]'
                        }`}
                      >
                        <i className="fas fa-user w-5 h-5 mr-3 text-xs"></i>
                        <span>Users</span>
                      </Link>
                    </li>
                    
                    {/* Roles management only for admin and super_admin */}
                    {hasRole(['admin', 'super_admin']) && (
                      <li>
                        <Link
                          to="/user-management/roles"
                          className={`flex items-center px-4 py-2 text-sm ${
                            isActive('/user-management/roles') 
                              ? 'text-[#F97316] font-medium' 
                              : 'text-[#6B7280] hover:text-[#F97316]'
                          }`}
                        >
                          <i className="fas fa-tag w-5 h-5 mr-3 text-xs"></i>
                          <span>Roles</span>
                        </Link>
                      </li>
                    )}
                  </ul>
                )}
              </li>
              <li>
                <Link 
                  to="/settings" 
                  className={`flex items-center px-4 py-3 text-sm ${isActive('/settings') 
                    ? 'bg-[#FFF7ED] text-[#F97316] border-l-3 border-[#F97316]' 
                    : 'text-[#6B7280] hover:bg-gray-100'}`}
                >
                  <i className="fas fa-cog w-5 h-5 mr-3"></i>
                  <span>Settings</span>
                </Link>
              </li>
            </ul>
          </>
        )}
      </nav>
      
      <div className="p-4 border-t border-[#E5E7EB] flex items-center">
        <div className="w-8 h-8 rounded-full bg-pink-200 flex items-center justify-center text-pink-600 mr-3">
          {user?.name ? user.name.charAt(0) : 'U'}
        </div>
        <div>
          <p className="text-sm font-medium">{user?.name || 'User'}</p>
          <p className="text-xs text-[#6B7280]">{userName}</p>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
