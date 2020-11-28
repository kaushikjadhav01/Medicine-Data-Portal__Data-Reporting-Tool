import React, { useEffect, useState } from 'react';
import IntlMessages from 'util/IntlMessages';
import { Card, Table, Row, Col, Button, Tooltip, Tabs } from 'antd';
import { DownloadOutlined } from '@ant-design/icons';
import { useDispatch, useSelector } from 'react-redux';
import { downloadApiSalesReport, downloadFdfSalesReport, getAdminConsolidatedApiReport, getAdminConsolidatedFdfReport } from '../../../appRedux/actions/SalesReport';

const TabPane = Tabs.TabPane;


const ConsolidatedSalesReport = (props) => {

    const { isLoaded, apiSalesReportData, fdfSalesReportData } = useSelector(({ salesReport }) => salesReport);
    const dispatch = useDispatch();
    const [apiRows, setApiRows] = useState([]);
    const [fdfRows, setFdfRows] = useState([]);
    const [apitotal, setApiTotal] = useState(0);
    const [fdftotal, setFdfTotal] = useState(0);
    const [apiRequestObj, setApiRequestObj] = useState({ page_number: 1, page_size: 100 });
    const [fdfRequestObj, setFdfRequestObj] = useState({ page_number: 1, page_size: 100 });
    const [tabKey, setTabKey] = useState('api');

    useEffect(() => {
        if (tabKey === 'api') {
            dispatch(getAdminConsolidatedApiReport(apiRequestObj));
        } else {
            dispatch(getAdminConsolidatedFdfReport(fdfRequestObj))
        }
    }, [apiRequestObj, tabKey, fdfRequestObj])

    useEffect(() => {
        if (isLoaded) {
            if (tabKey === 'api') {
                const { total_rows, rows } = apiSalesReportData;
                setApiTotal(total_rows);
                setApiRows(rows);
            } else {
                const { total_rows, rows } = fdfSalesReportData;
                setFdfTotal(total_rows);
                setFdfRows(rows);
            }
        }
    }, [isLoaded, apiSalesReportData, fdfSalesReportData])

    const handleApiTableChange = (pagination) => {
        const { current, pageSize } = pagination
        setApiRequestObj({
            page_size: pageSize,
            page_number: current
        })
    }

    const handleFdfTableChange = (pagination) => {
        const { current, pageSize } = pagination
        setFdfRequestObj({
            page_size: pageSize,
            page_number: current
        })
    }

    const apiColumns = [
        {
            title: 'Company Name',
            dataIndex: 'company_name',
            key: 'company_name',
            ellipsis: true,
            fixed: 'left',
            render: name => <span className='text-capitalize'>{name}</span>,
            width: 250
        },
        {
            title: 'Year',
            dataIndex: 'year',
            key: 'year',
            width: 150
        },
        {
            title: 'Month',
            dataIndex: 'month',
            key: 'month',
            width: 150
        },
        {
            title: 'Country',
            dataIndex: 'country_name',
            key: 'country_name',
            width: 150
        },
        {
            title: 'Purchaser',
            dataIndex: 'purchaser',
            key: 'purchaser',
            render: name => <span className='text-capitalize'>{name}</span>,
            width: 200,
        },
        {
            title: 'Api Name',
            dataIndex: 'product_name',
            key: 'product_name',
            width: 200
        },
        {
            title: 'Quantity (Kg)',
            dataIndex: 'quantity',
            key: 'quantity',
            width: 150
        },
        {
            title: 'Total Value (USD)',
            dataIndex: 'total_value',
            key: 'total_value',
            width: 150
        }
    ]

    const fdfColumns = [
        {
            title: 'Company Name',
            dataIndex: 'company_name',
            key: 'company_name',
            ellipsis: true,
            fixed: 'left',
            render: name => <span className='text-capitalize'>{name}</span>,
            width: 250
        },
        {
            title: 'Year',
            dataIndex: 'year',
            key: 'year',
            width: 150
        },
        {
            title: 'Month',
            dataIndex: 'month',
            key: 'month',
            width: 150
        },
        {
            title: 'Country',
            dataIndex: 'country_name',
            key: 'country_name',
            width: 150
        },
        {
            title: 'Product',
            dataIndex: 'product_name',
            key: 'product_name',
            width: 200
        },
        {
            title: 'Purchaser',
            dataIndex: 'purchaser',
            key: 'purchaser',
            render: name => <span className='text-capitalize'>{name}</span>,
            width: 200,
        },
        {
            title: 'Strength',
            dataIndex: 'strength',
            key: 'strength',
            width: 150
        },
        {
            title: 'Formulation Type',
            dataIndex: 'formulation_md',
            key: 'formulation_md',
            width: 150
        },
        {
            title: 'Pack Size',
            dataIndex: 'pack_size',
            key: 'pack_size',
            width: 100
        },
        {
            title: 'Quantity',
            dataIndex: 'quantity',
            key: 'quantity',
            width: 100
        },
        {
            title: 'Currency',
            dataIndex: 'currency',
            key: 'currency',
            width: 100
        },
        {
            title: 'Gross Sale Price (per pack) (Local Currency)',
            dataIndex: 'gross_sale_price_currency',
            key: 'gross_sale_price_currency',
            width: 150
        },
        {
            title: 'Applicable Currency Exchange Rate to USD',
            dataIndex: 'usd_exchange_rate',
            key: 'usd_exchange_rate',
            width: 150
        },
        {
            title: 'Gross Sale Price (per pack) (USD)',
            dataIndex: 'gross_sale_price_usd',
            key: 'gross_sale_price_usd',
            width: 150
        },
        {
            title: 'Deductable Expenses (USD)',
            dataIndex: 'deductable_expenses',
            key: 'deductable_expenses',
            width: 150
        },
        {
            title: 'Total Net Sales Value',
            dataIndex: 'total_value',
            key: 'total_value',
            width: 150
        },
        {
            title: 'Royalty %',
            dataIndex: 'royalty_percent',
            key: 'royalty_percent',
            width: 100
        },
        {
            title: 'Royalty Due',
            dataIndex: 'royalty_due',
            key: 'royalty_due',
            width: 100
        },
        {
            title: 'Procurement Agency End-Country',
            dataIndex: 'procurement_end_country',
            key: 'procurement_end_country',
            width: 150
        },
        {
            title: 'Comments',
            dataIndex: 'comments',
            key: 'comments',
            width: 200
        },
    ]

    return (
        <div>
            <Row>
                <Col span={24}>
                    <div className='gx-flex-row gx-align-items-center gx-justify-content-between'>
                        <h1 className='title gx-mb-4'><IntlMessages id='report.sales-report' /></h1>
                    </div>
                </Col>
                <Col span={24}>
                    <Card className='mb-0'>
                        <Tabs
                            tabPosition='top'
                            type='card'
                            className='sales-report-tabs'
                            tabBarExtraContent={
                                <div>
                                    <Tooltip title={tabKey === 'api' ? 'download API report!' : 'download FDF report!'}>
                                        <Button
                                            className='mb-0'
                                            onClick={() => {
                                                tabKey === 'api' ?
                                                    dispatch(downloadApiSalesReport('api-sales-report.csv'))
                                                    : dispatch(downloadFdfSalesReport('fdf-sales-report.csv'))
                                            }}
                                        >
                                            <DownloadOutlined className='font-20' />
                                        </Button>
                                    </Tooltip>
                                </div>
                            }
                            onChange={(currentTabKey) => { setTabKey(currentTabKey) }}
                        >
                            <TabPane tab='API' key='api'>
                                <Table
                                    className='gx-table-responsive mpp-list-table'
                                    columns={apiColumns}
                                    dataSource={apiRows}
                                    pagination={{
                                        pageSize: apiRequestObj.page_size,
                                        current: apiRequestObj.page_number,
                                        total: apitotal,
                                    }}
                                    size='small'
                                    loading={!isLoaded}
                                    onChange={handleApiTableChange}
                                />
                            </TabPane>
                            <TabPane tab='FDF' key='fdf'>
                                <Table
                                    className='gx-table-responsive mpp-list-table'
                                    columns={fdfColumns}
                                    dataSource={fdfRows}
                                    pagination={{
                                        pageSize: fdfRequestObj.page_size,
                                        current: fdfRequestObj.page_number,
                                        total: fdftotal,
                                    }}
                                    size='small'
                                    loading={!isLoaded}
                                    onChange={handleFdfTableChange}
                                    bordered
                                />
                            </TabPane>
                        </Tabs>
                    </Card>
                </Col>
            </Row>
        </div>
    )
}

export default ConsolidatedSalesReport
