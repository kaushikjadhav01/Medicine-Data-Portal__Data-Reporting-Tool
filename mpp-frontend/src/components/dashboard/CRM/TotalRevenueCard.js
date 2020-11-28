import React from "react";
import {Bar, BarChart, ResponsiveContainer, Tooltip} from "recharts";
import {Col, Row} from "antd";

import Metrics from "components/Metrics";
import {connect} from "react-redux";

const data = [
  {name: 'JAN', lastYear: 200, thisYear: 600,},
  {name: 'FEB', lastYear: 500, thisYear: 900,},
  {name: 'MAR', lastYear: 700, thisYear: 1200,},
  {name: 'JUN', lastYear: 500, thisYear: 900,},
  {name: 'AUG', lastYear: 200, thisYear: 800,},
  {name: 'SEP', lastYear: 400, thisYear: 400,},
  {name: 'OCT', lastYear: 400, thisYear: 500,},
  {name: 'NOV', lastYear: 400, thisYear: 1200,},
  {name: 'DEC', lastYear: 200, thisYear: 800,},
];

const TotalRevenueCard = ({width}) => {
  return (
    <Metrics title="TOTAL REVENUE">
      <Row>
        <Col xl={11} lg={12} md={24} sm={12} xs={12}>
          <h1 className="gx-mb-1 gx-revenue-title">$2,167</h1>
          <p className="gx-mb-md-0 gx-text-light">YTD revenue</p>
        </Col>
        <Col xl={13} lg={12} md={24} sm={12} xs={12}>

          <ResponsiveContainer className="gx-barchart" width="100%" height={70}>
            <BarChart data={data}
                      margin={{top: 0, right: 0, left: 0, bottom: 0}}>
              <Tooltip/>
              <Bar dataKey="lastYear" stackId="a" fill="#038FDE" barSize={width <= 575 ? 4 : 8}/>
              <Bar dataKey="thisYear" stackId="a" fill="#FE9E15" barSize={width <= 575 ? 4 : 8}/>
            </BarChart>
          </ResponsiveContainer>
        </Col>
      </Row>
    </Metrics>
  );
};


const mapStateToProps = ({settings}) => {
  const {width} = settings;
  return {width}
};
export default connect(mapStateToProps)(TotalRevenueCard);
