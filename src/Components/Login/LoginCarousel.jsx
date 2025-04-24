import { Carousel, Image } from "antd";
import "./Login.css";

import banner2 from "../../assets/banners/Login/banner2.png";
const LoginCarousel = () => {
  const banners = [
    {
      title: "Easy Access",
      description: "Login seamlessly across multiple devices.",
      image: banner2,
    },
  ];

  return (
    <div className="w-full h-screen overflow-hidden">
      <Carousel autoplay dots={false}>
        {banners.map((banner, index) => (
          <div
            key={index}
            className="flex items-center justify-center"
            style={{ height: "100vh", width: "100%" }}
          >
            <Image
              preview={false}
              src={banner.image}
              alt={banner.title}
              style={{
                objectFit: "cover",
                maxHeight: "100vh",
                width: "100%",
              }}
            />
          </div>
        ))}
      </Carousel>
    </div>
  );
};

export default LoginCarousel;
