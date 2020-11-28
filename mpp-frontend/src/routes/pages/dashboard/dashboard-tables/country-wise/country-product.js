import React from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { useState, useEffect } from 'react';
import { countryProduct } from '../../../../../appRedux/actions/AdminDashboard'
import { Col } from 'antd';
import DashboardCountryWiseProduct from 'components/dashboardCountryWiseProduct/DashboardCountryWiseProduct'

export const AdminDashboardCountryProduct = (props) => {
    const dispatch = useDispatch();
    const [data, setData] = useState([]);

    const isLoaded = useSelector(state => state.adminDashboard.isCountryProductLoaded);
    const List = useSelector(state => state.adminDashboard.country_product_count)

    const [type, setType] = useState('Filed');
    const [columns, setColumns] = useState([]);

    useEffect(() => {
        dispatch(countryProduct(type))
    }, [type])

    useEffect(() => {
        if (type === 'Filed' || type === 'Registered') {
            let temp_id = 0
            let rowData = List.length ? List.map(
                value => ({
                    key: ++temp_id,
                    country_name: value.country_name,
                    product_id: value.product_id,
                    product_name: value.product_name,
                    no_of_partners: value.no_of_partners
                })
            ) : [];
            setData(rowData)
            const columns = [
                {
                    title: 'Country Name',
                    dataIndex: 'country_name',
                    key: 'country_name',
                    fixed: 'left',
                    width: 150
                },
                {
                    title: 'Product Name',
                    dataIndex: 'product_name',
                    key: 'product_name',
                    width: 100
                },
                {
                    title: 'Number of Partners',
                    dataIndex: 'no_of_partners',
                    key: 'no_of_partners',
                    width: 100
                }
            ]
            setColumns(columns)
        } else if (type === 'status') {
            let temp_id = 0
            let rowData = List.length ? List.map(
                value => ({
                    key: ++temp_id,
                    country_name: value.country_name,
                    product_id: value.product_id,
                    product_name: value.product_name,
                    status: value.status
                })
            ) : [];
            setData(rowData)
            const columns = [
                {
                    title: 'Country Name',
                    dataIndex: 'country_name',
                    key: 'country_name',
                    fixed: 'left',
                    width: 150
                },
                {
                    title: 'Product Name',
                    dataIndex: 'product_name',
                    key: 'product_name',
                    width: 100
                },
                {
                    title: 'Status',
                    dataIndex: 'status',
                    key: 'status',
                    width: 100
                }
            ]
            setColumns(columns)
        }
    }, [isLoaded])

    const updateStatus = (value) => {
        setType(value)
    }

    return (
        <Col span={12} className='mb-30'>
            <DashboardCountryWiseProduct
                loading={!isLoaded}
                data={data}
                columns={columns}
                updateStatus={updateStatus}
                status={type}
            />
        </Col>
    )
}
