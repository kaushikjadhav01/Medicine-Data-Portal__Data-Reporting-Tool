import React from "react";
import {Table} from "antd";
import Widget from "components/Widget/index";

const columns = [
  {
    title: 'Currency',
    dataIndex: 'currency',
  },
  {
    title: 'Rate (USD)',
    dataIndex: 'rate',
  },
  {
    title: 'DATE',
    dataIndex: 'date',
  },
  {
    title: 'FEE',
    dataIndex: 'fee',
    render: (text) => {
      return <span className="gx-text-red">{text}</span>
    },
  }
];

const data = [
  {
    key: '1',
    currency: '0.24 BTC',
    rate: '1 BTC = $740',
    date: '08.10.17',
    fee: '-$2.33'
  },
  {
    key: '2',
    currency: '0.34 RPL',
    rate: '1 RPL = $80.2',
    date: '08.03.17',
    fee: '-$1.23'
  },
  {
    key: '3',
    currency: '0.24 BTC',
    rate: '1 BTC = $740',
    date: '07.29.17',
    fee: '-$3.22'
  },
  {
    key: '4',
    currency: '0.22 BTC',
    rate: '1 BTC = $740',
    date: '07.28.17',
    fee: '-$3.22'
  },
  {
    key: '5',
    currency: '0.74 LTE',
    rate: '1 LTE = $99',
    date: '05.22.17',
    fee: '-$2.21'
  }
];

const OrderHistory = () => {
  return (
    <Widget styleName="gx-order-history"
            title={
              <h2 className="h4 gx-text-capitalize gx-mb-0">
                Order History</h2>
            } extra={
      <p className="gx-text-primary gx-mb-0 gx-pointer">Detailed History</p>
    }>
      <div className="gx-table-responsive">
        <Table className="gx-table-no-bordered" columns={columns} dataSource={data} pagination={false} bordered={false}
               size="small"/>
      </div>
    </Widget>
  );
};

export default OrderHistory;
