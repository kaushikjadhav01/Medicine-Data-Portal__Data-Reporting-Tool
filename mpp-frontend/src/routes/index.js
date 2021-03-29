import React, { Component } from "react";
import { Route, Switch, Redirect } from "react-router-dom";
import { Auth } from '../helpers/auth'
import { roleConstants } from '../constants';

import AdminDashboard from './pages/dashboard/adminDashboard';
import PartnerDashboard from './pages/partner-dashboard';
import PartnerListNew from './pages/partner-list-new';
import PartnerPerformance from './pages/partner-peformance';
import ProductList from './pages/product-list';
import DevelopmentTimeline from './pages/development-timeline';
import FilingPlans from './pages/filing-plans';
import SalesReport from './pages/sales-report';
import ChangePassword from "./pages/change-password";
import AddPartner from "./pages/add-partner";
import AddProduct from "./pages/add-product";
import PDTReport from "./pages/report-pdt";
import FilingPlansReport from "./pages/report-filing-plans";
import ConsolidatedSalesReport from "./pages/report-sales-report";
import UserProfilePage from "./pages/profile";
import AdminSettings from "./pages/admin-settings";

const AdminDashboardPage = Auth(AdminDashboard, [roleConstants.ADMIN, roleConstants.STAFF,roleConstants.PARTNER]);
const PartnerDashboardPage = Auth(PartnerDashboard, [roleConstants.PARTNER]);
const ChangePasswordPage = Auth(ChangePassword, [roleConstants.ADMIN, roleConstants.STAFF, roleConstants.PARTNER]);
const AdminProfilePage = Auth(UserProfilePage, [roleConstants.ADMIN, roleConstants.STAFF]);
const PartnerProfilePage = Auth(UserProfilePage, [roleConstants.PARTNER]);
const PartnerListNewPage = Auth(PartnerListNew, [roleConstants.ADMIN, roleConstants.STAFF]);
const AddPartnerPage = Auth(AddPartner, [roleConstants.ADMIN, roleConstants.STAFF]);
const PartnerPerformancePage = Auth(PartnerPerformance, [roleConstants.ADMIN, roleConstants.STAFF]);
const ProductListPage = Auth(ProductList, [roleConstants.ADMIN, roleConstants.STAFF]);
const AddProductPage = Auth(AddProduct, [roleConstants.ADMIN, roleConstants.STAFF]);
const DevelopmentTimelinePage = Auth(DevelopmentTimeline, [roleConstants.PARTNER, roleConstants.ADMIN, roleConstants.STAFF]);
const FilingPlansPage = Auth(FilingPlans, [roleConstants.PARTNER, roleConstants.ADMIN, roleConstants.STAFF]);
const SalesReportPage = Auth(SalesReport, [roleConstants.PARTNER, roleConstants.ADMIN, roleConstants.STAFF]);
const PDTReportPage = Auth(PDTReport, [roleConstants.ADMIN, roleConstants.STAFF]);
const FilingPlansReportPage = Auth(FilingPlansReport, [roleConstants.ADMIN, roleConstants.STAFF]);
const ConsolidatedSalesReportPage = Auth(ConsolidatedSalesReport, [roleConstants.ADMIN, roleConstants.STAFF]);
const AdminSettingsPage = Auth(AdminSettings, [roleConstants.ADMIN, roleConstants.STAFF]);



const NotFoundRedirect = () => <Redirect to='/error-404' />

class App extends Component {
  render() {
    return (
      <div className="gx-main-content-wrapper">
        <Switch>
          <Route exact path='/change-password' component={ChangePasswordPage} />
          <Route exact path='/admin/dashboard' component={AdminDashboardPage} />
          <Route exact path='/admin/partner-list' component={PartnerListNewPage} />
          <Route exact path='/admin/edit-partner/:id' component={AddPartnerPage} />
          <Route exact path='/admin/add-partner' component={AddPartnerPage} />
          <Route exact path='/admin/partner-performance' component={PartnerPerformancePage} />
          <Route exact path='/admin/product-list' component={ProductListPage} />
          <Route exact path='/admin/add-product' component={AddProductPage} />
          <Route exact path='/admin/edit-product/:product_id' component={AddProductPage} />
          <Route exact path='/admin/development-timeline/:id' component={DevelopmentTimelinePage} />
          <Route exact path='/admin/filing-plans/:id' component={FilingPlansPage} />
          <Route exact path='/admin/sales-report/:id' component={SalesReportPage} />
          <Route exact path='/admin/report/development-timeline' component={PDTReportPage} />
          <Route exact path='/admin/report/filing-plans' component={FilingPlansReportPage} />
          <Route exact path='/admin/report/sales-report' component={ConsolidatedSalesReportPage} />
          <Route exact path='/admin/profile' component={AdminProfilePage} />
          <Route exact path='/admin/settings' component={AdminSettingsPage} />


          <Route exact path='/partner/dashboard' component={PartnerDashboardPage} />
          <Route exact path='/partner/development-timeline' component={DevelopmentTimelinePage} />
          <Route exact path='/partner/filing-plans' component={FilingPlansPage} />
          <Route exact path='/partner/sales-report' component={SalesReportPage} />
          <Route exact path='/partner/profile' component={PartnerProfilePage} />


          <Route component={NotFoundRedirect} />
        </Switch>
      </div>
    )
  }
}


export default App;
