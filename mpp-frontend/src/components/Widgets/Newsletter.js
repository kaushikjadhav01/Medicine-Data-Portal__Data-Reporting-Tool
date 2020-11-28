import React from "react";
import {Button, Form, Input} from "antd";

import Widget from "components/Widget/index";


const Newsletter = () => {
  return (
    <Widget
      title={<h4 className="gx-text-primary gx-text-capitalize gx-mb-0">
        <i className="icon icon-mail-open gx-mr-3"/>
        Newsletter Subscription</h4>
      }>
      <h2 className="gx-mb-3 gx-mb-xxl-4 gx-font-weight-light">Dont's miss our weekly news and updates</h2>
      <Form className="gx-signup-form gx-form-row0 gx-mb-0">
        <div className="gx-mb-3">
          <Input placeholder="Username"/>
        </div>
        <Button type="primary" className="gx-mb-0" htmlType="submit">
          Subscribe
        </Button>
      </Form>
    </Widget>
  );
};

export default Newsletter;
