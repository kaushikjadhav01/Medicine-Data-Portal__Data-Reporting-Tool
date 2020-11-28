import React from "react";
import {Badge} from "antd";
import WidgetHeader from "components/WidgetHeader/index";

function Status(props) {
  const isType = props.isType;
  if (isType === 'online') {
    return <Badge status="success"/>;
  } else if (isType === 'away') {
    return <Badge status="warning"/>;
  } else {
    return <Badge count={0} status="error"/>;
  }
}

const Friends = ({friendList}) => {
  return (
    <div className="gx-entry-sec">
      <WidgetHeader title={<span>Friends - 530 <span className="gx-text-grey">(27 Mutual)</span></span>}/>
      <ul className="gx-fnd-list">
        {friendList.map((user, index) =>
          <li className="gx-mb-2" key={index}>
            <div className="gx-user-fnd">
              <img alt="..." src={user.image}/>
              <div className="gx-user-fnd-content">
                <Status isType={user.status}/>
                <h6>{user.name}</h6>
              </div>
            </div>
          </li>
        )
        }
      </ul>
    </div>
  )
};
export default Friends;
