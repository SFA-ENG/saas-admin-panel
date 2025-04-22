import React from 'react';
import { Table, Avatar, Tag, Badge, Button, Dropdown, Popconfirm, Tooltip, Switch } from 'antd';
import { MailOutlined, PhoneOutlined, TagOutlined, EditOutlined, DeleteOutlined, MoreOutlined } from '@ant-design/icons';
import { formatPhoneNumber } from '../../utils/formatUtils';

const UsersTable = ({
  users,
  loading,
  onEditUser,
  onDeleteUser,
  onAssignRoles,
  onStatusToggle,
  currentPage,
  pageSize,
  total,
  onPageChange
}) => {
  const columns = [
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
      render: (text, record) => (
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Avatar src={record.profile_picture_url} size="small" />
          <span>{text}</span>
        </div>
      ),
    },
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
      render: (email) => (
        email ? (
          <a href={`mailto:${email}`} className="text-blue-600 hover:underline flex items-center justify-center gap-1">
            <MailOutlined />
            {email}
          </a>
        ) : (
          <span className="text-sm text-gray-500">N/A</span>
        )
      ),
    },
    {
      title: 'Contact Number',
      dataIndex: 'contact_number',
      key: 'contact_number',
      render: (text) => formatPhoneNumber(text),
    },
    {
      title: 'Profile Picture',
      dataIndex: 'profile_picture_url',
      key: 'profile_picture_url',
      render: (url) => (
        url ? (
          <Tooltip title="Click to view">
            <Avatar
              src={url}
              size={48}
              shape="circle"
              style={{ cursor: 'pointer' }}
            >
              U
            </Avatar>
          </Tooltip>
        ) : (
          <span className="text-sm text-gray-500">No image</span>
        )
      ),
    },
    {
      title: 'Roles',
      dataIndex: 'roles',
      key: 'roles',
      render: (roles) => (
        <div className="flex flex-wrap gap-1">
          {roles?.length > 0 ? (
            roles.map(role => (
              <Tag key={role.tenant_role_id} color="blue">{role.name}</Tag>
            ))
          ) : (
            <span className="text-sm text-gray-500">No roles assigned</span>
          )}
        </div>
      ),
    },
    {
      title: 'Status',
      dataIndex: 'is_active',
      key: 'status',
      render: (isActive, record) => (
        <Switch
          checked={isActive}
          checkedChildren="Active"
          unCheckedChildren="Inactive"
          onChange={(checked) => onStatusToggle(record.tenant_user_id, checked)}
        />
      ),
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_, record) => (
        <div className="flex items-center justify-end gap-2">
          <Button
            type="primary"
            icon={<TagOutlined />}
            onClick={() => onAssignRoles(record)}
            className="bg-[#6366F1] hover:bg-[#4F46E5]"
          >
            Assign Roles
          </Button>
          <Dropdown
            menu={{
              items: [
                {
                  key: '1',
                  label: 'Edit',
                  icon: <EditOutlined />,
                  onClick: () => onEditUser(record),
                },
                {
                  key: '2',
                  label: (
                    <Popconfirm
                      title="Delete User"
                      description="Are you sure you want to delete this user?"
                      onConfirm={() => onDeleteUser(record.tenant_user_id)}
                      okText="Yes"
                      cancelText="No"
                      placement="left"
                    >
                      <span className="text-red-500">
                        <DeleteOutlined /> Delete
                      </span>
                    </Popconfirm>
                  ),
                  danger: true,
                },
              ],
            }}
            placement="bottomRight"
            trigger={['click']}
          >
            <Button type="text" icon={<MoreOutlined />} />
          </Dropdown>
        </div>
      ),
    },
  ];

  return (
    <div className="overflow-x-auto">
      <Table
        columns={columns}
        dataSource={users}
        loading={loading}
        pagination={{
          current: currentPage,
          pageSize: pageSize,
          total: total,
          onChange: onPageChange,
        }}
        rowKey="tenant_user_id"
      />
    </div>
  );
};

export default UsersTable; 