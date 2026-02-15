import React, { useEffect, useState } from 'react';
import ReactECharts from 'echarts-for-react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Card, List, Typography, Tag, Row, Col, Button, Divider } from 'antd';
import { ArrowLeftOutlined } from '@ant-design/icons';

const { Title, Text } = Typography;

const Results: React.FC = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const [results, setResults] = useState<any[]>([]);

    useEffect(() => {
        if (location.state?.results) {
            setResults(location.state.results);
        }
    }, [location.state]);

    if (!location.state?.results) {
        return <div style={{ textAlign: 'center', padding: 50 }}>
            <Title level={3}>No results found.</Title>
            <Button onClick={() => navigate('/')}>Go Home</Button>
        </div>;
    }

    const bestMatch = results[0];

    // Prepare Radar Data
    // Dimensions: Medical, Life, Spiritual, Traffic
    // We exclude Price from Radar usually or treat differently, but let's include if possible.
    // Let's use the first 4 for clear radar.
    
    // Extract User Needs (from the first result's breakdown)
    const userNeeds = bestMatch ? bestMatch.dimension_details.slice(0, 4).map((d: any) => d.user_val) : [];
    
    // Extract Home Capabilities
    const homeSeries = results.map((res: any, index: number) => {
        return {
            name: res.home.name,
            type: 'radar',
            data: [
                {
                    value: res.dimension_details.slice(0, 4).map((d: any) => d.home_val),
                    name: res.home.name
                }
            ]
        };
    });

    const radarOption = {
        title: {
            text: 'Capability vs Needs Comparison'
        },
        tooltip: {},
        legend: {
            data: ['Elder Needs', ...results.map((r: any) => r.home.name)],
            bottom: 0
        },
        radar: {
            indicator: [
                { name: 'Medical', max: 5 },
                { name: 'Life Care', max: 5 },
                { name: 'Spiritual', max: 5 },
                { name: 'Traffic', max: 5 },
            ]
        },
        series: [
            {
                name: 'Comparison',
                type: 'radar',
                data: [
                    {
                        value: userNeeds,
                        name: 'Elder Needs',
                        itemStyle: { color: 'red' },
                        lineStyle: { type: 'dashed' }
                    },
                    ...results.map((r: any) => ({
                        value: r.dimension_details.slice(0, 4).map((d: any) => d.home_val),
                        name: r.home.name
                    }))
                ]
            }
        ]
    };

    return (
        <div style={{ maxWidth: 1000, margin: '0 auto' }}>
            <Button icon={<ArrowLeftOutlined />} onClick={() => navigate('/elder-form')} style={{ marginBottom: 16 }}>
                Back to Questionnaire
            </Button>
            
            <Title level={2}>Recommended Nursing Homes</Title>
            <Text type="secondary">Top 3 matches based on your profile</Text>
            
            <Row gutter={24} style={{ marginTop: 24 }}>
                <Col xs={24} md={14}>
                    <List
                        grid={{ gutter: 16, column: 1 }}
                        dataSource={results}
                        renderItem={(item: any, index: number) => (
                            <List.Item>
                                <Card 
                                    title={
                                        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                            <span>{index + 1}. {item.home.name}</span>
                                            <Tag color={item.total_match_score > 90 ? 'green' : item.total_match_score > 70 ? 'blue' : 'orange'}>
                                                Match: {item.total_match_score}%
                                            </Tag>
                                        </div>
                                    }
                                    hoverable
                                >
                                    <Paragraph><strong>Price:</strong> ¥{item.home.price} / Month</Paragraph>
                                    <Paragraph><strong>Summary:</strong> {item.summary}</Paragraph>
                                    <Divider style={{ margin: '12px 0' }} />
                                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                                        {item.dimension_details.map((d: any) => (
                                            <Tag 
                                                key={d.dimension} 
                                                color={d.status === 'Satisfied' || d.status === 'Excess' ? 'success' : 'error'}
                                            >
                                                {d.dimension}: {d.status}
                                            </Tag>
                                        ))}
                                    </div>
                                    <div style={{ marginTop: 8, fontSize: '12px', color: '#666' }}>
                                        Details: {item.dimension_details.map((d: any) => `${d.dimension} (${d.home_val}/${d.user_val})`).join(', ')}
                                    </div>
                                </Card>
                            </List.Item>
                        )}
                    />
                </Col>
                
                <Col xs={24} md={10}>
                    <Card title="Visual Comparison (Radar Chart)">
                        <ReactECharts option={radarOption} style={{ height: 400 }} />
                        <div style={{ textAlign: 'center', marginTop: 10, fontSize: '12px', color: '#888' }}>
                            Red Dashed Line = Your Requirements
                        </div>
                    </Card>
                </Col>
            </Row>
        </div>
    );
};

import Paragraph from 'antd/es/typography/Paragraph';
export default Results;
