import React from "react";
import Icon from '@ant-design/icons';
import { MailOutlined,MessageOutlined,BellOutlined,UnorderedListOutlined   } from '@ant-design/icons';
const WelComeCard = () => {

  return (
    <div className="gx-wel-ema gx-pt-xl-2">
      <h1 className="gx-mb-3">Welcome Ema!</h1>
      <p className="gx-fs-sm gx-text-uppercase">You Have</p>
      <ul className="gx-list-group">
        <li>
          <MessageOutlined />

          <span>5 Unread messages</span>
        </li>
        <li>
          <MailOutlined />
          <span>2 Pending invitations</span>
        </li>
        <li>
          <UnorderedListOutlined />
          <span>7 Due tasks</span>
        </li>
        <li>
          <BellOutlined />
          <span>3 Other notifications</span>
        </li>
      </ul>
    </div>

  );
};

export default WelComeCard;
