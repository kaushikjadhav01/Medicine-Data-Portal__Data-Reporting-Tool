import React from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { useState, useEffect } from 'react';
import { treatmentPeriodSales } from '../../../../../appRedux/actions/AdminDashboard'
import { Col } from 'antd';
import DashboardSalesPricePerTreatment from 'components/dashboardSalesPricePerTreatment/DashboardSalesPricePerTreatment'

export const AdminDashboardTreatmentPeriodSales = (props) => {
    const dispatch = useDispatch();
    const [data, setData] = useState([]);

    const isLoaded = useSelector(state => state.adminDashboard.isTreatmentPeriodSalesLoaded);
    const List = useSelector(state => state.adminDashboard.treatment_period_sales)
    const [period, setPeriod] = useState("period");

    const [showName, setShowName] = useState();
    const [varName, setVarName] = useState();

    useEffect(() => {
        dispatch(treatmentPeriodSales(period))
    }, [period])

    useEffect(() => {
        let temp_id = 0
        let rowData = List.length ? List.map(
            value => ({
                key: ++temp_id,
                price_per_treatment: Number(value.price_per_treatment),
                year: value.year,
                month: value.month,
                quarter: value.quarter_name,
            })
        ) : [];
        setData(rowData)
    }, [isLoaded])

    const columns = [
        {
            title: 'Price per treatment',
            dataIndex: 'price_per_treatment',
            key: 'price_per_treatment',
            fixed: 'left',
            width: 150,
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
    ]
    const updateStatus = (value) => {
        setPeriod(value)
    }
    return (
        <Col span={12} className='mb-30'>
            <DashboardSalesPricePerTreatment status={period} loading={!isLoaded} data={data} columns={columns} updateStatus={updateStatus} />
        </Col>
    )
}
