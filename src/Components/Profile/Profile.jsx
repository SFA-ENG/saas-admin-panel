import {
  UploadOutlined,
  UserOutlined,
  LoadingOutlined,
} from "@ant-design/icons";
import {
  Avatar,
  Button,
  Card,
  Col,
  Form,
  Input,
  Row,
  Upload,
  Divider,
  Spin,
} from "antd";
import { useState, useEffect } from "react";
import useAuthStore from "../../stores/AuthStore/AuthStore";
import "./Profile.css";
import {
  useApiQuery,
  useApiMutation,
} from "../../hooks/useApiQuery/useApiQuery";
import { CACHE_KEYS } from "../../commons/constants";
import {
  renderErrorNotifications,
  renderSuccessNotifications,
} from "../../helpers/error.helpers";
import { Save } from "lucide-react";
import AccessControlButton from "Components/AccessControlButton/AccessControlButton";

const Profile = () => {
  const { userData, updateProfileData } = useAuthStore();
  const [form] = Form.useForm();
  const [uploading, setUploading] = useState(false);
  const [imageUrl, setImageUrl] = useState(userData?.profile_image || null);
  const [logoUploading, setLogoUploading] = useState(false);
  const [logoUrl, setLogoUrl] = useState(null);

  const isSuperAdmin = userData?.is_root_user === true;

  const setTenantFormValues = (currentTenant) => {
    if (currentTenant) {
      const formValues = {
        tenant_name: currentTenant.name,
        tenant_email: currentTenant.root_email,
        tenant_phone: `${currentTenant.contact_number?.isd_code} ${currentTenant.contact_number?.number}`,
        address_line_1: currentTenant.address?.address_line_1,
        address_line_2: currentTenant.address?.address_line_2,
        city: currentTenant.address?.city,
        state: currentTenant.address?.state,
        country: currentTenant.address?.country,
        zip_code: currentTenant.address?.zip_code,
        tenant_logo: currentTenant.logo_url,
      };
      form.setFieldsValue(formValues);
      setLogoUrl(currentTenant.logo_url);
      form.validateFields();
    }
  };

  const {
    data: tenantData,
    isFetching: tenantLoading,
    refetch: refetchTenantData,
  } = useApiQuery({
    queryKey: [CACHE_KEYS.TENANT_DATA],
    url: "/iam/tenants",
    params: {
      tenant_id: userData?.tenant_id,
      type: "DETAILED",
    },

    staleTimeInMinutes: 1,
    onSuccess: (data) => {
      const currentTenant = data?.data?.find(
        (tenant) => tenant.tenant_id === userData?.tenant_user_id
      );
      setTenantFormValues(currentTenant);
    },
    onError: (error) => {
      console.error("Error fetching tenant data:", error);
      renderErrorNotifications(error.errors);
    },
  });

  const { mutate: updateTenant, isLoading: isUpdatingTenant } = useApiMutation({
    url: "/iam/tenant",
    method: "PATCH",
    onSuccess: () => {
      renderSuccessNotifications("Profile updated successfully");
      refetchTenantData();
    },
    onError: (error) => {
      console.error("API Error:", error);
      renderErrorNotifications(error.errors);
    },
  });

  const { mutate: updateUser, isLoading: isUpdatingUser } = useApiMutation({
    url: "/iam/users",
    method: "PATCH",
    onSuccess: () => {
      renderSuccessNotifications("Profile updated successfully");
      refetchTenantData();
    },
    onError: (error) => {
      console.error("API Error:", error);
      renderErrorNotifications(error.errors);
    },
  });

  useEffect(() => {
    if (userData) {
      form.setFieldsValue({
        name: userData?.name,
        email: userData?.email,
        phone_number: userData?.contact_number?.number,
        tenant_code: userData?.tenant_code,
        tenant_name: userData?.name,
      });
    }
  }, [userData, form]);

  // Add useEffect to handle initial form values
  useEffect(() => {
    if (userData && tenantData?.data) {
      const currentTenant = tenantData.data.find(
        (tenant) => tenant.tenant_id === userData.tenant_id
      );
      if (currentTenant) {
        setTenantFormValues(currentTenant);
      }
    }
  }, [userData, tenantData, form]);

  const handleProfileUpdate = (values) => {
    const phoneNumber =
      values.tenant_phone?.split(" ").pop()?.trim() ||
      values.phone_number?.trim();

    if (!phoneNumber) {
      renderErrorNotifications("Phone number is required");
      return;
    }

    if (isSuperAdmin) {
      // Super Admin update
      const updateData = {
        name: values.tenant_name,
        email: values.tenant_email,
        contact_number: {
          country_code: "IN",
          isd_code: "+91",
          number: phoneNumber,
        },
        // profile_picture_url: imageUrl,
        is_active: true,
      };

      updateTenant({
        ...updateData,
        tenant_id: userData?.tenant_id,
      });
    } else {
      const updateData = {
        name: values.name,
        email: values.email,
        contact_number: {
          country_code: "IN",
          isd_code: "+91",
          number: phoneNumber,
        },
        is_active: true,
      };

      updateUser({
        ...updateData,
        tenant_user_id: userData?.tenant_user_id,
      });
    }
  };

  const handleImageUpload = (info) => {
    if (info.file.status === "uploading") {
      setUploading(true);
      return;
    }

    if (info.file.status === "done") {
      getBase64(info.file.originFileObj, (url) => {
        setUploading(false);
        setImageUrl(url);
        updateProfileData({ profile_image: url });
        renderSuccessNotifications({
          title: "Success",
          message: "Profile picture updated successfully!",
        });
      });
    }

  };

  const getBase64 = (img, callback) => {
    const reader = new FileReader();
    reader.addEventListener("load", () => callback(reader.result));
    reader.readAsDataURL(img);
  };

  const handleLogoUpload = (info) => {
    if (info.file.status === "uploading") {
      setLogoUploading(true);
      return;
    }

    if (info.file.status === "done") {
      getBase64(info.file.originFileObj, (url) => {
        setLogoUploading(false);
        setLogoUrl(url);
        form.setFieldsValue({ tenant_logo: url });
        renderSuccessNotifications("Logo updated successfully!");
      });
    }
  };

  const currentTenant = tenantData?.data?.find(
    (tenant) => tenant.tenant_id === userData?.tenant_id
  );

  return (
    <div className="profile-container">
      <Spin spinning={tenantLoading}>
        <Row gutter={[24, 24]} justify="center">
          <Col span={24}>
            <Card className="profile-card">
              <div className="profile-header">
                <div className="avatar-container">
                  <Avatar
                    size={100}
                    src={imageUrl}
                    icon={!imageUrl && <UserOutlined />}
                    className="profile-large-avatar"
                  />

                  <div className="upload-overlay">
                    <Upload
                      name="avatar"
                      showUploadList={false}
                      accept="image/*"
                      beforeUpload={(file) => {
                        const isImage = file.type.startsWith("image/");
                        if (!isImage) {
                          renderErrorNotifications(
                            "You can only upload image files!"
                          );
                          return Upload.LIST_IGNORE;
                        }
                        const isLt2M = file.size / 1024 / 1024 < 2;
                        if (!isLt2M) {
                          renderErrorNotifications(
                            "Image must be smaller than 2MB!"
                          );
                          return Upload.LIST_IGNORE;
                        }
                        return true;
                      }}
                      customRequest={({ file, onSuccess }) => {
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
                <div className="profile-info">
                  <h2 className="role-name">
                    {userData?.name || userData?.fullname}
                  </h2>
                  <p className="user-role">
                    {userData?.stakeholder_type || "User"}
                  </p>
                </div>
              </div>
            </Card>
          </Col>

          <Col xs={24} md={24}>
            <Card className="profile-card">
              <Form
                form={form}
                layout="vertical"
                onFinish={handleProfileUpdate}
              >
                <h3 className="form-section-title">Personal Information</h3>
                <Row gutter={[24, 24]}>
                  <Col xs={24} md={12}>
                    <Form.Item name="tenant_name" label="Tenant Name">
                      <Input
                        placeholder="Tenant Name"
                        onKeyPress={(e) => {
                          const regex = /^[a-zA-Z\s]+$/;
                          if (!regex.test(e.key)) {
                            e.preventDefault();
                          }
                        }}
                        disabled={!isSuperAdmin}
                      />
                    </Form.Item>
                  </Col>
                  <Col xs={24} md={12}>
                    {!isSuperAdmin && (
                      <Form.Item name="name" label="User's Name">
                        <Input
                          placeholder="Enter Your Name"
                          onKeyPress={(e) => {
                            const regex = /^[a-zA-Z\s]+$/;
                            if (!regex.test(e.key)) {
                              e.preventDefault();
                            }
                          }}
                        />
                      </Form.Item>
                    )}
                  </Col>
                </Row>

                <Row gutter={[24, 24]}>
                  <Col xs={24} md={12}>
                    <Form.Item
                      name="email"
                      label="Email Address"
                      rules={[
                        { required: true, message: "Please enter your email" },
                        {
                          type: "email",
                          message: "Please enter a valid email",
                        },
                      ]}
                    >
                      <Input placeholder="Enter your email address" disabled />
                    </Form.Item>
                  </Col>
                  <Col xs={24} md={12}>
                    <Form.Item name="phone_number" label="Phone Number">
                      <Input placeholder="Enter your phone number" />
                    </Form.Item>
                  </Col>
                </Row>

                <Divider />

                <h3 className="form-section-title">Tenant Information</h3>
                <Row gutter={[24, 24]}>
                  <Col xs={24} md={12}>
                    <Form.Item name="tenant_code" label="Tenant Code">
                      <Input placeholder="Tenant code" disabled />
                    </Form.Item>
                  </Col>
                  <Col xs={24} md={12}>
                    <Form.Item name="tenant_logo" label="Logo">
                      <Upload
                        name="logo"
                        listType="picture-card"
                        showUploadList={false}
                        accept="image/*"
                        beforeUpload={(file) => {
                          const isImage = file.type.startsWith("image/");
                          if (!isImage) {
                            renderErrorNotifications(
                              "You can only upload image files!"
                            );
                            return Upload.LIST_IGNORE;
                          }
                          const isLt2M = file.size / 1024 / 1024 < 2;
                          if (!isLt2M) {
                            renderErrorNotifications(
                              "Image must be smaller than 2MB!"
                            );
                            return Upload.LIST_IGNORE;
                          }
                          return true;
                        }}
                        customRequest={({ file, onSuccess }) => {
                          setTimeout(() => {
                            onSuccess("ok");
                          }, 1000);
                        }}
                        onChange={handleLogoUpload}
                        disabled={!isSuperAdmin}
                      >
                        {logoUrl ? (
                          <img
                            src={logoUrl}
                            alt="logo"
                            style={{
                              width: "100%",
                              height: "100%",
                              objectFit: "cover",
                            }}
                          />
                        ) : (
                          <div>
                            {logoUploading ? (
                              <LoadingOutlined />
                            ) : (
                              <UploadOutlined />
                            )}
                            <div style={{ marginTop: 8 }}>Upload</div>
                          </div>
                        )}
                      </Upload>
                    </Form.Item>
                  </Col>
                </Row>

                <h3 className="form-section-title">Address Information</h3>
                <Row gutter={[24, 24]}>
                  <Col xs={24} md={12}>
                    <Form.Item name="address_line_1" label="Address Line 1">
                      <Input placeholder="Address Line 1" />
                    </Form.Item>
                  </Col>
                  <Col xs={24} md={12}>
                    <Form.Item name="address_line_2" label="Address Line 2">
                      <Input placeholder="Address Line 2" />
                    </Form.Item>
                  </Col>
                </Row>

                <Row gutter={[24, 24]}>
                  <Col xs={24} md={12}>
                    <Form.Item name="city" label="City">
                      <Input
                        placeholder="City"
                        onKeyPress={(e) => {
                          const regex = /^[a-zA-Z\s]+$/;
                          if (!regex.test(e.key)) {
                            e.preventDefault();
                          }
                        }}
                      />
                    </Form.Item>
                  </Col>
                  <Col xs={24} md={12}>
                    <Form.Item name="state" label="State">
                      <Input
                        placeholder="State"
                        onKeyPress={(e) => {
                          const regex = /^[a-zA-Z\s]+$/;
                          if (!regex.test(e.key)) {
                            e.preventDefault();
                          }
                        }}
                      />
                    </Form.Item>
                  </Col>
                </Row>

                <Row gutter={[24, 24]}>
                  <Col xs={24} md={12}>
                    <Form.Item name="country" label="Country">
                      <Input
                        placeholder="Country"
                        onKeyPress={(e) => {
                          const regex = /^[a-zA-Z\s]+$/;
                          if (!regex.test(e.key)) {
                            e.preventDefault();
                          }
                        }}
                      />
                    </Form.Item>
                  </Col>
                  <Col xs={24} md={12}>
                    <Form.Item name="zip_code" label="ZIP Code">
                      <Input placeholder="ZIP Code" disabled={!isSuperAdmin} />
                    </Form.Item>
                  </Col>
                </Row>

                <Form.Item className="flex justify-end">
                  <AccessControlButton
                    title="Save Changes"
                    icon={Save}
                    onClick={() => form.submit()}
                  />
                </Form.Item>
              </Form>
            </Card>
          </Col>
        </Row>
      </Spin>
    </div>
  );
};

export default Profile;
