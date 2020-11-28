import React from "react";

const RoadMapItem = ({data}) => {
  const {image, image2, title, desc} = data;
  return (

    <div className="gx-slider">
      <div className="gx-slider-img">
        <img alt="example" src={image} style={{maxHeight: 185}}/>
        <img className="gx-img-up" alt="example" src={image2}/>
      </div>
      <div className="gx-slider-content">
        <h4>{title}</h4>
        <p className="gx-text-grey">{desc}</p>
      </div>
    </div>
  );
};

export default RoadMapItem;
