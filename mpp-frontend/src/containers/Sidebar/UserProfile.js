import React, { useEffect, useState } from 'react';
import { Avatar, Popover } from 'antd';
import { UserOutlined } from '@ant-design/icons';
import { getUserDetails, getRole } from '../../helpers'


const UserProfile = (props) => {

  const [userDetails, setUserDetails] = useState(null);
  useEffect(() => {
    setUserDetails(getUserDetails())
  }, [])

  const userMenuOptions = (
    <ul className='gx-user-popover'>
      <li onClick={() => { getRole() === 'ADMIN' ? props.history.push('/admin/profile') : props.history.push('/partner/profile') }}>
        Profile
      </li>
      {
        getRole() === 'ADMIN' ?
          <li onClick={() => { props.history.push('/admin/settings') }}>
            Settings
          </li> :
          null
      }
      <li onClick={() => { props.history.push('/change-password') }}>
        Change Password
      </li>
    </ul>
  );

  return (
    <div className='gx-flex-row gx-align-items-center gx-mb-4 gx-avatar-row'>
      <Popover placement='bottomRight' content={userMenuOptions} trigger='click'>
        <div className='gx-flex-column gx-align-items-center gx-justify-content-between flex-wrap-none max-width-150'>
          <Avatar
            icon={<UserOutlined />}
            className='gx-size-40 gx-pointer gx-mr-3'
            alt='' />
          <span className='gx-avatar-name text-capitalize gx-mt-2'>{userDetails ? userDetails : 'User'}<i
            className='icon icon-chevron-down gx-fs-xxs gx-ml-2' /></span>
        </div>
      </Popover>
    </div>
  )
};

export default UserProfile;
