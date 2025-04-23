import { Button, Col, Form, Input, Modal, Row, Select } from "antd";
import { renderErrorNotifications } from "helpers/error.helpers";
import { sideMenuConfig } from "../../../../routing";

const RolesModal = ({ onSubmit, rowData, onModalClose, existingRoles }) => {
  const [form] = Form.useForm();
  const modalPurpose = rowData?.role_name ? "UPDATE" : "CREATE";
  const title = `${modalPurpose === "CREATE" ? "Create" : "Edit"} Role`;

  const getAllPermissions = (sideMenuConfig) => {
    if (!sideMenuConfig || !Array.isArray(sideMenuConfig)) {
      console.error(
        "sideMenuConfig is missing or not an array",
        sideMenuConfig
      );
      return [];
    }

    return sideMenuConfig
      .flatMap((item) => item.allowed_permisions || [])
      .map((perm) => ({
        label: perm,
        value: perm,
      }));
  };

  const onFinish = (values) => {
    const formattedRoleName = values.role_name
      .trim()
      .toUpperCase()
      .replace(/\s+/g, "_");

    const isAlreadyExists = existingRoles?.find(
      (item) => item.role_name === formattedRoleName
    );

    if (isAlreadyExists && modalPurpose !== "UPDATE") {
      renderErrorNotifications([{ message: "Role already exists!" }]);
      return;
    }

    const formattedValues = {
      ...values,
      role_name: formattedRoleName,
    };

    onSubmit(formattedValues);
  };

  return (
    <Modal
      centered
      open={true}
      title={title}
      footer={null}
      onCancel={onModalClose}
      className="roles-modal"
    >
      <Form
        form={form}
        name={title}
        labelCol={{ span: 24 }}
        wrapperCol={{ span: 24 }}
        initialValues={rowData}
        onFinish={onFinish}
        layout="vertical"
      >
        <Form.Item
          label="Role Name"
          name="role_name"
          rules={[{ required: true, message: "Please enter a role name" }]}
        >
          <Input
            placeholder="Enter role name"
            autoComplete="off"
            onChange={(e) => {
              const value = e.target.value.replace(/\.\s/g, " ");
              form.setFieldsValue({ role_name: value });
            }}
          />
        </Form.Item>

        <Form.Item
          label="Description"
          name="role_description"
          rules={[{ required: true, message: "Please enter a description" }]}
        >
          <Input.TextArea placeholder="Enter role description" rows={3} />
        </Form.Item>

        <Form.Item
          label="Permissions"
          name="role_permissions"
          rules={[{ required: true, message: "Please select permissions" }]}
        >
          <Select
            mode="multiple"
            placeholder="Select permissions"
            options={getAllPermissions(sideMenuConfig)}
          />
        </Form.Item>

        <Form.Item noStyle>
          <Row justify="end" gutter={[16]}>
            <Col>
              <Button onClick={() => form.resetFields()} type="default">
                Clear
              </Button>
            </Col>
            <Col>
              <Button type="primary" htmlType="submit">
                {modalPurpose === "CREATE" ? "Create" : "Update"}
              </Button>
            </Col>
          </Row>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default RolesModal;
