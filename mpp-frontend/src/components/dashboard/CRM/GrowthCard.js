import React from "react";
import {Area, AreaChart, ResponsiveContainer, Tooltip} from "recharts";
import {Col, Row} from "antd";

import Metrics from "components/Metrics";

const GrowthCard = ({trafficData}) => {
  return (
    <Metrics styleName={`gx-card-full`} title="Growth">
      <Row>
        <Col lg={9} md={24} sm={9} xs={9}>
          <div className="gx-pb-4 gx-pl-4 gx-pt-4">
            <h2 className="gx-fs-xxxl gx-font-weight-medium gx-mb-1 gx-chart-up">37%
              <i className="icon icon-menu-up gx-fs-xxl"/>
            </h2>
            <p className="gx-mb-0 gx-text-grey">This year</p>
          </div>
        </Col>
        <Col lg={15} md={24} sm={15} xs={15}>
          <ResponsiveContainer width="100%" height={103}>
            <AreaChart data={trafficData}
                       margin={{top: 0, right: 0, left: 0, bottom: 0}}>
              <Tooltip/>
              <defs>
                <linearGradient id="color1" x1="0" y1="0" x2="1" y2="0">
                  <stop offset="5%" stopColor="#FF55AA" stopOpacity={0.9}/>
                  <stop offset="95%" stopColor="#6757DE" stopOpacity={0.9}/>
                </linearGradient>
              </defs>
              <Area dataKey='value' strokeWidth={0} stackId="2" stroke='#867AE5' fill="url(#color1)" fillOpacity={1}/>
            </AreaChart>
          </ResponsiveContainer>
        </Col>
      </Row>
    </Metrics>
  );
};

export default GrowthCard;
