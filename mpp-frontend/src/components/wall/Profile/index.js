import React, {useState} from "react";
import {Button} from "antd";
import {useSelector} from "react-redux";
import Auxiliary from "util/Auxiliary";

const Profile = (props) => {

  const [isFollow, setIsFollow] = useState(false);

  const authUser = useSelector(({auth}) => auth.authUser);

  const handleToggle = () => {
    setIsFollow((previousState) => ({
      isFollow: !previousState.isFollow
    }));
  };

  const {user, userInfo} = props;
  const {id, name, image, address} = user;
  const {followers, following, frinds} = userInfo;
  return (
    <Auxiliary>
      <div className="gx-profileon">
        <div className="gx-profileon-thumb gx-profileon-thumb-htctrcrop">
          <img src={image} alt=''/>
        </div>
        <div className="gx-profileon-content">
          <p className="gx-profileon-title">{name}</p>
          <span className="gx-fs-sm">{address}</span>
        </div>
      </div>

      <div className="gx-follower gx-text-center">
        <ul className="gx-follower-list">
          <li>
            <span className="gx-follower-title">{followers}</span>
            <span>Followers</span>
          </li>
          <li>
            <span className="gx-follower-title">{following}</span>
            <span>Following</span>
          </li>
          <li>
            <span className="gx-follower-title">{frinds}</span>
            <span>project</span>
          </li>
        </ul>
      </div>
      <div className="gx-mb-xl-4 gx-mb-3">
        <p>You are following {name}</p>
        {authUser === id ? null :
          <Button className="gx-btn-sm gx-mb-0" type="primary"
                  onClick={handleToggle}>{isFollow === true ? 'Follow' : 'Unfollow'}</Button>
        }
      </div>
    </Auxiliary>
  )
};

export default Profile
