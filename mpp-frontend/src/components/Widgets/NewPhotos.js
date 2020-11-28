import React from "react";
import {Button} from "antd";

import Widget from "components/Widget/index";


const NewPhotos = () => {
  return (
    <Widget styleName="gx-widget-bg">

      <span className="gx-widget-badge">$20/month</span>
      <i className="icon icon-camera gx-fs-xlxl"/>

      <h1 className="gx-fs-xxxl gx-font-weight-semi-bold gx-mb-3 gx-mb-sm-4">38,248 Photos</h1>
      <p>NEW PHOTOS ADDED THIS WEEK</p>
      <p>Now kickstart with your next design. Subscribe
        today and save $20/month</p>
      <Button className="gx-mb-1 gx-btn-warning" htmlType="submit">
        Subscribe
      </Button>
    </Widget>
  );
};

export default NewPhotos;
