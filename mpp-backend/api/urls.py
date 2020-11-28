from django.urls import path, include
from rest_framework.routers import DefaultRouter
from rest_framework_simplejwt import views as jwt_views
from .namespaces.account.login import MyTokenObtainPairView

#Clock
from api.namespaces.clock import Clock

#Account Namespaces
from .namespaces.account.update import UpdateUserPasswordViewSet

account = DefaultRouter()
account.register('update_password', UpdateUserPasswordViewSet, basename='update_password')

#Admin Namespaces
from .namespaces.admin.partner import PartnerViewSet,CountryListView
from .namespaces.admin.product import ProductViewSet
from .namespaces.admin.pdt import PDTAdminView, PDTDecisionViewset, PDTInboxAdmin
from .namespaces.admin.sales import SalesReportAdminView, SalesReportDecisionViewset, SalesReportInboxAdmin, ProductVerificationAdminView, ProductDetailView
from .namespaces.admin.filing import FillingAdminView, FilingPlanDecisionViewset, FilingPlanInboxAdmin

from .namespaces.admin.report import PDTReportView,FilingReportView, ConsolidatedSalesReportView
from .namespaces.admin.report_download import PDTDownloadReportView,FilingDownloadReportView, SalesDownloadReportView

from .namespaces.admin.reminder_mail import ReminderMailView,BulkReminderMailView


from .namespaces.admin.dashboard.sales import AdminDashboardSales
# , SalesByYearByCompanyView, SalesByYearByCountryView
from .namespaces.admin.dashboard.project import AdminDashboardProject,AdminDashboardProjectDetail
from .namespaces.admin.dashboard.product import (
    AdminDashboardProductCompany,
    AdminDashboardProductCompanyDetail,
    AdminDashboardProductCountry,
    AdminDashboardProductCountryDetail,
    AdminDashboardProductCountryQuarter,
    AdminDashboardProductCountryQuarterDetail
)
from .namespaces.admin.dashboard.company import AdminDashboardCompany,AdminDashboardCompanyDetail

from .namespaces.admin.dashboard.country import AdminDashboardCountry, AdminDashboardCountryPartnerDetail

from .namespaces.admin.dashboard.sales import AdminDashboardSales

from .namespaces.admin.dashboard.admin_dash import AdminDashboard
from .namespaces.admin.dashboard.partner_dash import PartnerDashboard

from .namespaces.admin.cut_off_date import CutOffDateView


admin = DefaultRouter()
admin.register('partner', PartnerViewSet, basename='partner')
admin.register('product', ProductViewSet, basename='product')

#User Namespace
from .namespaces.user.pdt import PDTView, PDTSubmissionViewset
from .namespaces.user.pdt import PDTView, PDTSubmissionViewset, PDTInboxPartner
from .namespaces.user.sales import SalesReportView, SalesReportSubmissionViewset, SalesReportInboxPartner
from .namespaces.user.filing import FillingView, FilingPlanSubmissionViewset, FilingPlanInboxPartner

template = DefaultRouter()
template.register('pdt/message', PDTDecisionViewset, basename='pdt/message')
template.register('pdt/submit', PDTSubmissionViewset, basename='pdt/submit')
template.register('sales/message', SalesReportDecisionViewset, basename='sales/message')
template.register('sales/submit', SalesReportSubmissionViewset, basename='sales/submit')
template.register('filing/message', FilingPlanDecisionViewset, basename='filing/message')
template.register('filing/submit', FilingPlanSubmissionViewset, basename='filing/submit')


#Sentry Error Path
def trigger_error(request):
    division_by_zero = 1 / 0

#Swagger Doc
from drf_yasg.views import get_schema_view
from drf_yasg import openapi
from django.conf.urls import url

schema_view = get_schema_view(
   openapi.Info(
      title="Snippets API",
      default_version='v1',
      description="Test description",
      terms_of_service="https://www.google.com/policies/terms/",
      contact=openapi.Contact(email="contact@snippets.local"),
      license=openapi.License(name="BSD License"),
   ),
   public=True,
)

#URL Patterns
urlpatterns = [

    #Swagger
    url(r'^swagger(?P<format>\.json|\.yaml)$', schema_view.without_ui(cache_timeout=0), name='schema-json'),
    url(r'^swagger/$', schema_view.with_ui('swagger', cache_timeout=0), name='schema-swagger-ui'),
    url(r'^redoc/$', schema_view.with_ui('redoc', cache_timeout=0), name='schema-redoc'),

    #JWT
    path('login/', MyTokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('login/refresh/', jwt_views.TokenRefreshView.as_view(), name='token_refresh'),

    #PasswordReset
    path('password_reset/', include('django_rest_passwordreset.urls', namespace='password_reset')),

    #Clock
    path('clock/', Clock.as_view()),

    #Namespaces
    path('account/', include(account.urls)),
    path('admin/', include(admin.urls)),
    path('template/', include(template.urls)),
    
    path('template/reminder/',ReminderMailView.as_view()),
    path('template/bulkReminder/',BulkReminderMailView.as_view()),

    path('report/pdt/',PDTReportView.as_view()),
    path('report/pdt/download/',PDTDownloadReportView.as_view()),

    path('report/filing/',FilingReportView.as_view()),
    path('report/filing/download/',FilingDownloadReportView.as_view()),

    path('report/sales/<str:sales_report_type>',ConsolidatedSalesReportView.as_view()),
    path('report/sales/download/<str:sales_report_type>',SalesDownloadReportView.as_view()),

    path('template/pdt/',PDTView.as_view()),
    path('template/pdt/inbox/partner',PDTInboxPartner.as_view()),
    path('template/pdt/inbox/admin',PDTInboxAdmin.as_view()),
    path('template/pdt/<int:pk>/',PDTAdminView.as_view()),

    path('template/filing/',FillingView.as_view()),
    path('template/filing/<int:pk>/',FillingAdminView.as_view()),
    path('template/filing/inbox/partner', FilingPlanInboxPartner.as_view()),
    path('template/filing/inbox/admin', FilingPlanInboxAdmin.as_view()),
    
    path('template/sales/<str:sales_report_type>',SalesReportView.as_view()),
    path('template/sales/<str:sales_report_type>/<int:pk>',SalesReportAdminView.as_view()),
    path('template/sales/inbox/partner',SalesReportInboxPartner.as_view()),
    path('template/product_verification/<int:pk>',ProductVerificationAdminView.as_view()),
    
    path('admin/product_detail/',ProductDetailView.as_view()),

    path('admin/dashboard/project/',AdminDashboardProject.as_view()),
    path('admin/dashboard/project/detail/',AdminDashboardProjectDetail.as_view()),

    path('admin/dashboard/product/company/',AdminDashboardProductCompany.as_view()),
    path('admin/dashboard/product/company/detail/',AdminDashboardProductCompanyDetail.as_view()),
    path('admin/dashboard/product/country/',AdminDashboardProductCountry.as_view()),
    path('admin/dashboard/product/country/detail/',AdminDashboardProductCountryDetail.as_view()),
    path('admin/dashboard/product/country/quarter/',AdminDashboardProductCountryQuarter.as_view()),
    path('admin/dashboard/product/country/quarter/detail/',AdminDashboardProductCountryQuarterDetail.as_view()),
    
    path('admin/dashboard/company/',AdminDashboardCompany.as_view()),
    path('admin/dashboard/company/detail/',AdminDashboardCompanyDetail.as_view()),

    path('admin/dashboard/country/',AdminDashboardCountry.as_view()),
    path('admin/dashboard/country/detail/',AdminDashboardCountryPartnerDetail.as_view()),
    # path('admin/dashboard/company/',AdminDashboardCompany.as_view()),

    # path('admin/dashboard/country/product/status/',AdminDashboardCountryProductStatus.as_view()),

    path('template/sales/inbox/admin',SalesReportInboxAdmin.as_view()),

    path('admin/dashboard/sales/',AdminDashboardSales.as_view()),
    # path('admin/dashboard/sales/product/country/',SalesByProductByCountryView.as_view()),
    # path('admin/dashboard/sales/product/year/',SalesByProductByYearView.as_view()),
    # path('admin/dashboard/sales/product/month/',SalesByProductByMonthView.as_view()),
    # path('admin/dashboard/sales/product/quarter/',SalesByProductByQuarterView.as_view()),

    # path('admin/dashboard/sales/company/product/',SalesByCompanyByProductView.as_view()),
    # path('admin/dashboard/sales/company/country/',SalesByCompanyByCountryView.as_view()),
    # path('admin/dashboard/sales/company/year/',SalesByCompanyByYearView.as_view()),
    # path('admin/dashboard/sales/company/month/',SalesByCompanyByMonthView.as_view()),
    # path('admin/dashboard/sales/company/quarter/',SalesByCompanyByQuarterView.as_view()),

    # path('admin/dashboard/sales/country/product/',SalesByCountryByProductView.as_view()),
    # path('admin/dashboard/sales/country/company/',SalesByCountryByCompanyView.as_view()),
    # path('admin/dashboard/sales/country/year/',SalesByCountryByYearView.as_view()),
    # path('admin/dashboard/sales/country/month/',SalesByCountryByMonthView.as_view()),
    # path('admin/dashboard/sales/country/quarter/',SalesByCountryByQuarterView.as_view()),

    # path('admin/dashboard/sales/year/product/',SalesByYearByProductView.as_view()),
    # path('admin/dashboard/sales/month/product/',SalesByMonthByProductView.as_view()),
    # path('admin/dashboard/sales/quarter/product/',SalesByQuarterByProductView.as_view()),

    # path('admin/dashboard/sales/year/company/',SalesByYearByCompanyView.as_view()),
    # path('admin/dashboard/sales/month/company/',SalesByMonthByCompanyView.as_view()),
    # path('admin/dashboard/sales/quarter/company/',SalesByQuarterByCompanyView.as_view()),

    # path('admin/dashboard/sales/year/country/',SalesByYearByCountryView.as_view()),
    # path('admin/dashboard/sales/month/country/',SalesByMonthByCountryView.as_view()),
    # path('admin/dashboard/sales/quarter/country/',SalesByQuarterByCountryView.as_view()),

    # path('admin/dashboard/sales/price_per_pack/quarter/',PricePerPackByQuarterView.as_view()),
    # path('admin/dashboard/sales/price_per_pack/year/',PricePerPackByYearView.as_view()),
    # path('admin/dashboard/sales/price_per_pack/month/',PricePerPackByMonthView.as_view()),

    # path('admin/dashboard/sales/price_per_treatment/year/',PricePerTreatmentByYearView.as_view()),

    path('admin/dashboard/',AdminDashboard.as_view()), 
    path('admin/cut_off_date/',CutOffDateView.as_view()), 
    # path('admin/dashboard/not_submitted/',AdminDashboardNotAnySubmitted.as_view()), 
    # path('admin/dashboard/saved_not_submitted/',AdminDashboardSavedNotSubmitted.as_view()), 
    # path('admin/dashboard/submitted_not_approved/',AdminDashboardSubmittedNotApproved.as_view()), 
    path('partner/dashboard/',PartnerDashboard.as_view()),

    path('country_list/',CountryListView.as_view())
     
    #Sentry Testing
    #path('sentry-debug/', trigger_error),
]