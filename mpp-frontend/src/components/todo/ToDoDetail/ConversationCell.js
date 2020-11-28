import React from "react";
import {Avatar} from "antd";

const ConversationCell = ({conversation}) => {
  return (
    <div className="gx-flex-row gx-module-detail-item gx-flex-nowrap">
      <div className="gx-chat-todo-avatar">

        <Avatar className="gx-rounded-circle gx-size-40" src={conversation.thumb}
                alt="..."/>
      </div>
      <div className="gx-chat-toto-info">
        <div className="gx-flex-column">
          <div className="gx-name gx-mr-2">{conversation.name}</div>
          <div className="gx-time gx-text-muted">{conversation.sentAt}</div>
        </div>
        <div className="gx-message">{conversation.message}</div>
      </div>
    </div>
  )
};

export default ConversationCell;
