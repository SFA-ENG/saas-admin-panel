import { useState, useMemo } from "react";
import { useApiQuery, useApiMutation } from "../../../hooks/useApiQuery/useApiQuery";
import { CACHE_KEYS } from "../../../commons/constants";
import { Button, Card, Col, Form, Input, Row, message } from "antd";
import Text from "antd/lib/typography/Text";
import { renderErrorNotifications } from "../../../helpers/error.helpers";
import useAuthStore from "../../../stores/AuthStore/AuthStore";

const ResetPassword = () => {
  const [form] = Form.useForm();
  const [phoneNumber, setPhoneNumber] = useState("");
  const [loading, setLoading] = useState(false);
  const [customerData, setCustomerData] = useState(null);
  const { userData: authUserData } = useAuthStore();

  // Fetch users data
  const {
    data: usersResponse,
    isFetching: usersLoading,
    refetch: refetchUsers,
  } = useApiQuery({
    queryKey: [CACHE_KEYS.USERS_LIST],
    url: "/iam/users",
    params: { tenant_id: authUserData?.tenant_id },
    staleTimeInMinutes: 1,
    onError: (error) => {
      renderErrorNotifications(error.errors);
    },
  });

  const usersData = useMemo(
    () => usersResponse?.data || [],
    [usersResponse?.data]
  );

  // Reset password mutation
  const { mutate: resetPassword, isLoading: isResettingPassword } = useApiMutation({
    url: "/iam/users/reset-password",
    method: "POST",
    onSuccess: () => {
      message.success("Password reset successfully");
      form.resetFields();
      setCustomerData(null);
      setPhoneNumber("");
    },
    onError: (error) => {
      renderErrorNotifications(error.errors);
    },
  });

  const handleSearch = () => {
    if (!phoneNumber) {
      message.error("Please enter a phone number");
      return;
    }

    if (phoneNumber.length !== 10) {
      message.error("Please enter a valid 10-digit phone number");
      return;
    }

    setLoading(true);
    const user = usersData.find(
      (user) => user.contact_number?.number === phoneNumber
    );

    if (user) {
      setCustomerData(user);
    } else {
      message.error("No user found with this phone number");
    }
    setLoading(false);
  };

  const handleReset = () => {
    setPhoneNumber("");
    setCustomerData(null);
    form.resetFields();
  };

  const handleSubmit = (values) => {
    if (!customerData) {
      message.error("Please search for a user first");
      return;
    }

    resetPassword({
      tenant_user_id: customerData.tenant_user_id,
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
            <Col xs={24} sm={6}>
              <Input.Search
                loading={loading}
                value={phoneNumber}
                enterButton
                size="large"
                placeholder="Search Customer By Phone"
                onSearch={handleSearch}
                maxLength={10}
                minLength={10}
                onChange={(e) => setPhoneNumber(e.target.value)}
              />
              <Button onClick={handleReset} type="link">
                Reset
              </Button>
            </Col>
          </Row>
        </Card>
      </Col>

      {customerData && (
        <>
          <Col span={24}>
            <Card title="Customer Details" style={{ marginTop: "16px" }}>
              <Row gutter={[16, 16]}>
                <Col xs={24} sm={12}>
                  <div className="flex flex-col gap-4">
                    <div className="flex items-center">
                      <div className="w-24">
                        <Text strong>Name:</Text>
                      </div>
                      <div className="flex-1">
                        <Text>{customerData.name || "NA"}</Text>
                      </div>
                    </div>
                    <div className="flex items-center">
                      <div className="w-24">
                        <Text strong>Email:</Text>
                      </div>
                      <div className="flex-1">
                        <Text>{customerData.email || "NA"}</Text>
                      </div>
                    </div>
                    <div className="flex items-center">
                      <div className="w-24">
                        <Text strong>Phone:</Text>
                      </div>
                      <div className="flex-1">
                        <Text>{customerData.contact_number?.number || "NA"}</Text>
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
                              : Promise.reject(new Error("Password must be at least 6 characters")),
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
                        { required: true, message: "Please confirm your password!" },
                        ({ getFieldValue }) => ({
                          validator(_, value) {
                            if (!value || getFieldValue("password") === value) {
                              return Promise.resolve();
                            }
                            return Promise.reject(new Error("Passwords do not match!"));
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
                    <Button block type="primary" htmlType="submit" loading={isResettingPassword}>
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
