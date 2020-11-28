import React from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { useState, useEffect } from 'react';
import { countryCompanySales } from '../../../../../../appRedux/actions/AdminDashboard'
import { Col } from 'antd';
import DashboardSalesCountryWiseCompany from 'components/dashboardSalesCountryWiseCompany/DashboardSalesCountryWiseCompany'

export const AdminDashboardCountryCompanySales = (props) => {
    const dispatch = useDispatch();
    const [data, setData] = useState([]);

    const isLoaded = useSelector(state => state.adminDashboard.isCountryCompanySalesLoaded);
    const List = useSelector(state => state.adminDashboard.country_company_sales)

    useEffect(() => {
        dispatch(countryCompanySales())
    }, [])

    useEffect(() => {
        let temp_id = 0
        let rowData = List.length ? List.map(
            value => ({
                key: ++temp_id,
                country_id: value.country_id,
                country_name: value.country_name,
                company_name: value.company_name,
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
            width: 150
        },
        {
            title: 'Company',
            dataIndex: 'company_name',
            key: 'company_name',
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
            <DashboardSalesCountryWiseCompany loading={!isLoaded} data={data} columns={columns} />
        </Col>
    )
}
