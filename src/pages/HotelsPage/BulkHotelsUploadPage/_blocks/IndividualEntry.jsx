import {
  Button,
  Card,
  Col,
  Divider,
  Form,
  Input,
  InputNumber,
  Row,
  Select,
} from "antd";
import {
  hotelGenders,
  hotelStars,
  hotelTypes,
} from "pages/HotelsPage/HotelsPage.helper";

const IndividualEntry = ({ form, onFinish, onFinishFailed, loading }) => {
  return (
    <Card>
      <Form
        form={form}
        name="hotelForm"
        onFinish={onFinish}
        onFinishFailed={onFinishFailed}
        scrollToFirstError
        layout="vertical"
      >
        <Divider orientation="left">Hotel Information</Divider>
        <Row gutter={8}>
          <Col xs={24} sm={12} md={8}>
            <Form.Item
              name="name"
              label="Hotel Name"
              rules={[
                {
                  required: true,
                  message: "Please input hotel name!",
                },
              ]}
            >
              <Input placeholder="Enter hotel name" />
            </Form.Item>
          </Col>

          <Col xs={24} sm={12} md={8}>
            <Form.Item
              name="manager_name"
              label="Manager Name"
              rules={[
                {
                  required: true,
                  message: "Please input manager name!",
                },
              ]}
            >
              <Input placeholder="Enter manager name" />
            </Form.Item>
          </Col>

          <Col xs={24} sm={12} md={8}>
            <Form.Item
              name="mobile_no"
              label="Mobile Number"
              rules={[
                {
                  required: true,
                  message: "Please input mobile number!",
                },
                {
                  pattern: /^[0-9]{10}$/,
                  message: "Please enter a valid 10-digit mobile number!",
                },
              ]}
            >
              <Input
                placeholder="Enter mobile number"
                maxLength={10}
                onKeyDown={(e) => {
                  if (
                    !/[0-9]/.test(e.key) &&
                    e.key !== "Backspace" &&
                    e.key !== "Delete" &&
                    e.key !== "ArrowLeft" &&
                    e.key !== "ArrowRight" &&
                    e.key !== "Tab"
                  ) {
                    e.preventDefault();
                  }
                }}
                onChange={(e) => {
                  const value = e.target.value.replace(/\D/g, "");
                  e.target.value = value;
                }}
              />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={16}>
          <Col xs={24} sm={12}>
            <Form.Item
              name="address"
              label="Address"
              rules={[
                {
                  required: true,
                  message: "Please input hotel address!",
                },
              ]}
            >
              <Input.TextArea rows={3} placeholder="Enter hotel address" />
            </Form.Item>
          </Col>

          <Col xs={24} sm={12}>
            <Form.Item
              name="map_location"
              label="Google Maps Location"
              rules={[
                {
                  required: true,
                  message: "Please input Google Maps location!",
                },
                {
                  type: "url",
                  message: "Please enter a valid URL!",
                },
              ]}
            >
              <Input placeholder="Enter Google Maps URL" />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={16}>
          <Col xs={24} sm={12} md={6}>
            <Form.Item
              name="hotel_type"
              label="Hotel Type"
              rules={[
                {
                  required: true,
                  message: "Please select hotel type!",
                },
              ]}
            >
              <Select placeholder="Select hotel type" options={hotelTypes} />
            </Form.Item>
          </Col>

          <Col xs={24} sm={12} md={6}>
            <Form.Item
              name="hotel_capacity"
              label="Hotel Capacity"
              rules={[
                {
                  required: true,
                  message: "Please input hotel capacity!",
                },
              ]}
            >
              <InputNumber
                min={1}
                placeholder="Enter capacity"
                style={{ width: "100%" }}
                type="number"
              />
            </Form.Item>
          </Col>

          <Col xs={24} sm={12} md={6}>
            <Form.Item
              name="hotel_star"
              label="Hotel Star Rating"
              rules={[
                {
                  required: true,
                  message: "Please select hotel star rating!",
                },
              ]}
            >
              <Select placeholder="Select star rating" options={hotelStars} />
            </Form.Item>
          </Col>

          <Col xs={24} sm={12} md={6}>
            <Form.Item
              name="hotel_gender"
              label="Gender Policy"
              rules={[
                {
                  required: true,
                  message: "Please select gender policy!",
                },
              ]}
            >
              <Select
                placeholder="Select gender policy"
                options={hotelGenders}
              />
            </Form.Item>
          </Col>
        </Row>

        <Form.Item style={{ textAlign: "right", marginTop: 24 }}>
          <Button
            type="primary"
            htmlType="submit"
            loading={loading}
            disabled={loading}
          >
            Submit
          </Button>
          <Button
            style={{ marginLeft: 8 }}
            onClick={() => form.resetFields()}
            disabled={loading}
          >
            Reset
          </Button>
        </Form.Item>
      </Form>
    </Card>
  );
};

export default IndividualEntry;
