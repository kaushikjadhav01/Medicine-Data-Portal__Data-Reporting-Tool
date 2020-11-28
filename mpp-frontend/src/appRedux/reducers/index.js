import { combineReducers } from "redux";
import { connectRouter } from 'connected-react-router'
import Settings from "./Settings";
import Common from "./Common";
import Loader from "./Loader";
import AdminProducts from "./AdminProducts";
import AdminPartner from "./AdminPartner";
import PartnerDashboard from "./PartnerDashboard";
import ProductDevelopmentTimeline from "./ProductDevelopmentTimeline";
import FilingPlans from "./FilingPlans";
import SalesReport from "./SalesReport";
import UserAuthentication from "./UserAuthentication";
import AdminDashboard from "./AdminDashboard"

export default (history) => combineReducers({
  router: connectRouter(history),
  settings: Settings,
  commonData: Common,
  authentication: UserAuthentication,
  loader: Loader,
  adminProducts: AdminProducts,
  adminPartner: AdminPartner,
  partnerDashboard: PartnerDashboard,
  pdt: ProductDevelopmentTimeline,
  filingPlans: FilingPlans,
  salesReport: SalesReport,
  adminDashboard:AdminDashboard
});
