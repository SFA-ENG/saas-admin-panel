import { Button, Image } from "antd";
import unauthorizedImage from "../../assets/401.png";

const Custom401 = () => {
  const handleGoBack = () => {
    window.history.back();
  };

  const styles = {
    container: {
      textAlign: "center",
      padding: "10px",
    },
    image: {
      maxWidth: "400px",
      marginBottom: "20px",
    },
    title: {
      fontSize: "32px",
      marginBottom: "10px",
    },
    description: {
      fontSize: "16px",
      color: "rgba(0, 0, 0, 0.6)",
      marginBottom: "20px",
    },
  };
  return (
    <div style={styles.container}>
      <Image
        src={unauthorizedImage}
        alt="401 Error - No Permission"
        style={styles.image}
        preview={false}
      />
      <h1 style={styles.title}>401 - You don’t have permission</h1>
      <p style={styles.description}>
        Sorry, you are not authorized to access this page. If you believe this
        is a mistake, please contact support.
      </p>
      <Button type="primary" onClick={handleGoBack}>
        Go Back
      </Button>
    </div>
  );
};

export default Custom401;
