import React from "react";
import WidgetHeader from "components/WidgetHeader/index";

const Interests = ({interestList}) => {
  return (
    <div className="gx-entry-sec">
      <WidgetHeader title="Interests"/>
      <ul className="gx-list-inline">
        {interestList.map((interest) =>
          <li key={interest.id}>
            <span className="gx-link gx-btn gx-btn-white gx-mb-10">{interest.interest}</span>
          </li>
        )}
      </ul>
    </div>
  )
};

export default Interests
