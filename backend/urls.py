from django.urls import path
from . import views

urlpatterns = [
    path('', views.index, name='index'),
    # Add other paths as needed
]
# Path: views.py
