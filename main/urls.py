"""
URL configuration for main project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/5.0/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
# from django.contrib import admin
# from django.urls import path,include,re_path
# from .views import home
# from react.views import serve_react
# from django.conf import settings

# urlpatterns = [
#     path('admin/', admin.site.urls),
#     path('api/',include('api.urls')),
#     # path('',home,name="home"),
#     re_path(r"^(?P<path>.*)$", serve_react, {"document_root": settings.REACT_APP_BUILD_PATH}),
# ]



# from django.contrib import admin
# # from django.urls import path, re_path
# from django.conf import settings
# from api.views import CustomTokenObtainPairView
# from django.urls import path,include,re_path
# from transactions.views import process_daily_purchase_validation,RetrieveDailyPurchase
# from .views import *

# urlpatterns = [
#     path('admin/', admin.site.urls),
#     # path('',home_view),
#     path('api/',include('api.urls')),
#     path('api/daily-purchase-validation/', process_daily_purchase_validation, name='daily-purchase-validation'),
#     path('api/get-daily-purchase-validation/', RetrieveDailyPurchase.as_view(), name='get-daily-purchase-validation'),
#     re_path(r'^.*$', index),
# ]
# urlpatterns += [
#     path("azure-signin/", include("azure_signin.urls", namespace="azure_signin")),
# ]


from django.contrib import admin
from django.urls import path, include, re_path
from api.views import CustomTokenObtainPairView
from transactions.views import process_daily_purchase_validation, RetrieveDailyPurchase
from .views import *

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/', include('api.urls')),
    path('api/daily-purchase-validation/', process_daily_purchase_validation, name='daily-purchase-validation'),
    path('api/get-daily-purchase-validation/', RetrieveDailyPurchase.as_view(), name='get-daily-purchase-validation'),
    path('login/', start_authorization_flow, name='login'),
    path('callback/', callback, name='callback'),
]
