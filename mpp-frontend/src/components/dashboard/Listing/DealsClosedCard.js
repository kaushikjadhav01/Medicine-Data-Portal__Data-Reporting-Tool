import React from "react";
import {Bar, BarChart, ResponsiveContainer, Tooltip, XAxis} from "recharts";
import Widget from "components/Widget/index";
import {Badge} from "antd";

const data = [
  {name: 'JAN', closedDeals: 200, queries: 600,},
  {name: 'FEB', closedDeals: 500, queries: 900,},
  {name: 'MAR', closedDeals: 700, queries: 1200,},
  {name: 'APR', closedDeals: 800, queries: 1300,},
  {name: 'MAY', closedDeals: 700, queries: 1200,},
  {name: 'JUN', closedDeals: 500, queries: 900,},
  {name: 'JUL', closedDeals: 600, queries: 200,},
  {name: 'AUG', closedDeals: 200, queries: 800,},
  {name: 'SEP', closedDeals: 400, queries: 400,},
  {name: 'OCT', closedDeals: 400, queries: 500,},
  {name: 'NOV', closedDeals: 400, queries: 1200,},
  {name: 'DEC', closedDeals: 200, queries: 800,},
];

const DealsClosedCard = () => {

  return (
    <Widget>
      <div className="gx-dealclose-header">
        <div>
          <h2 className="h4 gx-mb-2">927 Deals Closed</h2>
          <p className="gx-text-grey">This year</p>
        </div>
        <div className="gx-dealclose-header-right">
          <p className="gx-mb-2"><Badge className="gx-mb-0" status="warning"/>Queries</p>
          <p className="gx-ml-2 gx-mb-2"><Badge className="gx-mb-0" status="processing"/>Closed Deals</p>
        </div>
      </div>
      <ResponsiveContainer width="100%" height={90}>
        <BarChart data={data}
                  margin={{top: 0, right: 0, left: 0, bottom: 0}}>
          <Tooltip/>
          <XAxis dataKey="name"/>
          <Bar dataKey="closedDeals" stackId="a" fill="#038FDE" barSize={8}/>
          <Bar dataKey="queries" stackId="a" fill="#FE9E15" barSize={8}/>
        </BarChart>
      </ResponsiveContainer>
    </Widget>
  );
};

export default DealsClosedCard;
