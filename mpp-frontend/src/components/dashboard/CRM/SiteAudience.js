import React from "react";

import LineIndicator from "./LineIndicator";

const SiteAudience = () => {

  return (
    <div className="gx-site-dash gx-mb-2 gx-pt-3 gx-pt-sm-0 gx-pt-xl-2">
      <h6 className="gx-text-uppercase gx-mb-2 gx-mb-sm-4">SITE AUDIENCE</h6>
      <ul className="gx-line-indicator">
        <li>
          <LineIndicator width="56%" title="Male" color="cyan" value="56%"/>
        </li>
        <li>
          <LineIndicator width="42%" title="Female" color="geekblue" value="42%"/>
        </li>
        <li>
          <LineIndicator width="20%" title="Others" color="orange" value="20%"/>
        </li>
      </ul>
    </div>
  )
};
export default SiteAudience;
