import React from 'react';
import { Modal, Form, Input, Select, Button } from 'antd';
import { CloseOutlined, TagOutlined, InfoCircleOutlined } from '@ant-design/icons';

const RoleFormModal = ({
  visible,
  onClose,
  onSubmit,
  initialValues,
  title,
  loading,
  permissionsList
}) => {
  const [form] = Form.useForm();

  const permissionOptions = permissionsList.map(permission => ({
    label: permission.name,
    value: permission.id
  }));

  const handleRoleNameInput = (e) => {
    const char = e.key;
    if (!/^[A-Za-z_]$/.test(char)) {
      e.preventDefault();
    }
  };

  const handleSubmit = async (values) => {
    await onSubmit(values);
    form.resetFields();
  };

  return (
    <Modal
      title={title}
      open={visible}
      onCancel={onClose}
      footer={null}
      destroyOnClose
      width={550}
      className="role-modal"
      centered
      closeIcon={<CloseOutlined />}
    >
      <Form
        form={form}
        layout="vertical"
        onFinish={handleSubmit}
        initialValues={initialValues}
        className="mt-4"
      >
        <Form.Item
          name="role_name"
          label="Role Name"
          rules={[{ required: true, message: 'Please enter role name' }]}
        >
          <Input 
            prefix={<TagOutlined />} 
            placeholder="Enter role name" 
            onKeyPress={handleRoleNameInput}
          />
        </Form.Item>
        
        <Form.Item
          name="permissions"
          label="Permissions"
          tooltip={{ 
            title: 'Select the permissions for this role', 
            icon: <InfoCircleOutlined /> 
          }}
          rules={[{ required: true, message: 'Please select permissions' }]}
        >
          <Select
            mode="multiple"
            placeholder="Select permissions"
            optionLabelProp="label"
            className="w-full"
            options={permissionOptions}
          />
        </Form.Item>
        
        <Form.Item className="mb-0 flex justify-end">
          <Button className="mr-2" onClick={onClose}>Cancel</Button>
          <Button type="primary" htmlType="submit" loading={loading}>
            {initialValues ? 'Update Role' : 'Create Role'}
          </Button>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default RoleFormModal; 