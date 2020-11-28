import React from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { useState, useEffect } from 'react';
import { packPeriodSales } from '../../../../../appRedux/actions/AdminDashboard'
import { Col } from 'antd';
import DashboardSalesPricePerPack from 'components/dashboardSalesPricePerPack/DashboardSalesPricePerPack'

export const AdminDashboardPackPeriodSales = (props) => {
    const dispatch = useDispatch();
    const [data, setData] = useState([]);

    const isLoaded = useSelector(state => state.adminDashboard.isPackPeriodSalesLoaded);
    const List = useSelector(state => state.adminDashboard.pack_period_sales)
    const [period, setPeriod] = useState("period");

    
    useEffect(() => {
        dispatch(packPeriodSales(period))
    }, [period])

    useEffect(() => {
        let temp_id = 0
        let rowData = List.length ? List.map(
            value => ({
                key: ++temp_id,
                price_per_pack: Number(value.price_per_pack),
                year: value.year,
                month: value.month,
                quarter: value.quarter_name
            })
        ) : [];
        setData(rowData)
    }, [isLoaded])

    const columns = [
        {
            title: 'Price per pack',
            dataIndex: 'price_per_pack',
            key: 'price_per_pack',
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
            <DashboardSalesPricePerPack status={period} loading={!isLoaded} data={data} columns={columns} updateStatus={updateStatus} />
        </Col>
    )
}
