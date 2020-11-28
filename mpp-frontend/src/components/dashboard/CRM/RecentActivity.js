import React, { useState,useEffect } from "react";
import {Avatar, Timeline} from "antd";
import WidgetHeader from "components/WidgetHeader/index";
import ActivityItem from "./ActivityItem";

const TimeLineItem = Timeline.Item;

function getName(task, shape) {
  if (task.avatar === '') {
    let nameSplit = task.name.split(" ");
    if (task.name.split(" ").length === 1) {
      const initials = nameSplit[0].charAt(0).toUpperCase();
      return <Avatar shape={shape} className="gx-size-40 gx-bg-primary">{initials}</Avatar>
    } else {
      const initials = nameSplit[0].charAt(0).toUpperCase() + nameSplit[1].charAt(0).toUpperCase();
      return <Avatar shape={shape} className="gx-size-40 gx-bg-cyan">{initials}</Avatar>
    }
  } else {
    return <Avatar shape={shape} className="gx-size-40" src={task.avatar}/>;
  }
}

const RecentActivity =(props)=> {

  const [limit, setLimit] = useState(3);
  const [shape, setShape] = useState(props.shape);

  useEffect(() => {
    setShape(props.shape);
    if (window.innerWidth < 575) {
      setLimit(1)
    }
  }, [props.shape]);


  const onLoadMore =()=> {
    setLimit(limit+1)
  };

    return (
      <div className="gx-entry-sec">
        <WidgetHeader title="Recent Activities"/>
        {props.recentList.slice(0, limit).map((activity, index) =>
          <div className="gx-timeline-info" key={"activity" + index}>
            <h4 className="gx-timeline-info-day">{activity.day}</h4>
            <Timeline>
              {activity.tasks.map((task, index) => {

                return <TimeLineItem key={"timeline" + index} mode="alternate" dot={
                  getName(task, shape)
                }>
                  <ActivityItem task={task}/>
                </TimeLineItem>
              })}
            </Timeline>
          </div>)}
        <span className="gx-link gx-btn-link" onClick={onLoadMore}>Load More</span>
      </div>
    );
};

export default RecentActivity;
