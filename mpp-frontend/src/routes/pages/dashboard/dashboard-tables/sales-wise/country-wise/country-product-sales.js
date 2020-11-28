import React from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { useState, useEffect } from 'react';
import { countryProductSales } from '../../../../../../appRedux/actions/AdminDashboard'
import { Col } from 'antd';
import DashboardSalesCountryWiseProduct from '../../../../../../components/dashboardSalesCountryWiseProduct/DashboardSalesCountryWiseProduct';

export const AdminDashboardCountryProductSales = (props) => {
    const dispatch = useDispatch();
    const [data, setData] = useState([]);

    const isLoaded = useSelector(state => state.adminDashboard.isCountryProductSalesLoaded);
    const List = useSelector(state => state.adminDashboard.country_product_sales)

    useEffect(() => {
        dispatch(countryProductSales())
    }, [])

    useEffect(() => {
        let temp_id = 0
        let rowData = List.length ? List.map(
            value => ({
                key: ++temp_id,
                country_id: value.country_id,
                country_name: value.country_name,
                product_id: value.product_id,
                product_name: value.product_name,
                total_value: value.total_value
            })
        ) : [];
        setData(rowData)
    }, [isLoaded])

    const columns = [
        {
            title: 'Country',
            dataIndex: 'country_name',
            key: 'country_name',
        },
        {
            title: 'Product Name',
            dataIndex: 'product_name',
            key: 'product_name',
        },
        {
            title: 'Sales',
            dataIndex: 'total_value',
            key: 'total_value',
        }
    ]

    return (

        <Col span={12} className='mb-30'>
            <DashboardSalesCountryWiseProduct loading={!isLoaded} data={data} columns={columns} />
        </Col>
    )
}
