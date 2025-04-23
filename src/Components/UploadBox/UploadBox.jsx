import { PlusOutlined } from "@ant-design/icons";
import { Col, Row, Upload } from "antd";
import { renderErrorNotifications } from "../../helpers/error.helpers";
import "./UploadBox.css";

const acceptanceTpye = {
  image:[".jpg", ".jpeg", ".png"],
  video:[".mp4"]
}

const AttachmentBox = ({
  setPreviewImage,
  fileList,
  setFileList,
  previewOnSelect = true,
  type = "image", // Include video formats
}) => {
  const getBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        resolve(reader.result);
      };
      reader.onerror = (error) => {
        reject(error);
      };
      reader.readAsDataURL(file);
    });
  };

  const handlePreview = async (file) => {
    try {
      if (file.type.includes("video")) {
        // Handle video preview
        const videoUrl = URL.createObjectURL(file.originFileObj || file);
        setPreviewImage(
          <video
            src={videoUrl}
            controls
            style={{ width: "100%", height: "auto" }}
          />
        );
      } else {
        // Handle image preview
        const preview =
          file.url || (await getBase64(file.originFileObj || file));
        setPreviewImage(
          <img src={preview} alt="Preview" style={{ width: "100%" }} />
        );
      }
    } catch (err) {
      renderErrorNotifications([{ message: err }]);
    }
  };

  return (
    <Upload
      style={{
        minWidth: "100%",
        border: "5px solid red",
      }}
      accept={acceptanceTpye[type].join(",")}
      className="receipt-upload-button"
      defaultFileList={fileList}
      listType="picture-card"
      beforeUpload={(file) => {
        previewOnSelect && handlePreview(file);
        setFileList([file]);
        return false;
      }}
      onPreview={(file) => {
        handlePreview(file);
      }}
      onRemove={() => {
        setPreviewImage(null);
        setFileList([]);
      }}
      maxCount={1}
    >
      {fileList.length < 2 && (
        <Row>
          <Col lg={24}>
            <PlusOutlined />
            <div style={{ marginTop: 8 }}>Upload / Drop</div>
          </Col>
        </Row>
      )}
    </Upload>
  );
};

export default AttachmentBox;
