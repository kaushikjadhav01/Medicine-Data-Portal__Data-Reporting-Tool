import React from "react";
import {Badge} from "antd";
import {Area, AreaChart, ResponsiveContainer, Tooltip} from "recharts";

import Widget from "components/Widget/index";

const data = [
  {name: 'Page A', lastWeek: 1900, thisWeek: 3200},
  {name: 'Page B', lastWeek: 1300, thisWeek: 4000},
  {name: 'Page C', lastWeek: 1850, thisWeek: 2500},
  {name: 'Page D', lastWeek: 1680, thisWeek: 3000},
  {name: 'Page H', lastWeek: 3900, thisWeek: 2560},
  {name: 'Page I', lastWeek: 1400, thisWeek: 2700},
  {name: 'Page J', lastWeek: 2200, thisWeek: 2000},
  {name: 'Page K', lastWeek: 1300, thisWeek: 2000},
  {name: 'Page L', lastWeek: 1880, thisWeek: 3408},
  {name: 'Page M', lastWeek: 2290, thisWeek: 2960},
];

const WorkStatusCard = () => {

  return (
    <Widget styleName="gx-card-img gx-card-cover-black" hoverable
            title={<h1 className="gx-font-weight-bold gx-mb-1 gx-fs-xxl">76% <i className="icon icon-menu-up gx-fs-sm"/>
            </h1>}
            cover={
              <ResponsiveContainer className="gx-bg-dark" width="100%" height={80}>
                <AreaChart data={data}
                           margin={{top: 10, right: 0, left: 0, bottom: 0}}>
                  <Tooltip/>
                  <Area type='monotone' dataKey="thisWeek" stackId="2" stroke='#FE9E15' fill='#FE9E15' fillOpacity={1}/>
                  <Area type='monotone' dataKey='lastWeek' stackId="1" stroke='#038FDE' fill='#038FDE' fillOpacity={1}/>
                </AreaChart>
              </ResponsiveContainer>
            }>
      <Badge className="gx-badge-up gx-badge-up-right gx-bg-white gx-text-primary gx-size-36"><i
        className="icon icon-long-arrow-right gx-fs-lg"/> </Badge>
      <h4>Works Status</h4>
      <p className="gx-text-light gx-fs-sm gx-mb-0">Last week progress</p>
    </Widget>
  );
};

export default WorkStatusCard;
