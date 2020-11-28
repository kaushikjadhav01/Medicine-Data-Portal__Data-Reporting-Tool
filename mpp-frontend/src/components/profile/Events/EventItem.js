import React from "react";
import {Tag} from "antd";

const EventItem = ({data}) => {
  const {image, title, address, date} = data;

  return (
    <div className="gx-media gx-featured-item">

      <div className="gx-featured-thumb">
        <img className="gx-rounded-lg" src={image} alt="..."/>
      </div>
      <div className="gx-media-body gx-featured-content">
        <div className="gx-featured-content-left">
          <Tag className="gx-rounded-xs gx-text-uppercase" color="#06BB8A">Music concert</Tag>
          <h3 className="gx-mb-2">{title}</h3>
          <div className="ant-row-flex">
            <div className="gx-media gx-text-grey gx-mb-1">
              <i className={`icon icon-location gx-fs-lg gx-mr-2 gx-d-inline-flex gx-vertical-align-middle`}/>
              <span className="gx-media-body gx-ml-1">{address}</span>
            </div>
          </div>
        </div>
        <div className="gx-featured-content-right gx-profile-content-right">
          <h2 className="gx-text-primary gx-mb-1">
            <i className={`icon icon-calendar gx-fs-lg gx-mr-2 gx-d-inline-flex gx-vertical-align-middle`}/> <span
            className="gx-d-inline-flex gx-vertical-align-middle">{date}</span>
          </h2>
          <p className="gx-text-primary gx-text-truncate gx-mt-sm-auto gx-mb-0 gx-pointer">Check in detail <i
            className={`icon icon-long-arrow-right gx-fs-xxl gx-ml-1 gx-ml-sm-2 gx-d-inline-flex gx-vertical-align-middle`}/>
          </p>
        </div>

      </div>
    </div>
  );
}

export default EventItem;
