import React from 'react'
import { Row, Tabs } from 'antd';
import {
    AdminDashboardProjectCount,
    AdminDashboardProductCompanyCount,
    AdminDashboardProductCountryCount,
    AdminDashboardCompanyCount,
    AdminDashboardCountryProduct,
    AdminDashboardProductCompanySales,
    AdminDashboardProductPeriodSales,
    AdminDashboardProductCountrySales,
    AdminDashboardCompanyProductSales,
    AdminDashboardCompanyPeriodSales,
    AdminDashboardCompanyCountrySales,
    AdminDashboardCountryProductSales,
    AdminDashboardCountryPeriodSales,
    AdminDashboardCountryCompanySales,
    AdminDashboardPeriodProductSales,
    AdminDashboardPeriodCountrySales,
    AdminDashboardPeriodCompanySales,
    AdminDashboardPackPeriodSales,
    AdminDashboardTreatmentPeriodSales,
    AdminDashboardSummary

} from './dashboard-tables'

import './admin-dashboard.css'

const { TabPane } = Tabs;

const AdminDashboard = (props) => {

    return (
        <>
            <div className='gx-flex-row gx-align-items-center gx-justify-content-between'>
                <h1 className='title gx-mb-4'>Dashboard</h1>
            </div>
            <Tabs
                tabPosition='top'
                type='card'
            >
                <TabPane tab='Summary' key='1'>
                    <Row>
                        <AdminDashboardSummary history={props.history} />
                    </Row>
                </TabPane>
                <TabPane tab='Product / Project' key='2'>
                    <Row>
                        <AdminDashboardProjectCount />
                        <AdminDashboardProductCompanyCount />
                        <AdminDashboardCompanyCount />
                    </Row>
                </TabPane>

                <TabPane tab='Country Filings' key='3'>
                    <Row>
                        <AdminDashboardProductCountryCount />
                        <AdminDashboardCountryProduct />
                    </Row>
                </TabPane>

                <TabPane tab='Sales by Product' key='4'>
                    <Row>
                        <AdminDashboardProductCompanySales />
                        <AdminDashboardProductPeriodSales />
                        <AdminDashboardProductCountrySales />
                    </Row>
                </TabPane>
                <TabPane tab='Sales by Company' key='5'>
                    <Row>
                        <AdminDashboardCompanyProductSales />
                        <AdminDashboardCompanyPeriodSales />
                        <AdminDashboardCompanyCountrySales />
                    </Row>
                </TabPane>
                <TabPane tab='Sales by Country' key='6'>
                    <Row>
                        <AdminDashboardCountryProductSales />
                        <AdminDashboardCountryPeriodSales />
                        <AdminDashboardCountryCompanySales />
                    </Row>
                </TabPane>
                <TabPane tab='Sales over Time' key='7'>
                    <Row>
                        <AdminDashboardPeriodProductSales />
                        <AdminDashboardPeriodCountrySales />
                        <AdminDashboardPeriodCompanySales />
                    </Row>
                </TabPane>
                <TabPane tab='Price' key='8'>
                    <Row>
                        <AdminDashboardPackPeriodSales />
                        <AdminDashboardTreatmentPeriodSales />
                    </Row>
                </TabPane>
            </Tabs>
        </>
    )
}


export default AdminDashboard