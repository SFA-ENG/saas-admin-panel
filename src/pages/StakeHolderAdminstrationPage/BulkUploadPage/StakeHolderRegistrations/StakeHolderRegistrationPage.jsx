import { Card, Form, Tabs } from "antd";
import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";
import {
  renderErrorNotifications,
  renderSuccessNotifications,
} from "helpers/error.helpers";

import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { withAuthContext } from "../../../../contexts/AuthContext/AuthContext";
import { createStakeHolder, fetchAllHotels, updateStakeHolder } from "../BulkUpload.service";
import BulkUploads from "./_blocks/BulkUploads";
import IndividualEntry from "./_blocks/IndividualEntry";

// Add custom parse format plugin to dayjs
dayjs.extend(customParseFormat);

const StakeHolderRegistrationPageWithoutContext = () => {
  const [form] = Form.useForm();
  const location = useLocation();
  const navigate = useNavigate();
  const [tabKey, setTabKey] = useState("1");
  const [loading, setLoading] = useState(false);
  const [profileImageList, setProfileImageList] = useState([]);
  const [documentImageList, setDocumentImageList] = useState([]);
  const [hotelsList, setHotelsList] = useState([]);

  useEffect(() => {
    setLoading(true);
    if (location.state?.editData) {
      setTabKey(location.state.activeTab);
      const editData = location.state.editData;
      // Map the API data to form fields
      const formData = {
        ...editData,
        dob: editData.dob ? dayjs(editData.dob) : null,
        arrival_date: editData.arrival_date
          ? dayjs(editData.arrival_date)
          : null,
        arrival_time: editData.arrival_time
          ? dayjs(`2000-01-01 ${editData.arrival_time}`, "YYYY-MM-DD HH:mm:ss")
          : null,
        departure_date: editData.departure_date
          ? dayjs(editData.departure_date)
          : null,
        departure_time: editData.departure_time
          ? dayjs(
              `2000-01-01 ${editData.departure_time}`,
              "YYYY-MM-DD HH:mm:ss"
            )
          : null,
        check_in_date: editData.check_in_date
          ? dayjs(editData.check_in_date)
          : null,
        check_out_date: editData.check_out_date
          ? dayjs(editData.check_out_date)
          : null,
      };

      form.setFieldsValue(formData);

      setProfileImageList([
        {
          uid: "-1",
          name: "profile_image.jpg",
          status: "done",
          url: `https://dsaadmin.in/act/${editData.profile_image}`,
        },
      ]);

      setDocumentImageList([
        {
          uid: "-1",
          name: "document_image.jpg",
          status: "done",
          url: `https://dsaadmin.in/act/${editData.document_image}`,
        },
      ]);
    }
    setLoading(false);

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.state, form]);

  const fetchHotelsList = async () => {
    setLoading(true);
    try {
      const { data, errors } = await fetchAllHotels();
      if (errors.length > 0) {
        renderErrorNotifications(errors);
      } else {
        setHotelsList(data.data);
        if (location.state?.editData) {
          const hotel = data.data.find(
            (hotel) => hotel.id === location.state.editData.hotel_id
          );
          form.setFieldsValue({
            hotel_address: hotel.address,
            hotel_location: hotel.map_location,
            hotel_manager_name: hotel.manager_name,
            hotel_manager_mobile_no: hotel.mobile_no,
          });
        }
      }
    } catch (error) {
      renderErrorNotifications({
        title: "Error fetching hotels list",
        message: error?.message || "Something went wrong, Please try again!",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHotelsList();
  }, []);

  // This will calculate age based on DOB
  const onDOBChange = (date) => {
    if (date) {
      const age = dayjs().diff(date, "year");
      form.setFieldsValue({ age });
    } else {
      form.setFieldsValue({ age: null });
    }
  };

  const onFinish = async (values) => {
    setLoading(true);
    delete values.stakeholder_uuid;
    const payload = Object.fromEntries(
      Object.entries(values).filter(
        ([_, value]) => value !== undefined && value !== null
      )
    );

    try {
      const { errors } = location.state?.editData
        ? await updateStakeHolder({
            payload: {
              ...payload,
              dob: dayjs(values.dob).format("YYYY-MM-DD"),
              ...(values.arrival_date && {
                arrival_date: dayjs(values.arrival_date).format("YYYY-MM-DD"),
              }),
              ...(values.departure_date && {
                departure_date: dayjs(values.departure_date).format(
                  "YYYY-MM-DD"
                ),
              }),
              ...(values.check_in_date && {
                check_in_date: dayjs(values.check_in_date).format("YYYY-MM-DD"),
              }),
              ...(values.check_out_date && {
                check_out_date: dayjs(values.check_out_date).format(
                  "YYYY-MM-DD"
                ),
              }),
              ...(values.arrival_time && {
                arrival_time: dayjs(values.arrival_time).format("HH:mm"),
              }),
              ...(values.departure_time && {
                departure_time: dayjs(values.departure_time).format("HH:mm"),
              }),
            },
            stakeholderId: location.state.editData.id,
          })
        : await createStakeHolder({
            ...payload,
            dob: dayjs(values.dob).format("YYYY-MM-DD"),
          });
      if (errors.length > 0) {
        renderErrorNotifications(errors);
      } else {
        renderSuccessNotifications({
          title: "Stakeholder registered successfully!",
          message: "Stakeholder registered successfully!",
        });
        form.setFieldsValue(null);
        if (location.state?.editData) {
          navigate("/stakeholder-administration/stakeholder");
        }
      }
    } catch (err) {
      renderErrorNotifications({
        title: "Stakeholder registration failed!",
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
    <Card title="Stake Holder Registration">
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
                onDOBChange={onDOBChange}
                loading={loading}
                profileImageList={profileImageList}
                setProfileImageList={setProfileImageList}
                documentImageList={documentImageList}
                setDocumentImageList={setDocumentImageList}
                hotelsList={hotelsList}
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

const StakeHolderRegistrationPage = withAuthContext(
  StakeHolderRegistrationPageWithoutContext
);
export default StakeHolderRegistrationPage;
