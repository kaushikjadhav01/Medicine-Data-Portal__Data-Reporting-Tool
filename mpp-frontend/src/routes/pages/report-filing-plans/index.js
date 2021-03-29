import React, { useEffect, useState } from 'react';
import IntlMessages from 'util/IntlMessages';
import { Card, Table, Row, Col, Button, Tooltip } from 'antd';
import { DownloadOutlined } from '@ant-design/icons';
import { useDispatch, useSelector } from 'react-redux';
import { downloadFilingReport, getAdminFilingPlansReport } from '../../../appRedux/actions/FilingPlans';

const FilingPlansReport = (props) => {

    const { isLoaded, plansReportData } = useSelector(({ filingPlans }) => filingPlans)
    const dispatch = useDispatch();
    const [rows, setRows] = useState([]);
    const [columns, setColumns] = useState([]);
    const [total, setTotal] = useState(0);
    const [requestObj, setRequestObj] = useState({ page_number: 1, page_size: 50 });

    const [quarterDropdown, setQuarterDropdown] = useState([])
    const [quarterDropdownCurrent, setQuarterDropdownCurrent] = useState("Loading...")
    
    useEffect(() => {
        if(quarterDropdownCurrent === "Loading..."){
            dispatch(getAdminFilingPlansReport(requestObj));   
        }
        else{
            requestObj['quarter']=quarterDropdownCurrent
            dispatch(getAdminFilingPlansReport(requestObj));
        }
    }, [quarterDropdownCurrent])
    
    useEffect(() => {
        dispatch(getAdminFilingPlansReport(requestObj));
    }, [requestObj])

    useEffect(() => {
        if (isLoaded) {
            const { product_order, rows, total_rows,quarter_dropdown, filter_options } = plansReportData;
            const { partner_filter, country_filter, status_filter } = filter_options;


            let dataCols = [{
                title: 'Company Name',
                dataIndex: 'company_name',
                key: 'company_name',
                fixed: 'left',
                render: name => <div className='text-capitalize'>{name}</div>,
                width: 150,
                filters: partner_filter.map((partner) => {
                    return {text : partner.company_name.replace(/(^\w{1})|(\s{1}\w{1})/g, match => match.toUpperCase()), value : partner.partner_id}
                })
            }, {
                title: 'Country',
                dataIndex: 'country',
                key: 'country',
                fixed: 'left',
                render: name => <div className='text-capitalize'>{name}</div>,
                width: 150,
                filters: country_filter.map((country) => {
                    return {text : country.country_name, value : country.country_id}
                })
            }]
            if (product_order && product_order.length) {
                product_order.forEach(
                    (value, index) => {
                        dataCols.push({
                            title: value,
                            dataIndex: value,
                            key: value,
                            width: 120,
                            filters: status_filter.map((status) => {
                                return {text : status, value : status}
                            })
                        })
                    }
                )
            }
            setColumns(dataCols);
            setRows(rows);
            setQuarterDropdown(quarter_dropdown)
            setTotal(total_rows)
        }
    }, [isLoaded, plansReportData])

    const handleTableChange = (pagination, columns) => {
        const { current, pageSize } = pagination
        const {company_name, country } = columns
        delete columns['company_name']
        delete columns['country']
        setRequestObj({
            page_size: pageSize,
            page_number: current,
            quarter:quarterDropdownCurrent,
            partner_id: company_name,
            country_id: country,
            product_status_dict: columns
        })
    }
    const changeQuarter = (e) => {
        setQuarterDropdownCurrent(e.target.value)
    }

    return (
        <div>
            <Row>
                <Col span={24}>
                    <div className='gx-flex-row gx-align-items-center gx-justify-content-between'>
                        <h1 className='title gx-mb-4'><IntlMessages id='report.filing-plans' /></h1>
                        <div className='gx-flex-row'>
                        <div className="quarter-dropdown-container-admin-consolidated-filing-plans">
                            <select onChange={changeQuarter} className="quarter-dropdown">
                                {
                                    quarterDropdown.map((quarter) => (
                                        <option value={quarter} className="quarter-dropdown-options">{quarter}</option>
                                    ))
                                }
                            </select>
                        </div>
                            <Tooltip title={<IntlMessages id='report.download' />}>
                                <Button
                                    id='report-download'
                                    className='mr-0'
                                    onClick={() => dispatch(downloadFilingReport('filing-plans.csv',quarterDropdownCurrent, requestObj))}
                                >
                                    <DownloadOutlined className='font-20' />
                                </Button>
                            </Tooltip>
                        </div>
                    </div>
                </Col>
                <Col span={24}>
                    <Card className='mb-0'>
                        <Table
                            className='gx-table-responsive mpp-list-table'
                            columns={columns}
                            dataSource={rows}
                            pagination={{
                                pageSize: requestObj.page_size,
                                current: requestObj.page_number,
                                total,
                            }}
                            scroll={{ x: 300 }}
                            size='small'
                            loading={!isLoaded}
                            onChange={handleTableChange}
                            bordered
                        />
                    </Card>
                </Col>
            </Row>
        </div>
    )
}

export default FilingPlansReport
