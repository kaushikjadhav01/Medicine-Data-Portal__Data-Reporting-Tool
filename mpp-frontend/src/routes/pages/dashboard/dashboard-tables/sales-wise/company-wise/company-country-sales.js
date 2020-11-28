import React from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { useState, useEffect } from 'react';
import { companyCountrySales } from '../../../../../../appRedux/actions/AdminDashboard'
import { Col } from 'antd';
import DashboardSalesCompanyWiseCountry from '../../../../../../components/dashboardSalesCompanyWiseCountry/DashboardSalesCompanyWiseCountry';

export const AdminDashboardCompanyCountrySales = (props) => {
    const dispatch = useDispatch();
    const [data, setData] = useState([]);

    const isLoaded = useSelector(state => state.adminDashboard.isCompanyCountrySalesLoaded);
    const List = useSelector(state => state.adminDashboard.company_country_sales)

    useEffect(() => {
        dispatch(companyCountrySales())
    }, [])

    useEffect(() => {
        let temp_id = 0
        let rowData = List.length ? List.map(
            value => ({
                key: ++temp_id,
                company_name: value.company_name,
                country_id: value.country_id,
                country_name: value.country_name,
                total_value: value.total_value
            })
        ) : [];
        setData(rowData)
    }, [isLoaded])

    const columns = [
        {
            title: 'Company',
            dataIndex: 'company_name',
            key: 'company_name',
            width: 150
        },
        {
            title: 'Country',
            dataIndex: 'country_name',
            key: 'country_name',
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
            <DashboardSalesCompanyWiseCountry loading={!isLoaded} data={data} columns={columns} />
        </Col>
    )
}
