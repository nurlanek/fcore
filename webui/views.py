from django.shortcuts import render

def login_view(request):
    return render(request, "auth/login.html")

def dashboard_view(request):
    return render(request, "dashboard/index.html")

def account_create_page(request):
    return render(request, "accounts/create.html")
