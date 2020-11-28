import React from 'react';
import { Table, Tooltip, Button } from 'antd';
import Widget from 'components/Widget/index';
import { exportToXLXS } from '../../helpers';
import { DownloadOutlined } from '@ant-design/icons';
import IntlMessages from 'util/IntlMessages';
import { omit } from 'lodash';

const DashboardSalesCountryWiseCompany = (props) => {
  return (
    <Widget styleName='gx-order-history dashboard-min-height'
      title={
        <div className='gx-flex-row gx-align-items-center'>
          <h2 className='gx-text-capitalize line-height-27'>
            By Company</h2>
        </div>
      } extra={
        <div className='gx-flex-row gx-align-items-center'>
          <Tooltip title={<IntlMessages id='report.download' />}>
            <Button
              disabled={props.loading}
              className='mr-0 mb-0'
              onClick={() => exportToXLXS(props.data.map(val => omit(val, ['country_id','key'])), 'country-wise-company-sales')} >
              <DownloadOutlined className='font-20' />
            </Button>
          </Tooltip>
        </div>
      }
    >
      <div className='gx-table-responsive'>
        <Table className='gx-table-no-bordered'
          columns={props.columns}
          dataSource={props.data}
          scroll={{ y: 300 }}
          bordered={false}
          loading={props.loading}
          size='small' />
      </div>
    </Widget>
  );
};

export default DashboardSalesCountryWiseCompany;
