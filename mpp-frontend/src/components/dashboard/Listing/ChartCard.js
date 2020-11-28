import React, {useState} from "react";
import Widget from "components/Widget/index";


const ChartCard = (props) => {
  const [isHide, setHide] = useState(false);
  const handleToggle = () => {
    setHide(!isHide);
  };

  const {prize, title, styleName, desc, bgColor, percent} = props.chartProperties;
  return (
    <Widget styleName={`gx-card-full`}>
      <div
        className={isHide === true ? `gx-fillchart gx-bg-${bgColor} gx-fillchart-nocontent` : `gx-fillchart gx-bg-${bgColor} gx-overlay-fillchart`}>

        <div className="ant-card-head-title">{title}</div>
        {props.children}
        <div className="gx-fillchart-content">
          <div className="ant-card-head-title gx-mb-3">{title}</div>
          <h2 className="gx-mb-2 gx-fs-xxxl gx-font-weight-medium">{prize}</h2>
          {percent > 0}
          <p className="gx-mb-0 gx-fs-sm"><span
            className={`gx-font-weight-medium gx-fs-md gx-chart-${styleName}`}>{percent}
            {percent > 0 ? <i className="icon icon-menu-up gx-fs-sm"/> : null}</span>{desc}</p>
        </div>
        <div className="gx-fillchart-btn-close" onClick={handleToggle}><i
          className="icon icon-close"/></div>
        <div className="gx-fillchart-btn" onClick={handleToggle}><i
          className={`icon icon-stats gx-fs-xxxl`}/>
        </div>
      </div>
    </Widget>
  );
};

export default ChartCard;
