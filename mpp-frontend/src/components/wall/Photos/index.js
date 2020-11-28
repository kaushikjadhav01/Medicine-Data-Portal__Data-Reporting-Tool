import React from "react";
import WidgetHeader from "components/WidgetHeader/index";

const Photos = ({photoList, title}) => {

  return (
    <div className="gx-entry-sec">
      <WidgetHeader title={title}/>

      <ul className="gx-gallery-list">
        {photoList.map((photo, index) =>
          <li key={index}>
            <img alt="..." src={photo.image}/>
          </li>
        )}
      </ul>
    </div>
  )
}
export default Photos
