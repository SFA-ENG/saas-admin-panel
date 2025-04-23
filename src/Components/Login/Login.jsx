import {
  FacebookOutlined,
  GoogleOutlined,
  LockOutlined,
  MailOutlined,
} from "@ant-design/icons";
import {
  Button,
  Card,
  Carousel,
  Col,
  Divider,
  Form,
  Input,
  Row,
  Typography,
} from "antd";
import { useState } from "react";
import "./Login.css";

const { Title, Text } = Typography;

const Login = () => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [isLogin, setIsLogin] = useState(true);

  const onFinish = (values) => {
    setLoading(true);
    console.log("Success:", values);
    // Add your login logic here
    setLoading(false);
  };

  const onFinishFailed = (errorInfo) => {
    console.log("Failed:", errorInfo);
  };

  const onRegisterFinish = (values) => {
    setLoading(true);
    console.log("Register Success:", values);
    // Add your register logic here
    setLoading(false);
  };

  const carouselContent = [
    {
      title: "Welcome to Our Platform",
      description: "Experience seamless management and control",
      image: "https://source.unsplash.com/random/800x600?business",
    },
    {
      title: "Powerful Features",
      description: "All the tools you need in one place",
      image: "https://source.unsplash.com/random/800x600?technology",
    },
    {
      title: "Stay Connected",
      description: "Manage everything from anywhere",
      image: "https://source.unsplash.com/random/800x600?office",
    },
  ];

  return (
    <div className="login-container">
      <Row className="login-row">
        <Col xs={24} md={12} className="banner-col">
          <div className="banner-content">
            <Carousel autoplay dots={false}>
              {carouselContent.map((item, index) => (
                <div key={index} className="banner-content">
                  <Title level={1} className="banner-title">
                    {item.title}
                  </Title>
                  <Text className="banner-text">{item.description}</Text>
                </div>
              ))}
            </Carousel>
          </div>
        </Col>
        <Col xs={24} md={12} className="form-col">
          <Card className="auth-card">
            <div className="auth-header">
              <Title level={2} className="auth-title">
                {isLogin ? "Sign In" : "Create Account"}
              </Title>
              <Text className="auth-subtitle">
                {isLogin
                  ? "Welcome back! Please enter your details."
                  : "Join us today! Create your account to get started."}
              </Text>
            </div>

            <Form
              form={form}
              layout="vertical"
              name={isLogin ? "login" : "register"}
              initialValues={{ remember: true }}
              onFinish={isLogin ? onFinish : onRegisterFinish}
              onFinishFailed={onFinishFailed}
              autoComplete="off"
              className="auth-form"
            >
              {!isLogin && (
                <Form.Item
                  name="name"
                  rules={[
                    { required: true, message: "Please input your name!" },
                  ]}
                >
                  <Input
                    prefix={<MailOutlined />}
                    placeholder="Full Name"
                    size="large"
                    className="auth-input"
                  />
                </Form.Item>
              )}

              <Form.Item
                name="email"
                rules={[
                  { required: true, message: "Please input your email!" },
                  { type: "email", message: "Please enter a valid email!" },
                ]}
              >
                <Input
                  prefix={<MailOutlined />}
                  placeholder="Email"
                  size="large"
                  className="auth-input"
                />
              </Form.Item>

              <Form.Item
                name="password"
                rules={[
                  { required: true, message: "Please input your password!" },
                  {
                    min: 6,
                    message: "Password must be at least 6 characters!",
                  },
                ]}
              >
                <Input.Password
                  prefix={<LockOutlined />}
                  placeholder="Password"
                  size="large"
                  className="auth-input"
                />
              </Form.Item>

              {!isLogin && (
                <Form.Item
                  name="confirmPassword"
                  dependencies={["password"]}
                  rules={[
                    {
                      required: true,
                      message: "Please confirm your password!",
                    },
                    ({ getFieldValue }) => ({
                      validator(_, value) {
                        if (!value || getFieldValue("password") === value) {
                          return Promise.resolve();
                        }
                        return Promise.reject(
                          new Error("The two passwords do not match!")
                        );
                      },
                    }),
                  ]}
                >
                  <Input.Password
                    prefix={<LockOutlined />}
                    placeholder="Confirm Password"
                    size="large"
                    className="auth-input"
                  />
                </Form.Item>
              )}

              {isLogin && (
                <div className="form-actions">
                  <a href="#" className="forgot-password">
                    Forgot password?
                  </a>
                </div>
              )}

              <Form.Item>
                <Button
                  type="primary"
                  htmlType="submit"
                  loading={loading}
                  block
                  size="large"
                  className="submit-button"
                >
                  {isLogin ? "Sign In" : "Create Account"}
                </Button>
              </Form.Item>

              <Divider className="divider">or continue with</Divider>

              <div className="social-login">
                <Button icon={<GoogleOutlined />} className="social-button">
                  Google
                </Button>
                <Button icon={<FacebookOutlined />} className="social-button">
                  Facebook
                </Button>
              </div>

              <div className="auth-footer">
                <Text>
                  {isLogin
                    ? "Don't have an account?"
                    : "Already have an account?"}
                </Text>
                <a onClick={() => setIsLogin(!isLogin)} className="auth-switch">
                  {isLogin ? "Sign up" : "Sign in"}
                </a>
              </div>
            </Form>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default Login;
