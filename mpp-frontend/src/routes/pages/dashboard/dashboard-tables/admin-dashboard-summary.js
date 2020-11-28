import React from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { useState, useEffect } from 'react';
import { adminDashboardSummary, bulkReminderMail } from '../../../../appRedux/actions/AdminDashboard'
import { Table, Col, Button, Select, Tooltip } from 'antd';
import Widget from 'components/Widget/index';
import { BarChartOutlined, BellOutlined, FileSearchOutlined } from '@ant-design/icons';
import { getQuarter } from '../../../../helpers';

const { Option } = Select

export const AdminDashboardSummary = (props) => {

    const dispatch = useDispatch();
    const List = useSelector(state => state.adminDashboard.admin_dashboard_summary)
    const isLoaded = useSelector(state => state.adminDashboard.isAdminDashboardSummaryLoaded);

    const [type, setType] = useState('all_three_submitted');
    const [data, setData] = useState([]);
    const [columns, setColumns] = useState();
    const [showName, setShowName] = useState();

    useEffect(() => {
        dispatch(adminDashboardSummary(type))
        if (type === 'all_three_submitted') { setShowName('View Report'); }
        if (type === 'not_submitted') { setShowName('Reminder'); }
        if (type === 'saved_but_not_submitted') { setShowName('Reminder'); }
        if (type === 'submitted_not_approved') { setShowName('View Report'); }
    }, [type])

    useEffect(() => {
        if (isLoaded) {
            let columnData, rowData = []
            if (type === 'all_three_submitted') {
                let temp_id = 0
                rowData = List.length ? List.map(
                    value => {
                        return {
                            key: ++temp_id,
                            company_name: value.partner.company_name,
                            company_email: value.email,
                            [showName]: { 'partner_id': value.partner.partner_id }
                        }
                    }
                ) : [];
                columnData = [
                    {
                        title: 'Company Name',
                        dataIndex: 'company_name',
                        key: 'company_name',
                    },
                    {
                        title: 'Company Email',
                        dataIndex: 'company_email',
                        key: 'company_email',
                    },
                    {
                        title: showName,
                        dataIndex: showName,
                        key: showName,
                        render: (data) => {
                            return (

                                <>
                                    <div className='gx-flex-row gx-align-items-center font-20'>
                                        <Tooltip title='PDT'>
                                            <i onClick={() => navigateToPdt(data.partner_id)} className='icon icon-timeline color-blue' />
                                        </Tooltip>
                                        <Tooltip
                                            title='Filing Plans'
                                        >
                                            <FileSearchOutlined onClick={() => navigateToFilingPlans(data.partner_id)} className='font-20 color-blue mr-20 ml-20' />
                                        </Tooltip>
                                        <Tooltip title='Sales report'>
                                            <BarChartOutlined onClick={() => navigateToSalesReport(data.partner_id)} className='font-20 color-blue' />
                                        </Tooltip>
                                    </div>
                                </>
                            )
                        }
                    }
                ]
            }
            else if (type === 'submitted_not_approved') {
                let temp_id = 0
                rowData = List.length ? List.map(
                    value => {
                        return {
                            key: ++temp_id,
                            company_name: value.partner.company_name,
                            company_email: value.email,
                            [showName]: { 'partner_id': value.partner.partner_id, 'template_data': value.partner.template_data }
                        }
                    }
                ) : [];
                columnData = [
                    {
                        title: 'Company Name',
                        dataIndex: 'company_name',
                        key: 'company_name',
                    },
                    {
                        title: 'Company Email',
                        dataIndex: 'company_email',
                        key: 'company_email',
                    },
                    {
                        title: showName,
                        dataIndex: showName,
                        key: showName,
                        render: (data) => {
                            let showPDT = false
                            let showFilingPlan = false
                            let showSales = false
                            const template_data = data.template_data
                            template_data.map(obj => {

                                if (obj !== null) {
                                    if (obj.template_type === 'pdt' && obj.is_approved !== true) {
                                        showPDT = true
                                    }

                                    if (obj.template_type === 'filing plan' && obj.is_approved !== true) {
                                        showFilingPlan = true
                                    }

                                    if (obj.template_type === 'sales' && obj.is_approved !== true) {
                                        showSales = true
                                    }
                                }
                            })

                            return (
                                <>
                                    <div className='gx-flex-row gx-align-items-center font-20'>
                                        {
                                            showPDT ?
                                                <Tooltip title='PDT'>
                                                    <i onClick={() => navigateToPdt(data.partner_id)} className='icon icon-timeline color-blue mr-20' />
                                                </Tooltip> : null
                                        }
                                        {
                                            showFilingPlan ?
                                                <Tooltip
                                                    title='Filing Plans'
                                                >
                                                    <FileSearchOutlined onClick={() => navigateToFilingPlans(data.partner_id)} className='font-20 color-blue mr-20' />
                                                </Tooltip> : null
                                        }
                                        {
                                            showSales ?
                                                <Tooltip title='Sales report'>
                                                    <BarChartOutlined onClick={() => navigateToSalesReport(data.partner_id)} className='font-20 color-blue' />
                                                </Tooltip> : null
                                        }
                                    </div>
                                </>
                            )
                        }
                    }
                ]
            } else {
                let temp_id = 0
                rowData = List.length ? List.map(
                    value => {
                        return {
                            key: ++temp_id,
                            company_name: value.partner.company_name,
                            company_email: value.email
                        }
                    }
                ) : [];
                columnData = [
                    {
                        title: 'Company Name',
                        dataIndex: 'company_name',
                        key: 'company_name',
                    },
                    {
                        title: 'Company Email',
                        dataIndex: 'company_email',
                        key: 'company_email',
                    },
                ]
            }
            setData(rowData)
            setColumns(columnData)
        }
    }, [isLoaded])

    const navigateToPdt = (item) => {
        props.history.push('/admin/development-timeline/' + item)
    }

    const navigateToFilingPlans = (item) => {
        props.history.push('/admin/filing-plans/' + item)
    }

    const navigateToSalesReport = (item) => {
        props.history.push('/admin/sales-report/' + item)
    }

    const handleChange = (value) => {
        setType(value)
    }

    const sendEmail = () => {
        let temp = []
        if (type === 'not_submitted' || type === 'saved_but_not_submitted') {
            if (List.length > 0) {
                List.map(value => {
                    let not_submitted = []
                    const template_data = value.partner.template_data
                    if (template_data.length < 1) {
                        not_submitted = ['pdt', 'filing plan', 'sales']
                    } else {
                        template_data.map(obj => {
                            if (obj !== null) {
                                if (obj.report_status !== 'Submitted' && obj.report_status !== 'Approved') {
                                    not_submitted.push(obj.template_type)
                                }
                            }
                        })
                    }
                    temp.push({
                        'email_id': value.email,
                        'not_submitted': not_submitted
                    })
                })
            }
        }
        dispatch(bulkReminderMail({ 'data': temp }))
    }

    return (
        <Col xs={24} className='mb-30'>
            <Widget styleName='gx-order-history dashboard-min-height'
                title={
                    <div className='gx-flex-row gx-align-items-center'>
                        <h2 className='gx-text-capitalize line-height-27 mb-0'>
                            {getQuarter() ? 'Admin Dashboard Summary for ' + '(' + getQuarter() + ')' : 'Admin Dashboard Summary'}

                        </h2>
                        <Select className='gx-select-md ml-20' defaultValue='all_three_submitted' onChange={handleChange}>
                            <Option value='all_three_submitted'>All data submitted</Option>
                            <Option value='not_submitted'>Yet to submit data</Option>
                            <Option value='saved_but_not_submitted'>Saved but not submitted data</Option>
                            <Option value='submitted_not_approved'>Submitted but not approved</Option>
                        </Select>
                    </div>
                }
                extra={
                    <div className='gx-flex-row gx-align-items-center'>
                        {
                            type === 'not_submitted' || type === 'saved_but_not_submitted' ?
                                <Button
                                    type='primary'
                                    className='mb-0'
                                    onClick={sendEmail}
                                    disabled={!isLoaded}
                                >
                                    <BellOutlined /> Send Reminder
                                </Button>
                                : null
                        }
                    </div>
                }>
                <div
                    className='gx-table-responsive'
                >
                    <Table
                        className='gx-table-no-bordered mpp-list-table'
                        columns={columns}
                        dataSource={data}
                        bordered={false}
                        size='small'
                        loading={!isLoaded}
                    />
                </div>
            </Widget>
        </Col>
    )
}
