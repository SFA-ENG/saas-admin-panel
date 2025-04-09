import React, { useState, useEffect } from 'react';
import { Table, Button, message, Spin } from 'antd';
import apiService from '../services/apiService';
import errorHandler from '../utils/errorHandler.jsx';

/**
 * Example component demonstrating the usage of our API service
 */
const ApiUsageExample = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Fetch users on component mount
  useEffect(() => {
    fetchUsers();
  }, []);

  /**
   * Fetch users from the API
   */
  const fetchUsers = async () => {
    setLoading(true);
    setError(null);
    
    try {
      // Using our API service to fetch users
      const data = await apiService.users.getAll();
      setUsers(data);
      message.success('Users loaded successfully');
    } catch (error) {
      // Using our error handler for consistent error handling
      errorHandler.handleError(error, (err) => {
        setError(err.message);
      });
    } finally {
      setLoading(false);
    }
  };

  /**
   * Create a new user example
   */
  const createUser = async () => {
    setLoading(true);
    
    try {
      // Example user data
      const userData = {
        name: 'John Doe',
        email: 'john.doe@example.com',
        role: 'User',
        status: 'active'
      };
      
      // Using our API service to create a user
      const newUser = await apiService.users.create(userData);
      
      // Update the local state
      setUsers(prevUsers => [...prevUsers, newUser]);
      
      message.success('User created successfully');
    } catch (error) {
      // Using our error handler for consistent error handling
      errorHandler.handleError(error);
    } finally {
      setLoading(false);
    }
  };

  /**
   * Update a user example
   * @param {number} id - User ID
   */
  const updateUser = async (id) => {
    setLoading(true);
    
    try {
      // Example update data
      const userData = {
        status: 'inactive'
      };
      
      // Using our API service to update a user
      const updatedUser = await apiService.users.update(id, userData);
      
      // Update the local state
      setUsers(prevUsers => 
        prevUsers.map(user => user.id === updatedUser.id ? updatedUser : user)
      );
      
      message.success('User updated successfully');
    } catch (error) {
      // Using our error handler for consistent error handling
      errorHandler.handleError(error);
    } finally {
      setLoading(false);
    }
  };

  /**
   * Delete a user example
   * @param {number} id - User ID
   */
  const deleteUser = async (id) => {
    setLoading(true);
    
    try {
      // Using our API service to delete a user
      await apiService.users.delete(id);
      
      // Update the local state
      setUsers(prevUsers => prevUsers.filter(user => user.id !== id));
      
      message.success('User deleted successfully');
    } catch (error) {
      // Using our error handler for consistent error handling
      errorHandler.handleError(error);
    } finally {
      setLoading(false);
    }
  };

  // Table columns definition
  const columns = [
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
    },
    {
      title: 'Role',
      dataIndex: 'role',
      key: 'role',
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status) => (
        <span className={`status-${status}`}>
          {status.charAt(0).toUpperCase() + status.slice(1)}
        </span>
      ),
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_, record) => (
        <div className="button-group">
          <Button size="small" onClick={() => updateUser(record.id)}>Update</Button>
          <Button size="small" danger onClick={() => deleteUser(record.id)}>Delete</Button>
        </div>
      ),
    },
  ];

  return (
    <div className="api-example">
      <div className="header">
        <h2>API Usage Example</h2>
        <Button type="primary" onClick={createUser} disabled={loading}>
          Create User
        </Button>
      </div>
      
      {error && (
        <div className="error-message">
          {error}
        </div>
      )}
      
      <Spin spinning={loading}>
        <Table
          dataSource={users}
          columns={columns}
          rowKey="id"
          pagination={{ pageSize: 5 }}
        />
      </Spin>
      
      <div className="code-explanation">
        <h3>Implementation Notes</h3>
        <p>
          This component demonstrates how to use our custom HTTP client and API service.
          It shows the pattern for fetching data, handling loading states, and consistent
          error handling across the application.
        </p>
      </div>
    </div>
  );
};

export default ApiUsageExample;