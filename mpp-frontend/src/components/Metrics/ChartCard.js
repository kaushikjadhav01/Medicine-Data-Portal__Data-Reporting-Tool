import React from "react";

import Widget from "components/Widget/index";

const ChartCard = ({title, children, styleName, desc}) => {
  return (
    <Widget styleName="gx-card-full">

      <div className="gx-actchart gx-px-3 gx-pt-3">
        <h2 className={`gx-chart-${styleName} gx-mb-1`}>{title}% <i className="icon icon-menu-up gx-fs-sm"/></h2>
        <p className="gx-mb-0 gx-fs-sm gx-text-grey">{desc}</p>
      </div>
      {children}
    </Widget>
  );
};

export default ChartCard;
