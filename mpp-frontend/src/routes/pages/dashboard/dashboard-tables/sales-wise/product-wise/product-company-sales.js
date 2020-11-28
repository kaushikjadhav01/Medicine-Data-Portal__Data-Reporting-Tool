import React from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { useState, useEffect } from 'react';
import { productCompanySales } from '../../../../../../appRedux/actions/AdminDashboard'
import { Col } from 'antd';
import DashboardSalesProductWiseCompany from 'components/dashboardSalesProductWiseCompany/DashboardSalesProductWiseCompany'
export const AdminDashboardProductCompanySales = (props) => {
    const dispatch = useDispatch();
    const [data, setData] = useState([]);

    const isProductCompanySalesLoaded = useSelector(state => state.adminDashboard.isProductCompanySalesLoaded);
    const productCompanySalesList = useSelector(state => state.adminDashboard.product_company_sales)

    useEffect(() => {
        dispatch(productCompanySales())
    }, [])

    useEffect(() => {
        let temp_id = 0
        let rowData = productCompanySalesList.length ? productCompanySalesList.map(
            value => ({
                key: ++temp_id,
                product_id: value.product_id,
                product_name: value.product_name,
                company_id: value.company_id,
                company_name: value.company_name,
                total_value: value.total_value
            })
        ) : [];
        setData(rowData)
    }, [isProductCompanySalesLoaded])

    const columns = [
        {
            title: 'Product Name',
            dataIndex: 'product_name',
            key: 'product_name',
            width: 150
        },
        {
            title: 'Company Name',
            dataIndex: 'company_name',
            key: 'company_name',
            width: 150
        },
        {
            title: 'Sales = SUM(pack_size*quantity)',
            dataIndex: 'total_value',
            key: 'total_value',
            width: 150
        }
    ]

    return (
        <Col span={12}  className='mb-30'>
            <DashboardSalesProductWiseCompany loading={!isProductCompanySalesLoaded} data={data} columns={columns} />
        </Col>
    )
}
