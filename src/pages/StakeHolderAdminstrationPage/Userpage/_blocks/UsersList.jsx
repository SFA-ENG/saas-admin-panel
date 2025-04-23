import { Table } from "antd";
import { withAuthContext } from "../../../../contexts/AuthContext/AuthContext";
import responsiveTable from "../../../../hoc/resposive-table.helper";
import { getColumnsForStakeHolders } from "pages/StakeHolderAdminstrationPage/UserPage.helper";

const UsersListWithoutContext = ({
  loading,
  handleDelete,
  handleEdit,
  handleAssign,
  dataSource = [],
  authContext,
  pagination,
  onChange,
}) => {
  const { userData } = authContext;
  const columns = responsiveTable({
    input: getColumnsForStakeHolders({
      handleDelete,
      handleEdit,
      handleAssign,
      loading,
      userData,
    }),
    labelCol: 9,
    valueCol: 13,
  });

  return (
    <Table
      className="tca-responsive-table"
      rowKey="stakeholder_uuid"
      loading={loading}
      dataSource={dataSource}
      columns={columns}
      size="small"
      pagination={{
        ...pagination,
        showSizeChanger: false,
        showQuickJumper: true,
        showTotal: (total) => `Total ${total} items`,
      }}
      onChange={onChange}
    />
  );
};

const UsersList = withAuthContext(UsersListWithoutContext);
export default UsersList;
