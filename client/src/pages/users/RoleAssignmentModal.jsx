import React from 'react';
import { Modal, Form, Select, Button, Tag, Badge } from 'antd';
import { CloseOutlined } from '@ant-design/icons';

const RoleAssignmentModal = ({
  visible,
  onClose,
  onSubmit,
  selectedUser,
  roles,
  loading
}) => {
  const [form] = Form.useForm();

  const handleSubmit = async (values) => {
    await onSubmit(values);
    form.resetFields();
  };

  const handleClose = () => {
    form.resetFields();
    onClose();
  };

  return (
    <Modal
      title={
        <div className="flex justify-between items-center">
          <span>Assign Roles to User</span>
          <button
            onClick={handleClose}
            className="border-none bg-transparent text-gray-500 hover:text-gray-700"
          >
            <CloseOutlined />
          </button>
        </div>
      }
      open={visible}
      onCancel={handleClose}
      footer={null}
      maskStyle={{ backdropFilter: 'blur(4px)' }}
      closeIcon={null}
      className="role-assignment-modal"
    >
      {selectedUser && (
        <div className="mb-6">
          <div className="flex items-center mb-4">
            <img
              src={selectedUser.profile_picture_url || 'https://randomuser.me/api/portraits/men/1.jpg'}
              alt={selectedUser.name}
              className="h-12 w-12 rounded-full mr-4"
            />
            <div>
              <h3 className="text-lg font-semibold">{selectedUser.name}</h3>
              <p className="text-gray-500">{selectedUser.email}</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 mb-6">
            <div>
              <p className="text-sm text-gray-500">Current Roles</p>
              <div className="flex flex-wrap gap-2">
                {selectedUser.roles?.map(role => (
                  <Tag key={role.tenant_role_id} color="blue">{role.name}</Tag>
                ))}
              </div>
            </div>
            <div>
              <p className="text-sm text-gray-500">Status</p>
              <Badge
                status={selectedUser.is_active ? 'success' : 'error'}
                text={selectedUser.is_active ? 'Active' : 'Inactive'}
              />
            </div>
          </div>
        </div>
      )}

      <Form
        form={form}
        layout="vertical"
        onFinish={handleSubmit}
        initialValues={{
          roleIds: selectedUser?.roles?.map(role => role.tenant_role_id) || []
        }}
      >
        <Form.Item
          name="roleIds"
          label="Assign Roles"
          rules={[{ required: true, message: 'Please select at least one role' }]}
        >
          <Select
            mode="multiple"
            allowClear
            placeholder="Select roles to assign"
            style={{ width: '100%' }}
            loading={loading}
          >
            {roles.map(role => (
              <Select.Option key={role.tenant_role_id} value={role.tenant_role_id}>
                {role.name}
              </Select.Option>
            ))}
          </Select>
        </Form.Item>

        <Form.Item className="mb-0 flex justify-end">
          <Button
            type="default"
            onClick={handleClose}
            className="mr-2"
          >
            Cancel
          </Button>
          <Button
            type="primary"
            htmlType="submit"
            loading={loading}
            className="bg-[#6366F1] hover:bg-[#4F46E5]"
          >
            Assign Roles
          </Button>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default RoleAssignmentModal; 