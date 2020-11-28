import React from "react";
import {Table} from "antd";
import Widget from "components/Widget/index";

const columns = [
  {
    title: 'Account Holder Name',
    dataIndex: 'image',
    render: (text, record) => {
      return <div className="gx-flex-row gx-align-items-center">
        <img className="gx-rounded-circle gx-size-30 gx-mr-2" src={text} alt=""/>
        <p className="gx-mb-0">{record.name}</p>
      </div>
    },
  },
  {
    title: 'Last Transfer',
    dataIndex: 'transfer',
    render: (text, record) => {
      return <span className="gx-text-grey">{record.transfer}</span>
    },

  },
  {
    title: 'Action',
    dataIndex: 'status',
    render: (text) => {
      return <span className="gx-text-primary gx-pointer">
        <i className="icon icon-forward gx-fs-sm gx-mr-2"/>{text}</span>
    },
  },

];

const data = [
  {
    key: '1',
    name: 'Jeniffer L.',
    transfer: '2 hrs. ago',
    image: require('assets/images/avatar/a5.png'),
    status: 'Pay'
  },
  {
    key: '2',
    name: 'Jim Green',
    transfer: '17 days ago',
    image: require('assets/images/avatar/a6.png'),
    status: 'Pay'
  },
  {
    key: '3',
    name: 'Joe Black',
    transfer: '1 month ago',
    image: require('assets/images/avatar/a7.png'),
    status: 'Pay'
  },
  {
    key: '4',
    name: 'Mila Alba',
    transfer: '1 month ago',
    image: require('assets/images/avatar/a10.png'),
    status: 'Pay'
  }
];

const SendMoney = () => {
  return (
    <Widget
      title={
        <h2 className="h4 gx-text-capitalize gx-mb-0">
          Send Money to</h2>
      } extra={
      <p className="gx-text-primary gx-mb-0 gx-pointer gx-d-none gx-d-sm-block">
        <i className="icon icon-add-circle gx-fs-lg gx-d-inline-flex gx-vertical-align-middle"/> Add New Account</p>
    }>
      <div className="gx-table-responsive">
        <Table className="gx-table-no-bordered" columns={columns} dataSource={data} pagination={false}
               size="small"/>
      </div>
      <p className="gx-text-primary gx-mb-0 gx-pointer gx-d-block gx-d-sm-none gx-mb-0 gx-mt-3">
        <i className="icon icon-add-circle gx-fs-lg gx-d-inline-flex gx-vertical-align-middle"/> Add New Account</p>
    </Widget>
  );
};

export default SendMoney;
