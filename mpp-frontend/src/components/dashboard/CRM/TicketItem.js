import React from "react";
import {Avatar} from "antd";

import Aux from "util/Auxiliary";
import {taskStatus} from "../../../../src/routes/main/dashboard/CRM/data"

const getStatus = (status) => {
  const statusData = taskStatus.filter((taskStatus, index) => status === taskStatus.id)[0];
  return <Aux>
    <span className="gx-nonhover">
      <i className={`icon icon-circle gx-fs-sm gx-text-${statusData.color}`}/>
    </span>
    <span className={`gx-badge gx-hover gx-mb-0 gx-text-white gx-badge-${statusData.color}`}>
      {statusData.title}
    </span>
  </Aux>
};

const TicketItem = ({data}) => {

  const {id, title, avatar, description, status} = data;
  return (
    <div key={"TicketItem" + id} className="gx-media gx-task-list-item gx-flex-nowrap">
      <Avatar className="gx-mr-3 gx-size-36" src={avatar}/>
      <div className="gx-media-body gx-task-item-content">
        <div className="gx-task-item-content-left">
          <h5 className="gx-text-truncate gx-task-item-title">{title}</h5>
          <p key={id} className="gx-text-grey gx-fs-sm gx-mb-0">{description}</p>
        </div>
        <div className="gx-task-item-content-right">
          {getStatus(status)}
        </div>
      </div>
    </div>

  );
};

export default TicketItem;
