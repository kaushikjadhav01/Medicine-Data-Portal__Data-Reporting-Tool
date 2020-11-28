import React from "react";
import {Avatar} from "antd";


const NotificationItem = ({notification}) => {
  const {icon, image, title, time} = notification;
  return (

    <li className="gx-media">
      <Avatar className="gx-size-40 gx-mr-3"
              alt={image}
              src={image}/>
      <div className="gx-media-body gx-align-self-center">
        <p className="gx-fs-sm gx-mb-0">{title}</p>
        <i className={`icon icon-${icon} gx-pr-2`}/> <span className="gx-meta-date"><small>{time}</small></span>
      </div>
    </li>
  );
};

export default NotificationItem;
