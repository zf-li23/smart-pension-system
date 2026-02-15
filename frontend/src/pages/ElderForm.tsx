import React, { useState } from 'react';
import { Form, InputNumber, Radio, Select, Button, Typography, Divider, message, Switch } from 'antd';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const { Title } = Typography;

const ElderForm: React.FC = () => {
    const [form] = Form.useForm();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);

    const onFinish = async (values: any) => {
        setLoading(true);
        try {
            // Transform booleans and ensure numbers are numbers
            const payload = {
                chronic_disease_count: values.chronic_disease_count,
                need_monitor: !!values.need_monitor,
                need_rehab: !!values.need_rehab,
                need_device: !!values.need_device,
                
                can_eat_independently: !!values.can_eat_independently, 
                can_wash_independently: !!values.can_wash_independently,
                mobility: values.mobility,
                
                cognitive_status: values.cognitive_status,
                loneliness_level: values.loneliness_level,
                social_need_freq: values.social_need_freq,
                
                family_distance_km: values.family_distance_km,
                visit_freq_needed: values.visit_freq_needed,
                need_pickup: !!values.need_pickup,
                
                service_type: values.service_type,
                max_budget: values.max_budget
            };

            const response = await axios.post('/api/evaluate/elder', payload);
            navigate('/results', { state: { results: response.data, query: payload } });
        } catch (error) {
            console.error(error);
            message.error("Failed to submit form. Please check network.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{ maxWidth: 800, margin: '0 auto' }}>
            <Title level={2}>Elderly Health Requirements</Title>
            <Form
                form={form}
                layout="vertical"
                onFinish={onFinish}
                initialValues={{
                    chronic_disease_count: 0,
                    social_need_freq: 3,
                    visit_freq_needed: 1,
                    can_eat_independently: true,
                    can_wash_independently: true,
                    mobility: 'independent',
                    cognitive_status: 'none',
                    loneliness_level: 'low',
                    service_type: 'long_term',
                    max_budget: 3000
                }}
            >
                <Divider orientation="left">Medical Needs</Divider>
                <Form.Item label="Number of Chronic Diseases" name="chronic_disease_count">
                    <InputNumber min={0} max={10} />
                </Form.Item>
                <Form.Item label="Needs Regular Monitoring?" name="need_monitor" valuePropName="checked">
                    <Switch />
                </Form.Item>
                <Form.Item label="Needs Rehabilitation Training?" name="need_rehab" valuePropName="checked">
                    <Switch />
                </Form.Item>
                <Form.Item label="Needs Medical Devices?" name="need_device" valuePropName="checked">
                    <Switch />
                </Form.Item>

                <Divider orientation="left">Daily Life Needs</Divider>
                <Form.Item label="Can Eat Independently?" name="can_eat_independently" valuePropName="checked">
                    <Switch defaultChecked />
                </Form.Item>
                <Form.Item label="Can Wash/Bathe Independently?" name="can_wash_independently" valuePropName="checked">
                    <Switch defaultChecked />
                </Form.Item>
                <Form.Item label="Mobility" name="mobility">
                    <Radio.Group>
                        <Radio value="independent">Independent</Radio>
                        <Radio value="assisted">Assisted</Radio>
                        <Radio value="bedridden">Bedridden</Radio>
                    </Radio.Group>
                </Form.Item>

                <Divider orientation="left">Spiritual Needs</Divider>
                <Form.Item label="Cognitive Status" name="cognitive_status">
                    <Select>
                        <Select.Option value="none">Normal</Select.Option>
                        <Select.Option value="mild">Mild Impairment</Select.Option>
                        <Select.Option value="severe">Severe Impairment</Select.Option>
                    </Select>
                </Form.Item>
                <Form.Item label="Loneliness Level" name="loneliness_level">
                    <Select>
                        <Select.Option value="low">Low</Select.Option>
                        <Select.Option value="medium">Medium</Select.Option>
                        <Select.Option value="high">High</Select.Option>
                    </Select>
                </Form.Item>
                <Form.Item label="Desired Social Frequency (times/week)" name="social_need_freq">
                    <InputNumber min={0} max={7} />
                </Form.Item>

                <Divider orientation="left">Traffic & Visits</Divider>
                <Form.Item label="Family Distance (km)" name="family_distance_km" rules={[{ required: true }]}>
                    <InputNumber min={0} step={0.1} />
                </Form.Item>
                <Form.Item label="Desired Visit Frequency (times/week)" name="visit_freq_needed">
                    <InputNumber min={0} max={7} />
                </Form.Item>
                <Form.Item label="Needs Pick-up for Visits?" name="need_pickup" valuePropName="checked">
                    <Switch />
                </Form.Item>

                <Divider orientation="left">Service & Budget</Divider>
                <Form.Item label="Service Type" name="service_type">
                    <Radio.Group>
                        <Radio value="long_term">Long Term Stay</Radio>
                        <Radio value="day_care">Day Care</Radio>
                        <Radio value="short_term">Short Term Respite</Radio>
                    </Radio.Group>
                </Form.Item>
                <Form.Item label="Budget (Monthly)" name="max_budget" rules={[{ required: true }]}>
                    <InputNumber style={{ width: 200 }} min={0} step={100} prefix="¥" />
                </Form.Item>

                <Form.Item>
                    <Button type="primary" htmlType="submit" size="large" loading={loading} block>
                        Run Matching Algorithm
                    </Button>
                </Form.Item>
            </Form>
        </div>
    );
};

export default ElderForm;
