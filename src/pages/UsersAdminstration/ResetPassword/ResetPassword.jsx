import { useState } from "react";
import { useApiMutation, useApiQuery } from "../../../hooks/useApiQuery/useApiQuery";
import { CACHE_KEYS } from "../../../commons/constants";
import { Button, Card, Col, Form, Input, Row, message } from "antd";
import Text from "antd/lib/typography/Text";
import { renderErrorNotifications } from "../../../helpers/error.helpers";
import useAuthStore from "../../../stores/AuthStore/AuthStore";

const ResetPassword = () => {
  const [form] = Form.useForm();
  const [email, setEmail] = useState("");
  const [userData, setUserData] = useState(null);
  const { userData: authUserData } = useAuthStore();

  // Fetch users data
  const { data: usersResponse, isPending: usersLoading } = useApiQuery({
    queryKey: [CACHE_KEYS.GET_USER_BY_PHONE],
    url: "/iam/users",
    method: "GET",
    params: {},
    onSuccess: (data) => {
      console.log("usersResponse:", data);
      setUserData(data);
    },
    onError: (error) => {
      renderErrorNotifications(error.errors);
    },
  });

  // Reset password mutation
  const { mutate: resetPassword, isLoading: isResettingPassword } =
    useApiMutation({
      url: "/iam/users/reset-password",
      method: "POST",
      onSuccess: () => {
        message.success("Password reset successfully");
        form.resetFields();
        setUserData(null);
        setEmail("");
      },
      onError: (error) => {
        renderErrorNotifications(error.errors);
      },
    });

  const handleSearch = () => {
    if (email.length < 3) {
      renderErrorNotifications("Please enter a valid email");
      return;
    }
    getUserByPhone({
      email: email,
      tenant_id: authUserData?.tenant_id,
    });
  };

  const handleReset = () => {
    setEmail("");
    setUserData(null);
    form.resetFields();
  };

  const handleSubmit = (values) => {
    if (!userData) {
      message.error("Please search for a user first");
      return;
    }

    resetPassword({
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
            <Col xs={24} sm={8}>
              <Input.Search
                loading={usersLoading}
                value={email}
                enterButton
                size="middle"
                placeholder="Search User By Email"
                onSearch={handleSearch}
                minLength={3}
                onChange={(e) => {
                  setEmail(e.target.value);
                }}
                disabled={isResettingPassword}
              />

              <Button
                onClick={() => {
                  setEmail(null);
                  setUserData(null);
                }}
                type="link"
              >
                Reset
              </Button>
            </Col>
            <Col></Col>
          </Row>
        </Card>
      </Col>

      {userData && (
        <>
          <Col span={24}>
            <Card title="User Details" style={{ marginTop: "16px" }}>
              <Row gutter={[16, 16]}>
                <Col xs={24} sm={12}>
                  <div className="flex flex-col gap-4">
                    <div className="flex items-center">
                      <div className="w-24">
                        <Text strong>Name:</Text>
                      </div>
                      <div className="flex-1">
                        <Text>{userData.name || "NA"}</Text>
                      </div>
                    </div>
                    <div className="flex items-center">
                      <div className="w-24">
                        <Text strong>Email:</Text>
                      </div>
                      <div className="flex-1">
                        <Text>{userData.email || "NA"}</Text>
                      </div>
                    </div>
                    <div className="flex items-center">
                      <div className="w-24">
                        <Text strong>Phone:</Text>
                      </div>
                      <div className="flex-1">
                        <Text>{userData.contact_number?.number || "NA"}</Text>
                      </div>
                    </div>
                  </div>
                </Col>
              </Row>
            </Card>
          </Col>

          <Col span={24}>
            <Form form={form} onFinish={handleSubmit}>
              <Card>
                <Row gutter={[16]}>
                  <Col xs={24} sm={3}>
                    <Text strong>Enter Password :</Text>
                  </Col>
                  <Col xs={24} sm={5}>
                    <Form.Item
                      name="password"
                      rules={[
                        { required: true, message: "Please enter a password" },
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
                    >
                      <Input.Password
                        placeholder="Enter password"
                        onPaste={handlePaste}
                        onCopy={handleCopy}
                      />
                    </Form.Item>
                  </Col>
                </Row>

                <Row gutter={[16]}>
                  <Col xs={24} sm={3}>
                    <Text strong>Confirm Password :</Text>
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
                              new Error("Passwords do not match!")
                            );
                          },
                        }),
                      ]}
                    >
                      <Input.Password
                        placeholder="Confirm password"
                        onPaste={handlePaste}
                        onCopy={handleCopy}
                      />
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
        </>
      )}
    </Row>
  );
};

export default ResetPassword;
