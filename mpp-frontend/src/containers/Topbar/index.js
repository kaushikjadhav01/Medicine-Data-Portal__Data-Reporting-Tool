import React, { useState } from "react";
import { Layout, Popover } from "antd";
import { Link } from "react-router-dom";

import CustomScrollbars from "util/CustomScrollbars";
import languageData from "./languageData";
import { switchLanguage, toggleCollapsedSideNav } from "../../appRedux/actions/Setting";
import SearchBox from "components/SearchBox";
import UserInfo from "components/UserInfo";
import AppNotification from "components/AppNotification";
import MailNotification from "components/MailNotification";
import Auxiliary from "util/Auxiliary";


import { NAV_STYLE_DRAWER, NAV_STYLE_FIXED, NAV_STYLE_MINI_SIDEBAR, TAB_SIZE } from "../../constants/ThemeSetting";
import { useDispatch, useSelector } from "react-redux";

const { Header } = Layout;

const Topbar = () => {

  const { locale, width, navCollapsed, navStyle } = useSelector(({ settings }) => settings);
  const { searchText, setSearchText } = useState('');
  const dispatch = useDispatch();

  const languageMenu = () => (
    <CustomScrollbars className="gx-popover-lang-scroll">
      <ul className="gx-sub-popover">
        {languageData.map(language =>
          <li className="gx-media gx-pointer" key={JSON.stringify(language)} onClick={(e) =>
            dispatch(switchLanguage(language))
          }>
            <i className={`flag flag-24 gx-mr-2 flag-${language.icon}`} />
            <span className="gx-language-text">{language.name}</span>
          </li>
        )}
      </ul>
    </CustomScrollbars>);

  const updateSearchChatUser = (evt) => {
    setSearchText(evt.target.value);
  };
  if (false) {
    return (
      <Header>
        {navStyle === NAV_STYLE_DRAWER || ((navStyle === NAV_STYLE_FIXED || navStyle === NAV_STYLE_MINI_SIDEBAR) && width < TAB_SIZE) ?
          <div className="gx-linebar gx-mr-3">
            <i className="gx-icon-btn icon icon-menu"
              onClick={() => {
                dispatch(toggleCollapsedSideNav(!navCollapsed));
              }}
            />
          </div> : null}
        <Link to="/" className="gx-d-block gx-d-lg-none gx-pointer">
          <img alt="" src={require("assets/images/w-logo.png")} /></Link>

        <SearchBox styleName="gx-d-none gx-d-lg-block gx-lt-icon-search-bar-lg"
          placeholder="Search in app..."
          onChange={updateSearchChatUser}
          value={searchText} />
        <ul className="gx-header-notifications gx-ml-auto">
          <li className="gx-notify gx-notify-search gx-d-inline-block gx-d-lg-none">
            <Popover overlayClassName="gx-popover-horizantal" placement="bottomRight" content={
              <SearchBox styleName="gx-popover-search-bar"
                placeholder="Search in app..."
                onChange={updateSearchChatUser}
                value={searchText} />
            } trigger="click">
              <span className="gx-pointer gx-d-block"><i className="icon icon-search-new" /></span>
            </Popover>
          </li>
          {width >= TAB_SIZE ? null :
            <Auxiliary>
              <li className="gx-notify">
                <Popover overlayClassName="gx-popover-horizantal" placement="bottomRight" content={<AppNotification />}
                  trigger="click">
                  <span className="gx-pointer gx-d-block"><i className="icon icon-notification" /></span>
                </Popover>
              </li>

              <li className="gx-msg">
                <Popover overlayClassName="gx-popover-horizantal" placement="bottomRight"
                  content={<MailNotification />} trigger="click">
                  <span className="gx-pointer gx-status-pos gx-d-block">
                    <i className="icon icon-chat-new" />
                    <span className="gx-status gx-status-rtl gx-small gx-orange" />
                  </span>
                </Popover>
              </li>
            </Auxiliary>
          }
          <li className="gx-language">
            <Popover overlayClassName="gx-popover-horizantal" placement="bottomRight" content={languageMenu()}
              trigger="click">
              <span className="gx-pointer gx-flex-row gx-align-items-center">
                <i className={`flag flag-24 flag-${locale.icon}`} />
                <span className="gx-pl-2 gx-language-name">{locale.name}</span>
                <i className="icon icon-chevron-down gx-pl-2" />
              </span>
            </Popover>
          </li>
          {width >= TAB_SIZE ? null :
            <Auxiliary>
              <li className="gx-user-nav"><UserInfo /></li>
            </Auxiliary>
          }
        </ul>
      </Header>
    );
  } else {
    return null
  }
};

export default Topbar;
