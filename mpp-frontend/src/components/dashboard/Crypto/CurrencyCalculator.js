import React from "react";
import {Button, Form, Input, Select} from "antd";
import Widget from "components/Widget/index";

const Option = Select.Option;
const FormItem = Form.Item;

const CurrencyCalculator = () => {

  function handleChange(value) {
    console.log(`selected ${value}`);
  }

  return (
    <Widget
      title={<h2 className="h4 gx-mb-0 gx-text-capitalize">Currency Calculator</h2>}>
      <p className="gx-mb-2">1.87 BTC equals</p>
      <h1 className="gx-mb-2 gx-text-primary gx-font-weight-medium gx-fs-xxl">11466.78 USD</h1>
      <p className="gx-text-grey gx-fs-sm gx-mb-3 gx-mb-lg-4">@ 1 BTC = 6718.72 USD</p>
      <Form layout="inline" className="gx-form-inline-label-up gx-form-inline-currency">
        <FormItem label="From" className="gx-form-item-one-fourth">
          <Select defaultValue="BTC" onChange={handleChange}>
            <Option value="jack">BTC</Option>
            <Option value="lucy">USD</Option>
          </Select>
        </FormItem>
        <FormItem label="To" className="gx-form-item-one-fourth">
          <Select defaultValue="BTC" onChange={handleChange}>
            <Option value="jack">BTC</Option>
            <Option value="lucy">USD</Option>
          </Select>
        </FormItem>
        <FormItem label="Amount (BTC)" className="gx-form-item-two-fourth">
          <Input placeholder="0.0"/>
        </FormItem>
        <FormItem className="gx-d-block gx-mb-1 gx-mt-1">
          <Button className="gx-mb-0" type="primary">Transfer Now</Button>
        </FormItem>
      </Form>
    </Widget>
  );
};

export default CurrencyCalculator;
