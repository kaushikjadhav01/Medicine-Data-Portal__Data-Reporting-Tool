import React from "react";
import {Bar, BarChart, ResponsiveContainer, Tooltip} from "recharts";
import {Col, Row} from "antd";

import Widget from "components/Widget/index";

const data = [
  {name: 'Page A', uv: 500, price: 600, sv: 400},
  {name: 'Page B', uv: 700, price: 800, sv: 700},
  {name: 'Page C', uv: 900, price: 1400, sv: 700},
  {name: 'Page D', uv: 1600, price: 1800, sv: 1800},
  {name: 'Page G', uv: 1200, price: 1000, sv: 1800},
  {name: 'Page F', uv: 800, price: 1000, sv: 1200},
  {name: 'Page G', uv: 500, price: 300, sv: 1500},
  {name: 'Page H', uv: 400, price: 200, sv: 600},
  {name: 'Page I', uv: 900, price: 800, sv: 1400},
];

const CampaignCard = () => {
  return (
    <Widget styleName="gx-card-full gx-px-3 gx-py-3">
      <Row>
        <Col xl={15} lg={15} md={15} sm={24} xs={24} className="gx-pr-md-2">
          <h2 className="h4 gx-mb-2">Campaign Stats</h2>
          <p className="gx-mb-1 gx-text-grey gx-fs-sm">Past three weeks</p>
          <i className="icon icon-long-arrow-right gx-text-blue gx-fs-lg gx-pointer"/>
        </Col>
        <Col xl={9} lg={9} md={9} sm={24} xs={24} className="gx-pr-md-2">
          <ResponsiveContainer width="100%" height={50}>
            <BarChart data={data}
                      margin={{top: 0, right: 0, left: 0, bottom: 0}}>
              <Tooltip/>
              <Bar dataKey="uv" stackId="a" fill="#10316B"/>
              <Bar dataKey="price" stackId="a" fill="#FE9E15"/>
              <Bar dataKey="sv" stackId="a" fill="#038FDE"/>
            </BarChart>
          </ResponsiveContainer>
        </Col>
      </Row>
    </Widget>
  );
};

export default CampaignCard;
