import React from "react";
import {Badge} from "antd";
import Widget from "../../Widget/index";


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
    <Widget styleName="gx-card-profile-sm"
            title={<span>Friends - 530 <span className="gx-text-grey">(27 Mutual)</span></span>}>
      <div className="gx-pt-2">
        <ul className="gx-fnd-list gx-mb-0">
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
    </Widget>
  )
};
export default Friends;
