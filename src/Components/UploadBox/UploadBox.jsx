import { PlusOutlined } from "@ant-design/icons";
import { Col, Row, Upload } from "antd";
import { renderErrorNotifications } from "../../helpers/error.helpers";
import "./UploadBox.css";

const acceptanceTpye = {
  image: [".jpg", ".jpeg", ".png"],
  video: [".mp4"],
  pdf: [".pdf"],
  audio: [".mp3", ".wav", ".m4a"],
};

const AttachmentBox = ({
  setPreviewImage,
  fileList,
  setFileList,
  previewOnSelect = true,
  applyCss = true,
  maxCount = 1,
  showPreviewIcon = true,
  showRemoveIcon = true,
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
        setPreviewImage && setPreviewImage(
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
        setPreviewImage && setPreviewImage(
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
        border: "5px solid red",
      }}
      showUploadList={{
        showPreviewIcon: showPreviewIcon,
        showRemoveIcon: showRemoveIcon,
      }}
      accept={acceptanceTpye[type].join(",")}
      className={applyCss ? "saas-upload-button" : ""}
      defaultFileList={fileList}
      listType="picture-circle"
      beforeUpload={(file) => {
        previewOnSelect && handlePreview(file);
        setFileList([file]);
        return false;
      }}
      onPreview={(file) => {
        handlePreview(file);
      }}
      onRemove={() => {
        setPreviewImage &&setPreviewImage(null);
        setFileList([]);
      }}
      maxCount={maxCount}
    >
      {fileList.length < maxCount && (
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
