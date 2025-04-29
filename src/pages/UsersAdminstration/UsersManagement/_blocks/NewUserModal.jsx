import { Modal, Form, Input, Button, Select, Row, Col } from "antd";
import AttachmentBox from "../../../../Components/UploadBox/UploadBox";
import { countryCodeOptions } from "../../../../commons/constants";
import { useState } from "react";

const NewUserModal = ({ existingUser, handleCancel, handleSubmit, isLoading }) => {
  const [form] = Form.useForm();
  const [fileList, setFileList] = useState([]);
  const isEdit = existingUser ? true : false;
  const [mobile, setMobile] = useState('');

  const onFinish = (values) => {
    handleSubmit(values);
  };

  const handleChange = (e) => {
    const value = e.target.value.replace(/\D/g, ''); 
    if (value.length <= 10) {
      setMobile(value);
    }
  };
  return (
    <Modal
      title={isEdit ? "Edit User" : "Add New User"}
      open={true}
      onCancel={handleCancel}
      footer={null}
      width={600}
      className="user-modal"
    >
      <Form
        form={form}
        layout="vertical"
        onFinish={onFinish}
        className="mt-4"
        initialValues={{
          ...existingUser,
          profile_picture: [],
          country_code: existingUser?.contact_number?.country_code || "IN",
          phone_number: existingUser?.contact_number?.number || "",
        }}
      >
        <Row gutter={16} justify="center">
          <Col style={{ height: "120px" }}>
            <Form.Item
              name="profile_picture"
              label="Profile Picture"
              style={{ marginBottom: 0 }}
            >
              <AttachmentBox
                type="image"
                fileList={fileList}
                setFileList={setFileList}
                showPreviewIcon={false}
                previewOnSelect={false}
                style={{ width: "100%", height: "100%" }}
              />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={16}>
          <Col span={24}>
            <Form.Item
              name="name"
              label="Full Name"
              rules={[{ required: true, message: "Please enter user's name" }]}
              
            >
              <Input placeholder="John Doe" 
              onKeyPress={(e) => {
                const regex = /^[A-Za-z\s]$/;
                if (!regex.test(e.key)) {
                  e.preventDefault();
                }
              }}/>
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={16}>
          <Col span={24}>
            <Form.Item
              name="email"
              label="Email Address"
              rules={[
                { required: true, message: "Please enter email address" },
                { type: "email", message: "Please enter a valid email" },
              ]}
            >
              <Input placeholder="john.doe@example.com" autoComplete="email" />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={16}>
          <Col span={8}>
            <Form.Item
              name="country_code"
              label="Country"
              rules={[{ required: true, message: "Required" }]}
            >
              <Select
                placeholder="Select country"
                options={countryCodeOptions}
              />
            </Form.Item>
          </Col>
          <Col span={16}>
            <Form.Item
              name="phone_number"
              label="Phone Number"
              rules={[
                { required: true, message: "Please enter phone number" },
              ]}
            >
              <Input placeholder="9876543210" 
              onChange = {handleChange}
              />
            </Form.Item>
          </Col>
        </Row>

        {!isEdit && (
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="password"
                label="Password"
                rules={[
                  { required: !existingUser, message: "Please enter password" },
                  { min: 8, message: "Password must be at least 8 characters" },
                ]}
                hasFeedback
              >
                <Input.Password
                  placeholder="Enter password"
                  autoComplete="new-password"
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="confirm_password"
                label="Confirm Password"
                dependencies={["password"]}
                hasFeedback
                rules={[
                  {
                    required: !existingUser,
                    message: "Please confirm password",
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
              >
                <Input.Password
                  placeholder="Confirm password"
                  autoComplete="new-password"
                />
              </Form.Item>
            </Col>
          </Row>
        )}

        <div className="flex justify-end gap-3 mt-4">
          <Button onClick={handleCancel} disabled={isLoading}>Cancel</Button>
          <Button
            type="primary"
            htmlType="submit"
            loading={isLoading}
            className="bg-primary hover:bg-primary-dark"
          >
            {isEdit ? "Update User" : "Create User"}
          </Button>
        </div>
      </Form>
    </Modal>
  );
};

export default NewUserModal;
