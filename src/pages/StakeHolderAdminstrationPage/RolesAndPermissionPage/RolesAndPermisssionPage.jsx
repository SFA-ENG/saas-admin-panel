import { PlusCircleOutlined } from "@ant-design/icons";
import { Button, Card, Col, Input, Row, Space } from "antd";
import { withAuthContext } from "contexts/AuthContext/AuthContext";
import {
  renderErrorNotifications,
  renderSuccessNotifications,
} from "helpers/error.helpers";
import { useEffect, useState } from "react";
import {
  createRole,
  fetchRoles,
  updateRole,
} from "../UserAdministrationPage.services";
import RolePermissionList from "./_blocks/RolePermissionList";
import RolesModal from "./_blocks/RolesModal";

const RolesAndPermissionPageWithoutContext = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedRole, setSelectedRole] = useState(null);
  const [roles, setRoles] = useState(null);
  const [filteredRoles, setFilteredRoles] = useState([]);
  const [searchValue, setSearchValue] = useState("");
  const [loading, setLoading] = useState(true);

  const fetchAllRoles = async () => {
    setLoading(true);
    try {
      const { data, errors } = await fetchRoles();

      if (!errors.length) {
        setRoles(data.data);
        setFilteredRoles(data.data);
      } else {
        renderErrorNotifications(errors);
      }
    } catch (error) {
      console.error("Error fetching roles:", error);
    }
    setLoading(false);
  };

  const handleEditRole = (role) => {
    setSelectedRole(role);
    setIsModalOpen(true);
  };

  const handleModalSubmit = async (roleData) => {
    setLoading(true);
    try {
      const isUpdateRequest = selectedRole?.role_id ? true : false;

      const payload = {
        ...roleData,
        role_name: roleData.role_name.toUpperCase().replace(/\s+/g, "_"),
      };

      const { errors } = isUpdateRequest
        ? await updateRole({ body: payload, role_id: selectedRole.role_id })
        : await createRole({ body: payload });

      if (!errors.length) {
        onModalClose();
        fetchAllRoles();
        renderSuccessNotifications({
          title: "Success",
          message: `Role ${roleData.role_name} ${
            isUpdateRequest ? "updated" : "created"
          } successfully`,
        });
      } else {
        renderErrorNotifications(errors);
      }
    } catch (error) {
      console.error("Error updating role:", error);
    }
    setLoading(false);
  };

  const onModalClose = () => {
    setIsModalOpen(false);
    setSelectedRole(null);
  };

  const filterData = (searchTerm) => {
    if (!roles) return;
    const lowerSearchTerm = searchTerm.toLowerCase();
    const filtered = roles.filter(({ role_name }) =>
      role_name?.toLowerCase().includes(lowerSearchTerm)
    );
    setFilteredRoles(filtered);
  };

  const handleSearch = (value) => {
    setSearchValue(value);
    filterData(value);
  };

  const handleReset = () => {
    setSearchValue("");
    setFilteredRoles(roles);
  };

  useEffect(() => {
    fetchAllRoles();
  }, []);

  return (
    <Card title="Roles and Permissions">
      <Row justify="space-between" align="top" gutter={[16, 16]}>
        <Col>
          <Space>
            <Input.Search
              style={{ width: "320px" }}
              value={searchValue}
              placeholder="Search roles..."
              enterButton
              size="middle"
              onSearch={handleSearch}
              onChange={(e) => handleSearch(e.target.value)}
              disabled={loading}
            />
            <Button type="link" onClick={handleReset}>
              Reset
            </Button>
          </Space>
        </Col>
        <Col>
          <Button
            style={{ marginBottom: "16px" }}
            type="primary"
            icon={<PlusCircleOutlined />}
            onClick={() => setIsModalOpen(true)}
            disabled={loading}
          >
            New Role
          </Button>
        </Col>
      </Row>

      <RolePermissionList
        data={filteredRoles}
        onEdit={handleEditRole}
        loading={loading}
      />

      {isModalOpen && (
        <RolesModal
          rowData={selectedRole}
          onSubmit={handleModalSubmit}
          onModalClose={onModalClose}
          existingRoles={roles}
        />
      )}
    </Card>
  );
};

const RolesAndPermissionPage = withAuthContext(
  RolesAndPermissionPageWithoutContext
);

export default RolesAndPermissionPage;
