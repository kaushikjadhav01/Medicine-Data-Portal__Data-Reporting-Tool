import React from "react";
import {useDispatch, useSelector} from "react-redux";
import {Link} from "react-router-dom";

import {onNavStyleChange, toggleCollapsedSideNav} from "appRedux/actions/Setting";
import {
  NAV_STYLE_DRAWER,
  NAV_STYLE_FIXED,
  NAV_STYLE_MINI_SIDEBAR,
  NAV_STYLE_NO_HEADER_MINI_SIDEBAR,
  TAB_SIZE,
  THEME_TYPE_LITE
} from "../../constants/ThemeSetting";


const SidebarLogo = () => {
  const dispatch = useDispatch();
  const {width, themeType, navCollapsed} = useSelector(({settings}) => settings);
  let navStyle = useSelector(({settings}) => settings.navStyle);
  if (width < TAB_SIZE && navStyle === NAV_STYLE_FIXED) {
    navStyle = NAV_STYLE_DRAWER;
  }
  return (
    <div className="gx-layout-sider-header">

      {(navStyle === NAV_STYLE_FIXED || navStyle === NAV_STYLE_MINI_SIDEBAR) ? <div className="gx-linebar">

        <i
          className={`gx-icon-btn icon icon-${navStyle === NAV_STYLE_MINI_SIDEBAR ? 'menu-unfold' : 'menu-fold'} ${themeType !== THEME_TYPE_LITE ? 'gx-text-white' : ''}`}
          onClick={() => {
            if (navStyle === NAV_STYLE_DRAWER) {
              dispatch(toggleCollapsedSideNav(!navCollapsed));
            } else if (navStyle === NAV_STYLE_FIXED) {
              dispatch(onNavStyleChange(NAV_STYLE_MINI_SIDEBAR))
            } else if (navStyle === NAV_STYLE_NO_HEADER_MINI_SIDEBAR) {
              dispatch(toggleCollapsedSideNav(!navCollapsed));
            } else {
              dispatch(onNavStyleChange(NAV_STYLE_FIXED))
            }
          }}
        />
      </div> : null}

      <Link to="/" className="gx-site-logo">
        {navStyle === NAV_STYLE_NO_HEADER_MINI_SIDEBAR && width >= TAB_SIZE ?
          <img alt="" src={require("assets/images/w-logo.png")}/> :
          themeType === THEME_TYPE_LITE ?
            <img alt="" src={require("assets/images/logo-white.png")}/> :
            <img alt="" src={require("assets/images/mpp_logo_white.png")}/>}
      </Link>
    </div>
  );
};

export default SidebarLogo;
