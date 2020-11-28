import React from "react";

const RecentItem = ({data}) => {

  const { title, avatar, description} = data;
  return (
    <div className="gx-media gx-flex-nowrap">
      <img className="gx-mr-3 gx-size-60 gx-rounded-lg" src={avatar}/>
      <div className="gx-media-body">
        <div className="">
          <h4 className="gx-text-truncate gx-task-item-title">{title}</h4>
          <p className="gx-text-grey gx-fs-sm gx-mb-0">{description}</p>
        </div>
      </div>
    </div>

  );
};

export default RecentItem;
