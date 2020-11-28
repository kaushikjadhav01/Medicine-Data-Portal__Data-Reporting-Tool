import React from "react";
import {Avatar, Input, Modal} from "antd";

import IntlMessages from "util/IntlMessages";

class AddContact extends React.Component {
  constructor(props) {
    super(props);

    const {id, thumb, name, email, phone, designation, selected, starred, frequently} = props.contact;
    this.state = {
      id,
      thumb,
      name,
      email,
      phone,
      designation,
      selected,
      starred,
      frequently
    }
  }

  render() {
    const {onSaveContact, onContactClose, open, contact} = this.props;
    const {id, name, email, phone, designation, selected, starred, frequently} = this.state;
    let {thumb} = this.state;
    if (!thumb) {
      thumb = require('assets/images/placeholder.jpg');
    }
    return (
      <Modal
        title={contact.name === '' ?
          <IntlMessages id="contact.addContact"/> :
          <IntlMessages id="contact.saveContact"/>}
        toggle={onContactClose} visible={open}
        closable={false}
        onOk={() => {
          if (name === '')
            return;
          onContactClose();
          onSaveContact(
            {
              'id': id,
              'name': name,
              'thumb': thumb,
              'email': email,
              'phone': phone,
              'designation': designation,
              'selected': selected,
              'starred': starred,
              'frequently': frequently
            });
          this.setState({
            'id': id + 1,
            'name': '',
            'thumb': '',
            'email': '',
            'phone': '',
            'designation': '',
          })

        }}
        onCancel={onContactClose}>

        <div className="gx-modal-box-row">
          <div className="gx-modal-box-avatar">
            <Avatar size="large" src={thumb}/>
          </div>

          <div className="gx-modal-box-form-item">
            <div className="gx-form-group">
              <Input
                required
                placeholder="Name"
                onChange={(event) => this.setState({name: event.target.value})}
                defaultValue={name}
                margin="none"/>
            </div>
            <div className="gx-form-group">
              <Input
                placeholder="Email"
                onChange={(event) => this.setState({email: event.target.value})}
                value={email}
                margin="normal"/>
            </div>
            <div className="gx-form-group">
              <Input
                placeholder="Phone"
                onChange={(event) => this.setState({phone: event.target.value})}
                value={phone}
                margin="normal"
              />
            </div>
            <div className="gx-form-group">
              <Input
                placeholder="Designation"
                onChange={(event) => this.setState({designation: event.target.value})}
                value={designation}
                autosize={{minRows: 2, maxRows: 6}}
                margin="normal"/>
            </div>
          </div>
        </div>
      </Modal>
    );
  }
}

export default AddContact;
