import React from "react";
import {Card} from "antd";
import PropTypes from "prop-types";


const Metrics = ({title, styleName, children}) => {
  return (
    <Card title={title} className={`gx-card-metrics ${styleName}`}>
      {children}
    </Card>
  )
};

export default Metrics;
Metrics.defaultProps = {
  styleName: ""
};

Metrics.propTypes = {
  title: PropTypes.string.isRequired,
  styleName: PropTypes.string,
  children: PropTypes.node.isRequired
};
