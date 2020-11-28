import React from "react";
import Widget from "components/Widget/index";
import {Button, Col, Row} from "antd";
import LineIndicator from "./LineIndicator";

const Portfolio = () => {
  return (
    <Widget>
      <h2 className="h4 gx-mb-3">Your Portfolio Balance</h2>
      <Row>
        <Col lg={12} md={12} sm={12} xs={24}>

          <div className="ant-row-flex">
            <h2 className="gx-mr-2 gx-mb-0 gx-fs-xxxl gx-font-weight-medium">$179,626</h2>
            <h4 className="gx-pt-2 gx-chart-up">64% <i className="icon icon-menu-up gx-fs-sm"/></h4>
          </div>
          <p className="gx-text-grey">Overall balance</p>
          <div className="ant-row-flex gx-mb-3 gx-mb-md-2">
            <Button className="gx-mr-2" type="primary">Deposit</Button>
            <Button className="gx-btn-cyan">Withdraw</Button>
          </div>

          <p className="gx-text-primary gx-pointer gx-d-none gx-d-sm-block gx-mb-1">
            <i className="icon icon-add-circle gx-fs-lg gx-d-inline-flex gx-vertical-align-middle"/> Add New Wallet</p>
        </Col>
        <Col lg={12} md={12} sm={12} xs={24}>
          <div className="gx-site-dash">
            <h5 className="gx-mb-3">Portfolio Distribution</h5>
            <ul className="gx-line-indicator gx-fs-sm gx-pb-1 gx-pb-sm-0">
              <li>
                <LineIndicator width="78%" title="BTC" title2="8.74" color="primary" value="78%"/>
              </li>
              <li>
                <LineIndicator width="38%" title="RPL" title2="1.23" color="pink" value="48%"/>
              </li>
              <li>
                <LineIndicator width="24%" title="LTE" title2="0.71" color="orange" value="34%"/>
              </li>
            </ul>
            <p className="gx-text-primary gx-pointer gx-d-block gx-d-sm-none gx-mb-0 gx-mt-3">
              <i className="icon icon-add-circle gx-fs-lg gx-d-inline-flex gx-vertical-align-middle"/> Add New Wallet
            </p>
          </div>
        </Col>
      </Row>
    </Widget>
  );
};

export default Portfolio;
