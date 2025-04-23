import { Table } from "antd";
import responsiveTable from "./RoleResponsiveTable.helper";
import { getColumnsForRoles } from "../RolesAndPermissionPage.helper";

const RolePermissionList = ({ data = [], onEdit, loading }) => {

  const columns = responsiveTable({
    input: getColumnsForRoles({ data, onEdit }),
    labelCol: 9,
    valueCol: 13,
  });


  return (
    <Table
      columns={columns}
      dataSource={data}
      rowKey="role_id"
      loading={loading}
      className="tca-responsive-table"
      scroll={{ x: true }}
    />
  );
};

export default RolePermissionList;
