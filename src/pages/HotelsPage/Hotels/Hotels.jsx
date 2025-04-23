import { PlusCircleOutlined } from "@ant-design/icons";
import { Button, Card, Col, Input, Row, Space, Table } from "antd";
import { renderErrorNotifications } from "helpers/error.helpers";
import responsiveTable from "hoc/resposive-table.helper";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import getHotels from "../Hotels.service";
import { getColumnsForHotels } from "../HotelsPage.helper";

const Hotels = () => {
  const [loading, setLoading] = useState(false);
  const [hotels, setHotels] = useState([]);
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0,
  });
  const navigate = useNavigate();

  const fetchHotels = async (page = 1, pageSize = 10) => {
    setLoading(true);
    try {
      const { data } = await getHotels({ page, pageSize });
      if (data.data) {
        setHotels(data.data);
        setPagination({
          current: data.pagination.page,
          pageSize: data.pagination.pageSize,
          total: data.pagination.total,
        });
      }
    } catch (error) {
      console.error("Error fetching hotels:", error);
      renderErrorNotifications(error?.message || "Error fetching hotels");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHotels();
  }, []);

  const handleTableChange = (pagination) => {
    fetchHotels(pagination.current, pagination.pageSize);
  };

  const handleView = (record) => {
    navigate(`/hotels-administration/hotel-details/${record.id}`);
  };

  const handleEdit = (record) => {
    navigate("/hotels-administration/hotels-registration", {
      state: {
        editData: record,
        activeTab: "1",
      },
    });
  };

  const handleDelete = (record) => {
    // Handle delete action
    console.log("Delete:", record);
  };

  const columns = responsiveTable({
    input: getColumnsForHotels({
      editAndDeleteActions: {
        handleView,
        handleEdit,
        handleDelete,
      },
    }),
    labelCol: 9,
    valueCol: 13,
  });

  return (
    <Card title="Hotels">
      <Row justify="space-between" align="top" gutter={[16, 16]}>
        <Col>
          {Boolean(hotels.length) && (
            <Space>
              <Input.Search
                value={""}
                style={{ width: "320px" }}
                enterButton
                size="middle"
                placeholder="Search"
                onSearch={() => {}}
                // onChange={({ target: { value } }) => setSearchValue(value)}
              />
              <Button type="link">Reset</Button>
            </Space>
          )}
        </Col>
        <Col>
          <Button
            style={{
              marginBottom: "16px",
            }}
            type="primary"
            icon={<PlusCircleOutlined />}
            disabled={loading}
            onClick={() => {
              navigate("/hotels-administration/hotels-registration");
            }}
          >
            New Hotel
          </Button>
        </Col>
      </Row>
      <Table
        columns={columns}
        dataSource={hotels}
        rowKey="id"
        pagination={pagination}
        onChange={handleTableChange}
        loading={loading}
        scroll={{ x: true }}
        size="small"
      />
    </Card>
  );
};

export default Hotels;
