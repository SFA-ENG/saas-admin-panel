import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Card, Checkbox, Spin, Typography, List } from "antd";
import {
  useApiQuery,
  useApiMutation,
} from "../../../hooks/useApiQuery/useApiQuery";
import {
  renderErrorNotifications,
  renderSuccessNotifications,
} from "helpers/error.helpers";
import useAuthStore from "../../../stores/AuthStore/AuthStore";
import { CACHE_KEYS } from "../../../commons/constants";

const { Text } = Typography;

const AssignRole = () => {
  const { tenant_user_id } = useParams();
  const { userData: authUserData } = useAuthStore();
  const [selectedRoles, setSelectedRoles] = useState(new Set());

  const { data: usersResponse, isFetching: usersLoading } = useApiQuery({
    queryKey: [CACHE_KEYS.USERS_LIST],
    url: `/iam/users`,
    params: {
      type: "DETAILED",
      user_id: tenant_user_id,
    },
    onError: (error) => {
      renderErrorNotifications(error.errors);
    },
  });

  // Fetch all available roles
  const { data: rolesResponse, isFetching: rolesLoading } = useApiQuery({
    queryKey: [CACHE_KEYS.ROLES_LIST],
    url: "/iam/roles",
    params: { tenant_id: authUserData?.tenant_id },
    onError: (error) => {
      renderErrorNotifications(error.errors);
    },
  });

  // Update user roles mutation
  const { mutate: updateUserRoles, isPending: isUpdating } = useApiMutation({
    url: "/iam/users/user-role",
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

  const userDetails = usersResponse?.data?.find(
    (user) => user.tenant_user_id === tenant_user_id
  );

  // Set initial selected roles when user details are fetched
  useEffect(() => {
    if (userDetails?.roles) {
      const userRoles = userDetails.roles.map((role) => role.tenant_role_id);
      setSelectedRoles(new Set(userRoles));
    }
  }, [userDetails]);

  const handleRoleChange = (roleId) => {
    if (!tenant_user_id) {
      renderErrorNotifications([
        {
          message: "User ID is missing",
        },
      ]);
      return;
    }

    const isAdding = !selectedRoles.has(roleId);

    // Create a new array with the role ID to be added/removed
    const roleIds = [roleId];

    updateUserRoles({
      tenant_user_id,
      tenant_role_ids: roleIds,
      type: isAdding ? "ADD" : "REMOVE",
    });

    setSelectedRoles((prev) => {
      const updatedRoles = new Set(prev);
      isAdding ? updatedRoles.add(roleId) : updatedRoles.delete(roleId);
      return updatedRoles;
    });
  };

  const loading = usersLoading || rolesLoading;
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
            {userDetails.contact_number?.number || "N/A"}
          </Text>
        </Card>
      ) : (
        <Text type="danger" style={{ textAlign: "center", display: "block" }}>
          User not found. Please check if the user ID is correct.
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
                    style={{ paddingLeft: "8px" }}
                    disabled={isUpdating}
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
