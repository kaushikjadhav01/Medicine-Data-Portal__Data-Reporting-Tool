import React, { useEffect, useState, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import IntlMessages from 'util/IntlMessages';
import { Card, Table, Row, Col, Button, Checkbox, Space, Input, Tag, Tooltip } from 'antd';
import { SearchOutlined, InfoCircleTwoTone, EyeTwoTone, BellTwoTone, CheckCircleTwoTone, CloseCircleTwoTone, EditTwoTone, DeleteTwoTone, UsergroupAddOutlined } from '@ant-design/icons';
import { adminSendReminder, deleteAdminSinglePartner, getAdminPartnerList } from '../../../appRedux/actions/AdminPartner';
import { findIndex, has } from 'lodash';
import moment from 'moment';

import './partner-list.css'
import { showConfirm, getRole } from '../../../helpers';

const PartnerList = (props) => {

    const isLoaded = useSelector(state => state.adminPartner.isLoaded);
    const adminPartnerList = useSelector(state => state.adminPartner.partnerList);
    const dispatch = useDispatch();
    const [data, setData] = useState([]);
    const [searchedColumn, setSearchedColumn] = useState('');
    const searchInput = useRef();
    const [isUserAdmin, setIsUserAdmin] = useState(false);

    useEffect(() => {
        setIsUserAdmin(() => {
            return (getRole() === 'ADMIN')
        })
        dispatch(getAdminPartnerList());
    }, [])

    useEffect(() => {
        if (isLoaded) {
            let rowData = adminPartnerList.length ? adminPartnerList.filter(
                value => value.partner
            ).map(
                value => ({
                    key: value.partner.partner_id,
                    name: value.partner.company_name,
                    email: value.email,
                    active_products: value.partner.active_products,
                    pdt: getTemplateData(value.partner.template_data, 'pdt', value.partner.partner_id),
                    filing_plans: getTemplateData(value.partner.template_data, 'filing plan', value.partner.partner_id),
                    sales_report: getTemplateData(value.partner.template_data, 'sales', value.partner.partner_id),
                })
            ) : [];
            setData(rowData)
        }
    }, [isLoaded])

    const getTemplateData = (templateList, type, partner_id) => {
        let templateData = templateList[findIndex(templateList, { template_type: type })];
        return templateData ? { ...templateData, partner_id } : { partner_id }
    }

    const navigateToAddPartner = () => {
        const { history } = props;
        history.push('/admin/add-partner')
    }

    const navigateToContent = (item) => {
        props.history.push('/admin/edit-partner/' + item.key)
    }

    const navigateToPdt = (item) => {
        props.history.push('/admin/development-timeline/' + item)
    }

    const navigateToFilingPlans = (item) => {
        props.history.push('/admin/filing-plans/' + item)
    }

    const navigateToSalesReport = (item) => {
        props.history.push('/admin/sales-report/' + item)
    }

    const handleSearch = (selectedKeys, confirm, dataIndex) => {
        confirm();
        setSearchedColumn(dataIndex);
    };

    const handleReset = clearFilters => {
        clearFilters();
    };

    const getColumnSearchProps = dataIndex => ({
        filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters }) => (
            <div style={{ padding: 8 }}>
                <Input
                    ref={searchInput}
                    placeholder={`Search ${dataIndex}`}
                    value={selectedKeys[0]}
                    onChange={e => setSelectedKeys(e.target.value ? [e.target.value] : [])}
                    onPressEnter={() => handleSearch(selectedKeys, confirm, dataIndex)}
                    style={{ width: 188, marginBottom: 8, display: 'block' }}
                />
                <Space>
                    <Button
                        type='primary'
                        onClick={() => handleSearch(selectedKeys, confirm, dataIndex)}
                        icon={<SearchOutlined />}
                        size='small'
                        style={{ width: 90 }}
                    >
                        Search
                    </Button>
                    <Button onClick={() => handleReset(clearFilters)} size='small' style={{ width: 90 }}>
                        Reset
                    </Button>
                </Space>
            </div>
        ),
        filterIcon: filtered => <SearchOutlined style={{ color: filtered ? '#1890ff' : undefined }} />,
        onFilter: (value, record) =>
            record[dataIndex]
                ? record[dataIndex].toString().toLowerCase().includes(value.toLowerCase())
                : '',
        onFilterDropdownVisibleChange: visible => {
            if (visible) {
                // setTimeout(() => this.searchInput.select(), 100);
            }
        },
        render: text =>
            searchedColumn === dataIndex ? (
                text
            ) : (
                    text
                ),
    });

    const setColumns = () => {
        let columns = [{
            title: 'Company Name',
            dataIndex: 'name',
            key: 'name',
            ...getColumnSearchProps('name'),
            sorter: (a, b) => a.name.localeCompare(b.name),
            width: 200,
            render: name => <span className='gx-text-capitalize'>{name}</span>
        }, {
            title: 'Email',
            dataIndex: 'email',
            key: 'email',
            width: 140
        }, {
            title: 'Active Products',
            dataIndex: 'active_products',
            key: 'active_products',
            width: 240,
            render: products => (
                <>
                    {products.map(
                        value => <Tag key={value.product_id}>{value.product_name}</Tag>
                    )}
                </>
            )
        }, {
            title: (<h5 className='mb-0'>Product Development Timeline</h5>),
            dataIndex: 'pdt',
            key: 'pdt',
            align: 'center',
            width: 140,
            render: (data) => renderTemplateData(
                data,
                () => navigateToPdt(data.partner_id),
                () => dispatch(adminSendReminder(data.partner_id, 'PDT')),
                'pdt'
            )
        }, {
            title: (<h5 className='mb-0'>Filing Plans</h5>),
            dataIndex: 'filing_plans',
            key: 'filing_plans',
            align: 'center',
            width: 140,
            render: (data) => renderTemplateData(
                data,
                () => navigateToFilingPlans(data.partner_id),
                () => dispatch(adminSendReminder(data.partner_id, 'Filing Plans')),
                'filing-plans'
            )
        }, {
            title: (<h5 className='mb-0'>Sales Report</h5>),
            dataIndex: 'sales_report',
            key: 'sales_report',
            align: 'center',
            width: 140,
            render: (data) => renderTemplateData(
                data,
                () => navigateToSalesReport(data.partner_id),
                () => dispatch(adminSendReminder(data.partner_id, 'Sales')),
                'sales'
            ),
        }, {
            title: 'Action',
            key: 'operation',
            align: 'center',
            width: 140,
            render: item => (
                <div style={{ display: 'inline-flex', alignItems: 'center' }}>
                    <Button
                        type='link'
                        className='margin-0'
                        onClick={() => navigateToContent(item)}
                        id={'edit-partner-' + item.key}
                        disabled={!isUserAdmin}
                    >
                        <Tooltip title='Edit Partner'>
                            <EditTwoTone twoToneColor='#00AEEF' className='font-20' />
                        </Tooltip>
                    </Button>
                    <Button
                        type='link'
                        className='margin-0'
                        onClick={() => showDeletePartner(item)}
                        id={'delete-partner-' + item.key}
                        disabled={!isUserAdmin}
                    >
                        <Tooltip title='Deactivate Partner'>
                            <DeleteTwoTone twoToneColor='#00AEEF' className='font-20' />
                        </Tooltip>
                    </Button>
                </div>
            ),
        }];
        return columns
    }

    const renderTemplateData = (data, viewReport, sendReminder, templateName) => {
        if (has(data, 'is_read')) {
            const { quarter_name, is_approved, submission_time, updated_at, report_status, partner_id } = data;
            return (
                <div className='gx-flex-row gx-align-items-center gx-justify-content-center font-20'>
                    <Tooltip title={'For Quarter: ' + quarter_name}>
                        <InfoCircleTwoTone twoToneColor='#00AEEF' />
                    </Tooltip>
                    <Tooltip
                        title={'Report ' + report_status + ' on ' + moment(report_status === 'Submitted' ? submission_time : updated_at).format('Do MMM YYYY, hh:mm A')}
                    >
                        {
                            is_approved === null ?
                                <Checkbox className='ml-20' checked={false}></Checkbox> :
                                is_approved ?
                                    <CheckCircleTwoTone className='ml-20' twoToneColor='#52c41a' /> :
                                    <CloseCircleTwoTone className='ml-20' twoToneColor='#f44336' />
                        }
                    </Tooltip>
                    <Tooltip title='View report'>
                        <EyeTwoTone
                            className='ml-20'
                            twoToneColor='#00AEEF'
                            onClick={() => viewReport()}
                            id={'view-' + templateName + '-' + partner_id}
                        />
                    </Tooltip>
                </div>
            )
        } else {
            return (
                <div className='gx-flex-row gx-align-items-center gx-justify-content-center font-20'>
                    <Tooltip title='Send Reminder'>
                        <BellTwoTone
                            twoToneColor='#00AEEF'
                            onClick={isUserAdmin ? () => sendReminder() : ''}
                            id={'reminder-' + templateName + '-' + data.partner_id}
                        />
                    </Tooltip>
                </div>
            )
        }
    }

    const showDeletePartner = (item) => {
        showConfirm('Do you want to deactivate ' + item.name.toUpperCase() + ' ?', () => {
            dispatch(deleteAdminSinglePartner(item.key, () => { dispatch(getAdminPartnerList()) }))
        })
    }

    return (
        <div>
            <Row>
                <Col span={24}>
                    <div className='gx-flex-row align-items-center'>
                        <h1 className='title gx-mb-4'><IntlMessages id='sidebar.partnerList' /></h1>
                        <Button id='partner-list-add-partner' onClick={navigateToAddPartner} type='primary' className='gx-ml-auto' disabled={!isUserAdmin}>
                            <UsergroupAddOutlined /> <IntlMessages id='partner.list.addPartner' />
                        </Button> 
                    </div>
                </Col>
                <Col span={24}>
                    <Card className='mb-0'>
                        <Table
                            className='gx-table-responsive mpp-list-table'
                            columns={setColumns()}
                            dataSource={data}
                            bordered
                            loading={!isLoaded}
                        />
                    </Card>
                </Col>
            </Row>
        </div>
    )
}

export default PartnerList