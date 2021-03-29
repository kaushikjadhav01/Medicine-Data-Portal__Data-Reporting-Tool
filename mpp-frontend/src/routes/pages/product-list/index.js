import React, { useEffect, useState } from 'react';
import IntlMessages from 'util/IntlMessages';
import { Card, Table, Row, Col, Button, Tooltip } from 'antd';
import { useDispatch, useSelector } from 'react-redux';
import { deleteAdminProduct, getAdminProductList } from '../../../appRedux/actions';
import { DeleteTwoTone, EditTwoTone, MedicineBoxOutlined } from '@ant-design/icons';
import { showConfirm, getRole } from '../../../helpers';

const ProductList = (props) => {

    const isLoaded = useSelector(state => state.adminProducts.isLoaded);
    const adminProductList = useSelector(state => state.adminProducts.productList);
    const dispatch = useDispatch();
    const [data, setData] = useState([]);
    const [filteredInfo, setFilteredInfo] = useState({});
    const [isUserAdmin, setIsUserAdmin] = useState(false);

    useEffect(() => {
        setIsUserAdmin(() => {
            return (getRole() === 'ADMIN')
        })
        dispatch(getAdminProductList(true));
    }, [])

    useEffect(() => {
        let rowData = adminProductList.length ? adminProductList.map(
            value => ({
                key: value.product_id,
                name: value.product_name,
                category: value.category,
                therapyArea: value.therapy_area,
            })
        ) : [];
        setData(rowData)
    }, [isLoaded])

    const navigateToAddProduct = () => {
        const { history } = props;
        history.push('/admin/add-product')
    }

    const navigateToEditProduct = (item) => {
        const { history } = props;
        history.push('/admin/edit-product/' + item.key)
    }

    const columns = [{
        title: 'Product Name',
        dataIndex: 'name',
        key: 'name',
        ellipsis: true,
        sorter: (a, b) => a.name.localeCompare(b.name),
        render: name => <span>{name}</span>
    }, {
        title: 'Category',
        dataIndex: 'category',
        key: 'category',
        filters: [
            { text: 'FDF', value: 'FDF' },
            { text: 'API', value: 'API' },
        ],
        filteredValue: filteredInfo.category,
        onFilter: (value, record) => record.category.includes(value),
    }, {
        title: 'Therapy Area',
        dataIndex: 'therapyArea',
        key: 'therapyArea',
    },
    {
        title: 'Action',
        key: 'operation',
        align: 'center',
        render: item => (
            <div style={{ display: 'inline-flex', alignItems: 'center' }}>
                <Button
                    type='link'
                    className='margin-0'
                    onClick={() => navigateToEditProduct(item)}
                    id={'edit-product-' + item.key}
                    disabled={!isUserAdmin}
                >
                    <Tooltip title='Edit Product'>
                        <EditTwoTone twoToneColor='#00AEEF' className='font-20' />
                    </Tooltip>
                </Button>
                <Button
                    type='link'
                    className='margin-0'
                    onClick={() => showDeleteProduct(item)}
                    id={'delete-product-' + item.key}
                    disabled={!isUserAdmin}
                >
                    <Tooltip title='Deactivate Product'>
                        <DeleteTwoTone twoToneColor='#00AEEF' className='font-20' />
                    </Tooltip>
                </Button>
            </div>
        ),
    }
    ];

    const showDeleteProduct = (item) => {
        showConfirm('Do you want to deactivate ' + item.name.toUpperCase() + ' ?', () => {
            dispatch(deleteAdminProduct(item.key, () => { dispatch(getAdminProductList()) }))
        })
    }

    return (
        <div>
            <Row>
                <Col span={24}>
                    <div className='gx-flex-row align-items-center'>
                        <h1 className='title gx-mb-4'><IntlMessages id='sidebar.productList' /></h1>
                        <Button id='add-product-btn' type='primary' className='gx-ml-auto' onClick={navigateToAddProduct} disabled={!isUserAdmin}>
                            <MedicineBoxOutlined /> <IntlMessages id='product.list.addProduct' />
                        </Button>
                    </div>
                </Col>
                <Col span={24}>
                    <Card className='mb-0'>
                        <Table
                            className='gx-table-responsive mpp-list-table'
                            columns={columns}
                            dataSource={data}
                            bordered
                        />
                    </Card>
                </Col>
            </Row>
        </div>
    )
}

export default ProductList
