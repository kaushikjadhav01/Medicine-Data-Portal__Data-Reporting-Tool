import React from 'react';
import Widget from 'components/Widget/index';
import { Tooltip, Button,Table } from 'antd';
import IntlMessages from 'util/IntlMessages';
import { exportToXLXS } from '../../helpers';
import { omit } from 'lodash';
import { DownloadOutlined } from '@ant-design/icons';

const DashboardSalesCompanyWisePeriod = (props) => {
  return (
    <Widget styleName='gx-order-history dashboard-min-height'
      title={
        <div className='gx-flex-row gx-align-items-center'>
          <h2 className='gx-text-capitalize line-height-27'>
            Over Time</h2>
        </div>
      } extra={
        <div className='gx-flex-row gx-align-items-center'>
          <Tooltip title={<IntlMessages id='report.download' />}>
            <Button
              className='mr-0 mb-0'
              onClick={() => exportToXLXS(props.data.map(val => omit(val, 'key')), 'company-wise-sales-' + props.status)}
              disabled={props.loading}
            >
              <DownloadOutlined className='font-20' />
            </Button>
          </Tooltip>
        </div>
      }>
      <div className='gx-table-responsive'>
        <Table className='gx-table-no-bordered mpp-list-table'
          loading={props.loading}
          columns={props.columns}
          dataSource={props.data}
          scroll={{ y: 300 }}
          bordered={false}
          size='small' />
      </div>
    </Widget>
  );
};

export default DashboardSalesCompanyWisePeriod;
