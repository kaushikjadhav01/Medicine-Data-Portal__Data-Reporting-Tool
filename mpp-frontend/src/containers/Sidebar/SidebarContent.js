import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { Menu } from 'antd';
import { Link } from 'react-router-dom';

import CustomScrollbars from 'util/CustomScrollbars';
import SidebarLogo from './SidebarLogo';
import {
  // NAV_STYLE_NO_HEADER_EXPANDED_SIDEBAR,
  NAV_STYLE_NO_HEADER_MINI_SIDEBAR,
  NAV_STYLE_FIXED,
  THEME_TYPE_LITE
} from '../../constants/ThemeSetting';
import IntlMessages from '../../util/IntlMessages';
import { getRole } from '../../helpers';
import { MedicineBoxOutlined, UsergroupAddOutlined, FileSearchOutlined, BarChartOutlined, LogoutOutlined, LockOutlined } from '@ant-design/icons'
// import UserProfile from './UserProfile';

const SidebarContent = (props) => {

  let { navStyle, themeType, pathname } = useSelector(({ settings }) => settings);
  const [isUserAdmin, setIsUserAdmin] = useState(false);

  // const getNoHeaderClass = (navStyle) => {
  //   if (navStyle === NAV_STYLE_NO_HEADER_MINI_SIDEBAR || navStyle === NAV_STYLE_NO_HEADER_EXPANDED_SIDEBAR) {
  //     return 'gx-no-header-notifications';
  //   }
  //   return '';
  // };
  const getNavStyleSubMenuClass = (navStyle) => {
    if (navStyle === NAV_STYLE_NO_HEADER_MINI_SIDEBAR) {
      return 'gx-no-header-submenu-popup';
    }
    return '';
  };
  const selectedKeys = pathname.substr(1);
  const defaultOpenKeys = selectedKeys.split('/')[(selectedKeys.split('/').length - 1)];

  const getMenuItems = () => {
    return {
      'menuItems': isUserAdmin ?
        [
          {
            key: 'dashboard',
            link: '/admin/dashboard',
            icon: (<i className='icon icon-dasbhoard' />),
            name_id: 'sidebar.dashboard'
          },
          {
            key: 'partner-list',
            link: '/admin/partner-list',
            icon: (<UsergroupAddOutlined className='font-20' />),
            name_id: 'sidebar.partnerList'
          },
          {
            key: 'product-list',
            link: '/admin/product-list',
            icon: (<MedicineBoxOutlined className='font-20' />),
            name_id: 'sidebar.productList'
          },
        ] :
        [
          {
            key: 'dashboard',
            link: '/partner/dashboard',
            icon: (<i className='icon icon-dasbhoard' />),
            name_id: 'sidebar.dashboard'
          }
        ],
      'submenuItems': isUserAdmin ?
        [
          {
            key: 'development-timeline',
            link: '/admin/report/development-timeline',
            icon: (<i className='icon icon-timeline font-20' />),
            name_id: 'sidebar.pdt'
          },
          {
            key: 'filing-plans',
            link: '/admin/report/filing-plans',
            icon: (<FileSearchOutlined className='font-20' />),
            name_id: 'sidebar.filingPlans'
          },
          {
            key: 'sales-report',
            link: '/admin/report/sales-report',
            icon: (<BarChartOutlined className='font-20' />),
            name_id: 'sidebar.sales-report'
          }
        ] :
        [
          {
            key: 'development-timeline',
            link: '/partner/development-timeline',
            icon: (<i className='icon icon-timeline font-20' />),
            name_id: 'sidebar.pdt'
          },
          {
            key: 'filing-plans',
            link: '/partner/filing-plans',
            icon: (<FileSearchOutlined className='font-20' />),
            name_id: 'sidebar.filingPlans'
          },
          {
            key: 'sales-report',
            link: '/partner/sales-report',
            icon: (<BarChartOutlined className='font-20' />),
            name_id: 'sidebar.sales-report'
          }
        ]
    }
  }

  const getProfileMenuItems = () => {

    let menuItems = [
      {
        key: 'profile',
        link: isUserAdmin ? '/admin/profile' : '/partner/profile',
        icon: (<i className='icon icon-profile font-20' />),
        name_id: 'sidebar.profile'
      },
      {
        key: 'settings',
        link: '/admin/settings',
        icon: (<i className='icon icon-setting font-20' />),
        name_id: 'sidebar.settings'
      },
      {
        key: 'change-password',
        link: '/change-password',
        icon: (<LockOutlined className='font-20' />),
        name_id: 'sidebar.change-password'
      },
    ]
    if (!isUserAdmin) {
      menuItems.splice(1, 1)
    }

    return menuItems
  }

  const displayMenuItems = (itemsArray) => {
    return itemsArray.map(
      value => (
        <Menu.Item key={value.key}>
          <Link to={value.link}>
            {value.icon}
            <span><IntlMessages id={value.name_id} /></span>
          </Link>
        </Menu.Item>
      )
    )
  }

  useEffect(() => {
    setIsUserAdmin(() => {
      return getRole() === 'ADMIN'
    })
  }, [])

  return (<>
    <SidebarLogo />
    <div className='gx-sidebar-content'>
      {/* <div className={`gx-sidebar-notifications ${getNoHeaderClass(navStyle)}`}>
        <UserProfile history={props.history} />
        <AppsNavigation/>
      </div> */}
      <CustomScrollbars className='gx-layout-sider-scrollbar gx-mt-2'>
        <Menu
          className={navStyle === NAV_STYLE_FIXED ? 'pad-left-25 gx-display-flex-column' : ''}
          defaultOpenKeys={[defaultOpenKeys]}
          // selectedKeys={[selectedKeys]}
          selectedKeys={[defaultOpenKeys]}
          theme={themeType === THEME_TYPE_LITE ? 'lite' : 'dark'}
          mode='inline'>
          {displayMenuItems(getMenuItems().menuItems)}
          <Menu.SubMenu key='Reports' popupClassName={getNavStyleSubMenuClass(navStyle)}
            title={<span> <i className='icon icon-folder-o' />
              <span><IntlMessages id='sidebar.reports' /></span></span>}>
            {displayMenuItems(getMenuItems().submenuItems)}
          </Menu.SubMenu>
          <Menu.SubMenu key='User Profile' popupClassName={getNavStyleSubMenuClass(navStyle)}
            title={<span> <i className='icon icon-wall' />
              <span>User Profile</span></span>}>
            {displayMenuItems(getProfileMenuItems())}
          </Menu.SubMenu>
          <Menu.Item key='logout'>
            <Link to={'/logout'}>
              <LogoutOutlined className='font-20' />
              <span>Logout</span>
            </Link>
          </Menu.Item>
        </Menu>
      </CustomScrollbars>
    </div>
  </>
  );
};

SidebarContent.propTypes = {};

export default SidebarContent;

