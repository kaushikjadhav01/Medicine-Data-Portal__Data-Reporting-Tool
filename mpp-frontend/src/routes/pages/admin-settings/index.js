import React, { useEffect, useState } from 'react';
import { Button, DatePicker, Form, Card, Col, Row } from 'antd';
import { useDispatch, useSelector } from 'react-redux';
import { adminGetCutOffDate, adminSetCutOffDate } from '../../../appRedux/actions';
import { LeftOutlined } from '@ant-design/icons';
import moment from 'moment';

const formItemLayout = {
    labelCol: {
        xs: { span: 24 },
        sm: { span: 8 },
    },
    wrapperCol: {
        xs: { span: 24 },
        sm: { span: 16 },
    },
};

const AdminSettings = (props) => {

    const dispatch = useDispatch();
    const [form] = Form.useForm();

    const { isLoaded, cutOffDate } = useSelector(({ adminPartner }) => adminPartner);

    useEffect(() => {
        dispatch(adminGetCutOffDate())
    }, [])

    useEffect(() => {
        if (isLoaded) {
            form.setFieldsValue({
                date: cutOffDate && cutOffDate.cut_off_date ? moment(cutOffDate.cut_off_date) : ''
            })
        }
    }, [isLoaded])

    const config = {
        rules: [{ type: 'object', required: true, message: 'Please select date!' }],
    };

    const navigateBack = () => {
        props.history.goBack()
    }

    const navigateToDashboard = () => {
        props.history.push('/')
    }

    const onFinish = values => {
        dispatch(adminSetCutOffDate({ 'date': values.date.format('DD-MM-yyyy') }))
    };

    return (
        <div>
            <Row>
                <Col span={24}>
                    <h1 className='title gx-mb-4'>
                        <LeftOutlined className='mr-5' onClick={navigateBack} />
                        Admin Settings
                    </h1>
                </Col>
                <Col span={24}>
                    <Card className='gx-card'>
                        <Row>
                            <Col span={22}>
                                <Form
                                    name='time_related_controls'
                                    onFinish={onFinish}
                                    form={form}
                                    className='gx-signin-form gx-form-row0'
                                    {...formItemLayout}
                                >
                                    <Form.Item
                                        name='date'
                                        {...config}
                                        label='Set Report submission date'
                                    >
                                        <DatePicker format='DD-MM-YYYY' />
                                    </Form.Item>

                                    <Form.Item className='flex-d-row-reverse'>
                                        <Button type='primary' htmlType='submit'>
                                            Save
                                        </Button>
                                        <Button onClick={navigateToDashboard}>
                                            Cancel
                                        </Button>
                                    </Form.Item>
                                </Form>

                            </Col>
                            <Col span={2}></Col>
                        </Row>
                    </Card>
                </Col>
            </Row>
        </div>
    );
};

export default AdminSettings;
