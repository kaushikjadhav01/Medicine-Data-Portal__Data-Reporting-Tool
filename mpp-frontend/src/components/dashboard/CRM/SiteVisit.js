import React from "react";
import {Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip} from "recharts";
import {siteVisit} from "../../../routes/main/dashboard/CRM/data";

const SiteVisit = () => (
  <div className="gx-site-dash gx-pr-xl-5 gx-pt-3 gx-pt-xl-0 gx-pt-xl-2">
    <h6 className="gx-text-uppercase gx-mb-2 gx-mb-xl-4">Site Visits</h6>
    <ResponsiveContainer width="100%" height={140}>
      <AreaChart data={siteVisit}
                 margin={{top: 10, right: 0, left: -20, bottom: 0}}>
        <Tooltip/>
        <CartesianGrid horizontal={false} strokeDasharray="3 3"/>
        <Area type='monotone' dataKey='thisYear' fillOpacity={1} stroke='#038FDE' fill='#038FDE'/>
        <Area type='monotone' dataKey='lastYear' fillOpacity={1} stroke='#FE9E15' fill='#FE9E15'/>
      </AreaChart>
    </ResponsiveContainer>
  </div>
);

export default SiteVisit;

