import React from "react";
import {Col, Row} from 'antd';

import Widget from "components/Widget/index";

const FriendshipCard =()=> {

  return (
    <Widget styleName="gx-p-lg-1">
      <Row>
        <Col xl={9} lg={10} md={10} sm={10} xs={24}>
          <img className="gx-rounded-lg gx-w-100" alt="..." src={require('assets/images/widget/sarfing.png')}/>
        </Col>
        <Col xl={15} lg={14} md={14} sm={14} xs={24}>
          <div className="gx-fnd-content">
            <p className="gx-text-grey">Outdoor Experience</p>
            <h2 className="gx-text-uppercase gx-text-black gx-font-weight-bold gx-fnd-title">A Friendship with high
              waves</h2>
            <p>Had a great time with family on beach this
              weekend.</p>
            <ul className="gx-fnd-gallery-list">
              <li><img alt="..." src={require('assets/images/widget/sager.jpg')}
                       className="gx-rounded-lg gx-img-fluid"/></li>
              <li><img alt="..." src={require('assets/images/widget/dil.jpg')}
                       className="gx-rounded-lg gx-img-fluid"/></li>
              <li><img alt="..." src={require('assets/images/widget/ships.jpg')}
                       className="gx-rounded-lg gx-img-fluid"/></li>
            </ul>
          </div>
        </Col>
      </Row>
    </Widget>
  );
}

export default FriendshipCard;
