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
    const [apiColumns, setApiColumns] = useState([]);
    const [fdfRows, setFdfRows] = useState([]);
    const [fdfColumns, setFdfColumn] = useState([]);
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
                const { total_rows, rows, filter_options } = apiSalesReportData;
                const { partner_filter, product_filter, country_filter, quarter_filter, year_filter, month_filter, purchaser_filter } = filter_options;

                const apiColumns = [
                    {
                        title: 'Company Name',
                        dataIndex: 'company_name',
                        key: 'company_name',
                        ellipsis: true,
                        fixed: 'left',
                        render: name => <span className='text-capitalize'>{name}</span>,
                        width: 250,
                        filters: partner_filter.map((partner) => {
                            return {text : partner.company_name.replace(/(^\w{1})|(\s{1}\w{1})/g, match => match.toUpperCase()), value : partner.partner_id}
                        })
                    },
                    {
                        title: 'Year',
                        dataIndex: 'year',
                        key: 'year',
                        width: 150,
                        filters: year_filter.map((year) => {
                            return {text : year.year, value : year.year}
                        })
                    },
                    {
                        title: 'Month',
                        dataIndex: 'month',
                        key: 'month',
                        width: 150,
                        filters: month_filter.map((month) => {
                            return {text : month.month, value : month.month}
                        })
                    },
                    {
                        title: 'Quarter',
                        dataIndex: 'quarter_name',
                        key: 'quarter_name',
                        width: 150,
                        filters: quarter_filter.map((quarter) => {
                            return {text : quarter.quarter_name, value : quarter.quarter_id}
                        })
                    },
                    {
                        title: 'Country',
                        dataIndex: 'country_name',
                        key: 'country_name',
                        width: 150,
                        filters: country_filter.map((country) => {
                            return {text : country.country_name, value : country.country_id}
                        })
                    },
                    {
                        title: 'Purchaser',
                        dataIndex: 'purchaser',
                        key: 'purchaser',
                        render: name => <span className='text-capitalize'>{name}</span>,
                        width: 200,
                        filters: purchaser_filter.map((purchaser) => {
                            return {text : purchaser.purchaser, value : purchaser.purchaser}
                        })
                    },
                    {
                        title: 'Api Name',
                        dataIndex: 'product_name',
                        key: 'product_name',
                        width: 200,
                        filters: product_filter.map((product) => {
                            return {text : product.product_name, value : product.product_id}
                        })
                    },
                    {
                        title: 'Quantity (Kg)',
                        dataIndex: 'quantity',
                        key: 'quantity',
                        width: 150,
                        
                    },
                    {
                        title: 'Total Value (USD)',
                        dataIndex: 'total_value',
                        key: 'total_value',
                        width: 150,
                        
                    }
                ]
                setApiColumns(apiColumns);
                setApiTotal(total_rows);
                setApiRows(rows);
            } else {
                const { total_rows, rows } = fdfSalesReportData;
                const { partner_filter, product_filter, country_filter, quarter_filter, year_filter, month_filter, purchaser_filter, strength_filter, formulation_md_filter, currency_filter, procurement_end_country_filter, comments_filter } = fdfSalesReportData.filter_options;
                const fdfColumns = [
                    {
                        title: 'Company Name',
                        dataIndex: 'company_name',
                        key: 'company_name',
                        ellipsis: true,
                        fixed: 'left',
                        render: name => <span className='text-capitalize'>{name}</span>,
                        width: 250,
                        filters: partner_filter.map((partner) => {
                            return {text : partner.company_name.replace(/(^\w{1})|(\s{1}\w{1})/g, match => match.toUpperCase()), value : partner.partner_id}
                        })
                    },
                    {
                        title: 'Year',
                        dataIndex: 'year',
                        key: 'year',
                        width: 150,
                        filters: year_filter.map((year) => {
                            return {text : year.year, value : year.year}
                        })
                    },
                    {
                        title: 'Month',
                        dataIndex: 'month',
                        key: 'month',
                        width: 150,
                        filters: month_filter.map((month) => {
                            return {text : month.month, value : month.month}
                        })
                    },
                    {
                        title: 'Quarter',
                        dataIndex: 'quarter_name',
                        key: 'quarter_name',
                        width: 150,
                        filters: quarter_filter.map((quarter) => {
                            return {text : quarter.quarter_name, value : quarter.quarter_id}
                        })
                    },
                    {
                        title: 'Country',
                        dataIndex: 'country_name',
                        key: 'country_name',
                        width: 150,
                        filters: country_filter.map((country) => {
                            return {text : country.country_name, value : country.country_id}
                        })
                    },
                    {
                        title: 'Product',
                        dataIndex: 'product_name',
                        key: 'product_name',
                        width: 200,
                        filters: product_filter.map((product) => {
                            return {text : product.product_name, value : product.product_id}
                        })
                    },
                    {
                        title: 'Purchaser',
                        dataIndex: 'purchaser',
                        key: 'purchaser',
                        render: name => <span className='text-capitalize'>{name}</span>,
                        width: 200,
                        filters: purchaser_filter.map((purchaser) => {
                            return {text : purchaser.purchaser, value : purchaser.purchaser}
                        })
                    },
                    {
                        title: 'Strength',
                        dataIndex: 'strength',
                        key: 'strength',
                        width: 150,
                        filters: strength_filter.map((strength) => {
                            return {text : strength.strength, value : strength.strength}
                        })
                    },
                    {
                        title: 'Formulation Type',
                        dataIndex: 'formulation_md',
                        key: 'formulation_md',
                        width: 150,
                        filters: formulation_md_filter.map((formulation_md) => {
                            return {text : formulation_md.formulation_md, value : formulation_md.formulation_md}
                        })
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
                        width: 100,
                        filters: currency_filter.map((currency) => {
                            return {text : currency.currency, value : currency.currency}
                        })
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
                        width: 150,
                        filters: procurement_end_country_filter.map((procurement_end_country) => {
                            return {text : procurement_end_country.procurement_end_country, value : procurement_end_country.procurement_end_country}
                        })
                    },
                    {
                        title: 'Comments',
                        dataIndex: 'comments',
                        key: 'comments',
                        width: 200,
                        filters: comments_filter.map((comments) => {
                            return {text : comments.comments, value : comments.comments}
                        })
                    },
                ]
                setFdfColumn(fdfColumns);
                setFdfTotal(total_rows);
                setFdfRows(rows);
            }
        }
    }, [isLoaded, apiSalesReportData, fdfSalesReportData])

    const handleApiTableChange = (pagination, columns) => {
        const { current, pageSize } = pagination
        const { company_name, product_name, country_name, quarter_name, year, month, purchaser } = columns
        setApiRequestObj({
            page_size: pageSize,
            page_number: current,
            partner_id: company_name,
            product_id: product_name,
            country_id: country_name,
            quarter_id: quarter_name,
            year: year,
            month: month,
            purchaser: purchaser
        })
    }

    const handleFdfTableChange = (pagination, columns) => {
        const { current, pageSize } = pagination
        const { company_name, product_name, country_name, quarter_name, year, month, purchaser, strength, formulation_md, currency, procurement_end_country, comments } = columns
        setFdfRequestObj({
            page_size: pageSize,
            page_number: current,
            partner_id: company_name,
            product_id: product_name,
            country_id: country_name,
            quarter_id: quarter_name,
            year: year,
            month: month,
            purchaser: purchaser,
            strength: strength,
            formulation_md: formulation_md,
            currency: currency,
            procurement_end_country: procurement_end_country,
            comments: comments
        })
    }

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
                                            id='report-download'
                                            onClick={() => {
                                                tabKey === 'api' ?
                                                    dispatch(downloadApiSalesReport('api-sales-report.csv', apiRequestObj))
                                                    : dispatch(downloadFdfSalesReport('fdf-sales-report.csv', fdfRequestObj))
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
                                    bordered
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
