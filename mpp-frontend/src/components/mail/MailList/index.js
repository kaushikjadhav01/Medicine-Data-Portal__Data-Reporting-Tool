import React from "react";
import CustomScrollbars from 'util/CustomScrollbars'

import MailListItem from "./MailListItem";

const MailList = ({mails, onMailSelect, onMailChecked, onStartSelect}) => {
  return (
    <div className="gx-module-list gx-mail-list">
      <CustomScrollbars className="gx-module-content-scroll">
        {mails.map((mail, index) =>
          <MailListItem key={index} mail={mail} onMailSelect={onMailSelect} onMailChecked={onMailChecked}
                        onStartSelect={onStartSelect}/>
        )}
      </CustomScrollbars>
    </div>
  )
};

export default MailList;
