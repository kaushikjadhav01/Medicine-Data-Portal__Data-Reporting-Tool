import React from 'react';
import Widget from 'components/Widget';
import { Col } from 'antd';
import { FileSearchOutlined, BarChartOutlined } from '@ant-design/icons'
import moment from 'moment';
import './template-tile.css'

const TemplateTile = (props) => {
  const navigate = () => {
    const { template_type } = props.data
    if (template_type === 'pdt') {
      props.history.push('/partner/development-timeline')
    }
    else if (template_type === 'filing plan') {
      props.history.push('/partner/filing-plans')
    }
    else if (template_type === 'sales') {
      props.history.push('/partner/sales-report')
    }

  }
  const { template_type, report_status, no_of_days_to_submit, last_message } = props.data

  return (
    <Col span={8} onClick={navigate} className='tile-hover'>
      <Widget  >
        <div className='gx-flex-column template-tile-icon'>
          {
            template_type === 'pdt' ?
              <span className='font-45'><i className='icon icon-timeline mb-20 color-purple' /></span> :
              template_type === 'filing plan' ?
                <FileSearchOutlined className='color-purple font-40' /> :
                <BarChartOutlined className='color-purple font-40' />
          }
          <h3 className='color-purple mb-30'>
            {
              template_type === 'pdt' ?
                'Product Development Timeline' :
                template_type === 'filing plan' ?
                  'Filing Plan' :
                  'Sales Report'
            }
          </h3>
        </div>
        <div key={props.key} className='gx-media gx-align-items-center gx-flex-nowrap gx-pro-contact-list'>
          <div className='gx-media-body'>
            <p className='gx-fs-lg color-black'>For Quarter: <span className='gx-mb-0 gx-fs-lg color-gray'>
              {props.quarter ? props.quarter : '---'}</span></p>
            <p className='gx-fs-lg color-black'>Last Date of Submission:
            <span className='gx-mb-0 gx-fs-lg color-red'>{no_of_days_to_submit ? ' ' + moment(no_of_days_to_submit).format('Do MMM YYYY') : '---'}</span>
            </p>
            <p className='gx-fs-lg color-black'>Report Status:<span className={
              report_status === 'Approved' ? 'gx-mb-0 gx-fs-lg color-green' :
                report_status === 'Rejected' ? 'gx-mb-0 gx-fs-lg color-red' : 'gx-mb-0 gx-fs-lg color-blue'
            }> {report_status}</span>
            </p>
            <p className='gx-fs-lg color-black'>Last Message: <span className='gx-mb-0 gx-fs-lg color-gray'>
              {last_message ? last_message : '---'}</span></p>
          </div>
        </div>
      </Widget>
    </Col>
  )
}

export default TemplateTile;
