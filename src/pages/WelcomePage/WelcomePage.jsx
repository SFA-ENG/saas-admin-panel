import { ArrowRightOutlined, CheckCircleOutlined } from "@ant-design/icons";
import {
  Button,
  Card,
  Carousel,
  Col,
  Divider,
  List,
  Row,
  Space,
  Statistic,
  Tag,
  Typography,
} from "antd";
import {
  Activity,
  BarChart,
  Bell,
  Calendar,
  DollarSign,
  Dumbbell,
  FileText,
  Rocket,
  Star,
  Timer,
  TrendingUp,
  Trophy,
  Users,
} from "lucide-react";
import "./WelcomePage.css";

const { Title, Paragraph, Text } = Typography;

const WelcomePage = () => {
  // Mock data for the page
  const features = [
    {
      icon: <Timer size={30} className="feature-icon" />,
      title: "Team Management",
      description:
        "Efficient tools to manage teams, players, coaches, and scheduling all in one place.",
      color: "#1890ff",
    },
    {
      icon: <Users size={30} className="feature-icon" />,
      title: "Club Collaboration",
      description:
        "Work together seamlessly with role-based access control and real-time updates.",
      color: "#52c41a",
    },
    {
      icon: <BarChart size={30} className="feature-icon" />,
      title: "Performance Analytics",
      description:
        "Gain valuable insights with comprehensive reporting and performance visualization tools.",
      color: "#722ed1",
    },
    {
      icon: <TrendingUp size={30} className="feature-icon" />,
      title: "Tournament Management",
      description:
        "Organize tournaments, track results, and manage brackets with ease.",
      color: "#fa8c16",
    },
  ];

  const pricingPlans = [
    {
      title: "Starter",
      price: "$29",
      period: "/month",
      description:
        "Perfect for small clubs and local teams just getting started",
      features: [
        "Up to 3 teams",
        "Basic analytics",
        "Email support",
        "5GB storage",
        "Standard reports",
      ],
      popular: false,
      buttonType: "default",
    },
    {
      title: "Professional",
      price: "$79",
      period: "/month",
      description:
        "Ideal for growing clubs with multiple teams and tournaments",
      features: [
        "Up to 15 teams",
        "Advanced analytics",
        "Priority support",
        "25GB storage",
        "Custom reports",
        "API access",
      ],
      popular: true,
      buttonType: "primary",
    },
    {
      title: "Enterprise",
      price: "$199",
      period: "/month",
      description:
        "For leagues and sports organizations with complex requirements",
      features: [
        "Unlimited teams",
        "Full analytics suite",
        "24/7 dedicated support",
        "Unlimited storage",
        "Custom integration",
        "API access",
        "White labeling",
      ],
      popular: false,
      buttonType: "default",
    },
  ];

  const announcements = [
    {
      title: "New Tournament Engine Released",
      date: "June 15, 2023",
      description:
        "Our latest tournament engine is now available with improved bracket management and mobile optimization.",
      tag: "New Feature",
    },
    {
      title: "Mobile App Update",
      date: "May 28, 2023",
      description:
        "Version 2.5 of our mobile app includes offline mode and improved performance tracking.",
      tag: "Update",
    },
    {
      title: "Summer Sports Promotion",
      date: "May 10, 2023",
      description:
        "Special summer rates available for all subscription plans until August 31.",
      tag: "Promotion",
    },
  ];

  const statistics = [
    {
      title: "Teams",
      value: 12840,
      suffix: "+",
      icon: <Users size={36} />,
    },
    {
      title: "Athletes",
      value: 245000,
      suffix: "+",
      icon: <Dumbbell size={36} />,
    },
    {
      title: "Tournaments",
      value: 8.6,
      suffix: "K",
      icon: <Trophy size={36} />,
    },
    {
      title: "Revenue Generated",
      value: 840,
      suffix: "M+",
      prefix: "$",
      icon: <DollarSign size={36} />,
    },
  ];

  return (
    <div className="welcome-page">
      {/* Hero Banner Section */}
      <div className="hero-section">
        <div className="hero-content">
          <Title level={1}>Transform Your Sports Management Experience</Title>
          <Paragraph className="hero-subtitle">
            A powerful, all-in-one platform designed specifically for sports
            clubs, teams, and organizations
          </Paragraph>
          <Space size="middle">
            <Button type="primary" size="large">
              Get Started <ArrowRightOutlined />
            </Button>
            <Button size="large">Schedule Demo</Button>
          </Space>
        </div>
      </div>

      {/* Features Section */}
      <div className="section features-section">
        <div className="container">
          <div className="section-header">
            <Title level={2}>
              Powerful Features for Modern Sports Management
            </Title>
            <Paragraph className="section-subtitle">
              Everything you need to run your sports organization efficiently
            </Paragraph>
          </div>

          <Row gutter={[24, 24]}>
            {features.map((feature, index) => (
              <Col xs={24} sm={12} lg={6} key={index}>
                <Card className="feature-card" hoverable>
                  <div
                    className="feature-icon-wrapper"
                    style={{ backgroundColor: `${feature.color}15` }}
                  >
                    <div style={{ color: feature.color }}>{feature.icon}</div>
                  </div>
                  <Title level={4}>{feature.title}</Title>
                  <Paragraph>{feature.description}</Paragraph>
                  <Button type="link" className="learn-more-btn">
                    Learn more <ArrowRightOutlined />
                  </Button>
                </Card>
              </Col>
            ))}
          </Row>
        </div>
      </div>

      {/* Latest Announcements Section */}
      <div className="section announcements-section">
        <div className="container">
          <div className="section-header">
            <Title level={2}>Latest Updates</Title>
            <Paragraph className="section-subtitle">
              Stay informed about our newest features and announcements
            </Paragraph>
          </div>

          <Row gutter={[24, 24]}>
            <Col xs={24} md={16}>
              <Carousel autoplay className="announcements-carousel">
                {announcements.map((announcement, index) => (
                  <div key={index}>
                    <Card className="announcement-card">
                      <div className="announcement-content">
                        <Tag
                          color="blue"
                          icon={<Bell size={14} />}
                          className="announcement-tag"
                        >
                          {announcement.tag}
                        </Tag>
                        <Title level={3}>{announcement.title}</Title>
                        <Text type="secondary">{announcement.date}</Text>
                        <Paragraph className="announcement-description">
                          {announcement.description}
                        </Paragraph>
                        <Button type="primary" ghost>
                          Read More <ArrowRightOutlined />
                        </Button>
                      </div>
                      <div className="announcement-image" />
                    </Card>
                  </div>
                ))}
              </Carousel>
            </Col>
            <Col xs={24} md={8}>
              <Card className="quick-actions-card" title="Quick Actions">
                <List
                  itemLayout="horizontal"
                  dataSource={[
                    {
                      title: "View Upcoming Matches",
                      icon: <Calendar size={20} />,
                    },
                    { title: "Add New Team", icon: <Users size={20} /> },
                    { title: "Generate Reports", icon: <FileText size={20} /> },
                    {
                      title: "Track Performance",
                      icon: <Activity size={20} />,
                    },
                  ]}
                  renderItem={(item) => (
                    <List.Item className="quick-action-item">
                      <div className="quick-action-icon">{item.icon}</div>
                      <div className="quick-action-title">{item.title}</div>
                      <ArrowRightOutlined />
                    </List.Item>
                  )}
                />
              </Card>
            </Col>
          </Row>
        </div>
      </div>

      {/* Statistics Section */}
      <div className="section statistics-section">
        <div className="container">
          <div className="section-header">
            <Title level={2}>Trusted by Sports Organizations Worldwide</Title>
            <Paragraph className="section-subtitle">
              Join thousands of successful teams and clubs using our platform
            </Paragraph>
          </div>

          <Row gutter={[24, 24]} justify="center">
            {statistics.map((stat, index) => (
              <Col xs={12} md={6} key={index}>
                <Card className="statistic-card">
                  <div className="statistic-icon">{stat.icon}</div>
                  <Statistic
                    title={stat.title}
                    value={stat.value}
                    suffix={stat.suffix}
                    prefix={stat.prefix}
                  />
                </Card>
              </Col>
            ))}
          </Row>
        </div>
      </div>

      {/* Pricing Section */}
      <div className="section pricing-section">
        <div className="container">
          <div className="section-header">
            <Title level={2}>Simple, Transparent Pricing</Title>
            <Paragraph className="section-subtitle">
              Choose the plan that best fits your organization&apos;s needs
            </Paragraph>
          </div>

          <Row gutter={[24, 24]} justify="center">
            {pricingPlans.map((plan, index) => (
              <Col xs={24} md={8} key={index}>
                <Card
                  className={`pricing-card ${
                    plan.popular ? "popular-card" : ""
                  }`}
                  title={
                    plan.popular ? (
                      <>
                        <Star size={16} /> {plan.title}
                      </>
                    ) : (
                      plan.title
                    )
                  }
                >
                  {plan.popular && (
                    <div className="popular-tag">Most Popular</div>
                  )}
                  <div className="pricing-header">
                    <div className="price">
                      <span className="currency">{plan.price}</span>
                      <span className="period">{plan.period}</span>
                    </div>
                    <Paragraph>{plan.description}</Paragraph>
                  </div>
                  <Divider />
                  <List
                    itemLayout="horizontal"
                    dataSource={plan.features}
                    renderItem={(item) => (
                      <List.Item>
                        <Space>
                          <CheckCircleOutlined className="feature-check" />
                          <Text>{item}</Text>
                        </Space>
                      </List.Item>
                    )}
                  />
                  <div className="pricing-footer">
                    <Button type={plan.buttonType} size="large" block>
                      {plan.popular ? "Get Started Now" : "Choose Plan"}
                    </Button>
                  </div>
                </Card>
              </Col>
            ))}
          </Row>
        </div>
      </div>

      {/* Call to Action Section */}
      <div className="section cta-section">
        <div className="container">
          <Card className="cta-card">
            <Row align="middle" justify="space-between">
              <Col xs={24} md={16}>
                <Title level={2}>
                  Ready to Transform Your Sports Management?
                </Title>
                <Paragraph>
                  Join thousands of sports organizations worldwide and take your
                  team to the next level.
                </Paragraph>
              </Col>
              <Col xs={24} md={8}>
                <div className="cta-buttons">
                  <Button
                    type="primary"
                    size="large"
                    icon={<Rocket size={16} />}
                  >
                    Get Started Today
                  </Button>
                  <Button type="link">Contact Sales</Button>
                </div>
              </Col>
            </Row>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default WelcomePage;
