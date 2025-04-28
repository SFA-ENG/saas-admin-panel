import { Button, Checkbox, Form, Input, Select } from "antd";
import { useEffect, useState } from "react";
import useAuthStore from "../../stores/AuthStore/AuthStore";
import LoginCarousel from "./LoginCarousel";
import { CACHE_KEYS, countryCodeOptions, countryCodes } from "../../commons/constants";
import { useApiMutation } from "../../hooks/useApiQuery/useApiQuery";
import { renderErrorNotifications } from "helpers/error.helpers";
import { useNavigate } from "react-router-dom";
const Login = () => {
  const navigate = useNavigate();
  const [isLogin, setIsLogin] = useState(true);
  const { setUserData, userData, token } = useAuthStore();
  const [form] = Form.useForm();

  const { mutate: onboardTenant, isPending: isOnboardingTenantPending } =
    useApiMutation({
      queryKey: [CACHE_KEYS.ONBOARD_TENANT],
      url: "/iam/onboard-tenant",
      method: "POST",
      onSuccess: (data) => {
        console.log("Successfully onboarded tenant", data);
      },
      onError: (error) => {
        renderErrorNotifications(error.errors);
      },
    });

  const { mutate: login, isPending: isLoginPending } = useApiMutation({
    queryKey: [CACHE_KEYS.LOGIN],
    url: "/iam/login",
    method: "POST",
    onSuccess: (data) => {
      setUserData({
        user: data.data.meta,
        token: data.data.access_token,
      });
      navigate("/");
    },
    onError: (error) => {
      renderErrorNotifications(error.errors);
    },
  });

  const onFinish = async (values) => {
    if (isLogin) {
      login({
        tenant_code: values.tenant_code,
        email: values.email,
        password: values.password,
      });
    } else {
      onboardTenant({
        name: values.name,
        root_email: values.email,
        password: values.password,
        contact_number: {
          country_code: values.countryCode,
          isd_code: countryCodes[values.countryCode],
          number: values.phoneNumber,
        },
      });
    }
  };

  // Function to validate phone number format
  const validatePhoneNumber = (phone) => {
    // Basic validation - can be enhanced with more complex patterns
    const phoneRegex = /^\d{10}$/;
    return phoneRegex.test(phone);
  };

  useEffect(() => {
    if (userData && token) {
      navigate("/");
    }
  }, [userData, token, navigate]);

  return (
    <div className="min-h-screen flex bg-soft-purple">
      <div className="w-full max-w-[1440px] mx-auto flex flex-col md:flex-row items-center justify-center shadow-xl">
        {/* Login/Register Form Section */}
        <div className="w-full md:w-1/2 flex flex-col justify-center p-6">
          <div className="max-w-md mx-auto w-full">
            <h2 className="text-3xl font-bold mb-8 text-center text-primary-purple">
              {isLogin ? "Welcome Back" : "Create Account"}
            </h2>

            <Form
              form={form}
              name="login-register"
              initialValues={{
                name: "Sumit",
                tenant_code: "SUM1901",
                email: "sumit@gmail.com",
                password: "password",
                countryCode: "IN",
                phoneNumber: "1234567890",
              }}
              onFinish={onFinish}
              layout="vertical"
              size="large"
              className="space-y-5"
            >
              {!isLogin && (
                <Form.Item
                  label="Full Name"
                  name="name"
                  rules={[
                    { required: true, message: "Please input your full name!" },
                  ]}
                >
                  <Input placeholder="Full Name" />
                </Form.Item>
              )}
              {isLogin && (
                <Form.Item
                  label="Tenant Code"
                  name="tenant_code"
                  rules={[
                    {
                      required: true,
                      message: "Please input your tenant code!",
                    },
                  ]}
                >
                  <Input placeholder="Tenant Code" />
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
                <Input placeholder="Email" />
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
                  >
                    <Select
                      placeholder="Country"
                      options={countryCodeOptions}
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
                <Input.Password placeholder="Password" />
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
                <Button
                  loading={isLoginPending || isOnboardingTenantPending}
                  type="primary"
                  htmlType="submit"
                  block
                  disabled={isLoginPending || isOnboardingTenantPending}
                >
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
