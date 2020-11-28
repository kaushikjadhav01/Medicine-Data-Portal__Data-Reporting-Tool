import React from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { useState, useEffect } from 'react';
import { productCompanyCount } from '../../../../../appRedux/actions/AdminDashboard'
import { Col } from 'antd';
import DashboardProductWiseCompany from '../../../../../components/dashboardProductWiseCompany/DashboardProductWiseCompany';
export const AdminDashboardProductCompanyCount = (props) => {
    const dispatch = useDispatch();
    const [data, setData] = useState([]);

    const isProductCompanyCountLoaded = useSelector(state => state.adminDashboard.isProductCompanyCountLoaded);
    const productComapnyCountList = useSelector(state => state.adminDashboard.product_company_count)

    useEffect(() => {
        dispatch(productCompanyCount())
    }, [])

    useEffect(() => {
        let rowData = productComapnyCountList.length ? productComapnyCountList.map(
            value => ({
                key: value.product_id,
                product_name: value.product_name,
                UNDER_DEVELOPMENT: value.UNDER_DEVELOPMENT,
                DROPPED: value.DROPPED,
                ON_HOLD: value.ON_HOLD,
                FILED: value.FILED,
                APPROVED: value.APPROVED
            })
        ) : [];
        setData(rowData)
    }, [isProductCompanyCountLoaded])

    return (
        <Col span={12}>
            <DashboardProductWiseCompany loading={!isProductCompanyCountLoaded} data={data} />
        </Col>

    )
}
