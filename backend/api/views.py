from rest_framework import permissions, viewsets

from .serializers import (
    UserSerializer,
)


class UserViewSet(viewsets.ModelViewSet):
    """
    API endpoint that allows users to be viewed or edited.
    """

    serializer_class = UserSerializer
    queryset = serializer_class.Meta.model.objects.all().order_by("-date_joined")
    permission_classes = [permissions.IsAuthenticated]
