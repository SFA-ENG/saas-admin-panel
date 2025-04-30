import { Modal, Form, Input, Button, Select } from "antd";
import { getAllPermissionsList } from "../../../../commons/constants";

const NewRoleModal = ({
    existingRole,
    handleCancel,
    handleSubmit,
    permissionsLoading,
    isCreatingRole,
    isUpdatingRole
}) => {
    const [form] = Form.useForm();
    const isEdit = !!existingRole;

    const onFinish = (values) => {
        handleSubmit(values);
    };

    return (
        <Modal
            title={isEdit ? "Edit Role" : "Add New Role"}
            open={true}
            onCancel={handleCancel}
            footer={null}
            width={600}
            className="role-modal"
        >
            <Form
                form={form}
                layout="vertical"
                onFinish={onFinish}
                className="mt-4"
                initialValues={existingRole ? {
                    name: existingRole.name,
                    permissions: existingRole.permissions?.map(perm => perm.id) || []
                } : {}}
            >
                <Form.Item
                    name="name"
                    label="Role Name"
                    rules={[{ required: true, message: "Please enter role name" }]}
                >
                    <Input
                        placeholder="Enter role name"
                        onKeyPress={(e) => {
                            const regex = /^[a-zA-Z_\s]+$/;
                            if (!regex.test(e.key)) {
                                e.preventDefault();
                            }
                        }}
                    />
                </Form.Item>

                <Form.Item
                    name="permissions"
                    label="Permissions"
                    rules={[{ required: true, message: "Please select at least one permission" }]}
                >
                    <Select 
                        mode="multiple" 
                        placeholder="Select permissions"
                        loading={permissionsLoading}
                        notFoundContent={permissionsLoading ? "Loading..." : "No permissions found"}
                        options={getAllPermissionsList()}
                        fieldNames={{ label: 'label', value: 'value' }}
                    />
                </Form.Item>

                <div className="flex justify-end gap-3 mt-4">
                    <Button onClick={handleCancel}>Cancel</Button>
                    <Button
                        type="primary"
                        htmlType="submit"
                        loading={isCreatingRole || isUpdatingRole}
                        className="bg-primary hover:bg-primary-dark"
                    >
                        {isEdit ? "Update Role" : "Create Role"}
                    </Button>
                </div>
            </Form>
        </Modal>
    );
};

export default NewRoleModal;
