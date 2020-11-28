import React from "react";

import Widget from "components/Widget";
import LineIndicator from "./LineIndicator";

const TicketByDepartment = () => {

  return (
    <Widget title="TICKETS BY DEPARTMENT">
      <div className="gx-media gx-mb-4 gx-align-items-center">
        <div className="gx-mr-3"><i className="icon icon-tickets gx-text-blue" style={{fontSize: 36}}/></div>
        <div className="gx-media-body">
          <h1 className="gx-h1-lg gx-mb-0">37</h1>
          <span>Total Ticket</span>
        </div>
      </div>
      <ul className="gx-line-indicator gx-line-indicator-half">
        <li>
          <LineIndicator width="100%" title="Sales" color="purple" value="14"/>
        </li>
        <li>
          <LineIndicator width="70%" title="Account" color="amber" value="70"/>
        </li>
        <li>
          <LineIndicator width="85%" title="Technical" color="green" value="12"/>
        </li>
        <li>
          <LineIndicator width="30%" title="Dispute" color="orange" value="30"/>
        </li>
      </ul>
    </Widget>

  );
};

export default TicketByDepartment;
