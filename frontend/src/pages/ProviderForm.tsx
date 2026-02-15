import React, { useState } from 'react';
import { Form, Input, InputNumber, Button, Checkbox, Radio, Select, message, Typography, Divider } from 'antd';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const { Title } = Typography;

const ProviderForm: React.FC = () => {
    const [loading, setLoading] = useState(false);
    const [form] = Form.useForm();
    const navigate = useNavigate();

    const onFinish = async (values: any) => {
        setLoading(true);
        try {
            await axios.post('/api/evaluate/home_questionnaire', {
                ...values,
                service_types: values.service_types || [],
                barrier_free_score: values.barrier_free_score || 3,
                rehab_equip_count: values.rehab_equip_count || 0
            });
            message.success('Nursing Home Registered Successfully!');
            navigate('/');
        } catch (error) {
            console.error(error);
            message.error('Registration failed.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{ maxWidth: 800, margin: '0 auto' }}>
            <Title level={2}>Nursing Home Registration</Title>
            <Form form={form} layout="vertical" onFinish={onFinish}>
                <Divider orientation="left">Basic Info</Divider>
                <Form.Item name="name" label="Facility Name" rules={[{ required: true }]}>
                    <Input />
                </Form.Item>
                <Form.Item name="address" label="Address" rules={[{ required: true }]}>
                    <Input />
                </Form.Item>
                <Form.Item name="contact" label="Contact Phone" rules={[{ required: true }]}>
                    <Input />
                </Form.Item>
                <Form.Item name="description" label="Short Description">
                    <Input.TextArea />
                </Form.Item>

                <Divider orientation="left">Medical Capabilities</Divider>
                <Form.Item name="has_infirmary" valuePropName="checked">
                    <Checkbox>Has Infirmary?</Checkbox>
                </Form.Item>
                <Form.Item name="has_emergency" valuePropName="checked">
                    <Checkbox>Has Emergency Facilities?</Checkbox>
                </Form.Item>
                <Form.Item name="hospital_coop" valuePropName="checked">
                    <Checkbox>Cooperation with Nearby Hospital?</Checkbox>
                </Form.Item>
                <Form.Item name="rehab_equip_count" label="Rehab Equipment Count">
                    <InputNumber min={0} />
                </Form.Item>

                <Divider orientation="left">Life & Service</Divider>
                <Form.Item name="care_grade" label="Care Level Capacity">
                    <Select>
                        <Select.Option value="self_care">Self Care</Select.Option>
                        <Select.Option value="semi_care">Semi-Assisted</Select.Option>
                        <Select.Option value="full_care">Full Nursing Care</Select.Option>
                    </Select>
                </Form.Item>
                <Form.Item name="special_diet" valuePropName="checked">
                    <Checkbox>Special Diet Available?</Checkbox>
                </Form.Item>
                <Form.Item name="barrier_free_score" label="Barrier Free Score (1-5)">
                    <InputNumber min={1} max={5} />
                </Form.Item>
                <Form.Item name="safety_facilities" valuePropName="checked">
                    <Checkbox>Safety Monitoring Systems?</Checkbox>
                </Form.Item>

                <Divider orientation="left">Spiritual & Traffic</Divider>
                <Form.Item name="activity_freq" label="Activity Frequency">
                    <Radio.Group>
                        <Radio value="daily">Daily</Radio>
                        <Radio value="weekly">Weekly</Radio>
                    </Radio.Group>
                </Form.Item>
                <Form.Item name="psych_support" valuePropName="checked">
                    <Checkbox>Psychological Support?</Checkbox>
                </Form.Item>
                <Form.Item name="location_type" label="Location Type">
                    <Select>
                        <Select.Option value="center">City Center</Select.Option>
                        <Select.Option value="suburb">Suburb</Select.Option>
                    </Select>
                </Form.Item>
                
                <Divider orientation="left">Offerings</Divider>
                <Form.Item name="service_types" label="Service Types Offered">
                    <Checkbox.Group>
                        <Checkbox value="long_term">Long Term Stay</Checkbox>
                        <Checkbox value="day_care">Day Care</Checkbox>
                        <Checkbox value="short_term">Short Term Respite</Checkbox>
                    </Checkbox.Group>
                </Form.Item>
                <Form.Item name="price" label="Monthly Price (Approx)" rules={[{ required: true }]}>
                    <InputNumber prefix="¥" style={{ width: 150 }} />
                </Form.Item>

                <Button type="primary" htmlType="submit" loading={loading} block>
                    Submit & Register
                </Button>
            </Form>
        </div>
    );
};

export default ProviderForm;
