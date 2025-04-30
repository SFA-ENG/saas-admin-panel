import { useState } from "react";
import { useApiMutation } from "../../../hooks/useApiQuery/useApiQuery";
import { Button, Card, Col, Form, Input, Row } from "antd";
import Text from "antd/lib/typography/Text";
import {
  renderErrorNotifications,
  renderSuccessNotifications,
} from "../../../helpers/error.helpers";
import useAuthStore from "../../../stores/AuthStore/AuthStore";
import { getUserByEmailAndTenantId } from "../Users.service";

const ResetPassword = () => {
  const [form] = Form.useForm();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [userData, setUserData] = useState(null);
  const { userData: authUserData } = useAuthStore();

  async function getUserDetails(values) {
    try {
      setLoading(true);
      const { data, errors } = await getUserByEmailAndTenantId({
        email: values,
        tenant_id: authUserData?.tenant_id,
      });
      if (errors.length) {
        renderErrorNotifications(errors);
      } else {
        setUserData(data?.data?.[0]);
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
    <Row gutter={[16, 16]}>
      <Col span={24}>
        <Card title="Reset Password">
          <Row>
            <Col xs={24} sm={7}>
              <Input.Search
                value={email}
                enterButton
                size="middle"
                placeholder="Search User By Email"
                onSearch={getUserDetails}
                minLength={3}
                onChange={(e) => {
                  setEmail(e.target.value);
                }}
                disabled={loading}
                loading={loading}
              />
            </Col>
            <Col>
              <Button
                onClick={() => {
                  setEmail(null);
                  setUserData(null);
                }}
                type="link"
                disabled={isResettingPassword}
              >
                Reset
              </Button>
            </Col>
          </Row>
        </Card>
      </Col>

      {userData && (
        <Col span={24}>
          <Card title="User Details">
            <Row gutter={[16, 16]}>
              <Col xs={24} sm={12}>
                <div className="flex flex-col gap-2">
                  <div className="flex items-center">
                    <div className="w-24">
                      <Text strong>Name:</Text>
                    </div>
                    <div className="flex-1">
                      <Text>{userData?.name || "NA"}</Text>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <div className="w-24">
                      <Text strong>Email:</Text>
                    </div>
                    <div className="flex-1">
                      <Text>{userData?.email || "NA"}</Text>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <div className="w-24">
                      <Text strong>Phone:</Text>
                    </div>
                    <div className="flex-1">
                      <Text>{userData?.contact_number?.number || "NA"}</Text>
                    </div>
                  </div>
                </div>
              </Col>
            </Row>
          </Card>
        </Col>
      )}

      {userData && (
        <Col span={24}>
          <Form form={form} onFinish={handleSubmit}>
            <Card>
              <Row gutter={[16]}>
               
                <Col xs={24} sm={3}>
                  <Text strong>Enter Password:</Text>
                </Col>
                <Col xs={24} sm={5}>
                  <Form.Item
                    name="password"
                    rules={[
                      {
                        required: true,
                        message: "",
                      },
                      {
                        validator: (_, value) =>
                          value?.trim().length >= 6
                            ? Promise.resolve()
                            : Promise.reject(
                                new Error("Password is too small")
                              ),
                      },
                    ]}
                    hasFeedback
                  >
                    <Input.Password
                      onPaste={handlePaste}
                      onCopy={handleCopy}
                      placeholder="Enter password"
                      autoComplete="new-password"
                    ></Input.Password>
                  </Form.Item>
                </Col>
              </Row>
              <Row gutter={[16]}>
                <Col xs={24} sm={3}>
                  <Text strong>Confirm Password:</Text>
                </Col>
                <Col xs={24} sm={5}>
                  <Form.Item
                    name="confirm_password"
                    dependencies={["password"]}
                    hasFeedback
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
                            new Error("Password Not Matched!")
                          );
                        },
                      }),
                    ]}
                  >
                    <Input.Password
                      onPaste={handlePaste}
                      onCopy={handleCopy}
                      placeholder="Confirm password"
                      autoComplete="new-password"
                    ></Input.Password>
                  </Form.Item>
                </Col>
              </Row>
              <Row gutter={[16]}>
                <Col xs={6} sm={3}>
                  <Button
                    block
                    type="primary"
                    htmlType="submit"
                    loading={isResettingPassword}
                  >
                    Save
                  </Button>
                </Col>
                <Col xs={6} sm={3}>
                  <Button block type="default" onClick={handleReset}>
                    Clear
                  </Button>
                </Col>
              </Row>
            </Card>
          </Form>
        </Col>
      )}
    </Row>
  );
};

export default ResetPassword;
