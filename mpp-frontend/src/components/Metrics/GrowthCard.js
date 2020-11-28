import React from "react";
import Widget from "components/Widget/index";

const GrowthCard = ({title, children, styleName, desc, bgColor, textColor}) => {
  return (
    <Widget styleName={`gx-card-full gx-bg-${bgColor}`}>
      <div className="gx-actchart gx-px-4 gx-pt-4 gx-mb-3 gx-text-grey">
        <h2 className={`gx-fs-xxxl gx-font-weight-medium gx-mb-1 gx-chart-${styleName}`}>{title}% <i
          className="icon icon-menu-up gx-fs-sm"/></h2>
        <p className={`gx-mb-4 gx-text-${textColor}`}>{desc}</p>
      </div>
      {children}
    </Widget>
  );
};

export default GrowthCard;
