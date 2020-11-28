import React from "react";
import {useSelector} from "react-redux";
import {Menu} from "antd";
import {Link} from "react-router-dom";
import IntlMessages from "../../util/IntlMessages";
import {
  NAV_STYLE_ABOVE_HEADER,
  NAV_STYLE_BELOW_HEADER,
  NAV_STYLE_DEFAULT_HORIZONTAL,
  NAV_STYLE_INSIDE_HEADER_HORIZONTAL
} from "../../constants/ThemeSetting";


const SubMenu = Menu.SubMenu;
const MenuItemGroup = Menu.ItemGroup;

const HorizontalNav = () => {

  const navStyle = useSelector(({settings}) => settings.navStyle);
  const pathname = useSelector(({settings}) => settings.pathname);

  const getNavStyleSubMenuClass = (navStyle) => {
    switch (navStyle) {
      case NAV_STYLE_DEFAULT_HORIZONTAL:
        return "gx-menu-horizontal gx-submenu-popup-curve";
      case NAV_STYLE_INSIDE_HEADER_HORIZONTAL:
        return "gx-menu-horizontal gx-submenu-popup-curve gx-inside-submenu-popup-curve";
      case NAV_STYLE_BELOW_HEADER:
        return "gx-menu-horizontal gx-submenu-popup-curve gx-below-submenu-popup-curve";
      case NAV_STYLE_ABOVE_HEADER:
        return "gx-menu-horizontal gx-submenu-popup-curve gx-above-submenu-popup-curve";
      default:
        return "gx-menu-horizontal";

    }
  };

  const selectedKeys = pathname.substr(1);
  const defaultOpenKeys = selectedKeys.split('/')[1];
  return (

    <Menu
      defaultOpenKeys={[defaultOpenKeys]}
      selectedKeys={[selectedKeys]}
      mode="horizontal">

      <SubMenu className={getNavStyleSubMenuClass(navStyle)} key="main"
               title={<IntlMessages id="sidebar.main"/>}>

        <SubMenu className="gx-menu-horizontal" key="dashboard"
                 title={<span> <i className="icon icon-dasbhoard"/>
                         <IntlMessages id="sidebar.dashboard"/></span>}>
          <Menu.Item key="main/dashboard/crypto">
            <Link to="/main/dashboard/crypto">
              <i className="icon icon-crypto"/>
              <IntlMessages id="sidebar.dashboard.crypto"/>
            </Link>
          </Menu.Item>
          <Menu.Item key="main/dashboard/crm">
            <Link to="/main/dashboard/crm">
              <i className="icon icon-crm"/>
              <IntlMessages id="sidebar.dashboard.crm"/>
            </Link>
          </Menu.Item>
          <Menu.Item key="main/dashboard/listing">
            <Link to="/main/dashboard/listing">
              <i className="icon icon-listing-dbrd"/>
              <IntlMessages id="sidebar.dashboard.listing"/>
            </Link>
          </Menu.Item>
        </SubMenu>

        <Menu.Item key="main/widgets">
          <Link to="/main/widgets"><i className="icon icon-widgets"/>
            <IntlMessages id="sidebar.widgets"/></Link>
        </Menu.Item>

        <Menu.Item key="main/metrics">
          <Link to="/main/metrics"><i className="icon icon-apps"/>
            <IntlMessages id="sidebar.metrics"/></Link>
        </Menu.Item>

        <Menu.Item key="main/algolia">
          <Link to="/main/algolia"><i className="icon icon-shopping-cart "/>
            <IntlMessages id="sidebar.algolia"/></Link>
        </Menu.Item>

      </SubMenu>

      <SubMenu className={getNavStyleSubMenuClass(navStyle)} key="in-built-apps"
               title={<IntlMessages id="sidebar.inBuiltApp"/>}>

        <Menu.Item key="in-built-apps/mail">
          <Link to="/in-built-apps/mail"><i className="icon icon-email"/><IntlMessages
            id="sidebar.mailApp"/></Link>
        </Menu.Item>

        <Menu.Item key="in-built-apps/todo">
          <Link to="/in-built-apps/todo"><i
            className="icon icon-check-square-o"/><IntlMessages
            id="sidebar.todoApp"/></Link>
        </Menu.Item>

        <Menu.Item key="in-built-apps/contacts">
          <Link to="/in-built-apps/contacts"><i className="icon icon-contacts"/><IntlMessages
            id="sidebar.contactsApp"/></Link>
        </Menu.Item>

        <Menu.Item key="in-built-apps/chat">
          <Link to="/in-built-apps/chat"><i
            className="icon icon-chat-bubble -flex-column-reverse"/><IntlMessages
            id="sidebar.chatApp"/></Link>
        </Menu.Item>

        <Menu.Item key="social-apps/profile">
          <Link to="/social-apps/profile">
            <i className="icon icon-profile2"/>
            <IntlMessages id="sidebar.extensions.profile"/>
          </Link>
        </Menu.Item>

        <Menu.Item key="social-apps/wall">
          <Link to="/social-apps/wall">
            <i className="icon icon-avatar -flex-column-reverse"/>
            <IntlMessages id="sidebar.wall"/>
          </Link>
        </Menu.Item>

        <Menu.Item key="in-built-apps/notes">
          <Link to="/in-built-apps/notes">
            <i className="icon icon-copy"/>
            <IntlMessages id="sidebar.notes"/>
          </Link>
        </Menu.Item>

        <Menu.Item key="in-built-apps/firebase-crud">
          <Link to="/in-built-apps/firebase-crud">
            <i className="icon icon-icon"/>
            <IntlMessages id="sidebar.crud"/>
          </Link>
        </Menu.Item>

      </SubMenu>

      <SubMenu className={getNavStyleSubMenuClass(navStyle)} key="components"
               title={<IntlMessages id="sidebar.components"/>}>

        <SubMenu className="gx-menu-horizontal" key="general" title={
          <span>
                  <i className="icon icon-all-contacts"/>
                   <IntlMessages id="sidebar.components.general"/>
              </span>}>
          <Menu.Item key="components/general/button">
            <Link to="/components/general/button">
              <IntlMessages id="sidebar.general.button"/>
            </Link>
          </Menu.Item>
          <Menu.Item key="components/general/icon">
            <Link to="/components/general/icon">
              <IntlMessages id="sidebar.general.icon"/></Link>
          </Menu.Item>
        </SubMenu>

        <SubMenu className="gx-menu-horizontal" key="navigation" title={
          <span>
                  <i className="icon icon-navigation"/>
                  <IntlMessages id="sidebar.components.navigation"/>
              </span>}>
          <Menu.Item key="components/navigation/affix">
            <Link to="/components/navigation/affix">
              <IntlMessages
                id="sidebar.navigation.affix"/></Link>
          </Menu.Item>
          <Menu.Item key="components/navigation/breadcrumb">
            <Link to="/components/navigation/breadcrumb">
              <IntlMessages
                id="sidebar.navigation.breadcrumb"/></Link>
          </Menu.Item>
          <Menu.Item key="components/navigation/dropdown">
            <Link to="/components/navigation/dropdown">
              <IntlMessages
                id="sidebar.navigation.dropdown"/></Link>
          </Menu.Item>
          <Menu.Item key="components/navigation/menu">
            <Link to="/components/navigation/menu">
              <IntlMessages
                id="sidebar.navigation.menu"/></Link>
          </Menu.Item>
          <Menu.Item key="components/navigation/pagination">
            <Link to="/components/navigation/pagination">
              <IntlMessages
                id="sidebar.navigation.pagination"/></Link>
          </Menu.Item>
          <Menu.Item key="components/navigation/steps">
            <Link to="/components/navigation/steps">
              <IntlMessages
                id="sidebar.navigation.steps"/></Link>
          </Menu.Item>
        </SubMenu>

        <SubMenu className="gx-menu-horizontal" key="dataEntry" title={
          <span>
                  <i className="icon icon-data-entry"/>
                  <IntlMessages id="sidebar.components.dataEntry"/>
              </span>}>
          <Menu.Item key="components/dataEntry/autoComplete">
            <Link to="/components/dataEntry/autoComplete">
              <IntlMessages
                id="sidebar.dataEntry.autoComplete"/></Link>
          </Menu.Item>
          <Menu.Item key="components/dataEntry/checkbox">
            <Link to="/components/dataEntry/checkbox">
              <IntlMessages
                id="sidebar.dataEntry.checkbox"/></Link>
          </Menu.Item>
          <Menu.Item key="components/dataEntry/cascader">
            <Link to="/components/dataEntry/cascader">
              <IntlMessages
                id="sidebar.dataEntry.cascader"/></Link>
          </Menu.Item>
          <Menu.Item key="components/dataEntry/datePicker">
            <Link to="/components/dataEntry/datePicker">
              <IntlMessages
                id="sidebar.dataEntry.datePicker"/></Link>
          </Menu.Item>
          <Menu.Item key="components/dataEntry/form">
            <Link to="/components/dataEntry/form">
              <IntlMessages
                id="sidebar.dataEntry.form"/></Link>
          </Menu.Item>
          <Menu.Item key="components/dataEntry/inputNumber">
            <Link to="/components/dataEntry/inputNumber">
              <IntlMessages
                id="sidebar.dataEntry.inputNumber"/></Link>
          </Menu.Item>
          <Menu.Item key="components/dataEntry/input">
            <Link to="/components/dataEntry/input">
              <IntlMessages
                id="sidebar.dataEntry.input"/></Link>
          </Menu.Item>
          <Menu.Item key="components/dataEntry/mention">
            <Link to="/components/dataEntry/mention">
              <IntlMessages
                id="sidebar.dataEntry.mention"/></Link>
          </Menu.Item>
          <Menu.Item key="components/dataEntry/rate">
            <Link to="/components/dataEntry/rate">
              <IntlMessages
                id="sidebar.dataEntry.rate"/></Link>
          </Menu.Item>
          <Menu.Item key="components/dataEntry/radio">
            <Link to="/components/dataEntry/radio">
              <IntlMessages
                id="sidebar.dataEntry.radio"/></Link>
          </Menu.Item>
          <Menu.Item key="components/dataEntry/switch">
            <Link to="/components/dataEntry/switch">
              <IntlMessages
                id="sidebar.dataEntry.switch"/></Link>
          </Menu.Item>
          <Menu.Item key="components/dataEntry/slider">
            <Link to="/components/dataEntry/slider">
              <IntlMessages
                id="sidebar.dataEntry.slider"/></Link>
          </Menu.Item>
          <Menu.Item key="components/dataEntry/select">
            <Link to="/components/dataEntry/select">
              <IntlMessages
                id="sidebar.dataEntry.select"/></Link>
          </Menu.Item>
          <Menu.Item key="components/dataEntry/treeSelect">
            <Link to="/components/dataEntry/treeSelect">
              <IntlMessages
                id="sidebar.dataEntry.treeSelect"/></Link>
          </Menu.Item>
          <Menu.Item key="components/dataEntry/transfer">
            <Link to="/components/dataEntry/transfer">
              <IntlMessages
                id="sidebar.dataEntry.transfer"/></Link>
          </Menu.Item>
          <Menu.Item key="components/dataEntry/timePicker">
            <Link to="/components/dataEntry/timePicker">
              <IntlMessages
                id="sidebar.dataEntry.timePicker"/></Link>
          </Menu.Item>
          <Menu.Item key="components/dataEntry/upload">
            <Link to="/components/dataEntry/upload">
              <IntlMessages
                id="sidebar.dataEntry.upload"/></Link>
          </Menu.Item>
        </SubMenu>

        <SubMenu className="gx-menu-horizontal" key="dataDisplay" title={
          <span>
                  <i className="icon icon-data-display"/>

                    <IntlMessages id="sidebar.components.dataDisplay"/>

              </span>}>
          <Menu.Item key="components/dataDisplay/avatar">
            <Link to="/components/dataDisplay/avatar">
              <IntlMessages
                id="sidebar.dataDisplay.avatar"/></Link>
          </Menu.Item>
          <Menu.Item key="components/dataDisplay/badge">
            <Link to="/components/dataDisplay/badge">
              <IntlMessages
                id="sidebar.dataDisplay.badge"/></Link>
          </Menu.Item>
          <Menu.Item key="components/dataDisplay/collapse">
            <Link to="/components/dataDisplay/collapse">
              <IntlMessages
                id="sidebar.dataDisplay.collapse"/></Link>
          </Menu.Item>
          <Menu.Item key="components/dataDisplay/carousel">
            <Link to="/components/dataDisplay/carousel">
              <IntlMessages
                id="sidebar.dataDisplay.carousel"/></Link>
          </Menu.Item>
          <Menu.Item key="components/dataDisplay/card">
            <Link to="/components/dataDisplay/card">
              <IntlMessages
                id="sidebar.dataDisplay.card"/></Link>
          </Menu.Item>
          <Menu.Item key="components/dataDisplay/calendar">
            <Link to="/components/dataDisplay/calendar">
              <IntlMessages
                id="sidebar.dataDisplay.calender"/></Link>
          </Menu.Item>
          <Menu.Item key="components/dataDisplay/list">
            <Link to="/components/dataDisplay/list">
              <IntlMessages
                id="sidebar.dataDisplay.list"/></Link>
          </Menu.Item>
          <Menu.Item key="components/dataDisplay/popover">
            <Link to="/components/dataDisplay/popover">
              <IntlMessages
                id="sidebar.dataDisplay.popover"/></Link>
          </Menu.Item>
          <Menu.Item key="components/dataDisplay/tree">
            <Link to="/components/dataDisplay/tree">
              <IntlMessages
                id="sidebar.dataDisplay.tree"/></Link>
          </Menu.Item>
          <Menu.Item key="components/dataDisplay/tooltip">
            <Link to="/components/dataDisplay/tooltip">
              <IntlMessages
                id="sidebar.dataDisplay.toolTips"/></Link>
          </Menu.Item>
          <Menu.Item key="components/dataDisplay/timeline">
            <Link to="/components/dataDisplay/timeline">
              <IntlMessages
                id="sidebar.dataDisplay.timeLine"/></Link>
          </Menu.Item>
          <Menu.Item key="components/dataDisplay/tag">
            <Link to="/components/dataDisplay/tag">
              <IntlMessages
                id="sidebar.dataDisplay.tag"/></Link>
          </Menu.Item>
          <Menu.Item key="components/dataDisplay/tabs">
            <Link to="/components/dataDisplay/tabs">
              <IntlMessages
                id="sidebar.dataDisplay.tabs"/></Link>
          </Menu.Item>
        </SubMenu>

        <SubMenu className="gx-menu-horizontal" key="feedBack" title={
          <span>
                  <i className="icon icon-feedback"/>
                    <IntlMessages id="sidebar.components.feedBack"/>

              </span>}>
          <Menu.Item key="components/feedBack/alert">
            <Link to="/components/feedBack/alert">
              <IntlMessages
                id="sidebar.feedBack.alert"/></Link>
          </Menu.Item>
          <Menu.Item key="components/feedBack/modal">
            <Link to="/components/feedBack/modal">
              <IntlMessages
                id="sidebar.feedBack.modal"/></Link>
          </Menu.Item>
          <Menu.Item key="components/feedBack/message">
            <Link to="/components/feedBack/message">
              <IntlMessages
                id="sidebar.feedBack.message"/></Link>
          </Menu.Item>
          <Menu.Item key="components/feedBack/notification">
            <Link to="/components/feedBack/notification">
              <IntlMessages
                id="sidebar.feedBack.notification"/></Link>
          </Menu.Item>
          <Menu.Item key="components/feedBack/progress">
            <Link to="/components/feedBack/progress">
              <IntlMessages
                id="sidebar.feedBack.progress"/></Link>
          </Menu.Item>
          <Menu.Item key="components/feedBack/popconfirm">
            <Link to="/components/feedBack/popconfirm">
              <IntlMessages id="sidebar.feedBack.popConfirm"/>
            </Link>
          </Menu.Item>
          <Menu.Item key="components/feedBack/spin">
            <Link to="/components/feedBack/spin">
              <IntlMessages
                id="sidebar.feedBack.spin"/></Link>
          </Menu.Item>
        </SubMenu>

        <SubMenu className="gx-menu-horizontal" key="others" title={
          <span>
                  <i className="icon icon-inbox"/>
                    <IntlMessages id="sidebar.components.other"/>

              </span>}>
          <Menu.Item key="components/others/anchor">
            <Link to="/components/others/anchor">
              <IntlMessages
                id="sidebar.other.anchor"/></Link>
          </Menu.Item>
          <Menu.Item key="components/others/backtop">
            <Link to="/components/others/backtop">
              <IntlMessages
                id="sidebar.other.backTop"/></Link>
          </Menu.Item>
          <Menu.Item key="components/others/divider">
            <Link to="/components/others/divider">
              <IntlMessages
                id="sidebar.other.divider"/></Link>
          </Menu.Item>
        </SubMenu>

        <SubMenu className="gx-menu-horizontal" key="table"
                 title={
                   <span>
                           <i className="icon icon-table"/>

                             <IntlMessages id="sidebar.dataDisplay.table"/>

                         </span>}>
          <Menu.Item key="components/table/basic">
            <Link to="/components/table/basic">
              <IntlMessages
                id="sidebar.view.basicTable"/></Link>
          </Menu.Item>
          <Menu.Item key="components/table/data">
            <Link to="/components/table/data">
              <IntlMessages
                id="sidebar.view.dataTable"/></Link>
          </Menu.Item>
        </SubMenu>

      </SubMenu>

      <SubMenu className={getNavStyleSubMenuClass(navStyle)} key="extraComponents"
               title={<IntlMessages id="sidebar.extraComponents"/>}>

        <SubMenu className="gx-menu-horizontal" key="editor"
                 title={<span>
                         <i className="icon icon-editor"/>
                        <IntlMessages id="sidebar.editors"/>
                       </span>}>
          <Menu.Item key="extra-components/editor/ck">
            <Link to="/extra-components/editor/ck">
              <IntlMessages
                id="sidebar.editors.CKEditor"/></Link>
          </Menu.Item>
          <Menu.Item key="extra-components/editor/wysiswyg">
            <Link to="/extra-components/editor/wysiswyg">
              <IntlMessages
                id="sidebar.editors.WYSISWYGEditor"/></Link>
          </Menu.Item>
        </SubMenu>

        <Menu.Item key="extra-components/color-picker">
          <Link to="/extra-components/color-picker">
            <i className="icon icon-picker"/>

            <IntlMessages id="sidebar.pickers.colorPickers"/>

          </Link>
        </Menu.Item>

        <Menu.Item key="extra-components/dnd">
          <Link to="/extra-components/dnd">
            <i className="icon icon-drag-and-drop"/>

            <IntlMessages id="sidebar.extensions.dragNDrop"/>

          </Link>
        </Menu.Item>

        <Menu.Item key="extra-components/sweet-alert">
          <Link to="/extra-components/sweet-alert">
            <i className="icon icon-sweet-alert"/>
            <IntlMessages id="sidebar.extensions.sweetAlert"/>
          </Link>
        </Menu.Item>

        <Menu.Item key="extra-components/notification">
          <Link to="/extra-components/notification"><i className="icon icon-notification"/>
            <IntlMessages
              id="sidebar.extensions.notification"/></Link>
        </Menu.Item>

        <SubMenu className="gx-menu-horizontal" key="time-line"
                 title={<span><i className="icon icon-timeline"/><IntlMessages
                   id="sidebar.timeLine"/></span>}>
          <Menu.Item key="extra-components/time-line/default">
            <Link to="/extra-components/time-line/default">
              <IntlMessages
                id="sidebar.timeLine.default"/></Link>
          </Menu.Item>
          <Menu.Item key="extra-components/time-line/default-with-icon">
            <Link to="/extra-components/time-line/default-with-icon">
              <IntlMessages
                id="sidebar.timeLine.defaultwithIcons"/></Link>
          </Menu.Item>
          <Menu.Item key="extra-components/time-line/left-align">
            <Link to="/extra-components/time-line/left-align">
              <IntlMessages
                id="sidebar.timeLine.leftAligned"/></Link>
          </Menu.Item>
        </SubMenu>

        <Menu.Item key="extra-components/shuffle">
          <Link to="/extra-components/shuffle"><i className="icon icon-shuffle"/>
            <IntlMessages
              id="sidebar.extensions.shuffle"/></Link>
        </Menu.Item>

      </SubMenu>

      <SubMenu className={getNavStyleSubMenuClass(navStyle)} key="extensions"
               title={<IntlMessages id="sidebar.extensions"/>}>

        <MenuItemGroup key="map"
                       title={<IntlMessages id="sidebar.map"/>}>

          <SubMenu className="gx-menu-horizontal" key="google"
                   title={
                     <span>
                           <i className="icon icon-map-google"/>
                           <IntlMessages id="sidebar.google.map"/></span>}>

            <Menu.Item key="extensions/map/google/simple">
              <Link to="/extensions/map/google/simple">
                <IntlMessages
                  id="sidebar.map.simple"/></Link>
            </Menu.Item>
            <Menu.Item key="extensions/map/google/styled">
              <Link to="/extensions/map/google/styled">
                <IntlMessages
                  id="sidebar.map.styled"/></Link>
            </Menu.Item>
            <Menu.Item key="extensions/map/google/geo-location">
              <Link to="/extensions/map/google/geo-location">
                <IntlMessages
                  id="sidebar.map.geoLocation"/></Link>
            </Menu.Item>
            <Menu.Item key="extensions/map/google/directions">
              <Link to="/extensions/map/google/directions">
                <IntlMessages
                  id="sidebar.map.mapDirection"/></Link>
            </Menu.Item>
            <Menu.Item key="extensions/map/google/overlay">
              <Link to="/extensions/map/google/overlay">
                <IntlMessages
                  id="sidebar.map.overlay"/></Link>
            </Menu.Item>
            <Menu.Item key="extensions/map/google/kml">
              <Link to="/extensions/map/google/kml">
                <IntlMessages
                  id="sidebar.map.kmLayer"/></Link>
            </Menu.Item>
            <Menu.Item key="extensions/map/google/popup-info">
              <Link to="/extensions/map/google/popup-info">
                <IntlMessages
                  id="sidebar.map.popupInfo"/></Link>
            </Menu.Item>
            <Menu.Item key="extensions/map/google/traffic">
              <Link to="/extensions/map/google/traffic">
                <IntlMessages
                  id="sidebar.map.trafficLayer"/></Link>
            </Menu.Item>
            <Menu.Item key="extensions/map/google/street-view">
              <Link to="/extensions/map/google/street-view">
                <IntlMessages
                  id="sidebar.map.streetView"/></Link>
            </Menu.Item>
            <Menu.Item key="extensions/map/google/event">
              <Link to="/extensions/map/google/event">
                <IntlMessages
                  id="sidebar.map.eventListener"/></Link>
            </Menu.Item>
            <Menu.Item key="extensions/map/google/drawing">
              <Link to="/extensions/map/google/drawing">
                <IntlMessages
                  id="sidebar.map.mapDrawing"/></Link>
            </Menu.Item>
            <Menu.Item key="extensions/map/google/clustering">
              <Link to="/extensions/map/google/clustering">
                <IntlMessages
                  id="sidebar.map.mapClustering"/></Link>
            </Menu.Item>
          </SubMenu>

          <SubMenu className="gx-menu-horizontal" key="ammap"
                   title={
                     <span><i className="icon icon-amchart"/>
                           <IntlMessages id="sidebar.ammap"/></span>}>

            <Menu.Item key="extensions/map/ammap/animations-lines">
              <Link to="/extensions/map/ammap/animations-lines">
                <IntlMessages
                  id="sidebar.map.animations.lines"/></Link>
            </Menu.Item>
            <Menu.Item key="extensions/map/ammap/curved-lines">
              <Link to="/extensions/map/ammap/curved-lines">
                <IntlMessages
                  id="sidebar.map.curved.lines"/></Link>
            </Menu.Item>
            <Menu.Item key="extensions/map/ammap/zooming-countries">
              <Link to="/extensions/map/ammap/zooming-countries">
                <IntlMessages
                  id="sidebar.map.zooming.countries"/></Link>
            </Menu.Item>
            <Menu.Item key="extensions/map/ammap/patterns">
              <Link to="/extensions/map/ammap/patterns">
                <IntlMessages
                  id="sidebar.map.patterns"/></Link>
            </Menu.Item>
            <Menu.Item key="extensions/map/ammap/capitals-map">
              <Link to="/extensions/map/ammap/capitals-map">
                <IntlMessages
                  id="sidebar.map.capitals.map"/></Link>
            </Menu.Item>
            <Menu.Item key="extensions/map/ammap/map-markers">
              <Link to="/extensions/map/ammap/map-markers">
                <IntlMessages
                  id="sidebar.map.markers"/></Link>
            </Menu.Item>
            <Menu.Item key="extensions/map/ammap/flight-routes">
              <Link to="/extensions/map/ammap/flight-routes">
                <IntlMessages
                  id="sidebar.map.flight.routes"/></Link>
            </Menu.Item>
            <Menu.Item key="extensions/map/ammap/choropleth">
              <Link to="/extensions/map/ammap/choropleth">
                <IntlMessages
                  id="sidebar.map.choropleth"/></Link>
            </Menu.Item>
            <Menu.Item key="extensions/map/ammap/grouped-countries">
              <Link to="/extensions/map/ammap/grouped-countries">
                <IntlMessages
                  id="sidebar.map.grouped.countries"/></Link>
            </Menu.Item>
            <Menu.Item key="extensions/map/ammap/bubbles">
              <Link to="/extensions/map/ammap/bubbles">
                <IntlMessages
                  id="sidebar.map.bubbles"/></Link>
            </Menu.Item>
            <Menu.Item key="extensions/map/ammap/drill-down">
              <Link to="/extensions/map/ammap/drill-down">
                <IntlMessages
                  id="sidebar.map.drill.down"/></Link>
            </Menu.Item>
            <Menu.Item key="extensions/map/ammap/multiple-areas">
              <Link to="/extensions/map/ammap/multiple-areas">
                <IntlMessages
                  id="sidebar.map.multiple.areas"/></Link>
            </Menu.Item>
            <Menu.Item key="extensions/map/ammap/weather">
              <Link to="/extensions/map/ammap/weather">
                <IntlMessages
                  id="sidebar.map.weather"/></Link>
            </Menu.Item>

          </SubMenu>

        </MenuItemGroup>

        <MenuItemGroup key="chart"
                       title={<span>
                               <IntlMessages id="sidebar.chart"/></span>}>
          <SubMenu className="gx-menu-horizontal" key="rechart" title={
            <span><i className="icon icon-chart-area-new"/>
                    <IntlMessages id="sidebar.components.rechart"/>
              </span>}>

            <Menu.Item key="extensions/chart/recharts/area">
              <Link to="/extensions/chart/recharts/area">
                <IntlMessages
                  id="sidebar.chart.area"/></Link>
            </Menu.Item>
            <Menu.Item key="extensions/chart/recharts/bar">
              <Link to="/extensions/chart/recharts/bar">
                <IntlMessages
                  id="sidebar.chart.bar"/></Link>
            </Menu.Item>
            <Menu.Item key="extensions/chart/recharts/composed">
              <Link to="/extensions/chart/recharts/composed">
                <IntlMessages
                  id="sidebar.chart.composed"/></Link>
            </Menu.Item>
            <Menu.Item key="extensions/chart/recharts/line">
              <Link to="/extensions/chart/recharts/line">
                <IntlMessages
                  id="sidebar.chart.line"/></Link>
            </Menu.Item>
            <Menu.Item key="extensions/chart/recharts/pie">
              <Link to="/extensions/chart/recharts/pie">
                <IntlMessages
                  id="sidebar.chart.pie"/></Link>
            </Menu.Item>
            <Menu.Item key="extensions/chart/recharts/radar">
              <Link to="/extensions/chart/recharts/radar">
                <IntlMessages
                  id="sidebar.chart.radar"/></Link>
            </Menu.Item>
            <Menu.Item key="extensions/chart/recharts/radial">
              <Link to="/extensions/chart/recharts/radial">
                <IntlMessages
                  id="sidebar.chart.radial"/></Link>
            </Menu.Item>
            <Menu.Item key="extensions/chart/recharts/scatter">
              <Link to="/extensions/chart/recharts/scatter">
                <IntlMessages
                  id="sidebar.chart.scatter"/></Link>
            </Menu.Item>
            <Menu.Item key="extensions/chart/recharts/treemap">
              <Link to="/extensions/chart/recharts/treemap">
                <IntlMessages
                  id="sidebar.chart.tree"/></Link>
            </Menu.Item>
          </SubMenu>

          <SubMenu className="gx-menu-horizontal" key="amchart" title={
            <span><i className="icon icon-amchart"/>
                <IntlMessages id="sidebar.components.amchart"/>
              </span>}>
            <Menu.Item key="extensions/chart/amchart/area">
              <Link to="/extensions/chart/amchart/area">
                <IntlMessages
                  id="sidebar.chart.area"/></Link>
            </Menu.Item>
            <Menu.Item key="extensions/chart/amchart/bar">
              <Link to="/extensions/chart/amchart/bar">
                <IntlMessages
                  id="sidebar.chart.bar"/></Link>
            </Menu.Item>
            <Menu.Item key="extensions/chart/amchart/line">
              <Link to="/extensions/chart/amchart/line">
                <IntlMessages
                  id="sidebar.chart.line"/></Link>
            </Menu.Item>
            <Menu.Item key="extensions/chart/amchart/pie">
              <Link to="/extensions/chart/amchart/pie">
                <IntlMessages
                  id="sidebar.chart.pie"/></Link>
            </Menu.Item>
            <Menu.Item key="extensions/chart/amchart/composed">
              <Link to="/extensions/chart/amchart/composed">
                <IntlMessages
                  id="sidebar.chart.composed"/></Link>
            </Menu.Item>
          </SubMenu>

        </MenuItemGroup>

        <SubMenu className="gx-menu-horizontal" key="calendar"
                 title={<span><i className="icon icon-calendar"/><IntlMessages
                   id="sidebar.calendar"/></span>}>
          <Menu.Item key="extensions/calendar/basic">
            <Link to="/extensions/calendar/basic">
              <IntlMessages
                id="sidebar.calendar.basic"/></Link>
          </Menu.Item>
          <Menu.Item key="extensions/calendar/cultures">
            <Link to="/extensions/calendar/cultures">
              <IntlMessages
                id="sidebar.calendar.cultures"/></Link>
          </Menu.Item>
          <Menu.Item key="extensions/calendar/popup">
            <Link to="/extensions/calendar/popup">
              <IntlMessages
                id="sidebar.calendar.popup"/></Link>
          </Menu.Item>
          <Menu.Item key="extensions/calendar/rendering">
            <Link to="/extensions/calendar/rendering">
              <IntlMessages
                id="sidebar.calendar.rendering"/></Link>
          </Menu.Item>
          <Menu.Item key="extensions/calendar/selectable">
            <Link to="/extensions/calendar/selectable">
              <IntlMessages
                id="sidebar.calendar.selectable"/></Link>
          </Menu.Item>
          <Menu.Item key="extensions/calendar/timeslots">
            <Link to="/extensions/calendar/timeslots">
              <IntlMessages id="sidebar.calendar.timeslots"/></Link>
          </Menu.Item>
        </SubMenu>

      </SubMenu>

      <SubMenu className={getNavStyleSubMenuClass(navStyle)} key="custom-views"
               title={<IntlMessages id="sidebar.customViews"/>}>

        <SubMenu className="gx-menu-horizontal" key="user-auth"
                 title={<span><i className="icon icon-auth-screen"/><IntlMessages
                   id="app.userAuth"/></span>}>
          <Menu.Item key="custom-views/user-auth/sign-in">
            <Link to="/custom-views/user-auth/sign-in">
              <IntlMessages
                id="app.userAuth.signIn"/></Link>
          </Menu.Item>
          <Menu.Item key="custom-views/user-auth/forgot-password">
            <Link to="/custom-views/user-auth/forgot-password">
              <IntlMessages
                id="app.userAuth.forgotPassword"/></Link>
          </Menu.Item>
          <Menu.Item key="custom-views/user-auth/sign-up">
            <Link to="/custom-views/user-auth/sign-up">
              <IntlMessages
                id="app.userAuth.signUp"/></Link>
          </Menu.Item>
          <Menu.Item key="custom-views/user-auth/lock-screen">
            <Link to="/custom-views/user-auth/lock-screen">
              <IntlMessages
                id="app.userAuth.lockScreen"/></Link>
          </Menu.Item>
          <Menu.Item key="custom-views/user-auth/reset-password">
            <Link to="/custom-views/user-auth/reset-password">
              <IntlMessages
                id="app.userAuth.resetPassword"/></Link>
          </Menu.Item>
        </SubMenu>

        <SubMenu className="gx-menu-horizontal" key="list-type"
                 title={<span><i className="icon icon-all-contacts"/><IntlMessages
                   id="sidebar.listType"/></span>}>
          <Menu.Item key="custom-views/list-type/simple-list">
            <Link to="/custom-views/list-type/simple-list">
              <IntlMessages
                id="sidebar.listType.plainListView"/></Link>
          </Menu.Item>
          <Menu.Item key="custom-views/list-type/strip-list">
            <Link to="/custom-views/list-type/strip-list">
              <IntlMessages
                id="sidebar.listType.withDivider"/></Link>
          </Menu.Item>
          <Menu.Item key="custom-views/list-type/card-list">
            <Link to="/custom-views/list-type/card-list">
              <IntlMessages
                id="sidebar.listType.cardListView"/></Link>
          </Menu.Item>
        </SubMenu>

        <SubMenu className="gx-menu-horizontal" key="eCommerce"
                 title={<span><i className="icon icon-shopping-cart"/><IntlMessages
                   id="sidebar.eCommerce"/></span>}>
          <Menu.Item key="custom-views/eCommerce/product-grid">
            <Link to="/custom-views/eCommerce/product-grid">
              <IntlMessages
                id="sidebar.eCommerce.productGrid"/></Link>
          </Menu.Item>
          <Menu.Item key="custom-views/eCommerce/product-list">
            <Link to="/custom-views/eCommerce/product-list">
              <IntlMessages
                id="sidebar.eCommerce.productList"/></Link>
          </Menu.Item>
        </SubMenu>

        <SubMenu className="gx-menu-horizontal" key="errorPages"
                 title={<span><i className="icon icon-error"/><IntlMessages
                   id="sidebar.extraPages"/></span>}>

          <Menu.Item key="custom-views/error-pages/error-404">
            <Link to="/custom-views/error-pages/error-404">
              <IntlMessages
                id="sidebar.extraPages.404"/></Link>
          </Menu.Item>
          <Menu.Item key="custom-views/error-pages/error-500">
            <Link to="/custom-views/error-pages/error-500">
              <IntlMessages
                id="sidebar.extraPages.500"/></Link>
          </Menu.Item>
        </SubMenu>

        <SubMenu className="gx-menu-horizontal" key="extra-elements"
                 title={<span><i className="icon icon-ellipse-h"/><IntlMessages
                   id="sidebar.listType.extras"/></span>}>
          <Menu.Item key="custom-views/extras/pricing-table">
            <Link to="/custom-views/extras/pricing-table">
              <IntlMessages
                id="sidebar.extraElements.pricingTable"/></Link>
          </Menu.Item>

          <Menu.Item key="custom-views/extras/callouts">
            <Link to="/custom-views/extras/callouts">
              <IntlMessages
                id="sidebar.extraElements.callouts"/></Link>
          </Menu.Item>
          <Menu.Item key="custom-views/extras/testimonials">
            <Link to="/custom-views/extras/testimonials">
              <IntlMessages
                id="sidebar.extraElements.testimonials"/></Link>
          </Menu.Item>
        </SubMenu>

      </SubMenu>

    </Menu>

  );
};

HorizontalNav.propTypes = {};

export default HorizontalNav;

