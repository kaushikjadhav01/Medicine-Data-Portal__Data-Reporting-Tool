import React from 'react';
import { Table, Select, Button, Tooltip } from 'antd';
import Widget from 'components/Widget/index';
import { DownloadOutlined } from '@ant-design/icons';
import IntlMessages from 'util/IntlMessages';
import { omit } from 'lodash';
import { exportToXLXS } from '../../helpers';
const Option = Select.Option

const DashboardCountryWiseProduct = (props) => {

  const handleChange = (value) => {
    props.updateStatus(value)
  }

  return (
    <Widget styleName='gx-order-history dashboard-min-height'
      title={
        <h2 className='gx-text-capitalize gx-mb-0'>
          Country Wise Product Count</h2>
      } extra={
        <div className='gx-flex-row gx-align-items-center'>
          <Select className='gx-select-md mr-15' defaultValue='Filed' onChange={handleChange}>
            <Option value='Filed'>Filed</Option>
            <Option value='Registered'>Registered</Option>
            <Option value='status'>Future Quarter Status</Option>
          </Select>

          <Tooltip title={<IntlMessages id='report.download' />}>
            <Button
              className='mr-0 mb-0'
              onClick={() => exportToXLXS(props.data.map(val => omit(val, ['key', 'product_id'])), props.status === 'partner' ? 'country-wise-product-count' + '-Filed/Registered' : 'country-wise-product-count' + '-Future Quarter Status')}
              disabled={props.loading}
            >
              <DownloadOutlined className='font-20' />
            </Button>
          </Tooltip>
        </div>

      }>
      <div className='gx-table-responsive'>
        <Table
          className='gx-table-no-bordered'
          columns={props.columns}
          dataSource={props.data}
          bordered={false}
          size='small'
          loading={props.loading}
          scroll={{ y: 300 }} />
      </div>
    </Widget>
  );
};

export default DashboardCountryWiseProduct;
