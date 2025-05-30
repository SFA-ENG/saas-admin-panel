import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Form, Input, Button, Tabs, message, Select, Divider, Upload, Typography } from 'antd';
import { UserOutlined, LockOutlined, MailOutlined, PhoneOutlined, PictureOutlined, EnvironmentOutlined, LinkOutlined, UploadOutlined } from '@ant-design/icons';
import { useAuth } from '../contexts/AuthContext';
import { apiService } from '../services/apiService';

const { Title } = Typography;
const { TabPane } = Tabs;
const Auth = () => {
  const [activeTab, setActiveTab] = useState('login');
  const [logoActiveTab, setLogoActiveTab] = useState('url');
  const [logoFile, setLogoFile] = useState(null);

  const [loading, setLoading] = useState(false);
  const { login, register, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [form] = Form.useForm();

  // Redirect if already authenticated using useEffect
  useEffect(() => {
    if (isAuthenticated()) {
      navigate('/');
    }
  }, [isAuthenticated, navigate]);

  const handleLogin = async (values) => {
    console.log('Login values:', values);
    setLoading(true);
    try {
      await login(values);
      message.success('Login successful!');
      navigate('/');
    } catch (error) {
      message.error(error.message || 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };


  const handleTabChange = (key) => {
    setLogoActiveTab(key);
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
    return false; //
  }

  const handleRegister = async (values) => {
    setLoading(true);
    try {
      const tenantData = {
        name: values.name,
        root_email: values.root_email,
        password: values.password,
        // logo_url: values.logo_url,
        // tenant_code: values.tenant_code,
        // created_by: values.root_email,
        // address: {
        //   address_line_1: values.address_line_1,
        //   address_line_2: values.address_line_2,
        //   city: values.city,
        //   state: values.state,
        //   country: values.country,
        //   zip_code: values.zip_code
        // },
        contact_number: {
          country_code: values.country_code,
          isd_code: values.isd_code,
          number: values.phone_number
        }
      };

      const response = await apiService.auth.registerTenant(tenantData);
      if (response.success) {
        message.success('Registration successful!');
        form.resetFields();
        setActiveTab('login');
      } else {
        throw new Error(response.message || 'Registration failed');
      }
    } catch (error) {
      message.error(error.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleAlphabeticalInput = (e) => {
    const char = e.key;
    if (!/^[A-Za-z\s]$/.test(char)) {
      e.preventDefault();
    }
  };

  const handleNumericInput = (e) => {
    const char = e.key;
    if (!/^\d$/.test(char)) {
      e.preventDefault();
    }
  };

  const loginForm = (
    <Form
      name="login"
      onFinish={handleLogin}
      layout="vertical"
      initialValues={{ remember: true }}
    >
      <Form.Item
        name="email"
        rules={[
          { required: true, message: 'Please input your email!' },
          { type: 'email', message: 'Please enter a valid email address' }
        ]}
      >
        <Input
          prefix={<UserOutlined />}
          placeholder="Email"
          size="large"
        />
      </Form.Item>

      <Form.Item
        name="password"
        rules={[
          { required: true, message: 'Please input your password!' },
        ]}
      >
        <Input.Password
          prefix={<LockOutlined />}
          placeholder="Password"
          size="large"
        />
      </Form.Item>

      <Form.Item>
        <Button
          type="primary"
          htmlType="submit"
          size="large"
          block
          loading={loading}
          className="bg-blue-600 hover:bg-blue-700"
        >
          Log in
        </Button>
      </Form.Item>

      <div className="text-center text-gray-500 text-sm">
        <p>Demo credentials:</p>
        <p>Email: admin@sfa.com</p>
        <p>Password: Password@123</p>
      </div>
    </Form>
  );

  const registerForm = (
    <Form
      form={form}
      name="register"
      onFinish={handleRegister}
      layout="vertical"
      className="w-full"
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Form.Item
          name="name"
          label="Name"
          rules={[{ required: true, message: 'Please enter name' }]}
        >
          <Input
            prefix={<UserOutlined />}
            placeholder="Enter name"
            size="large"
            className="w-full"
          />
        </Form.Item>

        <Form.Item
          name="root_email"
          label="Email Address"
          rules={[
            { required: true, message: 'Please enter email' },
            { type: 'email', message: 'Please enter a valid email' }
          ]}
          className="w-full"
        >
          <Input
            prefix={<MailOutlined />}
            placeholder="Enter email address"
            size="large"
            className="w-full"
          />
        </Form.Item>
        <Form.Item
          name="password"
          label="Password"
          rules={[
            { required: true, message: 'Please enter password' },
            { min: 8, message: 'Password must be at least 8 characters' },
            { max: 16, message: 'Password must not exceed 16 characters' },
            {
              pattern: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,16}$/,
              message: 'Password must contain at least 1 uppercase letter, 1 lowercase letter, 1 number, and 1 special character'
            }
          ]}
          className="w-full"
        >
          <Input.Password
            prefix={<LockOutlined />}
            placeholder="Enter password"
            size="large"
            className="w-full"
          />
        </Form.Item>

        <Form.Item
          name="confirm_password"
          label="Confirm Password"
          dependencies={['password']}
          rules={[
            { required: true, message: 'Please confirm your password' },
            ({ getFieldValue }) => ({
              validator(_, value) {
                if (!value || getFieldValue('password') === value) {
                  return Promise.resolve();
                }
                return Promise.reject(new Error('Passwords do not match'));
              },
            }),
          ]}
          className="w-full"
        >
          <Input.Password
            prefix={<LockOutlined />}
            placeholder="Confirm password"
            size="large"
            className="w-full"
          />
        </Form.Item>

      </div>

      <Divider>Contact Information</Divider>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Form.Item
          name="country_code"
          label="Country Code"
          rules={[{ required: true, message: 'Please select country code' }]}
          className="w-full"
        >
          <Select placeholder="Select country code" size="large" className="w-full">
            <Select.Option value="IN">India (+91)</Select.Option>
            <Select.Option value="US">USA (+1)</Select.Option>
            <Select.Option value="GB">UK (+44)</Select.Option>
            <Select.Option value="JP">Japan (+81)</Select.Option>
            <Select.Option value="CN">China (+86)</Select.Option>
          </Select>
        </Form.Item>

        <Form.Item
          name="isd_code"
          label="ISD Code"
          rules={[{ required: true, message: 'Please select ISD code' }]}
          className="w-full"
        >
          <Select placeholder="Select ISD code" size="large" className="w-full">
            <Select.Option value="91">+91</Select.Option>
            <Select.Option value="1">+1</Select.Option>
            <Select.Option value="44">+44</Select.Option>
            <Select.Option value="81">+81</Select.Option>
            <Select.Option value="86">+86</Select.Option>
          </Select>
        </Form.Item>

        <Form.Item
          name="phone_number"
          label="Phone Number"
          rules={[
            { required: true, message: 'Please enter phone number' },
            { pattern: /^\d{10}$/, message: 'Phone number must be exactly 10 digits' }
          ]}
          className="w-full"
        >
          <Input
            prefix={<PhoneOutlined />}
            placeholder="Enter phone number"
            size="large"
            maxLength={10}
            className="w-full"
          />
        </Form.Item>
      </div>


      <Form.Item className="mt-8">
        <Button
          type="primary"
          htmlType="submit"
          size="large"
          block
          loading={loading}
          className="bg-blue-600 hover:bg-blue-700"
        >
          Register
        </Button>
      </Form.Item>
    </Form>
  );

  const tabItems = [
    {
      key: 'login',
      label: 'Login',
      children: loginForm
    },
    {
      key: 'register',
      label: 'Register',
      children: registerForm
    }
  ];

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col md:flex-row">
      {/* Left side - Forms */}
      <div className="w-full md:w-1/2 flex items-center justify-center p-8">
        <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-2xl">
          <div className="mb-8 text-center">
            <h1 className="text-3xl font-bold text-blue-600">SFA Admin</h1>
            <p className="text-gray-600 mt-2">Sports Federation Administration</p>
          </div>

          <Tabs
            activeKey={activeTab}
            onChange={setActiveTab}
            items={tabItems}
          />
        </div>
      </div>

      {/* Right side - Hero section */}
      <div className="hidden h-screen md:flex md:w-1/2 bg-blue-600 text-white position fixed right-0 top-0 z-1">
        <div className="flex flex-col justify-center p-8">
          <h2 className="text-3xl font-bold mb-4">Sports Federation Administration</h2>
          <p className="text-lg mb-6">Manage your sports organization efficiently with our comprehensive dashboard</p>
          <ul className="space-y-3 text-base">
            <li className="flex items-center">
              <div className="mr-3 bg-blue-500 p-1 rounded-full">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                </svg>
              </div>
              Live match tracking and scoring
            </li>
            <li className="flex items-center">
              <div className="mr-3 bg-blue-500 p-1 rounded-full">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                </svg>
              </div>
              Tournament management
            </li>
            <li className="flex items-center">
              <div className="mr-3 bg-blue-500 p-1 rounded-full">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                </svg>
              </div>
              Team and player statistics
            </li>
            <li className="flex items-center">
              <div className="mr-3 bg-blue-500 p-1 rounded-full">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                </svg>
              </div>
              User and role management
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Auth;