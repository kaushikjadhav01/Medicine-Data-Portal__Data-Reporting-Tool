import React from 'react';
import { Table, Tooltip, Button } from 'antd';
import Widget from 'components/Widget/index';
import { exportToXLXS } from '../../helpers';
import { DownloadOutlined } from '@ant-design/icons';
import IntlMessages from 'util/IntlMessages';
import { omit } from 'lodash';

const columns = [
  {
    title: 'Product Name',
    dataIndex: 'product_name',
    fixed: 'left',
    width: 150
  },
  {
    title: 'UNDER DEVELOPMENT',
    dataIndex: 'UNDER_DEVELOPMENT',
    width: 100,
  },
  {
    title: 'DROPPED',
    dataIndex: 'DROPPED',
    width: 100
  },
  {
    title: 'ON HOLD',
    dataIndex: 'ON_HOLD',
    width: 100
  },
  {
    title: 'FILED',
    dataIndex: 'FILED',
    width: 100
  },
  {
    title: 'APPROVED',
    dataIndex: 'APPROVED',
    width: 100
  }
];


const DashboardProductWise = (props) => {
  return (
    <Widget styleName='gx-order-history dashboard-min-height'
      title={
        <div className='gx-flex-row gx-align-items-center'>
          <h2 className='gx-text-capitalize line-height-27'>
            Product Wise Company Count</h2>
        </div>
      } extra={
        <div className='gx-flex-row gx-align-items-center'>
          <Tooltip title={<IntlMessages id='report.download' />}>
            <Button
              disabled={props.loading}
              className='mr-0 mb-0'
              onClick={() => exportToXLXS(props.data.map(val => omit(val, 'key')), 'product-wise-company')} >
              <DownloadOutlined className='font-20' />
            </Button>
          </Tooltip>
        </div>
      }
    >
      <div
        className='gx-table-responsive'
      >
        <Table
          className='gx-table-no-bordered mpp-list-table'
          columns={columns}
          dataSource={props.data}
          scroll={{ y: 300 }}
          bordered={false}
          size='small'
          loading={props.loading}
        />
      </div>
    </Widget>
  );
};

export default DashboardProductWise;
