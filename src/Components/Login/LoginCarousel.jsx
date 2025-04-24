import { Carousel, Image } from "antd";

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
    <div className="h-full w-full">
      <Carousel autoplay dots={false}>
        {banners.map((banner, index) => (
          <div key={index}>
            <Image
              preview={false}
              src={banner.image}
              alt={banner.title}
              width={"100%"}
              height={"100%"}
              className="object-cover w-full h-full"
            />
          </div>
        ))}
      </Carousel>
    </div>
  );
};

export default LoginCarousel;
