from django.urls import include, path
from rest_framework import routers

from . import views

router = routers.DefaultRouter()
router.register(r"users", views.UserViewSet)
router.register(r"time_records", views.TimeRecordViewSet)
router.register(r"projects", views.ProjectViewSet)

# Wire up our API using automatic URL routing.
# Additionally, we include login URLs for the browsable API.
urlpatterns = [
    path("", include(router.urls)),
    path("auth/login", views.CustomAuthToken.as_view(), name="login"),
    path("auth/register", views.RegisterUserAPIView.as_view(), name="register"),
    path("api-auth/", include("rest_framework.urls", namespace="rest_framework")),
]
