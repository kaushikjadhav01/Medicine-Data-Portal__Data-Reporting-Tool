import React from "react";
import {Avatar, Dropdown, Menu} from "antd";
import CustomScrollbars from 'util/CustomScrollbars'

import labels from "routes/inBuiltApps/Mail/data/labels";

const options = [
  'Reply',
  'Forward',
  'Print',
];

class MailDetail extends React.Component {

  state = {
    showDetail: false
  };

  optionMenu = () => {
    return (
      <Menu id="long-menu">
        {options.map(option =>
          <Menu.Item key={option}>
            {option}
          </Menu.Item>,
        )}
      </Menu>)
  };

  render() {
    const {mail, onStartSelect, onImportantSelect} = this.props;

    return (
      <div className="gx-module-detail gx-mail-detail">
        <CustomScrollbars className="gx-module-content-scroll">
          <div className="gx-mail-detail-inner">
            <div className="gx-mail-header">

              <div className="gx-mail-header-content gx-col gx-pl-0">
                <div className="gx-subject">
                  {mail.subject}
                </div>

                <div className="gx-labels">
                  {labels.map((label, index) => {
                    return (mail.labels).includes(label.id) && <div key={index}
                                                                    className={`gx-badge gx-text-white gx-bg-${label.color}`}>{label.title}</div>
                  })}
                </div>


              </div>

              <div className="gx-mail-header-actions">

                <div onClick={() => {
                  onStartSelect(mail);
                }}>
                  {mail.starred ?
                    <i className="icon icon-star gx-icon-btn"/> :
                    <i className="icon icon-star-o gx-icon-btn"/>
                  }

                </div>
                <div onClick={() => {
                  onImportantSelect(mail);
                }}>

                  {mail.important ?
                    <i className="icon icon-important gx-icon-btn"/>
                    : <i className="icon icon-important-o gx-icon-btn"/>
                  }
                </div>
              </div>

            </div>
            <hr/>

            <div className="gx-mail-user-info gx-ml-0 gx-mb-3">

              {mail.from.avatar === '' ?
                <Avatar
                  className="gx-avatar gx-bg-blue gx-size-40 gx-mr-3"> {mail.from.name.charAt(0).toUpperCase()}</Avatar> :
                <Avatar className="gx-size-40 gx-mr-3" alt="Alice Freeman"
                        src={mail.from.avatar}/>
              }

              <div className="gx-sender-name">{mail.from.name}
                <div className="gx-send-to gx-text-grey">to me</div>
              </div>

              <Dropdown trigger={['click']} overlay={this.optionMenu()}>
                <span className="gx-ml-auto"><i className="icon icon-ellipse-v gx-icon-btn"/></span>
              </Dropdown>

            </div>

            <div className="gx-show-link" onClick={() => {
              this.setState({showDetail: !this.state.showDetail});
            }}>{this.state.showDetail ? 'Hide Detail' : 'Show Detail'}</div>
            {this.state.showDetail && (<div className="gx-show-detail">
              <div>
                <strong>From: </strong>{mail.from.email}
              </div>
              <div>
                <strong> To: </strong>
                {
                  mail.to.map((to, index) => <span>{index > 0 && ', '} {to.email}</span>)
                }
              </div>
              <div><strong>Date: </strong>{mail.time} </div>
            </div>)}


            <p>
              {mail.message}
            </p>

            {mail.hasAttachments &&
            <div className="gx-attachment-block">
              <h3>Attachments ({mail.attachments.length})</h3>
              <div className="gx-attachment-row">
                {mail.attachments.map((attachment, index) =>
                  <div className="gx-attachment-col" key={index}>
                    <img src={attachment.preview} alt={attachment.fileName}/>
                    <div className="size">{attachment.size}</div>
                  </div>
                )}
              </div>
            </div>
            }
          </div>
        </CustomScrollbars>
      </div>
    );
  }
}

export default MailDetail;
