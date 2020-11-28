import React from 'react';
import Widget from 'components/Widget/index';
import { Select, Tooltip, Button,Table } from 'antd';
import IntlMessages from 'util/IntlMessages';
import { exportToXLXS } from '../../helpers';
import { omit } from 'lodash';
import { DownloadOutlined } from '@ant-design/icons';

const DashboardSalesProductWiseCountry = (props) => {
  return (
    <Widget styleName='gx-order-history dashboard-min-height'
      title={
        <h2 className='gx-text-capitalize gx-mb-0'>
          In Countries</h2>
      } extra={
        <div className='gx-flex-row gx-align-items-center'>
          <Tooltip title={<IntlMessages id='report.download' />}>
            <Button
              disabled={props.loading}
              className='mr-0 mb-0'
              onClick={() => exportToXLXS(props.data.map(val => omit(val, ['product_id','country_id','key'])), 'product-wise-country-sales')} >
              <DownloadOutlined className='font-20' />
            </Button>
          </Tooltip>
        </div>
      }
    >
      <div className='gx-table-responsive'>
        <Table className='gx-table-no-bordered'
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

export default DashboardSalesProductWiseCountry;
