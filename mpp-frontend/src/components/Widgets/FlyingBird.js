import React from "react";
import {Button} from "antd";

import Widget from "components/Widget/index";


const FlyingBird = () => {
  return (
    <Widget>
      <div className="gx-media gx-align-items-center gx-mb-4">
        <div className="gx-mr-3">
          <img src={require("assets/images/widget/flying.png")} alt='flying'/>
        </div>
        <div className="gx-media-body">
          <h2 className="gx-mb-1">
            Flying bird
          </h2>
          <p className="gx-text-grey gx-mb-0">Bob Bush</p>
        </div>
      </div>
      <p className="gx-mb-4">Some description about the card. This widget
        could be used to describe a project, a product,
        user’s profile or may be more.</p>
      <Button type="primary" className="gx-mb-1" htmlType="submit">
        Subscribe
      </Button>
    </Widget>
  );
};

export default FlyingBird;
