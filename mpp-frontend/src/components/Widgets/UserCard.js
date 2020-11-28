import React from "react";

import Widget from "components/Widget/index";

const UserCard =()=> {

  return (
    <Widget styleName="gx-card-full gx-dot-arrow-hover">
      <div className="gx-user-wid-row">
        <div className="gx-user-wid gx-mr-3">
          <img alt="..." src={require('assets/images/avatar/selena.jpg')} className="gx-object-cover"/>
        </div>
        <div className="gx-user-wid-body gx-py-3 gx-pr-3">
          <div className="ant-row-flex">
            <h2 className="h4 gx-mr-1 gx-mb-1">Mila Alba</h2>
          </div>
          <p className="gx-mb-1 gx-text-grey gx-fs-sm">Creative Head<br/> @example</p>
          <div className="gx-dot-arrow">
            <div className="gx-bg-primary gx-hover-arrow">
              <i className="icon icon-long-arrow-right gx-text-white"/>
            </div>
            <div className="gx-dot">
              <i className="icon icon-ellipse-v gx-text-primary"/>
            </div>
          </div>
        </div>
      </div>
    </Widget>
  );
}

export default UserCard;
