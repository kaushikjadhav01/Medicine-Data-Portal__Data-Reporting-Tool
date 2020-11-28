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

    useEffect(() => {
        dispatch(getAdminFilingPlansReport(requestObj));
    }, [requestObj])

    useEffect(() => {
        if (isLoaded) {
            const { product_order, rows, total_rows } = plansReportData;
            let dataCols = [{
                title: 'Company Name',
                dataIndex: 'company_name',
                key: 'company_name',
                fixed: 'left',
                render: name => <div className='text-capitalize'>{name}</div>,
                width: 150
            }, {
                title: 'Country',
                dataIndex: 'country',
                key: 'country',
                fixed: 'left',
                render: name => <div className='text-capitalize'>{name}</div>,
                width: 150
            }]
            if (product_order && product_order.length) {
                product_order.forEach(
                    (value, index) => {
                        dataCols.push({
                            title: value,
                            dataIndex: value,
                            key: value,
                            width: 120
                        })
                    }
                )
            }
            setColumns(dataCols);
            setRows(rows);
            setTotal(total_rows)
        }
    }, [isLoaded, plansReportData])

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
                        <h1 className='title gx-mb-4'><IntlMessages id='report.filing-plans' /></h1>
                        <div className='gx-flex-row'>
                            <Tooltip title={<IntlMessages id='report.download' />}>
                                <Button
                                    className='mr-0'
                                    onClick={() => dispatch(downloadFilingReport('filing-plans.csv'))}
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
