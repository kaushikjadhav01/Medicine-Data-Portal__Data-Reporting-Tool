import React from "react";
import {Button} from "antd";

import Widget from "components/Widget/index";

const DryFruit = () => {
  return (
    <Widget styleName="gx-card-full gx-text-center gx-pt-4 gx-pb-3 gx-px-3">
      <div className="gx-separator gx-bg-sepia"/>
      <h2 className="gx-mb-4 gx-text-sepia">Dry Fruit</h2>
      <div className="gx-d-block"><img className="gx-mb-4 gx-rounded-circle gx-img-fluid gx-object-cover"
                                       src={require("assets/images/widget/khajoor.png")} alt='khajoor'/></div>
      <Button className="gx-btn-sepia gx-text-uppercase gx-fs-sm gx-mb-2" htmlType="submit">
        Add to Cart
      </Button>
    </Widget>
  );
};

export default DryFruit;
