import React, { useEffect, useState } from 'react';
import {
    Form,
    Input,
    Select,
    Row,
    Col,
    Button,
    Card,
    Radio
} from 'antd';
import { LeftOutlined } from '@ant-design/icons';
import { useDispatch, useSelector } from 'react-redux';
import { adminAddProduct, adminEditProduct, getAdminProduct, resetProduct } from '../../../appRedux/actions';
import './add-product.css'

const { Option } = Select;

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

const AddProduct = (props) => {

    const { product_id } = props.match.params;
    const { isProductAdded, isLoaded, productItem, isProductEdited } = useSelector(({ adminProducts }) => adminProducts);
    const [editFlag, setEditFlag] = useState(false);
    const dispatch = useDispatch();
    const [form] = Form.useForm();

    useEffect(() => {
        if (product_id) {
            setEditFlag(true)
            dispatch(getAdminProduct(product_id))
        }
    }, [])

    useEffect(() => {
        if (isProductAdded || isProductEdited) {
            form.resetFields();
            props.history.push('/admin/product-list')
        }
        if (isLoaded && editFlag) {
            form.setFieldsValue(productItem)
        }
    }, [isProductAdded, isProductEdited, isLoaded])


    const navigateBack = () => {
        const { history } = props;
        history.goBack();
    }

    const navigateToProductList = () => {
        const { history } = props;
        history.push('/admin/product-list');
    }

    const onFinish = values => {
        if (editFlag) {
            dispatch(adminEditProduct(product_id, values, () => {
                dispatch(resetProduct())
            }))
        } else {
            dispatch(adminAddProduct(values, () => {
                dispatch(resetProduct())
            }));
        }
    };

    return (
        <div>
            <Row>
                <Col span={24}>
                    <h1 className='title gx-mb-4'>
                        <LeftOutlined className='mr-5' onClick={navigateBack} />
                        {editFlag ? 'Edit Product' : 'Add Product'}
                    </h1>
                </Col>
                <Col span={24}>
                    <Card className='gx-card'>
                        <Row>
                            <Col span={22}>
                                <Form
                                    {...formItemLayout}
                                    form={form}
                                    name='add-product'
                                    onFinish={onFinish}
                                    scrollToFirstError
                                >
                                    <Form.Item
                                        name='product_name'
                                        label='Product Name'
                                        rules={[{ required: true, message: 'Please enter product name!' }]}
                                    >
                                        <Input />
                                    </Form.Item>
                                    <Form.Item
                                        name='category'
                                        label='Category'
                                        rules={[{ required: true, message: 'Please select category!' }]}
                                    >
                                        <Radio.Group disabled={editFlag}>
                                            <Radio value='FDF'>FDF</Radio>
                                            <Radio value='API'>API</Radio>
                                        </Radio.Group>
                                    </Form.Item>

                                    <Form.Item
                                        label='Stages'
                                    >
                                        <Row>
                                            <Col span={12}>
                                                <Row>
                                                    <span className='stages-title'>FDF</span>
                                                </Row>
                                                <Row>
                                                    <ol>
                                                        <li> Development set-up</li>
                                                        <li> Trial Batch</li>
                                                        <li> Pilot BE</li>
                                                        <li> Exhibit batches</li>
                                                        <li> Pivotal BE</li>
                                                        <li> Stability loading in different packs</li>
                                                        <li> Stability data  6 months</li>
                                                        <li> Dossier Compilation</li>
                                                        <li> DF Dossier Filing USFDA</li>
                                                        <li> DF Dossier Filing WHO</li>
                                                        <li>USFDA Approval (FDF)</li>
                                                        <li>WHO-PQ Approval (FDF)</li>
                                                    </ol>
                                                </Row>
                                            </Col>
                                            <Col span={12}>
                                                <Row>
                                                    <span className='stages-title'>API</span>
                                                </Row>
                                                <Row>
                                                    <ol>
                                                        <li>Investigation and route selection</li>
                                                        <li>R&D Batch API</li>
                                                        <li>Lab scale batch API</li>
                                                        <li>RM Procurement</li>
                                                        <li>API Trial Batch</li>
                                                        <li>API Validation Batches</li>
                                                        <li>API Stability loading</li>
                                                        <li>API Stability Study</li>
                                                        <li>DMF Compilation</li>
                                                        <li>DMF Filing USFDA</li>
                                                        <li>DMF Filing WHO-PQ</li>
                                                        <li>USFDA Approval (API)</li>
                                                        <li>WHO-PQ Approval (API)</li>
                                                    </ol>
                                                </Row>
                                            </Col>
                                        </Row>
                                    </Form.Item>

                                    <Form.Item
                                        name='therapy_area'
                                        label='Therapy Area'
                                        hasFeedback
                                        rules={[{ required: true, message: 'Please select therapy area!' }]}
                                    >
                                        <Select placeholder='Please select therapy area'>
                                            <Option value='HIV'>HIV</Option>
                                            <Option value='HCV'>HCV</Option>
                                            <Option value='HBV'>HBV</Option>
                                        </Select>
                                    </Form.Item>

                                    <Form.Item className='flex-d-row-reverse'>
                                        <Button type='primary' htmlType='submit'>
                                            {editFlag ? 'Edit Product' : 'Add Product'}
                                        </Button>
                                        <Button onClick={navigateToProductList}>
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
    )
}

export default AddProduct
