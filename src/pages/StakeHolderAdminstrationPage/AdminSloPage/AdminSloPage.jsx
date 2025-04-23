import { Button, Card, Col, Form, Input, Row, Select, Space } from "antd";
import {
  renderErrorNotifications,
  renderSuccessNotifications,
} from "helpers/error.helpers";
import { useState } from "react";
import { createAdminSlo } from "../UserAdministrationPage.services";

const AdminSloPage = () => {
  const [form] = Form.useForm();
  const [confirmMpinVisible, setConfirmMpinVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  // Mock cities data - Replace this with your actual cities data from API
  const states = [
    { value: "BIHAR", label: "Bihar" },
    { value: "JHARKHAND", label: "Jharkhand" },
    { value: "MADHYA PRADESH", label: "Madhya Pradesh" },
    { value: "UTTAR PRADESH", label: "Uttar Pradesh" },
    { value: "WEST BENGAL", label: "West Bengal" },
  ];

  const sports = [
    { value: "CRICKET", label: "Cricket" },
    { value: "FOOTBALL", label: "Football" },
    { value: "TENNIS", label: "Tennis" },
    { value: "BASKETBALL", label: "Basketball" },
  ];

  const onFinish = async (values) => {
    if (values.mpin !== values.confirmMpin) {
      form.setFields([
        {
          name: "confirmMpin",
          errors: ["MPIN and Confirm MPIN do not match"],
        },
      ]);
      return;
    }
    delete values.confirmMpin;
    setLoading(true);
    try {
      const { errors } = await createAdminSlo({
        payload: {
          ...values,
          type: "SLO",
          cities: values.cities,
        },
      });

      if (errors.length) {
        renderErrorNotifications(errors?.message || "Error creating SLO Admin");
      } else {
        renderSuccessNotifications({
          title: "SLO Admin created successfully",
          description: "SLO  can now login to the Admin portal",
        });
        form.resetFields();
      }
    } catch (err) {
      console.log(err);
      renderErrorNotifications(err?.message || "Error creating SLO Admin");
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    form.resetFields();
    setConfirmMpinVisible(false);
  };

  return (
    <Card
      title="Create SLO Admin"
      style={{
        maxWidth: 800,
        margin: "24px auto",
        boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
        borderRadius: 8,
      }}
    >
      <Form
        form={form}
        layout={"vertical"}
        onFinish={onFinish}
        autoComplete="off"
        initialValues={{ type: "SLO" }}
        labelCol={24}
        wrapperCol={24}
      >
        <Row gutter={[24, 0]}>
          <Col xs={24} md={12}>
            <Form.Item
              name="fullname"
              label="Full Name"
              rules={[{ required: true, message: "Please enter full name" }]}
            >
              <Input placeholder="Enter full name" />
            </Form.Item>
          </Col>

          <Col xs={24} md={12}>
            <Form.Item
              name="mobile_no"
              label="Mobile Number"
              rules={[
                { required: true, message: "Please enter phone number" },
                {
                  pattern: /^[0-9]{10}$/,
                  message: "Please enter valid 10-digit phone number",
                },
              ]}
            >
              <Input
                placeholder="Enter phone number"
                maxLength={10}
                onKeyDown={(e) => {
                  // Prevent non-numeric input including 'e', '+', '-'
                  if (
                    !/[0-9]/.test(e.key) &&
                    e.key !== "Backspace" &&
                    e.key !== "Delete" &&
                    e.key !== "ArrowLeft" &&
                    e.key !== "ArrowRight" &&
                    e.key !== "Tab"
                  ) {
                    e.preventDefault();
                  }
                }}
                onChange={(e) => {
                  // Remove any non-numeric characters
                  const value = e.target.value.replace(/\D/g, "");
                  e.target.value = value;
                }}
              />
            </Form.Item>
          </Col>

          <Col xs={24} md={12}>
            <Form.Item
              name="email_id"
              label="Email ID"
              rules={[
                { required: true, message: "Please enter email" },
                { type: "email", message: "Please enter valid email" },
              ]}
            >
              <Input placeholder="Enter email ID" />
            </Form.Item>
          </Col>

          <Col xs={24} md={12}>
            <Form.Item
              name="mpin"
              label="MPIN"
              rules={[
                { required: true, message: "Please enter MPIN" },
                {
                  pattern: /^[0-9]{6}$/,
                  message: "MPIN must be 6 digits",
                },
              ]}
            >
              <Input.Password
                placeholder="Enter 6-digit MPIN"
                maxLength={6}
                onChange={() => setConfirmMpinVisible(true)}
              />
            </Form.Item>
          </Col>

          {confirmMpinVisible && (
            <Col xs={24} md={12}>
              <Form.Item
                name="confirmMpin"
                label="Confirm MPIN"
                rules={[
                  { required: true, message: "Please confirm MPIN" },
                  {
                    pattern: /^[0-9]{6}$/,
                    message: "MPIN must be 6 digits",
                  },
                  ({ getFieldValue }) => ({
                    validator(_, value) {
                      if (!value || getFieldValue("mpin") === value) {
                        return Promise.resolve();
                      }
                      return Promise.reject(
                        new Error("MPIN and Confirm MPIN do not match")
                      );
                    },
                  }),
                ]}
              >
                <Input.Password
                  placeholder="Confirm 6-digit MPIN"
                  maxLength={6}
                />
              </Form.Item>
            </Col>
          )}

          <Col span={24}>
            <Form.Item
              name="state"
              label="States"
              rules={[
                {
                  required: true,
                  message: "Please select at least one state",
                  type: "array",
                },
              ]}
            >
              <Select
                mode="multiple"
                placeholder="Select states"
                options={states}
                style={{ width: "100%" }}
              />
            </Form.Item>
          </Col>

          <Col span={24}>
            <Form.Item
              name="sport"
              label="Sports"
              rules={[
                {
                  required: true,
                  message: "Please select at least one sport",
                  type: "array",
                },
              ]}
            >
              <Select
                mode="multiple"
                placeholder="Select sports"
                options={sports}
                style={{ width: "100%" }}
              />
            </Form.Item>
          </Col>
        </Row>

        <Form.Item
          wrapperCol={{ span: 24 }}
          style={{ textAlign: "right", marginTop: 32 }}
        >
          <Space>
            <Button onClick={handleReset} disabled={loading}>
              Reset
            </Button>
            <Button
              type="primary"
              htmlType="submit"
              loading={loading}
              disabled={loading}
            >
              Create SLO Admin
            </Button>
          </Space>
        </Form.Item>
      </Form>
    </Card>
  );
};

export default AdminSloPage;
