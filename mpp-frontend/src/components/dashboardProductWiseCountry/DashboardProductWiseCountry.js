import React from 'react';
import Widget from 'components/Widget/index';
import { Select, Tooltip, Button,Table } from 'antd';
import IntlMessages from 'util/IntlMessages';
import { exportToXLXS } from '../../helpers';
import { omit } from 'lodash';
import { DownloadOutlined } from '@ant-design/icons';

const Option = Select.Option

const DashboardProductWiseCountry = (props) => {
  const handleChange = (value) => {
    props.updateStatus(value)
  }
  return (
    <Widget styleName='gx-order-history dashboard-min-height'
      title={
        <h2 className='gx-text-capitalize gx-mb-0'>
          Product Wise Country Count</h2>
      } extra={
        <div className='gx-flex-row gx-align-items-center'>
          <Select className='gx-select-md mr-15' defaultValue='Filed' onChange={handleChange}>
            <Option value='Filed'>Filed</Option>
            <Option value='Registered'>Registered</Option>
            <Option value='Filing-Planned'>Filing-Planned</Option>
            <Option value='Future-Quarters'>Future-Quarters</Option>
          </Select>

          <Tooltip title={<IntlMessages id='report.download' />}>
            <Button
              className='mr-0 mb-0'
              onClick={() => exportToXLXS(props.data.map(val => omit(val, 'key')), 'product-wise-country-' + props.status)}
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
          scroll={{ y: 300 }}
          bordered={false}
          size='small'
          loading={props.loading}
        />
      </div>
    </Widget>
  );
};

export default DashboardProductWiseCountry;
