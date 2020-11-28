import React from "react";
import {Button} from "antd";

import IntlMessages from "util/IntlMessages";

const Callouts = ({styleName, callout}) => {
  const {image, title, description} = callout;
  return (
    <div className={`gx-product-row ${styleName}`}>
      <div className="gx-product-col gx-product-thumb ">
        <div className="gx-grid-thumb-equal">
          <span
            className="gx-link gx-grid-thumb-cover">
            <img alt="Special Edition Party Spas"
                 src={image}/>
          </span>
        </div>
      </div>
      <div className="gx-product-col gx-product-content">

        <h2>{title}</h2>
        <p>{description}</p>
        <Button type="primary">{<IntlMessages id="callouts.viewRange"/>}</Button>

      </div>
    </div>
  )
};

export default Callouts;

