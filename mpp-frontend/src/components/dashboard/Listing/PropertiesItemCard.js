import React from "react";
import {Tag} from "antd";

const PropertiesItemCard =({data})=> {
  const {image, title, subTitle, name, date, isFeatured, prize, sqft, bedrooms, baths, area, more} = data;
  return (
    <div className="gx-media gx-featured-item">
      {isFeatured === true ? <Tag color="orange"><span className="gx-text-uppercase">featured</span></Tag> : null}
      <div className="gx-featured-thumb">
        <img className="gx-rounded-lg gx-width-175" src={image} alt="..."/>
        <Tag className="gx-rounded-xs gx-bg-orange gx-border-orange gx-text-white">Featured</Tag>
      </div>
      <div className="gx-media-body gx-featured-content">
        <div className="gx-featured-content-left">

          <Tag className="gx-rounded-xs" color="#06BB8A">FOR SALE</Tag>
          <h3 className="gx-mb-2">{title}</h3>

          <p className="gx-text-grey gx-mb-1">{subTitle}</p>

          <div className="ant-row-flex">
            <p className="gx-mr-3 gx-mb-1"><span className="gx-text-grey">Bedrooms:</span> {bedrooms}</p>
            <p className="gx-mr-3 gx-mb-1"><span className="gx-text-grey">Baths:</span> {baths}</p>
            <p className="gx-mr-3 gx-mb-1"><span className="gx-text-grey">Area:</span> {area}</p>
            <a className="gx-text-grey gx-text-underline gx-mb-2" href="#/"> + {more} more</a>
          </div>
          <div className="ant-row-flex">
            <p className="gx-text-grey gx-mb-1">
              <i className={`icon icon-user gx-fs-xs gx-mr-2 gx-d-inline-flex gx-vertical-align-middle`}/>{name}
            </p>
            <p className="gx-text-grey gx-ml-4 gx-mb-1">
              <i className={`icon icon-datepicker gx-fs-xs gx-mr-2 gx-d-inline-flex gx-vertical-align-middle`}/>{date}
            </p>
          </div>
        </div>
        <div className="gx-featured-content-right">
          <div>
            <h2 className="gx-text-primary gx-mb-1 gx-font-weight-medium">{prize}</h2>
            <p className="gx-text-grey gx-fs-sm">{sqft}</p>
          </div>
          <p className="gx-text-primary gx-text-truncate gx-mt-auto gx-mb-0 gx-pointer">Check in detail <i
            className={`icon icon-long-arrow-right gx-fs-xxl gx-ml-2 gx-d-inline-flex gx-vertical-align-middle`}/></p>
        </div>

      </div>
    </div>
  );
};

export default PropertiesItemCard;
