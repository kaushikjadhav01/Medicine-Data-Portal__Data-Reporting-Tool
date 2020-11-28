import React from "react";
import {Area, AreaChart, ResponsiveContainer, Tooltip} from "recharts";

import Widget from "components/Widget/index";

const data = [
  {name: 'Page A', increment: 200},
  {name: 'Page B', increment: 1000},
  {name: 'Page C', increment: 600},
  {name: 'Page D', increment: 1600},
  {name: 'Page D', increment: 1000},
  {name: 'Page H', increment: 2260},
  {name: 'Page K', increment: 400},
];

const IncreamentCard = () => {
  return (
    <Widget styleName="gx-card-full">

      <div className="gx-actchart gx-px-3 gx-pt-3 gx-pb-2 gx-d-flex gx-flex-row">
        <h2 className="gx-mb-0 gx-mr-2 gx-fs-lg">84% <i className="icon icon-menu-up gx-fs-sm"/></h2>
        <p className="gx-mb-0 gx-text-grey gx-fs-sm">Increment in Active users</p>
      </div>
      <ResponsiveContainer width="100%" height={60}>
        <AreaChart data={data}
                   margin={{top: 0, right: 0, left: 0, bottom: 0}}>
          <Tooltip/>
          <defs>
            <linearGradient id="color07" x1="0" y1="0" x2="1" y2="0">
              <stop offset="5%" stopColor="#FF557F" stopOpacity={0.9}/>
              <stop offset="95%" stopColor="#6757DE" stopOpacity={0.9}/>
            </linearGradient>
          </defs>
          <Area dataKey="increment" stackId="2" strokeWidth={0} stroke='#4D95F3' fill="url(#color07)" fillOpacity={1}/>
        </AreaChart>
      </ResponsiveContainer>

    </Widget>
  );
};

export default IncreamentCard;
