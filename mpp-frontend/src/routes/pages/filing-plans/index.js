import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AgGridReact } from 'ag-grid-react';
import 'ag-grid-community/dist/styles/ag-grid.css';
import 'ag-grid-community/dist/styles/ag-theme-balham.css';
import 'ag-grid-enterprise';
import IntlMessages from 'util/IntlMessages';
import { Button, Input, Modal, Popover, Form, Badge, Tooltip, Card, Empty } from 'antd';
import { MailOutlined, CheckCircleOutlined, CloseCircleOutlined, DownloadOutlined, LeftOutlined } from '@ant-design/icons';
import AdminNotifications from 'components/AdminNotifications';
import { showMessage } from '../../../helpers';
import { approveFilingPlansReport, getAdminFilingPlansData, getFilingPlansData, partnerMarkFilingPlansMessageRead, postAdminFilingPlansData, postFilingPlansData, submitFilingPlansReport } from '../../../appRedux/actions/FilingPlans';
import moment from 'moment';
import { findIndex, isEmpty } from 'lodash';

const confirm = Modal.confirm;

const FilingPlans = (props) => {
    const [isDataReady, setIsDataReady] = useState(false);
    const [showReport, setShowReport] = useState(false);
    const [isUserAdmin, setIsUserAdmin] = useState(false);
    const [messageCount, setMessageCount] = useState(0);
    const [partnerId, setPartnerId] = useState(null);
    const [gridApi, setGridApi] = useState({});
    const [columnApi, setColumnApi] = useState({});
    const [rowData, setRowData] = useState(null);
    const [productList, setProductList] = useState([]);
    const [reportDetails, setReportDetails] = useState({});
    const [apiStatusArray, setApiStatusArray] = useState([]);
    const [fdfStatusArray, setFdfStatusArray] = useState([]);
    const [columnDefs, setColumnDefs] = useState([
        {
            headerName: 'Country',
            field: 'country',
            editable: false
        }
    ]);
    const plansList = useSelector(({ filingPlans }) => filingPlans.plansList);
    const [form] = Form.useForm();
    const dispatch = useDispatch();

    useEffect(() => {
        setFilingPlans()
        return () => {
            setIsDataReady(false)
        }
    }, [])

    useEffect(() => {
        if (isDataReady) {
            addProduct();
        }
    }, [isDataReady])

    const navigateBack = () => {
        if (isUserAdmin) {
            props.history.push('/admin/partner-list')
        }
    }

    const setFilingPlans = () => {
        const { id } = props.match.params;
        if (id) {
            setIsUserAdmin(true)
            dispatch(getAdminFilingPlansData(id, (data) => {
                setValues(data)
                setPartnerId(id)
            }))
        } else {
            dispatch(getFilingPlansData((data) => {
                setValues(data)
            }))
        }
    }

    const setValues = (data) => {
        let rowData = data.rows ? data.rows.map(value => {
            let rowValue = { ...value };
            data.product_details.forEach(
                value => {
                    if (!rowValue.hasOwnProperty(value.product_name) || !rowValue[value.product_name]) {
                        rowValue[value.product_name] = '0'
                    }
                }
            )
            return rowValue
        }) : [];
        setRowData(rowData);
        setProductList(data.product_details)
        setMessageCount(data.unread_message_count)
        setReportDetails(data.filing_meta);
        setApiStatusArray(data.status_dropdown['API'])
        setFdfStatusArray(data.status_dropdown['FDF'])
        setShowReport(!isEmpty(data))
    }

    const onGridReady = (params) => {
        setGridApi(params.api);
        setColumnApi(params.columnApi)
        setIsDataReady(true)
    }

    const addProduct = () => {
        const { report_status } = reportDetails;
        const column = [...columnDefs];
        productList.forEach((value) => {
            const obj = {
                headerName: value.product_name,
                field: value.product_name,
                editable: isUserAdmin || report_status !== 'Approved',
                cellEditorSelector: (params) => {
                    return {
                        component: 'agRichSelect',
                        params: { values: value.product_type === 'API' ? apiStatusArray : fdfStatusArray }
                    }
                },
                cellClass: (params) => {
                    const { data } = params;
                    if (data) {
                        return ((report_status !== 'Approved' || isUserAdmin) ? 'editable-cell' : 'non-editable-cell');
                    }
                },
                cellClassRules: {
                    'error-cell': (params) => {
                        if (value.product_type === 'API') {
                            return !apiStatusArray.includes(params.value)
                        } else {
                            return !fdfStatusArray.includes(params.value)
                        }
                    },
                },
                width: 200
            }
            column.push(obj)
        })
        setColumnDefs(column)
        gridApi.setColumnDefs(column)
    }

    const checkDataValues = (dataList) => {
        return !dataList.some(value => checkRow(value))
    }

    const checkRow = (rowData) => {
        let apiFlag = Object.keys(rowData).filter(value => productList
            .map(d => d.product_name).includes(value) && productList[findIndex(productList, { 'product_name': value })].product_type === 'API')
            .some(val => !apiStatusArray.includes(rowData[val]))

        let fdfFlag = Object.keys(rowData).filter(value => productList
            .map(d => d.product_name).includes(value) && productList[findIndex(productList, { 'product_name': value })].product_type === 'FDF')
            .some(val => !fdfStatusArray.includes(rowData[val]))

        return apiFlag || fdfFlag
    }

    const saveReportBeforeAction = (callback) => {
        gridApi.stopEditing();
        gridApi.selectAll();
        const obj = {}
        let selectedNodes = gridApi.getSelectedNodes().filter(d => d.data);
        if (checkDataValues(selectedNodes.map(value => value.data))) {
            selectedNodes.forEach(node => {
                const { country_id } = node.data;
                if (obj[country_id] === undefined) {
                    obj[country_id] = {}
                }
                productList.forEach((value) => {
                    obj[country_id][value.product_id] = node.data[value.product_name]
                })
            })
            if (isUserAdmin) {
                dispatch(postAdminFilingPlansData(partnerId, obj, callback()))
            } else {
                dispatch(postFilingPlansData(obj, callback()))
            }
            gridApi.deselectAll()
        } else {
            Modal.error({
                title: 'Invalid data!',
                content: 'Please input valid entries!',
            });
            gridApi.deselectAll()
        }
    }

    const saveData = () => {
        saveReportBeforeAction(
            () => {
                showMessage('success', 'Data recorded successfully!')
            }
        )
    }

    const showSubmitConfirm = () => {
        saveReportBeforeAction(
            () => {
                confirm({
                    content: showCommentsForm(),
                    okText: 'Submit',
                    cancelText: 'Cancel',
                    title: 'Do you want to submit the report?',
                    className: 'btn-confirm-green',
                    onOk(close) {
                        form.validateFields().then(
                            values => {
                                let msg = values.commentData ? values.commentData : '';
                                dispatch(submitFilingPlansReport(
                                    { message: msg },
                                    () => {
                                        showMessage('success', 'Report has been submitted to the admin!');
                                        setFilingPlans();
                                        form.resetFields(['commentData'])
                                    }
                                ))
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

    const approver = (msg, isApproved) => {
        let data = {
            'partner_id': partnerId,
            'message': msg,
            'is_approved': isApproved
        }
        dispatch(approveFilingPlansReport(data, () => {
            if (isApproved) {
                showMessage('success', 'Report Approved!');
            } else {
                showMessage('success', 'Report Rejected!');
            }
            form.resetFields(['commentData'])
            setFilingPlans()
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
                        {
                            isUserAdmin ? 'Add comments for partner:' : 'Add comments for admin:'
                        }
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
                                let msg = values.commentData ? values.commentData : '';
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
                                let msg = values.commentData ? values.commentData : '';
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

    const downloadExcel = () => {
        gridApi.selectAll();
        gridApi.exportDataAsExcel({
            sheetName: 'filing-plans',
            fileName: 'filing-plans'
        })
        gridApi.deselectAll();
    }

    const displayHeader = () => {
        if (showReport) {
            if (reportDetails) {
                const { partner_name, quarter_name, report_status, approval_time, submission_time } = reportDetails;
                return (
                    <div className='gx-mb-4'>
                        <h1 className='title '>{isUserAdmin ? <Tooltip title='Back'><LeftOutlined className='mr-10' onClick={navigateBack} /></Tooltip> : null}Filing Plans {isUserAdmin ? <span className='mr-5'>for <span className='text-capitalize'>{partner_name}</span></span> : null}
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
            }
        } else {
            return (
                <div className='gx-mb-4'>
                    <h1 className='title '>{isUserAdmin ? <LeftOutlined className='mr-5' onClick={navigateBack} /> : null} Filing Plans{isUserAdmin && reportDetails ? <span>for <span className='text-capitalize'>{reportDetails.partner_name}</span></span> : null}
                    </h1>
                </div>
            )
        }

    }

    const displayCTA = () => {
        if (showReport) {
            const { report_status } = reportDetails
            if (isUserAdmin) {
                return (
                    <div className='gx-flex-row'>
                        <Button
                            type='primary'
                            onClick={() => { saveData(false) }}
                        >
                            Save
                        </Button>
                        <Button
                            className='gx-btn-success'
                            onClick={() => showApproveConfirm()}
                        >
                            Approve
                        </Button>
                        <Button
                            className='gx-btn-danger'
                            onClick={() => showRejectConfirm()}
                        >
                            Reject
                        </Button>
                        <Tooltip title={<IntlMessages id='report.download' />}>
                            <Button onClick={() => downloadExcel()} >
                                <DownloadOutlined />
                            </Button>
                        </Tooltip>
                        <Badge count={messageCount}>
                            <Popover overlayClassName='gx-popover-horizantal' placement='bottomRight'
                                content={<AdminNotifications isAdmin={isUserAdmin} data={plansList && plansList.messages ? plansList.messages : []} />} trigger='click'>
                                <Button
                                    className='mr-0'
                                    onClick={() => dispatch(partnerMarkFilingPlansMessageRead(
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
                    <div className='gx-flex-row'>
                        <Button
                            type='primary'
                            onClick={() => { saveData(false) }}
                            disabled={report_status === 'Approved'}
                        >
                            Save
                        </Button>
                        <Button
                            onClick={() => showSubmitConfirm()}
                            className='gx-btn-success'
                            disabled={report_status === 'Approved'}
                        >
                            Submit Report
                        </Button>
                        <Badge count={messageCount}>
                            <Popover overlayClassName='gx-popover-horizantal' placement='bottomRight'
                                content={<AdminNotifications isAdmin={isUserAdmin} data={plansList && plansList.messages ? plansList.messages : []} />} trigger='click'>
                                <Button
                                    className='mr-0'
                                    onClick={() => dispatch(partnerMarkFilingPlansMessageRead(
                                        isUserAdmin ? 'admin' : 'partner',
                                        () => setMessageCount(0)
                                    ))}
                                >
                                    <MailOutlined />
                                </Button>
                            </Popover>
                        </Badge>
                        <Tooltip title={<IntlMessages id='report.download' />}>
                            <Button className='mr-0' onClick={() => downloadExcel()} >
                                <DownloadOutlined />
                            </Button>
                        </Tooltip>
                    </div>
                )
            }
        } else {
            return null
        }

    }

    const handleCellValueChange = (params) => {
        const { colDef, node, newValue, oldValue } = params;
        let rowNode = gridApi.getRowNode(node.id);
        if (newValue !== oldValue && newValue === '') {
            rowNode.setDataValue(colDef.field, '0');
        }
    }

    const setReportHeight = () => {
        return window.innerHeight - 120
    }

    return (
        <div>
            <div className='gx-flex-row gx-justify-content-between'>
                {displayHeader()}
                {displayCTA()}
            </div>
            {
                showReport ?
                    <div className='ag-theme-balham' style={{ height: setReportHeight(), paddingBottom: 20 }}>
                        <AgGridReact
                            onGridReady={onGridReady}
                            columnDefs={columnDefs}
                            rowData={rowData}

                            defaultColGroupDef={{ marryChildren: true }}
                            defaultColDef={{
                                filter: true,
                                sortable: true,
                                width: 300,
                                resizable: true,
                            }}
                            enableRangeSelection={true}
                            enableCellChangeFlash={true}
                            onCellValueChanged={handleCellValueChange}
                            animateRows={true}
                        />
                    </div>
                    :
                    <Card>
                        <Empty
                            description={
                                (<p className='empty-msg'>
                                    <span>No Data Available</span><br />
                                    <span>Please contact Admin for more information!</span>
                                </p>)
                            }
                        />
                    </Card>
            }

        </div>
    )
}

export default FilingPlans
