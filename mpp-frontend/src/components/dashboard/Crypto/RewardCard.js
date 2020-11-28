import React from "react";
import Widget from "components/Widget/index";
import {Button} from "antd";

const RewardCard = () => {
  return (
    <Widget styleName="gx-bg-dark-primary">
      <div className="gx-flex-row gx-justify-content-center gx-mb-3 gx-mb-md-4">
        <i className={`icon icon-refer gx-fs-xlxl gx-text-white`}/>
      </div>
      <div className="gx-text-center">
        <h2 className="h3 gx-mb-3 gx-text-white">Reffer and Get Reward</h2>
        <p className="gx-text-white gx-mb-3">Reffer us to your friends and
          earn bonus when they join.</p>
        <Button size="large" className="gx-btn-secondary gx-mt-md-5 gx-mb-1">Invite Friends</Button>
      </div>
    </Widget>
  );
};

export default RewardCard;
