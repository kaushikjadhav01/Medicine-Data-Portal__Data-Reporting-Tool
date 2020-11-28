import React from "react";
import Widget from "components/Widget/index";
import {Button} from "antd";

const CurrentPlan = () => {

  return (
    <Widget title={<h2 className="h4 gx-text-capitalize gx-mb-0">Your Current Plan</h2>}
            extra={<span
              className="gx-text-primary gx-fs-md gx-pointer gx-ml-auto gx-oth-plans-up">Other plans <i
              className="icon icon-long-arrow-right gx-fs-xxl gx-ml-2 gx-d-inline-flex gx-vertical-align-middle"/></span>}>
      <div className="gx-currentplan-row">
        <div className="gx-currentplan-col">
          <h2 className="gx-text-primary gx-fs-xlxl gx-font-weight-medium gx-mb-1">$19<sub
            className="gx-fs-md gx-bottom-0">/month</sub></h2>
          <p className="gx-mb-1"><span className="gx-size-8 gx-bg-dark gx-rounded-xs gx-d-inline-block gx-mr-1"/> Max
            listing items 2K</p>
          <p><span className="gx-size-8 gx-bg-dark gx-rounded-xs gx-d-inline-block gx-mr-1"/> Max agents - 10</p>
        </div>
        <div className="gx-currentplan-col gx-currentplan-right">
          <div className="gx-currentplan-right-content">
            <p className="gx-text-red">Expires in 80 days</p>
            <Button className="gx-btn gx-btn-orange gx-mb-0 gx-mr-0 gx-text-uppercase">Renew Plan</Button>
            <span className="gx-text-primary gx-fs-md gx-pointer gx-mts-3 gx-oth-plans-down">Other plans <i
              className="icon icon-long-arrow-right gx-fs-xxl gx-ml-2 gx-d-inline-flex gx-vertical-align-middle"/></span>
          </div>
        </div>
      </div>
    </Widget>
  );
};

export default CurrentPlan;
