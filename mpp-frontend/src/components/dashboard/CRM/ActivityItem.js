import React from "react";
import {Avatar} from "antd";
import Auxiliary from "util/Auxiliary";

const ActivityItem = ({task}) => {

  return (
    <Auxiliary>
      <p className="gx-mb-0">{task.title}</p>
      {task.imageList.length > 0 ?
        <ul className="gx-list-inline gx-mb-3 gx-mt-2">
          {task.imageList.map((image, index) => {
              if (index === 2) {
                return (
                  <li className="gx-mb-1" key={index}>
                    <span className="gx-link gx-img-more"> +{task.imageList.length - 2} More</span>
                  </li>
                );
              } else if (index > 2) {
                return null;
              } else {
                return (
                  <li className="gx-mb-1" key={index}>
                    <Avatar shape="square" className="gx-size-40" src={image}/>
                  </li>
                )
              }
            }
          )}
        </ul> : null}

    </Auxiliary>
  );
};

export default ActivityItem;
