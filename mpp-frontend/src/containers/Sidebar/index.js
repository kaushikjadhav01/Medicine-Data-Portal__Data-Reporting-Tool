import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Drawer, Layout } from 'antd';

import SidebarContent from './SidebarContent';
import { toggleCollapsedSideNav, updateWindowWidth } from 'appRedux/actions/Setting';
import {
  NAV_STYLE_DRAWER,
  NAV_STYLE_FIXED,
  NAV_STYLE_MINI_SIDEBAR,
  NAV_STYLE_NO_HEADER_EXPANDED_SIDEBAR,
  NAV_STYLE_NO_HEADER_MINI_SIDEBAR,
  TAB_SIZE,
  THEME_TYPE_LITE
} from '../../constants/ThemeSetting';
import './sidebar.css'

const { Sider } = Layout;

const Sidebar = (props) => {

  const dispatch = useDispatch();

  const { themeType, navCollapsed, width, navStyle } = useSelector(({ settings }) => settings);


  const onToggleCollapsedNav = () => {
    dispatch(toggleCollapsedSideNav(!navCollapsed));
  };

  useEffect(() => {
    window.addEventListener('resize', () => {
      dispatch(updateWindowWidth(window.innerWidth));
    })
  }, [dispatch]);


  let drawerStyle = 'gx-collapsed-sidebar';

  if (navStyle === NAV_STYLE_FIXED) {
    drawerStyle = '';
  } else if (navStyle === NAV_STYLE_NO_HEADER_MINI_SIDEBAR) {
    drawerStyle = 'gx-mini-sidebar gx-mini-custom-sidebar';
  } else if (navStyle === NAV_STYLE_NO_HEADER_EXPANDED_SIDEBAR) {
    drawerStyle = 'gx-custom-sidebar'
  } else if (navStyle === NAV_STYLE_MINI_SIDEBAR) {
    drawerStyle = 'gx-mini-sidebar';
  } else if (navStyle === NAV_STYLE_DRAWER) {
    drawerStyle = 'gx-collapsed-sidebar'
  }
  if ((navStyle === NAV_STYLE_FIXED || navStyle === NAV_STYLE_MINI_SIDEBAR
    || navStyle === NAV_STYLE_NO_HEADER_EXPANDED_SIDEBAR) && width < TAB_SIZE) {
    drawerStyle = 'gx-collapsed-sidebar'
  }
  return (
    <Sider
      className={`gx-app-sidebar ${drawerStyle} ${themeType !== THEME_TYPE_LITE ? 'gx-layout-sider-dark' : null}`}
      trigger={null}
      collapsed={(width < TAB_SIZE ? false : navStyle === NAV_STYLE_MINI_SIDEBAR || navStyle === NAV_STYLE_NO_HEADER_MINI_SIDEBAR)}
      theme={themeType === THEME_TYPE_LITE ? 'lite' : 'dark'}
      collapsible>
      {
        navStyle === NAV_STYLE_DRAWER || width < TAB_SIZE ?
          <Drawer
            className={`gx-drawer-sidebar ${themeType !== THEME_TYPE_LITE ? 'gx-drawer-sidebar-dark' : null}`}
            placement='left'
            closable={false}
            onClose={onToggleCollapsedNav}
            visible={navCollapsed}>
            <SidebarContent />
          </Drawer> :
          <SidebarContent history={props.history} />
      }
    </Sider>)
};
export default Sidebar;
