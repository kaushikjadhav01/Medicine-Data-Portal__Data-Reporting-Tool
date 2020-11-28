import React from "react";
import {Button} from "antd";

import Widget from "components/Widget/index";


const SocialMedia = () => {
  const ButtonGroup = Button.Group;
  return (
    <Widget>
      <div>
        <div className="ant-card-head-title gx-mb-3">Social Media</div>
        <h2 className="gx-mb-3">Digital Media Marketing Online Webbinar</h2>
        <p className="gx-text-grey gx-fs-sm">27th Aug, 09:30 pm EST</p>
        <p>Learn from experts. This webinar explains right..</p>
        <h4 className="gx-text-primary gx-mb-3 gx-mb-sm-4">Are You ready to join?</h4>
        <ButtonGroup className="gx-mb-1">
          <Button className="gx-mb-0" type="primary">Yes</Button>
          <Button className="gx-btn-warning gx-mb-0">Maybe</Button>
          <Button className="gx-btn-light gx-mb-0">No</Button>
        </ButtonGroup>
      </div>
    </Widget>
  );
};

export default SocialMedia;
