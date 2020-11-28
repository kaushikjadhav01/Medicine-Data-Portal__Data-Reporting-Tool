import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Row, Col, Select, Form, Radio, Card, Modal, Button } from 'antd';
import { pick } from 'lodash'
import { postAdminProductsToBeVerified } from '../../../appRedux/actions/SalesReport';
import { getAdminProductDetails } from '../../../appRedux/actions/AdminProducts';


const ProductVerificationModal = (props) => {
    const { visible, statusArray, hideVerificationModal, partnerId, setSalesReport } = props;

    const dispatch = useDispatch();
    const [verificationForm] = Form.useForm();
    const { productVerificationList, isLoaded } = useSelector(({ salesReport }) => salesReport);
    const [toBeVerifiedProductList, setToBeVerifiedProductList] = useState([])
    const [productList, setProductList] = useState([])
    const [productNameList, setProductNameList] = useState([])

    useEffect(() => {
        setToBeVerifiedProductList(productVerificationList.pending_products)
        setProductList(productVerificationList.existing_products)
        setProductNameList(productVerificationList.existing_products.map(value => value.product_name))
    }, [])

    useEffect(() => {
        console.log('product-list', toBeVerifiedProductList)
    }, [toBeVerifiedProductList])

    const handleVerification = () => {
        verificationForm.validateFields().then(
            values => {
                dispatch(postAdminProductsToBeVerified(
                    partnerId,
                    values.active_products.map(value => pick(value, ['product_verification_id', 'product_name', 'is_approved', 'category', 'therapy_area', 'product_status'])),
                    () => {
                        hideVerificationModal()
                        setSalesReport()
                    }
                ))
            }
        )
    }

    const handleFormValueChange = (newValue, newValueList) => {
        setToBeVerifiedProductList(newValueList.active_products)
    }

    const handleProductSearch = (value) => {
        let tempProductList = productList.map(value => value.product_name)
        if (!tempProductList.includes(value)) {
            tempProductList.push(value)
        }
        setProductNameList(tempProductList)
    }

    const handleProductSelect = (value, key) => {
        if (productList.map(val => val.product_name).includes(value)) {
            dispatch(getAdminProductDetails(
                {
                    'product_name': value,
                    'partner_id': partnerId
                },
                (data) => {
                    if (data) {
                        const { category, therapy_area, product_status } = data;
                        let tempToBeVerifiedProductList = [...toBeVerifiedProductList];
                        tempToBeVerifiedProductList[key].category = category;
                        tempToBeVerifiedProductList[key].therapy_area = therapy_area;
                        tempToBeVerifiedProductList[key].product_status = product_status;
                        tempToBeVerifiedProductList[key].product_name = value;
                        tempToBeVerifiedProductList[key].does_product_exist = true;
                        verificationForm.setFieldsValue({
                            active_products: tempToBeVerifiedProductList
                        })
                        setToBeVerifiedProductList(tempToBeVerifiedProductList)
                    }
                }
            ))
        } else {
            let tempToBeVerifiedProductList = [...toBeVerifiedProductList];
            tempToBeVerifiedProductList[key].product_name = value;
            tempToBeVerifiedProductList[key].does_product_exist = false;
            verificationForm.setFieldsValue({
                active_products: tempToBeVerifiedProductList
            })
            setToBeVerifiedProductList(tempToBeVerifiedProductList)
        }
    }

    return (
        <Modal
            title='Product Verification'
            visible={visible}
            okText='Submit'
            onCancel={() => { hideVerificationModal() }}
            width={900}
            footer={[
                <Button key='submit' type='primary' onClick={() => { handleVerification() }}>Submit</Button>,
                <Button key='cancel' onClick={() => { hideVerificationModal() }}>Cancel</Button>
            ]}
        >
            <Form
                form={verificationForm}
                layout='vertical'
                initialValues={{
                    active_products: productVerificationList ?
                        productVerificationList.pending_products
                        : []
                }}
                onValuesChange={handleFormValueChange}
            >
                <Form.List
                    name='active_products'
                >
                    {(fields, { add, remove }) => {
                        return (
                            <div>
                                {fields.map((field, index) => (
                                    <Form.Item
                                        key={field.key}
                                        validateTrigger={['onChange', 'onBlur']}
                                        rules={[
                                            {
                                                required: false,
                                                message: 'Please enter details',
                                            },
                                        ]}
                                    >
                                        <div className='flex-d-row'>
                                            <Col span={24}>
                                                <Card className='mb-0'>
                                                    <Row className='gx-flex-row'>
                                                        <Col span={16}>
                                                            <Form.Item
                                                                {...field}
                                                                className='mb-0'
                                                                label='Product name'
                                                                validateTrigger={['onChange', 'onBlur']}
                                                                name={[field.name, 'product_name']}
                                                                fieldKey={[field.fieldKey, 'product_name']}
                                                                rules={[
                                                                    {
                                                                        required: true,
                                                                        message: 'Please Enter Product name',
                                                                    },
                                                                ]}
                                                            >
                                                                <Select
                                                                    placeholder='Enter product name'
                                                                    showSearch
                                                                    // mode='tags'
                                                                    showArrow={true}
                                                                    onSearch={handleProductSearch}
                                                                    onSelect={(value) => handleProductSelect(value, field.key)}
                                                                >
                                                                    {
                                                                        productNameList.map(value => <Select.Option key={value}>{value}</Select.Option>)
                                                                    }
                                                                </Select>
                                                            </Form.Item>
                                                        </Col>
                                                        <Col span={8}>
                                                            <Form.Item
                                                                {...field}
                                                                className='mb-0'
                                                                label='Approve Status'
                                                                validateTrigger={['onChange', 'onBlur']}
                                                                name={[field.name, 'is_approved']}
                                                                fieldKey={[field.fieldKey, 'is_approved']}
                                                                rules={[
                                                                    {
                                                                        required: true,
                                                                        message: 'Please enter status.',
                                                                    },
                                                                ]}
                                                            >
                                                                <Radio.Group buttonStyle='solid' >
                                                                    <Radio.Button value={true}>Confirm</Radio.Button>
                                                                    <Radio.Button value={false}>Reject</Radio.Button>
                                                                </Radio.Group>
                                                            </Form.Item>
                                                        </Col>
                                                        <Col span={8}>
                                                            <Form.Item
                                                                {...field}
                                                                className='mb-0 mt-20'
                                                                label='Category'
                                                                validateTrigger={['onChange', 'onBlur']}
                                                                name={[field.name, 'category']}
                                                                fieldKey={[field.fieldKey, 'category']}
                                                                rules={[
                                                                    {
                                                                        required: !(toBeVerifiedProductList && toBeVerifiedProductList[field.fieldKey] && (toBeVerifiedProductList[field.fieldKey].is_approved === false || toBeVerifiedProductList[field.fieldKey].does_product_exist)),
                                                                        message: 'Please select category',
                                                                    },
                                                                ]}
                                                            >
                                                                <Radio.Group
                                                                    disabled={toBeVerifiedProductList && toBeVerifiedProductList[field.fieldKey] && (toBeVerifiedProductList[field.fieldKey].is_approved === false || toBeVerifiedProductList[field.fieldKey].does_product_exist)}
                                                                >
                                                                    <Radio value='FDF'>FDF</Radio>
                                                                    <Radio value='API'>API</Radio>
                                                                </Radio.Group>
                                                            </Form.Item>
                                                        </Col>
                                                        <Col span={8}>
                                                            <Form.Item
                                                                {...field}
                                                                className='mb-0 mt-20'
                                                                label='Therapy Area'
                                                                validateTrigger={['onChange', 'onBlur']}
                                                                name={[field.name, 'therapy_area']}
                                                                fieldKey={[field.fieldKey, 'therapy_area']}
                                                                rules={[
                                                                    {
                                                                        required: !(toBeVerifiedProductList && toBeVerifiedProductList[field.fieldKey] && (toBeVerifiedProductList[field.fieldKey].is_approved === false || toBeVerifiedProductList[field.fieldKey].does_product_exist)),
                                                                        message: 'Please select therapy area.',
                                                                    },
                                                                ]}
                                                            >
                                                                <Select
                                                                    placeholder='Select therapy area'
                                                                    disabled={toBeVerifiedProductList && toBeVerifiedProductList[field.fieldKey] && (toBeVerifiedProductList[field.fieldKey].is_approved === false || toBeVerifiedProductList[field.fieldKey].does_product_exist)}
                                                                >
                                                                    <Select.Option value='HIV'>HIV</Select.Option >
                                                                    <Select.Option value='HCV'>HCV</Select.Option >
                                                                    <Select.Option value='HBV'>HBV</Select.Option >
                                                                </Select>
                                                            </Form.Item>
                                                        </Col>
                                                        <Col span={8}>
                                                            <Form.Item
                                                                {...field}
                                                                className='mb-0 mt-20'
                                                                label='Product Status'
                                                                validateTrigger={['onChange', 'onBlur']}
                                                                name={[field.name, 'product_status']}
                                                                fieldKey={[field.fieldKey, 'product_status']}
                                                                rules={[
                                                                    {
                                                                        required: !(toBeVerifiedProductList && toBeVerifiedProductList[field.fieldKey] && (toBeVerifiedProductList[field.fieldKey].is_approved === false)),
                                                                        message: 'Please enter status.',
                                                                    },
                                                                ]}
                                                            >
                                                                <Select
                                                                    placeholder='Please select product status'
                                                                    className='product-select'
                                                                    disabled={toBeVerifiedProductList && toBeVerifiedProductList[field.fieldKey] && (toBeVerifiedProductList[field.fieldKey].is_approved === false)}
                                                                >
                                                                    {
                                                                        statusArray && statusArray.length ? statusArray.map(
                                                                            value => (<Select.Option key={statusArray.indexOf(value)} value={value.id}>{value.name}</Select.Option>)
                                                                        ) : []
                                                                    }
                                                                </Select>
                                                            </Form.Item>
                                                        </Col>
                                                    </Row>
                                                </Card>
                                            </Col>
                                        </div>
                                    </Form.Item>
                                ))}
                            </div>
                        );
                    }}
                </Form.List>
            </Form>
        </Modal>
    )
}

export default ProductVerificationModal

