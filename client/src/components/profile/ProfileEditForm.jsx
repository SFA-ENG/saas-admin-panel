import React, { useState } from 'react';
import { Form, Input, Button, Upload, Row, Col, Typography, Select, Tabs } from 'antd';
import { UserOutlined, UploadOutlined, LinkOutlined } from '@ant-design/icons';

const { Title } = Typography;
const { TabPane } = Tabs;

const ProfileEditForm = ({ 
  form, 
  loading, 
  profileImage, 
  handleImageUpload, 
  onFinish, 
  setIsEditing,
  countryCodeOptions,
  isdCodeOptions,
  handleLogoUpload
}) => {
  const [activeTab, setActiveTab] = useState('url');
  const [logoFile, setLogoFile] = useState(null);

  const handleTabChange = (key) => {
    setActiveTab(key);
    // Clear the other field when switching tabs
    if (key === 'url') {
      form.setFieldValue('logo_file', null);
      setLogoFile(null);
    } else {
      form.setFieldValue('logo_url', '');
    }
  };

  const customHandleLogoUpload = (file) => {
    setLogoFile(file);
    form.setFieldValue('logo_file', file);
    return false; // Prevent automatic upload
  };

  return (
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
                label="Logo"
                required
              >
                <Tabs 
                  activeKey={activeTab} 
                  onChange={handleTabChange}
                  size="small"
                >
                  <TabPane 
                    tab={
                      <span>
                        <LinkOutlined />
                        URL
                      </span>
                    } 
                    key="url"
                  >
                    <Form.Item
                      name="logo_url"
                      rules={[
                        { required: activeTab === 'url', message: 'Please input logo URL!' },
                        { type: 'url', message: 'Please enter a valid URL!' }
                      ]}
                      noStyle
                    >
                      <Input 
                        size="middle" 
                        placeholder="Enter logo URL"
                      />
                    </Form.Item>
                  </TabPane>
                  <TabPane 
                    tab={
                      <span>
                        <UploadOutlined />
                        Upload
                      </span>
                    } 
                    key="upload"
                  >
                    <Form.Item
                      name="logo_file"
                      rules={[
                        { required: activeTab === 'upload', message: 'Please upload a logo!' }
                      ]}
                      noStyle
                    >
                      <Upload
                        name="logo"
                        showUploadList={false}
                        beforeUpload={customHandleLogoUpload}
                        accept="image/*"
                      >
                        <Button 
                          icon={<UploadOutlined />} 
                          size="middle"
                          block
                        >
                          {logoFile ? logoFile.name : 'Click to upload'}
                        </Button>
                      </Upload>
                    </Form.Item>
                  </TabPane>
                </Tabs>
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
};

export default ProfileEditForm; 