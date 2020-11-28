import React from "react";
import {Avatar, Checkbox, Tag, Tooltip} from "antd";

import Aux from "util/Auxiliary";
import {taskTags} from "../../../../src/routes/main/dashboard/CRM/data";

const getTags = (tags) => {
  return taskTags.map((tag, index) => {
    if (tags.includes(tag.id)) {
      return <Tooltip key={index} title={tag.name}>
        <li className={`gx-text-${tag.color}`}>
          <i className="icon icon-circle gx-fs-xxs"/>
        </li>
      </Tooltip>
    }
    return null;
  });
};

const TaskItem = ({data, onChange}) => {

  const {title, tags, completed, user, dueDate} = data;
  return (
    <Aux>
      <div className="gx-media gx-task-list-item gx-flex-nowrap">
        <div className="gx-mr-3">
          <Checkbox checked={completed} onChange={() => onChange(data)}/>
        </div>
        <div className="gx-media-body gx-task-item-content">
          <div className="gx-task-item-content-left">
            <p
              className={`gx-text-truncate gx-mb-0 ${completed ? 'gx-text-strikethrough' : 'gx-text-hover'}`}>{title}</p>
          </div>
          <div className="gx-task-item-content-right">
            <Avatar className="gx-ml-sm-3 gx-size-30 gx-order-sm-3" src={user.avatar}/>
            <Tag
              className="gx-bg-grey gx-text-grey gx-ml-3 gx-mr-0 gx-mb-0 gx-rounded-xxl gx-order-sm-2">{user.projectName}</Tag>
            <ul className="gx-dot-list gx-mb-0 gx-order-sm-1 gx-ml-2">
              {getTags(tags)}
            </ul>
            <span className="gx-fs-sm gx-text-grey gx-ml-3 gx-task-date gx-order-sm-4">{dueDate}</span>
          </div>
        </div>
      </div>
    </Aux>
  );
};

export default TaskItem;
