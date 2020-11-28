import React from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { useState, useEffect } from 'react';
import { companyProductSales } from '../../../../../../appRedux/actions/AdminDashboard'
import { Col } from 'antd';
import DashboardSalesCompanyWiseProduct from '../../../../../../components/dashboardSalesCompanyWiseProduct/DashboardCompanyWiseProduct';

export const AdminDashboardCompanyProductSales = (props) => {
    const dispatch = useDispatch();
    const [data, setData] = useState([]);

    const isLoaded = useSelector(state => state.adminDashboard.isCompanyProductSalesLoaded);
    const List = useSelector(state => state.adminDashboard.company_product_sales)

    useEffect(() => {
        dispatch(companyProductSales())
    }, [])

    useEffect(() => {
        let temp_id = 0
        let rowData = List.length ? List.map(
            value => ({
                key: ++temp_id,
                company_id: value.company_id,
                company_name: value.company_name,
                product_id: value.product_id,
                product_name: value.product_name,
                total_value: value.total_value
            })
        ) : [];
        setData(rowData)
    }, [isLoaded])

    const columns = [
        {
            title: 'Company Name',
            dataIndex: 'company_name',
            key: 'company_name',
            width: 150
        },
        {
            title: 'Product Name',
            dataIndex: 'product_name',
            key: 'product_name',
            width: 150
        },
        {
            title: 'Sales',
            dataIndex: 'total_value',
            key: 'total_value',
            width: 150
        }
    ]

    return (
        <Col span={12} className='mb-30'>
            <DashboardSalesCompanyWiseProduct loading={!isLoaded} data={data} columns={columns} />
        </Col>
    )
}
