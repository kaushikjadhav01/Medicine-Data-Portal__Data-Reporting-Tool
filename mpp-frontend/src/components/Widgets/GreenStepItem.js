import React from "react";
import Auxiliary from "util/Auxiliary";


const GreenStepItem = ({data}) => {
  const {title, subTitle, desc} = data;
  return (

    <Auxiliary>
      <h2 className="h3 gx-mb-2">{title}</h2>
      <p className="gx-text-grey">{subTitle}</p>
      <p>{desc}</p>
    </Auxiliary>
  );
};

export default GreenStepItem;
