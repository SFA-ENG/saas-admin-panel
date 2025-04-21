import React, { useState, useEffect } from 'react';
import { Form, Input, Button, Upload, message, Card, Row, Col, Avatar, Space, Typography, Select } from 'antd';
import { UserOutlined, UploadOutlined, EditOutlined, SaveOutlined, CloseOutlined } from '@ant-design/icons';
import { apiService } from '../../services/apiService';

const { Title, Text } = Typography;

const Profile = () => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [profileImage, setProfileImage] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [userData, setUserData] = useState(null);

  // Country code and ISD code options
  const countryCodeOptions = [
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
  ];

  const isdCodeOptions = [
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
  ];

  useEffect(() => {
    fetchUserProfile();
  }, []);

  const fetchUserProfile = async () => {
    try {
      const response = await apiService.user.getProfile();
      const data = response.data;
      setUserData(data);
      form.setFieldsValue({
        name: data.name,
        email: data.email,
        logo_url: data.logo_url,
        address_line_1: data.address?.address_line_1,
        address_line_2: data.address?.address_line_2,
        city: data.address?.city,
        state: data.address?.state,
        country: data.address?.country,
        zip_code: data.address?.zip_code,
        country_code: data.contact_number?.country_code,
        isd_code: data.contact_number?.isd_code,
        number: data.contact_number?.number,
      });
      if (data.avatar) {
        setProfileImage(data.avatar);
      }
    } catch (error) {
      message.error('Failed to fetch profile data');
    }
  };

  const handleImageUpload = async (file) => {
    try {
      // Create a preview URL for the image
      const previewUrl = URL.createObjectURL(file);
      setProfileImage(previewUrl);
      message.success('Profile picture updated successfully');
    } catch (error) {
      console.error('Error setting profile picture:', error);
      message.error('Failed to set profile picture. Please try again.');
      // Revert to previous image if setting fails
      if (userData?.avatar) {
        setProfileImage(userData.avatar);
      }
    }
    return false; // Prevent default upload behavior
  };

  const onFinish = async (values) => {
    setLoading(true);
    try {
      // Prepare the payload according to the API structure
      const payload = {
        name: values.name,
        root_email: values.email,
        logo_url: values.logo_url,
        address: {
          address_line_1: values.address_line_1,
          address_line_2: values.address_line_2,
          city: values.city,
          state: values.state,
          country: values.country,
          zip_code: values.zip_code
        },
        contact_number: {
          country_code: values.country_code,
          isd_code: values.isd_code,
          number: values.number
        }
      };

      // Make the API call
      const response = await apiService.auth.updateTenant(payload);
      
      if (response.success) {
        message.success('Profile updated successfully');
        setIsEditing(false);
        fetchUserProfile(); // Refresh the data
      } else {
        throw new Error(response.message || 'Failed to update profile');
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      message.error(error.message || 'Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  const renderProfileView = () => (
    <div className="space-y-8 p-4">
      <div className="flex items-center space-x-8">
        <div className="relative">
          {profileImage ? (
            <img
              src={profileImage}
              alt="Profile"
              className="w-40 h-40 rounded-full object-cover"
            />
          ) : (
            <div className="w-40 h-40 rounded-full bg-gray-200 flex items-center justify-center">
              <UserOutlined className="text-5xl text-gray-400" />
            </div>
          )}
        </div>
        <div>
          <Title level={2}>{userData?.name}</Title>
          <Text type="secondary" className="text-lg">{userData?.email}</Text>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <Card title="Basic Information" className="h-full">
          <div className="space-y-6">
            <div>
              <Text strong className="text-lg">Name:</Text>
              <div className="text-lg mt-1">{userData?.name}</div>
            </div>
            <div>
              <Text strong className="text-lg">Email:</Text>
              <div className="text-lg mt-1">{userData?.email}</div>
            </div>
            <div>
              <Text strong className="text-lg">Logo URL:</Text>
              <div className="text-lg mt-1">{userData?.logo_url}</div>
            </div>
          </div>
        </Card>

        <Card title="Contact Information" className="h-full">
          <div className="space-y-6">
            <div className="grid grid-cols-3 gap-6">
              <div>
                <Text strong className="text-lg">Country Code:</Text>
                <div className="text-lg mt-1">{userData?.contact_number?.country_code}</div>
              </div>
              <div>
                <Text strong className="text-lg">ISD Code:</Text>
                <div className="text-lg mt-1">{userData?.contact_number?.isd_code}</div>
              </div>
              <div>
                <Text strong className="text-lg">Phone Number:</Text>
                <div className="text-lg mt-1">{userData?.contact_number?.number}</div>
              </div>
            </div>
          </div>
        </Card>

        <Card title="Address" className="h-full">
          <div className="space-y-6">
            <div>
              <Text strong className="text-lg">Address Line 1:</Text>
              <div className="text-lg mt-1">{userData?.address?.address_line_1}</div>
            </div>
            <div>
              <Text strong className="text-lg">Address Line 2:</Text>
              <div className="text-lg mt-1">{userData?.address?.address_line_2}</div>
            </div>
            <div className="grid grid-cols-2 gap-6">
              <div>
                <Text strong className="text-lg">City:</Text>
                <div className="text-lg mt-1">{userData?.address?.city}</div>
              </div>
              <div>
                <Text strong className="text-lg">State:</Text>
                <div className="text-lg mt-1">{userData?.address?.state}</div>
              </div>
              <div>
                <Text strong className="text-lg">Country:</Text>
                <div className="text-lg mt-1">{userData?.address?.country}</div>
              </div>
              <div>
                <Text strong className="text-lg">ZIP Code:</Text>
                <div className="text-lg mt-1">{userData?.address?.zip_code}</div>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );

  const renderEditForm = () => (
    <Form
      form={form}
      layout="vertical"
      onFinish={onFinish}
      className="space-y-4"
    >
      <Row gutter={16}>
        <Col span={8}>
          <div className="flex flex-col items-center mb-4">
            <Upload
              name="avatar"
              showUploadList={false}
              beforeUpload={handleImageUpload}
              accept="image/*"
            >
              <div className="relative">
                {profileImage ? (
                  <img
                    src={profileImage}
                    alt="Profile"
                    className="w-32 h-32 rounded-full object-cover"
                  />
                ) : (
                  <div className="w-32 h-32 rounded-full bg-gray-200 flex items-center justify-center">
                    <UserOutlined className="text-4xl text-gray-400" />
                  </div>
                )}
                <Button
                  icon={<UploadOutlined />}
                  className="absolute bottom-0 right-4"
                  size="small"
                >
                  Change
                </Button>
              </div>
            </Upload>
          </div>
        </Col>
        <Col span={16}>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="name"
                label="Name"
                rules={[{ required: true, message: 'Please input your name!' }]}
              >
                <Input size="middle" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="email"
                label="Email"
                rules={[{ required: true, message: 'Please input your email!' }]}
              >
                <Input disabled size="middle" />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="logo_url"
                label="Logo URL"
                rules={[{ required: true, message: 'Please input logo URL!' }]}
              >
                <Input size="middle" />
              </Form.Item>
            </Col>
          </Row>
        </Col>
      </Row>

      <div className="border-t pt-4">
        <Title level={4}>Contact Information</Title>
        <Row gutter={16}>
          <Col span={8}>
            <Form.Item
              name="country_code"
              label="Country Code"
            >
              <Select 
                showSearch
                optionFilterProp="children"
                options={countryCodeOptions}
                size="middle"
                disabled
              />
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item
              name="isd_code"
              label="ISD Code"
            >
              <Select 
                showSearch
                optionFilterProp="children"
                options={isdCodeOptions}
                size="middle"
                disabled
              />
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item
              name="number"
              label="Phone Number"
            >
              <Input size="middle" disabled />
            </Form.Item>
          </Col>
        </Row>
      </div>

      <div className="border-t pt-4">
        <Title level={4}>Address Information</Title>
        <Row gutter={16}>
          <Col span={24}>
            <Form.Item
              name="address_line_1"
              label="Address Line 1"
              rules={[{ required: true, message: 'Please input address line 1!' }]}
            >
              <Input size="middle" />
            </Form.Item>
          </Col>
          <Col span={24}>
            <Form.Item
              name="address_line_2"
              label="Address Line 2"
              rules={[{ required: true, message: 'Please input address line 2!' }]}
            >
              <Input size="middle" />
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item
              name="city"
              label="City"
              rules={[{ required: true, message: 'Please input city!' }]}
            >
              <Input size="middle" />
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item
              name="state"
              label="State"
              rules={[{ required: true, message: 'Please input state!' }]}
            >
              <Input size="middle" />
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item
              name="country"
              label="Country"
              rules={[{ required: true, message: 'Please input country!' }]}
            >
              <Input size="middle" />
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item
              name="zip_code"
              label="ZIP Code"
              rules={[{ required: true, message: 'Please input ZIP code!' }]}
            >
              <Input size="middle" />
            </Form.Item>
          </Col>
        </Row>
      </div>

      <div className="flex justify-end space-x-4 mt-4">
        <Button onClick={() => setIsEditing(false)} size="middle">
          Cancel
        </Button>
        <Button type="primary" htmlType="submit" loading={loading} size="middle">
          Save Changes
        </Button>
      </div>
    </Form>
  );

  return (
    <div className="p-8 min-h-screen">
      <Card 
        title="Profile" 
        className="max-w-7xl mx-auto w-full"
        bodyStyle={{ padding: '24px' }}
        extra={
          !isEditing ? (
            <Button 
              type="primary" 
              icon={<EditOutlined />}
              onClick={() => setIsEditing(true)}
            >
              Edit Profile
            </Button>
          ) : null
        }
      >
        {isEditing ? renderEditForm() : renderProfileView()}
      </Card>
    </div>
  );
};

export default Profile; 