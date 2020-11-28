import React from 'react';
import moment from 'moment';
import { UserOutlined } from '@ant-design/icons';
import Avatar from 'antd/lib/avatar/avatar';

const NotificationItem = ({ notification, isAdmin }) => {
  const { created_at, message, is_approved, is_partner_message } = notification;
  return (
    <li className='gx-media'>
      <div className='gx-user-thumb gx-mr-3'>
        {
          !is_partner_message ?
            isAdmin ?
              <Avatar className='gx-size-50' icon={<UserOutlined />} /> :
              <Avatar className='gx-size-50' ><span className='font-20'>A</span></Avatar>
            :
            isAdmin ?
              <Avatar className='gx-size-50' ><span className='font-20'>P</span></Avatar> :
              <Avatar className='gx-size-50' icon={<UserOutlined />} />
        }
      </div>
      <div className='gx-media-body'>

        {
          !is_partner_message ?
            <p className={is_approved ? 'color-green mb-0 ' : 'color-red mb-0 '}>Report is <span>{is_approved ? 'Approved' : 'Rejected'}</span></p> :
            <p className={'color-blue mb-0 '}>Report is <span>Submitted</span></p>
        }
        <p className='gx-fs-sm'>{message}</p>
        <div className='gx-flex-row gx-justify-content-between gx-align-items-center'>
          <span className='gx-meta-date'><small>{moment(created_at).format('Do MMM YYYY, hh:mm A')}</small></span>
        </div>
      </div>
    </li>
  );
};

export default NotificationItem;
