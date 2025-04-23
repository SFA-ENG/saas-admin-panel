import { Card, Checkbox, List, Spin, Typography } from "antd";
import {
  renderErrorNotifications,
  renderSuccessNotifications,
} from "helpers/error.helpers";
import {
  fetchRoles,
  fetchStakeHolders,
  updateStakeHolderRoles,
} from "pages/StakeHolderAdminstrationPage/UserAdministrationPage.services";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

const { Text } = Typography;

const AssignRolesPage = () => {
  const { id } = useParams();
  const [userDetails, setUserDetails] = useState(null);
  const [roles, setRoles] = useState([]);
  const [selectedRoles, setSelectedRoles] = useState(new Set());
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    const getUserDetails = async () => {
      try {
        setLoading(true);

        const [
          { data: userData, errors: userErrors },
          { data: rolesData, errors: rolesErrors },
        ] = await Promise.all([
          fetchStakeHolders({
            stakeholderId: id,
          }),
          fetchRoles(),
        ]);

        if (userErrors.length || rolesErrors.length) {
          renderErrorNotifications(
            userErrors.length ? userErrors : rolesErrors
          );
        } else {
          const user = userData.data;
          setUserDetails(user);
          setSelectedRoles(
            new Set(user?.roles?.map((role) => role.role_id) || [])
          );
          console.log(rolesData.data);
          setRoles(rolesData.data);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    getUserDetails();
  }, [id]);

  const handleRoleChange = async (roleId) => {
    setUpdating(true);
    const isAdding = !selectedRoles.has(roleId);
    try {
      const { errors } = await updateStakeHolderRoles({
        payload: {
          type: isAdding ? "ADD" : "REMOVE",
          stakeholder_id: userDetails.id,
          role_id: roleId,
        },
      });

      if (errors.length) {
        renderErrorNotifications(errors);
      } else {
        setSelectedRoles((prev) => {
          const updatedRoles = new Set(prev);
          isAdding ? updatedRoles.add(roleId) : updatedRoles.delete(roleId);
          return updatedRoles;
        });
        renderSuccessNotifications({
          title: "Success",
          message: `Role ${isAdding ? "assigned" : "removed"} successfully!`,
        });
      }
    } catch (error) {
      console.error("Error updating role:", error);
    }

    setUpdating(false);
  };

  return (
    <div style={{ width: "100%", padding: "20px" }}>
      {loading ? (
        <Spin
          size="large"
          style={{ display: "block", textAlign: "center", marginTop: "20px" }}
        />
      ) : (
        <Card title="User Details" style={{ marginBottom: "20px" }}>
          <Text>
            <strong style={{ marginRight: "10px" }}>Name:</strong>{" "}
            {userDetails?.fullname}
          </Text>
          <br />
          <Text>
            <strong style={{ marginRight: "10px" }}>Email:</strong>{" "}
            {userDetails?.email_id}
          </Text>
          <br />
          <Text>
            <strong style={{ marginRight: "10px" }}>Phone:</strong>{" "}
            {userDetails?.mobile_no}
          </Text>
        </Card>
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
                    checked={selectedRoles.has(role.role_id)}
                    onChange={() => handleRoleChange(role.role_id)}
                    disabled={updating}
                    style={{ paddingLeft: "8px" }}
                  >
                    <span style={{ paddingLeft: "6px", fontWeight: "550" }}>
                      {role.role_name}
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

export default AssignRolesPage;
