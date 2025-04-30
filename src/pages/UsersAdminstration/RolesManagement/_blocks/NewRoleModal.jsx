import { Modal, Form, Input, Button, Select } from "antd";
import { useEffect } from "react";
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
    const isEdit = existingRole ? true : false;

    useEffect(() => {
        if (existingRole) {
            form.setFieldsValue({
                name: existingRole.role_name,
                permissions: existingRole.privileges?.map(perm => perm.tenant_privilege_id) || []
            });
        } else {
            form.resetFields();
        }
    }, [existingRole, form]);

    const onFinish = (values) => {
        handleSubmit(values);
    };

    // Get all available permissions
    const allPermissions = getAllPermissionsList();

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
                    name: existingRole.role_name,
                    permissions: existingRole.privileges?.map(perm => perm.tenant_privilege_id) || []
                } : {}}
            >
                <Form.Item
                    name="name"
                    label="Role Name"
                    rules={[{ required: true, message: "Please enter role name" }]}
                >
                    <Input
                        placeholder="Enter role name"
                        disabled={isEdit}
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
                        options={allPermissions}
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
