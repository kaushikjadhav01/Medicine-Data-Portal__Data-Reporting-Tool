import React from "react";
import PropTypes from "prop-types";

import Aux from "util/Auxiliary";

const LineIndicator = ({title, width, value, color}) => {

  return (
    <Aux>
      <p>{title}</p>
      <div className="gx-line-indi-info">
        <div className={`gx-line-indi gx-bg-${color}`} style={{
          width: Number.parseInt(width, 10) * 4
        }}/>

        <span className="gx-line-indi-count gx-ml-2">{value}</span>
      </div>
    </Aux>

  );
};

export default LineIndicator;

LineIndicator.propTypes = {
  title: PropTypes.string.isRequired,
  width: PropTypes.string.isRequired,
  value: PropTypes.string.isRequired,
  color: PropTypes.string.isRequired,
};
