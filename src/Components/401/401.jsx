import { Button, Typography, Space } from "antd";
import { ArrowLeftOutlined, WarningOutlined } from "@ant-design/icons";
import { LockKeyhole } from "lucide-react";

const { Title, Text } = Typography;

const Custom401 = () => {
  const handleGoBack = () => {
    window.history.back();
  };

  return (
    <div className="w-full flex items-center justify-center">
      <div className="bg-white/90 backdrop-blur-lg shadow-[0_20px_40px_rgba(0,0,0,0.2)] rounded-3xl  p-10 max-w-2xl text-center animate-fade-in">
        <div className="mb-4 flex justify-center">
          <LockKeyhole className="text-red-600 text-6xl animate-pulse" />
        </div>

        <Space direction="vertical" size="large" className="w-full">
          <Title level={1} className="!text-red-600 !text-6xl !mb-0">
            <WarningOutlined className="text-red-500 mr-3 animate-shake" />
            401
          </Title>

          <Title level={2} className="!text-gray-800 !text-2xl !mb-2">
            Access Denied!
          </Title>

          <Text className="text-gray-700 text-base max-w-lg mx-auto">
            Whoops—this area’s off-limits. Your credentials don’t grant you
            entry here.
          </Text>

          <div className="bg-red-50 border border-red-200 p-6 rounded-xl text-left mt-6">
            <Text type="secondary" className="text-sm text-red-700">
              What you can try:
              <ul className="list-disc ml-6 mt-2 space-y-2">
                <li>Log in with the correct account</li>
                <li>Request access from an admin</li>
                <li>Hit the button below to retreat safely</li>
              </ul>
            </Text>
          </div>

          <Button
            type="primary"
            danger
            icon={<ArrowLeftOutlined />}
            onClick={handleGoBack}
            className="!h-12 !px-8 !rounded-lg !bg-red-600 hover:!bg-red-700 transition-transform hover:!translate-y-[-2px] hover:!shadow-xl"
          >
            Take Me Back
          </Button>
        </Space>
      </div>
    </div>
  );
};

export default Custom401;
