import React from "react";
import {Avatar} from "antd";
import {Area, AreaChart, ResponsiveContainer} from "recharts";

import Widget from "components/Widget/index";

const data = [
  {name: 'Page A', price: 200},
  {name: 'Page B', price: 800},
  {name: 'Page C', price: 600},
  {name: 'Page D', price: 2200},
  {name: 'Page D', price: 1000},
  {name: 'Page H', price: 2960},
  {name: 'Page K', price: 1960},
];

const Productivity = () => {
  return (
    <Widget styleName="gx-card-full" extra={<i className="icon icon-setting gx-text-grey gx-fs-xl"/>}>
      <div className="gx-text-center gx-px-3 gx-pt-3">
        <div className="gx-d-flex gx-justify-content-around gx-align-items-center gx-mb-3">
          <i className="icon icon-chart gx-fs-xxl gx-text-grey"/>
          <Avatar className="gx-size-80" src={require("assets/images/avatar/stella-johnson.png")}/>
          <i className="icon icon-chat gx-fs-xxl gx-text-grey"/>
        </div>
        <div className="gx-mb-3">
          <h2>Christina Johnson</h2>
          <p className="gx-text-grey">Crypto Expert</p>
        </div>
      </div>
      <div className="gx-rechart">
        <div className="gx-rechart-prod">
          <div className="gx-d-flex gx-flex-row">
            <i className="icon icon-menu-up gx-text-geekblue gx-mr-2 gx-pt-1"/>
            <h2 className="gx-text-geekblue">38%</h2>
          </div>
          <p className="gx-text-left gx-text-grey">Productivity</p>
        </div>
        <ResponsiveContainer width="100%" height={118}>
          <AreaChart data={data}
                     margin={{top: 0, right: 0, left: 0, bottom: 0}}>
            <Area type='monotone' dataKey="price" stackId="2" stroke='#4D95F3' fill="#038FDE" fillOpacity={1}/>
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </Widget>
  );
};

export default Productivity;
