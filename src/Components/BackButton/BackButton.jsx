import { ArrowLeftOutlined } from "@ant-design/icons";
import { Button } from "antd";
import { useNavigate } from "react-router-dom";

const BackButton = (props) => {
  const navigate = useNavigate();
  const handleClick = () => {
    navigate(-1);
  };

  return (
    <Button type="primary" onClick={handleClick} {...props} icon={<ArrowLeftOutlined />}>
      Back
    </Button>
  );
};

export default BackButton;
