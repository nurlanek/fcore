from django.urls import path
from .views import login_view, dashboard_view, account_create_page
from django.shortcuts import render


urlpatterns = [
    path("register/", lambda r: render(r, "auth/register.html")),
    path("", login_view),
    path("dashboard/", dashboard_view),

    path("transactions/new/", lambda r: render(r, "transactions/new.html")),
    path("transactions/", lambda r: render(r, "transactions/list.html")),


    path("company/create/", lambda r: render(r, "company/create.html")),
    path("company/settings/", lambda r: render(r, "company/settings.html")),
    path("companies/", lambda r: render(r, "company/list.html")),

    path("profile/settings/", lambda r: render(r, "profile/settings.html")),
    path("accounts/create/", account_create_page),

    path("reports/balance/", lambda r: render(r,"reports/balance.html")),
    path("reports/pl/", lambda r: render(r, "reports/pl.html")),
    path("reports/trial/", lambda r: render(r, "reports/trial_balance.html")),

    path("partners/", lambda r: render(r, "partners/list.html")),
    path("reasons/", lambda r: render(r, "partners/reasons.html")),
    path("partner-types/", lambda r: render(r, "partners/types.html")),

    path("admin/users/create/", lambda r: render(r, "admin/create_user.html")),
    path("admin/users/", lambda r: render(r,"admin/users.html")),
    path("accounts/", lambda r: render(r, "accounts/list.html")),




]
