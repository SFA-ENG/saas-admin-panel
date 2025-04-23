import { Button, Card, Col, Form, Input, Row } from "antd";
import Text from "antd/lib/typography/Text";
import _ from "lodash";
import { useState } from "react";
import {
  resetUserPasswordByPhoneNumber,
  fetchStakeHolders,
} from "../UserAdministrationPage.services";
import {
  renderErrorNotifications,
  renderSuccessNotifications,
} from "../../../helpers/error.helpers";
import { withAuthContext } from "../../../contexts/AuthContext/AuthContext";

const CustomerDetailsSection = ({ customerData }) => {
  const dataMappeddata = [
    {
      label: "First Name",
      value: "first_name",
    },
    {
      label: "Last Name",
      value: "last_name",
    },
    {
      label: "Email",
      value: "email",
    },
    {
      label: "Phone",
      value: "phone_number",
    },
    {
      label: "User Type",
      value: "user_type",
    },
  ];
  return (
    <Card title={"Customer Detail"} style={{ marginTop: "16px" }}>
      <Row>
        <Col xs={24} sm={12}>
          {dataMappeddata.map(({ label, value, fallback }) => {
            const fallbackValue = fallback || "NA";
            return (
              <Row key={label} style={{ marginBottom: "10px" }}>
                <Col span={10}>
                  <Text strong>{label}</Text>
                </Col>
                <Col span={1}>
                  <Text strong>:</Text>
                </Col>
                <Col span={13}>
                  <Text>{_.get(customerData, value, fallbackValue)}</Text>
                </Col>
              </Row>
            );
          })}
        </Col>
        <Col></Col>
      </Row>
    </Card>
  );
};

const ResetPasswordPageWithoutContext = ({ authContext }) => {
  const { userData } = authContext;
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [customerData, setCustomerData] = useState(null);
  const [phone_number, setPhoneNumber] = useState(null);

  const onSearch = async () => {
    let pattern = /^[6-9]\d{9}$/gm;
    let result = pattern.test(phone_number);
    if (!result) {
      return renderErrorNotifications([
        { message: "Please Enter Valid Number" },
      ]);
    }
    setLoading(true);
    const { data, errors } = await fetchStakeHolders({
      query: { phone_number },
    });
    if (!errors.length) {
      if (!data.length)
        renderErrorNotifications([{ message: "No Customer Found" }]);
      setCustomerData(data[0]);
    } else {
      renderErrorNotifications(errors);
    }
    setLoading(false);
  };

  const onReset = () => {
    form.resetFields();
  };

  const resetPassword = async ({ password }) => {
    setLoading(true);
    const { errors } = await resetUserPasswordByPhoneNumber({
      body: {
        email:customerData.email,
        last_updated_by: userData.email,
        password,
      },
    });
    if (_.isEmpty(errors)) {
      onReset();
      renderSuccessNotifications({
        title: "Success",
        message: "Password Reset Successfully",
      });
    } else {
      renderErrorNotifications(errors);
    }
    setLoading(false);
  };

  const handlePaste = (e) => {
    e.preventDefault();
  };

  const handleCopy = (e) => {
    e.preventDefault();
  };

  return (
    <Row gutter={[16, 16]}>
      <Col span={24}>
        <Card title={"Reset Mpin"}>
          <Row>
            <Col xs={24} sm={6}>
              <Input.Search
                loading={loading}
                value={phone_number}
                enterButton
                size="middle"
                placeholder="Search Stake Holder By Phone"
                onSearch={onSearch}
                maxLength={10}
                minLength={10}
                onChange={(e) => {
                  setPhoneNumber(e.target.value);
                }}
              />

              <Button
                onClick={() => {
                  setPhoneNumber(null);
                  setCustomerData(null);
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
      <Col span={24}>
        {customerData && <CustomerDetailsSection customerData={customerData} />}
      </Col>
      <Col span={24}>
        <Form form={form} onFinish={resetPassword}>
          {customerData && (
            <Card>
              <Row gutter={[16]}>
                <Col xs={24} sm={3}>
                  <Text strong>Enter Password : </Text>
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
                    ></Input.Password>
                  </Form.Item>
                </Col>
              </Row>
              <Row gutter={[16]}>
                <Col xs={24} sm={3}>
                  <Text strong>Confirm Password : </Text>
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
                    disabled={loading}
                  >
                    Save
                  </Button>
                </Col>
                <Col xs={6} sm={3}>
                  <Button block type="default" onClick={onReset}>
                    Clear
                  </Button>
                </Col>
              </Row>
            </Card>
          )}
        </Form>
      </Col>
    </Row>
  );
};

const ResetPasswordPage = withAuthContext(ResetPasswordPageWithoutContext);
export default ResetPasswordPage;
