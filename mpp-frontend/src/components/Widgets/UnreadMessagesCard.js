import React from "react";

import Widget from "components/Widget/index";

const UnreadMessagesCard = () => {
  return (
    <Widget styleName="gx-blue-cyan-gradient gx-text-white gx-card-1367-p">
      <div className="gx-flex-row gx-justify-content-between gx-mb-2">
        <i className="icon icon-mail-open gx-fs-xxl gx-mr-2"/>
        <i className="icon icon-long-arrow-right gx-fs-xxl"/>
      </div>
      <h2 className="gx-text-white">271</h2>
      <p className="gx-mb-0">New messages</p>
    </Widget>
  );
};

export default UnreadMessagesCard;
