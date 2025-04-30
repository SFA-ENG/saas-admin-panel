import { useState } from "react";
import { useApiMutation } from "../../../hooks/useApiQuery/useApiQuery";
import {
  Button,
  Card,
  Col,
  Form,
  Input,
  Row,
  Typography,
  Alert,
  Tooltip,
} from "antd";
import {
  renderErrorNotifications,
  renderSuccessNotifications,
} from "../../../helpers/error.helpers";
import useAuthStore from "../../../stores/AuthStore/AuthStore";
import { getUserByEmailAndTenantId } from "../Users.service";
import {
  Search,
  RefreshCw,
  User,
  Mail,
  Phone,
  Lock,
  CheckCircle,
  Save,
  XCircle,
} from "lucide-react";
import AccessControlButton from "Components/AccessControlButton/AccessControlButton";

const { Title, Text, Paragraph } = Typography;

const ResetPassword = () => {
  const [form] = Form.useForm();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [userData, setUserData] = useState(null);
  const { userData: authUserData } = useAuthStore();

  async function getUserDetails(values) {
    setUserData(null);
    if (values.trim().length < 3) {
      renderErrorNotifications("Please enter a valid email");
      return;
    }
    try {
      setLoading(true);
      const { data, errors } = await getUserByEmailAndTenantId({
        email: values,
        tenant_id: authUserData?.tenant_id,
      });
      if (errors.length) {
        renderErrorNotifications(errors);
      } else {
        if (!data?.data?.length) {
          renderErrorNotifications("User not found");
        } else {
          setUserData(data?.data?.[0]);
        }
      }
    } catch (error) {
      renderErrorNotifications(error.errors);
    } finally {
      setLoading(false);
    }
  }

  // Reset password mutation
  const { mutate, isLoading: isResettingPassword } = useApiMutation({
    url: "/iam/users/reset-password",
    method: "POST",
    onSuccess: () => {
      renderSuccessNotifications({
        title: "Success",
        message: "Password reset successfully",
      });
      form.resetFields();
      setUserData(null);
      setEmail("");
    },
    onError: (error) => {
      renderErrorNotifications(error.errors);
    },
  });

  const handleReset = () => {
    form.resetFields();
  };

  const handleSubmit = (values) => {
    mutate({
      tenant_user_id: userData.tenant_user_id,
      password: values.password,
    });
  };

  const handlePaste = (e) => e.preventDefault();
  const handleCopy = (e) => e.preventDefault();

  return (
    <div>
      <Card
        bordered={false}
        style={{
          boxShadow: "0 2px 8px rgba(0, 0, 0, 0.06)",
          borderRadius: "12px",
          background: "linear-gradient(145deg, #ffffff, #f9fafb)",
          marginBottom: "16px",
        }}
      >
        <div className="mb-4">
          <div className="flex items-center">
            <div className="bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 h-12 w-2 rounded-full mr-4"></div>
            <div>
              <Title level={3} style={{ margin: 0, fontWeight: 600 }}>
                Reset Password
              </Title>
              <Text type="secondary" className="mt-1">
                Find a user by email to reset their password
              </Text>
            </div>
          </div>
        </div>

        <Row gutter={[16, 16]} align="middle" className="mt-4">
          <Col xs={24} sm={10} md={8} lg={7}>
            <div className="relative">
              <Input
                size="large"
                value={email}
                placeholder="Search user by email"
                onChange={(e) => setEmail(e.target.value)}
                className="pl-10 py-2 pr-3"
                style={{
                  borderRadius: "10px",
                  boxShadow: "0 2px 5px rgba(0, 0, 0, 0.05)",
                  fontSize: "15px",
                  border: "1px solid #e2e8f0",
                }}
                disabled={loading}
                onPressEnter={() => getUserDetails(email)}
              />
            </div>
          </Col>
          <Col>
            <AccessControlButton
              title="Search"
              icon={Search}
              onClick={() => getUserDetails(email)}
            />
          </Col>
          <Col>
            <Tooltip title="Reset search">
              <Button
                onClick={() => {
                  setEmail("");
                  setUserData(null);
                }}
                disabled={isResettingPassword}
                icon={<RefreshCw size={16} />}
                style={{
                  height: "46px",
                  width: "46px",
                  borderRadius: "10px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              />
            </Tooltip>
          </Col>
        </Row>
      </Card>

      {userData && (
        <Card
          bordered={false}
          style={{
            boxShadow: "0 2px 8px rgba(0, 0, 0, 0.06)",
            borderRadius: "12px",
            marginBottom: "16px",
            background: "linear-gradient(145deg, #ffffff, #f9fafb)",
          }}
          className="user-details-card"
        >
          <Title level={4} className="mb-4">
            <span className="flex items-center">
              <User size={20} className="mr-2 text-blue-500" />
              User Details
            </span>
          </Title>

          <Row gutter={[24, 16]}>
            <Col xs={24} sm={12}>
              <div className="bg-blue-50 p-4 rounded-xl mb-2">
                <div className="flex flex-col gap-3">
                  <div className="flex items-center">
                    <div className="w-28 flex items-center">
                      <User size={16} className="mr-2 text-gray-500" />
                      <Text strong style={{ color: "#374151" }}>
                        Name:
                      </Text>
                    </div>
                    <div className="flex-1">
                      <Text style={{ color: "#1f2937", fontWeight: 500 }}>
                        {userData?.name || "Not Available"}
                      </Text>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <div className="w-28 flex items-center">
                      <Mail size={16} className="mr-2 text-gray-500" />
                      <Text strong style={{ color: "#374151" }}>
                        Email:
                      </Text>
                    </div>
                    <div className="flex-1">
                      <Text style={{ color: "#1f2937", fontWeight: 500 }}>
                        {userData?.email || "Not Available"}
                      </Text>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <div className="w-28 flex items-center">
                      <Phone size={16} className="mr-2 text-gray-500" />
                      <Text strong style={{ color: "#374151" }}>
                        Phone:
                      </Text>
                    </div>
                    <div className="flex-1">
                      <Text style={{ color: "#1f2937", fontWeight: 500 }}>
                        {userData?.contact_number?.number || "Not Available"}
                      </Text>
                    </div>
                  </div>
                </div>
              </div>
            </Col>
          </Row>
        </Card>
      )}

      {userData && (
        <Form form={form} onFinish={handleSubmit}>
          <Card
            bordered={false}
            style={{
              boxShadow: "0 2px 8px rgba(0, 0, 0, 0.06)",
              borderRadius: "12px",
              background: "linear-gradient(145deg, #ffffff, #f9fafb)",
            }}
            className="password-form-card"
          >
            <Title level={4} className="mb-4">
              <span className="flex items-center">
                <Lock size={20} className="mr-2 text-purple-500" />
                Set New Password
              </span>
            </Title>

            <Alert
              message="Password Security"
              description="Passwords must be at least 6 characters. Copying and pasting into password fields is disabled for security."
              type="info"
              showIcon
              className="mb-6"
              style={{ borderRadius: "10px" }}
            />

            <Row gutter={[16, 24]}>
              <Col xs={24} sm={12} md={10} lg={8}>
                <Form.Item
                  name="password"
                  label={
                    <span className="flex items-center text-gray-700">
                      <Lock size={16} className="mr-1" />
                      New Password
                    </span>
                  }
                  rules={[
                    {
                      required: true,
                      message: "Please enter a password",
                    },
                    {
                      validator: (_, value) =>
                        value?.trim().length >= 6
                          ? Promise.resolve()
                          : Promise.reject(
                              new Error(
                                "Password must be at least 6 characters"
                              )
                            ),
                    },
                  ]}
                  hasFeedback
                  labelCol={{ span: 24 }}
                  wrapperCol={{ span: 24 }}
                >
                  <Input.Password
                    onPaste={handlePaste}
                    onCopy={handleCopy}
                    placeholder="Enter new password"
                    autoComplete="new-password"
                    style={{
                      borderRadius: "8px",
                      height: "42px",
                    }}
                    className="password-input"
                  />
                </Form.Item>

                <Form.Item
                  name="confirm_password"
                  label={
                    <span className="flex items-center text-gray-700">
                      <CheckCircle size={16} className="mr-1" />
                      Confirm Password
                    </span>
                  }
                  dependencies={["password"]}
                  hasFeedback
                  rules={[
                    {
                      required: true,
                      message: "Please confirm your password",
                    },
                    ({ getFieldValue }) => ({
                      validator(_, value) {
                        if (!value || getFieldValue("password") === value) {
                          return Promise.resolve();
                        }
                        return Promise.reject(
                          new Error("Passwords do not match")
                        );
                      },
                    }),
                  ]}
                  labelCol={{ span: 24 }}
                  wrapperCol={{ span: 24 }}
                >
                  <Input.Password
                    onPaste={handlePaste}
                    onCopy={handleCopy}
                    placeholder="Confirm new password"
                    autoComplete="new-password"
                    style={{
                      borderRadius: "8px",
                      height: "42px",
                    }}
                    className="password-input"
                  />
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={[16, 16]}>
              <Col>
                <AccessControlButton
                  title="Save Changes"
                  icon={Save}
                  onClick={() => form.submit()}
                />
              </Col>
              <Col>
                <Button
                  type="default"
                  onClick={handleReset}
                  style={{
                    height: "42px",
                    borderRadius: "8px",
                  }}
                  className="reset-btn flex items-center"
                  icon={<XCircle size={16} className="mr-1" />}
                >
                  Clear Form
                </Button>
              </Col>
            </Row>
          </Card>
        </Form>
      )}
    </div>
  );
};

export default ResetPassword;
