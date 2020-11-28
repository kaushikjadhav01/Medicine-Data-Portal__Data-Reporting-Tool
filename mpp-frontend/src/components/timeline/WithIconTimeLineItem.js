import React from "react";

const WithIconTimeLineItem = ({styleName, color, timeLine, children}) => {
  const {time, title, description} = timeLine;
  return (
    <div className={`gx-timeline-item gx-timeline-time-item ${styleName}`}>
      <div className="gx-timeline-time">{time}</div>
      <div className={`gx-timeline-badge gx-bg-${color}`}>{children}</div>
      <div className="gx-timeline-panel">
        <h4 className={`gx-timeline-tile gx-text-${color}`}>{title}</h4>
        <p>{description}</p>
      </div>
    </div>
  )
};
export default WithIconTimeLineItem;
