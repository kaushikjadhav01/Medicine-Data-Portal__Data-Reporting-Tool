import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AgGridReact } from 'ag-grid-react';
import 'ag-grid-community/dist/styles/ag-grid.css';
import 'ag-grid-community/dist/styles/ag-theme-balham.css';
import 'ag-grid-enterprise';
import IntlMessages from 'util/IntlMessages';
import { Button, Input, Modal, Popover, Form, Badge, Tooltip, Tabs, InputNumber, Alert } from 'antd';
import { MailOutlined, CheckCircleOutlined, CloseCircleOutlined, DownloadOutlined, LeftOutlined } from '@ant-design/icons';
import AdminNotifications from 'components/AdminNotifications';
import { monthArray, showMessage, yearList, formulationType, currencyList, statusArray } from '../../../helpers';
import { approveSalesReportData, getAdminApiSalesData, getAdminFdfSalesData, getAdminProductsToBeVerified, getApiSalesData, getFdfSalesData, partnerMarkSalesReportMessageRead, postAdminApiSalesData, postAdminFdfSalesData, postAdminProductsToBeVerified, postApiSalesReportData, postFdfSalesReportData, submitSalesReportData } from '../../../appRedux/actions/SalesReport';
import { isEmpty, findIndex, has } from 'lodash';
import moment from 'moment'

import { SearchSelect } from './searchSelect'

import './sales-report.css'
import { initRowData, suppressEnter } from './sales-report-util';
import ProductVerificationModal from './productVerificationModal';

const confirm = Modal.confirm;
const TabPane = Tabs.TabPane;


const SalesReport = (props) => {
    const [isDataReady, setIsDataReady] = useState(false);
    const [isFdfInitialized, setIsFdfInitialized] = useState(false);
    const [areApiRowsSelected, setAreApiRowsSelected] = useState(false);
    const [areFdfRowsSelected, setAreFdfRowsSelected] = useState(false);
    const [deleteApiIds, setDeleteApiIds] = useState([]);
    const [deleteFdfIds, setDeleteFdfIds] = useState([]);
    const [addApiRowNumber, setAddApiRowNumber] = useState(0);
    const [addFdfRowNumber, setAddFdfRowNumber] = useState(0);

    const [isUserAdmin, setIsUserAdmin] = useState(false);
    const [showVerificationModal, setShowVerificationModal] = useState(false);
    const [pendingProducts, setPendingProducts] = useState(0);
    const [partnerId, setPartnerId] = useState(null);
    const [reportDetails, setReportDetails] = useState({});

    const [apiGridApi, setApiGridApi] = useState(null);
    const [fdfGridApi, setFdfGridApi] = useState(null);
    const [ApiRowData, setApiRowData] = useState([]);
    const [FdfRowData, setFdfRowData] = useState([]);
    const [ApiColumnDefs, setApiColumnDefs] = useState([]);
    const [FdfColumnDefs, setFdfColumnDefs] = useState([]);

    const [messageCount, setMessageCount] = useState(0);
    const [countryOrder, setCountryOrder] = useState([]);
    const [countryDropdown, setCountryDropdown] = useState([]);
    const [apiProductOrder, setApiProductOrder] = useState([]);
    const [apiProductDropdown, setApiProductDropdown] = useState([]);
    const [fdfProductOrder, setFdfProductOrder] = useState([]);
    const [fdfProductDropdown, setFdfProductDropdown] = useState([]);
    const [yearDropdown, setYearDropdown] = useState([]);
    const [monthDropdown, setMonthDropdown] = useState([]);
    const [tabKey, setTabKey] = useState('api');

    const { apiSalesList, fdfSalesList } = useSelector(({ salesReport }) => salesReport);
    const [form] = Form.useForm();
    const dispatch = useDispatch();

    useEffect(() => {
        setSalesReport()
        return () => {
            setIsDataReady(false)
        }
    }, [])

    useEffect(() => {
        if (isDataReady && !isFdfInitialized) { addApiColumns(); }
        if (isFdfInitialized) { addFdfColumns(); }
    }, [isDataReady, isFdfInitialized])

    const navigateBack = () => {
        if (isUserAdmin) {
            props.history.push('/admin/partner-list')
        }
    }

    const setSalesReport = () => {
        const { id } = props.match.params;
        if (id) {
            setIsUserAdmin(true)
            dispatch(getAdminApiSalesData(id, (apiData) => {
                setApiValues(apiData);
                dispatch(getAdminFdfSalesData(id, (fdfData) => {
                    setFdfValues(fdfData);
                    setIsDataReady(true);
                    setPartnerId(id)
                }))
            }))
        } else {
            dispatch(getApiSalesData((apiData) => {
                setApiValues(apiData);
                dispatch(getFdfSalesData((fdfData) => {
                    setFdfValues(fdfData);
                    setIsDataReady(true)
                }))
            }))
        }
    }

    const setApiValues = (data) => {
        const { country_order, product_order, rows, sales_meta, unread_message_count, pending_product_count } = data;
        setCountryOrder(country_order && country_order.length ? country_order : []);
        setCountryDropdown(country_order && country_order.length ? country_order.map(
            value => value.country_name
        ) : [])
        setApiProductOrder(product_order && product_order.length ? product_order : []);
        setApiProductDropdown(product_order && product_order.length ? product_order.map(
            value => value.product_name
        ) : [])
        setYearDropdown(yearList());
        setMonthDropdown(monthArray.map(value => value.name))
        setApiRowData(initRowData(rows))
        setReportDetails(sales_meta)
        setMessageCount(unread_message_count)
        setPendingProducts(pending_product_count)
    }

    const setFdfValues = (data) => {
        const { product_order, rows, sales_meta, unread_message_count } = data;
        setFdfProductOrder(product_order && product_order.length ? product_order : []);
        setFdfProductDropdown(product_order && product_order.length ? product_order.map(
            value => value.product_name
        ) : [])
        setFdfRowData(initRowData(rows));
        setReportDetails(sales_meta)
        setMessageCount(unread_message_count)
    }

    const onApiGridReady = (params) => {
        setApiGridApi(params.api);
    }

    const onFdfGridReady = (params) => {
        setFdfGridApi(params.api);
        setIsFdfInitialized(true)
    }

    const addApiColumns = () => {
        let apiColumns = [
            {
                headerName: 'Sr.No',
                checkboxSelection: true,
                valueGetter: 'node.rowIndex + 1',
                headerCheckboxSelection: true,
                width: 100
            },
            {
                headerName: 'Year',
                field: 'year',
                cellEditorSelector: (params) => {
                    return {
                        component: 'agRichSelect',
                        params: { values: yearDropdown }
                    }
                },
                cellClassRules: {
                    'error-cell': (params) => {
                        const { value } = params
                        return ((isNaN(value) || (!isNaN(value) && !yearDropdown.includes(value))) && (value))
                    },
                },
                width: 120
            },
            {
                headerName: 'Month',
                field: 'month',
                cellEditorSelector: (params) => {
                    return {
                        component: 'agRichSelect',
                        params: { values: monthDropdown }
                    }
                },
                cellClassRules: {
                    'error-cell': (params) => {
                        const { value } = params
                        return (!monthDropdown.includes(value) && (value))
                    },
                },
                width: 150
            },
            {
                headerName: 'Country',
                field: 'country_name',
                cellEditorSelector: (params) => {
                    return {
                        component: 'agRichSelect',
                        params: { values: countryDropdown }
                    }
                },
                cellClassRules: {
                    'error-cell': (params) => {
                        const { value } = params
                        return (!countryDropdown.includes(value) && (value))
                    },
                },
                width: 150
            },
            {
                headerName: 'Purchaser',
                field: 'purchaser',
                width: 200
            },
            {
                headerName: 'Api Name',
                field: 'product_name',
                cellEditor: 'searchSelector',
                selectValues: apiProductDropdown,
                suppressKeyboardEvent: (params) => {
                    return suppressEnter(params)
                },
                width: 200
            },
            {
                headerName: 'Quantity (Kg)',
                field: 'quantity',
                type: 'valueColumn',
                valueParser: (params) => {
                    const { newValue } = params
                    return isNaN(newValue) ? newValue : Number(newValue)
                },
                cellClassRules: {
                    'error-cell': (params) => {
                        const { value } = params
                        return (isNaN(value) && value !== null && value !== undefined)
                    },
                },
                width: 200
            },
            {
                headerName: 'Total Value (USD)',
                field: 'total_value',
                type: 'valueColumn',
                valueParser: (params) => {
                    const { newValue } = params
                    return isNaN(newValue) ? newValue : Number(newValue)
                },
                cellClassRules: {
                    'error-cell': (params) => {
                        const { value } = params
                        return (isNaN(value) && value !== null && value !== undefined)
                    },
                },
                width: 200
            }
        ]
        setApiColumnDefs(apiColumns);
        if (apiProductDropdown && apiProductDropdown.length) {
            apiGridApi.setColumnDefs(apiColumns);
        }
    }

    const addFdfColumns = () => {
        let fdfColumns = [
            {
                headerName: 'Sr.No',
                checkboxSelection: true,
                valueGetter: 'node.rowIndex + 1',
                headerCheckboxSelection: true,
                width: 100
            },
            {
                headerName: 'Year',
                field: 'year',
                cellEditorSelector: (params) => {
                    return {
                        component: 'agRichSelect',
                        params: { values: yearDropdown }
                    }
                },
                cellClassRules: {
                    'error-cell': (params) => {
                        const { value } = params
                        return ((isNaN(value) || (!isNaN(value) && !yearDropdown.includes(value))) && (value))
                    },
                },
                width: 100
            },
            {
                headerName: 'Month',
                field: 'month',
                cellEditorSelector: (params) => {
                    return {
                        component: 'agRichSelect',
                        params: { values: monthDropdown }
                    }
                },
                cellClassRules: {
                    'error-cell': (params) => {
                        const { value } = params
                        return (!monthDropdown.includes(value) && (value))
                    },
                },
                width: 100
            },
            {
                headerName: 'Country',
                field: 'country_name',
                cellEditorSelector: (params) => {
                    return {
                        component: 'agRichSelect',
                        params: { values: countryDropdown }
                    }
                },
                cellClassRules: {
                    'error-cell': (params) => {
                        const { value } = params
                        return (!countryDropdown.includes(value) && (value))
                    },
                },
                width: 150
            },
            {
                headerName: 'Purchaser',
                field: 'purchaser',
                width: 200
            },
            {
                headerName: 'Product',
                field: 'product_name',
                cellEditor: 'searchSelector',
                selectValues: fdfProductDropdown,
                suppressKeyboardEvent: (params) => {
                    return suppressEnter(params)
                },
                width: 200
            },
            {
                headerName: 'Strength',
                field: 'strength',
                width: 150
            },
            {
                headerName: 'Formulation Type',
                field: 'formulation_md',
                cellEditorSelector: (params) => {
                    return {
                        component: 'agRichSelect',
                        params: { values: formulationType }
                    }
                },
                cellClassRules: {
                    'error-cell': (params) => {
                        const { value } = params
                        return (!formulationType.includes(value) && (value))
                    },
                },
                width: 150
            },
            {
                headerName: 'Pack Size',
                field: 'pack_size',
                type: 'valueColumn',
                valueParser: (params) => {
                    const { newValue } = params
                    return isNaN(newValue) ? newValue : Number(newValue)
                },
                cellClassRules: {
                    'error-cell': (params) => {
                        const { value } = params
                        return (isNaN(value) && (value))
                    },
                },
                width: 100
            },
            {
                headerName: 'Quantity',
                field: 'quantity',
                type: 'valueColumn',
                valueParser: (params) => {
                    const { newValue } = params
                    return isNaN(newValue) ? newValue : Number(newValue)
                },
                cellClassRules: {
                    'error-cell': (params) => {
                        const { value } = params
                        return (isNaN(value) && (value))
                    },
                },
                width: 100
            },
            {
                headerName: 'Currency',
                field: 'currency',
                cellEditorSelector: (params) => {
                    return {
                        component: 'agRichSelect',
                        params: { values: Object.keys(currencyList) }
                    }
                },
                cellClassRules: {
                    'error-cell': (params) => {
                        const { value } = params
                        let currenyArr = Object.keys(currencyList)
                        return (!currenyArr.includes(value) && (value))
                    },
                },
                width: 100
            },
            {
                headerName: 'Gross Sale Price (per pack) (Local Currency)',
                field: 'gross_sale_price_currency',
                type: 'valueColumn',
                valueParser: (params) => {
                    const { newValue } = params
                    return isNaN(newValue) ? newValue : Number(newValue)
                },
                cellClassRules: {
                    'error-cell': (params) => {
                        const { value } = params
                        return (isNaN(value) && (value))
                    },
                },
                width: 300
            },
            {
                headerName: 'Applicable Currency Exchange Rate to USD',
                field: 'usd_exchange_rate',
                type: 'valueColumn',
                valueParser: (params) => {
                    const { newValue } = params
                    return isNaN(newValue) ? newValue : Number(newValue)
                },
                cellClassRules: {
                    'error-cell': (params) => {
                        const { value } = params
                        return (isNaN(value) && (value))
                    },
                },
                width: 300
            },
            {
                headerName: 'Gross Sale Price (per pack) (USD)',
                field: 'gross_sale_price_usd',
                type: 'valueColumn',
                valueParser: (params) => {
                    const { newValue } = params
                    return isNaN(newValue) ? newValue : Number(newValue)
                },
                cellClassRules: {
                    'error-cell': (params) => {
                        const { value } = params
                        return (isNaN(value) && (value))
                    },
                },
                width: 300
            },
            {
                headerName: 'Total Gross Sales Value (USD)',
                field: 'total_gross_value',
                type: 'valueColumn',
                valueParser: (params) => {
                    const { newValue } = params
                    return isNaN(newValue) ? newValue : Number(newValue)
                },
                cellClassRules: {
                    'error-cell': (params) => {
                        const { value } = params
                        return (isNaN(value) && (value))
                    },
                },
                width: 300
            },
            {
                headerName: 'Deductable Expenses (USD)',
                field: 'deductable_expenses',
                type: 'valueColumn',
                valueParser: (params) => {
                    const { newValue } = params
                    return isNaN(newValue) ? newValue : Number(newValue)
                },
                cellClassRules: {
                    'error-cell': (params) => {
                        const { value } = params
                        return (isNaN(value) && (value))
                    },
                },
                width: 200
            },
            {
                headerName: 'Total Net Sales Value',
                field: 'total_value',
                type: 'valueColumn',
                valueParser: (params) => {
                    const { newValue } = params
                    return isNaN(newValue) ? newValue : Number(newValue)
                },
                cellClassRules: {
                    'error-cell': (params) => {
                        const { value } = params
                        return (isNaN(value) && (value))
                    },
                },
                width: 200
            },
            {
                headerName: 'Royalty %',
                field: 'royalty_percent',
                type: 'valueColumn',
                valueParser: (params) => {
                    const { newValue } = params
                    return isNaN(newValue) ? newValue : Number(newValue)
                },
                cellClassRules: {
                    'error-cell': (params) => {
                        const { value } = params
                        return (isNaN(value) && (value))
                    },
                },
                width: 100
            },
            {
                headerName: 'Royalty Due',
                field: 'royalty_due',
                type: 'valueColumn',
                valueParser: (params) => {
                    const { newValue } = params
                    return isNaN(newValue) ? newValue : Number(newValue)
                },
                cellClassRules: {
                    'error-cell': (params) => {
                        const { value } = params
                        return (isNaN(value) && (value))
                    },
                },
                width: 200
            },
            {
                headerName: 'Procurement Agency End-Country',
                field: 'procurement_end_country',
                width: 150
            },
            {
                headerName: 'Comments',
                field: 'comments',
                width: 200
            }
        ]
        setFdfColumnDefs(fdfColumns);
        if (fdfProductDropdown && fdfProductDropdown.length) {
            fdfGridApi.setColumnDefs(fdfColumns);
        }
    }

    const addApiRow = () => {
        let rowData = [...ApiRowData];
        for (let i = 0; i < addApiRowNumber; i++) {
            rowData.push({});
        }
        setApiRowData(rowData)
        setAddApiRowNumber(0)
    }

    const addFdfRow = () => {
        let rowData = [...FdfRowData];
        for (let i = 0; i < addFdfRowNumber; i++) {
            rowData.push({});
        }
        setFdfRowData(rowData)
        setAddFdfRowNumber(0)
    }

    const checkApiRowNodes = (dataList) => {
        if (dataList.some(value => checkApiRow(value).flag)) {
            let errorData = dataList.filter(val => checkApiRow(val).flag)
            let errorIndex = dataList.map((val, index) => {
                if (checkApiRow(val).flag === true) {
                    return index + 1
                }
            }).filter(val => val !== undefined)
            let apiErrorList = errorData.map((val, index) => ({ errorkeys: checkApiRow(val).errorKey, index: errorIndex[index] }));
            let errMsg = () => {
                return (
                    <div>
                        <p>Please Check API Table:</p>
                        {
                            apiErrorList.map(value => {
                                return (
                                    <p>
                                        <span className='mr-5'>Row no. {value.index}: </span>
                                        <span>{value.errorkeys.map((val, index) => value.errorkeys.length === (index + 1) ? val : val + ', ')}</span>
                                    </p>
                                )
                            })
                        }
                    </div>
                )
            }

            Modal.error({
                title: 'Invalid data!',
                content: errMsg(),
            });
        }
        return !dataList.some(value => checkApiRow(value).flag)
    }

    const checkApiRow = (rowData) => {
        let flag = false;
        let errorKey = [];
        for (let key in rowData) {
            if (rowData.hasOwnProperty(key)) {
                if (key === 'year' && ((isNaN(rowData['year']) || !yearDropdown.includes(Number(rowData['year']))) && rowData['year'] !== '' && rowData['year'] !== null)) {
                    flag = true;
                    errorKey.push('Year');
                } if (key === 'month' && (!monthDropdown.includes(rowData['month']) && rowData['month'] !== '' && rowData['month'] !== null)) {
                    flag = true
                    errorKey.push('Month');
                } if (key === 'country_name' && (!countryDropdown.includes(rowData['country_name']) && rowData['country_name'] !== '' && rowData['country_name'] !== null)) {
                    flag = true
                    errorKey.push('Country');
                } if (key === 'quantity' && (isNaN(rowData['quantity']) && rowData['quantity'] !== null)) {
                    flag = true
                    errorKey.push('Quantity');
                } if (key === 'total_value' && (isNaN(rowData['total_value']) && rowData['total_value'] !== null)) {
                    flag = true
                    errorKey.push('Total Value');
                }
            }
        }
        return { flag, errorKey }
    }

    const checkFdfRowNodes = (dataList) => {
        if (dataList.some(value => checkFdfRow(value).flag)) {
            let errorData = dataList.filter(val => checkFdfRow(val).flag)
            let errorIndex = dataList.map((val, index) => {
                if (checkFdfRow(val).flag === true) {
                    return index + 1
                }
            }).filter(val => val !== undefined)
            let fdfErrorList = errorData.map((val, index) => ({ errorkeys: checkFdfRow(val).errorKey, index: errorIndex[index] }));
            let errMsg = () => {
                return (
                    <div>
                        <p>Please Check FDF Table:</p>
                        {
                            fdfErrorList.map(value => {
                                return (
                                    <p>
                                        <span className='mr-5'>Row no. {value.index}: </span>
                                        <span>{value.errorkeys.map((val, index) => value.errorkeys.length === (index + 1) ? val : val + ', ')}</span>
                                    </p>
                                )
                            })
                        }
                    </div>
                )
            }

            Modal.error({
                title: 'Invalid data!',
                content: errMsg(),
            });
        }
        return !dataList.some(value => checkFdfRow(value).flag)
    }

    const checkFdfRow = (rowData) => {
        let flag = false;
        let errorKey = [];
        for (let key in rowData) {
            if (rowData.hasOwnProperty(key)) {
                if (key === 'year' && ((isNaN(rowData['year']) || !yearDropdown.includes(Number(rowData['year']))) && rowData['year'] !== '' && rowData['year'] !== null)) {
                    flag = true;
                    errorKey.push('Year');
                }
                if (key === 'month' && (!monthDropdown.includes(rowData['month']) && rowData['month'] !== '' && rowData['month'] !== null)) {
                    flag = true;
                    errorKey.push('Month');
                }
                if (key === 'country_name' && (!countryDropdown.includes(rowData['country_name']) && rowData['country_name'] !== '' && rowData['country_name'] !== null)) {
                    flag = true;
                    errorKey.push('Country');
                }
                if (key === 'quantity' && (isNaN(rowData['quantity']) && rowData['quantity'] !== null)) {
                    flag = true
                    errorKey.push('Quantity');
                }
                if (key === 'formulation_md' && (!formulationType.includes(rowData['formulation_md']) && rowData['formulation_md'] !== '' && rowData['formulation_md'] !== null)) {
                    flag = true;
                    errorKey.push('Formulation Type');
                }
                if (key === 'pack_size' && (isNaN(rowData['pack_size']) && rowData['pack_size'] !== null)) {
                    flag = true
                    errorKey.push('Pack Size');
                }
                if (key === 'currency' && (!Object.keys(currencyList).includes(rowData['currency']) && rowData['currency'] && rowData['currency'] !== null)) {
                    flag = true
                    errorKey.push('Currency');
                }
                if (key === 'gross_sale_price_currency' && (isNaN(rowData['gross_sale_price_currency']) && rowData['gross_sale_price_currency'] !== null)) {
                    flag = true
                    errorKey.push('Gross Sale Price (per pack) (Local Currency)');
                }
                if (key === 'usd_exchange_rate' && (isNaN(rowData['usd_exchange_rate']) && rowData['usd_exchange_rate'] !== null)) {
                    flag = true
                    errorKey.push('Applicable Currency Exchange Rate');
                }
                if (key === 'gross_sale_price_usd' && (isNaN(rowData['gross_sale_price_usd']) && rowData['gross_sale_price_usd'] !== null)) {
                    flag = true
                    errorKey.push('Gross Sale Price (per pack) (USD)');
                }
                if (key === 'total_gross_value' && (isNaN(rowData['total_gross_value']) && rowData['total_gross_value'] !== null)) {
                    flag = true
                    errorKey.push('Total Gross Sales Value (USD)');
                }
                if (key === 'deductable_expenses' && (isNaN(rowData['deductable_expenses']) && rowData['deductable_expenses'] !== null)) {
                    flag = true
                    errorKey.push('Deductable Expenses (USD)');
                }
                if (key === 'total_value' && (isNaN(rowData['total_value']) && rowData['total_value'] !== null)) {
                    flag = true
                    errorKey.push('Total Net Sales Value');
                }
                if (key === 'royalty_percent' && isNaN(rowData['royalty_percent'])) {
                    flag = true
                    errorKey.push('Royalty %');
                }
                if (key === 'royalty_due' && isNaN(rowData['royalty_due'])) {
                    flag = true
                    errorKey.push('Royalty Due');
                }
            }
        }
        return { flag, errorKey }
    }

    const checkNullRow = (rowData) => {
        let flag = true;
        for (var key in rowData) {
            if (rowData.hasOwnProperty(key)) {
                if (!(rowData[key] === null || rowData[key] === undefined || rowData[key] === 0 || rowData[key] === '')) {
                    flag = false;
                    break;
                }
            }
        }
        return flag
    }

    const saveApiData = () => {
        let apiData = [];
        apiGridApi.stopEditing();
        apiGridApi.selectAll();
        let selectedApiNodes = apiGridApi.getSelectedNodes().filter(
            value => value.data && !isEmpty(value.data)
        ).filter(val => !checkNullRow(val.data))
        if (checkApiRowNodes(selectedApiNodes.map(value => value.data))) {
            selectedApiNodes.forEach(value => {
                let nodeData = { ...value.data };
                const { country_name, product_name } = nodeData;
                if (country_name && countryOrder.map(value => value.country_name).includes(country_name)) {
                    nodeData['country_id'] = countryOrder[findIndex(countryOrder, { 'country_name': country_name })].country_id;
                }
                if (product_name && apiProductDropdown.includes(product_name)) {
                    nodeData['product_id'] = apiProductOrder[findIndex(apiProductOrder, { 'product_name': product_name })].product_id;
                }
                apiData.push(nodeData)
            })
            let finalApiData = apiData.filter(val => !isEmpty(val)).filter(val => !checkNullRow(val))
            if (isUserAdmin) {
                dispatch(postAdminApiSalesData(partnerId, [...deleteApiIds, ...finalApiData], () => {
                    showMessage('success', 'Data successfully recorded!');
                    setDeleteApiIds([])
                    setSalesReport()
                }))
            } else {
                dispatch(postApiSalesReportData([...deleteApiIds, ...finalApiData], () => {
                    showMessage('success', 'Data successfully recorded!');
                    setDeleteApiIds([])
                    setSalesReport()
                }))
            }
            apiGridApi.deselectAll()
        } else {
            // Modal.error({
            //     title: 'Invalid data!',
            //     content: 'Please input valid entries!',
            // });
            apiGridApi.deselectAll()
        }
    }

    const saveFdfData = () => {
        let fdfData = [];
        fdfGridApi.stopEditing();
        fdfGridApi.selectAll();
        let selectedFdfNodes = fdfGridApi.getSelectedNodes().filter(
            value => value.data && !isEmpty(value.data)
        ).filter(val => !checkNullRow(val.data))
        if (checkFdfRowNodes(selectedFdfNodes.map(value => value.data))) {
            selectedFdfNodes.forEach(value => {
                let nodeData = { ...value.data };
                const { country_name, product_name } = nodeData;
                if (country_name && countryOrder.map(value => value.country_name).includes(country_name)) {
                    nodeData['country_id'] = countryOrder[findIndex(countryOrder, { 'country_name': country_name })].country_id;
                }
                if (product_name && fdfProductDropdown.includes(product_name)) {
                    nodeData['product_id'] = fdfProductOrder[findIndex(fdfProductOrder, { 'product_name': product_name })].product_id;
                }
                fdfData.push(nodeData)
            })
            let finalFdfData = fdfData.filter(val => !isEmpty(val)).filter(value => !checkNullRow(value))
            if (isUserAdmin) {
                dispatch(postAdminFdfSalesData(partnerId, [...deleteFdfIds, ...finalFdfData], () => {
                    showMessage('success', 'Data successfully recorded!');
                    setDeleteFdfIds([])
                    setSalesReport()
                }))
            } else {
                dispatch(postFdfSalesReportData([...deleteFdfIds, ...finalFdfData], () => {
                    showMessage('success', 'Data successfully recorded!');
                    setDeleteFdfIds([])
                    setSalesReport()
                }))
            }
            fdfGridApi.deselectAll()
        } else {
            // Modal.error({
            //     title: 'Invalid data!',
            //     content: 'Please input valid entries!',
            // });
            fdfGridApi.deselectAll()
        }
    }

    const saveData = () => {
        if (tabKey === 'api') {
            saveApiData()
        } else {
            saveFdfData()
        }
    }

    const saveReportBeforeAction = (callback) => {
        if (apiGridApi) apiGridApi.stopEditing();
        if (isFdfInitialized) fdfGridApi.stopEditing();
        let apiData = ApiRowData && ApiRowData.length > 0 ? ApiRowData.filter(value => !isEmpty(value)).map(value => {
            const { country_name, product_name } = value
            if (country_name && countryOrder.map(value => value.country_name).includes(country_name)) {
                value['country_id'] = countryOrder[findIndex(countryOrder, { 'country_name': country_name })].country_id;
            }
            if (product_name && apiProductDropdown.includes(product_name)) {
                value['active_product_id'] = apiProductOrder[findIndex(apiProductOrder, { 'product_name': product_name })].active_product_id;
            }
            return value
        }) : [];
        let fdfData = FdfRowData && FdfRowData.length > 0 ? FdfRowData.filter(value => !isEmpty(value)).map(value => {
            const { country_name, product_name } = value
            if (country_name && countryOrder.map(value => value.country_name).includes(country_name)) {
                value['country_id'] = countryOrder[findIndex(countryOrder, { 'country_name': country_name })].country_id;
            }
            if (product_name && fdfProductDropdown.includes(product_name)) {
                value['active_product_id'] = fdfProductOrder[findIndex(fdfProductOrder, { 'product_name': product_name })].active_product_id;
            }
            return value
        }) : [];
        if (checkFdfRowNodes(fdfData) && checkApiRowNodes(apiData)) {
            let finalApiData = apiData.filter(value => !checkNullRow(value))
            let finalFdfData = fdfData.filter(value => !checkNullRow(value))
            if (isUserAdmin) {
                dispatch(postAdminApiSalesData(partnerId, [...deleteApiIds, ...finalApiData], () => {
                    setDeleteApiIds([])
                    dispatch(postAdminFdfSalesData(partnerId, [...deleteFdfIds, ...finalFdfData], () => {
                        setDeleteFdfIds([])
                        callback()
                    }))
                }))
            } else {
                dispatch(postApiSalesReportData([...deleteApiIds, ...finalApiData], () => {
                    setDeleteApiIds([])
                    dispatch(postFdfSalesReportData([...deleteFdfIds, ...finalFdfData], () => {
                        setDeleteFdfIds([])
                        callback()
                    }))
                }))
            }
        }
    }

    const showSubmitConfirm = () => {
        saveReportBeforeAction(
            () => {
                confirm({
                    title: 'Do you want to submit the report?',
                    content: showCommentsForm(),
                    className: 'btn-confirm-green',
                    okText: 'Submit',
                    cancelText: 'Cancel',
                    onOk(close) {
                        form.validateFields().then(
                            values => {
                                let msg = values.commentData;
                                dispatch(submitSalesReportData({ message: msg }, () => {
                                    setSalesReport()
                                    form.resetFields(['commentData'])
                                }))
                                close()
                            }
                        )
                    },
                    onCancel() {
                        form.resetFields(['commentData'])
                    },
                })
            }
        )
    }

    const approver = (msg, isApproved) => {
        let data = {
            'partner_id': partnerId,
            'message': msg,
            'is_approved': isApproved
        }
        dispatch(approveSalesReportData(data, () => {
            if (isApproved) {
                showMessage('success', 'Report Approved!');
            } else {
                showMessage('success', 'Report Rejected!');
            }
            form.resetFields(['commentData']);
            setSalesReport()
        }))
    }

    const showCommentsForm = () => {
        return (
            <Form
                form={form}
                layout='vertical'
                className='mt-20'
            >
                <div className='mb-10'>
                    <span>
                        {isUserAdmin ? 'Add comments for partner:' : 'Add comments for admin:'}
                    </span>
                </div>
                <Form.Item
                    name='commentData'
                    className='mb-0'
                    rules={[
                        { required: isUserAdmin, message: isUserAdmin ? 'Enter comments for partner' : 'Enter comments for admin' },
                    ]}
                >
                    <Input.TextArea placeholder='Enter comments here' />
                </Form.Item>
            </Form>
        )
    }

    const showRejectConfirm = () => {
        saveReportBeforeAction(
            () => {
                setSalesReport()
                confirm({
                    title: 'Do you want to reject the report?',
                    className: 'btn-confirm-red',
                    content: showCommentsForm(),
                    okText: 'Reject',
                    cancelText: 'Cancel',
                    icon: (<CloseCircleOutlined />),
                    onOk(close) {
                        form.validateFields().then(
                            values => {
                                let msg = values.commentData;
                                approver(msg, false);
                                close()
                            }
                        )
                    },
                    onCancel() {
                        form.resetFields(['commentData'])
                    },
                });

            }
        )
    }

    const showApproveConfirm = () => {
        saveReportBeforeAction(
            () => {
                setSalesReport();
                confirm({
                    title: 'Do you want to approve the report?',
                    className: 'btn-confirm-green',
                    content: showCommentsForm(),
                    icon: (<CheckCircleOutlined />),
                    okText: 'Approve',
                    cancelText: 'Cancel',
                    onOk(close) {
                        form.validateFields().then(
                            values => {
                                let msg = values.commentData;
                                approver(msg, true);
                                close()
                            }
                        )
                    },
                    onCancel() {
                        form.resetFields(['commentData'])
                    },
                });
            }
        )
    }

    const displayGridCta = () => {
        const { report_status } = reportDetails;
        if ((tabKey === 'api' && apiProductDropdown && apiProductDropdown.length) || (tabKey === 'fdf' && fdfProductDropdown && fdfProductDropdown.length))
            return (
                <div>
                    <Tooltip title={tabKey === 'api' ? 'Save API report' : 'Save FDF report'}>
                        <Button
                            type='primary'
                            onClick={() => { saveData(false) }}
                            className='mb-0 sales-report-btn-save'
                            disabled={report_status === 'Approved' && !isUserAdmin}
                        >
                            Save
                        </Button>
                    </Tooltip>
                    <Tooltip title={<IntlMessages id='report.download' />}>
                        <Button className='mb-0' onClick={() => downloadExcel()} >
                            <DownloadOutlined />
                        </Button>
                    </Tooltip>
                </div >
            )
    }

    const displayHeader = () => {
        const { partner_name, quarter_name, report_status, approval_time, submission_time } = reportDetails;
        if (apiProductOrder.length > 0 || fdfProductOrder.length > 0) {
            return (
                <div className={pendingProducts > 0 ? 'gx-mb-2' : 'gx-mb-4'}>
                    <h1 className='title '>{isUserAdmin ? <Tooltip title='Back'><LeftOutlined className='mr-10' onClick={navigateBack} /></Tooltip> : null}Sales Report {isUserAdmin ? <span className='mr-5'>for <span className='text-capitalize'>{partner_name}</span></span> : null}
                        <span className='text-capitalize'>({quarter_name})</span>
                    </h1>
                    <h4 className={isUserAdmin ? 'ml-30' : ''}>Report Status:&nbsp;
                        <span className='text-capitalize'> {report_status}</span>
                        <span>
                            {!approval_time && !submission_time ? '' : ' on ' + moment(report_status === 'Submitted' || report_status === 'Resubmitted' ? submission_time : approval_time).format('Do MMM YYYY, hh:mm A')}
                        </span>
                    </h4>
                </div>
            )
        } else {
            return (
                <div className='gx-mb-4'>
                    <h1 className='title '>{isUserAdmin ? <LeftOutlined className='mr-5' onClick={navigateBack} /> : null}Sales Report {isUserAdmin && partner_name ? <span>for <span className='text-capitalize'>{partner_name}</span></span> : null}
                    </h1>
                </div>
            )
        }
    }

    const displayProductVerification = () => {
        if (isUserAdmin && pendingProducts > 0) {
            return (
                <Alert
                    className='ml-30 min-width-600'
                    message="Product verification pending!"
                    description={
                        <div>
                            <span>
                                There are
                                            <span className='text-capitalize color-red ml-5 mr-5'> {pendingProducts}</span>
                                            products to be verified
                                            <Button type='link' className='mb-0' onClick={() => viewVerificationModal()}>View Details</Button>
                            </span>
                        </div>
                    }
                    type="warning"
                    showIcon
                />
            )
        }
    }

    const displayCTA = () => {
        if ((apiProductOrder.length > 0 || fdfProductOrder.length > 0)) {
            const { report_status } = reportDetails
            if (isUserAdmin) {
                return (
                    <div className='gx-flex-row gx-justify-content-end'>
                        <Button
                            className='gx-btn-success mb-0'
                            onClick={() => showApproveConfirm()}
                            disabled={pendingProducts > 0}
                        >
                            Approve
                        </Button>
                        <Button
                            className='gx-btn-danger mb-0'
                            onClick={() => showRejectConfirm()}
                            disabled={pendingProducts > 0}
                        >
                            Reject
                        </Button>
                        <Badge count={messageCount}>
                            <Popover overlayClassName='gx-popover-horizantal' placement='bottomRight'
                                content={<AdminNotifications isAdmin={isUserAdmin} data={apiSalesList && apiSalesList.messages ? apiSalesList.messages : fdfSalesList && fdfSalesList.messages ? fdfSalesList.messages : []} />} trigger='click'>
                                <Button
                                    className='mr-0 mb-0'
                                    onClick={() => dispatch(partnerMarkSalesReportMessageRead(
                                        isUserAdmin ? 'admin' : 'partner',
                                        () => setMessageCount(0)
                                    ))}
                                >
                                    <MailOutlined />
                                </Button>
                            </Popover>
                        </Badge>

                    </div>
                )
            } else {
                return (
                    <div className='gx-flex-row gx-justify-content-end'>
                        <Button
                            onClick={() => showSubmitConfirm()}
                            className='gx-btn-success mb-0'
                            disabled={report_status === 'Approved'}
                        >
                            Submit Report
                        </Button>
                        <Badge count={messageCount}>
                            <Popover overlayClassName='gx-popover-horizantal' placement='bottomRight'
                                content={<AdminNotifications isAdmin={isUserAdmin} data={apiSalesList && apiSalesList.messages ? apiSalesList.messages : fdfSalesList && fdfSalesList.messages ? fdfSalesList.messages : []} />} trigger='click'>
                                <Button
                                    className='mr-0 mb-0'
                                    onClick={() => dispatch(partnerMarkSalesReportMessageRead(
                                        isUserAdmin ? 'admin' : 'partner',
                                        () => setMessageCount(0)
                                    ))}
                                >
                                    <MailOutlined />
                                </Button>
                            </Popover>
                        </Badge>
                    </div>
                )
            }
        } else {
            return null
        }
    }

    const downloadExcel = () => {
        if (tabKey === 'api') {
            apiGridApi.selectAll();
            apiGridApi.exportDataAsExcel({
                sheetName: 'API',
                fileName: 'sales-report',
                columnKeys: ['year', 'month', 'country_name', 'purchaser', 'product_name', 'quantity', 'total_value']
            })
            apiGridApi.deselectAll();
        } else if (tabKey === 'fdf') {
            fdfGridApi.selectAll();
            fdfGridApi.exportDataAsExcel({
                sheetName: 'FDF',
                fileName: 'sales-report',
                columnKeys: ['year', 'month', 'country_name', 'product_name', 'purchaser', 'strength', 'formulation_md', 'pack_size', 'quantity', 'currency', 'gross_sale_price_currency', 'usd_exchange_rate', 'gross_sale_price_usd', 'total_gross_value', 'deductable_expenses', 'total_value', 'royalty_percent', 'royalty_due', 'procurement_end_country', 'comments']
            })
            fdfGridApi.deselectAll();
        }
    }

    const handleApiCellValueChange = (params) => {
        const { colDef, node, newValue, oldValue, source } = params;
        let rowNode = apiGridApi.getRowNode(node.id);
        if (newValue !== oldValue) {
            switch (colDef.field) {
                case 'year':
                    if (!isNaN(newValue) && yearDropdown.includes(Number(newValue))) {
                        rowNode.setDataValue(colDef.field, Number(newValue));
                    } else {
                        if (newValue === ' ') {
                            rowNode.setDataValue(colDef.field, null);
                        }
                    }
                    break;
                case 'month':
                    if (newValue === ' ') {
                        rowNode.setDataValue(colDef.field, null);
                    }
                    break;
                case 'country':
                    if (newValue === ' ') {
                        rowNode.setDataValue(colDef.field, null);
                    }
                    break;
                case 'quantity':
                    if (!isNaN(newValue)) {
                        if (newValue === null) {
                            rowNode.setDataValue(colDef.field, 0)
                        } else {
                            rowNode.setDataValue(colDef.field, Number(newValue))
                        }
                    } else {
                        if (newValue && newValue.indexOf(',') !== -1 && !isNaN(newValue.split(',').join(''))) {
                            rowNode.setDataValue(colDef.field, Number(newValue.split(',').join('')))
                        }
                    }
                    break;
                case 'total_value':
                    if (!isNaN(newValue)) {
                        if (newValue === null) {
                            rowNode.setDataValue(colDef.field, 0)
                        } else {
                            rowNode.setDataValue(colDef.field, Number(newValue))
                        }
                    } else {
                        if (newValue && newValue.indexOf(',') !== -1 && !isNaN(newValue.split(',').join(''))) {
                            rowNode.setDataValue(colDef.field, Number(newValue.split(',').join('')))
                        }
                    }
                    break;
                default:
                    break;
            }
        }
    }

    const handleFdfCellValueChange = (params) => {
        const { colDef, node, newValue, oldValue, data } = params;
        let rowNode = fdfGridApi.getRowNode(node.id);
        if (newValue !== oldValue) {
            // if (data && data.hasOwnProperty('gross_sale_price_currency') && data.hasOwnProperty('usd_exchange_rate')) {
            //     if ((data['gross_sale_price_currency'] === 0 || data['usd_exchange_rate'] === 0 || data['gross_sale_price_currency'] === null || data['usd_exchange_rate'] === null)) {
            //         rowNode.setDataValue('gross_sale_price_usd', 0)
            //     } else {
            //         rowNode.setDataValue('gross_sale_price_usd', Number(data['gross_sale_price_currency'] / data['usd_exchange_rate']));
            //     }
            // }
            // if (data && data.hasOwnProperty('gross_sale_price_currency') && data.hasOwnProperty('usd_exchange_rate') && data.hasOwnProperty('quantity')) {
            //     if (data['gross_sale_price_currency'] === 0 || data['usd_exchange_rate'] === 0 || data['gross_sale_price_currency'] === null || data['usd_exchange_rate'] === null) {
            //         rowNode.setDataValue('total_gross_value', 0)
            //     } else {
            //         rowNode.setDataValue('total_gross_value', Number((data['gross_sale_price_currency'] / data['usd_exchange_rate']) * data['quantity']));
            //     }
            // }
            // if (data && data.hasOwnProperty('gross_sale_price_currency') && data.hasOwnProperty('usd_exchange_rate') && data.hasOwnProperty('quantity') && data.hasOwnProperty('deductable_expenses')) {
            //     if (data['gross_sale_price_currency'] === 0 || data['usd_exchange_rate'] === 0 || data['gross_sale_price_currency'] === null || data['usd_exchange_rate'] === null) {
            //         rowNode.setDataValue('total_value', Number(0 - data['deductable_expenses']))
            //     } else {
            //         rowNode.setDataValue('total_value', Number(((data['gross_sale_price_currency'] / data['usd_exchange_rate']) * data['quantity']) - data['deductable_expenses']));
            //     }

            // }
            switch (colDef.field) {
                case 'year':
                    if (!isNaN(newValue) && yearDropdown.includes(Number(newValue))) {
                        rowNode.setDataValue(colDef.field, Number(newValue));
                    } else {
                        if (newValue === ' ') {
                            rowNode.setDataValue(colDef.field, null);
                        }
                    }
                    break;
                case 'month':
                    if (newValue === ' ') {
                        rowNode.setDataValue(colDef.field, null);
                    }
                    break;
                case 'country':
                    if (newValue === ' ') {
                        rowNode.setDataValue(colDef.field, null);
                    }
                    break;
                case 'formulation_md':
                    if (newValue === ' ') {
                        rowNode.setDataValue(colDef.field, null);
                    }
                    break;
                case 'currency':
                    if (newValue === ' ') {
                        rowNode.setDataValue(colDef.field, null);
                    }
                    break;
                case 'quantity':
                    if (!isNaN(newValue)) {
                        if (newValue === null) {
                            rowNode.setDataValue(colDef.field, 0)
                        } else {
                            rowNode.setDataValue(colDef.field, Number(newValue))
                        }
                    } else {
                        if (newValue && newValue.indexOf(',') !== -1 && !isNaN(newValue.split(',').join(''))) {
                            rowNode.setDataValue(colDef.field, Number(newValue.split(',').join('')))
                        }
                    }
                    break;
                case 'pack_size':
                    if (!isNaN(newValue)) {
                        if (newValue === null) {
                            rowNode.setDataValue(colDef.field, 0)
                        } else {
                            rowNode.setDataValue(colDef.field, Number(newValue))
                        }
                    } else {
                        if (newValue && newValue.indexOf(',') !== -1 && !isNaN(newValue.split(',').join(''))) {
                            rowNode.setDataValue(colDef.field, Number(newValue.split(',').join('')))
                        }
                    }
                    break;
                case 'gross_sale_price_currency':
                    if (!isNaN(newValue)) {
                        if (newValue === null) {
                            rowNode.setDataValue(colDef.field, 0)
                        } else {
                            rowNode.setDataValue(colDef.field, Number(newValue))
                        }
                    } else {
                        if (newValue && newValue.indexOf(',') !== -1 && !isNaN(newValue.split(',').join(''))) {
                            rowNode.setDataValue(colDef.field, Number(newValue.split(',').join('')))
                        }
                    }
                    break;
                case 'usd_exchange_rate':
                    if (!isNaN(newValue)) {
                        if (newValue === null) {
                            rowNode.setDataValue(colDef.field, 0)
                        } else {
                            rowNode.setDataValue(colDef.field, Number(newValue))
                        }
                    } else {
                        if (newValue && newValue.indexOf(',') !== -1 && !isNaN(newValue.split(',').join(''))) {
                            rowNode.setDataValue(colDef.field, Number(newValue.split(',').join('')))
                        }
                    }
                    break;
                case 'gross_sale_price_usd':
                    if (!isNaN(newValue)) {
                        if (newValue === null) {
                            rowNode.setDataValue(colDef.field, 0)
                        } else {
                            rowNode.setDataValue(colDef.field, Number(newValue))
                        }
                    } else {
                        if (newValue && newValue.indexOf(',') !== -1 && !isNaN(newValue.split(',').join(''))) {
                            rowNode.setDataValue(colDef.field, Number(newValue.split(',').join('')))
                        }
                    }
                    break;
                case 'total_gross_value':
                    if (!isNaN(newValue)) {
                        if (newValue === null) {
                            rowNode.setDataValue(colDef.field, 0)
                        } else {
                            rowNode.setDataValue(colDef.field, Number(newValue))
                        }
                    } else {
                        if (newValue && newValue.indexOf(',') !== -1 && !isNaN(newValue.split(',').join(''))) {
                            rowNode.setDataValue(colDef.field, Number(newValue.split(',').join('')))
                        }
                    }
                    break;
                case 'deductable_expenses':
                    if (!isNaN(newValue)) {
                        if (newValue === null) {
                            rowNode.setDataValue(colDef.field, 0)
                        } else {
                            rowNode.setDataValue(colDef.field, Number(newValue))
                        }
                    } else {
                        if (newValue && newValue.indexOf(',') !== -1 && !isNaN(newValue.split(',').join(''))) {
                            rowNode.setDataValue(colDef.field, Number(newValue.split(',').join('')))
                        }
                    }
                    break;
                case 'total_value':
                    if (!isNaN(newValue)) {
                        if (newValue === null) {
                            rowNode.setDataValue(colDef.field, 0)
                        } else {
                            rowNode.setDataValue(colDef.field, Number(newValue))
                        }
                    } else {
                        if (newValue && newValue.indexOf(',') !== -1 && !isNaN(newValue.split(',').join(''))) {
                            rowNode.setDataValue(colDef.field, Number(newValue.split(',').join('')))
                        }
                    }
                    break;
                case 'royalty_percent':
                    if (!isNaN(newValue)) {
                        if (newValue === null) {
                            rowNode.setDataValue(colDef.field, 0)
                        } else {
                            rowNode.setDataValue(colDef.field, Number(newValue))
                        }
                    } else {
                        if (newValue && newValue.indexOf(',') !== -1 && !isNaN(newValue.split(',').join(''))) {
                            rowNode.setDataValue(colDef.field, Number(newValue.split(',').join('')))
                        }
                    }
                    break;
                case 'royalty_due':
                    if (!isNaN(newValue)) {
                        if (newValue === null) {
                            rowNode.setDataValue(colDef.field, 0)
                        } else {
                            rowNode.setDataValue(colDef.field, Number(newValue))
                        }
                    } else {
                        if (newValue && newValue.indexOf(',') !== -1 && !isNaN(newValue.split(',').join(''))) {
                            rowNode.setDataValue(colDef.field, Number(newValue.split(',').join('')))
                        }
                    }
                    break;
                default:
                    break;
            }
        }
    }

    const handleApiRowSelection = () => {
        setAreApiRowsSelected(apiGridApi.getSelectedNodes().length > 0)
    }

    const handleFdfRowSelection = () => {
        setAreFdfRowsSelected(fdfGridApi.getSelectedNodes().length > 0)
    }

    const deleteSelectedApiRows = () => {
        let rowIndexList = apiGridApi.getSelectedNodes().map(value => value.rowIndex);
        let tempDeleteIds = [...deleteApiIds];
        let rowData = [...ApiRowData]
        rowIndexList.forEach((value) => {
            let nodeData = apiGridApi.getRowNode(value)
            if (nodeData.data.hasOwnProperty('sales_report_id') && !has(tempDeleteIds, { sales_report_id: nodeData.data.sales_report_id })) {
                tempDeleteIds.push({ sales_report_id: nodeData.data.sales_report_id })
            }
        })

        let finalData = rowData.filter((value, index) => {
            return !rowIndexList.includes(index)
        })
        setApiRowData(finalData)
        setDeleteApiIds(tempDeleteIds)
        apiGridApi.deselectAll()
    }

    const deleteSelectedFdfRows = () => {
        let rowIndexList = fdfGridApi.getSelectedNodes().map(value => value.rowIndex);
        let tempDeleteIds = [...deleteApiIds];
        let rowData = [...FdfRowData]
        rowIndexList.forEach((value) => {
            let nodeData = fdfGridApi.getRowNode(value)
            if (nodeData.data.hasOwnProperty('sales_report_id') && !has(tempDeleteIds, { sales_report_id: nodeData.data.sales_report_id })) {
                tempDeleteIds.push({ sales_report_id: nodeData.data.sales_report_id })
            }
        })

        let finalData = rowData.filter((value, index) => {
            return !rowIndexList.includes(index)
        })
        setFdfRowData(finalData)
        setDeleteFdfIds(tempDeleteIds)
        fdfGridApi.deselectAll()
    }

    const setReportHeight = () => {
        return window.innerHeight - 230
    }

    const viewVerificationModal = () => {
        dispatch(getAdminProductsToBeVerified(partnerId, () => {
            setShowVerificationModal(true)
        }))
    }

    return (
        <div>
            <div className='gx-flex-row gx-justify-content-between'>
                {displayHeader()}
                {displayCTA()}
            </div>
            <div className='gx-flex-row gx-justify-content-between'>
                {displayProductVerification()}
            </div>
            <Tabs
                tabPosition='top'
                type='card'
                className='sales-report-tabs'
                tabBarExtraContent={displayGridCta()}
                onChange={(currentTabKey) => { setTabKey(currentTabKey) }}
            >
                <TabPane tab='API' key='api'>
                    {
                        apiProductDropdown && apiProductDropdown.length ?
                            <div>
                                <div
                                    className='ag-theme-balham'
                                    style={{ height: setReportHeight(), paddingBottom: 20 }}
                                >
                                    <AgGridReact
                                        onGridReady={onApiGridReady}
                                        columnDefs={ApiColumnDefs}
                                        rowData={ApiRowData}
                                        defaultColGroupDef={{ marryChildren: true }}
                                        defaultColDef={{
                                            filter: true,
                                            sortable: true,
                                            width: 300,
                                            resizable: true,
                                            editable: (apiSalesList.sales_meta.report_status !== 'Approved' || isUserAdmin),
                                            cellClass: (params) => {
                                                const { data } = params;
                                                const { report_status } = apiSalesList.sales_meta;
                                                if (data) {
                                                    return ((report_status !== 'Approved' || isUserAdmin) ? 'editable-cell' : 'non-editable-cell');
                                                }
                                            },
                                        }}
                                        columnTypes={{
                                            valueColumn: {
                                                valueParser: 'Number(newValue)',
                                                filter: 'agNumberColumnFilter',
                                            },
                                        }}
                                        enableRangeSelection={true}
                                        enableCellChangeFlash={true}
                                        animateRows={true}
                                        rowSelection={'multiple'}
                                        suppressRowClickSelection={true}
                                        onSelectionChanged={handleApiRowSelection}
                                        onCellValueChanged={handleApiCellValueChange}
                                        frameworkComponents={{
                                            searchSelector: SearchSelect
                                        }}

                                    />
                                </div>
                                <div className='gx-flex-row'>
                                    <InputNumber disabled={reportDetails.report_status === 'Approved' && !isUserAdmin} min={0} defaultValue={0} max={10000} onChange={(value) => { setAddApiRowNumber(value) }} />
                                    <Button type='primary' onClick={addApiRow} disabled={reportDetails.report_status === 'Approved' && !isUserAdmin} > Add Row</Button>
                                    <Button onClick={deleteSelectedApiRows} disabled={(reportDetails.report_status === 'Approved' && !isUserAdmin) || !areApiRowsSelected} > Delete Selected Rows</Button>
                                </div>
                            </div>
                            :
                            null
                    }
                </TabPane>
                <TabPane tab='FDF' key='fdf'>
                    {
                        fdfProductDropdown && fdfProductDropdown.length ?
                            <div>
                                <div className='ag-theme-balham' style={{ height: setReportHeight(), paddingBottom: 20 }}>
                                    <AgGridReact
                                        onGridReady={onFdfGridReady}
                                        columnDefs={FdfColumnDefs}
                                        rowData={FdfRowData}
                                        defaultColGroupDef={{ marryChildren: true }}
                                        defaultColDef={{
                                            filter: true,
                                            sortable: true,
                                            width: 300,
                                            editable: (apiSalesList.sales_meta.report_status !== 'Approved' || isUserAdmin),
                                            resizable: true,
                                            cellClass: (params) => {
                                                const { data } = params;
                                                const { report_status } = reportDetails;
                                                if (data) {
                                                    return ((report_status !== 'Approved' || isUserAdmin) ? 'editable-cell' : 'non-editable-cell');
                                                }
                                            }
                                        }}
                                        columnTypes={{
                                            valueColumn: {
                                                valueParser: 'Number(newValue)',
                                                filter: 'agNumberColumnFilter',
                                            },
                                        }}
                                        enableRangeSelection={true}
                                        suppressAggFuncInHeader={true}
                                        enableCellChangeFlash={true}
                                        animateRows={true}
                                        rowSelection={'multiple'}
                                        suppressRowClickSelection={true}
                                        onSelectionChanged={handleFdfRowSelection}
                                        onCellValueChanged={handleFdfCellValueChange}
                                        frameworkComponents={{
                                            searchSelector: SearchSelect
                                        }}
                                    />
                                </div>
                                <div className='gx-flex-row'>
                                    <InputNumber disabled={reportDetails.report_status === 'Approved' && !isUserAdmin} min={0} defaultValue={0} max={10000} onChange={(value) => { setAddFdfRowNumber(value) }} />
                                    <Button type='primary' onClick={addFdfRow} disabled={reportDetails.report_status === 'Approved' && !isUserAdmin} > Add Row</Button>
                                    <Button onClick={deleteSelectedFdfRows} disabled={(reportDetails.report_status === 'Approved' && !isUserAdmin) || !areFdfRowsSelected} > Delete Selected Rows</Button>
                                </div>

                            </div>
                            :
                            null
                    }

                </TabPane>
            </Tabs>
            {
                showVerificationModal ?
                    <ProductVerificationModal
                        visible={showVerificationModal}
                        displayVerificationModal={() => { setShowVerificationModal(true) }}
                        hideVerificationModal={() => { setShowVerificationModal(false) }}
                        partnerId={partnerId}
                        setSalesReport={setSalesReport}
                        statusArray={statusArray}
                    />
                    : null
            }
        </div>
    )
}

export default SalesReport
