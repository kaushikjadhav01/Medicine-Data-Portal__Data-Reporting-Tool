import React from "react";

import Widget from "components/Widget/index";

const EcommerceStatus = ({icon, title, subTitle, color, colorTitle, colorSubTitle}) => {
  return (
    <Widget styleName={`gx-card-full gx-py-4 gx-px-2 gx-bg-${color}`}>
      <div className="gx-flex-row gx-justify-content-center gx-mb-3 gx-mb-sm-4">
          <span
            className={`gx-size-80 gx-border gx-border-${colorTitle} gx-text-${colorTitle} gx-flex-row gx-justify-content-center gx-align-items-center gx-rounded-circle`}>
            <i className={`icon icon-${icon} gx-fs-xlxl`}/></span>
      </div>
      <div className="gx-text-center">
        <h2 className={`gx-fs-xxxl gx-font-weight-medium gx-text-${colorTitle}`}>{title}</h2>
        <p className={`gx-mb-0 gx-mb-sm-3 gx-text-${colorSubTitle}`}>{subTitle}</p>
      </div>
    </Widget>
  );
};

export default EcommerceStatus;
