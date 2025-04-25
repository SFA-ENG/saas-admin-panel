import {
  BellOutlined,
  GlobalOutlined,
  LockOutlined,
  SafetyOutlined,
  SaveOutlined,
} from "@ant-design/icons";
import {
  Button,
  Card,
  Col,
  Divider,
  Form,
  Row,
  Select,
  Switch,
  Tabs,
} from "antd";
import "./Settings.css";

const { TabPane } = Tabs;

const Settings = () => {
  const [form] = Form.useForm();

  const handleSettingsUpdate = (values) => {
    console.log("Settings updated:", values);
    // Here you would update settings in your global state or API
  };

  return (
    <div className="settings-container">
      <Card className="settings-card">
        <Tabs defaultActiveKey="notifications" tabPosition="left">
          <TabPane
            tab={
              <span className="settings-tab">
                <BellOutlined /> Notifications
              </span>
            }
            key="notifications"
          >
            <h2 className="tab-title">Notification Settings</h2>
            <Divider />

            <Form
              layout="vertical"
              form={form}
              initialValues={{
                email_notifications: true,
                push_notifications: true,
                marketing_emails: false,
                notification_sound: "default",
              }}
              onFinish={handleSettingsUpdate}
            >
              <Row gutter={[24, 24]}>
                <Col xs={24} md={12}>
                  <Form.Item
                    name="email_notifications"
                    label="Email Notifications"
                    valuePropName="checked"
                  >
                    <Switch />
                  </Form.Item>

                  <Form.Item
                    name="push_notifications"
                    label="Push Notifications"
                    valuePropName="checked"
                  >
                    <Switch />
                  </Form.Item>

                  <Form.Item
                    name="marketing_emails"
                    label="Marketing Emails"
                    valuePropName="checked"
                  >
                    <Switch />
                  </Form.Item>
                </Col>

                <Col xs={24} md={12}>
                  <Form.Item
                    name="notification_sound"
                    label="Notification Sound"
                  >
                    <Select>
                      <Select.Option value="default">Default</Select.Option>
                      <Select.Option value="chime">Chime</Select.Option>
                      <Select.Option value="bell">Bell</Select.Option>
                      <Select.Option value="silent">Silent</Select.Option>
                    </Select>
                  </Form.Item>
                </Col>
              </Row>

              <Form.Item>
                <Button
                  type="primary"
                  htmlType="submit"
                  icon={<SaveOutlined />}
                >
                  Save Changes
                </Button>
              </Form.Item>
            </Form>
          </TabPane>

          <TabPane
            tab={
              <span className="settings-tab">
                <LockOutlined /> Privacy
              </span>
            }
            key="privacy"
          >
            <h2 className="tab-title">Privacy Settings</h2>
            <Divider />

            <Form
              layout="vertical"
              initialValues={{
                profile_visibility: "all",
                data_sharing: true,
              }}
              onFinish={handleSettingsUpdate}
            >
              <Form.Item name="profile_visibility" label="Profile Visibility">
                <Select>
                  <Select.Option value="all">Everyone</Select.Option>
                  <Select.Option value="connections">
                    Connections Only
                  </Select.Option>
                  <Select.Option value="team">Team Members Only</Select.Option>
                  <Select.Option value="private">Private</Select.Option>
                </Select>
              </Form.Item>

              <Form.Item
                name="data_sharing"
                label="Data Sharing"
                valuePropName="checked"
              >
                <Switch />
              </Form.Item>

              <Form.Item>
                <Button
                  type="primary"
                  htmlType="submit"
                  icon={<SaveOutlined />}
                >
                  Save Changes
                </Button>
              </Form.Item>
            </Form>
          </TabPane>

          <TabPane
            tab={
              <span className="settings-tab">
                <SafetyOutlined /> Security
              </span>
            }
            key="security"
          >
            <h2 className="tab-title">Security Settings</h2>
            <Divider />

            <Form layout="vertical">
              <Form.Item label="Change Password">
                <Button type="default">Change Password</Button>
              </Form.Item>

              <Form.Item
                name="two_factor"
                label="Two-Factor Authentication"
                valuePropName="checked"
              >
                <Switch />
              </Form.Item>

              <Form.Item label="Manage Devices">
                <Button type="default">Manage Devices</Button>
              </Form.Item>

              <Form.Item>
                <Button
                  type="primary"
                  htmlType="submit"
                  icon={<SaveOutlined />}
                >
                  Save Changes
                </Button>
              </Form.Item>
            </Form>
          </TabPane>

          <TabPane
            tab={
              <span className="settings-tab">
                <GlobalOutlined /> Preferences
              </span>
            }
            key="preferences"
          >
            <h2 className="tab-title">User Preferences</h2>
            <Divider />

            <Form layout="vertical">
              <Form.Item name="language" label="Language">
                <Select defaultValue="en">
                  <Select.Option value="en">English</Select.Option>
                  <Select.Option value="es">Spanish</Select.Option>
                  <Select.Option value="fr">French</Select.Option>
                  <Select.Option value="de">German</Select.Option>
                </Select>
              </Form.Item>

              <Form.Item name="timezone" label="Timezone">
                <Select defaultValue="utc">
                  <Select.Option value="utc">UTC</Select.Option>
                  <Select.Option value="est">
                    Eastern Standard Time
                  </Select.Option>
                  <Select.Option value="pst">
                    Pacific Standard Time
                  </Select.Option>
                  <Select.Option value="ist">India Standard Time</Select.Option>
                </Select>
              </Form.Item>

              <Form.Item>
                <Button
                  type="primary"
                  htmlType="submit"
                  icon={<SaveOutlined />}
                >
                  Save Changes
                </Button>
              </Form.Item>
            </Form>
          </TabPane>
        </Tabs>
      </Card>
    </div>
  );
};

export default Settings;
