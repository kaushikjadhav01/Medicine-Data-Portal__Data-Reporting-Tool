import React from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { useState, useEffect } from 'react';
import { productCountryCount } from '../../../../../appRedux/actions/AdminDashboard'
import { Col } from 'antd';
import DashboardProductWiseCountry from 'components/dashboardProductWiseCountry/DashboardProductWiseCountry'

export const AdminDashboardProductCountryCount = (props) => {
    const dispatch = useDispatch();
    const [data, setData] = useState([]);
    const [columns, setColumns] = useState([]);

    const isProductCountryCountLoaded = useSelector(state => state.adminDashboard.isProductCountryCountLoaded);
    const productCountryList = useSelector(state => state.adminDashboard.product_country_count)
    const futureQuarters = useSelector(state => state.adminDashboard.future_quarters)

    const [status, setStatus] = useState('Filed');

    useEffect(() => {
        dispatch(productCountryCount(status))
    }, [status])

    useEffect(() => {
        if (status === 'Future-Quarters') {
            let rowData = productCountryList.length ? productCountryList.map(
                value => ({
                    key: value.product_id,
                    product_name: value.product_name,
                    [futureQuarters[0]]: value[futureQuarters[0]],
                    [futureQuarters[1]]: value[futureQuarters[1]],
                    [futureQuarters[2]]: value[futureQuarters[2]],
                    [futureQuarters[3]]: value[futureQuarters[3]]
                })
            ) : [];

            const columns = [
                {
                    title: 'Product Name',
                    dataIndex: 'product_name',
                    key: 'product_name',
                    width: 150
                },
                {
                    title: futureQuarters[0],
                    dataIndex: futureQuarters[0],
                    key: futureQuarters[0],
                    width: 80
                },
                {
                    title: futureQuarters[1],
                    dataIndex: futureQuarters[1],
                    key: futureQuarters[1],
                    width: 80
                },
                {
                    title: futureQuarters[2],
                    dataIndex: futureQuarters[2],
                    key: futureQuarters[2],
                    width: 80
                },
                {
                    title: futureQuarters[3],
                    dataIndex: futureQuarters[3],
                    key: futureQuarters[3],
                    width: 80
                },
            ]
            setData(rowData)
            setColumns(columns)
        } else {
            let rowData = productCountryList.length ? productCountryList.map(
                value => ({
                    key: value.product_id,
                    product_name: value.product_name,
                    count: value.count
                })
            ) : [];
            const columns = [
                {
                    title: 'Product Name',
                    dataIndex: 'product_name',
                    key: 'product_name',
                    width: 150
                },
                {
                    title: status,
                    dataIndex: 'count',
                    key: 'count',
                    width: 80
                },
            ]
            setData(rowData)
            setColumns(columns)
        }
    }, [isProductCountryCountLoaded])

    const updateStatus = (value) => {
        setStatus(value)
    }
    return (
        <Col span={12} className='mb-30'>
            <DashboardProductWiseCountry status={status} data={data} columns={columns} updateStatus={updateStatus} loading={!isProductCountryCountLoaded} />
        </Col>
    )
}
