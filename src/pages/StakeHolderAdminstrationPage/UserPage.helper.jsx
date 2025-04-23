import { Button, Space, Tag } from "antd";

export const userTypes = [
  { name: "Athlete", value: "Athlete" },
  { name: "Support Staff", value: "Support Staff" },
  { name: "CDM", value: "CDM" },
  { name: "Technical Official", value: "Technical Official" },
  { name: "VIP", value: "VIP" },
  { name: "VVIP", value: "VVIP" },
  { name: "Volunteers", value: "Volunteers" },
  { name: "EMA", value: "EMA" },
  { name: "Workforce", value: "Workforce" },
];

export const usersTypes = {
  ATHLETE: "Athlete",
  SUPPORT_STAFF: "Support Staff",
  CDM: "CDM",
  TECHNICAL_OFFICIAL: "Technical Official",
  VIP: "VIP",
  VVIP: "VVIP",
  VOLUNTEERS: "Volunteers",
  EMA: "EMA",
  WORKFORCE: "Workforce",
};

export const userAccessTypes = {
  SUPER_ADMIN: "SUPER_ADMIN",
  ADMIN: "ADMIN",
};

export const getColumnsForStakeHolders = ({
  loading,
  handleAssign,
  handleEdit,
}) => {
  const columns = [
    {
      title: "Stakeholder ID",
      align: "center",
      responsive: ["sm"],
      render: (record) => {
        return <div>{record.id}</div>;
      },
    },
    {
      title: "Name",
      align: "center",
      responsive: ["sm"],
      render: (record) => {
        return <div>{record.fullname}</div>;
      },
    },
    {
      title: "Stakeholder Type",
      align: "center",
      render: (_, { stakeholder_type }) => (
        <Tag color={stakeholder_type === "Athlete" ? "gold" : "green"}>
          {stakeholder_type}
        </Tag>
      ),
      filters: userTypes?.map(({ name, value }) => {
        return { text: name, value };
      }),
      filterSearch: true,
      onFilter: (value, record) => record.stakeholder_type === value,
      responsive: ["sm"],
    },
    {
      title: "Phone Number",
      align: "center",
      responsive: ["sm"],
      render: (record) => {
        return <div>{record?.mobile_no}</div>;
      },
    },
    {
      title: "Email",
      align: "center",
      responsive: ["sm"],
      render: (record) => {
        return <div>{record?.email_id}</div>;
      },
    },
    // {
    //   title: "User Status",
    //   align: "center",
    //   render: (rowData) => (
    //     <Switch
    //       disabled={loading}
    //       onChange={(flag) => {
    //         handleDelete({ flag, rowData });
    //       }}
    //       checkedChildren="ACTIVE"
    //       unCheckedChildren="INACTIVE"
    //       defaultChecked={rowData?.is_active === 1}
    //     />
    //   ),
    //   responsive: ["sm"],
    // },
    // {
    //   title: "Last Updated At / Last Updated By",
    //   align: "center",
    //   render: ({ updated_at, updated_by }) => {
    //     return (
    //       <div>
    //         <Col>{moment(updated_at).format("Do MMMM YYYY")}</Col>
    //         <Col>{updated_by || "System"}</Col>
    //       </div>
    //     );
    //   },
    //   responsive: ["sm"],
    // },
    {
      title: "Action",
      align: "center",
      render: (rowData) => (
        <Space>
          <Button
            disabled={loading}
            title="Edit"
            loading={loading}
            onClick={() => handleEdit(rowData)}
          >
            Edit
          </Button>
          <Button
            type="primary"
            title="Assign"
            onClick={() => handleAssign(rowData)}
          >
            Assign
          </Button>
        </Space>
      ),
      responsive: ["sm"],
    },
  ];
  return columns;
};

export const citiesList = [
  { name: "Mumbai", value: "Mumbai" },
  { name: "Delhi", value: "Delhi" },
  { name: "Bangalore", value: "Bangalore" },
  { name: "Chennai", value: "Chennai" },
];

export const stakeholderTypes = [
  "Athlete",
  "Support Staff",
  "CDM",
  "Technical Official",
  "VIP",
  "VVIP",
  "Volunteers",
  "EMA",
  "Workforce",
];

export const genders = [
  { label: "Male", value: "male" },
  { label: "Female", value: "female" },
];
export const bloodGroups = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];
export const sports = [
  "Athletics",
  "Swimming",
  "Basketball",
  "Football",
  "Cricket",
  "Hockey",
  "Tennis",
];
export const states = [
  "Bihar",
  "Delhi",
  "Maharashtra",
  "Karnataka",
  "Tamil Nadu",
];
export const cities = ["Patna", "Delhi", "Mumbai", "Bangalore", "Chennai"];
export const venues = [
  "Stadium 1",
  "Stadium 2",
  "Indoor Arena",
  "Aquatic Complex",
];
export const events = [
  "National Games",
  "State Championship",
  "Invitational Tournament",
];
export const districts = [
  "Patna",
  "Gaya",
  "Muzaffarpur",
  "Bhagalpur",
  "Darbhanga",
];
export const locations = ["Patna Junction", "Airport", "Bus Stand"];
export const transportModes = ["Bus", "Train", "Flight", "Car", "Self"];
