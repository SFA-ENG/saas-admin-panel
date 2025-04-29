import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { Card, Checkbox, Spin, Typography, List } from "antd";
import { useApiQuery, useApiMutation } from "../../../hooks/useApiQuery/useApiQuery";
import { renderErrorNotifications, renderSuccessNotifications } from "helpers/error.helpers";
import useAuthStore from "../../../stores/AuthStore/AuthStore";
import { CACHE_KEYS } from "../../../commons/constants";

const { Text } = Typography;

const AssignRole = () => {
  const location = useLocation();
  const { userData: authUserData } = useAuthStore();
  const { userDetails } = location.state || {};
  const [selectedRoles, setSelectedRoles] = useState(new Set());
  const [updating, setUpdating] = useState(false);

  // Fetch user's current roles
  const {
    data: userRolesResponse,
    isFetching: userRolesLoading,
  } = useApiQuery({
    queryKey: [CACHE_KEYS.USER_ROLES, userDetails?.tenant_user_id],
    url: `/iam/users`,
    enabled: !!userDetails?.tenant_user_id,
    onError: (error) => {
      renderErrorNotifications(error.errors);
    },
  });

  // Fetch all available roles
  const {
    data: rolesResponse,
    isFetching: rolesLoading,
  } = useApiQuery({
    queryKey: [CACHE_KEYS.ROLES_LIST],
    url: "/iam/roles",
    params: { tenant_id: authUserData?.tenant_id },
    onError: (error) => {
      renderErrorNotifications(error.errors);
    },
  });

  // Update user roles mutation
  const { mutate: updateUserRoles } = useApiMutation({
    url: `/iam/users/user-role`,
    method: "PATCH",
    onSuccess: () => {
      renderSuccessNotifications({
        title: "Success",
        message: "User roles updated successfully",
      });
    },
    onError: (error) => {
      renderErrorNotifications(error.errors);
    },
  });

  // Set initial selected roles when user roles are fetched
  useEffect(() => {
    if (userRolesResponse?.data) {
      setSelectedRoles(new Set(userRolesResponse.data.map(role => role.tenant_role_id)));
    }
  }, [userRolesResponse?.data]);

  const handleRoleChange = (roleId) => {
    if (!userDetails?.tenant_user_id) {
      renderErrorNotifications([{
        message: "User ID is missing"
      }]);
      return;
    }

    setUpdating(true);
    const isAdding = !selectedRoles.has(roleId);
    
    // Create a new array with the role ID to be added/removed
    const roleIds = [roleId];
    
    updateUserRoles({
      tenant_user_id: userDetails.tenant_user_id,
      tenant_role_ids: roleIds,
      type: isAdding ? "ADD" : "REMOVE"
    });

    setSelectedRoles((prev) => {
      const updatedRoles = new Set(prev);
      isAdding ? updatedRoles.add(roleId) : updatedRoles.delete(roleId);
      return updatedRoles;
    });

    setUpdating(false);
  };

  const loading = userRolesLoading || rolesLoading;
  const roles = rolesResponse?.data || [];

  return (
    <div style={{ width: "100%", padding: "20px" }}>
      {loading ? (
        <Spin
          size="large"
          style={{ display: "block", textAlign: "center", marginTop: "20px" }}
        />
      ) : userDetails ? (
        <Card title="User Details" style={{ marginBottom: "20px" }}>
          <Text>
            <strong style={{ marginRight: "10px" }}>Name:</strong>{" "}
            {userDetails.name}
          </Text>
          <br />
          <Text>
            <strong style={{ marginRight: "10px" }}>Email:</strong>{" "}
            {userDetails.email}
          </Text>
          <br />
          <Text>
            <strong style={{ marginRight: "10px" }}>Phone:</strong>{" "}
            {userDetails.phone_number || "N/A"}
          </Text>
        </Card>
      ) : (
        <Text type="danger" style={{ textAlign: "center", display: "block" }}>
          User not found.
        </Text>
      )}

      <Card title="Select Roles">
        <List
          dataSource={roles}
          renderItem={(role, index) => (
            <List.Item style={{ flexDirection: "column", alignItems: "start" }}>
              <div style={{ display: "flex", alignItems: "center" }}>
                <Text
                  style={{
                    minWidth: "25px",
                    textAlign: "right",
                    fontWeight: "bold",
                    marginRight: "15px",
                  }}
                >
                  {index + 1}.
                </Text>
                <div>
                  <Checkbox
                    checked={selectedRoles.has(role.tenant_role_id)}
                    onChange={() => handleRoleChange(role.tenant_role_id)}
                    disabled={updating}
                    style={{ paddingLeft: "8px" }}
                  >
                    <span style={{ paddingLeft: "6px", fontWeight: "550" }}>
                      {role.name}
                    </span>
                  </Checkbox>
                  <Text
                    style={{
                      display: "block",
                      fontSize: "13px",
                      color: "#333",
                      marginLeft: "34px",
                    }}
                  >
                    {role.role_description || "No description available"}
                  </Text>
                </div>
              </div>
            </List.Item>
          )}
        />
      </Card>
    </div>
  );
};

export default AssignRole;
