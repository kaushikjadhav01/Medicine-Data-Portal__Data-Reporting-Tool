import React from "react";
import {Avatar} from "antd";

const DefaultTimeLineItem = ({styleName, timeLine}) => {
  const {time, image, title, description} = timeLine;
  return (
    <div className={`gx-timeline-item ${styleName}`}>
      <div className="gx-timeline-badge gx-timeline-img">
        <img src={require("assets/images/pentagon.png")} alt="Pentagon" title="Pentagon"/>
      </div>

      <div className="gx-timeline-panel">
        <div className="gx-timeline-panel-header">
          <div className="gx-timeline-header-img gx-timeline-left">
            <Avatar size="large" className="gx-size-60 gx-rounded-circle" src={image}/>
          </div>
          <div className="gx-timeline-heading">
            <h5>{time}</h5>
            <h3 className="gx-timeline-title">{title}</h3>
          </div>
        </div>
        <div className="gx-timeline-body">
          <p>{description}</p>
        </div>
      </div>
    </div>
  )
};
export default DefaultTimeLineItem;
