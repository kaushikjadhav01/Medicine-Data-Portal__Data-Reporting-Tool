import React from "react";

import Widget from "components/Widget/index";

const AayurvedaCard = () => {
  return (
    <Widget styleName="gx-card-full gx-text-center">
      <div className="gx-pt-4 gx-px-3">
        <div className="gx-separator gx-bg-success-dark"/>
        <h2 className="gx-mb-4 gx-text-success-dark">Aayurveda</h2>
        <p>Learn from experts
          this webinar explains
          right</p>
        <span className="gx-text-primary gx-pointer gx-text-uppercase gx-mb-3 gx-mb-xxl-2 gx-d-block">learn More</span>
      </div>
      <div className="gx-mt-xxl-3 gx-ayurveda-thumb">
        <img className="gx-img-fluid gx-w-100" alt="ayurveda" src={require("assets/images/widget/ayurveda.png")}/>
      </div>
    </Widget>
  );
};

export default AayurvedaCard;
