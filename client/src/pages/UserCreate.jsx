import { useState } from "react";
import { Card, Form, Input, Select, Button, Upload, message, Avatar, Divider } from 'antd';
import {
  UserOutlined,
  MailOutlined,
  LockOutlined,
  PhoneOutlined,
  TagOutlined,
  SaveOutlined,
  UploadOutlined,
  ArrowLeftOutlined,
  IdcardOutlined,
  UserAddOutlined
} from '@ant-design/icons';
import { useNavigate } from "react-router-dom";
import ImgCrop from 'antd-img-crop';

const UserCreate = () => {
  const [form] = Form.useForm();
  const [previewImage, setPreviewImage] = useState(null);
  const navigate = useNavigate();

  // Handle form submission
  // const handleFormSubmit = (values) => {
  //   // Default role will be assigned after creation through the role assignment interface
  //   console.log('New User:', values);
  //   message.success('User created successfully');
  //   navigate('/user-management/users');
  // };


  const handleFormSubmit = async (values) => {
    try {
      // Prepare the request payload
      const payload = {
        name: values.name,
        email: values.email,
        contact_number: values.contact_number || {
          country_code: '+1',
          isd_code: '1',
          number: values.phone || '',
        },
        profile_picture_url: values.profile_picture_url || ''
      };

      // Make the API call
      const response = await apiService.users.create(payload);

      // Handle success
      message.success('User created successfully');
      navigate('/user-management/users');
    } catch (error) {
      // Handle error
      message.error('Error creating user: ' + (error.response?.data?.message || error.message));
    }
  };
  
  // Handle profile picture URL change
  const handleProfilePictureChange = (e) => {
    const url = e.target.value;
    setPreviewImage(url);
  };

  return (
    <div className="p-6">
      <div className="mb-6 flex items-center">
        <Button
          icon={<ArrowLeftOutlined />}
          onClick={() => navigate('/user-management/users')}
          className="mr-4"
        >
          Back to Users
        </Button>
        <div>
          <h1 className="text-2xl font-semibold text-[#111827]">Create New User</h1>
          <p className="text-[#6B7280]">Add a new user to the system</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2">
          <Card className="shadow-sm">
            <Form
              form={form}
              layout="vertical"
              onFinish={handleFormSubmit}
              requiredMark={false}
            >
              <h2 className="text-lg font-medium mb-4 flex items-center">
                <UserAddOutlined className="mr-2" /> User Information
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Form.Item
                  name="name"
                  label="Full Name"
                  rules={[{ required: true, message: 'Please enter name' }]}
                >
                  <Input prefix={<UserOutlined />} placeholder="Enter full name" />
                </Form.Item>

                <Form.Item
                  name="email"
                  label="Email Address"
                  rules={[
                    { required: true, message: 'Please enter email' },
                    { type: 'email', message: 'Please enter a valid email' }
                  ]}
                >
                  <Input prefix={<MailOutlined />} placeholder="Enter email address" />
                </Form.Item>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Form.Item
                  name="contact_number"
                  label="Contact Number"
                  rules={[{ required: true, message: 'Please enter contact number' }]}
                >
                  <div className="flex space-x-2">
                    <Form.Item
                      name={['contact_number', 'country_code']}
                      noStyle
                      initialValue="+1"
                    >
                      <Select 
                        style={{ width: 100 }}
                        options={[
                          { value: '+1', label: '+1' },
                          { value: '+44', label: '+44' },
                          { value: '+91', label: '+91' },
                          { value: '+81', label: '+81' },
                          { value: '+86', label: '+86' },
                          { value: '+33', label: '+33' },
                          { value: '+49', label: '+49' },
                          { value: '+61', label: '+61' },
                          { value: '+55', label: '+55' },
                          { value: '+7', label: '+7' },
                        ]}
                      />
                    </Form.Item>
                    <Form.Item
                      name={['contact_number', 'isd_code']}
                      noStyle
                      initialValue="1"
                    >
                      <Select 
                        style={{ width: 80 }}
                        options={[
                          { value: '1', label: '1' },
                          { value: '44', label: '44' },
                          { value: '91', label: '91' },
                          { value: '81', label: '81' },
                          { value: '86', label: '86' },
                          { value: '33', label: '33' },
                          { value: '49', label: '49' },
                          { value: '61', label: '61' },
                          { value: '55', label: '55' },
                          { value: '7', label: '7' },
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
                        prefix={<PhoneOutlined />} 
                      />
                    </Form.Item>
                  </div>
                </Form.Item>
              </div>

              <Divider />

              <h2 className="text-lg font-medium mb-4 flex items-center">
                <IdcardOutlined className="mr-2" /> Additional Information
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Form.Item
                  name="department"
                  label="Department"
                >
                  <Input placeholder="Enter department" />
                </Form.Item>

                <Form.Item
                  name="position"
                  label="Position"
                >
                  <Input placeholder="Enter position" />
                </Form.Item>
              </div>

              <Form.Item
                name="bio"
                label="Bio"
              >
                <Input.TextArea
                  placeholder="Enter user bio"
                  autoSize={{ minRows: 3, maxRows: 5 }}
                />
              </Form.Item>

              <Form.Item
                name="profile_picture_url"
                label="Profile Picture URL"
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

              <Form.Item className="flex justify-end mb-0">
                <Button className="mr-2" onClick={() => navigate('/user-management/users')}>
                  Cancel
                </Button>
                <Button
                  type="primary"
                  htmlType="submit"
                  icon={<SaveOutlined />}
                >
                  Create User
                </Button>
              </Form.Item>
            </Form>
          </Card>
        </div>

        <div>
          <Card
            title={
              <div className="flex items-center">
                <UploadOutlined className="mr-2 text-blue-500" />
                <span>Profile Picture Preview</span>
              </div>
            }
            className="shadow-sm"
          >
            <div className="text-center mb-4">
              <Avatar
                size={100}
                src={previewImage}
                icon={!previewImage && <UserOutlined />}
              />
            </div>

            <p className="text-xs text-gray-500 mt-2">
              Enter a URL for the user's profile picture. The image will be displayed here.
            </p>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default UserCreate;