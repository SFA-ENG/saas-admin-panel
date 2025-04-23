import { Button } from "antd";

const AccessControlButton = (props) => {
  const { title, ...rest } = props;
  return <Button {...rest}>{title} </Button>;
};

export default AccessControlButton;
