import React from "react";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import WidgetHeader from "components/WidgetHeader/index";

const Communities = (props) => {

  const {communitiesList} = props;
  return (
    <div className="gx-entry-sec">
      <WidgetHeader title="Communities"/>
      <ul className="gx-gallery-list">
        {communitiesList.map((communities, index) =>
          <li key={index}>
            <div className="gx-gallery-thumb">
              <img alt="..." src={communities.image}/>
              <div className="gx-gallery-thumb-content">
                <h6>{communities.title}</h6>
              </div>
            </div>
          </li>
        )}
      </ul>
    </div>
  )
};

export default Communities
