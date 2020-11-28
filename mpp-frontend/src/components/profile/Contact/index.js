import React from "react";
import Widget from "components/Widget";
import {contactList} from '../../../routes/socialApps/Profile/data'

const Contact = () => {
  return (
    <Widget title="Contact" styleName="gx-card-profile-sm">
      {contactList.map((data, index) =>
        <div key={index} className="gx-media gx-align-items-center gx-flex-nowrap gx-pro-contact-list">
          <div className="gx-mr-3">
            <i className={`icon icon-${data.icon} gx-fs-xxl gx-text-grey`}/>
          </div>
          <div className="gx-media-body">
            <span className="gx-mb-0 gx-text-grey gx-fs-sm">{data.title}</span>
            <p className="gx-mb-0">{data.desc}</p>
          </div>
        </div>
      )}
    </Widget>
  )
}

export default Contact;
