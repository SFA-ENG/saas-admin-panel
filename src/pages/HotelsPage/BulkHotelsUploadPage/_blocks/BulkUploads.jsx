import { InboxOutlined } from "@ant-design/icons";
import { Button, Card, Typography, Upload } from "antd";
import {
  renderErrorNotifications,
  renderSuccessNotifications,
} from "helpers/error.helpers";
import templateFile from "../../../../assets/templates/STAKEHOLDER_TEMPLATE.csv?url";
import { uploadCsvForStakeHolderRegistration } from "../BulkUpload.service";

const BulkUploads = ({ loading, setLoading }) => {
  const { Title, Text } = Typography;
  const { Dragger } = Upload;

  const handleDownloadTemplate = async () => {
    try {
      const response = await fetch(templateFile);
      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "STAKEHOLDER_TEMPLATE.csv");
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Error downloading template:", error);
      renderErrorNotifications(
        "Download failed,Unable to download the template file"
      );
    }
  };

  const draggerProps = {
    name: "file",
    accept: ".csv",
    multiple: false,
    customRequest: async ({ file, onSuccess, onError }) => {
      try {
        setLoading(true);
        const formData = new FormData();
        formData.append("file", file);

        const { data, errors } = await uploadCsvForStakeHolderRegistration({
          formData,
        });

        if (errors?.length) {
          renderErrorNotifications(errors);
          onError(errors);
        } else {
          renderSuccessNotifications({
            title: "File uploaded successfully!",
            message: "Processing will begin shortly!",
          });
          onSuccess(data);
        }
      } catch (error) {
        renderErrorNotifications({
          title: "File upload failed!",
          message: "Please try again.",
        });
        onError(error);
      } finally {
        setLoading(false);
      }
    },
    onChange(info) {
      const { status } = info.file;
      if (status === "error") {
        renderErrorNotifications(`${info.file.name} file upload failed.`);
      }
    },
    showUploadList: false,
  };
  return (
    <Card>
      <Title level={4}>Upload Excel File for Bulk Registration</Title>
      <Text type="secondary">
        Upload an Excel file containing stakeholder information for bulk
        registration. Please ensure your Excel file has all required fields
        properly formatted.
      </Text>
      <div style={{ marginTop: 30 }}>
        <Dragger {...draggerProps} disabled={loading}>
          <p className="ant-upload-drag-icon">
            <InboxOutlined />
          </p>
          <p className="ant-upload-text">
            Click or drag CSV file to this area to upload
          </p>
          <p className="ant-upload-hint">
            Support for a single CSV file upload with proper format.
          </p>
        </Dragger>
      </div>
      <div style={{ marginTop: 16 }}>
        <Button
          type="primary"
          onClick={handleDownloadTemplate}
          style={{ marginBottom: "20px" }}
        >
          Download Template
        </Button>
      </div>
    </Card>
  );
};

export default BulkUploads;
