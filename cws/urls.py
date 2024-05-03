from django.urls import path
from . import views


urlpatterns=[
    path('all',views.CwsListView.as_view(),name="get-cws"),
]