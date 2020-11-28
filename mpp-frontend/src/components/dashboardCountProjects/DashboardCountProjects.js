import React from 'react';

import Widget from 'components/Widget/index';
import imgUnderDevelopment from '../../assets/images/dashboard/under-development.svg'
import imgHold from '../../assets/images/dashboard/hold.svg'
import imgDropped from '../../assets/images/dashboard/dropped.svg'
import imgFiled from '../../assets/images/dashboard/filed.svg'
import imgApproved from '../../assets/images/dashboard/approved.svg'


const DashboardCountProjects = (props) => {
  const { count, status } = props.data
  let cardColor = 'cyan'
  let dataStatus = status;
  let icon = ''
  if (status === 'ON_HOLD') {
    cardColor = 'grey'
    dataStatus = 'ON HOLD'
    icon = imgHold
  }
  else if (status === 'UNDER_DEVELOPMENT') {
    cardColor = 'secondary';
    dataStatus = 'UNDER DEVELOPMENT'
    icon = imgUnderDevelopment
  }
  else if (status === 'DROPPED') {
    cardColor = 'red'
    icon = imgDropped
  }
  else if (status === 'FILED') {
    cardColor = 'primary'
    icon = imgFiled
  }
  else if (status === 'APPROVED') {
    cardColor = 'success'
    icon = imgApproved
  }

  return (
    <Widget styleName={`gx-card-full gx-p-3 gx-bg-${cardColor} gx-text-white mb-0 height-100 gx-flex-row gx-align-items-center`}>
      <div className='gx-media gx-align-items-center gx-flex-nowrap'>
        <div className='gx-mr-2 gx-mr-xxl-3'>
          <img src={icon} className='width-30' />
        </div>
        <div className='gx-media-body'>
          <h1 className='gx-fs-xxl gx-font-weight-semi-bold gx-mb-1 gx-text-white'>{count}</h1>
          <p className='gx-mb-0 text-capitalize'>{dataStatus.toLowerCase()}</p>
        </div>
      </div>
    </Widget>
  );
};

export default DashboardCountProjects;
