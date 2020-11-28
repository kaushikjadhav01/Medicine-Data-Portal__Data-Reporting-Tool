import React from "react";
import {Avatar, Dropdown, Menu} from "antd";

import Widget from "components/Widget/index";

const menu = (
  <Menu>
    <Menu.Item key="0">
      <a href="http://www.alipay.com/">1st menu item</a>
    </Menu.Item>
    <Menu.Item key="1">
      <a href="http://www.taobao.com/">2nd menu item</a>
    </Menu.Item>
    <Menu.Divider/>
    <Menu.Item key="3">3rd menu item</Menu.Item>
  </Menu>
);


const ProjectWidget = () => {
  return (
    <Widget styleName="gx-ch-capitalize gx-card-sm-px" extra={
      <ul className="gx-list-inline gx-ml-auto gx-mb-0 gx-text-grey">
        <li><i className="icon icon-sweet-alert"/></li>
        <li><i className="icon icon-invert-color"/></li>
        <li><Dropdown overlay={menu} trigger={['click']}>
          <span className="gx-link ant-dropdown-link gx-text-grey">
            <i className="icon icon-chevron-down"/>
          </span>
        </Dropdown></li>
      </ul>
    } title="Project Widget">
      <div className="gx-text-center gx-pt-sm-3">
        <img className="gx-size-60 gx-mb-3" src={require("assets/images/widget/birds.png")} alt='birds'/>

        <h2 className="gx-mb-3 gx-mb-sm-4">Eagal Hunt App</h2>

        <ul className="gx-list-inline gx-mb-3 gx-mb-lg-4">
          <li><Avatar src={require("assets/images/avatar/steve-smith.png")}/></li>
          <li><Avatar src={require("assets/images/avatar/stella-johnson.png")}/></li>
          <li><Avatar src={require("assets/images/avatar/domnic-harris.png")}/></li>
          <li><Avatar className="gx-bg-primary gx-text-white">Ms</Avatar></li>
          <li><span className="ant-avatar gx-border gx-border-grey gx-bg-transparent gx-text-grey gx-d-flex gx-align-items-center gx-justify-content-center"><i
            className="icon icon-add"/></span></li>
        </ul>
        <button className="gx-btn gx-btn-primary gx-text-white gx-mb-1">Go to project</button>
      </div>
    </Widget>
  );
};

export default ProjectWidget;
