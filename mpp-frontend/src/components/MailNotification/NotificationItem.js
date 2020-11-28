import React from "react";
import {Avatar} from "antd";

const NotificationItem = ({notification}) => {
  const {image, badge, name, time, message} = notification;
  return (
    <li className="gx-media">
      <div className="gx-user-thumb gx-mr-3">
        <Avatar className="gx-size-40"
                alt={image}
                src={image}/>
        {badge > 0 ? <span className="gx-badge gx-badge-danger gx-text-white gx-rounded-circle">{badge}</span> : null}
      </div>
      <div className="gx-media-body">
        <div className="gx-flex-row gx-justify-content-between gx-align-items-center">
          <h5 className="gx-text-capitalize gx-user-name gx-mb-0"><span className="gx-link">{name}</span></h5>
          <span className="gx-meta-date"><small>{time}</small></span>
        </div>
        <p className="gx-fs-sm">{message}</p>
        <span className="gx-btn gx-btn-sm gx-top2 gx-text-muted"><i className="icon icon-reply gx-pr-2"/>Reply</span>
        <span className="gx-btn gx-btn-sm gx-top2 gx-text-muted"><i
          className="icon icon-custom-view gx-pr-2"/>Read</span>
      </div>
    </li>
  );
};

export default NotificationItem;
