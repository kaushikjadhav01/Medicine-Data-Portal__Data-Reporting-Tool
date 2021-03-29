import React, { useEffect, useState } from 'react';
import {
    Form,
    Input,
    Select,
    Row,
    Col,
    Button,
    Card,
} from 'antd';
import { LeftOutlined, MinusCircleOutlined, PlusOutlined } from '@ant-design/icons';
import FormItem from 'antd/lib/form/FormItem';
import { useDispatch, useSelector } from 'react-redux';
import { getAdminProductList, adminAddPartner, getAdminSinglePartner, adminEditPartner, resetEditPartner, getAdminCountryList } from '../../../appRedux/actions';
import IntlMessages from 'util/IntlMessages';
import './add-partner.css'
import { countryCodeList, statusArray } from '../../../helpers';
import { sortBy } from 'lodash';

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

const AddPartner = (props) => {

    const { isPartnerAdded, isPartnerEdited, partnerDetails, countryList, isLoaded } = useSelector(({ adminPartner }) => adminPartner);
    const { productList } = useSelector(({ adminProducts }) => adminProducts);
    const [editFlag, setEditFlag] = useState(false);
    const [partnerEmployeeData, setPartnerEmployeeData] = useState([]);
    const dispatch = useDispatch();
    const [form] = Form.useForm();

    useEffect(() => {
        const { path, params } = props.match;
        if (params.id && (path.split('/')[2] === 'edit-partner')) {
            dispatch(getAdminSinglePartner(params.id))
            dispatch(getAdminCountryList())
            dispatch(getAdminProductList(false))
            setEditFlag(true)
        } else {
            dispatch(getAdminCountryList())
            dispatch(getAdminProductList(false))
        }
    }, [])

    useEffect(() => {
        if (isPartnerEdited || isPartnerAdded) {
            form.resetFields();
            props.history.push('/admin/partner-list')
        }
        if (isLoaded) {
            if (editFlag) {
                const { partner } = partnerDetails;
                setPartnerEmployeeData(partner && partner.employee ? partner.employee : [])
                form.setFieldsValue({
                    company_name: partner.company_name,
                    email: partnerDetails.email,
                    contact: partner.contact_number.slice(partner.contact_number.length - 10),
                    prefix: partner.contact_number.substring(0, partner.contact_number.length - 10),
                    address: partner.address,
                    region: partner.region,
                    active_products: partner.active_products
                })
                if (partner.employee && partner.employee.length > 0) {
                    form.setFieldsValue({
                        employee: partner.employee,
                    })
                }
            }
        }
    })

    const onFinish = values => {
        const { params } = props.match;
        let data = {
            'email': values.email ? values.email.toLowerCase() : '',
            'partner': {
                'company_name': values.company_name,
                'contact_number': values.prefix + values.contact,
                'address': values.address ? values.address : null,
                'region': values.region,
                'active_products': values.active_products ? values.active_products : [],
                'employee': setEmployeeData(values.employee)
            }
        }
        if (editFlag) {
            let editData = data;
            dispatch(adminEditPartner(params.id, editData, () => {
                dispatch(resetEditPartner())
            }))
        } else {
            dispatch(adminAddPartner(data, () => {
                dispatch(resetEditPartner())
            }))
        }
    };

    const setEmployeeData = (data) => {
        if (data.length > 0) {
            if (editFlag) {
                return data.map((value, index) => {
                    if (partnerEmployeeData[index]) {
                        return { ...value, 'employee_id': partnerEmployeeData[index].employee_id }
                    } else {
                        return { ...value, 'employee_id': 0 }
                    }
                })
            } else {
                return data.map(value => ({ ...value, 'employee_id': 0 }))
            }
        }
        return []
    }

    const setCountryCodeListOptions = () => {
        let sortedCountryCodeList = sortBy(countryCodeList, ['code']);
        return sortedCountryCodeList.map(
            value => <Option key={value.code} value={value.code}>{value.code}</Option>
        )
    }

    const prefixSelector = (
        <Form.Item name='prefix' noStyle>
            <Select
                style={{ width: 100 }}
                showSearch
                optionFilterProp='children'
                filterOption={true}
                id='partner-countrylist'
            >
                {
                    setCountryCodeListOptions()
                }
            </Select>
        </Form.Item>
    );

    const navigateBack = () => {
        const { history } = props;
        history.goBack();
    }

    const navigateToPartnerList = () => {
        const { history } = props;
        history.push('/admin/partner-list');
    }

    return (
        <div>
            <Row>
                <Col span={24}>
                    <h1 className='title gx-mb-4'>
                        <LeftOutlined className='mr-5' onClick={navigateBack} />
                        {editFlag ? 'Edit Partner' : 'Add Partner'}
                    </h1>
                </Col>
                <Col span={24}>
                    <Card className='gx-card'>
                        <Row>
                            <Col span={22}>
                                <Form
                                    {...formItemLayout}
                                    form={form}
                                    name='add-partner'
                                    onFinish={onFinish}
                                    initialValues={{
                                        prefix: '+91',
                                        active_products: [{ product_id: null, status: "", product_name: "" }],
                                        employee: [{ first_name: '', last_name: '', contact_number: '' }]
                                    }}
                                    scrollToFirstError
                                >
                                    <Form.Item name='company_name' label='Company Name' rules={[{ required: true, message: <IntlMessages id='error.company_required' /> }]}>
                                        <Input />
                                    </Form.Item>

                                    <Form.Item
                                        name='email'
                                        label='E-mail'
                                        rules={[
                                            {
                                                type: 'email',
                                                message: <IntlMessages id='error.email_valid' />,
                                            },
                                            {
                                                required: true,
                                                message: <IntlMessages id='error.email_required' />,
                                            },
                                        ]}
                                    >
                                        <Input />
                                    </Form.Item>

                                    <Form.Item
                                        name='contact'
                                        label='Contact Number'
                                        rules={[
                                            { required: true, message: <IntlMessages id='error.contact_required' /> },
                                            { len: 10, message: <IntlMessages id='error.contact_length' /> },
                                            { pattern: /^[0-9]+$/, message: <IntlMessages id='error.contact_valid' /> },
                                        ]}
                                    >
                                        <Input addonBefore={prefixSelector} style={{ width: '100%' }} />
                                    </Form.Item>

                                    <Form.Item name='address' label='Address' rules={[{ required: false, message: <IntlMessages id='error.address_required' /> }]}>
                                        <Input.TextArea />
                                    </Form.Item>

                                    <Form.Item
                                        name='region'
                                        label='Region'
                                        hasFeedback
                                        rules={[{ required: true, message: <IntlMessages id='error.region_required' /> }]}
                                    >
                                        <Select
                                            placeholder='Please select a region'
                                            showSearch
                                            optionFilterProp='children'
                                            filterOption={true}
                                            id='partner-region'
                                        >
                                            {
                                                countryList.map(
                                                    value => <Option key={value} value={value}>{value}</Option>
                                                )
                                            }
                                        </Select>
                                    </Form.Item>

                                    <Form.Item
                                        label='Active Products'
                                        className='mb-0'
                                    >
                                        <Form.List
                                            name='active_products'
                                        >
                                            {(fields, { add, remove }) => {
                                                return (
                                                    <div>
                                                        {fields.map((field, index) => (
                                                            <Form.Item
                                                                wrapperCol={{ sm: 24 }}
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
                                                                    <Col span={22}>
                                                                        <Row>
                                                                            <Col span={12}>
                                                                                <FormItem
                                                                                    {...field}
                                                                                    className='mb-0'
                                                                                    validateTrigger={['onChange', 'onBlur']}
                                                                                    name={[field.name, 'product_id']}
                                                                                    fieldKey={[field.fieldKey, 'product_id']}
                                                                                    rules={[
                                                                                        {
                                                                                            required: true,
                                                                                            message: 'Please select product.',
                                                                                        },
                                                                                    ]}
                                                                                >
                                                                                    <Select
                                                                                        placeholder='Please select product'
                                                                                        className='product-select'
                                                                                        id={'partner-product-' + field.fieldKey}
                                                                                        showSearch
                                                                                        optionFilterProp='children'
                                                                                        filterOption={true}
                                                                                    >
                                                                                        {
                                                                                            productList && productList.length ? productList.map(
                                                                                                value => (<Option key={productList.indexOf(value)} value={value.product_id}>{value.product_name}</Option>)
                                                                                            ) : []
                                                                                        }
                                                                                    </Select>
                                                                                </FormItem>
                                                                            </Col>
                                                                            <Col span={12}>
                                                                                <FormItem
                                                                                    {...field}
                                                                                    className='mb-0'
                                                                                    validateTrigger={['onChange', 'onBlur']}
                                                                                    name={[field.name, 'status']}
                                                                                    fieldKey={[field.fieldKey, 'status']}
                                                                                    rules={[
                                                                                        {
                                                                                            required: true,
                                                                                            message: 'Please enter status.',
                                                                                        },
                                                                                    ]}
                                                                                >
                                                                                    <Select
                                                                                        placeholder='Please select product status'
                                                                                        className='product-select'
                                                                                        id={'partner-product-status-' + field.fieldKey}
                                                                                    >
                                                                                        {
                                                                                            statusArray && statusArray.length ? statusArray.map(
                                                                                                value => (<Option key={statusArray.indexOf(value)} id={value.id} value={value.id}>{value.name}</Option>)
                                                                                            ) : []
                                                                                        }
                                                                                    </Select>
                                                                                </FormItem>
                                                                            </Col>
                                                                        </Row>
                                                                    </Col>
                                                                    <Col span={2} className='flex-d-row align-items-center'>
                                                                        <MinusCircleOutlined
                                                                            className='dynamic-delete-button'
                                                                            style={{ margin: '0 8px' }}
                                                                            onClick={() => {
                                                                                remove(field.name);
                                                                            }}
                                                                        />
                                                                    </Col>
                                                                </div>
                                                            </Form.Item>
                                                        ))}

                                                        <Form.Item className='flex-d-row-reverse'>
                                                            <Button
                                                                type='dashed'
                                                                onClick={() => {
                                                                    add();
                                                                }}
                                                                className='ml-20 width-60'
                                                                id='partner-add-product'
                                                            >
                                                                <PlusOutlined /> Add Product
                                                            </Button>
                                                        </Form.Item>
                                                    </div>
                                                );
                                            }}
                                        </Form.List>
                                    </Form.Item>

                                    <Form.List name='employee'>
                                        {(fields, { add, remove }) => {
                                            return (
                                                <div>
                                                    {fields.map((field, index) => (
                                                        <Form.Item
                                                            label={'Person ' + (index + 1)}
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
                                                                <Col span={22}>
                                                                    <Row>
                                                                        <Col span={8}>
                                                                            <FormItem
                                                                                {...field}
                                                                                className='mb-0'
                                                                                validateTrigger={['onChange', 'onBlur']}
                                                                                name={[field.name, 'first_name']}
                                                                                fieldKey={[field.fieldKey, 'first_name']}
                                                                                rules={[
                                                                                    {
                                                                                        required: true,
                                                                                        message: 'Please enter first name.',
                                                                                    },
                                                                                ]}

                                                                            >
                                                                                <Input className='people-info' placeholder='first name' />
                                                                            </FormItem>
                                                                        </Col>
                                                                        <Col span={8}>
                                                                            <FormItem
                                                                                {...field}
                                                                                className='mb-0'
                                                                                validateTrigger={['onChange', 'onBlur']}
                                                                                name={[field.name, 'last_name']}
                                                                                fieldKey={[field.fieldKey, 'last_name']}
                                                                                rules={[
                                                                                    {
                                                                                        required: true,
                                                                                        message: 'Please enter last name.',
                                                                                    },
                                                                                ]}
                                                                            >
                                                                                <Input className='people-info' placeholder='last name' />
                                                                            </FormItem>
                                                                        </Col>
                                                                        <Col span={8}>
                                                                            <FormItem
                                                                                {...field}
                                                                                className='mb-0'
                                                                                validateTrigger={['onChange', 'onBlur']}
                                                                                name={[field.name, 'contact_number']}
                                                                                fieldKey={[field.fieldKey, 'contact_number']}
                                                                                rules={[
                                                                                    { required: true, message: <IntlMessages id='error.contact_required' /> },
                                                                                    { len: 10, message: <IntlMessages id='error.contact_length' /> },
                                                                                    { pattern: /^[0-9]+$/, message: <IntlMessages id='error.contact_valid' /> },
                                                                                ]}
                                                                            >
                                                                                <Input className='people-info' placeholder='phone number' />
                                                                            </FormItem>
                                                                        </Col>
                                                                    </Row>
                                                                </Col>
                                                                <Col span={2} className='flex-d-row align-items-center'>
                                                                    <MinusCircleOutlined
                                                                        className='dynamic-delete-button'
                                                                        style={{ margin: '0 8px' }}
                                                                        onClick={() => {
                                                                            remove(field.name);
                                                                        }}
                                                                    />
                                                                </Col>
                                                            </div>
                                                        </Form.Item>
                                                    ))}
                                                    <Form.Item className='flex-d-row-reverse'>
                                                        <Button
                                                            type='dashed'
                                                            onClick={() => {
                                                                add();
                                                            }}
                                                            id='partner-add-product'
                                                            style={{ width: '60%' }}
                                                        >
                                                            <PlusOutlined /> Add people
                                                        </Button>
                                                    </Form.Item>
                                                </div>
                                            );
                                        }}
                                    </Form.List>

                                    <Form.Item className='flex-d-row-reverse'>
                                        <Button id='add-partner-save' type='primary' htmlType='submit'>
                                            {editFlag ? 'Save' : 'Add Partner'}
                                        </Button>
                                        <Button id='add-partner-cancel' onClick={navigateToPartnerList} >
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

export default AddPartner
