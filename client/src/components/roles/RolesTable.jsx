import React from 'react';
import { Table, Button, Tag, Space, Spin } from 'antd';
import { EditOutlined } from '@ant-design/icons';

const RolesTable = ({
  roles,
  loading,
  onEditRole,
  permissionsList
}) => {
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
            onClick={() => onEditRole(record)}
          >
            Edit
          </Button>
        </Space>
      ),
    },
  ];

  return (
    <Table 
      dataSource={roles} 
      columns={columns} 
      rowKey="tenant_role_id"
      pagination={{ pageSize: 7 }}
      scroll={{ y: 400 }}
      className="roles-table"
      loading={loading}
      sticky
    />
  );
};

export default RolesTable; 