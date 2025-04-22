import { useState, useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { message, Spin } from 'antd';
import SearchBar from '../components/common/SearchBar';
import { apiService } from '../services/apiService';
import RolesTable from '../components/roles/RolesTable';
import RoleFormModal from '../components/roles/RoleFormModal';

const RolesManagement = () => {
  const queryClient = useQueryClient();
  const [roles, setRoles] = useState([]);
  const [filteredRoles, setFilteredRoles] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const [editingRole, setEditingRole] = useState(null);
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
    setEditingRole(null);
    setModalVisible(true);
  };
  
  // Handler for opening the edit role form
  const showEditRoleModal = (role) => {
    setEditingRole(role);
    setModalVisible(true);
  };

  // Handler for submitting the role form (both add and edit)
  const handleFormSubmit = async (values) => {
    try {
      setLoading(true);
      if (editingRole) {
        // Update role permissions
        if (values.permissions && values.permissions.length > 0) {
          await apiService.roles.updatePermissions({
            tenant_role_id: editingRole.tenant_role_id,
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
      setEditingRole(null);
    } catch (error) {
      console.error('Error creating/updating role:', error);
      const errorMessage = error.response?.data?.message || error.message || 'Failed to create/update role';
      message.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  // Handler for closing the modal
  const handleModalClose = () => {
    setModalVisible(false);
    setEditingRole(null);
  };

  return (
    <div className="p-6">
      <div className="mb-6 flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-semibold text-[#111827]">Roles Management</h1>
          <p className="text-[#6B7280]">Manage roles and permissions</p>
        </div>
        <button
          className="bg-[#6366F1] text-white text-sm px-4 py-2 rounded hover:bg-[#4F46E5] transition-colors"
          onClick={showAddRoleModal}
        >
          Create New Role
        </button>
      </div>
      
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="mb-4">
          <SearchBar 
            placeholder="Search roles by name..." 
            value={searchTerm}
            onChange={setSearchTerm}
            onSearch={handleSearch}
            className="max-w-md"
          />
        </div>
        
        <Spin spinning={loading}>
          <RolesTable
            roles={filteredRoles}
            loading={loading}
            onEditRole={showEditRoleModal}
            permissionsList={permissionsList}
          />
        </Spin>
      </div>
      
      <RoleFormModal
        visible={modalVisible}
        onClose={handleModalClose}
        onSubmit={handleFormSubmit}
        initialValues={editingRole}
        title={editingRole ? 'Edit Role' : 'Add New Role'}
        loading={loading}
        permissionsList={permissionsList}
      />
    </div>
  );
};

export default RolesManagement;