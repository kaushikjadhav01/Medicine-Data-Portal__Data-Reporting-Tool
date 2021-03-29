import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AgGridReact } from 'ag-grid-react';
import 'ag-grid-community/dist/styles/ag-grid.css';
import 'ag-grid-community/dist/styles/ag-theme-balham.css';
import 'ag-grid-enterprise';
import { Button, Input, Modal, Popover, Form, Badge, Tooltip, Card, Empty } from 'antd';
import { MailOutlined, CheckCircleOutlined, CloseCircleOutlined, DownloadOutlined, LeftOutlined } from '@ant-design/icons';
import $ from 'jquery'
import datepicker from 'jquery-ui/ui/widgets/datepicker';
import AdminNotifications from 'components/AdminNotifications';
import IntlMessages from 'util/IntlMessages';
import { getAdminPdtData, getPdtData, postAdminPdtData, postPdtData, approvePDTReport, submitPDTReport, partnerMarkMessageRead } from '../../../appRedux/actions/ProductDevelopmentTimeline';
import { showMessage, statusArray } from '../../../helpers';
import moment from 'moment';
import { findIndex, isEmpty } from 'lodash'
import { getRole } from '../../../helpers';
import './pdt.css';

const confirm = Modal.confirm;

function getDatePicker() {

    function Datepicker() { }
    Datepicker.prototype.init = function (params) {
        this.eInput = document.createElement('input');
        this.eInput.value = params.value;
        this.eInput.classList.add('ag-input');
        this.eInput.style.height = '100%';
        $(this.eInput).datepicker({ dateFormat: 'mm/dd/yy' });
    };
    Datepicker.prototype.getGui = function () {
        return this.eInput;
    };
    Datepicker.prototype.afterGuiAttached = function () {
        this.eInput.focus();
        this.eInput.select();
    };
    Datepicker.prototype.getValue = function () {
        return this.eInput.value;
    };
    Datepicker.prototype.destroy = function () { };
    Datepicker.prototype.isPopup = function () {
        return false;
    };
    return Datepicker;
}

const DevelopmentTimeline = (props) => {
    const [isDataReady, setIsDataReady] = useState(false);
    const [showReport, setShowReport] = useState(false);
    const [isUserAdmin, setIsUserAdmin] = useState(false);
    const [isUserStaff, setIsUserStaff] = useState(false);
    const [reportDetails, setReportDetails] = useState({});
    const [quarterEditDetails, setQuarterEditDetails] = useState({});
    const [messageCount, setMessageCount] = useState(0);
    const [partnerId, setPartnerId] = useState(null);
    const [gridApi, setGridApi] = useState({});
    const [rowData, setRowData] = useState(null);
    const [quarterDropdown, setQuarterDropdown] = useState([])
    const [quarterDropdownCurrent, setQuarterDropdownCurrent] = useState("Loading...")
    const [isHistoricQuarter, setIsHistoricQuarter] = useState(false)
    const [isNotInitial, setIsNotInitial] = useState(false)
    let [flag, setFlag] = useState(1)
    const [quarterOrder, setQuarterOrder] = useState([]);
    const [columnDefs, setColumnDefs] = useState([
        {
            headerName: 'Products',
            field: 'product',
            editable: false,
            rowGroup: true,
            hide: true,
        }
    ]);
    const { pdtList } = useSelector(({ pdt }) => pdt);
    const [form] = Form.useForm();
    const dispatch = useDispatch();

    useEffect(() => {
        setPDT()
    }, [])

    useEffect(() => {
        if (isDataReady) {
            addQuarter();
        }
    }, [isDataReady])

    useEffect(() => {
        if (isNotInitial) {
            addQuarter();
        }
    }, [flag])

    const navigateBack = () => {
        if (isUserAdmin || isUserStaff) {
            props.history.push('/admin/partner-list')
        }
    }

    const setPDT = (quarter_name = null) => {
        const { id } = props.match.params;
        if (id) {
            setIsUserAdmin(() => {
                return (getRole() === 'ADMIN')
            })
            setIsUserStaff(() => {
                return (getRole() === 'STAFF')
            })
            dispatch(getAdminPdtData(id, (data) => {
                setValues(data)
                setPartnerId(id)
            }, quarter_name))
        } else {
            dispatch(getPdtData((data) => {
                setValues(data)
            }, quarter_name))
        }
    }

    
    const setValues = (data) => {
        setRowData(data.rows);
        setQuarterOrder(data.quarter_order);
        setMessageCount(data.unread_message_count);
        setReportDetails(data.pdt_meta);
        setQuarterEditDetails(data.quarter_editable)
        setShowReport(!isEmpty(data));
        setQuarterDropdown(data.quarter_dropdown)
        setQuarterDropdownCurrent(data.quarter_order[0])
        setFlag(++flag)
    }

    const onGridReady = (params) => {
        setGridApi(params.api);
        setIsDataReady(true);
    }

    const addQuarter = () => {
        const { report_status } = reportDetails;
        const quarterNumber = quarterOrder ? quarterOrder.length : 0
        const column = [
            ...columnDefs,
            {
                headerName: 'Status',
                field: 'product_status',
                width: 150,
                editable: (params) => {
                    return params.data.editable && (isUserAdmin ? true : isUserStaff ? false : isHistoricQuarter ? false : report_status !== 'Approved')
                },
                cellClass: (params) => {
                    const { data } = params;
                    if (data) {
                        return (data.editable) && (isUserAdmin ? true : isUserStaff ? false : isHistoricQuarter ? false : report_status !== 'Approved') ? 'editable-cell' : 'non-editable-cell'
                    }
                },
                cellEditorSelector: (params) => {
                    return {
                        component: 'agRichSelect',
                        params: { values: statusArray.map(value => value.id) }
                    }
                },
                cellClassRules: {
                    'error-cell': (params) => {
                        const { value } = params
                        return (!statusArray.map(value => value.id).includes(value) && value)
                    },
                },
            },
            {
                headerName: 'Notes',
                field: 'notes',
                editable: isUserAdmin ? true : isUserStaff ? false: isHistoricQuarter ? false : report_status !== 'Approved',
                cellClass: (params) => {
                    const { data } = params;
                    if (data) {
                        return (isUserAdmin ? true : isUserStaff ? false: isHistoricQuarter ? false : report_status !== 'Approved') ? 'editable-cell' : 'non-editable-cell'
                    }
                },
                width: 250,
            }
        ];
        for (let i = 0; i < quarterNumber; i++) {
            const obj = {
                headerName: quarterOrder[i],
                children: [
                    {
                        headerName: 'Start Date (MM/DD/YYYY)',
                        field: 'start_date_' + quarterOrder[i],
                        editable: isUserAdmin ? true : isUserStaff ? false: isHistoricQuarter ? false : report_status !== 'Approved',
                        cellEditor: 'datePicker',
                        cellClass: (params) => {
                            const { data } = params;
                            if (data) {
                                return (isUserAdmin ? true : isUserStaff ? false: isHistoricQuarter ? false : report_status !== 'Approved') ? 'editable-cell' : 'non-editable-cell'
                            }
                        },
                        cellClassRules: {
                            'error-cell': (params) => {
                                const { value } = params
                                return (!checkDate(value) && value)
                            },
                        },
                        sortable: false,
                        width: 200
                    },
                    {
                        headerName: 'End Date (MM/DD/YYYY)',
                        field: 'end_date_' + quarterOrder[i],
                        sortable: false,
                        editable: isUserAdmin ? true : isUserStaff ? false: isHistoricQuarter ? false : report_status !== 'Approved',
                        cellClass: (params) => {
                            const { data } = params;
                            if (data) {
                                return (isUserAdmin ? true : isUserStaff ? false: isHistoricQuarter ? false : report_status !== 'Approved') ? 'editable-cell' : 'non-editable-cell'
                            }
                        },
                        cellClassRules: {
                            'error-cell': (params) => {
                                const { value } = params
                                return (!checkDate(value) && value)
                            },
                        },
                        cellEditor: 'datePicker',
                        width: 200
                    }
                ],
            }
            column.push(obj)
        }
        setColumnDefs(column)
        gridApi.setColumnDefs(column)
        gridApi.forEachNode((node) => {
            if (node.key === rowData[0].product) {
                node.setExpanded(true);
            }
        });
        handleUndefinedValues();
        setIsNotInitial(true)
    }

    const handleUndefinedValues = () => {
        let tempRowData = [...rowData];
        gridApi.forEachNode((node) => {
            const { data } = node;
            if (data) {
                quarterOrder.forEach((value) => {
                    if (!data.hasOwnProperty('start_date_' + value)) {
                        tempRowData[findIndex(tempRowData, { stage_id: data.stage_id })]['start_date_' + value] = null;
                        tempRowData[findIndex(tempRowData, { stage_id: data.stage_id })]['end_date_' + value] = null;
                    }
                })
            }
        });
        setRowData(tempRowData)
    }

    const checkDataValues = (dataList) => {
        return !dataList.some(value => checkRow(value))
    }

    const checkRow = (rowData) => {
        let statusFlag = false
        for (let key in rowData) {
            if (rowData.hasOwnProperty(key)) {
                if (key === 'product_status' && rowData['editable'] && !statusArray.map(value => value.id).includes(rowData['product_status'])) {
                    statusFlag = true;
                    break;
                }
            }
        }
        let dateFlag = Object.keys(rowData).filter(value => value.split('_')[0] === 'start' || value.split('_')[0] === 'end')
            .some(value => (!checkDate(rowData[value]) && rowData[value] !== undefined && rowData[value] !== null && rowData[value] !== ''))

        return statusFlag || dateFlag
    }

    const saveReportBeforeAction = (callback) => {
        gridApi.stopEditing();
        gridApi.selectAll();
        const obj = {};
        let selectedNodes = gridApi.getSelectedNodes().filter(d => d.data);
        if (checkDataValues(selectedNodes.map(value => value.data))) {
            selectedNodes.forEach(node => {
                const { product_id, stage_id, editable, product_status, notes } = node.data;
                if (obj[product_id] === undefined) {
                    obj[product_id] = {}
                }
                if (obj[product_id][stage_id] === undefined) {
                    obj[product_id][stage_id] = {}
                }
                if (editable) {
                    obj[product_id]['product_status'] = product_status;
                }
                obj[product_id][stage_id]['notes'] = notes;
                quarterOrder.forEach((quarter) => {
                    const start_date_name = 'start_date_' + quarter
                    const end_date_name = 'end_date_' + quarter

                    const start_date = node.data[start_date_name]
                    const end_date = node.data[end_date_name]

                    obj[product_id][stage_id][quarter] = {
                        start_date: start_date === '' ? null : start_date,
                        end_date: end_date === '' ? null : end_date
                    }
                })
            })
            if (isUserAdmin) {
                if (isHistoricQuarter){
                    dispatch(postAdminPdtData(partnerId, obj, callback(), quarterDropdownCurrent))
                }else{
                    dispatch(postAdminPdtData(partnerId, obj, callback()))
                }
            } else {
                dispatch(postPdtData(obj, callback()))
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
                                dispatch(submitPDTReport(
                                    { message: msg },
                                    () => {
                                        showMessage('success', 'Report has been submitted to the admin!');
                                        setPDT();
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
        dispatch(approvePDTReport(data, () => {
            if (isApproved) {
                showMessage('success', 'Report Approved!');
            } else {
                showMessage('success', 'Report Rejected!');
            }
            form.resetFields(['commentData'])
            setPDT()
        }))
    }

    const showCommentsForm = () => {
        return (
            <Form
                form={form}
                layout="vertical"
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
                    <Input.TextArea placeholder="Enter comments here" />
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

    const displayHeader = () => {
        if (showReport) {
            if (reportDetails) {
                const { partner_name, quarter_name, report_status, approval_time, submission_time } = reportDetails;
                return (
                    <div className='gx-mb-4'>
                        <h1 className='title '>{isUserAdmin || isUserStaff ? <Tooltip title='Back'><LeftOutlined className='mr-10' onClick={navigateBack} /></Tooltip> : null}Product Development Timeline {isUserAdmin || isUserStaff ? <span className='mr-5'>for <span className='text-capitalize'>{partner_name}</span></span> : null}
                            <span className='text-capitalize'>({quarter_name})</span>
                        </h1>
                        <h4 className={isUserAdmin || isUserStaff ? 'ml-30' : ''}>Report Status:&nbsp;
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
                    <h1 className='title '>{isUserAdmin ? <LeftOutlined className='mr-5' onClick={navigateBack} /> : null}Product Development Timeline {isUserAdmin && reportDetails ? <span>for <span className='text-capitalize'>{reportDetails.partner_name}</span></span> : null}
                    </h1>
                </div>
            )
        }
    }

    const displayCTA = () => {
        if (showReport) {
            const { report_status } = reportDetails
            if (isUserAdmin || isUserStaff) {
                return (
                    <>
                    <div className='gx-flex-row'>
                        <Button
                            type='primary'
                            onClick={() => { saveData(false) }}
                            id='pdt-save'
                            disabled={isUserStaff}
                        >
                            Save
                        </Button>
                        <Button
                            className='gx-btn-success'
                            onClick={() => showApproveConfirm()}
                            id='pdt-approve'
                            disabled={isHistoricQuarter || isUserStaff}
                        >
                            Approve
                        </Button>
                        <Button
                            className='gx-btn-danger'
                            onClick={() => showRejectConfirm()}
                            id='pdt-reject'
                            disabled={isHistoricQuarter || isUserStaff}
                        >
                            Reject
                        </Button>
                        <Tooltip title={<IntlMessages id='report.download' />}>
                            <Button onClick={() => downloadExcel()} id='pdt-download-excel' >
                                <DownloadOutlined />
                            </Button>
                        </Tooltip>
                        <Badge count={messageCount}>
                            <Popover overlayClassName='gx-popover-horizantal' placement='bottomRight'
                                content={<AdminNotifications isAdmin={isUserAdmin} data={pdtList && pdtList.messages ? pdtList.messages : []} />} trigger='click'>
                                <Button
                                    className='mr-0'
                                    id='pdt-msg-box'
                                    onClick={() => dispatch(partnerMarkMessageRead(
                                        isUserAdmin ? 'admin' : 'partner',
                                        () => setMessageCount(0)
                                    ))}
                                >
                                    <MailOutlined />
                                </Button>
                            </Popover>
                        </Badge>
                    </div>
                    <div className="quarter-dropdown-container-admin-pdt">
                        <select onChange={changeQuarter} className="quarter-dropdown">
                            {
                                quarterDropdown.map((quarter) => (
                                    <option value={quarter} className="quarter-dropdown-options">{quarter}</option>
                                ))
                            }
                        </select>
                    </div>
                    </>
                )
            } else {
                return (
                    <>
                        <div className='gx-flex-row'>
                            <Button
                                type='primary'
                                onClick={() => { saveData(false) }}
                                disabled={report_status === 'Approved' || isHistoricQuarter}
                                id='pdt-save'
                            >
                                Save
                            </Button>
                            <Button
                                onClick={() => showSubmitConfirm()}
                                className='gx-btn-success'
                                disabled={report_status === 'Approved' || isHistoricQuarter}
                                id='pdt-submit'
                            >
                                Submit Report
                            </Button>
                            <Badge count={messageCount}>
                                <Popover overlayClassName='gx-popover-horizantal' placement='bottomRight'
                                    content={<AdminNotifications data={pdtList && pdtList.messages ? pdtList.messages : []} />} trigger='click'>
                                    <Button
                                        id='pdt-msg-box'
                                        className='mr-0'
                                        onClick={() => dispatch(partnerMarkMessageRead(
                                            isUserAdmin ? 'admin' : 'partner',
                                            () => setMessageCount(0)
                                        ))}
                                    >
                                        <MailOutlined />
                                    </Button>
                                </Popover>
                            </Badge>
                            <Tooltip title={<IntlMessages id='report.download' />}>
                                <Button id='pdt-download-excel' className='mr-0' onClick={() => downloadExcel()} >
                                    <DownloadOutlined />
                                </Button>
                            </Tooltip>
                            <div className="quarter-dropdown-container-user-pdt">
                                <select onChange={changeQuarter} className="quarter-dropdown">
                                    {
                                        quarterDropdown.map((quarter) => (
                                            <option value={quarter} className="quarter-dropdown-options">{quarter}</option>
                                        ))
                                    }
                                </select>
                            </div>
                        </div>
                    </>
                )
            }
        } else {
            return null
        }
    }

    const downloadExcel = () => {
        gridApi.selectAll();
        gridApi.exportDataAsExcel({
            sheetName: 'pdt',
            fileName: 'pdt'
        })
        gridApi.deselectAll();
    }

    const checkDate = (value) => {
        return moment(value, 'M/D/YYYY').format('M/D/YYYY') === value || moment(value, 'MM/DD/YYYY').format('MM/DD/YYYY') === value
    }

    const handleCellValueChange = (params) => {
        const { colDef, node, newValue, oldValue } = params;
        let rowNode = gridApi.getRowNode(node.id);
        let fieldNameList = colDef.field.split('_');
        if (newValue !== oldValue) {
            if (fieldNameList[0] === 'start' || fieldNameList[0] === 'end') {
                if (newValue === ' ') {
                    rowNode.setDataValue(colDef.field, null)
                }
            }
        }
    }

    const setReportHeight = () => {
        return window.innerHeight - 120
    }

    const changeQuarter = (e) => {
        setColumnDefs([
            {
                headerName: 'Products',
                field: 'product',
                editable: false,
                rowGroup: true,
                hide: true,
            }
        ])
        if (e.target.value !== quarterDropdown[0]){
            setPDT(e.target.value)
            setIsHistoricQuarter(true)
        }else{
            setPDT()
            setIsHistoricQuarter(false)
        }
    }

    return (
        <div>
            <div className='gx-flex-row gx-justify-content-between'>
                {displayHeader()}
                {displayCTA()}
            </div>
            {
                showReport ?
                    <div className='ag-theme-balham ag-scroll-bar-fix' style={{ height: setReportHeight(), paddingBottom: 20 }}>
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
                            autoGroupColumnDef={{
                                headerName: 'Products',
                                field: 'stage',
                                editable: false,
                                minWidth: 250,
                            }}
                            suppressRowTransform={true}
                            enableRangeSelection={true}
                            enableCellChangeFlash={true}
                            onCellValueChanged={handleCellValueChange}
                            animateRows={true}
                            components={{ datePicker: getDatePicker() }}
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

export default DevelopmentTimeline

