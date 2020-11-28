import React from "react";
import NotificationItem from "./NotificationItem";
import CustomScrollbars from 'util/CustomScrollbars'
import Auxiliary from "util/Auxiliary";
import { Empty } from "antd";

const AdminNotifications = ({ data, isAdmin }) => {
  return (
    <Auxiliary>
      <div className="gx-popover-header">
        <h3 className="gx-mb-0">Messages</h3>
        <i className="gx-icon-btn icon icon-charvlet-down" />
      </div>
      <CustomScrollbars className="gx-popover-scroll">
        {
          data && data.length > 0 ?
            <ul className="gx-sub-popover">
              {data.map((notification, index) => <NotificationItem isAdmin={isAdmin} key={index}
                notification={notification} />)}
            </ul>
            : <Empty className='mt-20' description='No messages' />
        }
      </CustomScrollbars>
    </Auxiliary>
  )
};

export default AdminNotifications;

