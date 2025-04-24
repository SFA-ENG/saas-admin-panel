import { SaveOutlined, UploadOutlined, UserOutlined } from "@ant-design/icons";
import {
  Avatar,
  Button,
  Card,
  Col,
  Form,
  Input,
  Row,
  Upload,
  message,
} from "antd";
import { useState } from "react";
import useAuthStore from "../../stores/AuthStore/AuthStore";
import "./Profile.css";

const Profile = () => {
  const { userData, updateProfileData } = useAuthStore();
  const [form] = Form.useForm();
  const [uploading, setUploading] = useState(false);
  const [imageUrl, setImageUrl] = useState(userData?.profile_image || null);

  const handleProfileUpdate = (values) => {
    updateProfileData(values);
    message.success("Profile updated successfully!");
  };

  const handleImageUpload = (info) => {
    if (info.file.status === "uploading") {
      setUploading(true);
      return;
    }

    if (info.file.status === "done") {
      // Get base64 URL from upload response
      getBase64(info.file.originFileObj, (url) => {
        setUploading(false);
        setImageUrl(url);
        updateProfileData({ profile_image: url });
        message.success("Profile picture updated successfully!");
      });
    }
  };

  const getBase64 = (img, callback) => {
    const reader = new FileReader();
    reader.addEventListener("load", () => callback(reader.result));
    reader.readAsDataURL(img);
  };

  return (
    <div className="profile-container">
      <h1 className="profile-title">My Profile</h1>
      <Row gutter={[24, 24]} justify="center">
        <Col xs={24} md={8}>
          <Card className="profile-card text-center">
            <div className="avatar-container">
              <Avatar
                size={128}
                src={imageUrl}
                icon={!imageUrl && <UserOutlined />}
                className="profile-large-avatar"
              />
              <div className="upload-overlay">
                <Upload
                  name="avatar"
                  showUploadList={false}
                  customRequest={({ file, onSuccess }) => {
                    // Mock API request
                    setTimeout(() => {
                      onSuccess("ok");
                    }, 1000);
                  }}
                  onChange={handleImageUpload}
                >
                  <Button icon={<UploadOutlined />} loading={uploading}>
                    Change
                  </Button>
                </Upload>
              </div>
            </div>
            <h2 className="mt-4">{userData?.name || userData?.fullname}</h2>
            <p className="user-role">{userData?.stakeholder_type || "User"}</p>
          </Card>
        </Col>

        <Col xs={24} md={12}>
          <Card className="profile-card">
            <Form
              form={form}
              layout="vertical"
              initialValues={{
                fullname: userData?.fullname || userData?.name,
                email: userData?.email,
                phone_number: userData?.phone_number || userData?.mobile_no,
                tenant_code: userData?.tenant_code,
              }}
              onFinish={handleProfileUpdate}
            >
              <Form.Item
                name="fullname"
                label="Full Name"
                rules={[{ required: true, message: "Please enter your name" }]}
              >
                <Input placeholder="Enter your full name" />
              </Form.Item>

              <Form.Item
                name="email"
                label="Email Address"
                rules={[
                  { required: true, message: "Please enter your email" },
                  { type: "email", message: "Please enter a valid email" },
                ]}
              >
                <Input placeholder="Enter your email address" />
              </Form.Item>

              <Form.Item name="phone_number" label="Phone Number">
                <Input placeholder="Enter your phone number" />
              </Form.Item>

              <Form.Item name="tenant_code" label="Tenant Code">
                <Input placeholder="Tenant code" disabled />
              </Form.Item>

              <Form.Item>
                <Button
                  type="primary"
                  htmlType="submit"
                  block
                  icon={<SaveOutlined />}
                >
                  Save Changes
                </Button>
              </Form.Item>
            </Form>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default Profile;
