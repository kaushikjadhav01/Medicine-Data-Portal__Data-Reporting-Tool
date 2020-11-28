import React from "react";
import {Button} from "antd";

import Widget from "components/Widget/index";

const ToolTheDay = () => {
  return (
    <Widget styleName="gx-card-full gx-text-center">
      <div className="gx-pt-4 gx-px-3">
        <div className="gx-separator gx-bg-success-dark"/>
        <h2 className="gx-mb-4 gx-text-success-dark">Tool's Day</h2>
        <img className="gx-mb-4 gx-rounded-circle gx-img-fluid gx-object-cover"
             src={require("assets/images/widget/spoons.png")} alt='spoons'/>
      </div>
      <Button type="primary"
              className="gx-mt-sm-4 gx-fs-sm gx-btn-block gx-mb-0 gx-text-uppercase gx-border-radius-top-left-0 gx-border-radius-top-right-0"
              size="large" htmlType="submit" block>
        learn more
      </Button>
    </Widget>
  );
};

export default ToolTheDay;
