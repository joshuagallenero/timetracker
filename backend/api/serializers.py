from django.contrib.auth.models import User
from rest_framework import serializers


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ["id", "username", "email", "first_name", "last_name"]


class RegisterUserSerializer(serializers.ModelSerializer):
    email = serializers.EmailField()

    class Meta:
        model = User
        fields = [
            "id",
            "first_name",
            "last_name",
            "email",
            "password",
        ]
        extra_kwargs = {
            "password": {"write_only": True},
            "email": {"required": True},
            "first_name": {"required": True},
            "last_name": {"required": True},
        }

    def validate_email(self, value):
        lower_email = value.lower()
        if User.objects.filter(email__iexact=lower_email).exists():
            raise serializers.ValidationError("A user with that email already exists.")
        return lower_email

    def create(self, validated_data):
        email = validated_data.get("email")
        last_name = validated_data.get("last_name")
        first_name = validated_data.get("first_name")

        user = User(
            email=email,
            username=email,
            last_name=last_name,
            first_name=first_name,
        )
        user.set_password(validated_data["password"])
        user.save()

        return user
