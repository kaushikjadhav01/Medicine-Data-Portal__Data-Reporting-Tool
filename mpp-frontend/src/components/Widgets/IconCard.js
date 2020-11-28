import React from "react";
import Widget from "components/Widget/index";

const IconCard = ({color, icon}) => {
  return (
    <Widget styleName={`gx-card-full gx-p-2 gx-text-center gx-text-primary ${color}`}>
      <i className={`icon icon-${icon} gx-fs-iconcard`}/>
    </Widget>
  );
};

export default IconCard;
