import React from "react";
import {Avatar} from "antd";

const ReceivedMessageCell = ({conversation, user}) => {
  return (
    <div className="gx-chat-item">

      <Avatar className="gx-size-40 gx-align-self-end" src={user.thumb}
              alt=""/>

      <div className="gx-bubble-block">
        <div className="gx-bubble">
          <div className="gx-message">{conversation.message}</div>
          <div className="gx-time gx-text-muted gx-text-right gx-mt-2">{conversation.sentAt}</div>
        </div>
      </div>

    </div>
  )
};

export default ReceivedMessageCell;
