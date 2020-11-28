import React from "react";

function EventItem({data}) {
  const {image, title, date, address} = data;
  return (
    <div className="gx-mb-4">
      <div className="gx-mr-3" style={{height: 150, width: 200}}>
        <img className="gx-img-fluid" src={image} alt="..."/>
      </div>
      <h4 className="gx-mt-0">{title}</h4>
      <div className="gx-flex-row gx-m-0">
        <i className="icon icon-calendar gx-mr-2"/>
        <p>{date}</p>
      </div>
      <div className="gx-flex-row gx-m-0">
        <i className="icon icon-map-geo-location gx-mr-2"/>
        <p>{address}</p>
      </div>
    </div>
  );
}

export default EventItem;
