import React from 'react';
import { Button, Row, Col, Typography, Card } from 'antd';
import { useNavigate } from 'react-router-dom';
import { UserOutlined, MedicineBoxOutlined } from '@ant-design/icons';

const { Title, Paragraph } = Typography;

const Home: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div style={{ textAlign: 'center', padding: '50px 0' }}>
      <Title>Welcome to Smart Pension Matching System</Title>
      <Paragraph style={{ fontSize: '18px', marginBottom: '40px' }}>
        Based on multi-dimensional health needs, we find the best matched nursing home for you.
      </Paragraph>
      
      <Row gutter={48} justify="center">
        <Col span={8}>
          <Card 
            hoverable 
            style={{ height: '300px', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}
            onClick={() => navigate('/elder-form')}
          >
            <UserOutlined style={{ fontSize: '64px', color: '#1890ff', marginBottom: '20px' }} />
            <Title level={3}>I am an Elderly / Family</Title>
            <Paragraph>Find a nursing home that suits my needs</Paragraph>
          </Card>
        </Col>
        <Col span={8}>
          <Card 
            hoverable 
            style={{ height: '300px', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}
            onClick={() => navigate('/provider-form')}
          >
            <MedicineBoxOutlined style={{ fontSize: '64px', color: '#52c41a', marginBottom: '20px' }} />
            <Title level={3}>I am a Nursing Home</Title>
            <Paragraph>Register my facility and update capabilities</Paragraph>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default Home;
