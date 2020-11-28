import React from "react";
import {Avatar} from "antd";

const UserCell = ({onSelectUser, selectedSectionId, user}) => {

  return (
    <div className={`gx-chat-user-item ${selectedSectionId === user.id ? 'active' : ''}`} onClick={() => {
      onSelectUser(user);
    }}>
      <div className="gx-chat-user-row">
        <div className="gx-chat-avatar">
          <div className="gx-status-pos">
            <Avatar src={user.thumb} className="gx-size-40" alt="Abbott"/>
            <span className={`gx-status ${user.status}`}/>
          </div>
        </div>

        <div className="gx-chat-contact-col">
          <div className="h4 gx-name">{user.name}</div>
          <div className="gx-chat-info-des gx-text-truncate">{user.mood.substring(0, 40) + "..."}</div>
        </div>
      </div>
    </div>
  )
};

export default UserCell;
