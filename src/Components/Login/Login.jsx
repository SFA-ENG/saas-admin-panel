import { Button, Checkbox, Form, Input, Select } from "antd";
import { useState } from "react";
import useAuthStore from "../../stores/AuthStore/AuthStore";
import LoginCarousel from "./LoginCarousel";
const Login = () => {
  const [isLogin, setIsLogin] = useState(true);
  const { setUserData } = useAuthStore();
  const [form] = Form.useForm();

  const onFinish = () => {
    setUserData({
      user: {
        name: "Sumit",
        email: "sumit@gmail.com",
        tenant_code: "1234567890",
      },
      token: "1234567890",
    });
    window.location.href = "/";
  };

  // Function to validate phone number format
  const validatePhoneNumber = (phone) => {
    // Basic validation - can be enhanced with more complex patterns
    const phoneRegex = /^\d{10}$/;
    return phoneRegex.test(phone);
  };

  return (
    <div className="min-h-screen flex bg-soft-purple">
      <div className="w-full max-w-[1440px] mx-auto flex flex-col md:flex-row items-center justify-center shadow-xl">
        {/* Login/Register Form Section */}
        <div className="w-full md:w-1/2 flex flex-col justify-center">
          <div className="max-w-md mx-auto w-full">
            <h2 className="text-3xl font-bold mb-8 text-center text-primary-purple">
              {isLogin ? "Welcome Back" : "Create Account"}
            </h2>

            <Form
              form={form}
              name="login-register"
              initialValues={{
                full_name: "Sumit",
                tenant_code: "1234567890",
                email: "sumit@gmail.com",
                password: "1234567890",
              }}
              onFinish={onFinish}
              layout="vertical"
              size="large"
              className="space-y-5"
            >
              {!isLogin && (
                <Form.Item
                  label="Full Name"
                  name="full_name"
                  rules={[
                    { required: true, message: "Please input your full name!" },
                  ]}
                >
                  <Input
                    placeholder="Full Name"
                    className="py-3 rounded-lg border-gray-300"
                  />
                </Form.Item>
              )}
              <Form.Item
                label="Email"
                name="email"
                rules={[
                  {
                    required: true,
                    type: "email",
                    message: "Please input a valid email!",
                  },
                ]}
              >
                <Input
                  placeholder="Email"
                  className="py-3 rounded-lg border-gray-300"
                />
              </Form.Item>
              {!isLogin && (
                <>
                  <Form.Item
                    label="Country Code"
                    name="countryCode"
                    rules={[
                      {
                        required: true,
                        message: "Please select your country code!",
                      },
                    ]}
                    style={{ marginBottom: 0 }}
                  >
                    <Select
                      placeholder="Country"
                      style={{ width: "100%" }}
                      options={[
                        {
                          value: "91",
                          label: "+91 (IN)",
                        },
                        {
                          value: "1",
                          label: "+1 (US)",
                        },
                        {
                          value: "44",
                          label: "+44 (UK)",
                        },
                        // Add more countries as needed
                      ]}
                    />
                  </Form.Item>
                  <Form.Item
                    label="Phone Number"
                    name="phoneNumber"
                    rules={[
                      {
                        required: true,
                        message: "Please enter your phone number!",
                      },
                      {
                        validator: (_, value) => {
                          if (!value) return Promise.resolve();
                          if (validatePhoneNumber(value)) {
                            return Promise.resolve();
                          }
                          return Promise.reject(
                            "Please enter a valid 10-digit phone number"
                          );
                        },
                      },
                    ]}
                  >
                    <Input
                      placeholder="Phone number (10 digits)"
                      maxLength={10}
                    />
                  </Form.Item>
                </>
              )}

              <Form.Item
                label="Password"
                name="password"
                rules={[
                  { required: true, message: "Please input your password!" },
                ]}
              >
                <Input.Password
                  placeholder="Password"
                  className="py-3 rounded-lg border-gray-300"
                />
              </Form.Item>

              {isLogin && (
                <Form.Item>
                  <div className="flex justify-between items-center">
                    <Checkbox>Remember me</Checkbox>
                    <a
                      href="#"
                      className="text-primary-purple hover:text-secondary-purple transition-colors"
                    >
                      Forgot password?
                    </a>
                  </div>
                </Form.Item>
              )}

              <Form.Item>
                <Button type="primary" htmlType="submit" block>
                  {isLogin ? "Log In" : "Sign Up"}
                </Button>
              </Form.Item>

              <div className="text-center">
                <p className="mt-6 text-gray-600">
                  {isLogin
                    ? "Don't have an account? "
                    : "Already have an account? "}
                  <a
                    href="#"
                    onClick={(e) => {
                      e.preventDefault();
                      setIsLogin(!isLogin);
                    }}
                    className="text-primary-purple font-medium hover:text-secondary-purple transition-colors"
                  >
                    {isLogin ? "Sign Up" : "Log In"}
                  </a>
                </p>
              </div>
            </Form>
          </div>
        </div>

        {/* Carousel Section */}
        <div className="hidden md:block md:w-1/2 h-screen">
          <div className="h-full">
            <LoginCarousel />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
