from rest_framework import viewsets
from rest_framework import permissions, status
from rest_framework.authtoken.views import ObtainAuthToken
from rest_framework.authtoken.models import Token
from rest_framework.response import Response

from .serializers import (
    ProjectSerializer,
    RegisterUserSerializer,
    TimeRecordSerializer,
    UserSerializer,
)


class UserViewSet(viewsets.ModelViewSet):
    """
    API endpoint that allows users to be viewed or edited.
    """

    serializer_class = UserSerializer
    queryset = serializer_class.Meta.model.objects.all().order_by("-date_joined")
    permission_classes = [permissions.IsAuthenticated]


class RegisterUserAPIView(viewsets.generics.CreateAPIView):
    permission_classes = [permissions.AllowAny]
    serializer_class = RegisterUserSerializer

    def create(self, request, *args, **kwargs):
        serializer = self.serializer_class(data=request.data)
        serializer.is_valid(raise_exception=True)
        self.perform_create(serializer)

        token, created = Token.objects.get_or_create(user=serializer.instance)
        headers = self.get_success_headers(serializer.data)
        return Response(
            data={**serializer.data, "token": token.key},
            status=status.HTTP_201_CREATED,
            headers=headers,
        )


class CustomAuthToken(ObtainAuthToken):
    def post(self, request, *args, **kwargs):
        serializer = self.serializer_class(
            data=request.data, context={"request": request}
        )
        serializer.is_valid(raise_exception=True)
        user = serializer.validated_data["user"]
        token, created = Token.objects.get_or_create(user=user)
        return Response(
            {
                "email": user.email,
                "first_name": user.first_name,
                "last_name": user.last_name,
                "token": token.key,
            }
        )


class TimeRecordViewSet(viewsets.ModelViewSet):
    """
    API endpoint that allows time records to be viewed or edited.
    """

    serializer_class = TimeRecordSerializer
    queryset = serializer_class.Meta.model.objects.all().order_by("-id")
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        """
        This view should return a list of time tracked records based on the current user
        """
        filters = {"user": self.request.user}
        project = self.request.query_params.get("project")

        if project:
            filters["project"] = project

        return self.serializer_class.Meta.model.objects.filter(**filters)


class ProjectViewSet(viewsets.ModelViewSet):
    """
    API endpoint that allows projects to be viewed or edited.
    """

    serializer_class = ProjectSerializer
    queryset = serializer_class.Meta.model.objects.all()
    permission_classes = [permissions.IsAuthenticated]
