import { PlusCircleOutlined } from "@ant-design/icons";
import { Button, Card, Col, Form, Input, Row, Space } from "antd";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  renderErrorNotifications,
  renderSuccessNotifications,
} from "../../../helpers/error.helpers";
import {
  fetchStakeHolders,
  handleStakeHolderStatus,
} from "../UserAdministrationPage.services";
import UsersList from "./_blocks/UsersList";

const filterUsers = ({ searchTerm, data }) => {
  return data?.filter((d) => {
    return (
      d.first_name?.toLowerCase()?.includes(searchTerm?.toLowerCase()) ||
      d.phone_number?.toLowerCase()?.includes(searchTerm?.toLowerCase()) ||
      d.email?.toLowerCase()?.includes(searchTerm?.toLowerCase())
    );
  });
};

const Userpage = () => {
  const [form] = Form.useForm();
  const [dataSource, setDatasource] = useState([]);
  const [loading, setLoading] = useState(false);
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 100,
    total: 0,
  });
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [searchValue, setSearchValue] = useState("");
  const navigate = useNavigate();

  const handleAssign = (rowData) => {
    navigate(`/stakeholder-administration/assign-roles/${rowData.id}`);
  };

  const handleTableChange = (pagination) => {
    setPagination(pagination);
    fetchAllUsers(pagination.current);
  };

  const fetchAllUsers = async (page = 1) => {
    try {
      setLoading(true);
      const { data: response, errors } = await fetchStakeHolders({
        page,
        page_size: 100,
      });

      if (errors?.length) {
        renderErrorNotifications(errors);
      } else {
        const { data, meta } = response;
        // Ensure data is an array
        const formattedData = Array.isArray(data) ? data : [];
        setDatasource(formattedData);
        setPagination({
          ...pagination,
          current: meta?.pagination?.current_page || 1,
          total: meta?.pagination?.total_items || 0,
          pageSize: meta?.pagination?.page_size || 100,
        });
      }
    } catch (error) {
      renderErrorNotifications([{ message: "Failed to fetch users" }]);
      setDatasource([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllUsers();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const filterData = (searchTerm) => {
    if (searchTerm) {
      const filtered = dataSource.filter((d) => {
        return (
          d.fullname?.toLowerCase()?.includes(searchTerm?.toLowerCase()) ||
          d.mobile_no?.toLowerCase()?.includes(searchTerm?.toLowerCase()) ||
          d.email_id?.toLowerCase()?.includes(searchTerm?.toLowerCase())
        );
      });
      setFilteredUsers(filtered);
    } else {
      setFilteredUsers([]);
    }
  };

  const reset = () => {
    setFilteredUsers([]);
    setSearchValue("");
    form.resetFields();
  };

  const editAndDeleteActions = {
    handleEdit: (rowData) => {
      navigate("/stakeholder-administration/stake-holder-registration", {
        state: {
          editData: rowData,
          activeTab: "1", // Individual Entry tab
        },
      });
    },
    handleDelete: async ({ flag, rowData }) => {
      setLoading(true);
      try {
        const { errors } = await handleStakeHolderStatus({
          payload: { is_active: flag },
          stakeholderId: rowData.id,
        });
        if (errors?.length) {
          renderErrorNotifications(errors);
        } else {
          renderSuccessNotifications({
            title: "Success",
            message: `User ${rowData.fullname} ${
              flag ? "activated" : "deactivated"
            }!`,
          });
          fetchAllUsers(pagination.current);
        }
      } catch (error) {
        renderErrorNotifications([{ message: "Failed to update user status" }]);
      } finally {
        setLoading(false);
      }
    },
  };

  return (
    <Space direction="vertical" style={{ width: "100%", display: "flex" }}>
      <Card title={"Stake Holder Management"}>
        <Row justify="space-between" align="top" gutter={[16, 16]}>
          <Col>
            {Boolean(dataSource.length) && (
              <Space>
                <Input.Search
                  value={searchValue}
                  style={{ width: "320px" }}
                  enterButton
                  size="middle"
                  placeholder="Search"
                  onSearch={filterData}
                  onChange={({ target: { value } }) => setSearchValue(value)}
                />
                <Button onClick={reset} type="link">
                  Reset
                </Button>
              </Space>
            )}
          </Col>
          <Col>
            <Button
              style={{
                marginBottom: "16px",
              }}
              onClick={() =>
                navigate(
                  "/stakeholder-administration/stake-holder-registration"
                )
              }
              type="primary"
              icon={<PlusCircleOutlined />}
              disabled={loading}
            >
              New Stake Holder
            </Button>
          </Col>
        </Row>

        <UsersList
          loading={loading}
          handleDelete={editAndDeleteActions.handleDelete}
          handleEdit={editAndDeleteActions.handleEdit}
          handleAssign={handleAssign}
          dataSource={filteredUsers.length ? filteredUsers : dataSource}
          pagination={pagination}
          onChange={handleTableChange}
        />
      </Card>
    </Space>
  );
};

export default Userpage;
