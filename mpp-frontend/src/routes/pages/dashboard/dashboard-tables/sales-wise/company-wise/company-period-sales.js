import React from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { useState, useEffect } from 'react';
import { companyPeriodSales } from '../../../../../../appRedux/actions/AdminDashboard'
import { Col } from 'antd';
import DashboardSalesCompanyWisePeriod from '../../../../../../components/dashboardSalesCompanyWisePeriod/DashboardSalesCompanyWisePeriod';

export const AdminDashboardCompanyPeriodSales = (props) => {
    const dispatch = useDispatch();
    const [data, setData] = useState([]);

    const isLoaded = useSelector(state => state.adminDashboard.isCompanyPeriodSalesLoaded);
    const List = useSelector(state => state.adminDashboard.company_period_sales)
    const [period, setPeriod] = useState('period');

    useEffect(() => {
        dispatch(companyPeriodSales(period))
    }, [period])

    useEffect(() => {
        let temp_id = 0
        let rowData = List.length ? List.map(
            value => ({
                key: ++temp_id,
                company_name: value.company_name,
                year: value.year,
                month: value.month,
                quarter: value.quarter_name,
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
        <Col span={12} className='mb-30'>
            <DashboardSalesCompanyWisePeriod status={period} data={data} loading={!isLoaded} columns={columns} updateStatus={updateStatus} />
        </Col>

    )
}
