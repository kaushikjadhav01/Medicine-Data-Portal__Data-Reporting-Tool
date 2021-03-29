import React, { useEffect, useState } from 'react';
import IntlMessages from 'util/IntlMessages';
import { Card, Table, Row, Col, Button, Tooltip } from 'antd';
import { DownloadOutlined } from '@ant-design/icons';
import { useDispatch, useSelector } from 'react-redux';
import { getAdminPDTReport, downloadPDTReport } from '../../../appRedux/actions/ProductDevelopmentTimeline';

const PDTReport = (props) => {

    const { isLoaded, pdtReportData } = useSelector(({ pdt }) => pdt)
    const dispatch = useDispatch();
    const [rows, setRows] = useState([]);
    const [columns, setColumns] = useState([]);
    const [total, setTotal] = useState(0);
    const [requestObj, setRequestObj] = useState({ page_number: 1, page_size: 50 });

    const [quarterDropdown, setQuarterDropdown] = useState([])
    const [quarterDropdownCurrent, setQuarterDropdownCurrent] = useState("Loading...")

    useEffect(() => {
        if(quarterDropdownCurrent === "Loading..."){
            dispatch(getAdminPDTReport(requestObj));   
        }
        else{
            requestObj['quarter']=quarterDropdownCurrent
            dispatch(getAdminPDTReport(requestObj));
        }
    }, [quarterDropdownCurrent])

    useEffect(() => {
        dispatch(getAdminPDTReport(requestObj));
    }, [requestObj])

    useEffect(() => {
        if (isLoaded) {
            const { quarter_order, rows, total_rows, quarter_dropdown, filter_options } = pdtReportData;
            const { partner_filter, product_filter, stage_filter, status_filter } = filter_options;

            let dataCols = [{
                title: 'Company Name',
                dataIndex: 'company',
                key: 'company',
                render: name => <span className='text-capitalize'>{name}</span>,
                filters: partner_filter.map((partner) => {
                    return {text : partner.company_name.replace(/(^\w{1})|(\s{1}\w{1})/g, match => match.toUpperCase()), value : partner.partner_id}
                })
            }, {
                title: 'Product',
                dataIndex: 'product',
                key: 'product',
                filters: product_filter.map((product) => {
                    return {text : product.product_name, value : product.product_id}
                })
            }, {
                title: 'Stage',
                dataIndex: 'stage',
                key: 'stage',
                filters: stage_filter.map((stage) => {
                    return {text : stage, value : stage}
                })
            },{
                title: 'Status',
                dataIndex: 'product_status',
                key: 'product_status',
                filters: status_filter.map((status) => {
                    return {text : status, value : status}
                })
            }]
            if (quarter_order && quarter_order.length) {
                quarter_order.forEach(
                    (value, index) => {
                        dataCols.push({
                            title: value,
                            key: index,
                            children: [
                                {
                                    title: 'Start Date',
                                    dataIndex: 'start_date_' + value,
                                    key: 'start_date_' + value,
                                    width: 120
                                },
                                {
                                    title: 'End Date',
                                    dataIndex: 'end_date_' + value,
                                    key: 'end_date_' + value,
                                    width: 120
                                },
                            ]
                        })
                    }
                )
            }
            setColumns(dataCols);
            setRows(rows);
            setQuarterDropdown(quarter_dropdown)
            setTotal(total_rows)
        }
    }, [isLoaded, pdtReportData])

    const handleTableChange = (pagination, columns) => {
        const { current, pageSize } = pagination
        const { company, product, stage, product_status  } = columns
        
        setRequestObj({
            page_size: pageSize,
            page_number: current,
            quarter:quarterDropdownCurrent,
            partner_id: company,
            product_id: product,
            stages: stage,
            status: product_status
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
                        <h1 className='title gx-mb-4'><IntlMessages id='report.pdt' /></h1>
                        <div className='gx-flex-row'>
                            <div className="quarter-dropdown-container-admin-consolidated-pdt">
                            <select onChange={changeQuarter} className="quarter-dropdown">
                                {
                                    quarterDropdown.map((quarter) => (
                                        <option value={quarter} className="quarter-dropdown-options">{quarter}</option>
                                    ))
                                }
                            </select>
                            </div>
                            <Tooltip title={<IntlMessages id='report.download' />}>
                                <Button id='report-download' className='mr-0' onClick={() => dispatch(downloadPDTReport('pdt-report.csv',quarterDropdownCurrent, requestObj))} >
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

export default PDTReport
