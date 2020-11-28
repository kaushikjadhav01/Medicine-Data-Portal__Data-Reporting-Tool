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

    useEffect(() => {
        dispatch(getAdminPDTReport(requestObj));
    }, [])

    useEffect(() => {
        dispatch(getAdminPDTReport(requestObj));
    }, [requestObj])

    useEffect(() => {
        if (isLoaded) {
            const { quarter_order, rows, total_rows } = pdtReportData;
            let dataCols = [{
                title: 'Company Name',
                dataIndex: 'company',
                key: 'company',
                render: name => <span className='text-capitalize'>{name}</span>
            }, {
                title: 'Product',
                dataIndex: 'product',
                key: 'product',
            }, {
                title: 'Stage',
                dataIndex: 'stage',
                key: 'stage',
            },{
                title: 'Status',
                dataIndex: 'product_status',
                key: 'product_status',
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
            setTotal(total_rows)
        }
    }, [isLoaded, pdtReportData])

    const handleTableChange = (pagination) => {
        const { current, pageSize } = pagination
        setRequestObj({
            page_size: pageSize,
            page_number: current
        })
    }

    return (
        <div>
            <Row>
                <Col span={24}>
                    <div className='gx-flex-row gx-align-items-center gx-justify-content-between'>
                        <h1 className='title gx-mb-4'><IntlMessages id='report.pdt' /></h1>
                        <div className='gx-flex-row'>
                            <Tooltip title={<IntlMessages id='report.download' />}>
                                <Button className='mr-0' onClick={() => dispatch(downloadPDTReport('pdt-report.csv'))} >
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
