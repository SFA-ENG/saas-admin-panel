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
  const handleFormSubmit = (values) => {
    // Default role will be assigned after creation through the role assignment interface
    console.log('New User:', values);
    message.success('User created successfully');
    navigate('/user-management/users');
  };

  // Handle image upload
  const handleImageUpload = ({ fileList }) => {
    if (fileList.length > 0 && fileList[0].originFileObj) {
      const reader = new FileReader();
      reader.onload = () => {
        setPreviewImage(reader.result);
      };
      reader.readAsDataURL(fileList[0].originFileObj);
    } else {
      setPreviewImage(null);
    }
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
                  name="password"
                  label="Password"
                  rules={[
                    { required: true, message: 'Please enter password' },
                    { min: 8, message: 'Password must be at least 8 characters' }
                  ]}
                >
                  <Input.Password prefix={<LockOutlined />} placeholder="Enter password" />
                </Form.Item>
                
                <Form.Item
                  name="confirmPassword"
                  label="Confirm Password"
                  rules={[
                    { required: true, message: 'Please confirm password' },
                    ({ getFieldValue }) => ({
                      validator(_, value) {
                        if (!value || getFieldValue('password') === value) {
                          return Promise.resolve();
                        }
                        return Promise.reject(new Error('The two passwords do not match'));
                      },
                    }),
                  ]}
                >
                  <Input.Password prefix={<LockOutlined />} placeholder="Confirm password" />
                </Form.Item>
              </div>
              
              <Form.Item
                name="phone"
                label="Phone Number"
                rules={[{ required: true, message: 'Please enter phone number' }]}
              >
                <Input prefix={<PhoneOutlined />} placeholder="Enter phone number" />
              </Form.Item>
              
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
                <span>Profile Picture</span>
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
            
            <ImgCrop rotate>
              <Upload
                listType="picture-card"
                showUploadList={false}
                onChange={handleImageUpload}
                beforeUpload={() => false}
              >
                {!previewImage ? (
                  <div>
                    <UploadOutlined />
                    <div style={{ marginTop: 8 }}>Upload</div>
                  </div>
                ) : (
                  <div>
                    <UploadOutlined />
                    <div style={{ marginTop: 8 }}>Change</div>
                  </div>
                )}
              </Upload>
            </ImgCrop>
            
            <p className="text-xs text-gray-500 mt-2">
              Upload a profile picture for the user. Recommended size: 200x200px.
            </p>
            
            <Divider />
            
            <div>
              <h4 className="font-medium mb-2">User Access</h4>
              <p className="text-sm text-gray-500 mb-4">
                After creating the user, you can assign specific roles and permissions.
              </p>
              <Button 
                type="dashed" 
                icon={<TagOutlined />} 
                block
                disabled
              >
                Assign Roles (After Creation)
              </Button>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default UserCreate;