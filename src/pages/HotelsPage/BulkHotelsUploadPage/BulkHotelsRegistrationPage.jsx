import { Card, Form, Tabs } from "antd";
import {
  renderErrorNotifications,
  renderSuccessNotifications,
} from "helpers/error.helpers";

import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { createHotel, updateHotel } from "./BulkUpload.service";
import BulkUploads from "./_blocks/BulkUploads";
import IndividualEntry from "./_blocks/IndividualEntry";

const BulkHotelsRegistrationPage = () => {
  const [form] = Form.useForm();
  const location = useLocation();
  const navigate = useNavigate();
  const [tabKey, setTabKey] = useState("1");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    if (location.state?.editData) {
      setTabKey(location.state.activeTab);
      form.setFieldsValue(location.state.editData);
    }
    setLoading(false);

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.state, form]);

  const onFinish = async (values) => {
    setLoading(true);
    const payload = Object.fromEntries(
      Object.entries(values).filter(
        ([_, value]) => value !== undefined && value !== null
      )
    );
    try {
      const { errors } = location.state?.editData
        ? await updateHotel({
            payload,
            hotelId: location.state.editData.id,
          })
        : await createHotel(payload);

      if (errors.length > 0) {
        renderErrorNotifications(errors);
      } else {
        renderSuccessNotifications({
          title: "Success",
          message: `Hotel ${
            location.state?.editData ? "updated" : "created"
          } successfully!`,
        });
        form.resetFields();
        if (location.state?.editData) {
          navigate("/hotels-administration/hotels");
        }
      }
    } catch (err) {
      renderErrorNotifications({
        title: "Hotel registration failed!",
        message: err?.message || "Something went wrong, Please try again!",
      });
    } finally {
      setLoading(false);
    }
  };

  const onFinishFailed = () => {
    renderErrorNotifications({
      title: "Form submission failed!",
      message: "Please check the form for errors",
    });
  };

  return (
    <Card title="Hotels Registration">
      <Tabs
        activeKey={tabKey}
        onChange={setTabKey}
        items={[
          {
            key: "1",
            label: "Individual Entry",
            children: (
              <IndividualEntry
                form={form}
                onFinish={onFinish}
                onFinishFailed={onFinishFailed}
                loading={loading}
              />
            ),
          },
          {
            key: "2",
            label: "Bulk Upload",
            children: <BulkUploads loading={loading} setLoading={setLoading} />,
          },
        ]}
      />
    </Card>
  );
};

export default BulkHotelsRegistrationPage;
