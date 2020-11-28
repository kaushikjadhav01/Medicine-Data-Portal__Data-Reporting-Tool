import React from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { useState, useEffect } from 'react';
import { companyCount } from '../../../../../appRedux/actions/AdminDashboard'
import { Col } from 'antd';
import DashboardCompanyWiseStatus from 'components/dashboardCompanyWiseStatus/DashboardCompanyWiseStatus'

export const AdminDashboardCompanyCount = (props) => {
    const dispatch = useDispatch();
    const [data, setData] = useState([]);

    const isCompanyCountLoaded = useSelector(state => state.adminDashboard.isCompanyCountLoaded);
    const comapnyCountList = useSelector(state => state.adminDashboard.company_count)

    useEffect(() => {
        dispatch(companyCount())
    }, [])

    useEffect(() => {
        let rowData = comapnyCountList.length ? comapnyCountList.map(
            value => ({
                key: value.partner_id,
                company_name: value.company_name,
                UNDER_DEVELOPMENT: value.UNDER_DEVELOPMENT,
                DROPPED: value.DROPPED,
                ON_HOLD: value.ON_HOLD,
                FILED: value.FILED,
                APPROVED: value.APPROVED
            })
        ) : [];
        setData(rowData)
    }, [isCompanyCountLoaded])

    const columns = [
        {
            title: 'Partner Name/ Company Name',
            dataIndex: 'company_name',
            key: 'company_name',
            fixed: 'left',
            width: 150
        },
        {
            title: 'DEVELOPING',
            dataIndex: 'UNDER_DEVELOPMENT',
            key: 'UNDER_DEVELOPMENT',
            width: 100
        },
        {
            title: 'DROPPED',
            dataIndex: 'DROPPED',
            key: 'DROPPED',
            width: 100
        },
        {
            title: 'ON_HOLD',
            dataIndex: 'ON_HOLD',
            key: 'ON_HOLD',
            width: 100
        },
        {
            title: 'FILED with USFDA/ WHO-PQ',
            dataIndex: 'FILED',
            key: 'FILED',
            width: 100
        },
        {
            title: 'Approval from USFDA/ WHO-PQ',
            dataIndex: 'APPROVED',
            key: 'APPROVED',
            width: 100
        },
    ]

    return (
        <Col span={12} className='mb-30'>
            <DashboardCompanyWiseStatus data={data} columns={columns} loading={!isCompanyCountLoaded} />
        </Col>

    )
}
