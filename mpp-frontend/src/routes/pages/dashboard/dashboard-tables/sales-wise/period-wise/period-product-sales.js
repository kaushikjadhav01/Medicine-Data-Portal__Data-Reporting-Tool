import React from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { useState, useEffect } from 'react';
import { productPeriodSales } from '../../../../../../appRedux/actions/AdminDashboard'
import { Col } from 'antd';
import DashboardSalesPeriodWiseProduct from '../../../../../../components/dashboardSalesPeriodWiseProduct/DashboardSalesPeriodWiseProduct';

export const AdminDashboardPeriodProductSales = (props) => {
    const dispatch = useDispatch();
    const [data, setData] = useState([]);

    const isProductPeriodSalesLoaded = useSelector(state => state.adminDashboard.isProductPeriodSalesLoaded);
    const productPeriodSalesList = useSelector(state => state.adminDashboard.product_period_sales)
    const [period, setPeriod] = useState("period");

    useEffect(() => {
        dispatch(productPeriodSales(period))
    }, [period])

    useEffect(() => {
        let temp_id = 0
        let rowData = productPeriodSalesList.length ? productPeriodSalesList.map(
            value => ({
                key: ++temp_id,
                product_name: value.product_name,
                year: value.year,
                month: value.month,
                quarter: value.quarter_name,
                total_value: value.total_value
            })
        ) : [];
        setData(rowData)
    }, [isProductPeriodSalesLoaded])

    const columns = [
        {
            title: 'Product Name',
            dataIndex: 'product_name',
            key: 'product_name',
            fixed: 'left',
            width: 150
        },
        {
            title: 'Year',
            dataIndex: 'year',
            key: 'year',
            width: 150
        },
        {
            title: 'Month',
            dataIndex: 'month',
            key: 'month',
            width: 150
        },
        {
            title: 'Quarter',
            dataIndex: 'quarter',
            key: 'quarter',
            width: 150
        },
        {
            title: 'Sales',
            dataIndex: 'total_value',
            key: 'total_value',
            width: 150
        }
    ]
    const updateStatus = (value) => {
        setPeriod(value)
    }
    return (
        <Col span={12}  className='mb-30'>
            <DashboardSalesPeriodWiseProduct status={period} loading={!isProductPeriodSalesLoaded} data={data} columns={columns} updateStatus={updateStatus} />
        </Col>
    )
}
