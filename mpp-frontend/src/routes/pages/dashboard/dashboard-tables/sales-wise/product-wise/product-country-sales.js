import React from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { useState, useEffect } from 'react';
import { productCountrySales } from '../../../../../../appRedux/actions/AdminDashboard'
import { Col } from 'antd';
import DashboardSalesProductWiseCountry from 'components/dashboardSalesProductWiseCountry/DashboardSalesProductWiseCountry'
export const AdminDashboardProductCountrySales = (props) => {
    const dispatch = useDispatch();
    const [data, setData] = useState([]);

    const isLoaded = useSelector(state => state.adminDashboard.isProductCountrySalesLoaded);
    const List = useSelector(state => state.adminDashboard.product_country_sales)

    useEffect(() => {
        dispatch(productCountrySales())
    }, [])

    useEffect(() => {
        let temp_id = 0
        let rowData = List.length ? List.map(
            value => ({
                key: ++temp_id,
                product_id: value.product_id,
                product_name: value.product_name,
                country_id: value.country_id,
                country_name: value.country_name,
                total_value: value.total_value
            })
        ) : [];
        setData(rowData)
    }, [isLoaded])

    const columns = [
        {
            title: 'Product Name',
            dataIndex: 'product_name',
            key: 'product_name',
            width:150
        },
        {
            title: 'Country',
            dataIndex: 'country_name',
            key: 'country_name',
            width:150
        },
        {
            title: 'Sales',
            dataIndex: 'total_value',
            key: 'total_value',
            width:150
        }
    ]

    return (
        <Col span={12} className='mb-30'>
            <DashboardSalesProductWiseCountry loading={!isLoaded} data={data} columns={columns} />
        </Col>
    )
}
