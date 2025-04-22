import React, { useState, useEffect } from 'react';
import { Modal, Form, Input, Select, Button, Avatar } from 'antd';
import { UserOutlined, MailOutlined, PhoneOutlined, UploadOutlined, CloseOutlined } from '@ant-design/icons';

const UserFormModal = ({
  visible,
  onClose,
  onSubmit,
  initialValues,
  title,
  loading
}) => {
  const [form] = Form.useForm();
  const [previewImage, setPreviewImage] = useState(initialValues?.profile_picture_url || null);

  useEffect(() => {
    if (visible) {
      if (initialValues) {
        form.setFieldsValue(initialValues);
        setPreviewImage(initialValues.profile_picture_url || null);
      } else {
        form.resetFields();
        setPreviewImage(null);
      }
    }
  }, [visible, initialValues, form]);

  const handleProfilePictureChange = (e) => {
    const url = e.target.value;
    setPreviewImage(url);
  };

  const handleSubmit = async (values) => {
    await onSubmit(values);
    form.resetFields();
    setPreviewImage(null);
  };

  const handleClose = () => {
    form.resetFields();
    setPreviewImage(null);
    onClose();
  };

  return (
    <Modal
      title={
        <div className="flex justify-between items-center">
          <span>{title}</span>
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
      className="user-modal"
    >
      <Form
        form={form}
        layout="vertical"
        onFinish={handleSubmit}
      >
        <Form.Item
          name="name"
          label="Full Name"
          rules={[{ required: true, message: 'Please enter full name' }]}
        >
          <Input
            placeholder="Enter full name"
            prefix={<UserOutlined className="text-gray-400" />}
          />
        </Form.Item>

        <Form.Item
          name="email"
          label="Email Address"
          rules={[
            { required: true, message: 'Please enter email' },
            { type: 'email', message: 'Please enter a valid email' }
          ]}
        >
          <Input
            placeholder="Enter email address"
            prefix={<MailOutlined className="text-gray-400" />}
          />
        </Form.Item>

        <Form.Item
          label="Contact Number"
          required
        >
          <div className="flex space-x-2">
            <Form.Item
              name={['contact_number', 'country_code']}
              noStyle
              initialValue="IN"
            >
              <Select
                style={{ width: 100 }}
                showSearch
                optionFilterProp="children"
                options={[
                  { value: 'IN', label: 'India (+91)' },
                  { value: 'US', label: 'USA (+1)' },
                  { value: 'GB', label: 'UK (+44)' },
                  { value: 'JP', label: 'Japan (+81)' },
                  { value: 'CN', label: 'China (+86)' },
                  { value: 'DE', label: 'Germany (+49)' },
                  { value: 'FR', label: 'France (+33)' },
                  { value: 'IT', label: 'Italy (+39)' },
                  { value: 'ES', label: 'Spain (+34)' },
                  { value: 'BR', label: 'Brazil (+55)' },
                  { value: 'RU', label: 'Russia (+7)' },
                  { value: 'AU', label: 'Australia (+61)' },
                  { value: 'CA', label: 'Canada (+1)' },
                  { value: 'MX', label: 'Mexico (+52)' },
                  { value: 'ZA', label: 'South Africa (+27)' },
                ]}
              />
            </Form.Item>
            <Form.Item
              name={['contact_number', 'isd_code']}
              noStyle
              initialValue="91"
            >
              <Select
                style={{ width: 80 }}
                options={[
                  { value: '91', label: '+91' },
                  { value: '1', label: '+1' },
                  { value: '44', label: '+44' },
                  { value: '81', label: '+81' },
                  { value: '86', label: '+86' },
                  { value: '49', label: '+49' },
                  { value: '33', label: '+33' },
                  { value: '39', label: '+39' },
                  { value: '34', label: '+34' },
                  { value: '55', label: '+55' },
                  { value: '7', label: '+7' },
                  { value: '61', label: '+61' },
                  { value: '52', label: '+52' },
                  { value: '27', label: '+27' },
                ]}
              />
            </Form.Item>
            <Form.Item
              name={['contact_number', 'number']}
              noStyle
              rules={[{ required: true, message: 'Please enter phone number' }]}
            >
              <Input
                placeholder="Enter phone number"
                prefix={<PhoneOutlined className="text-gray-400" />}
                maxLength={10}
              />
            </Form.Item>
          </div>
        </Form.Item>

        <Form.Item
          name="profile_picture_url"
          label="Profile Picture URL"
          rules={[{ required: true, message: 'Please enter profile picture URL' }]}
        >
          <Input
            placeholder="Enter profile picture URL"
            onChange={handleProfilePictureChange}
            prefix={<UploadOutlined />}
          />
        </Form.Item>

        <div className="text-center mb-4">
          <Avatar
            size={100}
            src={previewImage}
            icon={!previewImage && <UserOutlined />}
          />
        </div>

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
            {initialValues ? 'Update User' : 'Add User'}
          </Button>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default UserFormModal; 