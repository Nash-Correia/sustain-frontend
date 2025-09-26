# core/urls.py
from django.urls import path
from .views import (
  CompanyListView, ReportListView, OwnedReportsView,
  ReportDownloadView, create_checkout, payment_webhook
)

urlpatterns = [
  path("companies/", CompanyListView.as_view()),
  path("reports/", ReportListView.as_view()),
  path("me/owned-reports/", OwnedReportsView.as_view()),
  path("reports/<int:pk>/download/", ReportDownloadView.as_view()),
  path("checkout/create/", create_checkout),
  path("payments/webhook/", payment_webhook),
]
