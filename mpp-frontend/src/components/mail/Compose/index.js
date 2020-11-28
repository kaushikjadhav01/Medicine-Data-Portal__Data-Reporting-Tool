import React from "react";
import {Button, Input, message, Modal, Upload} from "antd";
import Moment from "moment";

import IntlMessages from "util/IntlMessages";

const {TextArea} = Input;

const props = {
  name: 'file',
  action: '//jsonplaceholder.typicode.com/posts/',
  headers: {
    authorization: 'authorization-text',
  },
  onChange(info) {
    if (info.file.status !== 'uploading') {
      console.log(info.file, info.fileList);
    }
    if (info.file.status === 'done') {
      message.success(`${info.file.name} file uploaded successfully`);
    } else if (info.file.status === 'error') {
      message.error(`${info.file.name} file upload failed.`);
    }
  },
};

class ComposeMail extends React.Component {
  constructor() {
    super();
    this.state = {
      to: '',
      cc: '',
      bcc: '',
      subject: '',
      message: '',
    }
  }

  render() {
    const {onMailSend, onClose, user} = this.props;
    const {to, subject, message} = this.state;
    return (
      <Modal onCancel={onClose} visible={this.props.open}
             title={<IntlMessages id="mail.title"/>}
             closable={false}
             onOk={() => {
               if (to === '')
                 return;
               onClose();
               onMailSend(
                 {
                   'id': '15453a06c08fb021776',
                   'from': {
                     'name': user.name,
                     'avatar': user.avatar,
                     'email': user.email
                   },
                   'to': [
                     {
                       'name': to,
                       'email': to
                     }
                   ],
                   'subject': subject,
                   'message': message,
                   'time': Moment().format('DD MMM'),
                   'read': false,
                   'starred': false,
                   'important': false,
                   'hasAttachments': false,
                   'folder': 1,
                   'selected': false,
                   'labels': [],
                 })

             }}
             style={{zIndex: 2600}}>
        <div className="gx-form-group">
          <Input
            placeholder="To*"
            onChange={(event) => this.setState({to: event.target.value})}
            defaultValue={to}
            margin="normal"/>
        </div>
        <div className="gx-form-group">
          <Input
            placeholder="Subject"
            onChange={(event) => this.setState({subject: event.target.value})}
            value={subject}
            margin="normal"
          />
        </div>
        <div className="gx-form-group">
          <TextArea
            placeholder="Message"
            onChange={(event) => this.setState({message: event.target.value})}
            value={message}
            autosize={{minRows: 2, maxRows: 6}}
            margin="normal"/>
        </div>

        <div className="gx-form-group">

          <Upload {...props}>
            <Button type="primary">
              <i className="icon icon-attachment"/> Attach File
            </Button>
          </Upload>

        </div>
      </Modal>
    );
  }
}

export default ComposeMail;
