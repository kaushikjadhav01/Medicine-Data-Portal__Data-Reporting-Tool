import React from "react";

import Widget from "components/Widget/index";

const SmartHomeCard = () => {
  return (
    <Widget styleName="gx-card-full">

      <img className="gx-smart-img" alt="example" src={require("assets/images/widget/children.png")}/>
      <div className="gx-p-3">
        <p className="gx-mb-2">Smart home on iPad with smart kids</p>
        <span className="gx-text-primary gx-pointer gx-text-uppercase gx-fs-sm">Read More</span>
      </div>
    </Widget>
  );
};

export default SmartHomeCard;
